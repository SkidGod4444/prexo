import { CodeXml, Settings2 } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AI_MODELS_FREE_TIER } from "@prexo/utils/constants";
import { useLocalStorage } from "usehooks-ts";
import { AIModelsFreeTierId } from "@prexo/types";
import { getIconSvgUrl } from "@/lib/icons";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ProviderLogo {
  provider: string;
  svgLogo: string | null;
}

export default function ChatHeader() {
  const [providerLogos, setProviderLogos] = useLocalStorage<ProviderLogo[]>(
    "@prexo-#providerLogos",
    [],
  );

  // Find the OpenAI OSS model id for default selection
  const openAiOssModel = AI_MODELS_FREE_TIER.find(
    (model) => model.id === "mistralai/mistral-small-3.2-24b-instruct:free",
  );

  const defaultModelId = openAiOssModel
    ? openAiOssModel.id
    : AI_MODELS_FREE_TIER[0].id;

  const [selectedModel, setSelectedModel] = useLocalStorage<AIModelsFreeTierId>(
    "@prexo-#selectedAiModel",
    defaultModelId,
  );
  const selectedModelData = AI_MODELS_FREE_TIER.find(
    (model) => model.id === selectedModel,
  );

  // Get unique providers and fetch their SVG logos
  useEffect(() => {
    const sleep = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    const fetchProviderLogos = async () => {
      // Check if logos are already stored in localStorage
      const storedLogos = localStorage.getItem("@prexo-#providerLogos");
      const storedTimestamp = localStorage.getItem(
        "@prexo-#providerLogosTimestamp",
      );

      // Check if stored data is less than 24 hours old
      const isStoredDataValid =
        storedLogos &&
        storedTimestamp &&
        Date.now() - parseInt(storedTimestamp) < 24 * 60 * 60 * 1000;

      if (isStoredDataValid) {
        try {
          const parsedLogos = JSON.parse(storedLogos);
          setProviderLogos(parsedLogos);
          return;
        } catch (error) {
          console.warn(
            "Failed to parse stored logos, fetching fresh data",
            error,
          );
        }
      }

      // Fetch fresh data if no valid stored data exists
      const uniqueProviders = [
        ...new Set(AI_MODELS_FREE_TIER.map((model) => model.provider)),
      ];

      const logos: ProviderLogo[] = [];
      for (const provider of uniqueProviders) {
        const svgLogo = await getIconSvgUrl(provider);
        logos.push({ provider, svgLogo });
        await sleep(1500); // Wait for 500ms after each fetch
      }

      // Store in localStorage with timestamp
      localStorage.setItem("@prexo-#providerLogos", JSON.stringify(logos));
      localStorage.setItem(
        "@prexo-#providerLogosTimestamp",
        Date.now().toString(),
      );

      setProviderLogos(logos);
    };

    fetchProviderLogos();
  }, [setProviderLogos]);

  return (
    <header className="mt-2 z-50">
      <div className="flex h-12 px-2 bg-sidebar rounded-2xl border-b items-center justify-between gap-4">
        {/* Left side */}
        <div>
          <Select
            value={selectedModel}
            onValueChange={(value: AIModelsFreeTierId) =>
              setSelectedModel(value)
            }
            aria-label="Select AI model"
          >
            <SelectTrigger className="cursor-pointer [&>svg]:text-muted-foreground/80 **:data-desc:hidden [&>svg]:shrink-0">
              <Avatar className="bg-white p-1 w-7 h-7">
                <AvatarImage
                  src={(() => {
                    const providerLogo = providerLogos.find(
                      (logo) => logo.provider === selectedModelData?.provider,
                    );
                    return providerLogo?.svgLogo || undefined;
                  })()}
                  alt="Provider logo"
                  className="object-contain"
                />
                <AvatarFallback>
                  {(() => {
                    const initial = selectedModelData?.name?.[0] ?? "A";
                    return <span className="font-bold text-lg">{initial}</span>;
                  })()}
                </AvatarFallback>
              </Avatar>
              <SelectValue placeholder="Choose an AI model" />
            </SelectTrigger>
            <SelectContent className="mt-5 w-sm [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
              <SelectGroup>
                <SelectLabel className="ps-2">Available Models</SelectLabel>
                {AI_MODELS_FREE_TIER.map((model) => (
                  <SelectItem
                    value={model.id}
                    key={model.id}
                    className="cursor-pointer"
                  >
                    <div>
                      <div>{model.name}</div>
                      <span
                        className="text-muted-foreground mt-1 block text-xs"
                        data-desc
                      >
                        {model.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Right side: Actions */}
        <div className="flex items-center justify-end gap-2">
          {/* Layout button */}
          <Button size="icon" variant="outline" aria-label="Temporary chat">
            <Settings2 size={16} aria-hidden="true" />
          </Button>
          <Button size="icon" variant="outline" aria-label="Temporary chat">
            <CodeXml size={16} aria-hidden="true" />
          </Button>
        </div>
      </div>
    </header>
  );
}
