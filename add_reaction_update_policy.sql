-- Run this in Supabase SQL Editor to allow anonymous users to update reactions
-- This adds UPDATE policies for the reactions column on all message tables

-- Japanese
CREATE POLICY "Allow update reactions on messages" ON messages
  FOR UPDATE USING (true) WITH CHECK (true);

-- English
CREATE POLICY "Allow update reactions on en_messages" ON en_messages
  FOR UPDATE USING (true) WITH CHECK (true);

-- Chinese (Traditional)
CREATE POLICY "Allow update reactions on zh_tw_messages" ON zh_tw_messages
  FOR UPDATE USING (true) WITH CHECK (true);

-- Korean
CREATE POLICY "Allow update reactions on ko_messages" ON ko_messages
  FOR UPDATE USING (true) WITH CHECK (true);

-- Portuguese (Brazil)
CREATE POLICY "Allow update reactions on pt_br_messages" ON pt_br_messages
  FOR UPDATE USING (true) WITH CHECK (true);

-- German
CREATE POLICY "Allow update reactions on de_messages" ON de_messages
  FOR UPDATE USING (true) WITH CHECK (true);

-- French
CREATE POLICY "Allow update reactions on fr_messages" ON fr_messages
  FOR UPDATE USING (true) WITH CHECK (true);

-- Spanish
CREATE POLICY "Allow update reactions on es_messages" ON es_messages
  FOR UPDATE USING (true) WITH CHECK (true);

-- Italian
CREATE POLICY "Allow update reactions on it_messages" ON it_messages
  FOR UPDATE USING (true) WITH CHECK (true);

-- Thai
CREATE POLICY "Allow update reactions on th_messages" ON th_messages
  FOR UPDATE USING (true) WITH CHECK (true);
