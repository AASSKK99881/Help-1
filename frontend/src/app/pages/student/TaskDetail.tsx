import { useState } from "react";
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
import { Clock, Coins, User, Tag, Phone, Mail, MessageCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);

  // 模拟任务详情数据
  const task = {
    id: id,
    title: '帮忙代取快递',
    description: '今天下午有课，快递到了但是取不了，需要帮忙代取一下放到宿舍楼下。快递在东门快递站，取货码会私信发给你。取完后放在3号宿舍楼一楼就行，我晚上下课回来自己拿。',
    category: '生活帮助',
    points: 20,
    deadline: '2026-03-17 18:00',
    createdAt: '2026-03-16 14:30',
    publisher: {
      id: 'u1',
      name: '李明',
      avatar: 'L',
      studentId: '2021001',
      phone: '138****5678',
      email: 'liming@example.com',
      creditScore: 98
    },
    status: 'open',
    tags: ['紧急', '快递'],
    requirements: [
      '需要在今天18:00前完成',
      '取货后拍照确认',
      '需要有空闲时间下午去东门'
    ],
    relatedTasks: [
      { id: '2', title: '高数题目讲解', points: 50 },
      { id: '3', title: 'PPT设计美化', points: 80 },
      { id: '5', title: '英语作文批改', points: 30 }
    ]
  };

  const handleAccept = () => {
    setShowAcceptDialog(true);
  };

  const confirmAccept = () => {
    toast.success('接取成功！请与发布者联系');
    setShowAcceptDialog(false);
    navigate('/my-tasks');
  };

  return (
    <div className="max-w-5xl mx-auto">
      <Button 
        variant="ghost" 
        className="mb-4"
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        返回首页
      </Button>

      <div className="grid grid-cols-3 gap-6">
        {/* 左侧主要内容 */}
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <CardTitle className="text-2xl">{task.title}</CardTitle>
                    <Badge variant="outline">{task.category}</Badge>
                    <Badge className="bg-[#52C41A] text-white border-0">进行中</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>发布于 {task.createdAt}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-[#FF7D00] mb-2">
                    <Coins className="w-6 h-6" />
                    <span className="text-3xl font-bold">{task.points}</span>
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
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {task.description}
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="w-1 h-5 bg-[#165DFF] rounded"></span>
                  要求说明
                </h3>
                <ul className="space-y-2">
                  {task.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#165DFF] mt-2"></span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="w-1 h-5 bg-[#165DFF] rounded"></span>
                  标签
                </h3>
                <div className="flex items-center gap-2">
                  {task.tags.map(tag => (
                    <Badge key={tag} variant="secondary">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-5 h-5 text-[#FF5252]" />
                <span className="font-medium">截止时间：</span>
                <span className="text-[#FF5252]">{task.deadline}</span>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  className="flex-1 bg-[#165DFF] hover:bg-[#0E4FD4] h-12 text-base"
                  onClick={handleAccept}
                >
                  立即接取
                </Button>
                <Button variant="outline" className="h-12">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  咨询发布者
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 相关推荐 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">相关需求推荐</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {task.relatedTasks.map(related => (
                  <div 
                    key={related.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/task/${related.id}`)}
                  >
                    <span className="text-gray-700">{related.title}</span>
                    <div className="flex items-center gap-1 text-[#FF7D00]">
                      <Coins className="w-4 h-4" />
                      <span className="font-semibold">{related.points}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右侧信息卡片 */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">发布者信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-[#165DFF] text-white text-lg">
                    {task.publisher.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-semibold">{task.publisher.name}</div>
                  <div className="text-sm text-gray-500">学号: {task.publisher.studentId}</div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">信用分</span>
                  <span className="font-semibold text-[#52C41A]">{task.publisher.creditScore}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{task.publisher.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{task.publisher.email}</span>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => toast.info('请先接取任务后联系')}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                发送私信
              </Button>
            </CardContent>
          </Card>

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

      {/* 接取确认弹窗 */}
      <Dialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认接取任务？</DialogTitle>
            <DialogDescription>
              接取后请按时完成任务，如需取消请提前与发布者沟通
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">任务名称</span>
              <span className="font-medium">{task.title}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">悬赏积分</span>
              <span className="font-semibold text-[#FF7D00]">{task.points} 积分</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">截止时间</span>
              <span className="text-[#FF5252]">{task.deadline}</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAcceptDialog(false)}>
              取消
            </Button>
            <Button className="bg-[#165DFF] hover:bg-[#0E4FD4]" onClick={confirmAccept}>
              确认接取
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
