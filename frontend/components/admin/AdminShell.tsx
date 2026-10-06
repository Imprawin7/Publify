"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/adminApi";

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/admin/login");
      return;
    }

    setChecked(true);
  }, [router]);

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

  return <>{children}</>;
}