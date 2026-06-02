import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Clock, User, Coins, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { adminApi } from "../../api/admin";
import { Task } from "../../api/tasks";

export function ContentReview() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const loadTasks = () => {
    adminApi.getPendingTasks().then(res => {
      setTasks(res?.data?.list || []);
    }).catch(() => {
      toast.error('加载审核列表失败');
    }).finally(() => setLoading(false));
  };

  useEffect(() => { loadTasks(); }, []);

  const handleApprove = (task: Task) => {
    setSelectedTask(task);
    setShowApproveDialog(true);
  };

  const confirmApprove = async () => {
    if (!selectedTask) return;
    try {
      await adminApi.approveTask(selectedTask.id);
      toast.success('审核通过');
      setShowApproveDialog(false);
      loadTasks();
    } catch {
      toast.error('操作失败');
    }
  };

  const handleReject = (task: Task) => {
    setSelectedTask(task);
    setRejectReason('');
    setShowRejectDialog(true);
  };

  const confirmReject = async () => {
    if (!selectedTask) return;
    try {
      await adminApi.rejectTask(selectedTask.id, rejectReason);
      toast.success('已驳回');
      setShowRejectDialog(false);
      loadTasks();
    } catch {
      toast.error('操作失败');
    }
  };

  const TaskCard = ({ task }: { task: Task }) => {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold">{task.title}</h3>
                <Badge variant="outline">{task.category}</Badge>
              </div>
              <p className="text-gray-600 mb-3">{task.description}</p>

              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  用户{task.publisherId}
                </div>
                <div className="flex items-center gap-1">
                  <Coins className="w-4 h-4 text-[#FF7D00]" />
                  <span className="font-semibold text-[#FF7D00]">{task.pointsReward} 积分</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  截止：{task.deadline || '未设置'}
                </div>
              </div>

              <div className="mt-3 text-sm text-gray-500">
                提交时间：{task.createdAt}
              </div>
            </div>

            <div className="ml-6 flex flex-col gap-2">
              <Button className="bg-[#52C41A] hover:bg-[#45A817]" onClick={() => handleApprove(task)}>
                <CheckCircle className="w-4 h-4 mr-2" />
                通过
              </Button>
              <Button variant="destructive" onClick={() => handleReject(task)}>
                <XCircle className="w-4 h-4 mr-2" />
                驳回
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">内容审核</h1>
        <p className="text-gray-600">审核用户发布的互助需求</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">待审核</p>
              <p className="text-3xl font-bold text-[#FF7D00]">{tasks.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-orange-50">
              <AlertCircle className="w-6 h-6 text-[#FF7D00]" />
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <Card><CardContent className="p-12 text-center text-gray-500">加载中...</CardContent></Card>
      ) : tasks.length > 0 ? (
        <div className="space-y-4">
          {tasks.map(task => <TaskCard key={task.id} task={task} />)}
        </div>
      ) : (
        <Card><CardContent className="p-12 text-center text-gray-500">暂无待审核内容</CardContent></Card>
      )}

      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>审核通过</DialogTitle>
            <DialogDescription>确认通过该需求？通过后积分将被冻结并发布到平台</DialogDescription>
          </DialogHeader>
          {selectedTask && (
            <div className="py-4 space-y-2">
              <div className="flex justify-between"><span className="text-gray-600">需求标题</span><span className="font-medium">{selectedTask.title}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">悬赏积分</span><span className="font-semibold text-[#FF7D00]">{selectedTask.pointsReward} 积分</span></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>取消</Button>
            <Button className="bg-[#52C41A] hover:bg-[#45A817]" onClick={confirmApprove}>确认通过</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[#FF5252]">驳回审核</DialogTitle>
            <DialogDescription>请填写驳回原因</DialogDescription>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-4 py-4">
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <div className="flex justify-between"><span className="text-gray-600">需求标题</span><span className="font-medium">{selectedTask.title}</span></div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reject-reason">驳回原因 *</Label>
                <Textarea id="reject-reason" placeholder="请详细说明驳回原因" value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)} rows={4} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>取消</Button>
            <Button variant="destructive" onClick={confirmReject} disabled={!rejectReason.trim()}>确认驳回</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
