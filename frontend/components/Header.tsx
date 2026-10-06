"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";

const NAV = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Resources" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#E7E7E2] bg-[#F8F8F5]/95 backdrop-blur-md">
      <div className="mx-auto flex h-[76px] max-w-[1280px] items-center justify-between px-6 sm:px-8 lg:px-10">

        {/* BRAND */}
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="group flex items-center gap-3"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-[#111111] text-sm font-semibold text-white transition-transform duration-200 group-hover:-rotate-3">
            P
          </span>

          <span className="text-[17px] font-semibold tracking-[-0.035em] text-[#111111]">
            Publify
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <nav
          aria-label="Primary"
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[13px] font-medium text-[#686862] transition-colors duration-200 hover:text-[#111111]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* DESKTOP ACTIONS */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/contact"
            className="px-4 py-2 text-[13px] font-medium text-[#55554F] transition-colors hover:text-[#111111]"
          >
            Contact
          </Link>

          <Link
            href="/admin/login"
            className="group inline-flex items-center gap-2 rounded-full bg-[#111111] px-5 py-2.5 text-[13px] font-medium text-white transition-transform duration-200 hover:-translate-y-0.5"
          >
            Get started
            <ArrowUpRight
              size={14}
              strokeWidth={1.8}
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>

        {/* MOBILE BUTTON */}
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#DEDED8] text-[#222222] md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>

      {/* MOBILE NAV */}
      {open && (
        <div className="border-t border-[#E7E7E2] bg-[#F8F8F5] md:hidden">
          <nav
            aria-label="Mobile navigation"
            className="mx-auto max-w-[1280px] px-6 py-5 sm:px-8"
          >
            <div className="flex flex-col">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-[#E7E7E2] py-4 text-sm font-medium text-[#33332F] transition-colors hover:text-[#157A5B]"
                >
                  {item.label}
                </Link>
              ))}

              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="border-b border-[#E7E7E2] py-4 text-sm font-medium text-[#33332F]"
              >
                Contact
              </Link>

              <Link
                href="/admin/login"
                onClick={() => setOpen(false)}
                className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-[#111111] px-5 py-3 text-sm font-medium text-white"
              >
                Get started
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}