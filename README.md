# BirthzMe 🎂✨

Make Their Birthday Unforgettable.

## Status: Feature-complete for all three templates + full creator flow

Every checklist item from the original brief that doesn't require a real,
already-provisioned Supabase/ImageKit project is implemented: three
templates, auth, creation wizard, uploads, dashboard, sharing, and a basic
installable PWA shell.

**Built, real, wired to Supabase/ImageKit:** magic-link auth, the full
6-step creation wizard with live preview across all three templates, photo
+ custom-music upload direct to ImageKit, slug + link generation, the
dashboard (list/preview/copy/share/delete), all three recipient
experiences end to end (Dreamy Pink, Cinematic Gold, Fun Party), the full
landing page, and a basic PWA (manifest, offline shell, install prompt —
Android native prompt, iOS manual instructions).

**Not included:** payments (intentionally out of scope per the brief),
email notifications (Nodemailer wiring), and real hosted built-in music
files — `lib/message-presets.ts` has placeholder `/audio/*.mp3` paths; add
real royalty-safe files under `public/audio/` before launch.

## What's here

```
app/
  page.tsx                          → full landing page (hero, how-it-works, templates, CTA)
  layout.tsx, globals.css
  auth/login/page.tsx               → magic-link sign-in
  auth/callback/route.ts            → exchanges the magic-link code for a session
  create/page.tsx                   → creation wizard (client component)
  create/success/page.tsx           → share screen (link, QR, WhatsApp)
  dashboard/page.tsx                → creator's list of surprises (server component, RLS-scoped)
  birthday/[slug]/page.tsx          → public recipient page, fetches by slug, renders matching template
  birthday/[slug]/event-tracker.tsx
  api/events/route.ts               → anonymous event logging (service-role, validated)
  api/upload/route.ts               → ImageKit upload signature (auth required)
  api/birthday/route.ts             → POST create surprise (session-scoped, RLS enforced)
  api/birthday/[id]/route.ts        → PATCH / DELETE a single surprise (owner only)
components/
  birthday/                         → GiftBox, ConfettiBurst, NameReveal, PhotoReveal,
                                       MemoryGallery, TypewriterMessage, AgeReveal,
                                       SurpriseCountdown, MusicPlayer, BalloonField, LightRays
  templates/                        → DreamyPinkTemplate, CinematicGoldTemplate, FunPartyTemplate
                                       (all three implement the same TemplateProps contract)
  create/                           → TemplateSelector, BirthdayPersonForm, PhotoUploader,
                                       MessageEditor, MusicSelector, CustomizationForm, CreateWizard
  dashboard/                        → SurpriseCard, SignOutButton
  marketing/LandingPage.tsx         → the "/" page content
  shared/                           → ProgressIndicator, ShareButtons, InstallAppSection,
                                       ServiceWorkerRegistrar
lib/
  supabase/client.ts, server.ts
  slug.ts                           → collision-safe slug generation
  imagekit.ts, upload.ts            → server auth signature + client direct-upload helper
  message-presets.ts                → built-in music catalog + local message style suggestions
middleware.ts                       → protects /create and /dashboard behind auth
types/birthday.ts                   → shared data model + TemplateProps contract
supabase/schema.sql                 → full schema + RLS policies
public/sw.js, public/offline.html   → PWA service worker + offline fallback shell
```

## Local development

```bash
npm install
cp .env.example .env.local   # fill in your Supabase + ImageKit values
npm run dev
```

## Supabase setup

1. Create a project at supabase.com.
2. In the SQL editor, run `supabase/schema.sql` in full — it's idempotent,
   safe to re-run.
3. Copy your Project URL, anon key, and service role key into `.env.local`.
4. To view a recipient experience locally without going through the wizard,
   insert a test row (swap `template` for `'dreamy-pink'`, `'cinematic-gold'`,
   or `'fun-party'` to preview any of the three):

```sql
insert into birthday_surprises
  (creator_id, slug, recipient_name, recipient_age, sender_name, template,
   main_photo_url, birthday_message, status)
values
  (auth.uid(), 'sarah-25-test1', 'Sarah', 25, 'Alex', 'dreamy-pink',
   'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
   'Dear Sarah, ... [your message] ...', 'published');
```

Then visit `/birthday/sarah-25-test1`. Or just sign in at `/auth/login` and
use `/create` for the real flow — that's the primary path now.

## ImageKit setup

Used by `/api/upload` (auth signature) and the wizard's photo/music
uploaders (`lib/upload.ts`, direct browser-to-ImageKit). Get your public
key, private key, and URL endpoint from your ImageKit dashboard and add
them to `.env.local`. Also add your ImageKit hostname to
`next.config.js` → `images.remotePatterns` so `next/image` can render
uploaded photos.

## Production build

```bash
npm run build
npm run start
```

Fix any TypeScript/build errors before deploying — this codebase has not
been build-tested in this environment (no network access here to install
packages), so treat the first `npm install && npm run build` as your
verification step.

## Deployment (Vercel)

1. Push to a Git repo, import into Vercel.
2. Add the same env vars from `.env.example` in Vercel's project settings,
   including `NEXT_PUBLIC_SITE_URL` set to your real deployed domain.
3. Deploy.

## What's genuinely NOT built

- Payments / premium templates — out of scope per the original brief.
- Outbound email notifications (Nodemailer) — not wired up.
- Real built-in music audio files — the track list in
  `lib/message-presets.ts` points at `/audio/*.mp3` placeholder paths that
  don't exist yet; add licensed files under `public/audio/`.
- AI-generated message text — message "suggestions" are local, deterministic
  style presets (see `lib/message-presets.ts`), not an external AI call.
- This has not been run through a real `npm install && npm run build` —
  there's no network access in the environment this was built in.

## Troubleshooting

- **Blank page at `/birthday/[slug]`** — check the surprise's `status` is
  `published`, `opened`, or `celebrated`; RLS hides `draft` rows from the
  public policy on purpose.
- **Music won't play** — expected on first load in most mobile browsers;
  the floating music button requires one tap due to autoplay restrictions.
- **Photos not loading** — add your ImageKit hostname to
  `next.config.js` → `images.remotePatterns`.
- **Unstyled page (no Tailwind)** — make sure `postcss.config.js` exists at
  the project root; without it Next.js won't compile the `@tailwind`
  directives in `app/globals.css`.
- **Install prompt never shows on Android** — it only appears once Chrome
  actually fires `beforeinstallprompt`, which requires HTTPS (or localhost)
  and a valid manifest; it won't show on a fresh `npm run dev` over plain HTTP
  from another device on your network.
