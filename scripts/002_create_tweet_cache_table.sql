-- Create a table to cache processed tweets to avoid re-processing
CREATE TABLE IF NOT EXISTS public.tweet_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL,
  tweet_id TEXT NOT NULL,
  tweet_text TEXT NOT NULL,
  gnoma_mentions INTEGER NOT NULL DEFAULT 0,
  processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(username, tweet_id)
);

-- Enable Row Level Security
ALTER TABLE public.tweet_cache ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (needed for API operations)
CREATE POLICY "Allow public read access to tweet_cache" 
  ON public.tweet_cache FOR SELECT 
  USING (true);

CREATE POLICY "Allow public insert to tweet_cache" 
  ON public.tweet_cache FOR INSERT 
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tweet_cache_username ON public.tweet_cache(username);
CREATE INDEX IF NOT EXISTS idx_tweet_cache_processed_at ON public.tweet_cache(processed_at DESC);
