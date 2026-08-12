import React, { useState, useEffect, useRef } from 'react';
import { Bot, Sparkles, X, Send, RefreshCw, Minus, MessageSquare, ChevronDown } from 'lucide-react';
import ChatMessage from './ChatMessage';
import apiService from '../../../services/apiService';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      isUser: false,
      text: "👋 Hi there! I'm **AURA**, your personal AI Shopping & Lifestyle Assistant.\n\nAsk me for product recommendations, shipping info, or help finding the perfect style!",
      products: [],
      timestamp: Date.now(),
    },
  ]);

  const [quickReplies, setQuickReplies] = useState([
    '✨ Recommend top featured items',
    '👜 Show stylish bags & accessories',
    '🚚 Shipping & delivery times',
    '🔄 Return and refund policy',
    '📦 Track my order',
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      setUnreadCount(0);
    }
  }, [messages, isOpen, isMinimized]);

  // Load initial backend suggestions if available
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await apiService.chatbot.getSuggestions();
        if (res && res.length > 0) {
          setQuickReplies(res);
        }
      } catch (err) {
        // Fallback default suggestions retained
      }
    };
    fetchSuggestions();
  }, []);

  const handleSendMessage = async (customText = null) => {
    const textToSend = customText || inputMessage;
    if (!textToSend || !textToSend.trim() || loading) return;

    const userMsgObj = {
      id: `user-${Date.now()}`,
      isUser: true,
      text: textToSend.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsgObj]);
    if (!customText) setInputMessage('');
    setLoading(true);

    try {
      const response = await apiService.chatbot.sendMessage(textToSend.trim());
      
      const botMsgObj = {
        id: `bot-${Date.now()}`,
        isUser: false,
        text: response.reply || "Here is what I found for you:",
        products: response.products || [],
        timestamp: response.timestamp || Date.now(),
      };

      setMessages((prev) => [...prev, botMsgObj]);
      if (response.quickReplies && response.quickReplies.length > 0) {
        setQuickReplies(response.quickReplies);
      }

      if (!isOpen || isMinimized) {
        setUnreadCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error('Chatbot API error:', err);
      const fallbackMsgObj = {
        id: `bot-err-${Date.now()}`,
        isUser: false,
        text: "I'm having a little trouble connecting to the server right now. Feel free to browse our categories or try asking again!",
        products: [],
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, fallbackMsgObj]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        isUser: false,
        text: "Conversation restarted. How can I help you find your next lifestyle favorite?",
        products: [],
        timestamp: Date.now(),
      },
    ]);
  };

  const toggleWidget = () => {
    if (!isOpen) {
      setIsOpen(true);
      setIsMinimized(false);
      setUnreadCount(0);
    } else if (isMinimized) {
      setIsMinimized(false);
      setUnreadCount(0);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end select-none">
      {/* Expanded Chat Modal */}
      {isOpen && (
        <div
          className={`w-[92vw] sm:w-[390px] bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 backdrop-blur-xl mb-3 ${
            isMinimized ? 'h-14 overflow-hidden' : 'h-[520px] max-h-[80vh]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 px-4 py-3 border-b border-slate-700/70 flex items-center justify-between text-white">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 p-0.5 flex items-center justify-center shadow-lg">
                  <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                    <Bot className="w-4.5 h-4.5 text-purple-300" />
                  </div>
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-wide flex items-center gap-1.5 text-slate-100">
                  AURA AI <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                </h3>
                <p className="text-[10px] text-purple-300/80">Your Personal Lifestyle Assistant</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                title="Restart chat"
                className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? "Expand" : "Minimize"}
                className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
              >
                {isMinimized ? <ChevronDown className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          {!isMinimized && (
            <>
              <div className="flex-1 p-3.5 overflow-y-auto space-y-2.5 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                {messages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} />
                ))}

                {/* Loading / Typing Indicator */}
                {loading && (
                  <div className="flex gap-2 items-center my-2 text-slate-400 text-xs px-2">
                    <div className="w-7 h-7 rounded-full bg-purple-950/60 border border-purple-500/30 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-purple-400 animate-pulse" />
                    </div>
                    <div className="flex gap-1 items-center bg-slate-800/80 px-3 py-2 rounded-2xl border border-slate-700/60">
                      <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Reply Chips */}
              {quickReplies && quickReplies.length > 0 && (
                <div className="px-3 py-2 bg-slate-950/60 border-t border-slate-800 flex gap-1.5 overflow-x-auto scrollbar-none">
                  {quickReplies.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(chip)}
                      disabled={loading}
                      className="whitespace-nowrap px-2.5 py-1 text-[11px] font-medium bg-slate-800/90 hover:bg-purple-900/60 text-purple-200 hover:text-white border border-purple-500/20 hover:border-purple-500/50 rounded-full transition-all duration-200 disabled:opacity-50 flex-shrink-0"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}

              {/* Input Footer */}
              <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ask AURA anything..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                  className="flex-1 bg-slate-950/80 border border-slate-700/80 focus:border-purple-500 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors disabled:opacity-50"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || loading}
                  className="w-9 h-9 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all shadow-md flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={toggleWidget}
        className="relative group p-3.5 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-xl hover:shadow-purple-500/25 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center border border-white/20"
        title="Toggle AI Chatbot"
      >
        {/* Glow Ring */}
        <span className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 rounded-full blur-md opacity-50 group-hover:opacity-80 transition duration-300 animate-pulse -z-10"></span>

        {isOpen && !isMinimized ? (
          <X className="w-6 h-6" />
        ) : (
          <div className="flex items-center gap-1.5">
            <Bot className="w-6 h-6" />
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin [animation-duration:4s]" />
          </div>
        )}

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-slate-900 animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}
