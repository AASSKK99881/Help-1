import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Users, FileText, CheckCircle, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { adminApi, AdminStats } from "../../api/admin";

export function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    adminApi.getStats().then(res => {
      if (res?.data) setStats(res.data);
    }).catch(console.error);
  }, []);

  const statsData = [
    { label: '总用户数', value: String(stats?.totalUsers || 0), icon: Users, color: 'text-[#165DFF]', bg: 'bg-blue-50' },
    { label: '总任务数', value: String(stats?.totalTasks || 0), icon: FileText, color: 'text-[#36CFC9]', bg: 'bg-cyan-50' },
    { label: '进行中', value: String(stats?.inProgress || 0), icon: CheckCircle, color: 'text-[#FF7D00]', bg: 'bg-orange-50' },
    { label: '已完成', value: String(stats?.completedTasks || 0), icon: TrendingUp, color: 'text-[#52C41A]', bg: 'bg-green-50' },
  ];

  const chartData = [
    { name: '总用户', value: stats?.totalUsers || 0 },
    { name: '总任务', value: stats?.totalTasks || 0 },
    { name: '进行中', value: stats?.inProgress || 0 },
    { name: '已完成', value: stats?.completedTasks || 0 },
    { name: '今日新增', value: stats?.todayTasks || 0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">数据看板</h1>
        <p className="text-gray-600">平台运营数据总览</p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {statsData.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bg}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>数据趋势</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#165DFF" strokeWidth={2} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>快捷操作</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-blue-50 hover:bg-blue-100 cursor-pointer transition-colors"
            onClick={() => navigate('/admin/users')}>
            <h4 className="font-semibold text-[#165DFF] mb-1">用户管理</h4>
            <p className="text-sm text-gray-600">查看和管理用户账号</p>
          </div>
          <div className="p-4 rounded-lg bg-orange-50 hover:bg-orange-100 cursor-pointer transition-colors"
            onClick={() => navigate('/admin/review')}>
            <h4 className="font-semibold text-[#FF7D00] mb-1">内容审核</h4>
            <p className="text-sm text-gray-600">审核待发布的需求</p>
          </div>
          <div className="p-4 rounded-lg bg-green-50 hover:bg-green-100 cursor-pointer transition-colors"
            onClick={() => navigate('/admin/activities')}>
            <h4 className="font-semibold text-[#52C41A] mb-1">活动管理</h4>
            <p className="text-sm text-gray-600">发布和管理平台活动</p>
          </div>
          <div className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
            onClick={() => navigate('/admin/settings')}>
            <h4 className="font-semibold text-gray-700 mb-1">系统设置</h4>
            <p className="text-sm text-gray-600">配置平台规则参数</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
