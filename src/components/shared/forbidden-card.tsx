import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface ForbiddenCardProps {
  message?: string;
}

export function ForbiddenCard({
  message = "Only users with the appropriate role are authorized to access this page.",
}: ForbiddenCardProps) {
  return (
    <Card className="border-border/40 bg-card/65 flex flex-col items-center justify-center p-12 text-center rounded-3xl min-h-[300px]">
      <CardContent className="flex flex-col items-center p-0">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20 mb-4">
          <AlertCircle className="w-6 h-6 text-rose-400" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">
          Access Denied (403 Forbidden)
        </h3>
        <p className="text-neutral-400 text-xs max-w-sm leading-relaxed">
          {message}
        </p>
      </CardContent>
    </Card>
  );
}
