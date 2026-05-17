alter table chats alter column user_id type text using user_id::text;

drop index if exists chats_user_id_idx;
create index chats_user_id_idx on chats (user_id);
