import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Plus, Calendar, Users, Eye, CheckCircle, XCircle, Gift, Trash2, MapPin, Clock } from "lucide-react";
import { toast } from "sonner";
import { adminApi } from "../../api/admin";

const statusMap: Record<number, string> = { 0: '招募中', 1: '进行中', 2: '已结束' };
const pStatusMap: Record<number, string> = { 0: '待审核', 1: '已入选', 2: '已完成', 3: '已放弃' };

export function ActivityManagement() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [detailData, setDetailData] = useState<any>(null);
  const [form, setForm] = useState({ title: '', description: '', location: '', startTime: '', endTime: '', requiredCount: '', pointsReward: '' });

  const loadActivities = () => {
    adminApi.getActivities().then(res => setActivities(res?.data || [])).finally(() => setLoading(false));
  };
  useEffect(() => { loadActivities(); }, []);

  const handleCreate = () => {
    setForm({ title: '', description: '', location: '', startTime: '', endTime: '', requiredCount: '', pointsReward: '' });
    setShowCreateDialog(true);
  };

  const confirmCreate = async () => {
    try {
      await adminApi.createActivity(form);
      toast.success('活动创建成功');
      setShowCreateDialog(false);
      loadActivities();
    } catch { toast.error('创建失败'); }
  };

  const handleEnd = async (id: number) => {
    await adminApi.endActivity(id);
    toast.success('活动已结束');
    loadActivities();
  };

  const openDetail = async (activity: any) => {
    setSelectedActivity(activity);
    try {
      const res = await adminApi.getActivityDetail(activity.id);
      setDetailData(res?.data);
      setShowDetailDialog(true);
    } catch { toast.error('加载失败'); }
  };

  const handleApprove = async (userId: number) => {
    if (!selectedActivity) return;
    await adminApi.approveParticipant(selectedActivity.id, userId);
    toast.success('已通过');
    openDetail(selectedActivity);
  };

  const handleReject = async (userId: number) => {
    if (!selectedActivity) return;
    await adminApi.rejectParticipant(selectedActivity.id, userId);
    toast.success('已拒绝');
    openDetail(selectedActivity);
  };

  const handleReward = async (userId: number) => {
    if (!selectedActivity) return;
    await adminApi.rewardParticipant(selectedActivity.id, userId);
    toast.success('积分已发放');
    openDetail(selectedActivity);
  };

  const handleRemove = async (userId: number) => {
    if (!selectedActivity) return;
    await adminApi.removeParticipant(selectedActivity.id, userId);
    toast.success('已剔除');
    openDetail(selectedActivity);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">活动管理</h1>
          <p className="text-gray-600">创建和管理校园互助活动</p>
        </div>
        <Button className="bg-[#165DFF] hover:bg-[#0E4FD4]" onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />新建活动
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card><CardContent className="p-6"><p className="text-sm text-gray-600 mb-1">招募中</p><p className="text-3xl font-bold text-[#52C41A]">{activities.filter(a => a.status === 0).length}</p></CardContent></Card>
        <Card><CardContent className="p-6"><p className="text-sm text-gray-600 mb-1">进行中</p><p className="text-3xl font-bold text-[#165DFF]">{activities.filter(a => a.status === 1).length}</p></CardContent></Card>
        <Card><CardContent className="p-6"><p className="text-sm text-gray-600 mb-1">已结束</p><p className="text-3xl font-bold text-gray-500">{activities.filter(a => a.status === 2).length}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>活动列表</CardTitle></CardHeader>
        <CardContent>
          {loading ? <div className="text-center py-12 text-gray-500">加载中...</div> :
          activities.length === 0 ? <div className="text-center py-12 text-gray-500">暂无活动</div> :
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>活动名称</TableHead>
                <TableHead>地点</TableHead>
                <TableHead>时间</TableHead>
                <TableHead>人数</TableHead>
                <TableHead>积分</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((a: any) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.title}</TableCell>
                  <TableCell>{a.location}</TableCell>
                  <TableCell className="text-sm">{a.startTime?.substring(0,16)}</TableCell>
                  <TableCell>{a.approvedCount || 0}/{a.requiredCount}</TableCell>
                  <TableCell><span className="font-semibold text-[#FF7D00]">{a.pointsReward}</span></TableCell>
                  <TableCell><Badge className={a.status===0?'bg-[#52C41A]':a.status===1?'bg-[#165DFF]':'bg-gray-500'}>{statusMap[a.status]||'未知'}</Badge></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openDetail(a)}><Eye className="w-4 h-4" /></Button>
                      {a.status === 0 && <Button variant="ghost" size="sm" className="text-[#FF5252]" onClick={() => handleEnd(a.id)}>结束</Button>}
                      {a.status === 1 && <Button variant="ghost" size="sm" className="text-[#FF5252]" onClick={() => handleEnd(a.id)}>结束</Button>}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>}
        </CardContent>
      </Card>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>新建活动</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>活动标题 *</Label><Input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} /></div>
            <div className="space-y-2"><Label>活动描述</Label><Textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={3} /></div>
            <div className="space-y-2"><Label>地点 *</Label><Input value={form.location} onChange={e=>setForm({...form,location:e.target.value})} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>开始时间 *</Label><Input type="datetime-local" value={form.startTime} onChange={e=>setForm({...form,startTime:e.target.value})} /></div>
              <div className="space-y-2"><Label>结束时间 *</Label><Input type="datetime-local" value={form.endTime} onChange={e=>setForm({...form,endTime:e.target.value})} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>所需人数 *</Label><Input type="number" value={form.requiredCount} onChange={e=>setForm({...form,requiredCount:e.target.value})} min={1} /></div>
              <div className="space-y-2"><Label>每人积分 *</Label><Input type="number" value={form.pointsReward} onChange={e=>setForm({...form,pointsReward:e.target.value})} min={1} /></div>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={()=>setShowCreateDialog(false)}>取消</Button><Button className="bg-[#165DFF]" onClick={confirmCreate}>创建</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog} >
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
          <DialogHeader><DialogTitle>{selectedActivity?.title} - 参与者管理</DialogTitle></DialogHeader>
          {detailData && (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-3 text-sm">
                <div><MapPin className="w-4 h-4 inline mr-1" />{detailData.location}</div>
                <div><Clock className="w-4 h-4 inline mr-1" />{detailData.startTime?.substring(0,16)}</div>
                <div><Users className="w-4 h-4 inline mr-1" />{detailData.participants?.filter((p:any)=>p.status===1).length}/{detailData.requiredCount}</div>
                <div className="font-semibold text-[#FF7D00]">{detailData.pointsReward}积分/人</div>
              </div>
              <Table>
                <TableHeader><TableRow><TableHead>姓名</TableHead><TableHead>学号</TableHead><TableHead>邮箱</TableHead><TableHead>信誉分</TableHead><TableHead>状态</TableHead><TableHead className="text-right">操作</TableHead></TableRow></TableHeader>
                <TableBody>
                  {detailData.participants?.map((p:any) => (
                    <TableRow key={p.userId}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell>{p.username}</TableCell>
                      <TableCell className="text-sm">{p.email}</TableCell>
                      <TableCell><span className={p.creditScore>=80?'text-[#52C41A]':'text-[#FF5252]'}>{p.creditScore}</span></TableCell>
                      <TableCell><Badge variant="outline">{pStatusMap[p.status]}</Badge></TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {p.status===0 && <><Button size="sm" variant="ghost" className="text-[#52C41A]" onClick={()=>handleApprove(p.userId)}><CheckCircle className="w-4 h-4" /></Button><Button size="sm" variant="ghost" className="text-[#FF5252]" onClick={()=>handleReject(p.userId)}><XCircle className="w-4 h-4" /></Button></>}
                          {p.status===1 && <><Button size="sm" variant="ghost" className="text-[#FF7D00]" onClick={()=>handleReward(p.userId)}><Gift className="w-4 h-4" /></Button><Button size="sm" variant="ghost" className="text-red-600" onClick={()=>handleRemove(p.userId)}><Trash2 className="w-4 h-4" /></Button></>}
                          {p.status===2 && <Badge className="bg-[#52C41A]">已发放</Badge>}
                          {p.status===3 && <Badge variant="secondary">已放弃</Badge>}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!detailData.participants || detailData.participants.length===0) && (
                    <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500">暂无报名者</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={()=>setShowDetailDialog(false)}>关闭</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
