import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Switch } from "../../components/ui/switch";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { InfoIcon } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../contexts/AuthContext";
import { tasksApi } from "../../api/tasks";

export function CreateTask() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '',
    category: '',
    description: '',
    points: '',
    deadline: '',
    isAnonymous: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const pointsNum = parseInt(form.points);
    if (pointsNum > (user?.points || 0)) {
      toast.error('积分不足，请降低悬赏积分');
      return;
    }

    setSubmitting(true);
    try {
      const res = await tasksApi.createTask({
        title: form.title,
        description: form.description,
        pointsReward: pointsNum,
        category: form.category,
        deadline: form.deadline,
        isAnonymous: form.isAnonymous ? 1 : 0,
      });

      const reviewMsg = res?.data?.reviewMessage || '';

      if (reviewMsg.startsWith('审核通过')) {
        toast.success('发布成功！' + reviewMsg);
      } else {
        toast.warning('提交成功，' + reviewMsg);
      }

      setTimeout(() => {
        navigate('/my-tasks');
      }, 2000);
    } catch (err) {
      toast.error('提交失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">发布互助需求</CardTitle>
          <CardDescription>填写需求信息，发布后需等待教师审核</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">需求标题 *</Label>
              <Input
                id="title"
                placeholder="简明扼要地描述你的需求"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                maxLength={50}
              />
              <p className="text-sm text-gray-500">{form.title.length}/50</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">需求分类 *</Label>
              <Select value={form.category} onValueChange={(value) => setForm({ ...form, category: value })}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="请选择分类" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="学习辅导">学习辅导</SelectItem>
                  <SelectItem value="技术开发">技术开发</SelectItem>
                  <SelectItem value="设计美化">设计美化</SelectItem>
                  <SelectItem value="生活帮助">生活帮助</SelectItem>
                  <SelectItem value="活动协助">活动协助</SelectItem>
                  <SelectItem value="其他">其他</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">详细描述 *</Label>
              <Textarea
                id="description"
                placeholder="详细描述你的需求，包括具体要求、注意事项等"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
                rows={6}
                maxLength={500}
              />
              <p className="text-sm text-gray-500">{form.description.length}/500</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="points">悬赏积分 *</Label>
                <Input
                  id="points"
                  type="number"
                  placeholder="请输入积分"
                  value={form.points}
                  onChange={(e) => setForm({ ...form, points: e.target.value })}
                  required
                  min={10}
                  max={user?.points || 0}
                />
                <p className="text-sm text-gray-500">当前可用积分: {user?.points}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">截止时间 *</Label>
                <Input
                  id="deadline"
                  type="datetime-local"
                  value={form.deadline}
                  onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                  required
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <Label htmlFor="anonymous">匿名发布</Label>
                <p className="text-sm text-gray-500">开启后其他用户将看不到你的身份信息</p>
              </div>
              <Switch
                id="anonymous"
                checked={form.isAnonymous}
                onCheckedChange={(checked) => setForm({ ...form, isAnonymous: checked })}
              />
            </div>

            <Alert className="bg-blue-50 border-blue-200">
              <InfoIcon className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong className="block mb-1">发布规则提示：</strong>
                <ul className="space-y-1 text-sm">
                  <li>• 发布的需求需经过教师审核，审核通过后方可展示</li>
                  <li>• 悬赏积分将在审核通过时扣除，任务完成后自动转给接单者</li>
                  <li>• 发布后可随时取消，但进行中取消会扣除20%违约金</li>
                  <li>• 请确保需求内容真实合法，不得发布违规信息</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" className="flex-1" onClick={() => navigate('/')}>
                取消
              </Button>
              <Button type="submit" className="flex-1 bg-[#165DFF] hover:bg-[#0E4FD4]" disabled={submitting}>
                {submitting ? '提交中...' : '提交审核'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
