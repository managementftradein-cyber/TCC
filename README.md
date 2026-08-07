# Christocentric Church — Clean Deployment Package

This is the cleaned single-project version of the supplied church website package. The duplicate/older `christocentric-church-site` package has been removed. The admin-capable version is the source of truth.

## Project structure

- `public/index.html` — public church website
- `admin/index.html` — protected admin dashboard/login
- `api/admin.js` — authenticated admin API
- `api/_supabase.js` — server-side Supabase connection + admin authorization
- `api/config.js` — exposes only the public Supabase URL/key needed for login
- `api/subscribe.js` — newsletter subscription endpoint
- `api/health.js` — backend health check
- `supabase/schema.sql` — database tables and public RLS policies
- `.env.example` — environment variables required by Vercel
- `vercel.json` — deployment/routing configuration

## Supabase setup

1. Create a Supabase project.
2. In Supabase SQL Editor, run `supabase/schema.sql`.
3. In Supabase Authentication → Users, create the admin user(s).
4. Copy the project URL, service-role key, and public/anon key into Vercel environment variables.
5. Set `ADMIN_EMAILS` to the exact email(s) allowed to use the dashboard, separated by commas.

## Vercel environment variables

Required:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ANON_KEY`
- `ADMIN_EMAILS`

Never put `SUPABASE_SERVICE_ROLE_KEY` into frontend code. Never commit real secrets to GitHub.

## Deploy

1. Upload this folder to a GitHub repository.
2. Import the repository into Vercel.
3. Add the environment variables above.
4. Deploy.
5. Open `/` for the public website.
6. Open `/admin/` for the dashboard.

## Admin login

The admin page signs in against Supabase Auth. The API verifies the Supabase access token and checks that the user's email is present in `ADMIN_EMAILS` before allowing dashboard operations.

If an admin session expires, sign in again.

## Important limitation

The public homepage is primarily the supplied static design. The backend/admin foundation is functional for managing database records, but the homepage's sermons/events/announcements sections are not yet fully data-driven from the dashboard. That integration should be done deliberately rather than mixing another project version into this package.


## Deployment layout
The public homepage is at the project root (`index.html`), the admin dashboard is at `/admin/`, and serverless API functions are under `/api/`. This layout is intentionally kept simple for Vercel so `/api/config` is handled as a serverless function rather than rewritten to an HTML page.
