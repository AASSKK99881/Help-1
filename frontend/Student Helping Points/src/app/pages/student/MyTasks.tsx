import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Clock, Coins, User, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const publishedTasks = [
  {
    id: '1',
    title: '帮忙代取快递',
    category: '生活帮助',
    points: 20,
    status: 'in-progress',
    deadline: '2026-03-17 18:00',
    createdAt: '2026-03-16 14:30',
    accepter: { name: '王芳', id: 'u2' }
  },
  {
    id: '2',
    title: 'PPT设计美化',
    category: '设计美化',
    points: 80,
    status: 'reviewing',
    deadline: '2026-03-20 12:00',
    createdAt: '2026-03-15 10:00',
    accepter: null
  },
  {
    id: '3',
    title: '英语作文批改',
    category: '学习辅导',
    points: 30,
    status: 'completed',
    deadline: '2026-03-14 16:00',
    createdAt: '2026-03-13 09:00',
    accepter: { name: '李晓', id: 'u3' },
    completedAt: '2026-03-14 15:30'
  },
];

const acceptedTasks = [
  {
    id: '4',
    title: '高数题目讲解',
    category: '学习辅导',
    points: 50,
    status: 'in-progress',
    deadline: '2026-03-18 20:00',
    publisher: { name: '张三', id: 'u4' },
    acceptedAt: '2026-03-16 16:00'
  },
  {
    id: '5',
    title: 'Python爬虫代码调试',
    category: '技术开发',
    points: 100,
    status: 'completed',
    deadline: '2026-03-15 22:00',
    publisher: { name: '李明', id: 'u5' },
    acceptedAt: '2026-03-15 10:00',
    completedAt: '2026-03-15 20:00'
  },
];

const statusMap = {
  'reviewing': { label: '审核中', color: 'bg-[#FF7D00]', icon: AlertCircle },
  'in-progress': { label: '进行中', color: 'bg-[#165DFF]', icon: Clock },
  'completed': { label: '已完成', color: 'bg-[#52C41A]', icon: CheckCircle },
  'cancelled': { label: '已取消', color: 'bg-gray-500', icon: XCircle },
};

export function MyTasks() {
  const navigate = useNavigate();
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  const handleComplete = (task: any) => {
    setSelectedTask(task);
    setShowCompleteDialog(true);
  };

  const confirmComplete = () => {
    toast.success('任务已确认完成！积分已转入接单者账户');
    setShowCompleteDialog(false);
  };

  const handleCancel = (task: any) => {
    setSelectedTask(task);
    setShowCancelDialog(true);
  };

  const confirmCancel = () => {
    toast.warning('任务已取消，已扣除违约积分', {
      description: '频繁取消会影响信用分'
    });
    setShowCancelDialog(false);
  };

  const TaskCard = ({ task, type }: { task: any; type: 'published' | 'accepted' }) => {
    const status = statusMap[task.status as keyof typeof statusMap];
    const StatusIcon = status.icon;

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                <Badge variant="outline" className="text-xs">{task.category}</Badge>
                <Badge className={`${status.color} text-white border-0`}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {status.label}
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    截止：{task.deadline}
                  </div>
                  <div className="flex items-center gap-1">
                    <Coins className="w-4 h-4 text-[#FF7D00]" />
                    <span className="font-semibold text-[#FF7D00]">{task.points} 积分</span>
                  </div>
                </div>
                
                {type === 'published' && task.accepter && (
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    接单者：{task.accepter.name}
                  </div>
                )}
                
                {type === 'accepted' && task.publisher && (
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    发布者：{task.publisher.name}
                  </div>
                )}

                {task.completedAt && (
                  <div className="text-[#52C41A]">
                    完成时间：{task.completedAt}
                  </div>
                )}
              </div>
            </div>

            <div className="ml-6 flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/task/${task.id}`)}
              >
                查看详情
              </Button>
              
              {type === 'published' && task.status === 'in-progress' && (
                <>
                  <Button
                    size="sm"
                    className="bg-[#52C41A] hover:bg-[#45A817] text-white"
                    onClick={() => handleComplete(task)}
                  >
                    确认完成
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleCancel(task)}
                  >
                    取消任务
                  </Button>
                </>
              )}
              
              {type === 'accepted' && task.status === 'in-progress' && (
                <Button
                  size="sm"
                  className="bg-[#165DFF] hover:bg-[#0E4FD4]"
                  onClick={() => toast.info('请联系发布者确认完成')}
                >
                  标记完成
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">我的委托</h1>
        <p className="text-gray-600">管理你发布和接取的所有任务</p>
      </div>

      <Tabs defaultValue="published" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="published" className="flex-1">
            我发布的 ({publishedTasks.length})
          </TabsTrigger>
          <TabsTrigger value="accepted" className="flex-1">
            我接取的 ({acceptedTasks.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="published" className="space-y-4">
          {publishedTasks.length > 0 ? (
            publishedTasks.map(task => (
              <TaskCard key={task.id} task={task} type="published" />
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-gray-500 mb-4">还没有发布任何需求</p>
                <Button 
                  className="bg-[#165DFF] hover:bg-[#0E4FD4]"
                  onClick={() => navigate('/create-task')}
                >
                  发布第一个需求
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="accepted" className="space-y-4">
          {acceptedTasks.length > 0 ? (
            acceptedTasks.map(task => (
              <TaskCard key={task.id} task={task} type="accepted" />
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-gray-500 mb-4">还没有接取任何任务</p>
                <Button 
                  className="bg-[#165DFF] hover:bg-[#0E4FD4]"
                  onClick={() => navigate('/')}
                >
                  浏览热门需求
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* 确认完成弹窗 */}
      <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认任务已完成？</DialogTitle>
            <DialogDescription>
              确认后积分将自动转入接单者账户，此操作不可撤销
            </DialogDescription>
          </DialogHeader>
          {selectedTask && (
            <div className="py-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">任务名称</span>
                <span className="font-medium">{selectedTask.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">接单者</span>
                <span className="font-medium">{selectedTask.accepter?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">积分金额</span>
                <span className="font-semibold text-[#FF7D00]">{selectedTask.points} 积分</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCompleteDialog(false)}>
              再想想
            </Button>
            <Button className="bg-[#52C41A] hover:bg-[#45A817]" onClick={confirmComplete}>
              确认完成
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 取消任务弹窗 */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">取消任务</DialogTitle>
            <DialogDescription>
              取消已接单的任务将扣除一定积分作为违约金
            </DialogDescription>
          </DialogHeader>
          {selectedTask && (
            <div className="py-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">任务名称</span>
                <span className="font-medium">{selectedTask.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">违约扣除</span>
                <span className="font-semibold text-red-600">-{Math.floor(selectedTask.points * 0.2)} 积分</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              我再想想
            </Button>
            <Button variant="destructive" onClick={confirmCancel}>
              确认取消
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
