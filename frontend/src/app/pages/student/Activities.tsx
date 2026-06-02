import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { MapPin, Clock, Users, Coins, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { activitiesApi } from "../../api/activities";

export function Activities() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState<Set<number>>(new Set());

  const loadActivities = () => {
    activitiesApi.list().then(res => {
      setActivities(res?.data || []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { loadActivities(); }, []);

  const handleApply = async (id: number) => {
    try {
      await activitiesApi.apply(id);
      toast.success('报名成功，等待管理员审核');
      setApplied(prev => new Set(prev).add(id));
    } catch (err: any) {
      toast.error(err?.response?.data?.message || '报名失败');
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">校园活动</h1>
        <p className="text-gray-600">浏览和报名校园互助活动</p>
      </div>

      {loading ? (
        <Card><CardContent className="p-12 text-center text-gray-500">加载中...</CardContent></Card>
      ) : activities.length === 0 ? (
        <Card><CardContent className="p-12 text-center text-gray-500">暂无招募中的活动</CardContent></Card>
      ) : (
        <div className="grid gap-4">
          {activities.map((a: any) => {
            const isApplied = applied.has(a.id) || a.isApplied;
            return (
              <Card key={a.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold">{a.title}</h3>
                        <Badge className="bg-[#52C41A]">招募中</Badge>
                      </div>
                      {a.description && <p className="text-gray-600 text-sm">{a.description}</p>}
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{a.location}</span>
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{a.startTime?.substring(0,16)} 至 {a.endTime?.substring(0,16)}</span>
                        <span className="flex items-center gap-1"><Users className="w-4 h-4" />{a.approvedCount || 0}/{a.requiredCount}</span>
                      </div>
                    </div>
                    <div className="ml-6 flex flex-col items-end gap-3">
                      <div className="flex items-center gap-1 text-[#FF7D00] text-xl font-bold">
                        <Coins className="w-5 h-5" />{a.pointsReward}
                      </div>
                      {isApplied ? (
                        <Badge className="bg-gray-300 text-gray-700"><CheckCircle className="w-3 h-3 mr-1" />已报名</Badge>
                      ) : (
                        <Button className="bg-[#165DFF] hover:bg-[#0E4FD4]" onClick={() => handleApply(a.id)}>立即报名</Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
