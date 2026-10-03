"use client";

import { useState } from "react";

export default function CopyLink() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link", window.location.href);
    }
  }

  return (
    <button type="button" className="ghost" onClick={copy}>
      {copied ? "Copied" : "Copy invite link"}
    </button>
  );
}
