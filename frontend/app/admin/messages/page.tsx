"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Mail,
  MailOpen,
  Check,
  RefreshCw,
  X,
  Loader2,
  UserRound,
  Clock3,
  Send,
  Inbox,
} from "lucide-react";
import { authFetch } from "@/lib/adminApi";

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

type Filter = "all" | "unread" | "read";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [markingRead, setMarkingRead] = useState<number | null>(null);

  async function refresh() {
    setLoading(true);
    setError("");

    try {
      const res = await authFetch("/messages");

      if (!res.ok) {
        throw new Error("Failed to load messages.");
      }

      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load messages."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function markRead(id: number) {
    setMarkingRead(id);
    setError("");

    try {
      const res = await authFetch(`/messages/${id}/read`, {
        method: "PUT",
      });

      if (!res.ok) {
        throw new Error("Failed to mark message as read.");
      }

      setMessages((prev) =>
        prev.map((message) =>
          message.id === id ? { ...message, read: true } : message
        )
      );

      setSelected((current) =>
        current?.id === id ? { ...current, read: true } : current
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to mark message as read."
      );
    } finally {
      setMarkingRead(null);
    }
  }

  function formatDate(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function formatTime(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function formatDateTime(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function getInitials(name: string) {
    return (
      name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() || "")
        .join("") || "?"
    );
  }

  const unreadCount = messages.filter((message) => !message.read).length;
  const readCount = messages.length - unreadCount;

  const filteredMessages = useMemo(() => {
    const query = search.trim().toLowerCase();

    return messages.filter((message) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "unread" && !message.read) ||
        (filter === "read" && message.read);

      if (!matchesFilter) {
        return false;
      }

      if (!query) {
        return true;
      }

      return [message.name, message.email, message.message]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query));
    });
  }, [messages, search, filter]);

  return (
    <div className="publify-messages-page">
      <div className="publify-page-header">
        <div>
          <span className="publify-page-eyebrow">INBOX</span>
          <h1>Messages</h1>
          <p>
            Review enquiries and messages submitted through your public
            contact form.
          </p>
        </div>

        <button
          type="button"
          className="publify-messages-refresh"
          onClick={refresh}
          disabled={loading}
        >
          <RefreshCw
            size={15}
            className={loading ? "publify-spin" : ""}
          />
          Refresh
        </button>
      </div>

      <div className="publify-messages-summary">
        <div className="publify-message-summary-card">
          <div className="publify-message-summary-icon">
            <Inbox size={17} />
          </div>

          <div>
            <span>Total messages</span>
            <strong>{messages.length}</strong>
          </div>
        </div>

        <div className="publify-message-summary-card">
          <div className="publify-message-summary-icon">
            <Mail size={17} />
          </div>

          <div>
            <span>Unread</span>
            <strong>{unreadCount}</strong>
          </div>
        </div>

        <div className="publify-message-summary-card">
          <div className="publify-message-summary-icon">
            <MailOpen size={17} />
          </div>

          <div>
            <span>Read</span>
            <strong>{readCount}</strong>
          </div>
        </div>
      </div>

      {error && (
        <div className="publify-messages-error">
          <span>{error}</span>

          <button type="button" onClick={() => setError("")}>
            <X size={15} />
          </button>
        </div>
      )}

      <div className="publify-messages-toolbar">
        <div className="publify-messages-search">
          <Search size={16} />

          <input
            type="text"
            placeholder="Search messages..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="publify-message-filters">
          <button
            type="button"
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            All
            <span>{messages.length}</span>
          </button>

          <button
            type="button"
            className={filter === "unread" ? "active" : ""}
            onClick={() => setFilter("unread")}
          >
            Unread
            <span>{unreadCount}</span>
          </button>

          <button
            type="button"
            className={filter === "read" ? "active" : ""}
            onClick={() => setFilter("read")}
          >
            Read
            <span>{readCount}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="publify-content-loading">
          <div className="publify-loading-card">
            <Loader2 size={20} className="publify-spin" />
            <span>Loading messages...</span>
          </div>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="publify-messages-empty">
          <div className="publify-messages-empty-icon">
            {search || filter !== "all" ? (
              <Search size={25} />
            ) : (
              <Inbox size={25} />
            )}
          </div>

          <h3>
            {search || filter !== "all"
              ? "No messages found"
              : "Your inbox is empty"}
          </h3>

          <p>
            {search || filter !== "all"
              ? "Try changing your search or filter."
              : "Messages submitted through your public contact form will appear here."}
          </p>

          {(search || filter !== "all") && (
            <button
              type="button"
              className="publify-secondary-button"
              onClick={() => {
                setSearch("");
                setFilter("all");
              }}
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="publify-messages-list">
          {filteredMessages.map((message) => (
            <article
              key={message.id}
              className={`publify-message-card ${
                !message.read ? "publify-message-unread" : ""
              }`}
              onClick={() => setSelected(message)}
            >
              <div className="publify-message-avatar">
                {getInitials(message.name)}
              </div>

              <div className="publify-message-main">
                <div className="publify-message-top">
                  <div className="publify-message-sender">
                    <strong>{message.name}</strong>

                    {!message.read && (
                      <span className="publify-message-unread-dot" />
                    )}
                  </div>

                  <time>
                    {formatDate(message.createdAt)}
                    <span>{formatTime(message.createdAt)}</span>
                  </time>
                </div>

                <span className="publify-message-email">
                  {message.email}
                </span>

                <p>{message.message}</p>

                <div className="publify-message-footer">
                  <span
                    className={`publify-message-status ${
                      message.read ? "read" : "unread"
                    }`}
                  >
                    {message.read ? (
                      <>
                        <MailOpen size={12} />
                        Read
                      </>
                    ) : (
                      <>
                        <Mail size={12} />
                        Unread
                      </>
                    )}
                  </span>

                  {!message.read && (
                    <button
                      type="button"
                      className="publify-message-read-button"
                      onClick={(event) => {
                        event.stopPropagation();
                        markRead(message.id);
                      }}
                      disabled={markingRead === message.id}
                    >
                      {markingRead === message.id ? (
                        <>
                          <Loader2
                            size={13}
                            className="publify-spin"
                          />
                          Updating
                        </>
                      ) : (
                        <>
                          <Check size={13} />
                          Mark as read
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {selected && (
        <div
          className="publify-message-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelected(null);
            }
          }}
        >
          <div className="publify-message-modal">
            <div className="publify-message-modal-header">
              <div className="publify-message-modal-person">
                <div className="publify-message-avatar large">
                  {getInitials(selected.name)}
                </div>

                <div>
                  <span className="publify-page-eyebrow">
                    MESSAGE
                  </span>
                  <h2>{selected.name}</h2>
                  <a href={`mailto:${selected.email}`}>
                    {selected.email}
                  </a>
                </div>
              </div>

              <button
                type="button"
                className="publify-icon-button"
                onClick={() => setSelected(null)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="publify-message-meta">
              <span>
                <Clock3 size={14} />
                {formatDateTime(selected.createdAt)}
              </span>

              <span
                className={`publify-message-status ${
                  selected.read ? "read" : "unread"
                }`}
              >
                {selected.read ? (
                  <>
                    <MailOpen size={12} />
                    Read
                  </>
                ) : (
                  <>
                    <Mail size={12} />
                    Unread
                  </>
                )}
              </span>
            </div>

            <div className="publify-message-content">
              <span>Message</span>
              <p>{selected.message}</p>
            </div>

            <div className="publify-message-modal-footer">
              {!selected.read && (
                <button
                  type="button"
                  className="publify-secondary-button"
                  onClick={() => markRead(selected.id)}
                  disabled={markingRead === selected.id}
                >
                  {markingRead === selected.id ? (
                    <Loader2 size={14} className="publify-spin" />
                  ) : (
                    <Check size={14} />
                  )}
                  Mark as read
                </button>
              )}

              <a
                href={`mailto:${selected.email}`}
                className="publify-primary-button"
              >
                <Send size={14} />
                Reply by email
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}