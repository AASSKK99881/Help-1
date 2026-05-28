import { useState, useEffect } from "react"; 
import { useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { authApi } from "../../api/auth"; // 引入注册 API
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
  
  // 用于切换 Tabs
  const [activeTab, setActiveTab] = useState("login");
  
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user?.role === 'student') {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  if (isAuthenticated && user?.role === 'student') {
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(loginForm.email, loginForm.password, 'student');
      toast.success('登录成功！');
      navigate('/');
    } catch (error) {
      toast.error('登录失败，请检查账号或密码');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      toast.error('两次输入的密码不一致');
      return;
    }
    
    // 🎯 核心修改：调用真实的后端注册 API
    try {
      await authApi.register({
        name: registerForm.name,
        studentId: registerForm.studentId,
        password: registerForm.password,
        contactInfo: registerForm.email
      });
      toast.success('注册成功，请切换到登录页进行登录');
      setActiveTab("login"); // 注册成功后自动切回登录页面
    } catch (error: any) {
      toast.error(error?.response?.data?.message || '注册失败，该学号/邮箱可能已被注册');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-xl bg-[#165DFF] flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-200">
            校
          </div>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          校园积分互助平台
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          学生端登录
        </p>
      </div>

      <Card className="max-w-md mx-auto w-full shadow-xl border-0">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-2xl font-bold text-center">欢迎回来</CardTitle>
          <CardDescription className="text-center">
            通过邮箱登录或注册新账号
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 p-1">
              <TabsTrigger value="login">登录</TabsTrigger>
              <TabsTrigger value="register">注册</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">学号/邮箱地址</Label>
                  <Input 
                    id="email" 
                    placeholder="请输入你的学号或邮箱" 
                    required 
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">密码</Label>
                    <Button variant="link" className="px-0 font-normal text-xs text-[#165DFF]">
                      忘记密码？
                    </Button>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    required 
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full bg-[#165DFF] hover:bg-[#0E4FD4] h-11 text-base mt-2">
                  立即登录
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">姓名</Label>
                    <Input 
                      id="name" 
                      required 
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="studentId">学号</Label>
                    <Input 
                      id="studentId" 
                      required 
                      value={registerForm.studentId}
                      onChange={(e) => setRegisterForm({ ...registerForm, studentId: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email">邮箱地址</Label>
                  <Input 
                    id="reg-email" 
                    type="email" 
                    required 
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">设置密码</Label>
                  <Input 
                    id="reg-password" 
                    type="password" 
                    required 
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">确认密码</Label>
                  <Input 
                    id="confirm-password" 
                    type="password" 
                    required 
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                  />
                </div>
                <div className="flex items-start space-x-2 mt-4">
                  <Checkbox 
                    id="agree" 
                    checked={registerForm.agreed}
                    onCheckedChange={(checked) => setRegisterForm({ ...registerForm, agreed: checked as boolean })}
                  />
                  <label htmlFor="agree" className="text-xs text-gray-500 leading-tight">
                    我已阅读并同意
                    <Button variant="link" type="button" className="text-[#165DFF] p-0 h-auto mx-1 text-xs">
                      《用户协议》
                    </Button>
                    和
                    <Button variant="link" type="button" className="text-[#165DFF] p-0 h-auto ml-1 text-xs">
                      《隐私政策》
                    </Button>
                  </label>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-[#165DFF] hover:bg-[#0E4FD4] h-11 text-base mt-4"
                  disabled={!registerForm.agreed}
                >
                  创建账号
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          教师或管理员？
          <Button 
            variant="link" 
            className="text-[#165DFF] p-0 h-auto ml-1 text-sm font-semibold"
            onClick={() => navigate('/admin/login')}
          >
            点击此处前往后台管理系统
          </Button>
        </p>
      </div>
    </div>
  );
}