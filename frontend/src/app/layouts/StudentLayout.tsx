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
import { Home, ListTodo, PlusCircle, User, Bell, LogOut, CalendarDays } from "lucide-react";
import { useEffect } from "react";

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
              <Link to="/activities">
                <Button
                  variant={isActive('/activities') ? "default" : "ghost"}
                  className={isActive('/activities') ? "bg-[#165DFF] hover:bg-[#0E4FD4]" : ""}
                >
                  <CalendarDays className="w-4 h-4 mr-2" />
                  校园活动
                </Button>
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/messages')} className="relative">
              <Bell className="w-5 h-5" />
              {/* 通知数量后续从后端获取 */}
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
    </div>
  );
}