import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
  } from "@/components/ui/card";
  import CopyInput from "@/components/copy.input";
import { useLocalStorage } from 'usehooks-ts';
import type { UIMessage } from "ai";

type ApiKeyCardProps = {
    append: (message: UIMessage) => void;
    callId: string;
  };

export default function ApiKeyCardAiUi({
    append,
    callId,
  }: ApiKeyCardProps) {
    const [apiKey, setApiKey] = useLocalStorage("@prexo-#tempApiKey", '');
    
    const handleOnCopy = async () => {
        setApiKey('')
        append({
            id: `${callId}-${Date.now()}`,
            role: "user",
            content: "API Key copied successfully!",
            parts: [
              {
                type: "text",
                text: "API Key copied successfully!",
              },
            ],
          });
    }

  return (
      <Card className="w-full max-w-sm">
      <CardContent>
      <div className="flex flex-col gap-6">
          <CopyInput value={apiKey!} onCopy={handleOnCopy}/>
        </div>
      </CardContent>
      <CardFooter>
          <CardDescription>
            Copy your ApiKey and keep it safe. You will not be able to see it
            again.
          </CardDescription>
        </CardFooter>
    </Card>
  )
}
