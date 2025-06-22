-- =====================================================
-- USER REGISTRATION FUNCTION
-- =====================================================

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert user profile
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  
  -- Create default folder
  INSERT INTO public.folders (user_id, name, description, is_default)
  VALUES (NEW.id, 'My Palettes', 'Default folder for your color palettes', true);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to automatically create profile and default folder for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
