# 🤖 Aseel's Chatbot — Next.js Edition

> A friendly, animated AI chatbot built with **Next.js + React**, powered by **Groq** (Llama 3.3 / 3.1 / Llama 4 Scout), with streaming replies, dark mode, and a cursor-tracking robot.

### 🔗 Live Demo

**👉 [my-fullstack-chatbot.vercel.app](https://my-fullstack-chatbot.vercel.app)**

Deployed on **Vercel** — every push to `master` redeploys automatically.

---

## ✨ Features

- 🤖 **Animated robot** — floats, blinks, and follows your cursor with its eyes
- ⚡ **Streaming replies** — tokens appear live as the model writes (via Groq)
- 💬 **Multiple chats** — start new conversations, switch between recent ones
- 🌙 **Light / dark mode** — sun/moon toggle, top-right, remembered across visits
- ⚙️ **Settings** — pick the model, adjust temperature, edit the system prompt
- 🗂️ **Manage chats** — archive or delete conversations, just like the real thing
- 📝 **Markdown replies** — answers render with headings, bold, lists, and more
- 📱 **Responsive** — works on phone and desktop with a slide-in sidebar
- 💾 **Persistence** — saves to your browser by default, or MongoDB if you enable it

---

## 🛠️ Tech Stack

| Tool | Role |
|------|------|
| ⚛️ Next.js 16 (App Router) | Framework + API routes |
| 🎨 Tailwind CSS v4 | Styling + theming |
| ⚡ Groq SDK | LLM inference (streaming) |
| 🎯 lucide-react | Icons |
| 🍃 MongoDB (optional) | Saved conversations |

---

## 🚀 Run Locally

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Add your Groq API key

Create a file named `.env.local` (copy from `.env.local.example`):

```env
GROQ_API_KEY=your_groq_api_key
```

Get a free key at [console.groq.com](https://console.groq.com) 🔑

### 3. Start the dev server

```bash
npm run dev
```

Open **http://localhost:3000** 🎉

---

## 🍃 Optional: MongoDB persistence

By default, chats are saved in your browser (localStorage) — no setup needed.

To save chats in MongoDB instead (e.g. for deployment), add to `.env.local`:

```env
NEXT_PUBLIC_USE_MONGO=true
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=aseel_chatbot
```

You can get a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas). The app
talks to MongoDB through the `/api/conversations` route — your connection string
never reaches the browser.

---

## ☁️ Deploy

This project is **already live on Vercel** 👉 [my-fullstack-chatbot.vercel.app](https://my-fullstack-chatbot.vercel.app)

### Vercel (easiest)
1. Push this repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new).
3. Add `GROQ_API_KEY` (and the MongoDB vars if used) under **Environment Variables**.
4. Deploy. ✅ — pushes to `master` then auto-redeploy.

### Render
1. Create a new **Web Service** from your repo.
2. Build command: `npm install && npm run build`
3. Start command: `npm run start`
4. Add the same environment variables.

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.js              # Root layout + theme init
│   │   ├── page.js                # Main chat page (state + streaming)
│   │   ├── globals.css            # Theme tokens + animations
│   │   └── api/
│   │       ├── chat/route.js          # Streaming Groq endpoint
│   │       └── conversations/route.js # MongoDB CRUD (optional)
│   ├── components/
│   │   ├── Robot.jsx              # Animated cursor-tracking robot
│   │   ├── Sidebar.jsx            # Chats + settings
│   │   ├── Welcome.jsx            # Empty-state + starter cards
│   │   ├── ChatMessage.jsx        # Message bubble
│   │   └── ThemeToggle.jsx        # Sun/moon button
│   └── lib/
│       ├── constants.js           # Models, starters, system prompt
│       ├── storage.js             # localStorage / MongoDB switch
│       └── mongodb.js             # MongoDB client helper
└── .env.local                     # Your secrets (not committed)
```


