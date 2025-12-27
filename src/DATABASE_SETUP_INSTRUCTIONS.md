# Smart Ledger Database Setup Instructions

## Important: Run Database Setup Before Using the App

Your Smart Ledger app now saves all data to Supabase database permanently. Follow these steps to set up the database:

## Step 1: Access Supabase SQL Editor

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"

## Step 2: Run the Database Setup SQL

1. Open the file `/database-setup.sql` in this project
2. Copy ALL the SQL code from that file
3. Paste it into the Supabase SQL Editor
4. Click "Run" or press `Ctrl+Enter` / `Cmd+Enter`

This will create:
- **transactions** table - stores all money transactions
- **sites** table - stores all construction sites
- **user_preferences** table - stores user settings (name, language, theme)

## Step 3: Verify Setup

After running the SQL, verify the tables were created:
1. Go to "Table Editor" in your Supabase dashboard
2. You should see three new tables:
   - `transactions`
   - `sites`
   - `user_preferences`

## What This Does

### Data Persistence
- All transactions are now saved to the database permanently
- When you delete a transaction, it's permanently removed from the database
- Your data persists across login/logout and device changes

### Security (Row Level Security)
- Each user can only see and modify their own data
- The database automatically filters data based on the logged-in user
- No user can access another user's transactions or sites

### Features
- **Automatic Loading**: Your data loads automatically when you log in
- **Real-time Sync**: All changes (add, edit, delete) are instantly saved to the database
- **Data Safety**: Your data is backed up and secure in Supabase's cloud

## Troubleshooting

### If you see "relation does not exist" errors:
- Make sure you ran the entire SQL script from `database-setup.sql`
- Check that you're in the correct Supabase project

### If you can't save transactions:
- Verify the tables were created in "Table Editor"
- Check your Supabase project is connected (see `utils/supabase/info.ts`)
- Check browser console for specific error messages

### If data doesn't persist after logout:
- Ensure Row Level Security policies were created (they're in the SQL script)
- Try logging out and logging back in

## Database Schema

### Transactions Table
- `id` - Unique identifier (UUID)
- `user_id` - Links to authenticated user
- `name` - Person/company name
- `amount` - Transaction amount
- `type` - 'in' (receive) or 'out' (pay)
- `person_type` - 'worker' or 'supplier'
- `note` - Transaction note
- `additional_notes` - Extra details (optional)
- `date` - Transaction date
- `site` - Associated site name (optional)

### Sites Table
- `id` - Unique identifier (UUID)
- `user_id` - Links to authenticated user
- `name` - Site name
- `budget` - Site budget amount
- `created_date` - When the site was created

### User Preferences Table
- `user_id` - Links to authenticated user (primary key)
- `user_name` - Display name
- `language` - App language preference
- `theme` - Light or dark mode

## Next Steps

After setup, your app will:
1. ✅ Save all transactions permanently
2. ✅ Delete transactions permanently when you delete them
3. ✅ Load your data automatically on login
4. ✅ Keep your data safe and secure
5. ✅ Work across multiple devices with the same account

Enjoy your fully persistent Smart Ledger app! 🎉
