"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Headphones,
  MessageSquare,
  Search,
  Filter,
  RefreshCw,
  Send,
  Loader2,
  CheckCircle,
  Clock,
  User,
  Phone,
  Mail,
  AlertCircle,
  Check,
  CheckCheck,
  Sparkles,
} from "lucide-react";
import SuperLayout from "../SuperLayout/page";
import { apiRequest } from "../lib/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000/api";
const SOCKET_BASE = API_BASE.replace(/\/api\/?$/, "");

// Dynamic Socket.IO loader for MainAdmin
const loadSocketIo = () =>
  new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("No window"));
    if (window.io) return resolve(window.io);

    const existing = document.querySelector("script[data-ruchi-admin-socket]");
    if (existing) {
      existing.addEventListener("load", () => resolve(window.io), { once: true });
      existing.addEventListener("error", reject, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = `${SOCKET_BASE}/socket.io/socket.io.js`;
    script.async = true;
    script.dataset.ruchiAdminSocket = "true";
    script.onload = () => resolve(window.io);
    script.onerror = () => reject(new Error("Socket script failed to load"));
    document.body.appendChild(script);
  });

export default function SupportCenter() {
  const [conversations, setConversations] = useState([]);
  const [selectedConvId, setSelectedConvId] = useState(null);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);
  const [sending, setSending] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [customerTyping, setCustomerTyping] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [errorBanner, setErrorBanner] = useState("");

  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimerRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = (behavior = "smooth") => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior, block: "end" });
    }
  };

  // 1. Fetch conversations list
  const fetchConversations = useCallback(async (quiet = false) => {
    try {
      if (!quiet) setLoadingList(true);
      setErrorBanner("");

      const res = await apiRequest(`/support-chat/admin/conversations?status=${statusFilter}`);
      if (res.success && Array.isArray(res.data)) {
        setConversations(res.data);

        // Auto select first conversation if none selected
        if (!selectedConvId && res.data.length > 0) {
          setSelectedConvId(res.data[0].id);
        }
      }
    } catch (err) {
      console.error("fetchConversations error:", err);
      if (!quiet) setErrorBanner(err.message || "Failed to load support conversations");
    } finally {
      if (!quiet) setLoadingList(false);
    }
  }, [statusFilter, selectedConvId]);

  // 2. Fetch specific conversation details + messages
  const fetchActiveConversation = useCallback(async (convId, quiet = false) => {
    if (!convId) return;
    try {
      if (!quiet) setLoadingChat(true);

      const res = await apiRequest(`/support-chat/conversations/${convId}`);
      if (res.success && res.data) {
        setActiveConversation(res.data);
        setMessages(res.data.messages || []);

        // Mark as read by agent
        if (res.data.unreadAdminCount > 0) {
          apiRequest("/support-chat/read", {
            method: "POST",
            body: JSON.stringify({ conversationId: convId, userType: "agent" }),
          }).catch(() => {});

          setConversations((prev) =>
            prev.map((c) => (c.id === convId ? { ...c, unreadAdminCount: 0 } : c))
          );
        }
      }
    } catch (err) {
      console.error("fetchActiveConversation error:", err);
    } finally {
      if (!quiet) setLoadingChat(false);
    }
  }, []);

  // Initial fetch and on statusFilter change
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // When selected conversation changes
  useEffect(() => {
    if (selectedConvId) {
      fetchActiveConversation(selectedConvId);
    }
  }, [selectedConvId, fetchActiveConversation]);

  // Socket setup
  useEffect(() => {
    let isSubscribed = true;

    loadSocketIo()
      .then((io) => {
        if (!isSubscribed) return;
        const socket = io(SOCKET_BASE, {
          transports: ["websocket", "polling"],
          reconnectionAttempts: 10,
          reconnectionDelay: 2000,
        });

        socketRef.current = socket;

        socket.on("connect", () => {
          if (!isSubscribed) return;
          setSocketConnected(true);
          // Join global admin room
          socket.emit("joinAdminRoom");
          if (selectedConvId) {
            socket.emit("joinChatRoom", selectedConvId);
          }
        });

        socket.on("disconnect", () => {
          if (!isSubscribed) return;
          setSocketConnected(false);
        });

        // Real-time incoming chat message
        socket.on("chatMessage", (payload) => {
          if (!isSubscribed) return;
          const { conversationId, message, conversation } = payload;

          // If current open conversation, append message
          if (selectedConvId === conversationId) {
            setMessages((prev) => {
              if (prev.some((m) => m.id === message.id)) return prev;
              return [...prev, message];
            });
            // Mark read immediately
            apiRequest("/support-chat/read", {
              method: "POST",
              body: JSON.stringify({ conversationId, userType: "agent" }),
            }).catch(() => {});
          }

          // Update sidebar conversations list
          setConversations((prev) => {
            const index = prev.findIndex((c) => c.id === conversationId);
            if (index !== -1) {
              const updated = [...prev];
              updated[index] = {
                ...updated[index],
                lastMessage: message.text,
                lastSender: message.senderType,
                lastActivityAt: message.createdAt || new Date().toISOString(),
                unreadAdminCount:
                  selectedConvId === conversationId
                    ? 0
                    : (updated[index].unreadAdminCount || 0) + (message.senderType === "user" ? 1 : 0),
              };
              // Move to top
              const [moved] = updated.splice(index, 1);
              return [moved, ...updated];
            } else if (conversation) {
              return [conversation, ...prev];
            }
            return prev;
          });
        });

        // Typing indicator from customer
        socket.on("chatTyping", (payload) => {
          if (!isSubscribed) return;
          if (payload.conversationId === selectedConvId && payload.senderType === "user") {
            setCustomerTyping(payload.isTyping);
            if (payload.isTyping) {
              clearTimeout(typingTimerRef.current);
              typingTimerRef.current = setTimeout(() => {
                if (isSubscribed) setCustomerTyping(false);
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
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [selectedConvId]);

  // When selected conversation changes, switch socket room
  useEffect(() => {
    if (socketRef.current && socketConnected && selectedConvId) {
      socketRef.current.emit("joinChatRoom", selectedConvId);
    }
  }, [selectedConvId, socketConnected]);

  // Periodic background fallback polling (every 6s for active conversation & list)
  useEffect(() => {
    const timer = setInterval(() => {
      fetchConversations(true);
      if (selectedConvId) {
        fetchActiveConversation(selectedConvId, true);
      }
    }, 6000);

    return () => clearInterval(timer);
  }, [fetchConversations, fetchActiveConversation, selectedConvId]);

  // Auto-scroll on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages, customerTyping]);

  // Send admin reply
  const handleSendReply = async () => {
    const text = replyText.trim();
    if (!text || !selectedConvId || sending) return;

    setSending(true);
    const tempId = "temp_admin_" + Date.now();
    const optimistic = {
      id: tempId,
      conversationId: selectedConvId,
      senderType: "agent",
      senderName: "Support Team",
      text,
      isRead: false,
      createdAt: new Date().toISOString(),
      optimistic: true,
    };

    setMessages((prev) => [...prev, optimistic]);
    setReplyText("");

    try {
      const res = await apiRequest("/support-chat/message", {
        method: "POST",
        body: JSON.stringify({
          conversationId: selectedConvId,
          text,
        }),
      });

      if (res.success && res.data) {
        setMessages((prev) => prev.map((m) => (m.id === tempId ? res.data : m)));
        // Update conversation in sidebar
        setConversations((prev) =>
          prev.map((c) =>
            c.id === selectedConvId
              ? { ...c, lastMessage: text, lastSender: "agent", lastActivityAt: new Date().toISOString() }
              : c
          )
        );
      } else {
        throw new Error(res.message || "Failed to send");
      }
    } catch (err) {
      alert("Error sending message: " + err.message);
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    } finally {
      setSending(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  // Update status handler
  const handleStatusChange = async (newStatus) => {
    if (!selectedConvId) return;
    try {
      const res = await apiRequest(`/support-chat/admin/conversations/${selectedConvId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.success) {
        setActiveConversation((prev) => (prev ? { ...prev, status: newStatus } : prev));
        setConversations((prev) =>
          prev.map((c) => (c.id === selectedConvId ? { ...c, status: newStatus } : c))
        );
      }
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  // Filter conversations
  const filteredConversations = useMemo(() => {
    return conversations.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (c.userName && c.userName.toLowerCase().includes(q)) ||
        (c.userEmail && c.userEmail.toLowerCase().includes(q)) ||
        (c.userPhone && c.userPhone.toLowerCase().includes(q)) ||
        (c.lastMessage && c.lastMessage.toLowerCase().includes(q));

      const matchesStatus =
        statusFilter === "All" ||
        (c.status && c.status.toLowerCase() === statusFilter.toLowerCase());

      return matchesSearch && matchesStatus;
    });
  }, [conversations, searchQuery, statusFilter]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = conversations.length;
    const open = conversations.filter((c) => c.status === "open").length;
    const inProgress = conversations.filter((c) => c.status === "in_progress").length;
    const resolved = conversations.filter((c) => c.status === "resolved").length;
    return { total, open, inProgress, resolved };
  }, [conversations]);

  const formatTime = (ts) => {
    if (!ts) return "";
    try {
      const date = new Date(ts);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  return (
    <SuperLayout>
      <div className="space-y-6">
        {/* HEADER & TOP STATS */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl flex items-center space-x-2">
              <Headphones className="h-7 w-7 text-amber-600" />
              <span>Live Support Inbox</span>
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Manage real-time customer inquiries, live chats, and support tickets in one centralized hub.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <span
              className={`inline-flex items-center space-x-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                socketConnected
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-amber-50 text-amber-700 border border-amber-200"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  socketConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                }`}
              />
              <span>{socketConnected ? "Live Connected" : "Connecting..."}</span>
            </span>

            <button
              onClick={() => {
                fetchConversations();
                if (selectedConvId) fetchActiveConversation(selectedConvId);
              }}
              className="flex items-center space-x-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs hover:bg-slate-50 transition"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Total Conversations</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <MessageSquare className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">{stats.total}</p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Open & Waiting</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-amber-600">{stats.open}</p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">In Progress</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Sparkles className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-indigo-600">{stats.inProgress}</p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Resolved</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <CheckCircle className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-emerald-600">{stats.resolved}</p>
          </div>
        </div>

        {/* MAIN TWO-PANE SUPPORT INTERFACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[640px] rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          {/* ================= LEFT PANE: CONVERSATION LIST ================= */}
          <div className="lg:col-span-4 border-r border-slate-200 flex flex-col bg-slate-50/50">
            {/* SEARCH & FILTERS */}
            <div className="p-4 border-b border-slate-200 space-y-3 bg-white">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search user, email, message..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Status filter chips */}
              <div className="flex space-x-1.5 overflow-x-auto pb-1 text-xs">
                {["All", "Open", "In_Progress", "Resolved"].map((status) => {
                  const label = status.replace("_", " ");
                  const isSelected = statusFilter.toLowerCase() === status.toLowerCase();
                  return (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`rounded-lg px-2.5 py-1 font-medium transition whitespace-nowrap ${
                        isSelected
                          ? "bg-slate-900 text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CONVERSATION ITEMS */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {loadingList ? (
                <div className="flex flex-col items-center justify-center p-12 text-slate-400">
                  <Loader2 className="h-6 w-6 animate-spin text-amber-600 mb-2" />
                  <span className="text-xs">Loading conversations...</span>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No conversations found matching filters.
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isSelected = selectedConvId === conv.id;
                  const hasUnread = (conv.unreadAdminCount || 0) > 0;
                  return (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConvId(conv.id)}
                      className={`w-full p-3.5 text-left transition flex items-start space-x-3 hover:bg-slate-100/70 ${
                        isSelected ? "bg-amber-50/70 border-l-4 border-amber-500" : ""
                      }`}
                    >
                      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200 font-bold text-slate-700 text-xs">
                        {(conv.userName || "U").charAt(0).toUpperCase()}
                        {hasUnread && (
                          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-bold text-white animate-pulse">
                            {conv.unreadAdminCount}
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-slate-900 truncate">
                            {conv.userName || "Guest Customer"}
                          </p>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {formatTime(conv.lastActivityAt)}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {conv.lastMessage || "No messages yet"}
                        </p>
                        <div className="mt-1.5 flex items-center space-x-2">
                          <span
                            className={`rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                              conv.status === "open"
                                ? "bg-amber-100 text-amber-800"
                                : conv.status === "in_progress"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {conv.status?.replace("_", " ") || "open"}
                          </span>
                          {conv.userPhone && (
                            <span className="text-[10px] text-slate-400 truncate">
                              {conv.userPhone}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* ================= RIGHT PANE: ACTIVE CONVERSATION WORKSPACE ================= */}
          <div className="lg:col-span-8 flex flex-col bg-white">
            {selectedConvId && activeConversation ? (
              <>
                {/* CONVERSATION TOP BAR */}
                <div className="flex flex-wrap items-center justify-between border-b border-slate-200 px-6 py-3.5 bg-slate-50/50">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-600 text-white font-bold text-sm">
                      {(activeConversation.userName || "U").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">
                        {activeConversation.userName || "Guest Customer"}
                      </h2>
                      <div className="flex items-center space-x-3 text-xs text-slate-500 mt-0.5">
                        {activeConversation.userEmail && (
                          <span className="flex items-center space-x-1">
                            <Mail className="h-3 w-3" />
                            <span>{activeConversation.userEmail}</span>
                          </span>
                        )}
                        {activeConversation.userPhone && (
                          <span className="flex items-center space-x-1">
                            <Phone className="h-3 w-3" />
                            <span>{activeConversation.userPhone}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                    <label className="text-xs font-medium text-slate-500">Status:</label>
                    <select
                      value={activeConversation.status || "open"}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                </div>

                {/* MESSAGES SCROLL AREA */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
                  {loadingChat ? (
                    <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                      <Loader2 className="h-6 w-6 animate-spin text-amber-600 mb-2" />
                      <span className="text-xs">Loading message thread...</span>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="py-16 text-center text-slate-400 text-xs">
                      No messages yet in this conversation.
                    </div>
                  ) : (
                    messages.map((m, idx) => {
                      const isAgent = m.senderType === "agent";
                      return (
                        <div
                          key={m.id || idx}
                          className={`flex flex-col ${isAgent ? "items-end" : "items-start"}`}
                        >
                          <div className="flex items-end space-x-2 max-w-[80%]">
                            {!isAgent && (
                              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-300 text-slate-700 text-xs font-bold">
                                {(activeConversation.userName || "U").charAt(0).toUpperCase()}
                              </div>
                            )}

                            <div
                              className={`rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-xs ${
                                isAgent
                                  ? "bg-slate-900 text-white rounded-br-xs"
                                  : "bg-white text-slate-900 border border-slate-200 rounded-bl-xs"
                              }`}
                            >
                              <p className="whitespace-pre-wrap break-words">{m.text}</p>
                              <div
                                className={`mt-1 flex items-center justify-end space-x-1 text-[10px] ${
                                  isAgent ? "text-slate-400" : "text-slate-400"
                                }`}
                              >
                                <span>{formatTime(m.createdAt)}</span>
                                {isAgent && (
                                  <span>
                                    {m.optimistic ? (
                                      <Loader2 className="h-2.5 w-2.5 animate-spin" />
                                    ) : m.isRead ? (
                                      <CheckCheck className="h-3 w-3 text-emerald-400" />
                                    ) : (
                                      <Check className="h-3 w-3" />
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>

                            {isAgent && (
                              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white text-xs font-bold">
                                RB
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}

                  {/* CUSTOMER TYPING INDICATOR */}
                  {customerTyping && (
                    <div className="flex items-center space-x-1.5 rounded-full bg-white px-3 py-1.5 w-fit border border-slate-200 text-slate-500 shadow-xs text-xs">
                      <span>Customer is typing...</span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* REPLY INPUT AREA */}
                <div className="border-t border-slate-200 bg-white p-4">
                  <div className="flex items-center space-x-3">
                    <textarea
                      ref={inputRef}
                      rows={2}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendReply();
                        }
                      }}
                      placeholder="Type your official reply to customer... (Press Enter to send)"
                      maxLength={2000}
                      className="flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <button
                      onClick={handleSendReply}
                      disabled={!replyText.trim() || sending}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-600 text-white shadow-xs transition hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                    >
                      {sending ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2 px-1">
                    <span>Replies are delivered instantly to customer's live chat window</span>
                    <span>{replyText.length}/2000</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center text-slate-400 p-12 text-center">
                <MessageSquare className="h-12 w-12 text-slate-200 mb-3" />
                <h3 className="text-sm font-semibold text-slate-600">No Conversation Selected</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  Select a support conversation from the left inbox pane to view messages, customer details, and reply in real time.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </SuperLayout>
  );
}
