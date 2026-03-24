import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Checkbox } from "../../components/ui/checkbox";
import { toast } from "sonner";

export function StudentLogin() {
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    name: '',
    studentId: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreed: false
  });
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // 如果已登录且是学生，重定向到首页
  if (isAuthenticated && user?.role === 'student') {
    navigate('/', { replace: true });
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(loginForm.email, loginForm.password, 'student');
      toast.success('登录成功！');
      navigate('/');
    } catch (error) {
      toast.error('登录失败，请检查账号密码');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerForm.password !== registerForm.confirmPassword) {
      toast.error('两次输入的密码不一致');
      return;
    }
    
    if (!registerForm.agreed) {
      toast.error('请先阅读并同意用户协议');
      return;
    }

    try {
      // 模拟注册成功后自动登录
      await login(registerForm.email, registerForm.password, 'student');
      toast.success('注册成功！');
      navigate('/');
    } catch (error) {
      toast.error('注册失败，请重试');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#165DFF] mb-4">
            <span className="text-3xl text-white font-bold">校</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">校园积分互助平台</h1>
          <p className="text-gray-600">让互帮互助成为校园新风尚</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>欢迎回来</CardTitle>
            <CardDescription>登录或注册您的学生账号</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">登录</TabsTrigger>
                <TabsTrigger value="register">注册</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">学号/邮箱</Label>
                    <Input
                      id="login-email"
                      type="text"
                      placeholder="请输入学号或邮箱"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">密码</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="请输入密码"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="remember" />
                      <label htmlFor="remember" className="text-sm text-gray-600">
                        记住我
                      </label>
                    </div>
                    <Button variant="link" type="button" className="text-[#165DFF] p-0 h-auto">
                      忘记密码？
                    </Button>
                  </div>

                  <Button type="submit" className="w-full bg-[#165DFF] hover:bg-[#0E4FD4]">
                    登录
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">姓名</Label>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="请输入真实姓名"
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-student-id">学号</Label>
                    <Input
                      id="register-student-id"
                      type="text"
                      placeholder="请输入学号"
                      value={registerForm.studentId}
                      onChange={(e) => setRegisterForm({ ...registerForm, studentId: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">邮箱</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="请输入邮箱"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">密码</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="请设置密码（至少6位）"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                      required
                      minLength={6}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password">确认密码</Label>
                    <Input
                      id="register-confirm-password"
                      type="password"
                      placeholder="请再次输入密码"
                      value={registerForm.confirmPassword}
                      onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                      required
                    />
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="agree" 
                      checked={registerForm.agreed}
                      onCheckedChange={(checked) => setRegisterForm({ ...registerForm, agreed: checked as boolean })}
                    />
                    <label htmlFor="agree" className="text-sm text-gray-600 leading-tight">
                      我已阅读并同意
                      <Button variant="link" type="button" className="text-[#165DFF] p-0 h-auto mx-1">
                        《用户协议》
                      </Button>
                      和
                      <Button variant="link" type="button" className="text-[#165DFF] p-0 h-auto ml-1">
                        《隐私政策》
                      </Button>
                    </label>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-[#165DFF] hover:bg-[#0E4FD4]"
                    disabled={!registerForm.agreed}
                  >
                    注册
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-600 mt-6">
          教师/管理员请
          <Button 
            variant="link" 
            className="text-[#165DFF] p-0 h-auto ml-1"
            onClick={() => navigate('/admin/login')}
          >
            前往后台登录
          </Button>
        </p>
      </div>
    </div>
  );
}
