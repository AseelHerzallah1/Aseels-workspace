"use client";

import { useEffect, useRef, useState } from "react";

/** Aseel-branded animated robot (teal + violet, not generic purple). */
export default function Robot({ size = 120, float = true }) {
  const wrapRef = useRef(null);
  const [pupil, setPupil] = useState({ x: 0, y: 0 });
  const [blinking, setBlinking] = useState(false);

  useEffect(() => {
    function handleMove(e) {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy) || 1;
      const maxOffset = 3.5;
      setPupil({
        x: (dx / dist) * Math.min(maxOffset, dist / 40),
        y: (dy / dist) * Math.min(maxOffset, dist / 40),
      });
    }
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  useEffect(() => {
    let timeout;
    const scheduleBlink = () => {
      timeout = setTimeout(() => {
        setBlinking(true);
        setTimeout(() => setBlinking(false), 130);
        scheduleBlink();
      }, 2200 + Math.random() * 3200);
    };
    scheduleBlink();
    return () => clearTimeout(timeout);
  }, []);

  const eyeStyle = {
    transformBox: "fill-box",
    transformOrigin: "center",
    transform: blinking ? "scaleY(0.12)" : "scaleY(1)",
    transition: "transform 0.11s ease",
  };
  const pupilStyle = {
    transform: `translate(${pupil.x}px, ${pupil.y}px)`,
    transition: "transform 0.08s linear",
  };

  return (
    <div ref={wrapRef} className={float ? "animate-float" : ""} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 140 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible", filter: "drop-shadow(0 10px 16px rgba(13,148,136,0.35))" }}
      >
        <line x1="70" y1="20" x2="70" y2="38" stroke="#0D9488" strokeWidth="5" strokeLinecap="round" />
        <circle className="tip-pulse" cx="70" cy="14" r="7" fill="#8B5CF6" />

        <rect x="20" y="68" width="11" height="26" rx="5.5" fill="#5EEAD4" />
        <rect x="109" y="68" width="11" height="26" rx="5.5" fill="#5EEAD4" />

        <rect x="30" y="40" width="80" height="74" rx="28" fill="url(#aseelRobotGrad)" />
        <ellipse cx="62" cy="58" rx="30" ry="13" fill="#FFFFFF" opacity="0.2" />

        <g style={eyeStyle}>
          <ellipse cx="55" cy="74" rx="11" ry="12" fill="#FFFFFF" />
          <g style={pupilStyle}>
            <circle cx="55" cy="75" r="5.5" fill="#134E4A" />
            <circle cx="57" cy="72.5" r="1.7" fill="#FFFFFF" />
          </g>
        </g>

        <g style={eyeStyle}>
          <ellipse cx="85" cy="74" rx="11" ry="12" fill="#FFFFFF" />
          <g style={pupilStyle}>
            <circle cx="85" cy="75" r="5.5" fill="#134E4A" />
            <circle cx="87" cy="72.5" r="1.7" fill="#FFFFFF" />
          </g>
        </g>

        <circle cx="44" cy="90" r="5" fill="#2DD4BF" opacity="0.55" />
        <circle cx="96" cy="90" r="5" fill="#A78BFA" opacity="0.5" />

        <path d="M58 92 Q70 102 82 92" stroke="#134E4A" strokeWidth="4.5" strokeLinecap="round" fill="none" />

        <defs>
          <linearGradient id="aseelRobotGrad" x1="30" y1="40" x2="110" y2="114" gradientUnits="userSpaceOnUse">
            <stop stopColor="#99F6E4" />
            <stop offset="0.55" stopColor="#2DD4BF" />
            <stop offset="1" stopColor="#0D9488" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
