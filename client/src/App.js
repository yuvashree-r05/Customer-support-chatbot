
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

import {
  MessageSquare,
  History,
  Plus,
  Search,
  Settings,
  User,
  Send,
  Headphones,
  Bot,
  Package,
  RefreshCcw,
  CreditCard,
  LogOut,
} from "lucide-react";

import Auth from "./components/Auth";

const API_URL = "https://customer-support-chatbot-et8t.onrender.com/api";

// Create an Axios instance for backend requests
const api = axios.create({
  baseURL: API_URL,
});

function App() {
  const [token, setToken] = useState(
    localStorage.getItem("token") || ""
  );

  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  const [activePage, setActivePage] = useState("chat");

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");

  // Save user details after successful login or signup
  const handleAuthSuccess = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setToken(data.token);
    setCurrentUser(data.user);
  };

  // Clear the current login session
  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken("");
    setCurrentUser(null);

    setMessages([]);
    setHistory([]);
    setMessage("");

    setError("");
    setHistoryError("");

    setLoading(false);
    setHistoryLoading(false);

    setActivePage("chat");
  }, []);

  // Handle authentication errors from protected API requests
  useEffect(() => {
    const interceptorId = api.interceptors.response.use(
      (response) => response,
      (error) => {
        const statusCode = error.response?.status;
        const requestUrl = error.config?.url || "";

        // Login and signup errors should not clear the session
        const isAuthRequest = requestUrl.includes("/auth/");

        if (statusCode === 401 && !isAuthRequest) {
          handleLogout();
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptorId);
    };
  }, [handleLogout]);

  // Start a fresh chat on the frontend
  const handleNewChat = () => {
    setMessages([]);
    setMessage("");
    setError("");
    setActivePage("chat");
  };

  // Send a message to the backend
  const handleSendMessage = async (e) => {
    e.preventDefault();

    const userMessage = message.trim();

    if (!userMessage || loading) {
      return;
    }

    setMessage("");
    setError("");
    setLoading(true);

    setMessages((previousMessages) => [
      ...previousMessages,
      {
        id: Date.now(),
        text: userMessage,
        sender: "user",
      },
    ]);

    try {
      const response = await api.post(
        "/chat",
        {
          message: userMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          id: Date.now() + 1,
          text: response.data.reply,
          sender: "assistant",
        },
      ]);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Unable to get a response. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch chat history when the user opens the History page
  useEffect(() => {
    if (activePage !== "history" || !token) {
      return;
    }

    let isMounted = true;

    const fetchChatHistory = async () => {
      setHistoryLoading(true);
      setHistoryError("");

      try {
        const response = await api.get("/history", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (isMounted) {
          setHistory(response.data.history || []);
        }
      } catch (err) {
        if (isMounted && err.response?.status !== 401) {
          setHistoryError(
            err.response?.data?.error ||
            "Unable to load chat history. Please try again."
          );
        }
      } finally {
        if (isMounted) {
          setHistoryLoading(false);
        }
      }
    };

    fetchChatHistory();

    return () => {
      isMounted = false;
    };
  }, [activePage, token]);

  // Format the date stored by MongoDB
  const formatDate = (date) => {
    if (!date) {
      return "Date unavailable";
    }

    const formattedDate = new Date(date);

    if (Number.isNaN(formattedDate.getTime())) {
      return "Date unavailable";
    }

    return formattedDate.toLocaleString();
  };

  // Suggested questions on the welcome screen
  const quickPrompts = [
    {
      icon: Package,
      title: "Track my order",
      description: "Check your latest order status",
    },
    {
      icon: RefreshCcw,
      title: "Refund policy",
      description: "Learn about refunds and returns",
    },
    {
      icon: CreditCard,
      title: "Payment issues",
      description: "Get help with payments",
    },
  ];

  // Show login and signup before opening the chatbot
  if (!token) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="brand-icon">
            <Headphones size={22} />
          </div>

          <div>
            <h2>Support AI</h2>
            <span>Customer Assistant</span>
          </div>
        </div>

        <button
          className="new-chat-button"
          onClick={handleNewChat}
        >
          <Plus size={18} />
          <span>New Chat</span>
        </button>

        <nav className="sidebar-nav">
          <p className="nav-heading">MENU</p>

          <button
            className={
              activePage === "chat"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => setActivePage("chat")}
          >
            <MessageSquare size={18} />
            <span>Chat</span>
          </button>

          <button
            className={
              activePage === "history"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => setActivePage("history")}
          >
            <History size={18} />
            <span>Chat History</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <button className="nav-item">
            <Settings size={18} />
            <span>Settings</span>
          </button>

          <div className="user-profile">
            <div className="profile-avatar">
              <User size={19} />
            </div>

            <div className="profile-info">
              <h4>{currentUser?.name || "User"}</h4>
              <span>
                {currentUser?.email || "Customer Account"}
              </span>
            </div>

            <button
              className="logout-button"
              onClick={handleLogout}
              title="Logout"
              aria-label="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h3>
              {activePage === "chat"
                ? "AI Support Chat"
                : "Chat History"}
            </h3>

            <p>Get help with your orders and questions</p>
          </div>

          <div className="topbar-status">
            <span className="status-dot"></span>
            AI Assistant
          </div>
        </header>

        {activePage === "chat" ? (
          <section className="chat-section">
            <div className="chat-content">
              {messages.length === 0 ? (
                <div className="welcome-section">
                  <div className="welcome-icon">
                    <Bot size={34} />
                  </div>

                  <h1>How can we help you today?</h1>

                  <p>
                    Ask me anything about your orders, refunds,
                    payments, or other customer support questions.
                  </p>

                  <div className="quick-prompts">
                    {quickPrompts.map((prompt) => {
                      const Icon = prompt.icon;

                      return (
                        <button
                          className="prompt-card"
                          key={prompt.title}
                          onClick={() => setMessage(prompt.title)}
                        >
                          <Icon size={21} />

                          <div>
                            <h4>{prompt.title}</h4>
                            <p>{prompt.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="messages-container">
                  {messages.map((item) => (
                    <div
                      className={`message-row ${item.sender}`}
                      key={item.id}
                    >
                      <div className="message-avatar">
                        {item.sender === "user" ? (
                          <User size={17} />
                        ) : (
                          <Bot size={17} />
                        )}
                      </div>

                      <div className="message-bubble">
                        {item.sender === "assistant" ? (
                          <ReactMarkdown>
                            {item.text || ""}
                          </ReactMarkdown>
                        ) : (
                          item.text
                        )}
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="message-row assistant">
                      <div className="message-avatar">
                        <Bot size={17} />
                      </div>

                      <div className="message-bubble">
                        Thinking...
                      </div>
                    </div>
                  )}
                </div>
              )}

              {error && (
                <p className="chat-error">{error}</p>
              )}
            </div>

            <form
              className="chat-input-area"
              onSubmit={handleSendMessage}
            >
              <div className="chat-input-wrapper">
                <input
                  type="text"
                  placeholder="Message your support assistant..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={loading}
                />

                <button
                  type="submit"
                  className="send-button"
                  disabled={!message.trim() || loading}
                  aria-label="Send message"
                >
                  <Send size={19} />
                </button>
              </div>

              <p className="input-disclaimer">
                AI responses can sometimes be inaccurate.
              </p>
            </form>
          </section>
        ) : (
          <section className="history-section">
            {historyLoading ? (
              <div className="history-empty">
                <p>Loading chat history...</p>
              </div>
            ) : historyError ? (
              <div className="history-empty">
                <p className="chat-error">{historyError}</p>
              </div>
            ) : history.length === 0 ? (
              <div className="history-empty">
                <div className="welcome-icon">
                  <Search size={30} />
                </div>

                <h2>No chat history yet</h2>

                <p>
                  Start a conversation to see your chat history here.
                </p>

                <button
                  className="new-chat-button"
                  onClick={handleNewChat}
                >
                  <Plus size={18} />
                  Start a New Chat
                </button>
              </div>
            ) : (
              <div className="history-list">
                <h2>Your Previous Messages</h2>

                {history.map((item) => (
                  <div
                    className="history-card"
                    key={item._id}
                  >
                    <p className="history-meta">
                      {formatDate(item.createdAt)}
                    </p>

                    <div className="history-message">
                      <strong>You</strong>
                      <p>{item.message}</p>
                    </div>

                    <div className="history-reply">
                      <strong>AI Assistant</strong>
                      <ReactMarkdown>
                        {item.reply || ""}
                      </ReactMarkdown>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
