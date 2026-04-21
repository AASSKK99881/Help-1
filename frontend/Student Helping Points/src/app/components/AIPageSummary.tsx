import { useState } from 'react';
import { aiApi } from '../api/ai';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Sparkles, Loader2 } from 'lucide-react';

interface AIPageSummaryProps {
  pageName: string; // 接收当前页面的名称
}

export function AIPageSummary({ pageName }: AIPageSummaryProps) {
  // 状态管理
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // 处理弹窗打开/关闭的逻辑
  const handleOpenChange = async (open: boolean) => {
    setIsOpen(open);
    
    // 如果弹窗打开，且还没有获取过当前页面的数据，则发起请求
    if (open && !summary) {
      setIsLoading(true);
      try {
        const res = await aiApi.getPageSummary({ pageContext: pageName });
        setSummary(res.summary);
      } catch (error) {
        setSummary('抱歉，获取页面概括失败，请检查后端或 Ollama 模型是否正常运行。');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {/* 悬浮按钮 - 放在页面右下角 */}
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-8 right-8 rounded-full shadow-xl px-4 py-6 bg-indigo-600 hover:bg-indigo-700 text-white z-50"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          AI 页面导览
        </Button>
      </DialogTrigger>
      
      {/* 弹窗内容 */}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            关于【{pageName}】
          </DialogTitle>
        </DialogHeader>
        
        {/* 内容展示区 */}
        <div className="min-h-[150px] flex items-center justify-center p-4 bg-muted/30 rounded-md border text-sm leading-relaxed whitespace-pre-wrap">
          {isLoading ? (
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
              <p>本地 Ollama 模型正在努力概括中，请稍候...</p>
            </div>
          ) : (
            <div className="w-full h-full text-foreground">
              {summary || "暂无内容"}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}