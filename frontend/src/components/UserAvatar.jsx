"use client";

import { useEffect, useState } from "react";

function initialsFrom(user) {
  const fromName = user?.name?.trim();
  if (fromName) {
    return fromName
      .split(/\s+/)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }
  const email = user?.email?.trim();
  if (email) return email[0].toUpperCase();
  return "U";
}

/** Google profile photos often need referrerPolicy=no-referrer; fall back to initials on error. */
export default function UserAvatar({ user, size = 32, className = "" }) {
  const [failed, setFailed] = useState(false);
  const initials = initialsFrom(user);
  const px = `${size}px`;
  const textSize = Math.max(10, Math.round(size * 0.38));

  useEffect(() => {
    setFailed(false);
  }, [user?.image, user?.email]);

  if (user?.image && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={user.image}
        alt=""
        width={size}
        height={size}
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className={`rounded-full object-cover ${className}`}
        style={{ width: px, height: px }}
      />
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-linear-to-br from-brand to-accent font-semibold text-slate-950 ${className}`}
      style={{ width: px, height: px, fontSize: textSize }}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}
