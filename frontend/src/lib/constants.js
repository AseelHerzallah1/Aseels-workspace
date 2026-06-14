// Base URL of the Python (FastAPI) backend that runs the RAG + LLM.
export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

// Same-origin SSE proxy — streams reliably through Vercel to the browser.
export const CHAT_URL = "/api/rag-chat";

// App branding — edit these to personalize your portfolio.
export const APP_NAME = "Grounded";
export const APP_TAGLINE =
  "Ask about Aseel's work — answers grounded in verified projects, not guesswork";
export const ASSISTANT_NAME = "Aseel Workspace";

// Floating 3D mark — see HERO_MARK_VARIANTS in HeroMark.jsx
export const HERO_MARK_VARIANT = "bot-pro";

// Public profile shown on the welcome screen. Set `image` to e.g. "/profile.jpg"
// after adding a photo to frontend/public/.
export const PROFILE = {
  name: "Aseel Herzallah",
  image: "",
  title: "Junior Software Engineer",
  credentials: "Full-Stack · Generative AI · Systems Developer",
};

// Public bot modes — `value` must match backend mode keys.
export const MODES = [
  { value: "portfolio", label: "About Me", icon: "✦" },
  { value: "recruiter", label: "For Recruiters", icon: "◈" },
  { value: "job_match", label: "Role Fit", icon: "◎" },
];

export const ASSISTANT_MODE = { value: "assistant", label: "Workspace", icon: "◇" };

// Recruiter-facing starters — third person, about Aseel. Home shows first 6; chat rotates 4 from full pool.
export const PORTFOLIO_STARTERS = [
  { icon: "→", text: "What should I know about Aseel in 30 seconds?" },
  { icon: "→", text: "Walk me through Aseel's strongest project" },
  { icon: "→", text: "What kind of roles is Aseel looking for?" },
  { icon: "→", text: "What's Aseel's day-to-day tech stack?" },
  { icon: "→", text: "How does Aseel approach learning something new?" },
  { icon: "→", text: "What makes Aseel's background different?" },
  { icon: "→", text: "What's Aseel's education and how does it connect to her work?" },
  { icon: "→", text: "Tell me about Aseel's internship or work experience" },
];

export const RECRUITER_STARTERS = [
  { icon: "→", text: "Give me the 30-second intro on Aseel" },
  { icon: "→", text: "Would Aseel fit a junior software engineer role?" },
  { icon: "→", text: "What's Aseel's strongest technical evidence?" },
  { icon: "→", text: "Software or AI — where does Aseel fit best?" },
  { icon: "→", text: "What stack does Aseel ship with in production?" },
  { icon: "→", text: "What's unique about Aseel as a candidate?" },
  { icon: "→", text: "How quickly could Aseel ramp up on a new codebase?" },
  { icon: "→", text: "Does Aseel have portfolio or GitHub work worth reviewing?" },
];

/** @deprecated use PORTFOLIO_STARTERS or RECRUITER_STARTERS */
export const STARTERS = RECRUITER_STARTERS;

// Response tones — backend keys in `value`.
export const RESPONSE_STYLES = [
  { value: "study", icon: "📝", label: "Notes", hint: "Structured recap" },
  { value: "technical", icon: "⚡", label: "Technical", hint: "Architecture & depth" },
  { value: "plain", icon: "💬", label: "Plain", hint: "Simple & clear" },
  { value: "pitch", icon: "🎯", label: "Pitch", hint: "Concise & confident" },
  { value: "build", icon: "⌨", label: "Code", hint: "Examples & snippets" },
];

export const ASSISTANT_STARTERS = [
  { icon: "→", text: "Summarize what I uploaded" },
  { icon: "→", text: "Help me prep for an interview" },
  { icon: "→", text: "Draft a short professional email" },
  { icon: "→", text: "Explain this concept simply" },
  { icon: "→", text: "Turn my notes into bullet points" },
  { icon: "→", text: "What should I review before a technical screen?" },
];
