import { useId, useState } from "react";
import { CheckIcon, RefreshCcwIcon, BadgeDollarSign } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useMyProfileStore } from "@prexo/store";
import { useRouter } from "next/navigation";
import { pricingModels } from "@prexo/utils/constants";

export default function PlansDialog() {
  const id = useId();
  const [value, setValue] = useState(pricingModels[0].productId);
  const { myProfile } = useMyProfileStore();
  const router = useRouter();
  const redirectUrl =
    process.env.NODE_ENV === "production"
      ? "https://prexoai.xyz/auth"
      : "http://localhost:3000/auth";

  const handleBtnClick = async (prodId: string) => {
    try {
      if (!myProfile?.id) {
        console.log("User is not authenticated, redirecting to auth page");
        router.push(`${redirectUrl}?redirect=/pricing`);
      }
      const checkoutLink = await getCheckoutLink([prodId]);
      if (checkoutLink) {
        router.push(checkoutLink);
      } else {
        console.error("Failed to get checkout link");
      }
    } catch (error) {
      console.error("Error handling button:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="px-0">
        <Button className="mx-2 my-1 w-[calc(100%-1rem)]">
          <BadgeDollarSign className="text-muted-foreground" />
          Upgrade
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="mb-2 flex flex-col gap-2">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <RefreshCcwIcon className="opacity-80" size={16} />
          </div>
          <DialogHeader>
            <DialogTitle className="text-left">Change your plan</DialogTitle>
            <DialogDescription className="text-left">
              Pick one of the following plans.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form className="space-y-5">
          <RadioGroup
            className="gap-2"
            defaultValue={pricingModels[0].productId}
            onValueChange={(value) => setValue(value as string)}
            value={value}
          >
            {pricingModels.map((plan) => (
              <div
                key={plan.productId}
                className="border-input has-data-[state=checked]:border-primary/50 has-data-[state=checked]:bg-accent relative flex w-full items-center gap-2 rounded-md border px-4 py-3 shadow-xs outline-none"
              >
                <RadioGroupItem
                  value={plan.productId}
                  id={`${id}-${plan.productId}`}
                  aria-describedby={`${id}-${plan.productId}-description`}
                  className="order-1 after:absolute after:inset-0 cursor-pointer"
                />
                <div className="grid grow gap-1">
                  <Label htmlFor={`${id}-${plan.productId}`}>
                    {plan.label}
                  </Label>
                  <p
                    id={`${id}-${plan.productId}-description`}
                    className="text-muted-foreground text-xs"
                  >
                    ${plan.amount}/month
                  </p>
                </div>
              </div>
            ))}
          </RadioGroup>

          <div className="space-y-3">
            <p>
              <strong className="text-sm font-medium">Features include:</strong>
            </p>
            <ul className="text-muted-foreground space-y-2 text-sm">
              {pricingModels
                .find((plan) => plan.productId === value)
                ?.features.map((feature, i) => (
                  <li className="flex gap-2" key={i}>
                    <CheckIcon
                      size={16}
                      className="text-primary mt-0.5 shrink-0"
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
            </ul>
          </div>

          <div className="grid gap-2">
            <Button
              type="button"
              className="w-full"
              disabled={value === pricingModels[0].productId}
              onClick={() => handleBtnClick(value)}
            >
              Change plan
            </Button>
            <DialogClose>
              <Button type="button" variant="outline" className="w-full">
                Cancel
              </Button>
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
