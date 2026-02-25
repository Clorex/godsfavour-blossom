# Godsfavour Blossom (Next.js)

## Setup
1. Install deps:
   - `npm i`
2. Create `.env.local` (see `.env.example`)
3. Run:
   - `npm run dev`

## Deploy
- Recommended: Vercel
- Ensure env vars are set in Vercel project settings.

## Admin
- Admin login: email/password (Firebase Auth)
- Admin device verification: OTP email
- Admin pages:
  - `/admin/content` edit site text
  - `/admin/applications` approve/reject + notes
  - `/admin/messages` bulk email broadcasts
  - `/admin/settings` public contact info
