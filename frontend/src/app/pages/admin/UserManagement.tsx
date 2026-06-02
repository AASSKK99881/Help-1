import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../../components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "../../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Label } from "../../components/ui/label";
import { Search, Ban, CheckCircle, Coins, UserPlus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { adminApi, AdminUser } from "../../api/admin";
import { useAuth } from "../../contexts/AuthContext";

export function UserManagement() {
  const { user: currentUser } = useAuth();
  const currentUserId = currentUser ? Number(currentUser.id) : 0;
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showPointsDialog, setShowPointsDialog] = useState(false);
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [showCreateAdminDialog, setShowCreateAdminDialog] = useState(false);
  const [showDeleteAdminDialog, setShowDeleteAdminDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [pointsForm, setPointsForm] = useState({ type: 'add', amount: '', reason: '' });
  const [adminForm, setAdminForm] = useState({ name: '', username: '', password: '' });

  const loadUsers = () => {
    adminApi.getUsers().then(res => {
      setUsers(res?.data?.list || []);
    }).catch(() => toast.error('加载用户列表失败'))
    .finally(() => setLoading(false));
  };

  useEffect(() => { loadUsers(); }, []);

  const filteredUsers = users.filter(user => {
    const matchSearch = (user.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                       (user.username || '').includes(searchQuery) ||
                       (user.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' ||
      (statusFilter === 'active' && user.status !== 1) ||
      (statusFilter === 'banned' && user.status === 1);
    return matchSearch && matchStatus;
  });

  const handlePointsAdjust = (user: AdminUser) => {
    setSelectedUser(user);
    setPointsForm({ type: 'add', amount: '', reason: '' });
    setShowPointsDialog(true);
  };

  const confirmPointsAdjust = async () => {
    if (!selectedUser) return;
    const amount = pointsForm.type === 'add' ? parseInt(pointsForm.amount) : -parseInt(pointsForm.amount);
    try {
      await adminApi.adjustPoints(selectedUser.id, amount, pointsForm.reason);
      toast.success('积分调整成功');
      setShowPointsDialog(false);
      loadUsers();
    } catch { toast.error('操作失败'); }
  };

  const handleToggleBan = (user: AdminUser) => {
    setSelectedUser(user);
    setShowBanDialog(true);
  };

  const confirmToggleBan = async () => {
    if (!selectedUser) return;
    try {
      if (selectedUser.status === 1) {
        await adminApi.unbanUser(selectedUser.id);
        toast.success('账号已解封');
      } else {
        await adminApi.banUser(selectedUser.id);
        toast.success('账号已封禁');
      }
      setShowBanDialog(false);
      loadUsers();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || '操作失败');
    }
  };

  const handleCreateAdmin = () => {
    setAdminForm({ name: '', username: '', password: '' });
    setShowCreateAdminDialog(true);
  };

  const confirmCreateAdmin = async () => {
    if (!adminForm.name || !adminForm.username || !adminForm.password) {
      toast.error('请填写完整信息');
      return;
    }
    try {
      await adminApi.createAdmin(adminForm);
      toast.success('管理员创建成功');
      setShowCreateAdminDialog(false);
      loadUsers();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || '创建失败');
    }
  };

  const handleDeleteAdmin = (user: AdminUser) => {
    setSelectedUser(user);
    setShowDeleteAdminDialog(true);
  };

  const confirmDeleteAdmin = async () => {
    if (!selectedUser) return;
    try {
      await adminApi.deleteAdmin(selectedUser.id);
      toast.success('管理员已删除');
      setShowDeleteAdminDialog(false);
      loadUsers();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || '删除失败');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">用户管理</h1>
          <p className="text-gray-600">管理平台用户账号和积分</p>
        </div>
        <Button className="bg-[#165DFF] hover:bg-[#0E4FD4]" onClick={handleCreateAdmin}>
          <UserPlus className="w-4 h-4 mr-2" />
          新建管理员
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <Card><CardContent className="p-6"><p className="text-sm text-gray-600 mb-1">总用户数</p><p className="text-3xl font-bold text-gray-900">{users.length}</p></CardContent></Card>
        <Card><CardContent className="p-6"><p className="text-sm text-gray-600 mb-1">活跃用户</p><p className="text-3xl font-bold text-[#52C41A]">{users.filter(u => u.status !== 1).length}</p></CardContent></Card>
        <Card><CardContent className="p-6"><p className="text-sm text-gray-600 mb-1">封禁用户</p><p className="text-3xl font-bold text-[#FF5252]">{users.filter(u => u.status === 1).length}</p></CardContent></Card>
        <Card><CardContent className="p-6"><p className="text-sm text-gray-600 mb-1">平均积分</p><p className="text-3xl font-bold text-[#FF7D00]">{users.length > 0 ? Math.round(users.reduce((s, u) => s + (u.points || 0), 0) / users.length) : 0}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>用户列表</CardTitle><CardDescription>查看和管理所有用户</CardDescription></CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="搜索姓名、学号或邮箱..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40"><SelectValue placeholder="状态筛选" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="active">正常</SelectItem>
                <SelectItem value="banned">已封禁</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-500">加载中...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>姓名</TableHead>
                  <TableHead>学号</TableHead>
                  <TableHead>邮箱</TableHead>
                  <TableHead>积分</TableHead>
                  <TableHead>角色</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.id}</TableCell>
                    <TableCell>{user.name || '-'}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email || '-'}</TableCell>
                    <TableCell><span className="font-semibold text-[#FF7D00]">{user.points}</span></TableCell>
                    <TableCell>{user.role === 1 ? '管理员' : '学生'}</TableCell>
                    <TableCell>
                      {user.status === 1 ? (
                        <Badge className="bg-[#FF5252] text-white border-0"><Ban className="w-3 h-3 mr-1" />已封禁</Badge>
                      ) : (
                        <Badge className="bg-[#52C41A] text-white border-0"><CheckCircle className="w-3 h-3 mr-1" />正常</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handlePointsAdjust(user)}>
                          <Coins className="w-4 h-4 mr-1" />积分
                        </Button>
                        {user.id !== 1 && user.id !== currentUserId && (
                          <Button variant="outline" size="sm"
                            className={user.status === 1 ? 'text-[#52C41A]' : 'text-[#FF5252]'}
                            onClick={() => handleToggleBan(user)}>
                            {user.status === 1 ? '解封' : '封禁'}
                          </Button>
                        )}
                        {user.role === 1 && user.id !== 1 && user.id !== currentUserId && (
                          <Button variant="outline" size="sm" className="text-red-600"
                            onClick={() => handleDeleteAdmin(user)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {!loading && filteredUsers.length === 0 && (
            <div className="text-center py-12 text-gray-500">未找到相关用户</div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showPointsDialog} onOpenChange={setShowPointsDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>积分调整</DialogTitle><DialogDescription>手动调整用户积分</DialogDescription></DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between mb-2"><span className="text-gray-600">用户</span><span className="font-semibold">{selectedUser.name}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">当前积分</span><span className="font-semibold text-[#FF7D00]">{selectedUser.points}</span></div>
              </div>
              <div className="space-y-2">
                <Label>操作类型</Label>
                <Select value={pointsForm.type} onValueChange={(v) => setPointsForm({ ...pointsForm, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="add">发放积分</SelectItem><SelectItem value="deduct">扣除积分</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>积分数量</Label><Input type="number" placeholder="请输入积分数量" value={pointsForm.amount} onChange={(e) => setPointsForm({ ...pointsForm, amount: e.target.value })} min={1} /></div>
              <div className="space-y-2"><Label>调整原因</Label><Input placeholder="请输入调整原因" value={pointsForm.reason} onChange={(e) => setPointsForm({ ...pointsForm, reason: e.target.value })} /></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPointsDialog(false)}>取消</Button>
            <Button className="bg-[#165DFF] hover:bg-[#0E4FD4]" onClick={confirmPointsAdjust} disabled={!pointsForm.amount || !pointsForm.reason}>确认调整</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showBanDialog} onOpenChange={setShowBanDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className={selectedUser?.status !== 1 ? 'text-[#FF5252]' : 'text-[#52C41A]'}>
              {selectedUser?.status !== 1 ? '封禁账号' : '解封账号'}
            </DialogTitle>
            <DialogDescription>{selectedUser?.status !== 1 ? '封禁后该用户将无法登录和使用平台功能' : '解封后该用户将恢复正常使用权限'}</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="py-4"><div className="p-4 bg-gray-50 rounded-lg"><div className="flex justify-between mb-2"><span className="text-gray-600">用户姓名</span><span className="font-semibold">{selectedUser.name}</span></div><div className="flex justify-between"><span className="text-gray-600">学号</span><span className="font-semibold">{selectedUser.username}</span></div></div></div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBanDialog(false)}>取消</Button>
            <Button variant={selectedUser?.status !== 1 ? 'destructive' : 'default'} className={selectedUser?.status === 1 ? 'bg-[#52C41A] hover:bg-[#45A817]' : ''} onClick={confirmToggleBan}>确认{selectedUser?.status !== 1 ? '封禁' : '解封'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showCreateAdminDialog} onOpenChange={setShowCreateAdminDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新建管理员</DialogTitle>
            <DialogDescription>创建新的管理员账户</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="admin-name">姓名 *</Label>
              <Input id="admin-name" placeholder="请输入管理员姓名" value={adminForm.name}
                onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-username">学号/工号 *</Label>
              <Input id="admin-username" placeholder="请输入学号或工号" value={adminForm.username}
                onChange={(e) => setAdminForm({ ...adminForm, username: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">密码 *</Label>
              <Input id="admin-password" type="password" placeholder="请设置密码（至少6位）" value={adminForm.password}
                onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateAdminDialog(false)}>取消</Button>
            <Button className="bg-[#165DFF] hover:bg-[#0E4FD4]" onClick={confirmCreateAdmin}>确认创建</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteAdminDialog} onOpenChange={setShowDeleteAdminDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[#FF5252]">删除管理员</DialogTitle>
            <DialogDescription>确认删除该管理员账户？此操作不可撤销</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="py-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between mb-2"><span className="text-gray-600">姓名</span><span className="font-semibold">{selectedUser.name}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">学号</span><span className="font-semibold">{selectedUser.username}</span></div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteAdminDialog(false)}>取消</Button>
            <Button variant="destructive" onClick={confirmDeleteAdmin}>确认删除</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
