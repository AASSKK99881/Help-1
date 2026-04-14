import { User, Clock, Coins } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

// 定义组件接收的属性，确保包含所有原始字段
export interface TaskType {
  id: string;
  title: string;
  category: string;
  points: number;
  status: string;
  deadline: string;
  publisher: { name: string; avatar?: string };
  tags: string[];
}

interface TaskCardProps {
  task: TaskType;
  onNavigate: (id: string) => void;
}

export function TaskCard({ task, onNavigate }: TaskCardProps) {
  return (
    <Card 
      className="hover:shadow-md transition-all cursor-pointer border-none shadow-sm"
      onClick={() => onNavigate(task.id)}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-[#165DFF] border-[#165DFF] bg-blue-50">
                {task.category}
              </Badge>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                task.status === 'open' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
              }`}>
                {task.status === 'open' ? '招募中' : '进行中'}
              </span>
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-900 line-clamp-1">{task.title}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {task.publisher.name}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {task.deadline}
              </div>
            </div>
            {/* 完整保留原始标签逻辑 */}
            <div className="mt-4 flex flex-wrap gap-2">
              {task.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <div className="ml-6 text-right">
            <div className="flex flex-col items-end gap-3">
              <div className="flex items-center gap-1 text-[#FF7D00]">
                <Coins className="w-5 h-5" />
                <span className="text-2xl font-bold">{task.points}</span>
              </div>
              <Button 
                className="bg-[#165DFF] hover:bg-[#0E4FD4]"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(task.id);
                }}
              >
                接取任务
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}