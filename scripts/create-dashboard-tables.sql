-- Create folders table
CREATE TABLE IF NOT EXISTS folders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update palettes table to include folder relationship and favorites
ALTER TABLE palettes ADD COLUMN IF NOT EXISTS folder_id UUID REFERENCES folders(id) ON DELETE SET NULL;
ALTER TABLE palettes ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT FALSE;

-- Enable Row Level Security
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;

-- Create policies for folders
CREATE POLICY "Users can only access their own folders" ON folders
  FOR ALL USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS folders_user_id_idx ON folders(user_id);
CREATE INDEX IF NOT EXISTS palettes_folder_id_idx ON palettes(folder_id);
CREATE INDEX IF NOT EXISTS palettes_is_favorite_idx ON palettes(is_favorite);
