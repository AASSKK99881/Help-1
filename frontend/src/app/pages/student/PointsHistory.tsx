import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Coins, TrendingUp, TrendingDown, Info, Calendar } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const pointsHistory = [
  {
    id: '1',
    type: 'income',
    amount: 50,
    reason: '完成任务：高数题目讲解',
    date: '2026-03-16 18:30',
    balance: 500,
  },
  {
    id: '2',
    type: 'expense',
    amount: -20,
    reason: '发布需求：帮忙代取快递',
    date: '2026-03-16 14:30',
    balance: 450,
  },
  {
    id: '3',
    type: 'income',
    amount: 100,
    reason: '完成任务：Python爬虫代码调试',
    date: '2026-03-15 20:00',
    balance: 470,
  },
  {
    id: '4',
    type: 'expense',
    amount: -80,
    reason: '发布需求：PPT设计美化',
    date: '2026-03-15 10:00',
    balance: 370,
  },
  {
    id: '5',
    type: 'income',
    amount: 30,
    reason: '完成任务：英语作文批改',
    date: '2026-03-14 15:30',
    balance: 450,
  },
  {
    id: '6',
    type: 'income',
    amount: 100,
    reason: '系统奖励：新用户注册',
    date: '2026-03-10 09:00',
    balance: 420,
  },
  {
    id: '7',
    type: 'expense',
    amount: -5,
    reason: '违约扣除：取消任务',
    date: '2026-03-12 16:20',
    balance: 320,
  },
  {
    id: '8',
    type: 'income',
    amount: 50,
    reason: '活动奖励：三月互助之星',
    date: '2026-03-11 10:00',
    balance: 325,
  },
];

export function PointsHistory() {
  const { user } = useAuth();
  const [showRulesDialog, setShowRulesDialog] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  const filteredHistory = pointsHistory.filter(item => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  const totalIncome = pointsHistory
    .filter(item => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0);

  const totalExpense = Math.abs(
    pointsHistory
      .filter(item => item.type === 'expense')
      .reduce((sum, item) => sum + item.amount, 0)
  );

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">积分明细</h1>
          <p className="text-gray-600">查看你的积分收支记录</p>
        </div>
        <Button variant="outline" onClick={() => setShowRulesDialog(true)}>
          <Info className="w-4 h-4 mr-2" />
          积分规则
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">当前积分</p>
                <p className="text-3xl font-bold text-[#FF7D00]">{user?.points}</p>
              </div>
              <div className="p-3 rounded-full bg-orange-100">
                <Coins className="w-8 h-8 text-[#FF7D00]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">累计收入</p>
                <p className="text-3xl font-bold text-[#52C41A]">+{totalIncome}</p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <TrendingUp className="w-8 h-8 text-[#52C41A]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">累计支出</p>
                <p className="text-3xl font-bold text-[#FF5252]">-{totalExpense}</p>
              </div>
              <div className="p-3 rounded-full bg-red-100">
                <TrendingDown className="w-8 h-8 text-[#FF5252]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 明细列表 */}
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
          <div className="space-y-3">
            {filteredHistory.map((item) => (
              <div 
                key={item.id}
                className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors border"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className={`p-2 rounded-lg ${item.type === 'income' ? 'bg-green-50' : 'bg-red-50'}`}>
                    {item.type === 'income' ? (
                      <TrendingUp className="w-5 h-5 text-[#52C41A]" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-[#FF5252]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 mb-1">{item.reason}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {item.date}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-xl font-bold ${item.type === 'income' ? 'text-[#52C41A]' : 'text-[#FF5252]'}`}>
                    {item.amount > 0 ? '+' : ''}{item.amount}
                  </div>
                  <div className="text-sm text-gray-500">
                    余额: {item.balance}
                  </div>
                </div>
              </div>
            ))}

            {filteredHistory.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                暂无相关记录
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 积分规则弹窗 */}
      <Dialog open={showRulesDialog} onOpenChange={setShowRulesDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>积分规则说明</DialogTitle>
            <DialogDescription>
              了解如何获取和使用积分
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div>
              <h3 className="font-semibold text-[#52C41A] mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                如何获得积分
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-[#52C41A] font-bold">•</span>
                  <span><strong>完成任务：</strong>帮助他人完成需求后，获得对方悬赏的积分</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#52C41A] font-bold">•</span>
                  <span><strong>新用户注册：</strong>首次注册赠送100积分</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#52C41A] font-bold">•</span>
                  <span><strong>活动奖励：</strong>参与平台活动获得奖励积分</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#52C41A] font-bold">•</span>
                  <span><strong>每日签到：</strong>连续签到可获得积分奖励</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-[#FF5252] mb-3 flex items-center gap-2">
                <TrendingDown className="w-5 h-5" />
                积分消耗规则
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-[#FF5252] font-bold">•</span>
                  <span><strong>发布需求：</strong>发布需求时需设置悬赏积分，积分将被冻结直到任务完成</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF5252] font-bold">•</span>
                  <span><strong>取消任务：</strong>已被接单的任务若取消，将扣除20%违约金</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF5252] font-bold">•</span>
                  <span><strong>违规处罚：</strong>发布违规内容或恶意行为将被扣除积分</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-[#165DFF] mb-2 flex items-center gap-2">
                <Info className="w-5 h-5" />
                重要提示
              </h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• 积分不可提现，仅用于平台内互助交换</li>
                <li>• 保持良好信用，避免频繁取消任务</li>
                <li>• 积分有���期为1年，过期将自动清零</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
