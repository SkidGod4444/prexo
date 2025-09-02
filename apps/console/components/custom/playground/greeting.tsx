import { motion } from "framer-motion";
import { useMyProfileStore } from "@prexo/store";
import Logo from "../logo";
import { cn, sanitizeText } from "@/lib/utils";
import { Markdown } from "./markdown";

export const GreetingMsg = () => {
  const { myProfile } = useMyProfileStore();

  return (
    <motion.div
      key="overview"
      className="max-w-3xl mx-auto px-4 size-full flex flex-col justify-center"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className="flex items-center gap-3"
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
      >
        <motion.div
          className="size-8 flex items-center rounded-full justify-center shrink-0"
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: 0.4,
            duration: 0.4,
            type: "spring",
            stiffness: 200,
          }}
        >
          <Logo isTextVisible={false} />
        </motion.div>
        <motion.div
          key={myProfile?.id}
          className="flex flex-row gap-2 items-start"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4, ease: "easeOut" }}
        >
          <motion.div
            data-testid="message-content"
            className={cn(
              "flex flex-col gap-4 bg-primary text-primary-foreground px-3 py-2 rounded-xl",
            )}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.3, ease: "easeOut" }}
          >
            <Markdown>{sanitizeText("Wanna try playground?")}</Markdown>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
