import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Label } from "../../components/ui/label";
import { Search, UserCog, Ban, CheckCircle, Coins } from "lucide-react";
import { toast } from "sonner";

const mockUsers = [
  { id: '1', name: '张三', studentId: '2021001', email: 'zhangsan@example.com', points: 500, creditScore: 98, status: 'active', joinDate: '2026-01-15' },
  { id: '2', name: '李四', studentId: '2021002', email: 'lisi@example.com', points: 320, creditScore: 95, status: 'active', joinDate: '2026-01-18' },
  { id: '3', name: '王五', studentId: '2021003', email: 'wangwu@example.com', points: 680, creditScore: 100, status: 'active', joinDate: '2026-01-20' },
  { id: '4', name: '赵六', studentId: '2021004', email: 'zhaoliu@example.com', points: 150, creditScore: 85, status: 'banned', joinDate: '2026-02-01' },
  { id: '5', name: '孙七', studentId: '2021005', email: 'sunqi@example.com', points: 420, creditScore: 92, status: 'active', joinDate: '2026-02-10' },
];

export function UserManagement() {
  const [users, setUsers] = useState(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showPointsDialog, setShowPointsDialog] = useState(false);
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [pointsForm, setPointsForm] = useState({
    type: 'add',
    amount: '',
    reason: ''
  });

  const filteredUsers = users.filter(user => {
    const matchSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       user.studentId.includes(searchQuery) ||
                       user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handlePointsAdjust = (user: any) => {
    setSelectedUser(user);
    setPointsForm({ type: 'add', amount: '', reason: '' });
    setShowPointsDialog(true);
  };

  const confirmPointsAdjust = () => {
    const amount = parseInt(pointsForm.amount);
    const finalAmount = pointsForm.type === 'add' ? amount : -amount;
    
    toast.success(`${pointsForm.type === 'add' ? '发放' : '扣除'}积分成功`, {
      description: `已${pointsForm.type === 'add' ? '增加' : '减少'} ${selectedUser.name} ${Math.abs(finalAmount)} 积分`
    });
    
    setShowPointsDialog(false);
  };

  const handleToggleBan = (user: any) => {
    setSelectedUser(user);
    setShowBanDialog(true);
  };

  const confirmToggleBan = () => {
    const newStatus = selectedUser.status === 'active' ? 'banned' : 'active';
    setUsers(prev => prev.map(u => 
      u.id === selectedUser.id ? { ...u, status: newStatus } : u
    ));
    
    toast.success(
      newStatus === 'banned' ? '账号已封禁' : '账号已解封',
      { description: `用户 ${selectedUser.name} 的账号状态已更新` }
    );
    
    setShowBanDialog(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">用户管理</h1>
        <p className="text-gray-600">管理平台用户账号和积分</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-1">总用户数</p>
            <p className="text-3xl font-bold text-gray-900">{users.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-1">活跃用户</p>
            <p className="text-3xl font-bold text-[#52C41A]">
              {users.filter(u => u.status === 'active').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-1">封禁用户</p>
            <p className="text-3xl font-bold text-[#FF5252]">
              {users.filter(u => u.status === 'banned').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-1">平均积分</p>
            <p className="text-3xl font-bold text-[#FF7D00]">
              {Math.round(users.reduce((sum, u) => sum + u.points, 0) / users.length)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 搜索和筛选 */}
      <Card>
        <CardHeader>
          <CardTitle>用户列表</CardTitle>
          <CardDescription>查看和管理所有用户</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="搜索姓名、学号或邮箱..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="状态筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="active">正常</SelectItem>
                <SelectItem value="banned">已封禁</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>姓名</TableHead>
                <TableHead>学号</TableHead>
                <TableHead>邮箱</TableHead>
                <TableHead>积分</TableHead>
                <TableHead>信用分</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>注册时间</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.studentId}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className="font-semibold text-[#FF7D00]">{user.points}</span>
                  </TableCell>
                  <TableCell>
                    <span className={`font-semibold ${user.creditScore >= 90 ? 'text-[#52C41A]' : 'text-[#FF7D00]'}`}>
                      {user.creditScore}
                    </span>
                  </TableCell>
                  <TableCell>
                    {user.status === 'active' ? (
                      <Badge className="bg-[#52C41A] text-white border-0">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        正常
                      </Badge>
                    ) : (
                      <Badge className="bg-[#FF5252] text-white border-0">
                        <Ban className="w-3 h-3 mr-1" />
                        已封禁
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-500">{user.joinDate}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePointsAdjust(user)}
                      >
                        <Coins className="w-4 h-4 mr-1" />
                        积分
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={user.status === 'banned' ? 'text-[#52C41A]' : 'text-[#FF5252]'}
                        onClick={() => handleToggleBan(user)}
                      >
                        {user.status === 'active' ? '封禁' : '解封'}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              未找到相关用户
            </div>
          )}
        </CardContent>
      </Card>

      {/* 积分调整弹窗 */}
      <Dialog open={showPointsDialog} onOpenChange={setShowPointsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>积分调整</DialogTitle>
            <DialogDescription>
              手动调整用户积分
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">用户</span>
                  <span className="font-semibold">{selectedUser.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">当前积分</span>
                  <span className="font-semibold text-[#FF7D00]">{selectedUser.points}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>操作类型</Label>
                <Select value={pointsForm.type} onValueChange={(value) => setPointsForm({ ...pointsForm, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="add">发放积分</SelectItem>
                    <SelectItem value="deduct">扣除积分</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>积分数量</Label>
                <Input
                  type="number"
                  placeholder="请输入积分数量"
                  value={pointsForm.amount}
                  onChange={(e) => setPointsForm({ ...pointsForm, amount: e.target.value })}
                  min={1}
                />
              </div>

              <div className="space-y-2">
                <Label>调整原因</Label>
                <Input
                  placeholder="请输入调整原因"
                  value={pointsForm.reason}
                  onChange={(e) => setPointsForm({ ...pointsForm, reason: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPointsDialog(false)}>
              取消
            </Button>
            <Button 
              className="bg-[#165DFF] hover:bg-[#0E4FD4]" 
              onClick={confirmPointsAdjust}
              disabled={!pointsForm.amount || !pointsForm.reason}
            >
              确认调整
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 封禁/解封确认弹窗 */}
      <Dialog open={showBanDialog} onOpenChange={setShowBanDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className={selectedUser?.status === 'active' ? 'text-[#FF5252]' : 'text-[#52C41A]'}>
              {selectedUser?.status === 'active' ? '封禁账号' : '解封账号'}
            </DialogTitle>
            <DialogDescription>
              {selectedUser?.status === 'active' 
                ? '封禁后该用户将无法登录和使用平台功能' 
                : '解封后该用户将恢复正常使用权限'}
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="py-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">用户姓名</span>
                  <span className="font-semibold">{selectedUser.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">学号</span>
                  <span className="font-semibold">{selectedUser.studentId}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBanDialog(false)}>
              取消
            </Button>
            <Button 
              variant={selectedUser?.status === 'active' ? 'destructive' : 'default'}
              className={selectedUser?.status !== 'active' ? 'bg-[#52C41A] hover:bg-[#45A817]' : ''}
              onClick={confirmToggleBan}
            >
              确认{selectedUser?.status === 'active' ? '封禁' : '解封'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
