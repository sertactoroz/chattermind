create extension if not exists "pgcrypto";

create table chats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  character_id text,
  title text,
  last_message text,
  created_at timestamptz default now()
);

create index on chats (user_id);
create index on chats (created_at);

create table messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid references chats(id) on delete cascade,
  sender text not null, -- 'user' | 'ai'
  content text,
  metadata jsonb,
  created_at timestamptz default now()
);

create index on messages (chat_id);
create index on messages (created_at);
