import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUpdateCase } from "@/services/case/update.service";
import { ECaseStatus } from "@/types/case.type";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const editCaseSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Case Title is required" })
    .min(5, { message: "Case Title must be at least 5 characters" }),
  subject: z
    .string()
    .min(1, { message: "Subject is required" }),
  level: z
    .string()
    .min(1, { message: "Education Level is required" }),
  location: z
    .string()
    .min(1, { message: "Location is required" }),
  status: z.nativeEnum(ECaseStatus),
  budgetPerHour: z
    .number({ message: "Budget must be a positive number" })
    .positive({ message: "Budget must be a positive number greater than 0" }),
});

type EditCaseValues = z.infer<typeof editCaseSchema>;

interface EditCaseDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  tcase: {
    id: string;
    title: string;
    subject: string;
    level: string;
    location: string;
    budgetPerHour: number;
    status: ECaseStatus;
  };
}

export function EditCaseDialog({ isOpen, onOpenChange, onSuccess, tcase }: EditCaseDialogProps) {
  const updateCaseMutation = useUpdateCase({
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Tuition case successfully updated!");
        onOpenChange(false);
        onSuccess();
      } else {
        toast.error(data.message || "Failed to update case");
      }
    },
  });

  const form = useForm<EditCaseValues>({
    resolver: zodResolver(editCaseSchema),
    defaultValues: {
      title: tcase.title,
      subject: tcase.subject,
      level: tcase.level,
      location: tcase.location,
      status: tcase.status,
      budgetPerHour: tcase.budgetPerHour,
    },
  });

  // Sync state if tcase or open state changes
  useEffect(() => {
    if (isOpen) {
      form.reset({
        title: tcase.title,
        subject: tcase.subject,
        level: tcase.level,
        location: tcase.location,
        status: tcase.status,
        budgetPerHour: tcase.budgetPerHour,
      });
    }
  }, [tcase, isOpen, form]);

  const onSubmit = (values: EditCaseValues) => {
    updateCaseMutation.mutate({
      id: tcase.id,
      payload: values,
    });
  };

  const isPending = updateCaseMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-neutral-900 border-neutral-800 text-white rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-white">Edit Tuition Case Details</DialogTitle>
          <DialogDescription className="text-xs text-neutral-400">
            Modify the fields below to update your private tuition offer.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
                    Case Title (e.g. Mathematics Grade 12 IB)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="e.g. Weekly P5 Mathematics tuition in Orchard"
                      className="rounded-xl bg-neutral-950 border-neutral-800 text-white placeholder-neutral-600 focus:border-indigo-500 focus:ring-indigo-500/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
                      Subject
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="e.g. Mathematics, Physics"
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
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
                      Education Level
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="e.g. Primary, Secondary, JC"
                        className="rounded-xl bg-neutral-950 border-neutral-800 text-white placeholder-neutral-600 focus:border-indigo-500 focus:ring-indigo-500/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
                      Tuition Location
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="e.g. Orchard Road (or Online)"
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
                      Status
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full bg-neutral-950/60 border border-neutral-800 rounded-xl px-3 text-xs text-white font-semibold uppercase tracking-wider h-10">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-neutral-950 border border-neutral-800 text-white rounded-xl">
                          <SelectItem value={ECaseStatus.OPEN}>OPEN</SelectItem>
                          <SelectItem value={ECaseStatus.MATCHED}>MATCHED</SelectItem>
                          <SelectItem value={ECaseStatus.CLOSED}>CLOSED</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="budgetPerHour"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
                    Budget per Hour
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="e.g. 80"
                        className="pl-8 rounded-xl bg-neutral-950 border-neutral-800 text-white placeholder-neutral-600 focus:border-indigo-500 focus:ring-indigo-500/20"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                      />
                      <span className="absolute left-3 top-2.5 text-xs font-semibold text-neutral-500">
                        $
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4 border-t border-neutral-800 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="rounded-xl text-xs font-bold bg-neutral-950 hover:bg-neutral-900 border-neutral-850"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="rounded-xl text-xs font-bold px-6 shadow-lg bg-indigo-650 hover:bg-indigo-600 text-white border-none"
              >
                {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
