
-- Check if the user exists in the auth.users table
DO $$
DECLARE
  user_exists BOOLEAN;
  user_id UUID;
BEGIN
  -- Find the user ID from the email
  SELECT id INTO user_id FROM auth.users WHERE email = 'sahilraz9265@gmail.com';
  
  -- Check if a record for the user already exists in user_roles
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = user_id AND role = 'admin'
  ) INTO user_exists;
  
  -- If not an admin already, add them as admin
  IF NOT user_exists AND user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (user_id, 'admin');
  END IF;
END $$;
