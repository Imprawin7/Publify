"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  UserRound,
  Code2,
  FolderKanban,
  FileText,
  BriefcaseBusiness,
  MessageSquareQuote,
  Layers3,
  Images,
  Mail,
  LogOut,
  Search,
  Bell,
  ChevronDown,
  Menu,
  X,
  Loader2,
} from "lucide-react";
import { isLoggedIn, logout } from "@/lib/adminApi";

const navigation = [
  {
    label: "OVERVIEW",
    items: [
      {
        label: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "CONTENT",
    items: [
      {
        label: "About",
        href: "/admin/about",
        icon: UserRound,
      },
      {
        label: "Skills",
        href: "/admin/skills",
        icon: Code2,
      },
      {
        label: "Projects",
        href: "/admin/projects",
        icon: FolderKanban,
      },
      {
        label: "Blog",
        href: "/admin/blogs",
        icon: FileText,
      },
      {
        label: "Experience",
        href: "/admin/experience",
        icon: BriefcaseBusiness,
      },
      {
        label: "Testimonials",
        href: "/admin/testimonials",
        icon: MessageSquareQuote,
      },
      {
        label: "Services",
        href: "/admin/services",
        icon: Layers3,
      },
    ],
  },
  {
    label: "ASSETS",
    items: [
      {
        label: "Media",
        href: "/admin/media",
        icon: Images,
      },
    ],
  },
  {
    label: "INBOX",
    items: [
      {
        label: "Messages",
        href: "/admin/messages",
        icon: Mail,
      },
    ],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === "/admin/login";

  const [checked, setChecked] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    if (isLoginPage) {
      setChecked(true);
      return;
    }

    if (!isLoggedIn()) {
      router.replace("/admin/login");
      return;
    }

    setChecked(true);
  }, [isLoginPage, router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  function handleLogout() {
    logout();
    router.replace("/admin/login");
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!checked) {
    return (
      <div className="publify-auth-loading">
        <div className="publify-auth-loading-card">
          <div className="publify-auth-logo">P</div>

          <div>
            <strong>Publify</strong>
            <span>Checking session...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="publify-admin">
      {sidebarOpen && (
        <button
          type="button"
          className="publify-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close navigation"
        />
      )}

      <aside
        className={`publify-sidebar ${
          sidebarOpen ? "publify-sidebar-open" : ""
        }`}
      >
        <div className="publify-sidebar-brand">
          <Link href="/admin" className="publify-brand-link">
            <div className="publify-brand-mark">P</div>

            <div>
              <strong>Publify</strong>
              <span>Content Management</span>
            </div>
          </Link>

          <button
            type="button"
            className="publify-mobile-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="publify-sidebar-nav">
          {navigation.map((section) => (
            <div
              key={section.label}
              className="publify-nav-section"
            >
              <div className="publify-nav-label">
                {section.label}
              </div>

              <div className="publify-nav-items">
                {section.items.map((item) => {
                  const Icon = item.icon;

                  const active =
                    pathname === item.href ||
                    (item.href !== "/admin" &&
                      pathname.startsWith(`${item.href}/`));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`publify-nav-item ${
                        active ? "publify-nav-item-active" : ""
                      }`}
                    >
                      <Icon size={16} strokeWidth={1.8} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="publify-sidebar-bottom">
          <div className="publify-sidebar-user">
            <div className="publify-sidebar-avatar">A</div>

            <div>
              <strong>Administrator</strong>
              <span>Publify CMS</span>
            </div>
          </div>

          <button
            type="button"
            className="publify-logout-button"
            onClick={handleLogout}
          >
            <LogOut size={15} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      <div className="publify-admin-content">
        <header className="publify-topbar">
          <div className="publify-topbar-left">
            <button
              type="button"
              className="publify-menu-button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={19} />
            </button>

            <div className="publify-breadcrumb">
              <span>Publify</span>
              <span>/</span>
              <strong>
                {pathname === "/admin"
                  ? "Dashboard"
                  : pathname
                      .split("/")
                      .filter(Boolean)
                      .pop()
                      ?.replace(/-/g, " ")
                      .replace(/\b\w/g, (letter) =>
                        letter.toUpperCase()
                      )}
              </strong>
            </div>
          </div>

          <div className="publify-topbar-right">
            <div className="publify-search">
              <Search size={15} />
              <input
                type="search"
                placeholder="Search content..."
                aria-label="Search content"
              />
              <kbd>⌘ K</kbd>
            </div>

            <button
              type="button"
              className="publify-icon-button"
              aria-label="Notifications"
            >
              <Bell size={17} />
            </button>

            <div className="publify-profile">
              <button
                type="button"
                className="publify-profile-button"
                onClick={() =>
                  setProfileOpen((value) => !value)
                }
              >
                <span className="publify-profile-avatar">A</span>

                <span className="publify-profile-info">
                  <strong>Administrator</strong>
                  <small>CMS Admin</small>
                </span>

                <ChevronDown size={14} />
              </button>

              {profileOpen && (
                <div className="publify-profile-menu">
                  <div className="publify-profile-menu-heading">
                    <strong>Administrator</strong>
                    <span>Publify CMS</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                  >
                    <LogOut size={14} />
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="publify-main">{children}</main>
      </div>
    </div>
  );
}