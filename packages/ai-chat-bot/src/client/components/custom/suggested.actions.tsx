"use client";

import { memo } from "react";
import { DEFAULT_MSG_ID } from "../../../../src/lib/constants";
import { Button } from "../../components/ui/button";
import type {
  BaseMessageHistory,
  SuggestedActionsT,
} from "../../../../src/lib/types";
import { motion } from "framer-motion";

interface SuggestedActionsProps {
  append: (content: string) => Promise<void>;
  suggestedActions: SuggestedActionsT[];
  sessionId?: string;
  sessionTTL?: number;
  history?: BaseMessageHistory;
}

function PureSuggestedActions({
  append,
  suggestedActions,
  sessionId,
  sessionTTL,
  history,
}: SuggestedActionsProps) {
  return (
    <div
      data-testid="suggested-actions"
      className="grid grid-row-3 gap-2 w-full"
    >
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ delay: 0.3 * index + 1 }}
          key={`suggested-action-${suggestedAction.label}-${index}`}
          className="block"
        >
          <Button
            variant="secondary"
            onClick={async () => {
              append(suggestedAction.action);
              if (history) {
                await history.addMessage({
                  message: {
                    id: DEFAULT_MSG_ID,
                    role: "user",
                    content: suggestedAction.action,
                  },
                  sessionId: sessionId!,
                  sessionTTL: sessionTTL!,
                });
              }
            }}
            className="text-left border rounded-xl px-3 py-2 text-sm gap-1 flex flex-col w-auto h-auto justify-start items-start cursor-pointer ml-auto
              "
            style={{
              minHeight: "24px",
              wordBreak: "break-word",
            }}
          >
            <span className="suggested-action-label">
              {suggestedAction.label}
            </span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

// Only re-render if the append prop changes (reference equality)
export const SuggestedActions = memo(
  PureSuggestedActions,
  (prevProps, nextProps) => prevProps.append === nextProps.append,
);
