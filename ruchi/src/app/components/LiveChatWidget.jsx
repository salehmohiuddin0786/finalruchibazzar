"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  MessageCircle,
  X,
  Minus,
  Send,
  Loader2,
  AlertCircle,
  Headphones,
  Check,
  CheckCheck,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000/api";
const SOCKET_BASE = API_BASE.replace(/\/api\/?$/, "");

const QUICK_ACTIONS = [
  "Where is my order?",
  "Delivery timings & fee",
  "Refund & cancellation",
  "Talk to live support agent",
];

// Helper to get or create persistent guest session ID
const getStoredSessionId = () => {
  if (typeof window === "undefined") return "guest-session-init";
  try {
    let sid = localStorage.getItem("ruchi_chat_session_id");
    if (!sid) {
      sid = "sess_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now();
      localStorage.setItem("ruchi_chat_session_id", sid);
    }
    return sid;
  } catch {
    return "sess_" + Date.now();
  }
};

// Dynamic Socket.IO script injector (falls back gracefully to HTTP polling)
const loadSocketIo = () =>
  new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("No window"));
    if (window.io) return resolve(window.io);

    const existing = document.querySelector("script[data-ruchi-chat-socket]");
    if (existing) {
      existing.addEventListener("load", () => resolve(window.io), { once: true });
      existing.addEventListener("error", reject, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = `${SOCKET_BASE}/socket.io/socket.io.js`;
    script.async = true;
    script.dataset.ruchiChatSocket = "true";
    script.onload = () => resolve(window.io);
    script.onerror = () => reject(new Error("Socket script failed to load"));
    document.body.appendChild(script);
  });

