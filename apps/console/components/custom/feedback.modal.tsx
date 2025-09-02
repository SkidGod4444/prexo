"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Profanity } from "profanity-validator";
import { Frown, Meh, PenLine, Smile } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { feedbacksLogger } from "@prexo/logs";
import { useMyProfileStore } from "@prexo/store";

const profanity = new Profanity({
  customWords: ["Saidev", "Saidev Dhal"],
  heat: 0.9,
});

const profanityCheck = async (value: string) => {
  const result = await profanity.validateField(value);
  return result.isValid;
};

const postSchema = z.object({
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .refine(async (val) => await profanityCheck(val), {
      message: "Inappropriate content detected in description",
    }),
});
type PostSchema = z.infer<typeof postSchema>;

export function FeedbackModal() {
  const [selectedEmo, setSelectedEmo] = useState<"happy" | "idle" | "sad">(
    "happy",
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { myProfile } = useMyProfileStore();

  const form = useForm<PostSchema>({
    resolver: zodResolver(postSchema),
  });

  const onSubmit: SubmitHandler<PostSchema> = async (data) => {
    setIsLoading(true);
    try {
      const validatedData = await postSchema.parseAsync({ ...data });
      console.log(validatedData);
      await feedbacksLogger({
        content: validatedData.description,
        emo: selectedEmo,
        userId: myProfile?.id as string,
        userName: myProfile?.name as string,
        color:
          selectedEmo === "happy"
            ? "#22c55e" // green
            : selectedEmo === "idle"
              ? "#fbbf24" // yellow
              : "#ef4444", // red
      });
      setIsLoading(false);
      setIsOpen(false);
    } catch (error) {
      setIsLoading(false);
      setIsOpen(false);
      console.error(error);
      toast.error(`Error in submiting feeback !Please try again `);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
      form.reset();
      toast.success(`Thanks for your feedback!`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size={"sm"}>
          <PenLine /> Feedback{" "}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[425px] md:min-w-[480px] border">
        <DialogHeader className="!text-start w-full">
          <DialogTitle className="text-2xl text-primary">
            Leave feedback
          </DialogTitle>
          <DialogDescription>
            We&apos;d love to hear what went well or how we can improve the
            product experience.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full max-w-md mx-auto"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Can you ..."
                      className="border min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-4">
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant={selectedEmo === "happy" ? "secondary" : "outline"}
                  className={`transition-all duration-200 ${selectedEmo === "happy" ? "border-primary border-[1px]" : ""}`}
                  onClick={() => setSelectedEmo("happy")}
                  type="button"
                >
                  <Smile className="text-green-500" />
                </Button>
                <Button
                  size="icon"
                  variant={selectedEmo === "idle" ? "secondary" : "outline"}
                  className={`transition-all duration-200 ${selectedEmo === "idle" ? "border-primary border-[1px]" : ""}`}
                  onClick={() => setSelectedEmo("idle")}
                  type="button"
                >
                  <Meh className="text-yellow-500" />
                </Button>
                <Button
                  size="icon"
                  variant={selectedEmo === "sad" ? "secondary" : "outline"}
                  className={`transition-all duration-200 ${selectedEmo === "sad" ? "border-primary border-[1px]" : ""}`}
                  onClick={() => setSelectedEmo("sad")}
                  type="button"
                >
                  <Frown className="text-red-500" />
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full">
              {form.formState.isSubmitting || isLoading
                ? "Submitting..."
                : "Submit"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
