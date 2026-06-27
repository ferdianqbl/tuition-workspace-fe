import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUpsertTutorProfile } from "@/services/tutor/upsert.service";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const profileSchema = z.object({
  displayName: z
    .string()
    .min(1, { message: "Display Name is required" })
    .min(2, { message: "Display Name must be at least 2 characters" }),
  qualificationsInput: z.string(),
  experiencesInput: z.string(),
});

type ProfileValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  initialData?: {
    displayName?: string;
    qualifications?: string[];
    experiences?: string[];
  };
  onSuccess?: () => void;
}

export function ProfileForm({ initialData, onSuccess }: ProfileFormProps) {
  const upsertMutation = useUpsertTutorProfile({
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Profile saved successfully!");
        if (onSuccess) onSuccess();
      } else {
        toast.error(data.message || "Failed to save profile");
      }
    },
  });

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: "",
      qualificationsInput: "",
      experiencesInput: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        displayName: initialData.displayName || "",
        qualificationsInput: initialData.qualifications?.join(", ") || "",
        experiencesInput: initialData.experiences?.join("\n") || "",
      });
    }
  }, [initialData, form]);

  const onSubmit = (values: ProfileValues) => {
    const qualifications = values.qualificationsInput
      .split(",")
      .map((q) => q.trim())
      .filter(Boolean);

    const experiences = values.experiencesInput
      .split("\n")
      .map((e) => e.trim())
      .filter(Boolean);

    upsertMutation.mutate({
      displayName: values.displayName,
      qualifications,
      experiences,
    });
  };

  const isSaving = upsertMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="e.g. Teacher John, B.Sc"
                  className="rounded-xl bg-neutral-950 border-neutral-800 text-white placeholder-neutral-600 focus:border-indigo-500 focus:ring-indigo-500/20"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="qualificationsInput"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Academic Qualifications (Separate with commas)</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="e.g. Bachelor of Science NUS, Certified IB Tutor"
                  className="rounded-xl bg-neutral-950 border-neutral-800 text-white placeholder-neutral-600 focus:border-indigo-500 focus:ring-indigo-500/20"
                  {...field}
                />
              </FormControl>
              <span className="text-[10px] text-muted-foreground block">
                Example: B.Sc Chemistry NUS, Cambridge A-Level Teaching Certificate
              </span>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="experiencesInput"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teaching Experience (One per line)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g. 3 years teaching high school Mathematics&#10;Private tutoring for Cambridge IGCSE curriculum"
                  rows={5}
                  className="rounded-xl bg-neutral-950 border-neutral-800 text-white placeholder-neutral-600 focus:border-indigo-500 focus:ring-indigo-500/20"
                  {...field}
                />
              </FormControl>
              <span className="text-[10px] text-muted-foreground block">
                Enter your teaching experience. Press Enter to separate rows of experiences.
              </span>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-2 border-t border-neutral-800 flex justify-end">
          <Button
            type="submit"
            disabled={isSaving}
            className="rounded-xl text-xs font-bold px-6 bg-indigo-650 hover:bg-indigo-600 text-white border-none"
          >
            {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />}
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
