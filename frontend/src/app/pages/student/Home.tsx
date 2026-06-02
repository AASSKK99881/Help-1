import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Search, Volume2, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { TaskCard } from "../../components/TaskCard";
import { tasksApi, Task } from "../../api/tasks";

const Announcements = [
  "💡 发布任务时描述越详细，越容易被接取哦~",
  "🌟 完成任务可获得悬赏积分，积分可用于发布新需求",
  "🤝 互助互惠，共建和谐校园社区"
];

const categories = ['全部', '学习辅导', '技术开发', '设计美化', '生活帮助'];

export function StudentHome() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    tasksApi.getTasks({
      keyword: searchQuery || undefined,
      category: selectedCategory !== '全部' ? selectedCategory : undefined
    }).then(res => {
      if (res && res.data) {
        setTasks(res.data.list || []);
      }
    }).catch(err => {
      console.error("加载任务列表失败", err);
    }).finally(() => setLoading(false));
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAnnouncementIndex((prev) => (prev + 1) % Announcements.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const statusLabel = (s: number) => {
    switch(s) {
      case 0: return '待审核';
      case 1: return '待接单';
      case 2: return '进行中';
      case 3: return '已完成';
      case 4: return '已取消';
      default: return '未知';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center gap-3 overflow-hidden">
        <Volume2 className="w-5 h-5 text-[#165DFF] shrink-0" />
        <div className="flex-1 relative h-6">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentAnnouncementIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="text-sm text-blue-900 absolute w-full truncate font-medium"
            >
              {Announcements[currentAnnouncementIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="搜索你感兴趣的任务..."
            className="pl-10 h-10 border-gray-200 focus:border-[#165DFF] transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Select defaultValue="newest">
            <SelectTrigger className="w-full md:w-[160px] h-10">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              <SelectValue placeholder="排序方式" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">最新发布</SelectItem>
              <SelectItem value="points">最高积分</SelectItem>
              <SelectItem value="deadline">即将到期</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => navigate('/create-task')} className="bg-[#165DFF] hover:bg-[#0E4FD4] whitespace-nowrap">
            发布需求
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
            className={`rounded-full px-6 h-9 transition-all ${
              selectedCategory === category
              ? "bg-[#165DFF] shadow-md shadow-blue-100 border-transparent"
              : "border-gray-200 text-gray-600 hover:border-[#165DFF] hover:text-[#165DFF]"
            }`}
          >
            {category}
          </Button>
        ))}
      </div>

      {loading ? (
        <Card><CardContent className="p-12 text-center text-gray-500">加载中...</CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              layout
            >
              <TaskCard
                task={{
                  id: String(task.id),
                  title: task.title,
                  description: task.description,
                  category: task.category || '其他',
                  points: task.pointsReward,
                  deadline: task.deadline || '',
                  publisher: { name: '用户' + task.publisherId, avatar: 'U' },
                  status: statusLabel(task.status),
                  tags: []
                }}
                onNavigate={(id) => navigate(`/task/${id}`)}
              />
            </motion.div>
          ))}
        </div>
      )}

      {!loading && tasks.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">暂无相关需求</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
