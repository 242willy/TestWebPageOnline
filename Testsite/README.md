# Forex University — clickable UI prototype

A responsive, front-end prototype for the Forex University mobile/web experience, using the supplied crowned lion logo and a premium black-and-gold theme.

## Run locally
1. Unzip the project.
2. Open `index.html` in a modern browser. No build step is required.
3. For a local web server (recommended), open a terminal in this folder and run:
   - Python: `python -m http.server 8000`
   - Then visit `http://localhost:8000`

## Included interactions
- Responsive dashboard and mobile bottom navigation
- Community feed, filters, likes, and local demo post creation
- Voice room cards and simulated room controls for mute, hand raise, and screen-share state
- Course catalogue, search, level filters, and lesson preview modal
- Interactive quiz with scoring and answer explanations
- About page and review cards / local demo review submission
- Admin/member role changes, member search, invitations, and moderation queue controls

## Important prototype limitations
This is a clickable UI prototype. Its sample data lives in browser memory and resets on refresh. It does **not** yet provide real user accounts, persistent posts, real microphone/audio, real screen sharing, secure server-side roles, video streaming, or production notifications.

## Suggested production architecture
- Mobile: React Native + Expo + TypeScript
- Web: Next.js or React responsive web app
- Shared backend: Supabase (PostgreSQL, Auth, Realtime, Storage, Row Level Security)
- Voice/video/screen share: LiveKit SDK and a trusted server-side token endpoint
- Course video delivery: a secure video hosting provider
- Push notifications: Expo Notifications (mobile) and web push where supported

### Security and financial-education notes
Use backend-enforced authorization for every admin action. Never trust a role stored only in the client. Validate uploaded media, apply rate limits and abuse reporting, and keep private course assets behind appropriate access controls. Make it clear that forex education is not personalized financial advice and trading can result in losses.

## Suggested next implementation milestone
Create the shared Supabase schema for profiles, groups, group_members, posts, comments, reactions, rooms, courses, lessons, quiz_questions, quiz_attempts, reviews, and reports; add RLS policies before connecting the client to production data.
