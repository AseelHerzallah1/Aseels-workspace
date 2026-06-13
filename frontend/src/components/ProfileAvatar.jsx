"use client";

import { PROFILE } from "@/lib/constants";

export default function ProfileAvatar({ size = 72 }) {
  const initials = PROFILE.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (PROFILE.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={PROFILE.image}
        alt={PROFILE.name}
        width={size}
        height={size}
        className="rounded-full border-2 border-brand/30 object-cover shadow-md shadow-brand/20"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="flex items-center justify-center rounded-full border-2 border-brand/30 bg-linear-to-br from-brand to-accent text-white shadow-md shadow-brand/25"
      style={{ width: size, height: size, fontSize: size * 0.32 }}
    >
      {initials}
    </div>
  );
}
