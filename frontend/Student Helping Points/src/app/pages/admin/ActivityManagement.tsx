import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Plus, Calendar, Users, Edit, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";

const mockActivities = [
  {
    id: '1',
    title: '三月互助之星评选',
    description: '评选本月最热心互助的同学，获奖者将获得积分奖励',
    startDate: '2026-03-01',
    endDate: '2026-03-31',
    reward: 100,
    participants: 45,
    status: 'active'
  },
  {
    id: '2',
    title: '新用户注册有礼',
    description: '新注册用户即可获得100积分奖励',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    reward: 100,
    participants: 234,
    status: 'active'
  },
  {
    id: '3',
    title: '寒假互助周',
    description: '寒假期间完成任务可获得双倍积分',
    startDate: '2026-01-20',
    endDate: '2026-02-20',
    reward: 0,
    participants: 89,
    status: 'ended'
  },
];

export function ActivityManagement() {
  const [activities, setActivities] = useState(mockActivities);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [activityForm, setActivityForm] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    reward: ''
  });

  const handleCreate = () => {
    setActivityForm({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      reward: ''
    });
    setShowCreateDialog(true);
  };

  const confirmCreate = () => {
    const newActivity = {
      id: String(activities.length + 1),
      ...activityForm,
      reward: parseInt(activityForm.reward),
      participants: 0,
      status: 'active'
    };
    
    setActivities(prev => [newActivity, ...prev]);
    toast.success('活动创建成功', {
      description: '新活动已发布到学生端'
    });
    setShowCreateDialog(false);
  };

  const handleEdit = (activity: any) => {
    setSelectedActivity(activity);
    setActivityForm({
      title: activity.title,
      description: activity.description,
      startDate: activity.startDate,
      endDate: activity.endDate,
      reward: String(activity.reward)
    });
    setShowEditDialog(true);
  };

  const confirmEdit = () => {
    setActivities(prev => prev.map(a => 
      a.id === selectedActivity.id 
        ? { ...a, ...activityForm, reward: parseInt(activityForm.reward) }
        : a
    ));
    toast.success('活动已更新');
    setShowEditDialog(false);
  };

  const handleDelete = (activity: any) => {
    setSelectedActivity(activity);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    setActivities(prev => prev.filter(a => a.id !== selectedActivity.id));
    toast.success('活动已删除');
    setShowDeleteDialog(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">活动管理</h1>
          <p className="text-gray-600">创建和管理平台官方活动</p>
        </div>
        <Button className="bg-[#165DFF] hover:bg-[#0E4FD4]" onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          新建活动
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">进行中</p>
                <p className="text-3xl font-bold text-[#52C41A]">
                  {activities.filter(a => a.status === 'active').length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-50">
                <Calendar className="w-6 h-6 text-[#52C41A]" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">总参与人数</p>
                <p className="text-3xl font-bold text-[#165DFF]">
                  {activities.reduce((sum, a) => sum + a.participants, 0)}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                <Users className="w-6 h-6 text-[#165DFF]" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">已结束</p>
                <p className="text-3xl font-bold text-gray-500">
                  {activities.filter(a => a.status === 'ended').length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gray-50">
                <Calendar className="w-6 h-6 text-gray-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 活动列表 */}
      <Card>
        <CardHeader>
          <CardTitle>活动列表</CardTitle>
          <CardDescription>管理所有平台活动</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>活动名称</TableHead>
                <TableHead>活动时间</TableHead>
                <TableHead>奖励积分</TableHead>
                <TableHead>参与人数</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{activity.title}</div>
                      <div className="text-sm text-gray-500 line-clamp-1">
                        {activity.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{activity.startDate}</div>
                      <div className="text-gray-500">至 {activity.endDate}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-[#FF7D00]">
                      {activity.reward > 0 ? `${activity.reward} 积分` : '-'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-[#165DFF]">
                      {activity.participants}
                    </span>
                  </TableCell>
                  <TableCell>
                    {activity.status === 'active' ? (
                      <Badge className="bg-[#52C41A] text-white border-0">进行中</Badge>
                    ) : (
                      <Badge variant="secondary">已结束</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEdit(activity)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-red-600"
                        onClick={() => handleDelete(activity)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 创建活动弹窗 */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>新建活动</DialogTitle>
            <DialogDescription>
              创建一个新的平台活动
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="create-title">活动标题 *</Label>
              <Input
                id="create-title"
                placeholder="请输入活动标题"
                value={activityForm.title}
                onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-description">活动描述 *</Label>
              <Textarea
                id="create-description"
                placeholder="详细描述活动内容和规则"
                value={activityForm.description}
                onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-start">开始时间 *</Label>
                <Input
                  id="create-start"
                  type="date"
                  value={activityForm.startDate}
                  onChange={(e) => setActivityForm({ ...activityForm, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-end">结束时间 *</Label>
                <Input
                  id="create-end"
                  type="date"
                  value={activityForm.endDate}
                  onChange={(e) => setActivityForm({ ...activityForm, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-reward">奖励积分</Label>
              <Input
                id="create-reward"
                type="number"
                placeholder="设置奖励积分，0表示无积分奖励"
                value={activityForm.reward}
                onChange={(e) => setActivityForm({ ...activityForm, reward: e.target.value })}
                min={0}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              取消
            </Button>
            <Button 
              className="bg-[#165DFF] hover:bg-[#0E4FD4]"
              onClick={confirmCreate}
              disabled={!activityForm.title || !activityForm.description || !activityForm.startDate || !activityForm.endDate}
            >
              创建活动
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑活动弹窗 */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>编辑活动</DialogTitle>
            <DialogDescription>
              修改活动信息
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">活动标题 *</Label>
              <Input
                id="edit-title"
                value={activityForm.title}
                onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">活动描述 *</Label>
              <Textarea
                id="edit-description"
                value={activityForm.description}
                onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-start">开始时间 *</Label>
                <Input
                  id="edit-start"
                  type="date"
                  value={activityForm.startDate}
                  onChange={(e) => setActivityForm({ ...activityForm, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-end">结束时间 *</Label>
                <Input
                  id="edit-end"
                  type="date"
                  value={activityForm.endDate}
                  onChange={(e) => setActivityForm({ ...activityForm, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-reward">奖励积分</Label>
              <Input
                id="edit-reward"
                type="number"
                value={activityForm.reward}
                onChange={(e) => setActivityForm({ ...activityForm, reward: e.target.value })}
                min={0}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              取消
            </Button>
            <Button 
              className="bg-[#165DFF] hover:bg-[#0E4FD4]"
              onClick={confirmEdit}
            >
              保存修改
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认弹窗 */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[#FF5252]">删除活动</DialogTitle>
            <DialogDescription>
              确认删除该活动？此操作不可撤销
            </DialogDescription>
          </DialogHeader>
          {selectedActivity && (
            <div className="py-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-medium mb-2">{selectedActivity.title}</div>
                <div className="text-sm text-gray-600">
                  参与人数：{selectedActivity.participants}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              确认删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
