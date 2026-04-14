// src/app/components/PointsBadge.tsx
import { Badge } from "./ui/badge";

interface PointsBadgeProps {
  points: number;
  className?: string;
}

export function PointsBadge({ points, className = "" }: PointsBadgeProps) {
  return (
    <Badge variant="secondary" className={`bg-yellow-100 text-yellow-800 hover:bg-yellow-200 shrink-0 ${className}`}>
      🪙 {points} 积分
    </Badge>
  );
}