'use client';

import Link from "next/link";
import { mockChats } from "../data/mockChats";

export default function ChatList() {
  return (
    <div className="p-4 min-h-screen bg-white">
      <h1 className="text-xl font-semibold mb-4">Chats</h1>
      <ul className="space-y-3">
        {mockChats.map((c) => (
          <li key={c.id}>
            <Link href={`/chat/${c.id}`} className="block p-3 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{c.title}</div>
                  <div className="text-sm text-slate-500">{c.lastMessage}</div>
                </div>
                <div className="text-xs text-slate-400">
                  {new Date(c.updatedAt!).toLocaleString()}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
