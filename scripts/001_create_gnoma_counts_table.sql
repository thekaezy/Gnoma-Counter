-- Create the main table to store gnoma counts for each user
CREATE TABLE IF NOT EXISTS public.gnoma_counts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  count INTEGER NOT NULL DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.gnoma_counts ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (for leaderboard)
CREATE POLICY "Allow public read access to gnoma_counts" 
  ON public.gnoma_counts FOR SELECT 
  USING (true);

-- Create policies for insert/update (anyone can add/update counts)
CREATE POLICY "Allow public insert to gnoma_counts" 
  ON public.gnoma_counts FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public update to gnoma_counts" 
  ON public.gnoma_counts FOR UPDATE 
  USING (true);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_gnoma_counts_username ON public.gnoma_counts(username);
CREATE INDEX IF NOT EXISTS idx_gnoma_counts_count_desc ON public.gnoma_counts(count DESC);
