-- Function to fetch public palettes with creator information
CREATE OR REPLACE FUNCTION get_public_palettes_with_creators()
RETURNS TABLE (
  id UUID,
  name TEXT,
  type TEXT,
  colors JSONB,
  dominant_color TEXT,
  created_at TIMESTAMPTZ,
  user_id UUID,
  user_name TEXT,
  user_avatar_url TEXT
)
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.name,
    p.type,
    p.colors,
    p.dominant_color,
    p.created_at,
    p.user_id,
    up.full_name AS user_name,
    up.avatar_url AS user_avatar_url
  FROM
    public.palettes p
  LEFT JOIN
    public.user_profiles up ON p.user_id = up.id
  WHERE
    p.is_public = true
  ORDER BY
    p.created_at DESC
  LIMIT 50;
END;
$$ LANGUAGE plpgsql;