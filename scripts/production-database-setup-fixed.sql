-- =====================================================
-- PRODUCTION DATABASE SETUP FOR PALETTEGENIUS (FIXED)
-- =====================================================

-- =====================================================
-- 1. USERS PROFILE TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  website TEXT,
  bio TEXT,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.user_profiles;

-- Create policies for user_profiles
CREATE POLICY "Users can view their own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Public profiles are viewable by everyone" ON public.user_profiles
  FOR SELECT USING (true);

-- =====================================================
-- 2. FOLDERS TABLE (Enhanced)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.folders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL CHECK (length(name) > 0 AND length(name) <= 100),
  description TEXT,
  color TEXT DEFAULT '#6366f1',
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first
DROP POLICY IF EXISTS "Users can manage their own folders" ON public.folders;

-- Create policies for folders
CREATE POLICY "Users can manage their own folders" ON public.folders
  FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- 3. PALETTES TABLE (Enhanced)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.palettes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  folder_id UUID REFERENCES public.folders(id) ON DELETE SET NULL,
  name TEXT NOT NULL CHECK (length(name) > 0 AND length(name) <= 100),
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('monochromatic', 'analogous', 'complementary', 'triadic', 'tetradic', 'split-complementary', 'custom')),
  dominant_color TEXT NOT NULL,
  colors JSONB NOT NULL CHECK (jsonb_array_length(colors) >= 2 AND jsonb_array_length(colors) <= 10),
  tags TEXT[] DEFAULT '{}',
  is_favorite BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  source_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.palettes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first
DROP POLICY IF EXISTS "Users can manage their own palettes" ON public.palettes;
DROP POLICY IF EXISTS "Anyone can view public palettes" ON public.palettes;

-- Create policies for palettes
CREATE POLICY "Users can manage their own palettes" ON public.palettes
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public palettes" ON public.palettes
  FOR SELECT USING (is_public = true);

-- =====================================================
-- 4. PALETTE FAVORITES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.palette_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  palette_id UUID REFERENCES public.palettes(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, palette_id)
);

-- Enable RLS
ALTER TABLE public.palette_favorites ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first
DROP POLICY IF EXISTS "Users can manage their own favorites" ON public.palette_favorites;

-- Create policies for palette_favorites
CREATE POLICY "Users can manage their own favorites" ON public.palette_favorites
  FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- 5. PALETTE LIKES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.palette_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  palette_id UUID REFERENCES public.palettes(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, palette_id)
);

-- Enable RLS
ALTER TABLE public.palette_likes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first
DROP POLICY IF EXISTS "Users can manage their own likes" ON public.palette_likes;
DROP POLICY IF EXISTS "Anyone can view likes for public palettes" ON public.palette_likes;

-- Create policies for palette_likes
CREATE POLICY "Users can manage their own likes" ON public.palette_likes
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view likes for public palettes" ON public.palette_likes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.palettes 
      WHERE palettes.id = palette_likes.palette_id 
      AND palettes.is_public = true
    )
  );

-- =====================================================
-- 6. COLLECTIONS TABLE (For organizing public palettes)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.collections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL CHECK (length(name) > 0 AND length(name) <= 100),
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first
DROP POLICY IF EXISTS "Users can manage their own collections" ON public.collections;
DROP POLICY IF EXISTS "Anyone can view public collections" ON public.collections;

-- Create policies for collections
CREATE POLICY "Users can manage their own collections" ON public.collections
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public collections" ON public.collections
  FOR SELECT USING (is_public = true);

-- =====================================================
-- 7. COLLECTION PALETTES (Many-to-many relationship)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.collection_palettes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  collection_id UUID REFERENCES public.collections(id) ON DELETE CASCADE NOT NULL,
  palette_id UUID REFERENCES public.palettes(id) ON DELETE CASCADE NOT NULL,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(collection_id, palette_id)
);

-- Enable RLS
ALTER TABLE public.collection_palettes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first
DROP POLICY IF EXISTS "Users can manage palettes in their collections" ON public.collection_palettes;

-- Create policies for collection_palettes
CREATE POLICY "Users can manage palettes in their collections" ON public.collection_palettes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.collections 
      WHERE collections.id = collection_palettes.collection_id 
      AND collections.user_id = auth.uid()
    )
  );

-- =====================================================
-- 8. USER ACTIVITY LOG
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_activity (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('palette_created', 'palette_published', 'palette_liked', 'palette_saved', 'folder_created')),
  resource_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view their own activity" ON public.user_activity;
DROP POLICY IF EXISTS "System can insert activity" ON public.user_activity;

-- Create policies for user_activity
CREATE POLICY "Users can view their own activity" ON public.user_activity
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert activity" ON public.user_activity
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- 9. INDEXES FOR PERFORMANCE
-- =====================================================

-- User profiles indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);

