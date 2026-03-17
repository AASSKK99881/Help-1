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
import { 
  LayoutDashboard, 
  Users, 
  FileCheck, 
  Calendar, 
  Settings, 
  LogOut 
} from "lucide-react";
import { useEffect } from "react";

export function AdminLayout() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/admin/login', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* 侧边栏 */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen sticky top-0">
          <div className="p-6">
            <Link to="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#165DFF] flex items-center justify-center">
                <span className="text-white font-semibold">管</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">管理后台</span>
            </Link>
          </div>

          <nav className="px-3 space-y-1">
            <Link to="/admin">
              <Button 
                variant={isActive('/admin') ? "default" : "ghost"}
                className={`w-full justify-start ${isActive('/admin') ? 'bg-[#165DFF] hover:bg-[#0E4FD4]' : ''}`}
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                数据看板
              </Button>
            </Link>
            <Link to="/admin/users">
              <Button 
                variant={isActive('/admin/users') ? "default" : "ghost"}
                className={`w-full justify-start ${isActive('/admin/users') ? 'bg-[#165DFF] hover:bg-[#0E4FD4]' : ''}`}
              >
                <Users className="w-4 h-4 mr-2" />
                用户管理
              </Button>
            </Link>
            <Link to="/admin/review">
              <Button 
                variant={isActive('/admin/review') ? "default" : "ghost"}
                className={`w-full justify-start ${isActive('/admin/review') ? 'bg-[#165DFF] hover:bg-[#0E4FD4]' : ''}`}
              >
                <FileCheck className="w-4 h-4 mr-2" />
                内容审核
              </Button>
            </Link>
            <Link to="/admin/activities">
              <Button 
                variant={isActive('/admin/activities') ? "default" : "ghost"}
                className={`w-full justify-start ${isActive('/admin/activities') ? 'bg-[#165DFF] hover:bg-[#0E4FD4]' : ''}`}
              >
                <Calendar className="w-4 h-4 mr-2" />
                活动管理
              </Button>
            </Link>
            <Link to="/admin/settings">
              <Button 
                variant={isActive('/admin/settings') ? "default" : "ghost"}
                className={`w-full justify-start ${isActive('/admin/settings') ? 'bg-[#165DFF] hover:bg-[#0E4FD4]' : ''}`}
              >
                <Settings className="w-4 h-4 mr-2" />
                系统设置
              </Button>
            </Link>
          </nav>

          <div className="absolute bottom-6 left-3 right-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start">
                  <Avatar className="w-8 h-8 mr-2">
                    <AvatarFallback className="bg-[#165DFF] text-white">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left flex-1">
                    <div className="font-medium text-sm">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.teacherId}</div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>管理员账户</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </aside>

        {/* 主内容区域 */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
