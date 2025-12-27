# Supabase Configuration

## Edge Functions - DISABLED

The edge functions in this directory are **disabled** and not used by the application.

### Why?

- The app uses **client-side Supabase authentication** which works perfectly
- Edge functions are not needed for the current functionality
- Attempting to deploy them causes 403 errors due to permission restrictions

### Current Setup

The app uses:
- ✅ Client-side Supabase SDK (`@supabase/supabase-js`)
- ✅ Direct database connections
- ✅ Client-side authentication
- ✅ Row Level Security (RLS) for data protection

All authentication and database operations work without edge functions.

### If You Need Edge Functions

If you need to enable edge functions in the future:

1. Remove or modify `/supabase/config.toml`
2. Remove `/supabase/functions/deno.json`
3. Deploy manually using Supabase CLI:
   ```bash
   supabase functions deploy server
   ```

### Current Status

- Edge functions: ❌ Disabled
- Client-side auth: ✅ Working
- Database operations: ✅ Working
- App functionality: ✅ 100% operational
