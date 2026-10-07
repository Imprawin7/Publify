"use client";

import WorkspaceShell from "@/components/workspace/WorkspaceShell";
import type { ReactNode } from "react";

export default function WorkspaceLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <WorkspaceShell>{children}</WorkspaceShell>;
}
