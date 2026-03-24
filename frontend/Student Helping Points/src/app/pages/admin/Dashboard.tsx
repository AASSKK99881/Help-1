import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Users, FileText, CheckCircle, TrendingUp } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";

const statsData = [
  { label: '总用户数', value: '10,234', change: '+12%', icon: Users, color: 'text-[#165DFF]', bg: 'bg-blue-50' },
  { label: '今日发布', value: '156', change: '+8%', icon: FileText, color: 'text-[#36CFC9]', bg: 'bg-cyan-50' },
  { label: '待审核', value: '23', change: '-5%', icon: CheckCircle, color: 'text-[#FF7D00]', bg: 'bg-orange-50' },
  { label: '完成任务', value: '8,567', change: '+15%', icon: TrendingUp, color: 'text-[#52C41A]', bg: 'bg-green-50' },
];

const weeklyData = [
  { name: '周一', tasks: 45, users: 120 },
  { name: '周二', tasks: 52, users: 135 },
  { name: '周三', tasks: 48, users: 128 },
  { name: '周四', tasks: 61, users: 145 },
  { name: '周五', tasks: 55, users: 142 },
  { name: '周六', tasks: 38, users: 98 },
  { name: '周日', tasks: 42, users: 105 },
];

const categoryData = [
  { name: '学习辅导', value: 35, color: '#52C41A' },
  { name: '技术开发', value: 25, color: '#FF7D00' },
  { name: '设计美化', value: 20, color: '#FF5252' },
  { name: '生活帮助', value: 15, color: '#36CFC9' },
  { name: '其他', value: 5, color: '#165DFF' },
];

const recentActivities = [
  { user: '张三', action: '发布了需求', task: '高数题目讲解', time: '5分钟前' },
  { user: '李四', action: '接取了任务', task: 'PPT设计美化', time: '10分钟前' },
  { user: '王五', action: '完成了任务', task: 'Python代码调试', time: '15分钟前' },
  { user: '赵六', action: '注册了账号', task: '-', time: '20分钟前' },
  { user: '孙七', action: '发布了需求', task: '英语作文批改', time: '25分钟前' },
];

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">数据看板</h1>
        <p className="text-gray-600">平台运营数据总览</p>
      </div>

      {/* 统计卡片 */}
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
                    <p className={`text-sm ${stat.change.startsWith('+') ? 'text-[#52C41A]' : 'text-[#FF5252]'}`}>
                      {stat.change} 较上周
                    </p>
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

      <div className="grid grid-cols-3 gap-6">
        {/* 每周趋势 */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>每周数据趋势</CardTitle>
            <CardDescription>任务发布量与活跃用户数</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="tasks" stroke="#165DFF" name="任务数" strokeWidth={2} />
                <Line type="monotone" dataKey="users" stroke="#36CFC9" name="活跃用户" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 分类占比 */}
        <Card>
          <CardHeader>
            <CardTitle>需求分类分布</CardTitle>
            <CardDescription>各类别任务占比</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* 最近活动 */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>最近活动</CardTitle>
            <CardDescription>实时平台动态</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0">
                  <div className="w-2 h-2 rounded-full bg-[#165DFF] mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-semibold">{activity.user}</span>
                      {' '}{activity.action}
                      {activity.task !== '-' && (
                        <span className="text-[#165DFF]">《{activity.task}》</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 快捷操作 */}
        <Card>
          <CardHeader>
            <CardTitle>快捷操作</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="p-4 rounded-lg bg-blue-50 hover:bg-blue-100 cursor-pointer transition-colors">
              <h4 className="font-semibold text-[#165DFF] mb-1">用户管理</h4>
              <p className="text-sm text-gray-600">查看和管理用户账号</p>
            </div>
            <div className="p-4 rounded-lg bg-orange-50 hover:bg-orange-100 cursor-pointer transition-colors">
              <h4 className="font-semibold text-[#FF7D00] mb-1">内容审核</h4>
              <p className="text-sm text-gray-600">审核待发布的需求</p>
            </div>
            <div className="p-4 rounded-lg bg-green-50 hover:bg-green-100 cursor-pointer transition-colors">
              <h4 className="font-semibold text-[#52C41A] mb-1">活动管理</h4>
              <p className="text-sm text-gray-600">发布和管理平台活动</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
              <h4 className="font-semibold text-gray-700 mb-1">系统设置</h4>
              <p className="text-sm text-gray-600">配置平台规则参数</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
