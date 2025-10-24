import AuthButton from "@/features/auth/components/AuthButton";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex items-center justify-center p-6">
      <main className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-md p-6 sm:p-8">
        <header className="flex flex-col items-center text-center mb-8 animate-fadeIn">
          {/* Logo container */}
          <div className="w-full flex justify-center mb-3">
            <div className="relative aspect-square w-2/3 max-w-[160px] sm:max-w-[200px]">
              <Image
                src="/chattermind-logo.svg"
                alt="Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Title */}
          {/* <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-800">
            ChatterMind
          </h1> */}

          {/* Subtitle */}
          <p className="mt-2 text-sm sm:text-base text-slate-500 max-w-xs leading-relaxed">
            Modern, mobile-first AI chat — experience real-time and fluid conversations with different characters.
          </p>
        </header>


        <section className="mb-6">
          <ul className="text-sm text-slate-600 space-y-2">
            <li className="flex items-start gap-3">
              <span className=" inline-flex w-6 h-6 rounded-md bg-slate-100 items-center justify-center text-xs">✓</span>
              <span className="leading-5 ">Mobile-first chat UI with touch-friendly controls</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-flex w-6 h-6 rounded-md bg-slate-100 items-center justify-center text-xs">⚡</span>
              <span className="leading-5">Smooth animations & message transitions</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-flex w-6 h-6 rounded-md bg-slate-100 items-center justify-center text-xs">🔁</span>
              <span className="leading-5">Realtime sync backed by Supabase</span>
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <AuthButton />
        </section>

        <section className="mt-4 text-xs text-slate-400">
          <p>By continuing you agree to use your Google account for authentication.</p>
        </section>

        <footer className="mt-6 text-center text-xs text-slate-400">
          <p>Prototype • Mobile-first • Framer Motion • Supabase • Groq</p>
        </footer>
      </main>
    </div>
  );
}
