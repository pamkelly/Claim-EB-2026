import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, RefreshCw, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { Message } from "../types";

interface ChatTabProps {
  initialUserName: string;
}

export default function ChatTab({ initialUserName }: ChatTabProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Xin chào ${initialUserName}! Tôi là **Trợ lý ảo PTI Care**.\n\nTôi có thể giải đáp mọi thắc mắc của bạn về: \n- Quy trình tạo yêu cầu bồi thường bảo hiểm.\n- Các loại chứng từ y tế & hóa đơn VAT cần chuẩn bị.\n- Hệ thống bệnh viện liên kết bảo lãnh viện phí của PTI.\n- Thời gian giải quyết hồ sơ bồi thường.\n\nBạn cần tôi hỗ trợ thông tin gì hôm nay?`,
      timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const SUGGESTIONS = [
    "Quy trình bồi thường 4 bước cần giấy tờ gì?",
    "Bảo lãnh viện phí PTI hoạt động thế nào?",
    "Hồ sơ bồi thường được giải quyết trong bao lâu?",
    "Hóa đơn thanh toán cần dấu tròn hay không?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Build simple conversation history to feed server-side endpoint
      const chatHistory = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-ai-${Date.now()}`,
            role: "assistant",
            content: data.text,
            timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      } else {
        throw new Error(data.error || "Lỗi không xác định");
      }
    } catch (error: any) {
      console.error("Chat API Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          role: "assistant",
          content: "Xin lỗi, tôi đã gặp khó khăn trong quá trình kết nối với máy chủ AI. Bạn hãy thử nhắn lại hoặc tải lại trang nhé!",
          timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatMessageText = (text: string) => {
    return text.split("\n").map((line, idx) => {
      // Bold rendering simulation
      let elements: React.ReactNode[] = [];
      let lastIndex = 0;
      const boldRegex = /\*\*(.*?)\*\*/g;
      let match;

      while ((match = boldRegex.exec(line)) !== null) {
        // Add preceding text
        if (match.index > lastIndex) {
          elements.push(line.substring(lastIndex, match.index));
        }
        // Add bolded text
        elements.push(<strong key={match.index} className="font-bold text-blue-900">{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }
      
      if (lastIndex < line.length) {
        elements.push(line.substring(lastIndex));
      }

      // Check for bullet points
      if (line.trim().startsWith("- ")) {
        return (
          <li key={idx} className="ml-4 list-disc text-slate-700 text-xs py-0.5 leading-relaxed">
            {elements.length > 0 ? elements : line.replace("- ", "")}
          </li>
        );
      }

      return (
        <p key={idx} className="text-xs text-slate-700 py-0.5 leading-relaxed">
          {elements.length > 0 ? elements : line}
        </p>
      );
    });
  };

  return (
    <div className="flex-grow flex flex-col justify-between overflow-hidden relative">
      {/* Mini-Header */}
      <div className="px-5 py-3.5 bg-white/50 border-b border-slate-100/50 flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-blue-500/10">
              <Bot size={18} className="stroke-[1.8]" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1 font-display">
              Trợ Lý Trực Tuyến <Sparkles size={11} className="text-blue-500 fill-blue-500" />
            </h4>
            <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">PTI AI Assistant</p>
          </div>
        </div>

        <button 
          onClick={() => {
            setMessages([messages[0]]);
            setIsLoading(false);
          }}
          title="Xóa cuộc trò chuyện"
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
        >
          <RefreshCw size={13} />
        </button>
      </div>

      {/* Messages area */}
      <div className="flex-grow overflow-y-auto px-5 py-4 space-y-4">
        {messages.map((m) => (
          <div 
            key={m.id} 
            className={`flex items-start gap-2.5 max-w-[85%] ${m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
              m.role === "user" 
                ? "bg-blue-100 text-blue-600" 
                : "bg-blue-600 text-white shadow-sm shadow-blue-600/10"
            }`}>
              {m.role === "user" ? <User size={14} /> : <Bot size={14} />}
            </div>

            <div className={`rounded-2xl px-3.5 py-2.5 shadow-sm space-y-1 ${
              m.role === "user" 
                ? "bg-blue-600 text-white rounded-tr-none" 
                : "bg-white/80 border border-slate-100/50 rounded-tl-none text-slate-800"
            }`}>
              <div className="text-xs">
                {m.role === "user" ? (
                  <p className="leading-relaxed text-slate-50">{m.content}</p>
                ) : (
                  formatMessageText(m.content)
                )}
              </div>
              <span className={`block text-[8px] text-right font-medium ${
                m.role === "user" ? "text-blue-200" : "text-slate-400"
              }`}>
                {m.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-2.5 max-w-[85%] mr-auto">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white shadow-sm flex items-center justify-center shrink-0">
              <Bot size={14} />
            </div>
            <div className="rounded-2xl px-3.5 py-2.5 bg-white/80 border border-slate-100/50 rounded-tl-none text-slate-800">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion list (only shown if there is only 1 message or the bot isn't busy) */}
      {!isLoading && messages.length === 1 && (
        <div className="px-5 pb-2.5 space-y-1.5 z-10">
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Câu hỏi gợi ý:</span>
          <div className="flex flex-col gap-1.5">
            {SUGGESTIONS.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(s)}
                className="text-left px-3 py-2 bg-white/60 hover:bg-white border border-slate-100 rounded-xl text-[11px] font-semibold text-slate-600 hover:text-blue-600 transition-all shadow-sm cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Inputs */}
      <div className="p-4 bg-white/40 border-t border-slate-100/50 z-10">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(input);
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="w-full pl-4 pr-11 py-2.5 rounded-xl text-xs font-semibold text-slate-800 glass-input"
            placeholder="Đặt câu hỏi cho Trợ lý ảo PTI..."
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`absolute right-1.5 p-2 rounded-lg transition-all cursor-pointer ${
              !input.trim() || isLoading
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "glass-btn-blue text-white"
            }`}
          >
            <Send size={13} />
          </button>
        </form>
      </div>
    </div>
  );
}