export default function LiveChatWidget() {
  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socketConnected, setSocketConnected] = useState(false);
  const [errorBanner, setErrorBanner] = useState("");

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const pollIntervalRef = useRef(null);
  const sessionId = useRef(getStoredSessionId());

  // Scroll to latest message smoothly
  const scrollToBottom = (behavior = "smooth") => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior, block: "end" });
    }
  };

  // 1. Initialize or load conversation
  const initConversation = useCallback(async () => {
    try {
      setLoading(true);
      setErrorBanner("");

      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}/support-chat/conversation`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          sessionId: sessionId.current,
          name: user?.name || "Guest Customer",
          email: user?.email || null,
          phone: user?.phone || null,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setConversation(data.data);
        const msgs = data.data.messages || [];
        setMessages(msgs);

        // Mark as read if user is opening widget
        if (isOpen) {
          markConversationRead(data.data.id);
        } else {
          setUnreadCount(data.data.unreadUserCount || 0);
        }
      } else {
        setErrorBanner(data.message || "Could not connect to support service.");
      }
    } catch (err) {
      console.warn("Live chat init error:", err);
      setErrorBanner("Live chat service currently unavailable. Trying to reconnect...");
    } finally {
      setLoading(false);
    }
  }, [user, isOpen]);

  // Mark conversation messages as read by customer
  const markConversationRead = async (convId) => {
    if (!convId) return;
    try {
      setUnreadCount(0);
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      await fetch(`${API_BASE}/support-chat/read`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          conversationId: convId,
          userType: "user",
        }),
      });
    } catch {
      // Non-critical
    }
  };

  // Fetch updated messages (used for fallback polling)
  const fetchMessagesQuietly = useCallback(async () => {
    if (!conversation?.id) return;
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}/support-chat/conversations/${conversation.id}?sessionId=${sessionId.current}`, {
        headers,
      });
      const data = await res.json();
      if (data.success && data.data) {
        const newMsgs = data.data.messages || [];
        setMessages(newMsgs);
        if (isOpen && !isMinimized) {
          markConversationRead(conversation.id);
        } else {
          setUnreadCount(data.data.unreadUserCount || 0);
        }
      }
    } catch {
      // Polling error silently handled
    }
  }, [conversation?.id, isOpen, isMinimized]);

  // Initialize conversation once on mount
  useEffect(() => {
    initConversation();
  }, [initConversation]);

  // Setup Socket.IO connection
  useEffect(() => {
    let isSubscribed = true;

    loadSocketIo()
      .then((io) => {
        if (!isSubscribed) return;
        const socket = io(SOCKET_BASE, {
          transports: ["websocket", "polling"],
          reconnectionAttempts: 8,
          reconnectionDelay: 2000,
        });

        socketRef.current = socket;

        socket.on("connect", () => {
          if (!isSubscribed) return;
          setSocketConnected(true);
          if (conversation?.id) {
            socket.emit("joinChatRoom", conversation.id);
          }
        });

        socket.on("disconnect", () => {
          if (!isSubscribed) return;
          setSocketConnected(false);
        });

        socket.on("connect_error", () => {
          if (!isSubscribed) return;
          setSocketConnected(false);
        });

        // Incoming message from agent or server
        socket.on("chatMessage", (payload) => {
          if (!isSubscribed) return;
          const { conversationId, message } = payload;
          if (conversation?.id && conversationId === conversation.id) {
            setMessages((prev) => {
              if (prev.some((m) => m.id === message.id)) return prev;
              return [...prev, message];
            });

            if (isOpen && !isMinimized) {
              markConversationRead(conversation.id);
            } else {
              setUnreadCount((c) => c + 1);
            }
          }
        });

        // Typing event from support team
        socket.on("chatTyping", (payload) => {
          if (!isSubscribed) return;
          if (payload.conversationId === conversation?.id && payload.senderType === "agent") {
            setTyping(payload.isTyping);
            if (payload.isTyping) {
              clearTimeout(typingTimeoutRef.current);
              typingTimeoutRef.current = setTimeout(() => {
                if (isSubscribed) setTyping(false);
              }, 4000);
            }
          }
        });
      })
      .catch(() => {
        setSocketConnected(false);
      });

    return () => {
      isSubscribed = false;
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [conversation?.id, isOpen, isMinimized]);

  // Join room when conversation ID becomes available
  useEffect(() => {
    if (socketRef.current && socketConnected && conversation?.id) {
      socketRef.current.emit("joinChatRoom", conversation.id);
    }
  }, [conversation?.id, socketConnected]);

  // Fallback Polling: every 5s if open, every 20s if closed
  useEffect(() => {
    const interval = isOpen && !isMinimized ? 4000 : 25000;
    pollIntervalRef.current = setInterval(() => {
      fetchMessagesQuietly();
    }, interval);

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [isOpen, isMinimized, fetchMessagesQuietly]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, typing, isOpen, isMinimized]);

  // Emit typing indicator
  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputText(val);

    if (socketRef.current && socketConnected && conversation?.id) {
      socketRef.current.emit("chatTyping", {
        conversationId: conversation.id,
        senderType: "user",
        isTyping: val.length > 0,
      });
    }
  };

  // Send message handler
  const handleSendMessage = async (customText = null) => {
    const textToSend = (customText || inputText).trim();
    if (!textToSend || sending) return;

    if (!conversation?.id) {
      await initConversation();
    }
    if (!conversation?.id) {
      setErrorBanner("Unable to start conversation. Please check your connection.");
      return;
    }

    setSending(true);
    setErrorBanner("");

    // Optimistic UI temporary message
    const tempId = "temp_" + Date.now();
    const optimisticMessage = {
      id: tempId,
      conversationId: conversation.id,
      senderType: "user",
      senderName: user?.name || "You",
      text: textToSend,
      isRead: false,
      createdAt: new Date().toISOString(),
      optimistic: true,
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setInputText("");

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}/support-chat/message`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          conversationId: conversation.id,
          sessionId: sessionId.current,
          text: textToSend,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        // Replace optimistic message with actual persisted message
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? data.data : m))
        );
      } else {
        throw new Error(data.message || "Failed to deliver message");
      }
    } catch (err) {
      setErrorBanner(err.message || "Message delivery failed. Please retry.");
      // Keep optimistic message with error indication
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId ? { ...m, failed: true } : m
        )
      );
    } finally {
      setSending(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (dateStr) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  return (
    <>
      {/* ================= FLOATING CHAT LAUNCHER BUTTON ================= */}
      {/* Positioned bottom-24 on mobile to prevent blocking bottom navigation tabs, bottom-6 on desktop */}
      <aside aria-label="Customer live support" className="fixed bottom-24 right-4 z-40 lg:bottom-6 sm:right-6">
        {!isOpen && (
          <button
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
              if (conversation?.id) markConversationRead(conversation.id);
            }}
            type="button"
            aria-label="Open Live Support Chat"
            className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-amber-600 to-amber-500 text-white shadow-xl shadow-amber-500/30 transition-all duration-300 hover:scale-105 hover:shadow-amber-500/50 focus:outline-none focus:ring-4 focus:ring-amber-300 active:scale-95"
          >
            <Headphones className="h-6 w-6 transition-transform group-hover:-rotate-6" />
            
            {/* Unread Message Badge */}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-red-600 px-1.5 text-xs font-bold text-white shadow-md animate-pulse">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}

            {/* Pulsing online indicator */}
            <span className="absolute bottom-0.5 right-0.5 flex h-3.5 w-3.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500"></span>
            </span>
          </button>
        )}
      </aside>

      {/* ================= EXPANDED / MINIMIZED LIVE CHAT WINDOW ================= */}
      {isOpen && (
        <section
          role="dialog"
          aria-modal="true"
          aria-label="Ruchi Bazaar Live Support Chat"
          className={`fixed z-50 transition-all duration-300 ease-in-out ${
            isMinimized
              ? "bottom-24 right-4 w-72 rounded-2xl shadow-2xl lg:bottom-6 sm:right-6"
              : "inset-x-2 bottom-20 top-20 sm:inset-auto sm:bottom-6 sm:right-6 sm:top-auto sm:h-[580px] sm:w-[410px] rounded-2xl shadow-2xl"
          } flex flex-col overflow-hidden border border-slate-200 bg-white`}
        >
          {/* HEADER */}
          <div className="flex items-center justify-between bg-gradient-to-r from-amber-600 via-amber-700 to-orange-600 px-4 py-3.5 text-white shadow">
            <div className="flex items-center space-x-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <Headphones className="h-5 w-5 text-white" />
                <span
                  className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-amber-700 ${
                    socketConnected ? "bg-emerald-400" : "bg-amber-300"
                  }`}
                  title={socketConnected ? "Live Connected" : "Connecting..."}
                />
              </div>
              <div>
                <h2 className="text-sm font-semibold tracking-wide">Ruchi Support</h2>
                <p className="text-[11px] text-amber-100/90 flex items-center space-x-1">
                  <span>{socketConnected ? "Online • Typically replies in minutes" : "Connecting..."}</span>
                </p>
              </div>
            </div>

            {/* Header controls: Minimize & Close */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                aria-label={isMinimized ? "Maximize live chat" : "Minimize live chat"}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/20 hover:text-white"
              >
                <Minus className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsMinimized(false);
                }}
                aria-label="Close live chat"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/20 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* CHAT BODY (Hidden if minimized) */}
          {!isMinimized && (
            <>
              {/* ERROR BANNER */}
              {errorBanner && (
                <div className="flex items-center justify-between bg-red-50 px-3 py-2 text-xs text-red-700 border-b border-red-100">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                    <span>{errorBanner}</span>
                  </div>
                  <button
                    onClick={() => initConversation()}
                    className="shrink-0 rounded p-1 text-red-700 hover:bg-red-100"
                    title="Retry"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {/* MESSAGES THREAD */}
              <div
                className="flex-1 overflow-y-auto bg-slate-50 p-4 space-y-3.5 min-h-[220px]"
                tabIndex={0}
                aria-label="Message history"
              >
                {/* WELCOMING MESSAGE CARD */}
                <div className="rounded-xl border border-amber-100 bg-amber-50/70 p-3.5 text-slate-800 shadow-sm">
                  <div className="flex items-center space-x-2 text-amber-900 font-semibold text-xs mb-1">
                    <Sparkles className="h-4 w-4 text-amber-600" />
                    <span>Welcome to Ruchi Bazaar Help Desk</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Hi! How can we help you? Send us a message and our support team will assist you.
                  </p>
                </div>

                {/* QUICK ASSISTANCE CHIPS (Shown only when message list is empty or minimal) */}
                {messages.length === 0 && (
                  <div className="space-y-2 pt-1">
                    <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                      Frequently asked
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {QUICK_ACTIONS.map((chip, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSendMessage(chip)}
                          className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 shadow-xs transition hover:border-amber-400 hover:bg-amber-50 hover:text-amber-900 text-left"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* LOADING SPINNER */}
                {loading && messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                    <Loader2 className="h-6 w-6 animate-spin text-amber-600 mb-2" />
                    <span className="text-xs">Loading message history...</span>
                  </div>
                )}

                {/* MESSAGES LIST */}
                {messages.map((msg, index) => {
                  const isUser = msg.senderType === "user";
                  return (
                    <div
                      key={msg.id || index}
                      className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                    >
                      <div className="flex items-end space-x-1 max-w-[85%]">
                        {!isUser && (
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-600 text-white text-[10px] font-bold">
                            RB
                          </div>
                        )}
                        <div
                          className={`rounded-2xl px-3.5 py-2 text-xs leading-relaxed shadow-xs ${
                            isUser
                              ? "bg-amber-600 text-white rounded-br-xs"
                              : "bg-white text-slate-800 border border-slate-200 rounded-bl-xs"
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                          <div
                            className={`mt-1 flex items-center justify-end space-x-1 text-[10px] ${
                              isUser ? "text-amber-100" : "text-slate-400"
                            }`}
                          >
                            <span>{formatTimestamp(msg.createdAt)}</span>
                            {isUser && (
                              <span>
                                {msg.failed ? (
                                  <AlertCircle className="h-3 w-3 text-red-300" title="Delivery failed" />
                                ) : msg.optimistic ? (
                                  <Loader2 className="h-2.5 w-2.5 animate-spin" />
                                ) : msg.isRead ? (
                                  <CheckCheck className="h-3 w-3 text-emerald-300" />
                                ) : (
                                  <Check className="h-3 w-3" />
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* TYPING INDICATOR */}
                {typing && (
                  <div className="flex items-center space-x-1.5 rounded-full bg-white px-3 py-1.5 w-fit border border-slate-200 text-slate-500 shadow-xs">
                    <span className="text-[11px]">Support is typing</span>
                    <span className="flex space-x-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                    </span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* INPUT FORM */}
              <footer className="border-t border-slate-200 bg-white p-2.5">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center space-x-2"
                >
                  <textarea
                    ref={inputRef}
                    rows={1}
                    value={inputText}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    maxLength={2000}
                    aria-label="Support message input"
                    className="flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 placeholder-slate-400 transition focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    style={{ minHeight: "38px", maxHeight: "100px" }}
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim() || sending}
                    aria-label="Send message"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-600 text-white transition hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-amber-400 active:scale-95"
                  >
                    {sending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </button>
                </form>
                <div className="flex items-center justify-between px-1 pt-1.5 text-[10px] text-slate-400">
                  <span>Press Enter to send</span>
                  <span>{inputText.length}/2000</span>
                </div>
              </footer>
            </>
          )}
        </section>
      )}
    </>
  );
}
