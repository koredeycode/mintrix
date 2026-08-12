import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Circle, Flame, Shield, Sparkles } from "lucide-react";

export type RarityTier = "legendary" | "epic" | "rare" | "common";

export function getRarityTier(percentage: number): RarityTier {
  if (percentage < 5) return "legendary";
  if (percentage < 15) return "epic";
  if (percentage < 35) return "rare";
  return "common";
}

interface RarityBadgeProps {
  percentage: number;
  showIcon?: boolean;
  className?: string;
}

export function RarityBadge({ percentage, showIcon = true, className }: RarityBadgeProps) {
  const tier = getRarityTier(percentage);

  const icons: Record<RarityTier, React.ReactNode> = {
    legendary: <Sparkles className="w-3 h-3 text-amber-500" />,
    epic: <Flame className="w-3 h-3 text-purple-500" />,
    rare: <Shield className="w-3 h-3 text-indigo-500" />,
    common: <Circle className="w-2.5 h-2.5 text-slate-400" />,
  };

  const labels: Record<RarityTier, string> = {
    legendary: "Legendary",
    epic: "Epic",
    rare: "Rare",
    common: "Common",
  };

  return (
    <Badge
      variant={tier}
      className={cn("font-mono font-bold tracking-tight", className)}
      title={`${labels[tier]} tier (${percentage}% total rarity weight)`}
    >
      {showIcon && icons[tier]}
      <span>{labels[tier]}</span>
      <span className="opacity-75">({percentage}%)</span>
    </Badge>
  );
}

