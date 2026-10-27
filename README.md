# Supabase + plain HTML, CSS and JavaScript

## Setup
1. Install Node.js 22.12+ (or a newer supported LTS).
2. Open a terminal in this folder and run `npm install`.
3. Copy `.env.example` to `.env` (or use your existing file). Set:
   ```env
   SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   SUPABASE_PUBLISHABLE_KEY=sb_publishable_YOUR_KEY
   ```
4. Run `schema.sql` in your project's Supabase SQL Editor. This creates a NEW `profiles` table; if you already have that table, adapt a migration instead of executing this script unchanged. Run it before new signups. It also backfills existing Auth users.
5. In Supabase Authentication, enable Email sign-in and allow new signups. Enable Confirm email if you want verification before login.
6. Under Authentication > URL Configuration, for local development set Site URL to `http://localhost:5173` and allow `http://localhost:5173/profile.html` as a redirect URL. Use localhost consistently, not 127.0.0.1. For deployment, set Site URL to your production HTTPS origin and add its exact profile.html redirect URL (including any subfolder).
7. Run `npm run dev`, then open `http://localhost:5173/login.html`.
8. Register, confirm using the email link if required, then log in and edit your profile. If confirmation emails are not delivered, check Auth email/SMTP settings and delivery limits; production delivery generally needs your own SMTP configuration.

## Why Vite?
The app itself is plain HTML/CSS/JS. Browsers do not directly read `.env` or provide `process.env`. Vite loads your existing variable names through `vite.config.js` and exposes ONLY the URL and publishable key. Restart the dev server after editing `.env`. Do not open the HTML through file:// or an ordinary Live Server: use Vite or the built dist output.

These public values are visible in the browser bundle. Never use a secret key, service_role key or database password in frontend code. RLS and database grants enforce data access; hiding a key or hiding the profile page does not.

## Files
- `client.js`: one reusable Supabase client.
- `auth.js`: exported register, login, logout, currentUser, getProfile and updateProfile helpers.
- `login.html`: login and registration on one page.
- `profile.html`: authenticated profile viewing/editing and logout.
- `schema.sql`: profiles, signup trigger, email sync, timestamps and own-row policies.
- `style.css`: shared responsive styling.
- `vite.config.js`, `package.json`, `.env.example`: build/setup.

## Import from another page
Use a module script:
```html
<script type="module">
  import { supabase } from './client.js';
  import { currentUser, getProfile } from './auth.js';
  const user = await currentUser();
  if (user) console.log(await getProfile(user.id));
</script>
```
Use the same `supabase` export for `.from('your_table')` database calls. Every additional table needs its own appropriate RLS policies and grants.

## Data behavior
Mobile and phone number are one `phone_number` text field, preserving + and leading zeroes. This is unverified contact data, not SMS authentication. Names are limited to 100 characters. Passwords are managed solely by Supabase Auth, never saved to profiles. A signup trigger creates the profile even if email confirmation means signUp returns no session. The email is a read-only mirror of the Auth account, synced when its confirmed email changes. Name/phone edits use profiles as their source of truth; signup metadata is not kept in sync and must not be used for authorization. Client password minimum is 8 characters; configure the desired policy in Supabase too.

## Build and deploy
Run `npm run build`, then deploy the contents of `dist/` to any static HTTPS host. Do not deploy the source folder or .env. Vite bundles the public settings at build time: configure them before building and rebuild after changing them. `npm run preview` serves the build locally (usually port 4173); add its exact redirect URL in Supabase if testing confirmation there.

## Verification checklist with your project
- Register a new account with confirmation ON: check inbox and profile row before logging in.
- Click confirmation: profile loads; log out and log back in.
- Update name/phone, reload and verify persistence.
- Wrong password and mismatched registration passwords show errors.
- Signed-out profile visit redirects to login.
- In separate browsers, create users A/B: A must not read or update B's row. Test this with A's authenticated client, not the SQL Editor service role.
- With confirmation OFF, signup should go straight to profile.
- Check an expired/invalid confirmation link shows an error.

No live project credentials were supplied, so live authentication, email delivery, SQL execution and RLS isolation must be verified in your project.

## Official references
https://supabase.com/docs/guides/auth/managing-user-data
https://supabase.com/docs/reference/javascript/auth-signup
https://vite.dev/guide/env-and-mode
