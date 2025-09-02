import React, { useState, useRef, useEffect, useCallback } from "react";
import SectionLabel from "../section.label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  ChevronDownIcon,
  DatabaseBackup,
  DatabaseZap,
  CircleQuestionMark,
  Logs,
  Eye,
  EyeOff,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEnvsStore, useMyProfileStore } from "@prexo/store";
import { EnvType } from "@prexo/types";
import { encrypt, decrypt, getHashKey } from "@prexo/crypt";
import { useReadLocalStorage } from "usehooks-ts";
import { toast } from "sonner";

interface EncryptedData {
  initialVector: string;
  encrypted: string;
}

function isEncryptedData(val: unknown): val is EncryptedData {
  return (
    typeof val === "object" &&
    val !== null &&
    "initialVector" in val &&
    "encrypted" in val
  );
}

export default function EnvKeysSettings() {
  const { myProfile } = useMyProfileStore();
  const consoleId = useReadLocalStorage("@prexo-#consoleId");
  const hashKey = getHashKey(myProfile?.hashKey ?? "");

  const [selectedDB, setSelectedDB] = useState<"redis" | "vector">("redis");

  const dbOptions = [
    {
      key: "redis",
      icon: DatabaseBackup,
      label: "Upstash Redis",
      desc: "Redis database for chat history",
    },
    {
      key: "vector",
      icon: DatabaseZap,
      label: "Upstash Vector",
      desc: "Vector database for AI context",
    },
  ];

  const key1 =
    selectedDB === "redis"
      ? "UPSTASH_REDIS_REST_URL"
      : "UPSTASH_VECTOR_REST_URL";
  const key2 =
    selectedDB === "redis"
      ? "UPSTASH_REDIS_REST_TOKEN"
      : "UPSTASH_VECTOR_REST_TOKEN";

  const { envs } = useEnvsStore();

  // --- New model: keep raw strings for the inputs and (optional) existing encrypted values ---
  const [existingEnc1, setExistingEnc1] = useState<EncryptedData | null>(null);
  const [existingEnc2, setExistingEnc2] = useState<EncryptedData | null>(null);
  const [rawValue1, setRawValue1] = useState<string>("");
  const [rawValue2, setRawValue2] = useState<string>("");
  const [dirty1, setDirty1] = useState<boolean>(false);
  const [dirty2, setDirty2] = useState<boolean>(false);

  // Show/hide states
  const [showValue1, setShowValue1] = useState(false);
  const [showValue2, setShowValue2] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const ENVS_API_ENDPOINT =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3001/v1/envs"
      : "https://api.prexoai.xyz/v1/envs";

  // Load envs from store whenever envs or selectedDB keys change
  useEffect(() => {
    if (Array.isArray(envs)) {
      const found1 = envs.find((env: EnvType) => env.name === key1);
      const found2 = envs.find((env: EnvType) => env.name === key2);

      const v1 = found1?.value as unknown;
      const v2 = found2?.value as unknown;

      if (isEncryptedData(v1)) {
        setExistingEnc1(v1);
        setRawValue1("");
      } else if (typeof v1 === "string" && v1) {
        setExistingEnc1(null);
        setRawValue1(v1);
      } else {
        setExistingEnc1(null);
        setRawValue1("");
      }

      if (isEncryptedData(v2)) {
        setExistingEnc2(v2);
        setRawValue2("");
      } else if (typeof v2 === "string" && v2) {
        setExistingEnc2(null);
        setRawValue2(v2);
      } else {
        setExistingEnc2(null);
        setRawValue2("");
      }
    } else {
      setExistingEnc1(null);
      setExistingEnc2(null);
      setRawValue1("");
      setRawValue2("");
    }

    // Reset UI state when envs change
    setShowValue1(false);
    setShowValue2(false);
    setDirty1(false);
    setDirty2(false);
  }, [envs, key1, key2]);

  // Decrypt on demand when user reveals a masked value
  useEffect(() => {
    let ignore = false;
    (async () => {
      if (showValue1 && existingEnc1 && !rawValue1) {
        try {
          const plain = await decrypt(existingEnc1, hashKey);
          if (!ignore) {
            setRawValue1(plain);
            // not marking dirty here – just revealed
          }
        } catch {
          if (!ignore) setRawValue1("");
        }
      }
    })();
    return () => {
      ignore = true;
    };
  }, [showValue1, existingEnc1, rawValue1, hashKey]);

  useEffect(() => {
    let ignore = false;
    (async () => {
      if (showValue2 && existingEnc2 && !rawValue2) {
        try {
          const plain = await decrypt(existingEnc2, hashKey);
          if (!ignore) {
            setRawValue2(plain);
          }
        } catch {
          if (!ignore) setRawValue2("");
        }
      }
    })();
    return () => {
      ignore = true;
    };
  }, [showValue2, existingEnc2, rawValue2, hashKey]);

  // Save handler – keeps existing ciphertext if input wasn't changed
  const handleOnSave = useCallback(async () => {
    setIsLoading(true);
    try {
      // Resolve value1
      let value1: EncryptedData | null = null;
      if (dirty1) {
        const trimmed = rawValue1.trim();
        if (!trimmed) throw new Error(`${key1} cannot be empty`);
        value1 = await encrypt(trimmed, hashKey);
      } else if (existingEnc1) {
        value1 = existingEnc1;
      } else if (rawValue1.trim()) {
        value1 = await encrypt(rawValue1.trim(), hashKey);
      } else {
        throw new Error(`${key1} is required`);
      }

      // Resolve value2
      let value2: EncryptedData | null = null;
      if (dirty2) {
        const trimmed = rawValue2.trim();
        if (!trimmed) throw new Error(`${key2} cannot be empty`);
        value2 = await encrypt(trimmed, hashKey);
      } else if (existingEnc2) {
        value2 = existingEnc2;
      } else if (rawValue2.trim()) {
        value2 = await encrypt(rawValue2.trim(), hashKey);
      } else {
        throw new Error(`${key2} is required`);
      }

      const url = `${ENVS_API_ENDPOINT}/create`;
      const payloads = [
        { name: key1, value: value1, projectId: consoleId },
        { name: key2, value: value2, projectId: consoleId },
      ];

      await toast.promise(
        (async () => {
          for (const body of payloads) {
            if (!body.projectId) throw new Error("Missing projectId");
            const res = await fetch(url, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify(body),
            });
            if (!res.ok) {
              const err = await res.json().catch(() => ({}));
              throw new Error(
                err.message || "Failed to save environment variable",
              );
            }
          }
        })(),
        {
          loading: "Saving environment variables...",
          success: "Environment variables saved successfully!",
          error: (err: { message?: string }) =>
            err?.message || "Failed to save environment variables",
        },
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    dirty1,
    dirty2,
    rawValue1,
    rawValue2,
    existingEnc1,
    existingEnc2,
    hashKey,
    ENVS_API_ENDPOINT,
    key1,
    key2,
    consoleId,
  ]);

  // Dropdown for DB selection
  function DBDropdown() {
    const selected = dbOptions.find((opt) => opt.key === selectedDB);
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center justify-between w-full rounded-lg"
          >
            <span className="flex items-center gap-2 ">
              {selected ? (
                <selected.icon
                  size={18}
                  className="text-primary/80"
                  aria-hidden="true"
                />
              ) : (
                <Logs
                  size={18}
                  className="text-primary/80"
                  aria-hidden="true"
                />
              )}
              <span>{selected ? selected.label : "Choose Database"}</span>
            </span>
            <ChevronDownIcon
              className="ml-2 opacity-70"
              size={18}
              aria-hidden="true"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-full mt-2 rounded-xl shadow-lg border border-border bg-popover p-1"
          align="start"
        >
          {dbOptions.map((opt) => (
            <DropdownMenuItem
              key={opt.key}
              className={`flex items-center gap-3 px-3 py-2 my-0.5 rounded-md hover:bg-accent transition-colors cursor-pointer ${
                selectedDB === opt.key ? "bg-accent" : ""
              }`}
              onSelect={() => setSelectedDB(opt.key as "redis" | "vector")}
            >
              <opt.icon size={18} aria-hidden="true" />
              <div>
                <div className="font-semibold text-sm">{opt.label}</div>
                <div className="text-xs text-muted-foreground">{opt.desc}</div>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Input for sensitive values (refactored)
  function SensitiveInput({
    id,
    rawValue,
    setRawValue,
    show,
    setShow,
    placeholder,
    className,
    hasEncrypted,
    markDirty,
  }: {
    id: string;
    rawValue: string;
    setRawValue: (v: string) => void;
    show: boolean;
    setShow: (v: boolean) => void;
    placeholder?: string;
    className?: string;
    hasEncrypted: boolean; // there is an encrypted value in DB we haven't revealed/edited yet
    markDirty: () => void;
  }) {
    const inputRef = useRef<HTMLInputElement>(null);

    const masked = hasEncrypted && !show && !rawValue;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.value;
      // If user starts typing while masked, treat it as replacing the secret
      if (masked) {
        setShow(true);
      }
      setRawValue(next);
      markDirty();
    };

    const handleToggleShow = () => {
      const next = !show;
      setShow(next);
      setTimeout(() => {
        inputRef.current?.focus();
        if (inputRef.current) {
          const len = inputRef.current.value.length;
          inputRef.current.setSelectionRange(len, len);
        }
      }, 0);
    };

    return (
      <div className={`relative ${className ?? ""}`}>
        <Input
          id={id}
          ref={inputRef}
          type={show ? "text" : "password"}
          value={masked ? "••••••••••" : (rawValue ?? "")}
          onChange={handleChange}
          placeholder={placeholder}
          autoComplete="off"
          className="pr-10"
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={handleToggleShow}
          className="absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
          aria-label={show ? "Hide value" : "Show value"}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start justify-start h-full w-full overflow-hidden">
      <SectionLabel
        label="Environment Variables"
        msg="Manage your Environmental keys."
      />
      <Card className="w-full mt-5 p-0">
        <CardContent className="p-2">
          <Badge variant={"outline"} className="mb-2">
            Sensitive
          </Badge>
          <DBDropdown />
          <Separator className="my-4" />
          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex-1 flex-col">
              <Label htmlFor="env-key" className="mb-2">
                Key
              </Label>
              <Input id="env-key" value={key1} readOnly />
              <Input id="env-key2" value={key2} readOnly className="mt-2" />
            </div>
            <div className="flex-col flex-1">
              <Label htmlFor="env-value" className="mb-2">
                Value
              </Label>
              <SensitiveInput
                id="env-value"
                rawValue={rawValue1}
                setRawValue={setRawValue1}
                show={showValue1}
                setShow={setShowValue1}
                placeholder="Enter value"
                hasEncrypted={!!existingEnc1}
                markDirty={() => setDirty1(true)}
              />
              <SensitiveInput
                id="env-value2"
                rawValue={rawValue2}
                setRawValue={setRawValue2}
                show={showValue2}
                setShow={setShowValue2}
                placeholder="Enter key"
                className="mt-2"
                hasEncrypted={!!existingEnc2}
                markDirty={() => setDirty2(true)}
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between gap-2 border-t p-2">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size={"icon"}
                  variant={"outline"}
                  className="rounded-full"
                >
                  <CircleQuestionMark />
                </Button>
              </TooltipTrigger>
              <TooltipContent showArrow={true} className="w-40">
                <p>
                  Keep your environment keys secure and never share them
                  publicly.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button size={"sm"} onClick={handleOnSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
