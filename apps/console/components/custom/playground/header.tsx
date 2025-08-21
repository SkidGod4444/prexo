import { BotMessageSquareIcon, CodeXml, Settings2 } from "lucide-react";

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

export default function ChatHeader() {
  // Find the OpenAI OSS model id for default selection
  const openAiOssModel = AI_MODELS_FREE_TIER.find(
    (model) => model.id === "mistralai/mistral-small-3.2-24b-instruct:free"
  );
  const defaultModelId = openAiOssModel ? openAiOssModel.id : AI_MODELS_FREE_TIER[0].id;

  const [selectedModel, setSelectedModel] = useLocalStorage<AIModelsFreeTierId>("@prexo-#selectedAiModel", defaultModelId);

  return (
    <header className="mt-2 z-50">
      <div className="flex h-12 px-2 bg-sidebar rounded-2xl border-b items-center justify-between gap-4">
        {/* Left side */}
        <div>
          <Select
            value={selectedModel}
            onValueChange={(value: AIModelsFreeTierId) => setSelectedModel(value)}
            aria-label="Select AI model"
          >
            <SelectTrigger className="cursor-pointer [&>svg]:text-muted-foreground/80 **:data-desc:hidden [&>svg]:shrink-0">
              <BotMessageSquareIcon size={16} aria-hidden="true" />
              <SelectValue placeholder="Choose an AI model" />
            </SelectTrigger>
            <SelectContent className="mt-5 w-sm [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
              <SelectGroup>
                <SelectLabel className="ps-2">Available Models</SelectLabel>
                {AI_MODELS_FREE_TIER.map((model) => (
                  <SelectItem value={model.id} key={model.id} className="cursor-pointer">
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
