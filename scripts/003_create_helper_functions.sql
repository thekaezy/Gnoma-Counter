-- Create a function to update or insert gnoma counts
CREATE OR REPLACE FUNCTION public.upsert_gnoma_count(
  p_username TEXT,
  p_count INTEGER
) RETURNS public.gnoma_counts AS $$
DECLARE
  result public.gnoma_counts;
BEGIN
  INSERT INTO public.gnoma_counts (username, count, last_updated)
  VALUES (p_username, p_count, NOW())
  ON CONFLICT (username) 
  DO UPDATE SET 
    count = p_count,
    last_updated = NOW()
  RETURNING * INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get leaderboard data
CREATE OR REPLACE FUNCTION public.get_gnoma_leaderboard(
  p_limit INTEGER DEFAULT 50
) RETURNS TABLE (
  username TEXT,
  count INTEGER,
  last_updated TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    gc.username,
    gc.count,
    gc.last_updated
  FROM public.gnoma_counts gc
  WHERE gc.count > 0
  ORDER BY gc.count DESC, gc.last_updated ASC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
