import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Switch } from "../../components/ui/switch";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { 
  Settings, 
  Shield, 
  FileText, 
  Plus, 
  Trash2,
  Save
} from "lucide-react";
import { toast } from "sonner";
import { adminApi, SensitiveWord } from "../../api/admin";

export function SystemSettings() {
  const [settings, setSettings] = useState({
    minPoints: '10',
    maxPoints: '1000',
    cancelPenalty: '20',
    newUserPoints: '100',
    autoApprove: false,
    allowAnonymous: true
  });

  const [sensitiveWords, setSensitiveWords] = useState<SensitiveWord[]>([]);
  const [newWord, setNewWord] = useState('');

  const [operationLogs] = useState<any[]>([]);

  useEffect(() => {
    adminApi.getKeywords().then(res => {
      if (res?.data) setSensitiveWords(res.data);
    }).catch(() => {});
  }, []);

  const handleSaveSettings = () => {
    toast.success('设置已保存', {
      description: '系统参数已更新'
    });
  };

  const handleAddWord = async () => {
    if (!newWord.trim()) return;
    try {
      const res = await adminApi.addKeyword(newWord.trim());
      if (res?.data) {
        setSensitiveWords(prev => [...prev, res.data]);
        setNewWord('');
        toast.success('敏感词已添加');
      }
    } catch {
      toast.error('添加失败，可能已存在');
    }
  };

  const handleRemoveWord = async (word: SensitiveWord) => {
    try {
      await adminApi.deleteKeyword(word.id);
      setSensitiveWords(prev => prev.filter(w => w.id !== word.id));
      toast.success('敏感词已删除');
    } catch {
      toast.error('删除失败');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">系统设置</h1>
        <p className="text-gray-600">配置平台规则和参数</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* 左侧配置区域 */}
        <div className="col-span-2 space-y-6">
          {/* 积分规则设置 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                积分规则设置
              </CardTitle>
              <CardDescription>配置积分相关参数</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min-points">最低悬赏积分</Label>
                  <Input
                    id="min-points"
                    type="number"
                    value={settings.minPoints}
                    onChange={(e) => setSettings({ ...settings, minPoints: e.target.value })}
                  />
                  <p className="text-sm text-gray-500">用户发布需求时的最低积分要求</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-points">最高悬赏积分</Label>
                  <Input
                    id="max-points"
                    type="number"
                    value={settings.maxPoints}
                    onChange={(e) => setSettings({ ...settings, maxPoints: e.target.value })}
                  />
                  <p className="text-sm text-gray-500">单次任务悬赏的最高积分限制</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cancel-penalty">违约扣除比例 (%)</Label>
                  <Input
                    id="cancel-penalty"
                    type="number"
                    value={settings.cancelPenalty}
                    onChange={(e) => setSettings({ ...settings, cancelPenalty: e.target.value })}
                  />
                  <p className="text-sm text-gray-500">取消已接单任务时的扣除比例</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-user-points">新用户赠送积分</Label>
                  <Input
                    id="new-user-points"
                    type="number"
                    value={settings.newUserPoints}
                    onChange={(e) => setSettings({ ...settings, newUserPoints: e.target.value })}
                  />
                  <p className="text-sm text-gray-500">新注册用户获得的初始积分</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="auto-approve">自动审核通过</Label>
                    <p className="text-sm text-gray-500">开启后新发布的需求将自动通过审核</p>
                  </div>
                  <Switch
                    id="auto-approve"
                    checked={settings.autoApprove}
                    onCheckedChange={(checked) => setSettings({ ...settings, autoApprove: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="allow-anonymous">允许匿名发布</Label>
                    <p className="text-sm text-gray-500">允许用户匿名发布需求</p>
                  </div>
                  <Switch
                    id="allow-anonymous"
                    checked={settings.allowAnonymous}
                    onCheckedChange={(checked) => setSettings({ ...settings, allowAnonymous: checked })}
                  />
                </div>
              </div>

              <Button className="w-full bg-[#165DFF] hover:bg-[#0E4FD4]" onClick={handleSaveSettings}>
                <Save className="w-4 h-4 mr-2" />
                保存设置
              </Button>
            </CardContent>
          </Card>

          {/* 敏感词管理 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                敏感词管理
              </CardTitle>
              <CardDescription>添加和管理内容审核敏感词</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="输入敏感词"
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddWord()}
                />
                <Button onClick={handleAddWord}>
                  <Plus className="w-4 h-4 mr-2" />
                  添加
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {sensitiveWords.map((sw) => (
                  <Badge key={sw.id} variant="secondary" className="px-3 py-1">
                    {sw.word}
                    <button
                      onClick={() => handleRemoveWord(sw)}
                      className="ml-2 hover:text-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>

              {sensitiveWords.length === 0 && (
                <p className="text-center py-8 text-gray-500">暂无敏感词</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 右侧操作日志 */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                操作日志
              </CardTitle>
              <CardDescription>最近的管理操作记录</CardDescription>
            </CardHeader>
            <CardContent>
              {operationLogs.length > 0 ? (
                <div className="space-y-4">
                  {operationLogs.map((log, index) => (
                    <div key={log.id}>
                      {index > 0 && <Separator className="my-4" />}
                      <div className="space-y-1">
                        <div className="flex items-start justify-between">
                          <span className="font-medium text-sm">{log.admin}</span>
                          <span className="text-xs text-gray-500">{log.time}</span>
                        </div>
                        <div className="text-sm text-gray-600">{log.action}</div>
                        <div className="text-xs text-gray-500">{log.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 text-sm">暂无操作记录</div>
              )}
            </CardContent>
          </Card>

          <Card className="mt-6 bg-blue-50 border-blue-200">
            <CardContent className="p-4 space-y-3">
              <h4 className="font-semibold text-blue-900">系统信息</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-800">平台版本</span>
                  <span className="font-semibold text-blue-900">v1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-800">最后更新</span>
                  <span className="font-semibold text-blue-900">2026-03-16</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-800">数据库</span>
                  <Badge className="bg-[#52C41A] text-white border-0">正常</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
