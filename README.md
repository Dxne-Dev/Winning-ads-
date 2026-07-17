# Winning Ads AI

AI-powered Meta Ads intelligence platform — discover winning ads, understand why they work, and generate optimized original versions.

## Stack
- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4 + Shadcn-style UI components
- Supabase (Auth + PostgreSQL)
- OpenAI API

## Setup

```bash
npm install
# if the default registry is unreachable, use the mirror:
# npm install --registry https://registry.npmmirror.com
cp .env.example .env.local   # fill in Supabase + OpenAI keys
```

### Database
Run `supabase/schema.sql` in your Supabase SQL editor to create tables
(`users`, `ads`, `saved_ads`, `projects`, `ai_generations`), RLS policies,
and the signup trigger.

### Environment variables
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_APP_URL`

## Run

```bash
npm run dev      # http://localhost:3000
npm run build
npm run lint
```

## Structure
```
src/
  app/
    (app)/        # authenticated layout: dashboard, ads, saved, projects
    ads/[id]/     # ad detail + AI analysis/remix
    api/          # analyze, remix, saved-ads routes
    login, signup # auth pages
    page.tsx      # landing
  components/     # ui (button, card, input, badge, skeleton), ad-card, ad-analyzer, states
  lib/            # supabase (client/server/admin), openai, utils
  types/          # shared types
supabase/schema.sql
```

## Features
- Landing page (redirects to dashboard when authenticated)
- Email/password auth (Supabase) with route protection middleware
- Ad library with cards, loading/empty/error states
- Ad detail page with AI analysis (hook, angle, audience, triggers, structure, CTA, score) and AI remix (headlines, copy, CTA, image prompts, UGC script)
- Saved ads & projects system
