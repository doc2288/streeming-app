import { Pool } from 'pg'
import { env } from './config/env'

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10
})

export async function migrate(): Promise<void> {
  const client = await pool.connect()
  try {
    await client.query(`
      create extension if not exists "pgcrypto";
      create table if not exists users (
        id uuid primary key default gen_random_uuid(),
        email text not null unique,
        password_hash text not null,
        role text not null default 'user',
        created_at timestamptz not null default now()
      );
      create table if not exists refresh_tokens (
        id uuid primary key default gen_random_uuid(),
        user_id uuid not null references users(id) on delete cascade,
        token text not null,
        user_agent text,
        ip text,
        created_at timestamptz not null default now(),
        expires_at timestamptz not null
      );
      create table if not exists streams (
        id uuid primary key default gen_random_uuid(),
        user_id uuid not null references users(id) on delete cascade,
        title text not null,
        status text not null default 'offline',
        ingest_url text,
        stream_key text,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );
      create table if not exists chat_bans (
        id uuid primary key default gen_random_uuid(),
        stream_id uuid not null references streams(id) on delete cascade,
        user_id uuid not null references users(id) on delete cascade,
        reason text,
        created_at timestamptz not null default now()
      );
    `)
  } finally {
    client.release()
  }
}
