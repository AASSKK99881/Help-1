import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
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
import { Coins, Award, TrendingUp, Edit, Save, X, Bell, HelpCircle, Settings, History } from "lucide-react";
import { toast } from "sonner";

export function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const handleSave = () => {
    toast.success('个人信息已更新');
    setIsEditing(false);
  };

  const stats = [
    { label: '当前积分', value: user?.points || 0, icon: Coins, color: 'text-[#FF7D00]', bg: 'bg-orange-50' },
    { label: '信用分', value: 98, icon: Award, color: 'text-[#52C41A]', bg: 'bg-green-50' },
    { label: '完成任务', value: 12, icon: TrendingUp, color: 'text-[#165DFF]', bg: 'bg-blue-50' },
  ];

  const menuItems = [
    { 
      icon: History, 
      label: '积分明细', 
      description: '查看积分收支记录',
      action: () => navigate('/points-history')
    },
    { 
      icon: Bell, 
      label: '消息中心', 
      description: '查看系统通知和私信',
      action: () => navigate('/messages')
    },
    { 
      icon: HelpCircle, 
      label: '帮助中心', 
      description: '使用指南和常见问题',
      action: () => toast.info('帮助中心开发中')
    },
    { 
      icon: Settings, 
      label: '账号设置', 
      description: '修改密码、隐私设置',
      action: () => toast.info('账号设置开发中')
    },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">个人中心</h1>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* 左侧信息卡片 */}
        <div className="col-span-1 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarFallback className="bg-[#165DFF] text-white text-3xl">
                    {user?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold mb-1">{user?.name}</h2>
                <p className="text-sm text-gray-500 mb-4">学号: {user?.studentId}</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  编辑资料
                </Button>
              </div>

              <Separator className="my-6" />

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="w-16 shrink-0">邮箱</span>
                  <span className="truncate">{user?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="w-16 shrink-0">手机</span>
                  <span>{user?.phone}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 数据统计 */}
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 text-gray-900">我的数据</h3>
              <div className="space-y-4">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className={`flex items-center justify-between p-3 rounded-lg ${stat.bg}`}>
                      <div className="flex items-center gap-2">
                        <Icon className={`w-5 h-5 ${stat.color}`} />
                        <span className="text-sm text-gray-700">{stat.label}</span>
                      </div>
                      <span className={`text-xl font-bold ${stat.color}`}>{stat.value}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右侧功能入口 */}
        <div className="col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>功能中心</CardTitle>
              <CardDescription>快捷访问常用���能</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Card 
                      key={item.label}
                      className="cursor-pointer hover:shadow-md hover:border-[#165DFF] transition-all"
                      onClick={item.action}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-blue-50">
                            <Icon className="w-5 h-5 text-[#165DFF]" />
                          </div>
                          <div>
                            <h4 className="font-semibold mb-1">{item.label}</h4>
                            <p className="text-sm text-gray-500">{item.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* 最近活动 */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>最近活动</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: '完成任务', task: '高数题目讲解', points: '+50', time: '2小时前' },
                  { action: '发布需求', task: '帮忙代取快递', points: '-20', time: '5小时前' },
                  { action: '接取任务', task: 'PPT设计美化', points: '0', time: '1天前' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{activity.action}</div>
                      <div className="text-sm text-gray-500">{activity.task}</div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${activity.points.startsWith('+') ? 'text-[#52C41A]' : activity.points.startsWith('-') ? 'text-[#FF5252]' : 'text-gray-500'}`}>
                        {activity.points !== '0' && activity.points}
                      </div>
                      <div className="text-xs text-gray-500">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 编辑资料弹窗 */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑个人资料</DialogTitle>
            <DialogDescription>
              修改你的个人信息
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">姓名</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">邮箱</Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">手机号</Label>
              <Input
                id="edit-phone"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              <X className="w-4 h-4 mr-2" />
              取消
            </Button>
            <Button className="bg-[#165DFF] hover:bg-[#0E4FD4]" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
