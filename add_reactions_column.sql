-- Run this in Supabase SQL Editor to add reactions column to all message tables
-- reactions stores JSON like: {"👍": 5, "❤": 3, "🤣": 1, "🤯": 0}

ALTER TABLE messages ADD COLUMN IF NOT EXISTS reactions jsonb DEFAULT '{}';
ALTER TABLE en_messages ADD COLUMN IF NOT EXISTS reactions jsonb DEFAULT '{}';
ALTER TABLE zh_tw_messages ADD COLUMN IF NOT EXISTS reactions jsonb DEFAULT '{}';
ALTER TABLE ko_messages ADD COLUMN IF NOT EXISTS reactions jsonb DEFAULT '{}';
ALTER TABLE pt_br_messages ADD COLUMN IF NOT EXISTS reactions jsonb DEFAULT '{}';
ALTER TABLE de_messages ADD COLUMN IF NOT EXISTS reactions jsonb DEFAULT '{}';
ALTER TABLE fr_messages ADD COLUMN IF NOT EXISTS reactions jsonb DEFAULT '{}';
ALTER TABLE es_messages ADD COLUMN IF NOT EXISTS reactions jsonb DEFAULT '{}';
ALTER TABLE it_messages ADD COLUMN IF NOT EXISTS reactions jsonb DEFAULT '{}';
ALTER TABLE th_messages ADD COLUMN IF NOT EXISTS reactions jsonb DEFAULT '{}';
