# The 21 Days That Built a Creative Constructor — Pre-Order Website

## Tech Stack
- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (database + file storage)

---

## Setup Instructions

### 1. Install dependencies
```bash
npm install
```

### 2. Set up Supabase
1. Go to supabase.com and create a new project
2. Open the SQL Editor and run the contents of `supabase-setup.sql`
3. Go to Project Settings > API and copy:
   - Project URL
   - Anon public key
   - Service role secret key

### 3. Configure environment variables
Open `.env.local` and fill in your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
ADMIN_SECRET=creative-constructor-admin-2024
```

### 4. Run the dev server
```bash
npm run dev
```

Open http://localhost:3000

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with book details |
| `/preorder` | Pre-order form |
| `/success` | Order confirmation page |
| `/admin` | Admin panel (login required) |

## Admin Access
- URL: /admin
- Keyboard shortcut: type 4343 anywhere on the site
- Email: aman@gmail.com
- Password: aman@123

---

## Deploy to Vercel (Recommended)
1. Push to GitHub
2. Connect repo on vercel.com
3. Add environment variables in Vercel dashboard
4. Deploy!
