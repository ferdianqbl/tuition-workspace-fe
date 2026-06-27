import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRegister } from "@/services/auth/register.service";
import { EUserRole } from "@/types/user.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const registerSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Full Name is required" })
    .min(2, { message: "Name must be at least 2 characters" }),
  username: z
    .string()
    .min(1, { message: "Username is required" })
    .min(3, { message: "Username must be at least 3 characters" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),
  role: z.nativeEnum(EUserRole),
});

type RegisterValues = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onRegisterSuccess: () => void;
}

export function RegisterForm({ onRegisterSuccess }: RegisterFormProps) {
  const registerMutation = useRegister({
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Registration successful! Please login.");
        onRegisterSuccess();
      } else {
        toast.error(data.message || "Registration failed");
      }
    },
  });

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      username: "",
      password: "",
      role: EUserRole.PARENT,
    },
  });

  const onSubmit = (values: RegisterValues) => {
    registerMutation.mutate(values);
  };

  const isPending = registerMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="John Doe"
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
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="username123"
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
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
          name="role"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Role</FormLabel>
              <FormControl>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant={
                      field.value === EUserRole.PARENT ? "default" : "outline"
                    }
                    onClick={() => field.onChange(EUserRole.PARENT)}
                    className={`rounded-xl text-xs font-semibold ${
                      field.value === EUserRole.PARENT
                        ? "bg-indigo-650 hover:bg-indigo-600 text-white border-none shadow-lg shadow-indigo-500/20"
                        : "bg-transparent text-neutral-400 border-neutral-800 hover:bg-neutral-900"
                    }`}
                  >
                    Parent
                  </Button>
                  <Button
                    type="button"
                    variant={
                      field.value === EUserRole.TUTOR ? "default" : "outline"
                    }
                    onClick={() => field.onChange(EUserRole.TUTOR)}
                    className={`rounded-xl text-xs font-semibold ${
                      field.value === EUserRole.TUTOR
                        ? "bg-indigo-650 hover:bg-indigo-600 text-white border-none shadow-lg shadow-indigo-500/20"
                        : "bg-transparent text-neutral-400 border-neutral-800 hover:bg-neutral-900"
                    }`}
                  >
                    Tutor
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isPending}
          className="w-full mt-2 rounded-xl text-xs font-bold transition-all shadow-lg bg-indigo-600 hover:bg-indigo-500 text-white border-none"
        >
          {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />}
          Register
        </Button>
      </form>
    </Form>
  );
}
