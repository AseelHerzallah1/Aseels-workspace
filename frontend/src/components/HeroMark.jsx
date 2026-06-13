"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Professional floating 3D mark.
 * Shapes: bot-sentinel | bot-vis | bot-iso | bot-frame | bot-human | crystal | orb …
 * Set HERO_MARK_VARIANT in constants.js to switch.
 */
export default function HeroMark({ size = 96, interactive = true, variant = "crystal", subtle = false }) {
  const ref = useRef(null);
  const [gaze, setGaze] = useState({ x: 0, y: 0 });
  const [face, setFace] = useState({ x: 0, y: 0, r: 0 });
  const uid = useRef(`hm-${Math.random().toString(36).slice(2, 9)}`).current;
  const dim = size * (variant.startsWith("bot") ? 0.88 : 0.72);

  useEffect(() => {
    if (!interactive) return;
    function onMove(e) {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const clamp = (v) => Math.max(-1, Math.min(1, v));
      const nx = clamp((e.clientX - (r.left + r.width / 2)) / (r.width / 2));
      const ny = clamp((e.clientY - (r.top + r.height / 2)) / (r.height / 2));
      // Eyes do most of the tracking; face shifts only slightly
      setGaze({ x: nx * 2.8, y: ny * 2.5 });
      setFace({ x: nx * 1.6, y: ny * 1.2, r: nx * 1.8 });
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [interactive]);

  const faceTransform = `translate(${face.x * 0.55}, ${face.y * 0.55}) rotate(${face.r}, 60, 52)`;

  function Eye({ cx, cy, friendly = false, pro = false }) {
    const px = cx + Math.max(-2.2, Math.min(2.2, gaze.x * (pro ? 0.65 : 1)));
    const py = cy + Math.max(-2, Math.min(2, (pro ? gaze.y * 0.7 : friendly ? gaze.y + 0.5 : gaze.y)));
    const rx = pro ? 5.2 : friendly ? 6.2 : 5.5;
    const ry = pro ? 6 : friendly ? 7.2 : 6.5;
    return (
      <g>
        {friendly && !pro && (
          <path
            d={`M${cx - 7} ${cy - 9} Q${cx} ${cy - 12} ${cx + 7} ${cy - 9}`}
            stroke="#0F766E"
            strokeWidth="1.4"
            strokeLinecap="round"
            fill="none"
            opacity="0.35"
          />
        )}
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#F0FDFA" fillOpacity="0.98" />
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} stroke="#14B8A6" strokeWidth="0.8" fill="none" opacity={pro ? 0.32 : 0.4} />
        <circle cx={px} cy={py} r={pro ? 2.5 : friendly ? 3 : 2.6} fill="#134E4A" />
        <circle cx={px + 1} cy={py - 1} r={pro ? 0.9 : friendly ? 1.1 : 0.85} fill="white" fillOpacity="0.9" />
      </g>
    );
  }

  function Shape() {
    switch (variant) {
      case "bot-pro":
        return (
          <svg width={dim} height={dim} viewBox="0 0 120 120" fill="none" className="hero-mark-crystal">
            <defs>
              <linearGradient id={`${uid}-pro-head`} x1="34" y1="32" x2="86" y2="86">
                <stop stopColor="#A7F3D0" />
                <stop offset="0.5" stopColor="#2DD4BF" />
                <stop offset="1" stopColor="#0F766E" />
              </linearGradient>
              <linearGradient id={`${uid}-pro-stroke`} x1="32" y1="22" x2="88" y2="98">
                <stop stopColor="#5EEAD4" />
                <stop offset="1" stopColor="#8B5CF6" stopOpacity="0.75" />
              </linearGradient>
              <filter id={`${uid}-shadow`}>
                <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#0D9488" floodOpacity="0.32" />
              </filter>
            </defs>
            <g filter={`url(#${uid}-shadow)`}>
              <rect x="26" y="70" width="10" height="18" rx="4" fill="#14B8A6" fillOpacity="0.42" />
              <rect x="84" y="70" width="10" height="18" rx="4" fill="#14B8A6" fillOpacity="0.42" />
              <path
                d="M44 84 L76 84 L70 96 L50 96 Z"
                fill="#14B8A6"
                fillOpacity="0.58"
                stroke={`url(#${uid}-pro-stroke)`}
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              <rect x="50" y="88" width="20" height="2" rx="1" fill="#CCFBF1" fillOpacity="0.35" />

              <g transform={faceTransform}>
                <line x1="60" y1="18" x2="60" y2="28" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="60" cy="15" r="2.8" fill="#A78BFA" fillOpacity="0.75" />

                <rect
                  x="30"
                  y="32"
                  width="60"
                  height="50"
                  rx="16"
                  fill={`url(#${uid}-pro-head)`}
                  stroke={`url(#${uid}-pro-stroke)`}
                  strokeWidth="1.5"
                />
                <ellipse cx="60" cy="40" rx="18" ry="6" fill="white" fillOpacity="0.14" />

                <Eye cx={48} cy={53} pro />
                <Eye cx={72} cy={53} pro />

                <path
                  d="M52 67 Q60 70.5 68 67"
                  stroke="#115E59"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.48"
                />
              </g>
            </g>
          </svg>
        );

      case "bot-sentinel":
        return (
          <svg width={dim} height={dim} viewBox="0 0 120 120" fill="none" className="hero-mark-crystal">
            <defs>
              <linearGradient id={`${uid}-sent-head`} x1="34" y1="34" x2="86" y2="88">
                <stop stopColor="#99F6E4" />
                <stop offset="0.4" stopColor="#2DD4BF" />
                <stop offset="1" stopColor="#0F766E" />
              </linearGradient>
              <linearGradient id={`${uid}-sent-visor`} x1="40" y1="54" x2="80" y2="62">
                <stop stopColor="#67E8F9" />
                <stop offset="0.5" stopColor="#A78BFA" />
                <stop offset="1" stopColor="#2DD4BF" />
              </linearGradient>
              <linearGradient id={`${uid}-sent-edge`} x1="30" y1="24" x2="90" y2="100">
                <stop stopColor="#5EEAD4" stopOpacity="0.9" />
                <stop offset="1" stopColor="#7C3AED" stopOpacity="0.55" />
              </linearGradient>
              <filter id={`${uid}-shadow`}>
                <feDropShadow dx="0" dy="9" stdDeviation="7" floodColor="#0D9488" floodOpacity="0.42" />
              </filter>
            </defs>
            <g filter={`url(#${uid}-shadow)`}>
              <line x1="60" y1="18" x2="60" y2="30" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
              <circle cx="60" cy="15" r="3" fill="#22D3EE" fillOpacity="0.9" />
              <circle cx="60" cy="15" r="5.5" fill="#22D3EE" fillOpacity="0.15" />

              <rect x="30" y="68" width="9" height="20" rx="2.5" fill="#115E59" fillOpacity="0.55" />
              <rect x="81" y="68" width="9" height="20" rx="2.5" fill="#115E59" fillOpacity="0.55" />

              <rect
                x="32"
                y="32"
                width="56"
                height="50"
                rx="14"
                fill={`url(#${uid}-sent-head)`}
                stroke={`url(#${uid}-sent-edge)`}
                strokeWidth="1.6"
              />
              <ellipse cx="60" cy="40" rx="20" ry="7" fill="white" fillOpacity="0.12" />

              <rect x="38" y="50" width="44" height="14" rx="5" fill="#042F2E" fillOpacity="0.82" />
              <rect x="39" y="56" width="42" height="2.5" rx="1.25" fill={`url(#${uid}-sent-visor)`} className="hero-mark-visor-pulse" />
              <rect x="44" y="52" width="8" height="1" rx="0.5" fill="#67E8F9" fillOpacity="0.35" />
              <rect x="68" y="52" width="8" height="1" rx="0.5" fill="#67E8F9" fillOpacity="0.35" />

              <circle
                cx={48 + Math.max(-1.2, Math.min(1.2, gaze.x * 0.45))}
                cy={57 + Math.max(-0.8, Math.min(0.8, gaze.y * 0.35))}
                r="1.8"
                fill="#E0F2FE"
                fillOpacity="0.95"
              />
              <circle
                cx={72 + Math.max(-1.2, Math.min(1.2, gaze.x * 0.45))}
                cy={57 + Math.max(-0.8, Math.min(0.8, gaze.y * 0.35))}
                r="1.8"
                fill="#E0F2FE"
                fillOpacity="0.95"
              />

              <path
                d="M44 84 L76 84 L70 96 L50 96 Z"
                fill="#0D9488"
                fillOpacity="0.72"
                stroke={`url(#${uid}-sent-edge)`}
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              <rect x="52" y="88" width="16" height="2" rx="1" fill="#5EEAD4" fillOpacity="0.5" />
            </g>
          </svg>
        );

      case "bot-human":
        return (
          <svg width={dim} height={dim} viewBox="0 0 120 120" fill="none" className="hero-mark-crystal">
            <defs>
              <linearGradient id={`${uid}-human-head`} x1="32" y1="30" x2="88" y2="88">
                <stop stopColor="#CCFBF1" />
                <stop offset="0.45" stopColor="#5EEAD4" />
                <stop offset="1" stopColor="#0D9488" />
              </linearGradient>
              <linearGradient id={`${uid}-human-stroke`} x1="30" y1="20" x2="90" y2="100">
                <stop stopColor="#99F6E4" />
                <stop offset="1" stopColor="#A78BFA" />
              </linearGradient>
              <filter id={`${uid}-shadow`}>
                <feDropShadow dx="0" dy="10" stdDeviation="7" floodColor="#0D9488" floodOpacity="0.38" />
              </filter>
            </defs>
            <g filter={`url(#${uid}-shadow)`}>
              {/* static base — does not tilt with mouse */}
              <rect x="33" y="36" width="62" height="52" rx="18" fill="#0F766E" fillOpacity="0.45" />
              <rect x="24" y="68" width="12" height="22" rx="5" fill="#14B8A6" fillOpacity="0.5" />
              <rect x="84" y="68" width="12" height="22" rx="5" fill="#14B8A6" fillOpacity="0.5" />
              <path
                d="M42 82 L78 82 L71 98 L49 98 Z"
                fill="#14B8A6"
                fillOpacity="0.65"
                stroke={`url(#${uid}-human-stroke)`}
                strokeWidth="1.3"
                strokeLinejoin="round"
              />
              <rect x="48" y="87" width="24" height="2.5" rx="1.25" fill="#CCFBF1" fillOpacity="0.45" />

              {/* head + face — subtle shift only */}
              <g transform={faceTransform}>
                <line x1="60" y1="16" x2="60" y2="28" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
                <circle cx="60" cy="13" r="3.5" fill="#A78BFA" fillOpacity="0.85" />

                <rect
                  x="28"
                  y="30"
                  width="64"
                  height="54"
                  rx="20"
                  fill={`url(#${uid}-human-head)`}
                  stroke={`url(#${uid}-human-stroke)`}
                  strokeWidth="1.8"
                />
                <ellipse cx="60" cy="42" rx="22" ry="8" fill="white" fillOpacity="0.18" />

                <circle cx="41" cy="58" r="5" fill="#F472B6" fillOpacity="0.14" />
                <circle cx="79" cy="58" r="5" fill="#F472B6" fillOpacity="0.14" />

                <Eye cx={47} cy={52} friendly />
                <Eye cx={73} cy={52} friendly />

                <path
                  d="M50 66 Q60 72 70 66"
                  stroke="#115E59"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.55"
                />
              </g>
            </g>
          </svg>
        );

      case "bot-vis":
        return (
          <svg width={dim} height={dim} viewBox="0 0 120 120" fill="none" className="hero-mark-crystal">
            <defs>
              <linearGradient id={`${uid}-bot-body`} x1="30" y1="36" x2="90" y2="100">
                <stop stopColor="#5EEAD4" />
                <stop offset="0.55" stopColor="#14B8A6" />
                <stop offset="1" stopColor="#0F766E" />
              </linearGradient>
              <linearGradient id={`${uid}-bot-visor`} x1="38" y1="58" x2="82" y2="68">
                <stop stopColor="#C4B5FD" />
                <stop offset="1" stopColor="#2DD4BF" />
              </linearGradient>
              <filter id={`${uid}-shadow`}>
                <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#0D9488" floodOpacity="0.35" />
              </filter>
            </defs>
            <g filter={`url(#${uid}-shadow)`}>
              <line x1="60" y1="22" x2="60" y2="34" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" />
              <rect x="57" y="16" width="6" height="6" rx="1.5" fill="#8B5CF6" fillOpacity="0.85" />
              <rect x="28" y="68" width="10" height="22" rx="3" fill="#0D9488" fillOpacity="0.55" />
              <rect x="82" y="68" width="10" height="22" rx="3" fill="#0D9488" fillOpacity="0.55" />
              <rect x="34" y="38" width="52" height="44" rx="10" fill={`url(#${uid}-bot-body)`} />
              <rect x="34" y="38" width="52" height="44" rx="10" stroke="white" strokeOpacity="0.18" />
              <rect x="40" y="56" width="40" height="8" rx="4" fill="#134E4A" fillOpacity="0.55" />
              <rect x="41" y="57" width="38" height="6" rx="3" fill={`url(#${uid}-bot-visor)`} />
              <rect x="44" y="82" width="32" height="14" rx="4" fill="#115E59" fillOpacity="0.65" />
              <rect x="48" y="86" width="24" height="3" rx="1.5" fill="#2DD4BF" fillOpacity="0.45" />
            </g>
          </svg>
        );

      case "bot-iso":
        return (
          <svg width={dim} height={dim} viewBox="0 0 120 120" fill="none" className="hero-mark-crystal">
            <defs>
              <linearGradient id={`${uid}-iso-top`} x1="35" y1="30" x2="85" y2="58">
                <stop stopColor="#5EEAD4" />
                <stop offset="1" stopColor="#2DD4BF" />
              </linearGradient>
              <linearGradient id={`${uid}-iso-left`} x1="20" y1="58" x2="60" y2="102">
                <stop stopColor="#0D9488" />
                <stop offset="1" stopColor="#134E4A" />
              </linearGradient>
              <linearGradient id={`${uid}-iso-right`} x1="60" y1="58" x2="100" y2="102">
                <stop stopColor="#14B8A6" />
                <stop offset="1" stopColor="#0F766E" />
              </linearGradient>
              <filter id={`${uid}-shadow`}>
                <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#0D9488" floodOpacity="0.35" />
              </filter>
            </defs>
            <g filter={`url(#${uid}-shadow)`}>
              <line x1="60" y1="18" x2="60" y2="28" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
              <circle cx="60" cy="15" r="3" fill="#8B5CF6" fillOpacity="0.8" />
              <path d="M38 48 L60 34 L82 48 L60 62 Z" fill={`url(#${uid}-iso-top)`} />
              <path d="M38 48 L60 62 L60 96 L38 82 Z" fill={`url(#${uid}-iso-left)`} />
              <path d="M82 48 L60 62 L60 96 L82 82 Z" fill={`url(#${uid}-iso-right)`} />
              <path d="M38 48 L60 34 L82 48 L60 62 Z" stroke="white" strokeOpacity="0.2" fill="none" />
              <rect x="44" y="50" width="32" height="5" rx="2.5" fill="#134E4A" fillOpacity="0.7" />
              <rect x="45" y="51" width="30" height="3" rx="1.5" fill="#A78BFA" fillOpacity="0.85" />
            </g>
          </svg>
        );

      case "bot-frame":
        return (
          <svg width={dim} height={dim} viewBox="0 0 120 120" fill="none" className="hero-mark-crystal">
            <defs>
              <linearGradient id={`${uid}-frame-stroke`} x1="30" y1="20" x2="90" y2="100">
                <stop stopColor="#2DD4BF" />
                <stop offset="1" stopColor="#8B5CF6" />
              </linearGradient>
              <filter id={`${uid}-shadow`}>
                <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#0D9488" floodOpacity="0.25" />
              </filter>
            </defs>
            <g filter={`url(#${uid}-shadow)`} stroke={`url(#${uid}-frame-stroke)`} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="60" y1="20" x2="60" y2="32" />
              <circle cx="60" cy="16" r="3" fill="#8B5CF6" stroke="none" />
              <rect x="36" y="34" width="48" height="40" rx="8" fill="#0D9488" fillOpacity="0.08" />
              <rect x="36" y="34" width="48" height="40" rx="8" />
              <line x1="42" y1="54" x2="78" y2="54" strokeWidth="3" />
              <line x1="30" y1="68" x2="36" y2="58" />
              <line x1="90" y1="68" x2="84" y2="58" />
              <line x1="30" y1="68" x2="30" y2="84" />
              <line x1="90" y1="68" x2="90" y2="84" />
              <path d="M46 78 L74 78 L68 92 L52 92 Z" fill="#0D9488" fillOpacity="0.1" stroke="inherit" />
            </g>
          </svg>
        );

      case "orb":
        return (
          <svg width={dim} height={dim} viewBox="0 0 120 120" fill="none" className="hero-mark-crystal">
            <defs>
              <radialGradient id={`${uid}-orb`} cx="38%" cy="32%" r="65%">
                <stop stopColor="#99F6E4" />
                <stop offset="0.55" stopColor="#2DD4BF" />
                <stop offset="1" stopColor="#0F766E" />
              </radialGradient>
              <radialGradient id={`${uid}-orb-shine`} cx="30%" cy="25%" r="30%">
                <stop stopColor="#FFFFFF" stopOpacity="0.85" />
                <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
              </radialGradient>
              <filter id={`${uid}-shadow`}>
                <feDropShadow dx="0" dy="8" stdDeviation="7" floodColor="#0D9488" floodOpacity="0.4" />
              </filter>
            </defs>
            <g filter={`url(#${uid}-shadow)`}>
              <circle cx="60" cy="62" r="38" fill={`url(#${uid}-orb)`} />
              <circle cx="60" cy="62" r="38" fill={`url(#${uid}-orb-shine)`} />
              <circle cx="78" cy="78" r="6" fill="#8B5CF6" fillOpacity="0.45" />
            </g>
          </svg>
        );

      case "hex":
        return (
          <svg width={dim} height={dim} viewBox="0 0 120 120" fill="none" className="hero-mark-crystal">
            <defs>
              <linearGradient id={`${uid}-hex-top`} x1="30" y1="28" x2="90" y2="58">
                <stop stopColor="#5EEAD4" />
                <stop offset="1" stopColor="#14B8A6" />
              </linearGradient>
              <linearGradient id={`${uid}-hex-side`} x1="20" y1="58" x2="100" y2="100">
                <stop stopColor="#0D9488" />
                <stop offset="1" stopColor="#134E4A" />
              </linearGradient>
              <filter id={`${uid}-shadow`}>
                <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#0D9488" floodOpacity="0.35" />
              </filter>
            </defs>
            <g filter={`url(#${uid}-shadow)`}>
              <path d="M60 22 L96 42 L96 78 L60 98 L24 78 L24 42 Z" fill={`url(#${uid}-hex-side)`} />
              <path d="M60 22 L96 42 L60 62 L24 42 Z" fill={`url(#${uid}-hex-top)`} />
              <path d="M60 22 L96 42 L60 62 L24 42 Z" stroke="white" strokeOpacity="0.2" fill="none" />
              <circle cx="60" cy="48" r="5" fill="#A78BFA" fillOpacity="0.7" />
            </g>
          </svg>
        );

      case "cube":
        return (
          <svg width={dim} height={dim} viewBox="0 0 120 120" fill="none" className="hero-mark-crystal">
            <defs>
              <linearGradient id={`${uid}-cube-top`} x1="35" y1="30" x2="85" y2="55">
                <stop stopColor="#5EEAD4" />
                <stop offset="1" stopColor="#2DD4BF" />
              </linearGradient>
              <linearGradient id={`${uid}-cube-left`} x1="15" y1="55" x2="60" y2="105">
                <stop stopColor="#0D9488" />
                <stop offset="1" stopColor="#115E59" />
              </linearGradient>
              <linearGradient id={`${uid}-cube-right`} x1="60" y1="55" x2="105" y2="105">
                <stop stopColor="#14B8A6" />
                <stop offset="1" stopColor="#0F766E" />
              </linearGradient>
              <filter id={`${uid}-shadow`}>
                <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#0D9488" floodOpacity="0.35" />
              </filter>
            </defs>
            <g filter={`url(#${uid}-shadow)`}>
              <path d="M34 48 L60 32 L86 48 L60 64 Z" fill={`url(#${uid}-cube-top)`} />
              <path d="M34 48 L60 64 L60 96 L34 80 Z" fill={`url(#${uid}-cube-left)`} />
              <path d="M86 48 L60 64 L60 96 L86 80 Z" fill={`url(#${uid}-cube-right)`} />
              <path d="M34 48 L60 32 L86 48 L60 64 Z" stroke="white" strokeOpacity="0.22" fill="none" />
            </g>
          </svg>
        );

      case "ring":
        return (
          <svg width={dim} height={dim} viewBox="0 0 120 120" fill="none" className="hero-mark-crystal">
            <defs>
              <linearGradient id={`${uid}-ring`} x1="20" y1="20" x2="100" y2="100">
                <stop stopColor="#2DD4BF" />
                <stop offset="0.5" stopColor="#8B5CF6" />
                <stop offset="1" stopColor="#0D9488" />
              </linearGradient>
              <filter id={`${uid}-shadow`}>
                <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#8B5CF6" floodOpacity="0.3" />
              </filter>
            </defs>
            <g filter={`url(#${uid}-shadow)`}>
              <ellipse cx="60" cy="62" rx="42" ry="14" stroke={`url(#${uid}-ring)`} strokeWidth="10" fill="none" />
              <circle cx="60" cy="62" r="10" fill="#2DD4BF" fillOpacity="0.85" />
              <circle cx="63" cy="59" r="3" fill="white" fillOpacity="0.6" />
            </g>
          </svg>
        );

      case "crystal":
      default:
        return (
          <svg width={dim} height={dim} viewBox="0 0 120 120" fill="none" className="hero-mark-crystal">
            <defs>
              <linearGradient id={`${uid}-top`} x1="30" y1="20" x2="90" y2="55">
                <stop stopColor="#5EEAD4" />
                <stop offset="1" stopColor="#2DD4BF" />
              </linearGradient>
              <linearGradient id={`${uid}-left`} x1="10" y1="50" x2="60" y2="110">
                <stop stopColor="#0D9488" />
                <stop offset="1" stopColor="#134E4A" />
              </linearGradient>
              <linearGradient id={`${uid}-right`} x1="60" y1="50" x2="110" y2="110">
                <stop stopColor="#14B8A6" />
                <stop offset="1" stopColor="#0F766E" />
              </linearGradient>
              <linearGradient id={`${uid}-core`} x1="45" y1="42" x2="75" y2="72">
                <stop stopColor="#C4B5FD" stopOpacity="0.9" />
                <stop offset="1" stopColor="#8B5CF6" stopOpacity="0.55" />
              </linearGradient>
              <filter id={`${uid}-shadow`}>
                <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#0D9488" floodOpacity="0.35" />
              </filter>
            </defs>
            <g filter={`url(#${uid}-shadow)`}>
              <path d="M60 18 L98 52 L60 68 L22 52 Z" fill={`url(#${uid}-top)`} />
              <path d="M22 52 L60 68 L60 108 L22 74 Z" fill={`url(#${uid}-left)`} />
              <path d="M98 52 L60 68 L60 108 L98 74 Z" fill={`url(#${uid}-right)`} />
              <path d="M60 38 L72 52 L60 62 L48 52 Z" fill={`url(#${uid}-core)`} />
              <path
                d="M60 18 L98 52 L60 68 L22 52 Z"
                stroke="white"
                strokeOpacity="0.25"
                strokeWidth="0.75"
                fill="none"
              />
            </g>
          </svg>
        );
    }
  }

  const showOrbit = variant !== "ring";

  /* CSS 3D layered bot — different depth style from flat SVG */
  if (variant === "bot-layers") {
    const faceSize = size * 0.72;
    const pupilX = Math.max(-3, Math.min(3, gaze.x));
    const pupilY = Math.max(-3, Math.min(3, gaze.y));
    const faceShift = {
      transform: `translateZ(12px) translate(${face.x * 0.35}px, ${face.y * 0.35}px) rotate(${face.r * 0.6}deg)`,
      transition: interactive ? "transform 0.18s ease-out" : undefined,
    };
    return (
      <div
        ref={ref}
        className="hero-mark-scene animate-float-slow"
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        <div className="hero-mark-body">
          <div className="hero-mark-glow" />
          <div className="hero-mark-orbit" />
          <div className="bot-layer-stack" style={{ width: faceSize, height: faceSize * 1.08 }}>
            <div className="bot-layer bot-layer-back" />
            <div className="bot-layer bot-layer-mid" />
            <div className="bot-layer bot-layer-face" style={faceShift}>
              <div className="bot-layer-shine" />
              <div className="bot-layer-antenna">
                <span className="bot-layer-antenna-tip" />
              </div>
              <div className="bot-layer-eyes">
                <span className="bot-layer-eye">
                  <span
                    className="bot-layer-pupil"
                    style={{ transform: `translate(${pupilX}px, ${pupilY}px)` }}
                  />
                </span>
                <span className="bot-layer-eye">
                  <span
                    className="bot-layer-pupil"
                    style={{ transform: `translate(${pupilX}px, ${pupilY}px)` }}
                  />
                </span>
              </div>
              <div className="bot-layer-smile" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="hero-mark-scene animate-float-slow"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <div className="hero-mark-body">
        <div className={`hero-mark-glow ${subtle ? "hero-mark-glow-subtle" : ""}`} />
        {showOrbit && <div className={`hero-mark-orbit ${subtle ? "hero-mark-orbit-subtle" : ""}`} />}
        <Shape />
      </div>
    </div>
  );
}

/** Labels for picking a variant in constants.js */
export const HERO_MARK_VARIANTS = [
  { id: "bot-pro", label: "Bot · Pro", hint: "Friendly smile, professional — recommended" },
  { id: "bot-human", label: "Bot · Human", hint: "Original playful face" },
  { id: "bot-sentinel", label: "Bot · Sentinel", hint: "Sleek visor — minimal face" },
  { id: "bot-layers", label: "Bot · 3D Layers", hint: "CSS extruded planes — playful 3D" },
  { id: "crystal", label: "Crystal", hint: "Sharp gem" },
  { id: "orb", label: "Orb", hint: "Glass sphere" },
  { id: "hex", label: "Hex", hint: "Hex prism" },
  { id: "cube", label: "Cube", hint: "Isometric block" },
  { id: "ring", label: "Ring", hint: "Orbital ring" },
];
