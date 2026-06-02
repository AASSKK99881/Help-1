import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Separator } from "../../components/ui/separator";
import { Bell, CheckCircle, AlertCircle, Trash2 } from "lucide-react";

interface Notification {
  id: string;
  type: string;
  title: string;
  content: string;
  time: string;
  read: boolean;
}

export function Messages() {
  const [systemMsgs, setSystemMsgs] = useState<Notification[]>([]);
  const [orderMsgs, setOrderMsgs] = useState<Notification[]>([]);

  const markAsRead = (id: string, type: 'system' | 'order') => {
    if (type === 'system') {
      setSystemMsgs(prev => prev.map(msg =>
        msg.id === id ? { ...msg, read: true } : msg
      ));
    } else {
      setOrderMsgs(prev => prev.map(msg =>
        msg.id === id ? { ...msg, read: true } : msg
      ));
    }
  };

  const deleteMessage = (id: string, type: 'system' | 'order') => {
    if (type === 'system') {
      setSystemMsgs(prev => prev.filter(msg => msg.id !== id));
    } else {
      setOrderMsgs(prev => prev.filter(msg => msg.id !== id));
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-[#52C41A]" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-[#FF7D00]" />;
      default:
        return <Bell className="w-5 h-5 text-[#165DFF]" />;
    }
  };

  const NotificationList = ({ notifications, type }: { notifications: Notification[]; type: 'system' | 'order' }) => {
    if (notifications.length === 0) {
      return (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            {type === 'system' ? '暂无系统通知' : '暂无订单通知'}
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{type === 'system' ? '系统通知' : '订单通知'}</span>
            <Button variant="ghost" size="sm">全部标为已读</Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {notifications.map((notification, index) => (
              <div key={notification.id}>
                {index > 0 && <Separator className="my-3" />}
                <div className={`flex items-start gap-4 p-3 rounded-lg ${!notification.read ? 'bg-blue-50' : ''}`}>
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{notification.title}</h4>
                      {!notification.read && (
                        <Badge className="shrink-0 bg-[#165DFF] text-white border-0">新</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{notification.content}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500">{notification.time}</span>
                      {!notification.read && (
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-xs text-[#165DFF]"
                          onClick={() => markAsRead(notification.id, type)}
                        >
                          标为已读
                        </Button>
                      )}
                      <Button
                        variant="link"
                        size="sm"
                        className="h-auto p-0 text-xs text-red-600"
                        onClick={() => deleteMessage(notification.id, type)}
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        删除
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">消息中心</h1>
        <p className="text-gray-600">查看系统通知和订单消息</p>
      </div>

      <Tabs defaultValue="system" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="system">系统通知</TabsTrigger>
          <TabsTrigger value="order">订单通知</TabsTrigger>
        </TabsList>

        <TabsContent value="system">
          <NotificationList notifications={systemMsgs} type="system" />
        </TabsContent>

        <TabsContent value="order">
          <NotificationList notifications={orderMsgs} type="order" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
