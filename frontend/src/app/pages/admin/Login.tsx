import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { ShieldCheck, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // 如果已登录且是管理员，重定向到管理后台
  if (isAuthenticated && user?.role === 'admin') {
    navigate('/admin', { replace: true });
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(form.email, form.password, 'admin');
      toast.success('登录成功！');
      navigate('/admin');
    } catch (error) {
      toast.error('登录失败，请检查工号和密码');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#165DFF] mb-4">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">管理后台</h1>
          <p className="text-gray-400">校园积分互助平台 - 教师端</p>
        </div>

        <Card className="shadow-2xl">
          <CardHeader>
            <CardTitle>管理员登录</CardTitle>
            <CardDescription>请使用教师工号登录后台系统</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6 border-amber-200 bg-amber-50">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                本系统仅供授权教师使用，请妥善保管账号信息
              </AlertDescription>
            </Alert>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">教师工号</Label>
                <Input
                  id="admin-email"
                  type="text"
                  placeholder="请输入教师工号"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-password">密码</Label>
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="请输入密码"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-[#165DFF] hover:bg-[#0E4FD4]">
                登录后台
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-400 mt-6">
          学生用户请
          <Button 
            variant="link" 
            className="text-[#165DFF] p-0 h-auto ml-1"
            onClick={() => navigate('/login')}
          >
            返回学生端登录
          </Button>
        </p>
      </div>
    </div>
  );
}
