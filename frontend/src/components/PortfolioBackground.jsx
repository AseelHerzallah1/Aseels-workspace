/** Cosmic background matching aseel-portfolio-mauve.vercel.app */
const STARS = [
  { top: "8%", left: "12%", size: 3, opacity: 0.35 },
  { top: "12%", left: "55%", size: 2, opacity: 0.2 },
  { top: "15%", left: "78%", size: 2, opacity: 0.3 },
  { top: "22%", left: "45%", size: 2, opacity: 0.25 },
  { top: "35%", left: "8%", size: 2, opacity: 0.28 },
  { top: "42%", left: "92%", size: 3, opacity: 0.32 },
  { top: "48%", left: "55%", size: 2, opacity: 0.18 },
  { top: "55%", left: "25%", size: 2, opacity: 0.22 },
  { top: "60%", left: "68%", size: 2, opacity: 0.3 },
  { top: "72%", left: "15%", size: 2, opacity: 0.26 },
  { top: "78%", left: "85%", size: 3, opacity: 0.28 },
  { top: "88%", left: "50%", size: 2, opacity: 0.24 },
  // Extra scatter — same palette, keeps the canvas feeling alive
  { top: "5%", left: "34%", size: 2, opacity: 0.16 },
  { top: "18%", left: "91%", size: 2, opacity: 0.22 },
  { top: "28%", left: "18%", size: 3, opacity: 0.2 },
  { top: "38%", left: "62%", size: 2, opacity: 0.17 },
  { top: "52%", left: "88%", size: 2, opacity: 0.19 },
  { top: "65%", left: "42%", size: 2, opacity: 0.21 },
  { top: "74%", left: "58%", size: 2, opacity: 0.15 },
  { top: "82%", left: "28%", size: 3, opacity: 0.23 },
  { top: "92%", left: "72%", size: 2, opacity: 0.18 },
  { top: "10%", left: "66%", size: 2, opacity: 0.14 },
  { top: "46%", left: "32%", size: 2, opacity: 0.16 },
];

export default function PortfolioBackground() {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-linear-to-b from-slate-100 via-slate-50 to-white dark:hidden"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed inset-0 -z-10 hidden overflow-hidden dark:block"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[#050508]" />
        <div className="absolute -left-1/4 top-1/4 h-[500px] w-[800px] rotate-12 rounded-full bg-purple-900/15 blur-[140px]" />
        <div className="absolute -right-1/4 top-1/3 h-[400px] w-[700px] -rotate-12 rounded-full bg-cyan-900/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-[300px] w-[600px] rounded-full bg-indigo-900/12 blur-[120px]" />
        <svg
          className="absolute inset-0 h-full w-full opacity-20"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
        >
          <path
            d="M0,500 C360,400 480,600 720,500 C960,400 1080,650 1440,550 L1440,900 L0,900 Z"
            fill="url(#wave1)"
          />
          <path
            d="M0,600 C300,700 600,500 900,620 C1100,700 1300,580 1440,650 L1440,900 L0,900 Z"
            fill="url(#wave2)"
          />
          <defs>
            <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#312e81" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0e7490" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0c4a6e" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#4c1d95" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>
        {STARS.map((star, i) => (
          <span
            key={i}
            className="floating-dot absolute rounded-full bg-cyan-300/40 shadow-[0_0_6px_rgba(103,232,249,0.35)]"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              ["--dot-opacity"]: star.opacity,
              animationDelay: `${(i * 0.47) % 5}s, ${(i * 0.31) % 4}s`,
            }}
          />
        ))}
      </div>
    </>
  );
}
