// src/app/components/TaskStatusBadge.tsx
import { Badge } from "./ui/badge";

interface TaskStatusBadgeProps {
  status: string;
}

export function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
  const getStatusStyle = () => {
    switch (status) {
      case '待接取': 
        return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100';
      case '进行中': 
        return 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100';
      case '已完成': 
        return 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100';
      default: 
        return 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100';
    }
  };

  return (
    <Badge variant="outline" className={getStatusStyle()}>
      {status}
    </Badge>
  );
}