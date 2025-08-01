import { Badge } from "@/components/ui/badge";
import { socials } from "@prexo/utils/constants";
import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="sticky z-[300] border-t-2 bg-secondary/30 backdrop-blur-lg px-4 md:px-14 overflow-hidden w-screen mt-20">
      <div className="absolute bottom-0 left-[-30%] right-0 top-[-30%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(211,211,211,0.15),rgba(255,255,255,0))] opacity-40" />
      <div className="flex flex-col items-start gap-2 sm:px-8 lg:px-20 py-8">
        <Link href="/" className="flex flex-row items-center gap-2">
          <Image
            src="/logo.png"
            alt="logo"
            width={30}
            height={30}
            className="rounded-md"
          />
          <p className="font-bold text-xl tracking-tighter">Prexo AI</p>
          <Badge variant={"outline"} className="px-2">
            v-0.1.6
          </Badge>
        </Link>
        <p className="text-muted-foreground text-sm max-w-lg">
          We&apos;re developing open-sourced AI agents tailored for sales and
          customer support. Feel free to give us a try!
        </p>

        <div className="flex flex-col">
          <p className="inline-flex text-secondary-foreground text-sm">
            A product by
            <Link
              href={socials.myX}
              target="_blank"
              rel="noreferrer"
              className="ml-1 text-muted-foreground underline cursor-pointer"
            >
              @SaidevDhal
            </Link>
          </p>
          <p className="inline-flex text-secondary-foreground text-sm">
            Made possible with
            <Link
              href={socials.github}
              className="ml-1 text-muted-foreground underline cursor-pointer"
            >
              our crazy contributors
            </Link>
          </p>
        </div>

        <div className="border-t w-full mt-10">
          <div className="grid grid-cols-3 md:grid-cols-4 my-5 gap-20">
            <div className="flex flex-col gap-3">
              <span className="font-semibold">Product</span>
              <Link
                href={socials.docs}
                className="text-muted-foreground hover:text-primary"
              >
                Docs
              </Link>
              <Link
                href={"/pricing"}
                className="text-muted-foreground hover:text-primary"
              >
                Pricing
              </Link>
              <Link
                href={"/auth"}
                className="text-muted-foreground hover:text-primary"
              >
                Try now!
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              <span className="font-semibold">Connect</span>
              <Link
                href={socials.x}
                className="text-muted-foreground hover:text-primary"
              >
                X (Twitter)
              </Link>
              <Link
                href={socials.discord}
                className="text-muted-foreground hover:text-primary"
              >
                Discord
              </Link>
              <Link
                href={"https://l.devwtf.in/wp"}
                className="text-muted-foreground hover:text-primary"
              >
                WhatsApp
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
