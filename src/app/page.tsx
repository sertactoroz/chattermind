import Image from 'next/image';
import AuthButton from '@/features/auth/components/AuthButton';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md mx-auto rounded-2xl shadow-md">
        <CardHeader className="p-6 pt-8 text-center">
          <div className="mx-auto w-28 h-28 relative mb-4">
            <Image src="/chattermind-logo.svg" alt="Logo" fill className="object-contain" priority />
          </div>
          {/* <CardTitle className="text-lg">ChatterMind</CardTitle> */}
          <CardDescription className="text-sm text-slate-500 mt-1">
            Modern, mobile-first AI chat — experience real-time, fluid conversations with distinct characters.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          <ul className="text-sm text-slate-600 space-y-3">
            <li className="flex items-start gap-3">
              <span className="inline-flex w-7 h-7 rounded-md bg-slate-100 items-center justify-center text-xs">✓</span>
              <span>Mobile-first chat UI with touch-friendly controls</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-flex w-7 h-7 rounded-md bg-slate-100 items-center justify-center text-xs">⚡</span>
              <span>Smooth animations & message transitions</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-flex w-7 h-7 rounded-md bg-slate-100 items-center justify-center text-xs">🔁</span>
              <span>Realtime sync backed by Supabase</span>
            </li>
          </ul>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 p-6">
          <AuthButton />
          <div className="flex items-center justify-center gap-3 text-xs text-slate-400">
            <span>Prototype • Mobile-first • Framer Motion • Supabase • Groq</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
