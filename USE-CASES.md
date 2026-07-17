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


--USE CASE QUE JE VOYAIS--
Voici un **use case complet** qui montre comment un utilisateur passe de la découverte d'une publicité à la création de sa propre campagne en moins de 10 minutes.

---

# Use Case : Sarah lance une publicité pour sa marque de skincare

## Profil

**Nom :** Sarah

**Métier :** Fondatrice d'une marque de skincare

**Objectif :** Trouver une publicité Meta qui fonctionne déjà et créer une version adaptée à son produit.

---

# Étape 1 : Connexion

Sarah se connecte à Winning Ads AI.

Elle arrive sur son tableau de bord.

```
Bonjour Sarah 👋

Que souhaitez-vous faire aujourd'hui ?

🔍 Trouver des publicités gagnantes
⭐ Mes favoris
🤖 AI Remixer
```

Elle clique sur **Trouver des publicités gagnantes**.

---

# Étape 2 : Recherche

Elle renseigne :

```
Niche :
Skincare

Pays :
USA

Format :
Vidéo

Langue :
Anglais
```

Elle clique sur **Rechercher**.

---

# Étape 3 : Résultats

Le SaaS affiche plusieurs publicités.

---

Publicité A

✅ Active depuis 278 jours

🔥 Score : 96/100

CTR estimé : Excellent

Format : UGC

---

Publicité B

Active depuis 24 jours

Score : 72

---

Publicité C

Active depuis 413 jours

🔥 Score : 99

---

Sarah choisit la publicité C.

---

# Étape 4 : Analyse IA

Elle clique sur :

**Analyser**

L'IA répond :

---

## Pourquoi cette publicité fonctionne

### Hook

"Your skin is aging faster than you think."

→ Attire immédiatement l'attention.

---

### Angle

Peur de vieillir.

---

### Émotion

Anxiété

Espoir

Transformation

---

### Structure

0-3 sec

Hook

3-8 sec

Avant / Après

8-15 sec

Présentation produit

15-22 sec

Avis client

22-30 sec

Offre

---

### Audience

Femmes

25-45 ans

Centres d'intérêt :

Beauté

Soins

Lifestyle

---

### CTA

Shop Now

---

Sarah comprend exactement pourquoi cette publicité fonctionne.

---

# Étape 5 : AI Remix

Elle clique sur

**Créer une version pour mon produit**

Le SaaS demande :

```
Nom de la marque

GlowSkin

Produit

Sérum Vitamine C

Ton

Premium

Objectif

Conversions
```

Elle clique sur

**Générer**

---

# Étape 6 : Génération

L'IA produit automatiquement :

---

## Nouveau Hook

"Votre peau mérite mieux que des promesses."

---

## Primary Text

Texte optimisé Meta Ads

---

## Headline

Reveal Your Natural Glow

---

## Description

Visible results in 14 days.

---

## CTA

Shop Now

---

## Prompt Image IA

```
Young woman holding a Vitamin C serum,
luxury bathroom,
golden morning light,
natural skin,
minimal aesthetic,
close-up,
premium skincare commercial,
high-end photography
```

---

## Script UGC

Scène 1

"Je pensais avoir tout essayé..."

Scène 2

Montre le produit.

Scène 3

Avant / Après.

Scène 4

Résultat final.

Scène 5

CTA.

---

# Étape 7 : Variations

Sarah clique :

**Créer 5 variantes**

Le SaaS génère :

* 5 hooks
* 5 headlines
* 5 CTA
* 5 scripts UGC
* 5 prompts d'image

Elle a maintenant suffisamment de contenu pour lancer plusieurs tests A/B.

---

# Étape 8 : Sauvegarde

Elle clique :

⭐ Sauvegarder

Le projet est enregistré dans :

```
Mes Projets

GlowSkin Campaign

Version 1

Version 2

Version 3
```

---

# Valeur apportée

En moins de 10 minutes, Sarah est passée de :

> "Je ne sais pas quelle publicité créer"

à

> "J'ai une publicité originale inspirée d'une campagne qui fonctionne déjà, avec plusieurs variantes prêtes à être testées."

---

## La proposition de valeur en une phrase

Le MVP ne vend pas une bibliothèque de publicités. Il vend un **accélérateur de création publicitaire** : il permet à un annonceur d'identifier une publicité performante, de comprendre les mécanismes de son succès et de produire en quelques minutes des variantes originales prêtes à être testées sur Meta Ads. C'est ce gain de temps et d'efficacité qui justifie l'abonnement.

---

## Écart MVP / Vision

| Fonctionnalité du use case | Statut MVP | Notes |
|---------------------------|------------|-------|
| Dashboard avec actions guidées | ❌ | Le dashboard actuel affiche des stats, pas de prompts "Que souhaitez-vous faire ?" |
| Recherche par niche / pays / format / langue | ❌ | La recherche Meta Ads Library est un champ text libre sans facettes |
| Score estimé avec CTR | ❌ | L'analyse AI produit un score mais pas de CTR estimé ni durée d'activité |
| Analyse IA détaillée (hook, angle, émotion, structure, audience, CTA) | ✅ | Présent dans l'onglet Analysis |
| Remix AI avec inputs marque / produit / ton / objectif | ✅ | Présent dans l'onglet Remix |
| Génération de variations multiples (5 hooks, 5 headlines, 5 CTA…) | ❌ | Le remix génère une seule version à la fois |
| Script UGC structuré (scènes) | ❌ | Le remix produit image prompts mais pas de script vidéo |
| Sauvegarde en projet avec versions | ✅ / ⏳ | SaveButton + /saved existent ; les versions multiples ne sont pas gérées |
| Import Meta Ads Library | ⏳ | Bloqué par l'App Review Meta (ads_read) |

**Conclusion** : Le MVP couvre le cœur du use case (analyse + remix + auth + sauvegarde). Les gaps concernent principalement la recherche avancée, les variations en un clic, et le script UGC — autant de briques identifiées pour la roadmap.
