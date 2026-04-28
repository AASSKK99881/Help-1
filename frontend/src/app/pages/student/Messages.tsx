import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Separator } from "../../components/ui/separator";
import { Bell, CheckCircle, AlertCircle, MessageSquare, Trash2 } from "lucide-react";

const systemNotifications = [
  {
    id: '1',
    type: 'success',
    title: '任务审核通过',
    content: '你发布的需求"帮忙代取快递"已通过审核，现已展示在首页',
    time: '2小时前',
    read: false,
  },
  {
    id: '2',
    type: 'info',
    title: '新功能上线',
    content: '平台上线了新的信用分系统，快来查看你的信用分吧！',
    time: '5小时前',
    read: false,
  },
  {
    id: '3',
    type: 'warning',
    title: '任务即将到期',
    content: '你接取的任务"高数题目讲解"将在2小时后到期，请尽快完成',
    time: '1天前',
    read: true,
  },
];

const orderNotifications = [
  {
    id: '1',
    type: 'accepted',
    title: '你的需求已被接取',
    content: '王芳接取了你的需求"帮忙代取快递"',
    taskId: '1',
    time: '1小时前',
    read: false,
  },
  {
    id: '2',
    type: 'completed',
    title: '任务已完成',
    content: '你完成的任务"Python爬虫代码调试"已被确认，获得100积分',
    taskId: '4',
    time: '3小时前',
    read: false,
  },
  {
    id: '3',
    type: 'cancelled',
    title: '任务已取消',
    content: '发布者取消了需求"活动摄影跟拍"',
    taskId: '6',
    time: '2天前',
    read: true,
  },
];

const privateMessages = [
  {
    id: '1',
    user: { name: '李明', avatar: 'L' },
    lastMessage: '好的，我已经把快递放在宿舍楼下了',
    time: '30分钟前',
    unread: 2,
  },
  {
    id: '2',
    user: { name: '王芳', avatar: 'W' },
    lastMessage: '谢谢你的帮助！',
    time: '2小时前',
    unread: 0,
  },
  {
    id: '3',
    user: { name: '张伟', avatar: 'Z' },
    lastMessage: '请问什么时候方便讲解一下？',
    time: '1天前',
    unread: 1,
  },
];

export function Messages() {
  const [systemMsgs, setSystemMsgs] = useState(systemNotifications);
  const [orderMsgs, setOrderMsgs] = useState(orderNotifications);

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
      case 'info':
      case 'accepted':
        return <Bell className="w-5 h-5 text-[#165DFF]" />;
      default:
        return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  const unreadSystemCount = systemMsgs.filter(m => !m.read).length;
  const unreadOrderCount = orderMsgs.filter(m => !m.read).length;
  const unreadPrivateCount = privateMessages.reduce((sum, m) => sum + m.unread, 0);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">消息中心</h1>
        <p className="text-gray-600">查看系统通知、订单消息和私信</p>
      </div>

      <Tabs defaultValue="system" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="system" className="flex-1">
            系统通知
            {unreadSystemCount > 0 && (
              <Badge className="ml-2 bg-[#FF5252] text-white border-0 px-2 py-0">
                {unreadSystemCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="order" className="flex-1">
            订单通知
            {unreadOrderCount > 0 && (
              <Badge className="ml-2 bg-[#FF5252] text-white border-0 px-2 py-0">
                {unreadOrderCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="private" className="flex-1">
            私信
            {unreadPrivateCount > 0 && (
              <Badge className="ml-2 bg-[#FF5252] text-white border-0 px-2 py-0">
                {unreadPrivateCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>系统通知</span>
                <Button variant="ghost" size="sm">全部标为已读</Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemMsgs.map((notification, index) => (
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
                              onClick={() => markAsRead(notification.id, 'system')}
                            >
                              标为已读
                            </Button>
                          )}
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-xs text-red-600"
                            onClick={() => deleteMessage(notification.id, 'system')}
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            删除
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {systemMsgs.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    暂无系统通知
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="order">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>订单通知</span>
                <Button variant="ghost" size="sm">全部标为已读</Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {orderMsgs.map((notification, index) => (
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
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-xs text-[#165DFF]"
                          >
                            查看详情
                          </Button>
                          {!notification.read && (
                            <Button
                              variant="link"
                              size="sm"
                              className="h-auto p-0 text-xs text-[#165DFF]"
                              onClick={() => markAsRead(notification.id, 'order')}
                            >
                              标为已读
                            </Button>
                          )}
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-xs text-red-600"
                            onClick={() => deleteMessage(notification.id, 'order')}
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            删除
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {orderMsgs.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    暂无订单通知
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="private">
          <Card>
            <CardHeader>
              <CardTitle>私信列表</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {privateMessages.map((message) => (
                  <div
                    key={message.id}
                    className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-[#165DFF] text-white">
                        {message.user.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-900">{message.user.name}</h4>
                        <span className="text-xs text-gray-500">{message.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{message.lastMessage}</p>
                    </div>
                    {message.unread > 0 && (
                      <Badge className="bg-[#FF5252] text-white border-0">
                        {message.unread}
                      </Badge>
                    )}
                  </div>
                ))}
                {privateMessages.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    暂无私信
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
