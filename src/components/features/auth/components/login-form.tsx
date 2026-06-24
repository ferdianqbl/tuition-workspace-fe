import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/services/auth/login.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useLogin({
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Login successful! Redirecting...");
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 1000);
      } else {
        toast.error(data.message || "Login failed");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      toast.warning("Username and password are required");
      return;
    }

    loginMutation.mutate({ username, password });
  };

  const isPending = loginMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Username
        </label>
        <Input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="username123"
          required
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Password
        </label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full mt-2 rounded-xl text-xs font-bold transition-all shadow-lg"
      >
        {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />}
        Login
      </Button>
    </form>
  );
}
