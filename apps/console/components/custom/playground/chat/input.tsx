import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUpIcon } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useLocalStorage, useWindowSize } from "usehooks-ts";
import type { UseChatHelpers } from "@ai-sdk/react";
import { AnimatePresence, motion } from "framer-motion";
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";

export default function ChatInput({
  className,
  status,
  input,
  setInput,
  handleSubmit,
}: React.ComponentProps<"div"> & {
  className?: string;
  input: UseChatHelpers["input"];
  setInput: UseChatHelpers["setInput"];
  status: UseChatHelpers["status"];
  handleSubmit: UseChatHelpers["handleSubmit"];
}) {
  const [localStorageInput, setLocalStorageInput] = useLocalStorage(
    "input",
    "",
  );

  const { isAtBottom, scrollToBottom } = useScrollToBottom();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { width } = useWindowSize();

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight();
    }
  }, []);

  if (width && width > 768) {
    textareaRef.current?.focus();
  }

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`;
    }
  };
  const resetHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = "98px";
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      const domValue = textareaRef.current.value;
      // Prefer DOM value over localStorage to handle hydration
      const finalValue = domValue || localStorageInput || "";
      setInput(finalValue);
      adjustHeight();
    }
    // Only run once after hydration
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLocalStorageInput(input);
  }, [input, setLocalStorageInput]);

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    adjustHeight();
  };

  return (
    <div className="relative w-full flex flex-col gap-4">
      <AnimatePresence>
        {!isAtBottom && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute left-1/2 bottom-28 -translate-x-1/2 z-50"
          >
            <Button
              data-testid="scroll-to-bottom-button"
              className="rounded-full cursor-pointer border"
              size="icon"
              variant="secondary"
              onClick={(event) => {
                event.preventDefault();
                scrollToBottom();
              }}
            >
              <ArrowDown />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (status !== "ready") {
            toast.error("Please wait for the model to finish its response!");
          } else {
            handleSubmit();
            setInput("");
            resetHeight();
          }
        }}
      >
        <Textarea
          placeholder="Type your message..."
          className={cn(
            "w-full min-h-[24px] max-h-[calc(75dvh)] overflow-hidden resize-none rounded-2xl !text-base bg-muted pb-10 dark:border-zinc-700",
            className,
          )}
          rows={2}
          autoFocus
          onKeyDown={(event) => {
            if (
              event.key === "Enter" &&
              !event.shiftKey &&
              !event.nativeEvent.isComposing
            ) {
              event.preventDefault();
              if (status !== "ready") {
                toast.error(
                  "Please wait for the model to finish its response!",
                );
              } else {
                handleSubmit();
                setInput("");
                resetHeight();
              }
            }
          }}
          value={input}
          onChange={handleInput}
          ref={textareaRef}
        />

        <div className="absolute bottom-0 right-0 p-2 w-fit flex flex-row justify-end">
          <Button
            data-testid="send-button"
            className="rounded-full p-1.5 h-fit border dark:border-zinc-600"
            type="submit"
            disabled={input.length === 0}
          >
            <ArrowUpIcon size={14} />
          </Button>
        </div>
      </form>
    </div>
  );
}
