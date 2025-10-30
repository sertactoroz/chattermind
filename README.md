# 🧠 ChatterMind

**Mobile-first AI chat application** built with **Next.js**, **Supabase**, **Framer Motion**, and **Groq**.  
This project follows a **feature-based architecture** and demonstrates responsive UI, real-time chat capabilities, smooth animations, and multilingual support.

---

## ✨ Features
- 📱 **Mobile-first** responsive design  
- 🔐 **Google Sign-In** via Supabase Auth  
- ⚡ **Realtime chat synchronization** using Supabase Realtime  
- 🧩 **Predefined characters** (system prompts)  
- 🤖 **Groq LLM integration** via server-side proxy  
- 🌍 **Internationalization (i18n)** with `next-intl` and a language switcher  
- 🎞️ **Fluid animations** powered by Framer Motion  
- 🎨 **Modern UI** built with `shadcn/ui` and Radix primitives  

---

## 🧰 Tech Stack
| Category       | Technologies                        |
|----------------|------------------------------------|
| **Framework**  | Next.js (App Router)                |
| **Language**   | TypeScript                          |
| **Styling**    | Tailwind CSS                        |
| **Backend**    | Supabase (Auth, Database, Realtime)|
| **AI / LLM**   | Groq API                            |
| **UI Library** | shadcn / Radix UI                   |
| **Animations** | Framer Motion                       |
| **i18n**       | next-intl                           |

---

## 🚀 Quickstart (Local Setup)

### 1️⃣ Clone the repository
```bash
git clone https://github.com/sertactoroz/chattermind.git
cd chattermind
```

### 2️⃣ Configure environment variables
Create a `.env.local` file based on `.env.example` and fill in your values:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GROQ_API_KEY=
NEXT_PUBLIC_GROQ_BASE=
NEXT_PUBLIC_VERCEL_URL=
```

### 3️⃣ Install dependencies
```bash
npm install
```

### 4️⃣ Run the development server
```bash
npm run dev
```

### 5️⃣ (Optional) Initialize Supabase schema
```bash
psql < scripts/setup-supabase.sql
```

---

## 🌿 Git Workflow
We use a simple but effective branching strategy:  
- `main` → stable production-ready code  
- `dev` → active development branch for new features  

### Recommended Feature Branch Workflow
```bash
git checkout dev
git pull origin dev
git checkout -b feat/your-feature
# implement feature
git add .
git commit -m "feat(feature-name): short description"
git push -u origin feat/your-feature
# Open PR -> dev
```

---

## 🧭 Folder Structure (src/)
```
src/
├── app/                # Next.js App Router pages
├── components/         # Shared UI components (shadcn)
├── config/             # Config files
├── features/           # Feature-based modules (auth, chat, etc.)
├── i18n/               # Localization setup
├── lib/                # Supabase clients, utilities
├── scripts/            # Database setup scripts
└── styles/             # Global CSS styles
```

---

## 🤝 Contributing
Pull requests are welcome!  
If you plan major changes, please open an issue first to discuss your idea.

---

## ⚡ License
MIT