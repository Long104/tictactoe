"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconArrowLeft } from "@tabler/icons-react";

const HomeButton = () => {
  const pathname = usePathname();

  if (pathname === "/") return null;

  return (
    <Link
      href="/"
      style={{
        position: "fixed",
        top: "1.25rem",
        left: "1.25rem",
        zIndex: 50,
        display: "inline-flex",
        alignItems: "center",
        gap: "0.375rem",
        padding: "0.5rem 0.875rem",
        borderRadius: "10px",
        background: "var(--bg-panel)",
        border: "1px solid var(--border)",
        color: "var(--text-secondary)",
        fontSize: "0.8rem",
        fontWeight: 600,
        textDecoration: "none",
        transition: "border-color 0.15s ease, color 0.15s ease, background 0.15s ease",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.borderColor = "var(--accent)";
        el.style.color = "var(--accent)";
        el.style.background = "var(--accent-dim)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.borderColor = "var(--border)";
        el.style.color = "var(--text-secondary)";
        el.style.background = "var(--bg-panel)";
      }}
    >
      <IconArrowLeft size={14} strokeWidth={2.5} />
      Home
    </Link>
  );
};

export default HomeButton;
