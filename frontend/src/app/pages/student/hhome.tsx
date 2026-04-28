import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Search, Clock, Coins, User, TrendingUp, BookOpen, Code, Palette, MessageSquare } from "lucide-react";
import { motion } from "motion/react";

// ✅ 引入我们之前封装好的 API 接口
import { tasksApi } from "../../api/tasks";

// 模拟任务数据
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
    title: '高数题目讲解',
    description: '有几道高等数学题不太会做，希望有学霸帮忙讲解一下解题思路',
    category: '学习辅导',
    points: 50,
    deadline: '2026-03-18 20:00',
    publisher: { name: '王芳', avatar: 'W' },
    status: 'open',
    tags: ['学习', '数学']
  },
  {
    id: '3',
    title: 'PPT设计美化',
    description: '下周要做课堂展示，PPT内容已经准备好了，希望有擅长设计的同学帮忙美化一下',
    category: '设计美化',
    points: 80,
    deadline: '2026-03-20 12:00',
    publisher: { name: '陈晨', avatar: 'C' },
    status: 'open',
    tags: ['设计', 'PPT']
  },
  {
    id: '4',
    title: 'Python爬虫代码调试',
    description: '写了一个爬虫程序，但是运行时总是报错，需要有经验的同学帮忙看看',
    category: '技术开发',
    points: 100,
    deadline: '2026-03-19 22:00',
    publisher: { name: '张伟', avatar: 'Z' },
    status: 'open',
    tags: ['编程', 'Python']
  },
  {
    id: '5',
    title: '英语作文批改',
    description: '写了一篇英语作文，希望英语好的同学帮忙批改一下语法和表达',
    category: '学习辅导',
    points: 30,
    deadline: '2026-03-18 16:00',
    publisher: { name: '刘洋', avatar: 'L' },
    status: 'open',
    tags: ['学习', '英语']
  },
  {
    id: '6',
    title: '活动摄影跟拍',
    description: '社团活动需要摄影师跟拍记录，时间大约2小时',
    category: '活动协助',
    points: 60,
    deadline: '2026-03-22 14:00',
    publisher: { name: '赵敏', avatar: 'Z' },
    status: 'open',
    tags: ['摄影', '活动']
  },
];

const categories = [
  { name: '全部', icon: TrendingUp, color: 'text-[#165DFF]' },
  { name: '学习辅导', icon: BookOpen, color: 'text-[#52C41A]' },
  { name: '技术开发', icon: Code, color: 'text-[#FF7D00]' },
  { name: '设计美化', icon: Palette, color: 'text-[#FF5252]' },
  { name: '生活帮助', icon: MessageSquare, color: 'text-[#36CFC9]' },
];

const announcements = [
  { id: 1, title: '【公告】平台用户突破10000人！', type: 'info' },
  { id: 2, title: '【活动】三月互助之星评选开始啦', type: 'event' },
  { id: 3, title: '【规则】新增违约惩罚机制说明', type: 'rule' },
];

export function StudentHome() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');

  // ✅ 在组件加载时，自动调用后端接口获取数据
  useEffect(() => {
    const fetchTasksFromApi = async () => {
      try {
        console.log('🚀 [前端联调] 开始调用获取任务列表 API...');
        // 调用我们封装好的 API
        const res = await tasksApi.getTasks();
        
        // 打印获取到的 Mock 数据，用来做作业截图证明
        console.log('✅ [前端联调] API 调用成功，获取到的数据：', res);
      } catch (error) {
        console.error('❌ [前端联调] API 调用失败：', error);
      }
    };

    fetchTasksFromApi();
  }, []); // 空数组代表只在页面首次打开时执行一次

  const filteredTasks = mockTasks.filter(task => {
    const matchCategory = selectedCategory === '全部' || task.category === selectedCategory;
    const matchSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       task.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* 公告轮播 */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-[#165DFF]/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Badge className="bg-[#FF7D00] text-white border-0 shrink-0">公告</Badge>
            <div className="flex-1 overflow-hidden">
              <motion.div
                animate={{ x: [0, -500] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="whitespace-nowrap"
              >
                {announcements.map((announcement, index) => (
                  <span key={announcement.id} className="mx-8 text-gray-700">
                    {announcement.title}
                  </span>
                ))}
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 分类导航 */}
      <div className="grid grid-cols-5 gap-4">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = selectedCategory === category.name;
          return (
            <motion.div
              key={category.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card 
                className={`cursor-pointer transition-all ${
                  isActive 
                    ? 'border-[#165DFF] bg-blue-50 shadow-md' 
                    : 'hover:border-gray-300 hover:shadow-sm'
                }`}
                onClick={() => setSelectedCategory(category.name)}
              >
                <CardContent className="p-6 text-center">
                  <Icon className={`w-8 h-8 mx-auto mb-2 ${isActive ? 'text-[#165DFF]' : category.color}`} />
                  <div className={`font-medium ${isActive ? 'text-[#165DFF]' : 'text-gray-700'}`}>
                    {category.name}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* 搜索和筛选 */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="搜索需求标题或描述..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="排序方式" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">最新发布</SelectItem>
            <SelectItem value="points-high">积分最高</SelectItem>
            <SelectItem value="points-low">积分最低</SelectItem>
            <SelectItem value="deadline">截止时间</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 任务列表 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            热门需求 <span className="text-gray-500 text-base ml-2">({filteredTasks.length}个)</span>
          </h2>
        </div>

        <div className="grid gap-4">
          {filteredTasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/task/${task.id}`)}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                            <Badge variant="outline" className="text-xs">{task.category}</Badge>
                          </div>
                          <p className="text-gray-600 mb-3 line-clamp-2">{task.description}</p>
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
                          <div className="flex items-center gap-2 mt-3">
                            {task.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
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
                            navigate(`/task/${task.id}`);
                          }}
                        >
                          接取任务
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-500">暂无相关需求</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}