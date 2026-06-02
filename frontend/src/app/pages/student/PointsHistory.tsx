import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Coins, TrendingUp, TrendingDown, Info, Calendar } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { userApi, PointsLog } from "../../api/user";

export function PointsHistory() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<PointsLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRulesDialog, setShowRulesDialog] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  useEffect(() => {
    userApi.getPointsHistory().then(res => {
      setLogs(res?.data?.list || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filteredLogs = logs.filter(item => {
    if (filterType === 'all') return true;
    return filterType === 'income' ? item.amount > 0 : item.amount < 0;
  });

  const totalIncome = logs.filter(item => item.amount > 0).reduce((sum, item) => sum + item.amount, 0);
  const totalExpense = Math.abs(logs.filter(item => item.amount < 0).reduce((sum, item) => sum + item.amount, 0));

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">积分明细</h1>
          <p className="text-gray-600">查看你的积分收支记录</p>
        </div>
        <Button variant="outline" onClick={() => setShowRulesDialog(true)}>
          <Info className="w-4 h-4 mr-2" />积分规则
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-gray-600 mb-1">当前积分</p><p className="text-3xl font-bold text-[#FF7D00]">{user?.points}</p></div>
              <div className="p-3 rounded-full bg-orange-100"><Coins className="w-8 h-8 text-[#FF7D00]" /></div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-gray-600 mb-1">累计收入</p><p className="text-3xl font-bold text-[#52C41A]">+{totalIncome}</p></div>
              <div className="p-3 rounded-full bg-green-100"><TrendingUp className="w-8 h-8 text-[#52C41A]" /></div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-gray-600 mb-1">累计支出</p><p className="text-3xl font-bold text-[#FF5252]">-{totalExpense}</p></div>
              <div className="p-3 rounded-full bg-red-100"><TrendingDown className="w-8 h-8 text-[#FF5252]" /></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>流水明细</CardTitle>
            <Tabs value={filterType} onValueChange={(v) => setFilterType(v as any)}>
              <TabsList>
                <TabsTrigger value="all">全部</TabsTrigger>
                <TabsTrigger value="income">收入</TabsTrigger>
                <TabsTrigger value="expense">支出</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12 text-gray-500">加载中...</div>
          ) : (
            <div className="space-y-3">
              {filteredLogs.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors border">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-2 rounded-lg ${item.amount > 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                      {item.amount > 0 ? <TrendingUp className="w-5 h-5 text-[#52C41A]" /> : <TrendingDown className="w-5 h-5 text-[#FF5252]" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 mb-1">{item.type}</div>
                      <div className="text-sm text-gray-500">{item.description || ''}</div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <Calendar className="w-3 h-3" />{item.createdAt}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xl font-bold ${item.amount > 0 ? 'text-[#52C41A]' : 'text-[#FF5252]'}`}>
                      {item.amount > 0 ? '+' : ''}{item.amount}
                    </div>
                  </div>
                </div>
              ))}
              {filteredLogs.length === 0 && <div className="text-center py-12 text-gray-500">暂无相关记录</div>}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showRulesDialog} onOpenChange={setShowRulesDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>积分规则说明</DialogTitle></DialogHeader>
          <div className="space-y-6 py-4">
            <div>
              <h3 className="font-semibold text-[#52C41A] mb-3 flex items-center gap-2"><TrendingUp className="w-5 h-5" />如何获得积分</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><strong>完成任务：</strong>帮助他人完成需求后，获得对方悬赏的积分</li>
                <li><strong>新用户注册：</strong>首次注册赠送积分</li>
                <li><strong>活动奖励：</strong>参与平台活动获得奖励积分</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-[#FF5252] mb-3 flex items-center gap-2"><TrendingDown className="w-5 h-5" />积分消耗规则</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><strong>发布需求：</strong>设置悬赏积分，审核通过后积分冻结</li>
                <li><strong>取消任务：</strong>进行中取消将扣除20%违约金</li>
                <li><strong>违规处罚：</strong>发布违规内容将被扣除积分</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
