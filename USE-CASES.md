# Use Cases — Winning Ads AI

## État actuel (MVP — July 2026)

### 1. Découverte d'annonces Meta

| Élément | Statut |
|---------|--------|
| Parcourir la librairie d'annonces Meta | ✅ Import depuis Meta Ads Library |
| Rechercher par mot-clé | ✅ `/ads` → champ search + résultats |
| Voir les détails d'une annonce | ✅ `/ads/[id]` — snapshot, page, creative |
| Importer une annonce dans la base | ✅ Bouton "Import" |

> **Blocage** : L'API Meta Ads Library nécessite `ads_read` en mode Live + App Review. Le token actuel ne fonctionne pas encore.

### 2. Analyse AI d'une annonce

| Élément | Statut |
|---------|--------|
| Analyser le hook, l'angle, l'audience | ✅ `/api/analyze` → Groq (llama-3.3-70b) |
| Voir l'analyse structurée | ✅ Onglet "Analysis" dans `/ads/[id]` |
| Score et répartition par dimension | ✅ Badge score + sections |

### 3. Remix créatif AI

| Élément | Statut |
|---------|--------|
| Générer headlines, copy, CTA, image prompts | ✅ `/api/remix` → Groq |
| Voir le résultat formaté | ✅ Onglet "Remix" dans `/ads/[id]` |

### 4. Gestion de compte

| Élément | Statut |
|---------|--------|
| Inscription (email + mot de passe) | ✅ `/signup` → PremiumAuth |
| Connexion | ✅ `/login` → PremiumAuth |
| Réinitialisation de mot de passe | ✅ Modal reset dans PremiumAuth |
| Confirmation par email | ✅ `/signup/confirmation` |
| Redirection post-auth | ✅ Middleware (proxy) guarde les routes protégées |

### 5. Dashboard

| Élément | Statut |
|---------|--------|
| Stats en temps réel (ads, projets, analyses) | ✅ Comptes COUNT depuis Supabase |
| Cartes KPI / actions rapides | ✅ Layout dashboard |
| Graphique d'activité | ⏳ Skeleton (placeholder) |

### 6. Projets

| Élément | Statut |
|---------|--------|
| Créer un projet | ✅ Modal CreateProjectButton |
| Lister les projets | ✅ `/projects` |
| API CRUD | ✅ `GET/POST /api/projects` |

### 7. Favoris (Saved Ads)

| Élément | Statut |
|---------|--------|
| Sauvegarder une annonce | ✅ Bouton SaveButton + `POST /api/saved-ads` |
| Retirer des favoris | ✅ `DELETE /api/saved-ads` |
| Voir ses annonces sauvegardées | ✅ `/saved` |

### 8. Infrastructure

| Élément | Statut |
|---------|--------|
| Base de données | ✅ Supabase PostgreSQL (tables + RLS) |
| Authentification | ✅ Supabase Auth (email/password) |
| AI Inference | ✅ Groq — llama-3.3-70b-versatile |
| Déploiement | ✅ Vercel — winning-ads-one.vercel.app |
| Design system | ✅ Bleu data (#1E40AF) + Amber (#F59E0B), glassmorphism |
| Responsive | ✅ Layout adaptatif |

---

## Résumé

**Fonctionnel immédiatement :**
- Inscription / Connexion / Reset password
- Dashboard avec stats live
- Création et gestion de projets
- Analyse AI et Remix créatif (Groq)
- Sauvegarde d'annonces en favoris
- Page Privacy Policy pour Meta App Review

**Nécessite Meta App Review pour fonctionner :**
- Import d'annonces depuis Meta Ads Library (recherche + import)
