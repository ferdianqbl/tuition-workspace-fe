import { LoadingScreen } from "@/components/shared/loading-screen";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetMe } from "@/services/auth/get-me.service";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoginForm } from "./components/login-form";
import { RegisterForm } from "./components/register-form";

export function AuthPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  const { data: meData, isLoading: isMeLoading } = useGetMe({
    retry: false,
  });

  useEffect(() => {
    if (meData?.success && meData?.data) {
      router.push("/dashboard");
    }
  }, [meData, router]);

  if (isMeLoading) {
    return <LoadingScreen fullHeight message="Verifying session..." />;
  }

  return (
    <div className="relative min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-[500px] pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-linear-to-tr from-primary/30 via-purple-500/10 to-transparent blur-3xl rounded-full" />
      </div>

      <div className="w-full max-w-md z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center gap-3 mb-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white via-neutral-200 to-neutral-400">
              Tuition Marketplace
            </h1>
            <p className="text-xs text-primary font-medium tracking-wider uppercase mt-0.5">
              Case Workspace Portal
            </p>
          </div>
        </div>

        {/* Shadcn Card and Tabs */}
        <Card className="border-border/45 bg-card/65 backdrop-blur-xl rounded-3xl shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-center text-white">
              Welcome
            </CardTitle>
            <CardDescription className="text-center text-xs">
              Sign in or register a new account to manage your tuition cases.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={(val) => setActiveTab(val as "login" | "register")}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 bg-neutral-950/80 border border-border/40 p-1 rounded-xl mb-6">
                <TabsTrigger
                  value="login"
                  className="text-xs font-semibold rounded-lg"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="text-xs font-semibold rounded-lg"
                >
                  Register
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-0">
                <LoginForm />
              </TabsContent>

              <TabsContent value="register" className="mt-0">
                <RegisterForm onRegisterSuccess={() => setActiveTab("login")} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
