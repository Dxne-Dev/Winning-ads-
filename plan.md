# Plan — Winning Ads AI (MVP)

## Vue d'ensemble
Plateforme d'intelligence publicitaire Meta propulsée par l'IA.
Stack : Next.js 15 + TypeScript + Tailwind + Shadcn UI + Supabase (auth + PostgreSQL) + OpenAI.

---

## Phase 0 — Setup projet
1. Initialiser Next.js 15 (App Router) avec TypeScript + Tailwind + ESLint
2. Installer et configurer Shadcn UI
3. Configurer variables d'environnement (`.env.local`) : Supabase URL/keys, OpenAI key
4. Mettre en place la structure de dossiers (clean architecture) :
   - `app/` (routes)
   - `components/` (ui + domaine)
   - `lib/` (supabase, openai, utils)
   - `types/`

## Phase 1 — Base de données (Supabase)
5. Créer le schéma SQL et les tables :
   - `users` (lié à auth.users)
   - `ads` (données publicitaires)
   - `saved_ads` (ads sauvegardées par user)
   - `projects` (espaces de travail user)
   - `ai_generations` (historique des remix IA)
6. Configurer RLS (Row Level Security) par user
7. Créer les clients Supabase (`lib/supabase/client.ts`, `server.ts`, `middleware.ts`)

## Phase 2 — Authentification
8. Pages `/login` et `/signup`
9. Middleware de protection des routes
10. Composants auth réutilisables + gestion des erreurs/états de chargement

## Phase 3 — Landing page
11. Hero, features, social proof, CTA
12. Navbar + footer premium (style Linear/Vercel/Notion)
13. Responsive + états visuels soignés

## Phase 4 — Dashboard & layout app
14. Layout authentifié (sidebar + topbar)
15. Page `/dashboard` (vue d'ensemble, projets, stats)
16. Gestion des projets (`/projects`)

## Phase 5 — Découverte d'ads
17. Page `/ads` : recherche/filtres, grille de cartes
18. États : loading (skeletons), empty, error
19. Mock data puis branchement Supabase `ads`

## Phase 6 — Analyse d'ad
20. Page `/ads/[id]` : détail + analyse IA
21. Module d'analyse OpenAI (hook, angle, audience, triggers, structure, CTA)
22. Affichage structuré des résultats

## Phase 7 — Générateur de remix IA
23. Interface de remix sur la page d'ad
24. Module OpenAI générant : copy, headlines, CTA, prompts image, scripts UGC
25. Sauvegarde dans `ai_generations`

## Phase 8 — Système d'ads sauvegardées
26. Bouton "save" sur les ads
27. Page `/saved` listant `saved_ads`
28. Suppression/ajout avec MAJ état

## Phase 9 — Finitions
29. Loading / empty / error states globaux
30. Vérification lint + typecheck
31. README minimal (setup + lancement)

---

## Ordre de priorité
Setup → DB → Auth → Landing → Dashboard → Découverte → Analyse → Remix → Saved → Finitions
