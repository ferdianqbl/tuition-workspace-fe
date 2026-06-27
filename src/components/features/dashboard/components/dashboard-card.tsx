import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface DashboardCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href?: string;
  buttonText: string;
  disabled?: boolean;
}

export function DashboardCard({
  title,
  description,
  icon: Icon,
  href,
  buttonText,
  disabled = false,
}: DashboardCardProps) {
  return (
    <Card className="border-border/40 bg-card/65 flex flex-col justify-between hover:border-neutral-700 transition-all rounded-2xl">
      <CardHeader className="pb-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 mb-3">
          <Icon className="w-5 h-5 text-indigo-400" />
        </div>
        <CardTitle className="text-base font-bold text-white">
          {title}
        </CardTitle>
        <CardDescription className="text-xs text-neutral-400 leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {disabled ? (
          <Button
            disabled
            variant="outline"
            className="w-full rounded-xl text-xs font-bold"
          >
            {buttonText}
          </Button>
        ) : href ? (
          <Button
            asChild
            variant="outline"
            className="w-full rounded-xl text-xs font-bold"
          >
            <Link href={href}>{buttonText}</Link>
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
