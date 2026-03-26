-- 1. Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  nickname text not null,
  avatar_url text
);

-- Turn on RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow public read access to profiles
CREATE POLICY "Public profiles are viewable by everyone." ON profiles
  FOR SELECT USING (true);

-- Allow users to update their own profiles
CREATE POLICY "Users can insert their own profile." ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 2. Add author_id to all messages tables
ALTER TABLE messages ADD COLUMN IF NOT EXISTS author_id uuid references auth.users on delete set null;
ALTER TABLE en_messages ADD COLUMN IF NOT EXISTS author_id uuid references auth.users on delete set null;
ALTER TABLE zh_tw_messages ADD COLUMN IF NOT EXISTS author_id uuid references auth.users on delete set null;
ALTER TABLE ko_messages ADD COLUMN IF NOT EXISTS author_id uuid references auth.users on delete set null;
ALTER TABLE pt_br_messages ADD COLUMN IF NOT EXISTS author_id uuid references auth.users on delete set null;
ALTER TABLE de_messages ADD COLUMN IF NOT EXISTS author_id uuid references auth.users on delete set null;
ALTER TABLE fr_messages ADD COLUMN IF NOT EXISTS author_id uuid references auth.users on delete set null;
ALTER TABLE es_messages ADD COLUMN IF NOT EXISTS author_id uuid references auth.users on delete set null;
ALTER TABLE it_messages ADD COLUMN IF NOT EXISTS author_id uuid references auth.users on delete set null;
ALTER TABLE th_messages ADD COLUMN IF NOT EXISTS author_id uuid references auth.users on delete set null;

-- 3. Setup RLS for messages for INSERT and DELETE
-- We drop existing policies if any restrict insert/delete and recreate them nicely.
-- To keep it simple, we use DO blocks to avoid errors if policies don't exist, but Supabase doesn't easily support dropping policies if they don't exist without a block.
-- We will just CREATE policies that handle the new logic. Note: if you have existing INSERT/DELETE policies, they combine with OR logic.

-- Helper function to apply policies to a table
CREATE OR REPLACE FUNCTION apply_messages_rls(table_name text) RETURNS void AS $$
BEGIN
  -- We assume basic RLS is already enabled from earlier steps.
  -- 1. Insert Policy: allow if anonymous (author_id is null) OR authenticated user inserts their own id
  EXECUTE format('
    DROP POLICY IF EXISTS "Allow insert for all" ON %I;
    DROP POLICY IF EXISTS "Allow insert with valid author_id" ON %I;
    CREATE POLICY "Allow insert with valid author_id" ON %I
      FOR INSERT WITH CHECK (author_id IS NULL OR author_id = auth.uid());
  ', table_name, table_name, table_name);

  -- 2. Delete Policy: allow if anonymous post (author_id is null) OR authenticated user deletes their own post
  EXECUTE format('
    DROP POLICY IF EXISTS "Allow delete for all" ON %I;
    DROP POLICY IF EXISTS "Allow delete own messages" ON %I;
    CREATE POLICY "Allow delete own messages" ON %I
      FOR DELETE USING (author_id IS NULL OR author_id = auth.uid());
  ', table_name, table_name, table_name);

  -- 3. Select is open to all
  EXECUTE format('
    DROP POLICY IF EXISTS "Allow select for all" ON %I;
    CREATE POLICY "Allow select for all" ON %I
      FOR SELECT USING (true);
  ', table_name, table_name);
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables
SELECT apply_messages_rls('messages');
SELECT apply_messages_rls('en_messages');
SELECT apply_messages_rls('zh_tw_messages');
SELECT apply_messages_rls('ko_messages');
SELECT apply_messages_rls('pt_br_messages');
SELECT apply_messages_rls('de_messages');
SELECT apply_messages_rls('fr_messages');
SELECT apply_messages_rls('es_messages');
SELECT apply_messages_rls('it_messages');
SELECT apply_messages_rls('th_messages');
