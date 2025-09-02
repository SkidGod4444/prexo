import { socials } from "@prexo/utils/constants";
import { cn } from "@/lib/utils";
import { AnimatedShinyText } from "../../animated-shiny-text";
import IconsVersionControl16 from "@/public/icons/QlementineIconsVersionControl16";
import { IconsEndArrowNotch } from "@/public/icons/IconsArrowBtn";
import Link from "next/link";

export function AnncBtn() {
  return (
    <div className="z-10 flex mb-10 items-center justify-center">
      <Link
        href={socials.npm}
        target="_blank"
        rel="noreferrer"
        className="w-full"
      >
        <div
          className={cn(
            "group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800",
          )}
        >
          <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400 gap-2">
            <IconsVersionControl16 />
            <span> Introducing @prexo/ai-chat-sdk</span>
            <IconsEndArrowNotch />
          </AnimatedShinyText>
        </div>
      </Link>
    </div>
  );
}