-- Folders indexes
CREATE INDEX IF NOT EXISTS idx_folders_user_id ON public.folders(user_id);
CREATE INDEX IF NOT EXISTS idx_folders_created_at ON public.folders(created_at DESC);

-- Palettes indexes
CREATE INDEX IF NOT EXISTS idx_palettes_user_id ON public.palettes(user_id);
CREATE INDEX IF NOT EXISTS idx_palettes_folder_id ON public.palettes(folder_id);
CREATE INDEX IF NOT EXISTS idx_palettes_is_public ON public.palettes(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_palettes_created_at ON public.palettes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_palettes_type ON public.palettes(type);
CREATE INDEX IF NOT EXISTS idx_palettes_tags ON public.palettes USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_palettes_view_count ON public.palettes(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_palettes_like_count ON public.palettes(like_count DESC);

-- Favorites indexes
CREATE INDEX IF NOT EXISTS idx_palette_favorites_user_id ON public.palette_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_palette_favorites_palette_id ON public.palette_favorites(palette_id);

-- Likes indexes
CREATE INDEX IF NOT EXISTS idx_palette_likes_user_id ON public.palette_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_palette_likes_palette_id ON public.palette_likes(palette_id);

-- Collections indexes
CREATE INDEX IF NOT EXISTS idx_collections_user_id ON public.collections(user_id);
CREATE INDEX IF NOT EXISTS idx_collections_is_public ON public.collections(is_public) WHERE is_public = true;

-- Collection palettes indexes
CREATE INDEX IF NOT EXISTS idx_collection_palettes_collection_id ON public.collection_palettes(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_palettes_palette_id ON public.collection_palettes(palette_id);

-- Activity indexes
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON public.user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON public.user_activity(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_activity_type ON public.user_activity(activity_type);

-- =====================================================
-- 10. FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers first
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
DROP TRIGGER IF EXISTS update_folders_updated_at ON public.folders;
DROP TRIGGER IF EXISTS update_palettes_updated_at ON public.palettes;
DROP TRIGGER IF EXISTS update_collections_updated_at ON public.collections;

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_folders_updated_at BEFORE UPDATE ON public.folders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_palettes_updated_at BEFORE UPDATE ON public.palettes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON public.collections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update palette like count
CREATE OR REPLACE FUNCTION update_palette_like_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.palettes 
        SET like_count = like_count + 1 
        WHERE id = NEW.palette_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.palettes 
        SET like_count = like_count - 1 
        WHERE id = OLD.palette_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Drop existing trigger first
DROP TRIGGER IF EXISTS update_palette_like_count_trigger ON public.palette_likes;

-- Create trigger for like count
CREATE TRIGGER update_palette_like_count_trigger
    AFTER INSERT OR DELETE ON public.palette_likes
    FOR EACH ROW EXECUTE FUNCTION update_palette_like_count();

-- Function to increment view count (callable from client)
CREATE OR REPLACE FUNCTION increment_palette_views(palette_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.palettes 
    SET view_count = view_count + 1 
    WHERE id = palette_id AND is_public = true;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- =====================================================
-- 11. VIEWS FOR ANALYTICS
-- =====================================================

-- Drop existing views first
DROP VIEW IF EXISTS public.popular_palettes;
DROP VIEW IF EXISTS public.recent_public_palettes;
DROP VIEW IF EXISTS public.user_stats;

-- View for popular palettes
CREATE VIEW public.popular_palettes AS
SELECT 
  p.*,
  up.full_name as creator_name,
  up.avatar_url as creator_avatar
FROM public.palettes p
LEFT JOIN public.user_profiles up ON p.user_id = up.id
WHERE p.is_public = true
ORDER BY p.like_count DESC, p.view_count DESC, p.created_at DESC;

-- View for recent public palettes
CREATE VIEW public.recent_public_palettes AS
SELECT 
  p.*,
  up.full_name as creator_name,
  up.avatar_url as creator_avatar
FROM public.palettes p
LEFT JOIN public.user_profiles up ON p.user_id = up.id
WHERE p.is_public = true
ORDER BY p.created_at DESC;

-- View for user statistics
CREATE VIEW public.user_stats AS
SELECT 
  up.id as user_id,
  up.full_name,
  up.avatar_url,
  COUNT(DISTINCT p.id) as total_palettes,
  COUNT(DISTINCT CASE WHEN p.is_public THEN p.id END) as public_palettes,
  COUNT(DISTINCT f.id) as total_folders,
  COALESCE(SUM(p.like_count), 0) as total_likes,
  COALESCE(SUM(p.view_count), 0) as total_views
FROM public.user_profiles up
LEFT JOIN public.palettes p ON up.id = p.user_id
LEFT JOIN public.folders f ON up.id = f.user_id
GROUP BY up.id, up.full_name, up.avatar_url;
