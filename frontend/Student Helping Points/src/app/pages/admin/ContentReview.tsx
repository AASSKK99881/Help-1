import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
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

const mockTasks = [
  {
    id: '1',
    title: 'PPT设计美化',
    description: '下周要做课堂展示，PPT内容已经准备好了，希望有擅长设计的同学帮忙美化一下',
    category: '设计美化',
    points: 80,
    deadline: '2026-03-20 12:00',
    publisher: { name: '陈晨', studentId: '2021003' },
    submitTime: '2026-03-16 10:30',
    status: 'pending'
  },
  {
    id: '2',
    title: '帮忙代取快递',
    description: '今天下午有课，快递到了但是取不了，需要帮忙代取一下放到宿舍楼下',
    category: '生活帮助',
    points: 20,
    deadline: '2026-03-17 18:00',
    publisher: { name: '李明', studentId: '2021001' },
    submitTime: '2026-03-16 14:30',
    status: 'pending'
  },
  {
    id: '3',
    title: '高数题目讲解',
    description: '有几道高等数学题不太会做，希望有学霸帮忙讲解一下解题思路',
    category: '学习辅导',
    points: 50,
    deadline: '2026-03-18 20:00',
    publisher: { name: '王芳', studentId: '2021002' },
    submitTime: '2026-03-15 09:00',
    status: 'approved',
    reviewTime: '2026-03-15 09:15'
  },
  {
    id: '4',
    title: '代写作业',
    description: '有一篇论文需要代写，价格可谈',
    category: '其他',
    points: 200,
    deadline: '2026-03-25 23:59',
    publisher: { name: '某学生', studentId: '2021099' },
    submitTime: '2026-03-14 16:00',
    status: 'rejected',
    reviewTime: '2026-03-14 16:10',
    rejectReason: '涉嫌学术不端，违反平台规定'
  },
];

export function ContentReview() {
  const [tasks, setTasks] = useState(mockTasks);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState('');

  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const approvedTasks = tasks.filter(t => t.status === 'approved');
  const rejectedTasks = tasks.filter(t => t.status === 'rejected');

  const handleApprove = (task: any) => {
    setSelectedTask(task);
    setShowApproveDialog(true);
  };

  const confirmApprove = () => {
    setTasks(prev => prev.map(t => 
      t.id === selectedTask.id 
        ? { ...t, status: 'approved', reviewTime: new Date().toLocaleString('zh-CN') } 
        : t
    ));
    toast.success('审核通过', {
      description: '需求已发布到平台首页'
    });
    setShowApproveDialog(false);
  };

  const handleReject = (task: any) => {
    setSelectedTask(task);
    setRejectReason('');
    setShowRejectDialog(true);
  };

  const confirmReject = () => {
    setTasks(prev => prev.map(t => 
      t.id === selectedTask.id 
        ? { ...t, status: 'rejected', reviewTime: new Date().toLocaleString('zh-CN'), rejectReason } 
        : t
    ));
    toast.success('已驳回', {
      description: '驳回原因已通知用户'
    });
    setShowRejectDialog(false);
  };

  const TaskCard = ({ task }: { task: any }) => {
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
                  {task.publisher.name} ({task.publisher.studentId})
                </div>
                <div className="flex items-center gap-1">
                  <Coins className="w-4 h-4 text-[#FF7D00]" />
                  <span className="font-semibold text-[#FF7D00]">{task.points} 积分</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  截止：{task.deadline}
                </div>
              </div>
              
              <div className="mt-3 text-sm text-gray-500">
                提交时间：{task.submitTime}
                {task.reviewTime && (
                  <> | 审核时间：{task.reviewTime}</>
                )}
              </div>

              {task.rejectReason && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">
                    <strong>驳回原因：</strong>{task.rejectReason}
                  </p>
                </div>
              )}
            </div>

            {task.status === 'pending' && (
              <div className="ml-6 flex flex-col gap-2">
                <Button
                  className="bg-[#52C41A] hover:bg-[#45A817]"
                  onClick={() => handleApprove(task)}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  通过
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleReject(task)}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  驳回
                </Button>
              </div>
            )}

            {task.status === 'approved' && (
              <Badge className="bg-[#52C41A] text-white border-0 shrink-0">
                <CheckCircle className="w-3 h-3 mr-1" />
                已通过
              </Badge>
            )}

            {task.status === 'rejected' && (
              <Badge className="bg-[#FF5252] text-white border-0 shrink-0">
                <XCircle className="w-3 h-3 mr-1" />
                已驳回
              </Badge>
            )}
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

      {/* 统计卡片 */}
      <div className="grid grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">待审核</p>
                <p className="text-3xl font-bold text-[#FF7D00]">{pendingTasks.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-orange-50">
                <AlertCircle className="w-6 h-6 text-[#FF7D00]" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">已通过</p>
                <p className="text-3xl font-bold text-[#52C41A]">{approvedTasks.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-50">
                <CheckCircle className="w-6 h-6 text-[#52C41A]" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">已驳回</p>
                <p className="text-3xl font-bold text-[#FF5252]">{rejectedTasks.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-red-50">
                <XCircle className="w-6 h-6 text-[#FF5252]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 审核列表 */}
      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">
            待审核 ({pendingTasks.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            已通过 ({approvedTasks.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            已驳回 ({rejectedTasks.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4 mt-6">
          {pendingTasks.length > 0 ? (
            pendingTasks.map(task => <TaskCard key={task.id} task={task} />)
          ) : (
            <Card>
              <CardContent className="p-12 text-center text-gray-500">
                暂无待审核内容
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4 mt-6">
          {approvedTasks.length > 0 ? (
            approvedTasks.map(task => <TaskCard key={task.id} task={task} />)
          ) : (
            <Card>
              <CardContent className="p-12 text-center text-gray-500">
                暂无已通过内容
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4 mt-6">
          {rejectedTasks.length > 0 ? (
            rejectedTasks.map(task => <TaskCard key={task.id} task={task} />)
          ) : (
            <Card>
              <CardContent className="p-12 text-center text-gray-500">
                暂无已驳回内容
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* 通过确认弹窗 */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>审核通过</DialogTitle>
            <DialogDescription>
              确认通过该需求的审核？通过后将立即发布到平台
            </DialogDescription>
          </DialogHeader>
          {selectedTask && (
            <div className="py-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">需求标题</span>
                <span className="font-medium">{selectedTask.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">发布者</span>
                <span className="font-medium">{selectedTask.publisher.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">悬赏积分</span>
                <span className="font-semibold text-[#FF7D00]">{selectedTask.points} 积分</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
              取消
            </Button>
            <Button className="bg-[#52C41A] hover:bg-[#45A817]" onClick={confirmApprove}>
              确认通过
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 驳回弹窗 */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[#FF5252]">驳回审核</DialogTitle>
            <DialogDescription>
              请填写驳回原因，系统将自动通知用户
            </DialogDescription>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-4 py-4">
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">需求标题</span>
                  <span className="font-medium">{selectedTask.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">发布者</span>
                  <span className="font-medium">{selectedTask.publisher.name}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reject-reason">驳回原因 *</Label>
                <Textarea
                  id="reject-reason"
                  placeholder="请详细说明驳回原因，帮助用户了解问题所在"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              取消
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmReject}
              disabled={!rejectReason.trim()}
            >
              确认驳回
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
