import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "./ui/button";
import { useApiKeyStore, useProjectsStore } from "@prexo/store";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useId, useState } from "react";
import { ChevronDownIcon, TriangleAlert } from "lucide-react";
import { useReadLocalStorage } from "usehooks-ts";
import { generateApiKeyName } from "@/lib/utils";
import ApiKeyInput from "./apikey.input";
import { useRouter } from "next/navigation";

const options = [
  {
    label: "In a Year",
    value: 365 * 24 * 60 * 60 * 1000, // 1 year from now
  },
  {
    label: "In a Month",
    value: 30 * 24 * 60 * 60 * 1000, // 1 month from now
  },
  {
    label: "In a Week",
    value: 7 * 24 * 60 * 60 * 1000, // 1 week from now
  },
  {
    label: "In a Day",
    value: 1 * 24 * 60 * 60 * 1000, // 1 day from now
  },
  {
    label: "In an Hour",
    value: 1 * 60 * 60 * 1000, // 1 hour from now
  },
  {
    label: "Never",
    value: null,
  },
];

const renderSkeletonRows = () => (
  <>
    {Array.from({ length: 7 }).map((_, index) => (
      <TableRow
        key={index}
        className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r"
      >
        <TableCell className="bg-muted/50 py-2 font-medium">
          <Skeleton className="h-4 w-20" />
        </TableCell>
        <TableCell className="py-2">
          <Skeleton className="h-4 w-32" />
        </TableCell>
      </TableRow>
    ))}
  </>
);

const API_ENDPOINT =
  process.env.NODE_ENV == "development"
    ? "http://localhost:3001/v1/api/new"
    : "https://api.prexoai.xyz/v1/api/new";

export default function ApiKeyTable() {
  const { key, removeKey } = useApiKeyStore();
  const { removeProject } = useProjectsStore();
  const router = useRouter();
  const id = useId();
  const [inputValue, setInputValue] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isOpen2, setIsOpen2] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<number | null>(
    options[0].value,
  );
  const selectedLabel =
    options.find((option) => option.value === selectedValue)?.label || "";
  const consoleId = useReadLocalStorage("@prexo-#consoleId");

  useEffect(() => {
    if (apiKey.length > 0 && !isOpen && !isOpen2) {
      router.refresh();
    }
  }, [apiKey.length, router, isOpen, isOpen2]);

  const handleCreateBtn = async () => {
    try {
      if (!consoleId) {
        alert("Project ID is missing.");
        return;
      }

      let name = inputValue.trim();
      if (!name) {
        name = generateApiKeyName();
      }

      let expires: number | undefined = undefined;
      if (selectedValue !== null) {
        expires = Date.now() + selectedValue;
      }

      const res = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          projectId: consoleId,
          expires,
        }),
        credentials: "include",
      });

      if (!res.ok) {
        console.error("Error while creating API Key!");
        return;
      }
      setIsOpen(false);
      setInputValue("");
      setSelectedValue(options[0].value);
      const data = await res.json();
      console.log(data);
      removeProject(consoleId as string);
      removeKey();
      setApiKey(data.apiKey!);
      setIsOpen2(true);
    } catch (err) {
      console.error(err);
    }
  };
  const ExpiresDropdown = () => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {selectedLabel}
            <ChevronDownIcon
              className="-me-1 opacity-60"
              size={16}
              aria-hidden="true"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {options.map((option) => (
            <DropdownMenuCheckboxItem
              key={option.label}
              checked={selectedValue === option.value}
              onCheckedChange={() => setSelectedValue(option.value)}
            >
              {option.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };
  return (
    <div className="min-w-xs md:min-w-xl">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant={"outline"} size={"sm"} className="w-full mb-5">
            Create API Key
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="sm:text-center">
              Create a new API Key
            </DialogTitle>
            <DialogDescription className="sm:text-center">
              Generate a new API key to access your project programmatically.
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-5">
            <div className="*:not-first:mt-2">
              <Label htmlFor={id}>Name (optional)</Label>
              <Input
                id={id}
                type="text"
                placeholder="Enter a name"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>

            <div className="*:not-first:mt-2">
              <Label htmlFor={id}>Expires In *</Label>
              <ExpiresDropdown />
            </div>

            <div className="rounded-md border border-amber-500/50 px-4 py-3 text-amber-600">
              <p className="text-sm">
                <TriangleAlert
                  className="me-3 -mt-0.5 inline-flex opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                New API key will replace & invalidate the old one.
              </p>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" className="flex-1">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="button"
                className="flex-1"
                onClick={handleCreateBtn}
              >
                Create
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isOpen2} onOpenChange={setIsOpen2}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="sm:text-center">
              API Key created!
            </DialogTitle>
            <DialogDescription className="sm:text-center">
              Your new API key is ready! Replace it with the old one.
            </DialogDescription>
          </DialogHeader>

          <ApiKeyInput apiKey={apiKey} />
        </DialogContent>
      </Dialog>

      <div className="bg-background overflow-hidden rounded-md border">
        <Table>
          <TableBody>
            {!key.id ? (
              renderSkeletonRows()
            ) : (
              <>
                <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                  <TableCell className="bg-muted/50 py-2 font-medium">
                    Name
                  </TableCell>
                  <TableCell className="py-2">{key.name}</TableCell>
                </TableRow>
                <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                  <TableCell className="bg-muted/50 py-2 font-medium">
                    Key
                  </TableCell>
                  <TableCell className="py-2">
                    {key.start + "********"}
                  </TableCell>
                </TableRow>
                <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                  <TableCell className="bg-muted/50 py-2 font-medium">
                    Created At
                  </TableCell>
                  <TableCell className="py-2">
                    {new Date(key.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>

                <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                  <TableCell className="bg-muted/50 py-2 font-medium">
                    Status
                  </TableCell>
                  <TableCell className="py-2">
                    {key.enabled ? "Active" : "InActive"}
                  </TableCell>
                </TableRow>
                <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                  <TableCell className="bg-muted/50 py-2 font-medium">
                    Credits
                  </TableCell>
                  <TableCell className="py-2">{key.remaining}</TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
