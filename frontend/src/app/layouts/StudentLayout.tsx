import { Outlet, Link, useNavigate, useLocation } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Home, ListTodo, PlusCircle, User, Bell, LogOut } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { useEffect } from "react";

// ✨ 新增：引入我们刚刚写好的 AI 组件
import { AIPageSummary } from "../components/AIPageSummary";

export function StudentLayout() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'student') {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || user?.role !== 'student') {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  // ✨ 新增：将路由路径映射为中文页面名称，传给 AI 模型使用
  const getPageName = (pathname: string) => {
    if (pathname.includes('/my-tasks')) return '我的委托';
    if (pathname.includes('/create-task')) return '发布需求';
    if (pathname.includes('/messages')) return '消息通知';
    if (pathname.includes('/profile')) return '个人中心';
    if (pathname.includes('/points-history')) return '积分明细';
    if (pathname.includes('/task')) return '任务详情';
    return '首页大厅';
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* 顶部导航栏 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#165DFF] flex items-center justify-center">
                <span className="text-white font-semibold">校</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">校园积分互助</span>
            </Link>
            
            <nav className="flex items-center gap-1">
              <Link to="/">
                <Button 
                  variant={isActive('/') ? "default" : "ghost"}
                  className={isActive('/') ? "bg-[#165DFF] hover:bg-[#0E4FD4]" : ""}
                >
                  <Home className="w-4 h-4 mr-2" />
                  首页
                </Button>
              </Link>
              <Link to="/my-tasks">
                <Button 
                  variant={isActive('/my-tasks') ? "default" : "ghost"}
                  className={isActive('/my-tasks') ? "bg-[#165DFF] hover:bg-[#0E4FD4]" : ""}
                >
                  <ListTodo className="w-4 h-4 mr-2" />
                  我的委托
                </Button>
              </Link>
              <Link to="/create-task">
                <Button 
                  variant={isActive('/create-task') ? "default" : "ghost"}
                  className={isActive('/create-task') ? "bg-[#165DFF] hover:bg-[#0E4FD4]" : ""}
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  发布需求
                </Button>
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/messages')} className="relative">
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-[#FF5252] text-white border-0">
                3
              </Badge>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 h-auto py-2 px-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-[#165DFF] text-white">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <div className="font-medium text-sm">{user.name}</div>
                    <div className="text-xs text-gray-500">积分: {user.points}</div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>我的账户</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="w-4 h-4 mr-2" />
                  个人中心
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/points-history')}>
                  <span className="w-4 h-4 mr-2">💰</span>
                  积分明细
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* 主内容区域 */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        <Outlet />
      </main>

      {/* ✨ 新增：把 AI 助手挂载到全局页面的最外层（因为它带有 fixed 定位） */}
      <AIPageSummary pageName={getPageName(location.pathname)} />
    </div>
  );
}