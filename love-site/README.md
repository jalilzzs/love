# 👑 Love site (Princess view)
1. Supabase → SQL editor → run `schema.sql` (same file is in the admin zip; run it ONCE). Add your admin user in Auth → Users (email + long secret password = admin passcode).
2. Edit `config.js` (URL, anon key, admin email, and the two site URLs).
3. Put her photo at `ibtissam_ref.jpg` in this folder (clear, front-facing). Face unlock needs https (Vercel is fine).
4. Deploy: push to GitHub → Vercel → "Other" framework, no build command. `/admin` redirects to your admin site.
