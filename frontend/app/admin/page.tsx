"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  FolderKanban,
  FileText,
  Mail,
  Images,
  ArrowUpRight,
  Plus,
  RefreshCw,
  Loader2,
  MessageSquare,
  Clock3,
  CheckCircle2,
  Circle,
  UserRound,
  Code2,
  BriefcaseBusiness,
  MessageSquareQuote,
  Layers3,
} from "lucide-react";
import { authFetch } from "@/lib/adminApi";

interface Project {
  id: number;
  title?: string;
  createdAt?: string;
}

interface Blog {
  id: number;
  title?: string;
  status?: string;
  createdAt?: string;
  publishedAt?: string;
}

interface Media {
  id: number;
  filename?: string;
  uploadedAt?: string;
}

interface Message {
  id: number;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface DashboardData {
  projects: Project[];
  blogs: Blog[];
  media: Media[];
  messages: Message[];
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData>({
    projects: [],
    blogs: [],
    media: [],
    messages: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    setLoading(true);
    setError("");

    try {
      const [projectsRes, blogsRes, mediaRes, messagesRes] =
        await Promise.all([
          authFetch("/projects"),
          authFetch("/blogs"),
          authFetch("/media/library"),
          authFetch("/messages"),
        ]);

      if (
        !projectsRes.ok ||
        !blogsRes.ok ||
        !mediaRes.ok ||
        !messagesRes.ok
      ) {
        throw new Error("Unable to load dashboard data.");
      }

      const [projects, blogs, media, messages] = await Promise.all([
        projectsRes.json(),
        blogsRes.json(),
        mediaRes.json(),
        messagesRes.json(),
      ]);

      setData({
        projects: Array.isArray(projects) ? projects : [],
        blogs: Array.isArray(blogs) ? blogs : [],
        media: Array.isArray(media) ? media : [],
        messages: Array.isArray(messages) ? messages : [],
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const unreadMessages = useMemo(
    () => data.messages.filter((message) => !message.read),
    [data.messages]
  );

  const publishedBlogs = useMemo(
    () =>
      data.blogs.filter(
        (blog) => blog.status?.toUpperCase() === "PUBLISHED"
      ),
    [data.blogs]
  );

  const stats = [
    {
      label: "Projects",
      value: data.projects.length,
      icon: FolderKanban,
      href: "/admin/projects",
    },
    {
      label: "Blog posts",
      value: data.blogs.length,
      icon: FileText,
      href: "/admin/blogs",
    },
    {
      label: "Unread messages",
      value: unreadMessages.length,
      icon: Mail,
      href: "/admin/messages",
    },
    {
      label: "Media",
      value: data.media.length,
      icon: Images,
      href: "/admin/media",
    },
  ];

  const recentMessages = [...data.messages]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

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

  return (
    <div className="publify-dashboard">
      <div className="publify-page-header publify-dashboard-header">
        <div>
          <span className="publify-page-eyebrow">CMS OVERVIEW</span>

          <h1>Dashboard</h1>

          <p>
            Manage your portfolio content, media and enquiries from one
            place.
          </p>
        </div>

        <div className="publify-dashboard-header-actions">
          <button
            type="button"
            className="publify-dashboard-refresh"
            onClick={loadDashboard}
            disabled={loading}
          >
            <RefreshCw
              size={15}
              className={loading ? "publify-spin" : ""}
            />
            Refresh
          </button>

          <Link
            href="/admin/projects"
            className="publify-primary-button"
          >
            <Plus size={15} />
            New project
          </Link>
        </div>
      </div>

      {error && (
        <div className="publify-dashboard-error">
          <span>{error}</span>

          <button type="button" onClick={loadDashboard}>
            Try again
          </button>
        </div>
      )}

      <div className="publify-dashboard-stats">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="publify-dashboard-stat"
            >
              <div className="publify-dashboard-stat-icon">
                <Icon size={17} />
              </div>

              <div className="publify-dashboard-stat-content">
                <span>{stat.label}</span>

                <strong>
                  {loading ? (
                    <Loader2
                      size={19}
                      className="publify-spin"
                    />
                  ) : (
                    stat.value
                  )}
                </strong>
              </div>

              <ArrowUpRight
                size={15}
                className="publify-dashboard-stat-arrow"
              />
            </Link>
          );
        })}
      </div>

      <div className="publify-dashboard-main-grid">
        <section className="publify-dashboard-panel">
          <div className="publify-dashboard-panel-header">
            <div>
              <span className="publify-dashboard-panel-eyebrow">
                INBOX
              </span>

              <h2>Recent messages</h2>
            </div>

            <Link href="/admin/messages">
              View all
              <ArrowUpRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="publify-dashboard-loading">
              <Loader2 size={19} className="publify-spin" />
              <span>Loading messages...</span>
            </div>
          ) : recentMessages.length === 0 ? (
            <div className="publify-dashboard-empty">
              <MessageSquare size={23} />
              <strong>No messages yet</strong>
              <span>
                Contact form submissions will appear here.
              </span>
            </div>
          ) : (
            <div className="publify-dashboard-messages">
              {recentMessages.map((message) => (
                <Link
                  key={message.id}
                  href="/admin/messages"
                  className={`publify-dashboard-message ${
                    !message.read
                      ? "publify-dashboard-message-unread"
                      : ""
                  }`}
                >
                  <div className="publify-dashboard-message-avatar">
                    {getInitials(message.name)}
                  </div>

                  <div className="publify-dashboard-message-body">
                    <div className="publify-dashboard-message-top">
                      <strong>{message.name}</strong>

                      <span>{formatDate(message.createdAt)}</span>
                    </div>

                    <span>{message.email}</span>

                    <p>{message.message}</p>
                  </div>

                  {!message.read && (
                    <div className="publify-dashboard-unread-dot" />
                  )}
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="publify-dashboard-panel">
          <div className="publify-dashboard-panel-header">
            <div>
              <span className="publify-dashboard-panel-eyebrow">
                CONTENT
              </span>

              <h2>Content overview</h2>
            </div>
          </div>

          <div className="publify-dashboard-content-list">
            <Link
              href="/admin/about"
              className="publify-dashboard-content-item"
            >
              <div className="publify-dashboard-content-icon">
                <UserRound size={16} />
              </div>

              <div>
                <strong>About</strong>
                <span>Profile introduction and contact details</span>
              </div>

              <ArrowUpRight size={14} />
            </Link>

            <Link
              href="/admin/skills"
              className="publify-dashboard-content-item"
            >
              <div className="publify-dashboard-content-icon">
                <Code2 size={16} />
              </div>

              <div>
                <strong>Skills</strong>
                <span>Technical skills and proficiency</span>
              </div>

              <ArrowUpRight size={14} />
            </Link>

            <Link
              href="/admin/experience"
              className="publify-dashboard-content-item"
            >
              <div className="publify-dashboard-content-icon">
                <BriefcaseBusiness size={16} />
              </div>

              <div>
                <strong>Experience</strong>
                <span>Professional experience and timeline</span>
              </div>

              <ArrowUpRight size={14} />
            </Link>

            <Link
              href="/admin/testimonials"
              className="publify-dashboard-content-item"
            >
              <div className="publify-dashboard-content-icon">
                <MessageSquareQuote size={16} />
              </div>

              <div>
                <strong>Testimonials</strong>
                <span>Client feedback and recommendations</span>
              </div>

              <ArrowUpRight size={14} />
            </Link>

            <Link
              href="/admin/services"
              className="publify-dashboard-content-item"
            >
              <div className="publify-dashboard-content-icon">
                <Layers3 size={16} />
              </div>

              <div>
                <strong>Services</strong>
                <span>Services presented on the website</span>
              </div>

              <ArrowUpRight size={14} />
            </Link>
          </div>
        </section>
      </div>

      <div className="publify-dashboard-bottom-grid">
        <section className="publify-dashboard-mini-panel">
          <div className="publify-dashboard-mini-header">
            <div>
              <span>Blog</span>
              <strong>{publishedBlogs.length}</strong>
            </div>

            <FileText size={18} />
          </div>

          <p>
            {publishedBlogs.length === 1
              ? "published article"
              : "published articles"}
          </p>

          <Link href="/admin/blogs">
            Manage blog
            <ArrowUpRight size={14} />
          </Link>
        </section>

        <section className="publify-dashboard-mini-panel">
          <div className="publify-dashboard-mini-header">
            <div>
              <span>Inbox status</span>
              <strong>{unreadMessages.length}</strong>
            </div>

            <Mail size={18} />
          </div>

          <p>
            {unreadMessages.length === 1
              ? "message waiting for review"
              : "messages waiting for review"}
          </p>

          <Link href="/admin/messages">
            Open inbox
            <ArrowUpRight size={14} />
          </Link>
        </section>

        <section className="publify-dashboard-mini-panel">
          <div className="publify-dashboard-mini-header">
            <div>
              <span>Media library</span>
              <strong>{data.media.length}</strong>
            </div>

            <Images size={18} />
          </div>

          <p>
            {data.media.length === 1 ? "uploaded asset" : "uploaded assets"}
          </p>

          <Link href="/admin/media">
            Manage media
            <ArrowUpRight size={14} />
          </Link>
        </section>
      </div>

      <section className="publify-dashboard-banner">
        <div className="publify-dashboard-banner-icon">
          <CheckCircle2 size={20} />
        </div>

        <div>
          <span>Publify CMS</span>
          <strong>Your content, your system.</strong>
          <p>
            Manage your portfolio content from one clean, centralized
            workspace.
          </p>
        </div>

        <div className="publify-dashboard-banner-status">
          <Circle size={9} fill="currentColor" />
          System ready
        </div>
      </section>

      <div className="publify-dashboard-footer-note">
        <Clock3 size={14} />
        <span>
          Dashboard data is loaded directly from the Publify API.
        </span>
      </div>
    </div>
  );
}