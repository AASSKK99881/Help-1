// src/app/pages/student/Home.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Search, Volume2, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
// 引入封装组件
import { TaskCard } from "../../components/TaskCard";

// 公告内容
const Announcements = [
  "📢 系统维护通知：本周六凌晨2:00-4:00进行服务器升级",
  "🎉 恭喜“张三”同学本周获得100点互助积分，成为本周积分榜首！",
  "💡 小贴士：发布任务时描述越详细，越容易被接取哦~"
];

const categories = ['全部', '学习辅导', '技术开发', '设计美化', '生活帮助'];

// 原始模拟任务数据
const mockTasks = [
  {
    id: '1',
    title: '帮忙代取快递',
    description: '今天下午有课，快递到了但是取不了，需要帮忙代取一下放到宿舍楼下',
    category: '生活帮助',
    points: 20,
    deadline: '2026-03-17 18:00',
    publisher: { name: '李明', avatar: 'L' },
    status: 'open',
    tags: ['紧急', '快递']
  },
  {
    id: '2',
    title: '高数辅导',
    description: '微积分基础题目讲解，主要是关于极限和导数的部分',
    category: '学习辅导',
    points: 50,
    deadline: '2026-03-18 20:00',
    publisher: { name: '王芳', avatar: 'W' },
    status: 'open',
    tags: ['高数', '辅导']
  },
  {
    id: '3',
    title: 'Logo设计',
    description: '学生社团招新需要设计一个简单的Logo，有大致思路',
    category: '设计美化',
    points: 100,
    deadline: '2026-03-20 12:00',
    publisher: { name: '陈强', avatar: 'C' },
    status: 'in_progress',
    tags: ['设计', '社团']
  }
];

export function StudentHome() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
  const navigate = useNavigate();

  // 公告轮播逻辑
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAnnouncementIndex((prev) => (prev + 1) % Announcements.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // 搜索与分类过滤逻辑
  const filteredTasks = mockTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "全部" || task.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* 滚动公告栏 - 保持原样 */}
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

      {/* 搜索与排序栏 - 保持原样 */}
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

      {/* 分类筛选按钮组 - 保持原样 */}
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

      {/* 任务清单网格 - 仅此处替换为 TaskCard 组件封装 */}
      <div className="grid grid-cols-1 gap-4">
        {filteredTasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            layout
          >
            <TaskCard 
              task={task} 
              onNavigate={(id) => navigate(`/task/${id}`)} 
            />
          </motion.div>
        ))}
      </div>

      {/* 空状态提示 - 保持原样 */}
      {filteredTasks.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">暂无相关需求</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}