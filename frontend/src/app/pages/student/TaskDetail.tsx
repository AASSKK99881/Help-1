import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Separator } from "../../components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Clock, Coins, User, Tag, Mail, Phone, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../contexts/AuthContext";
import { tasksApi, Task, TaskContactInfo } from "../../api/tasks";

const statusMap: Record<number, { label: string; color: string }> = {
  0: { label: '待审核', color: 'bg-[#FF7D00]' },
  1: { label: '待接单', color: 'bg-[#165DFF]' },
  2: { label: '进行中', color: 'bg-[#165DFF]' },
  3: { label: '已完成', color: 'bg-[#52C41A]' },
  4: { label: '已取消', color: 'bg-gray-500' },
};

export function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [task, setTask] = useState<Task | null>(null);
  const [publisher, setPublisher] = useState<TaskContactInfo | null>(null);
  const [acceptor, setAcceptor] = useState<TaskContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);

  useEffect(() => {
    if (!id) return;
    tasksApi.getTaskById(id).then(res => {
      if (res?.data) {
        setTask(res.data.task);
        setPublisher(res.data.publisher || null);
        setAcceptor(res.data.acceptor || null);
      }
    }).catch(() => {
      toast.error('加载任务详情失败');
    }).finally(() => setLoading(false));
  }, [id]);

  const handleAccept = () => setShowAcceptDialog(true);

  const confirmAccept = async () => {
    if (!id) return;
    try {
      await tasksApi.acceptTask(id);
      toast.success('接取成功！请与发布者联系');
      setShowAcceptDialog(false);
      navigate('/my-tasks');
    } catch {
      toast.error('接取失败');
    }
  };

  if (loading) {
    return <div className="max-w-5xl mx-auto p-12 text-center text-gray-500">加载中...</div>;
  }

  if (!task) {
    return <div className="max-w-5xl mx-auto p-12 text-center text-gray-500">任务不存在</div>;
  }

  const status = statusMap[task.status] || { label: '未知', color: 'bg-gray-400' };
  const isMyTask = user && Number(user.id) === task.publisherId;
  const canAccept = task.status === 1 && !isMyTask;

  return (
    <div className="max-w-5xl mx-auto">
      <Button variant="ghost" className="mb-4" onClick={() => navigate('/')}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        返回首页
      </Button>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <CardTitle className="text-2xl">{task.title}</CardTitle>
                    <Badge variant="outline">{task.category || '未分类'}</Badge>
                    <Badge className={`${status.color} text-white border-0`}>{status.label}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>发布于 {task.createdAt}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-[#FF7D00] mb-2">
                    <Coins className="w-6 h-6" />
                    <span className="text-3xl font-bold">{task.pointsReward}</span>
                  </div>
                  <div className="text-sm text-gray-500">积分悬赏</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="w-1 h-5 bg-[#165DFF] rounded"></span>
                  需求描述
                </h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{task.description}</p>
              </div>

              <Separator />

              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-5 h-5 text-[#FF5252]" />
                <span className="font-medium">截止时间：</span>
                <span className="text-[#FF5252]">{task.deadline || '未设置'}</span>
              </div>

              {canAccept && (
                <div className="flex gap-3 pt-4">
                  <Button className="flex-1 bg-[#165DFF] hover:bg-[#0E4FD4] h-12 text-base" onClick={handleAccept}>
                    立即接取
                  </Button>
                </div>
              )}

              {isMyTask && task.status === 2 && (
                <Button className="flex-1 bg-[#52C41A] hover:bg-[#45A817] h-12 text-base"
                  onClick={async () => {
                    await tasksApi.completeTask(task.id);
                    toast.success('任务已完成');
                    setTask({ ...task, status: 3 });
                  }}>
                  确认完成
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-lg">发布者信息</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-[#165DFF] text-white text-lg">
                    {publisher ? publisher.name.charAt(0) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">
                    {publisher ? publisher.name : `用户${task.publisherId}`}
                  </div>
                </div>
              </div>
              {isMyTask && (
                <p className="text-sm text-[#165DFF]">这是你发布的任务</p>
              )}
              {publisher && task.status >= 2 && (
                <div className="space-y-2 pt-2 border-t">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{publisher.email}</span>
                  </div>
                  {publisher.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{publisher.phone}</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {acceptor && task.status >= 2 && (
            <Card>
              <CardHeader><CardTitle className="text-lg">接单者信息</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-[#52C41A] text-white text-lg">
                      {acceptor.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="font-semibold">{acceptor.name}</div>
                </div>
                <div className="space-y-2 pt-2 border-t">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{acceptor.email}</span>
                  </div>
                  {acceptor.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{acceptor.phone}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 space-y-2">
              <h4 className="font-semibold text-blue-900">温馨提示</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• 接取任务前请仔细阅读要求</li>
                <li>• 确保有时间和能力完成</li>
                <li>• 完成后及时与发布者确认</li>
                <li>• 违约将扣除信用分</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认接取任务？</DialogTitle>
            <DialogDescription>接取后请按时完成任务，如需取消请提前与发布者沟通</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">任务名称</span>
              <span className="font-medium">{task.title}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">悬赏积分</span>
              <span className="font-semibold text-[#FF7D00]">{task.pointsReward} 积分</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">截止时间</span>
              <span className="text-[#FF5252]">{task.deadline || '未设置'}</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAcceptDialog(false)}>取消</Button>
            <Button className="bg-[#165DFF] hover:bg-[#0E4FD4]" onClick={confirmAccept}>确认接取</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
