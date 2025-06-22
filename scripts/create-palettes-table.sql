-- Create the palettes table for storing user-saved color palettes
CREATE TABLE IF NOT EXISTS palettes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  dominant_color TEXT NOT NULL,
  colors JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE palettes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only access their own palettes
CREATE POLICY "Users can only access their own palettes" ON palettes
  FOR ALL USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS palettes_user_id_idx ON palettes(user_id);
CREATE INDEX IF NOT EXISTS palettes_created_at_idx ON palettes(created_at DESC);
