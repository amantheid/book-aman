-- Run this in your Supabase SQL Editor to set up the database

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  book_price INTEGER NOT NULL DEFAULT 299,
  courier_fee INTEGER NOT NULL,
  total INTEGER NOT NULL,
  screenshot_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Storage bucket for screenshots
INSERT INTO storage.buckets (id, name, public)
VALUES ('screenshots', 'screenshots', true)
ON CONFLICT DO NOTHING;

-- Allow public uploads to screenshots bucket
CREATE POLICY "Allow public uploads" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'screenshots');

-- Allow public read of screenshots
CREATE POLICY "Allow public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'screenshots');

-- Enable Realtime for the orders table
ALTER PUBLICATION supabase_realtime ADD TABLE orders;

