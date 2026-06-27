import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface NotFoundCardProps {
  title: string;
  description: string;
  icon?: LucideIcon;
}

export function NotFoundCard({
  title,
  description,
  icon: Icon,
}: NotFoundCardProps) {
  return (
    <Card className="border-border/40 bg-card/65 flex flex-col items-center justify-center p-16 text-center rounded-3xl">
      <CardContent className="flex flex-col items-center p-0">
        {Icon && <Icon className="w-10 h-10 text-neutral-600 mb-3" />}
        <h3 className="text-base font-bold text-white mb-1">{title}</h3>
        <p className="text-xs text-neutral-500 max-w-xs leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
