import { useState } from "react";
import { useRegister } from "@/services/auth/register.service";
import { EUserRole } from "@/types/user.type";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface RegisterFormProps {
  onRegisterSuccess: () => void;
}

export function RegisterForm({ onRegisterSuccess }: RegisterFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<EUserRole>(EUserRole.PARENT);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password || !name) {
      toast.warning("All fields are required");
      return;
    }

    registerMutation.mutate({
      username,
      password,
      name,
      role,
    });
  };

  const isPending = registerMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Full Name
        </label>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          required
        />
      </div>

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

      <div className="space-y-2">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
          Role
        </label>
        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant={role === EUserRole.PARENT ? "default" : "outline"}
            onClick={() => setRole(EUserRole.PARENT)}
            className="rounded-xl text-xs font-semibold"
          >
            Parent
          </Button>
          <Button
            type="button"
            variant={role === EUserRole.TUTOR ? "default" : "outline"}
            onClick={() => setRole(EUserRole.TUTOR)}
            className="rounded-xl text-xs font-semibold"
          >
            Tutor
          </Button>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full mt-2 rounded-xl text-xs font-bold transition-all shadow-lg"
      >
        {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />}
        Register
      </Button>
    </form>
  );
}
