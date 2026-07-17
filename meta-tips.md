# Meta Ads Library API — Guide d'obtention du token

## 1. Créer une app Meta Developer

1. Va sur https://developers.facebook.com/
2. Clique **My Apps** (en haut à droite)
3. **Create App**
4. Choisis **Other** → **Next**
5. Type **Business** → **Next**
6. Donne un nom (ex: "Winning Ads AI") + ton email
7. **Create App**

## 2. Ajouter la permission `ads_read`

1. Dans la colonne de gauche : **App Settings** → **Advanced**
2. Copie le **App ID** (utile plus tard)
3. Retourne au dashboard principal
4. **Add Product** (bas à gauche de la sidebar)
5. Cherche **Ads API** → **Set Up**

## 3. Générer le token

1. Va sur https://developers.facebook.com/tools/explorer/
2. En haut : sélectionne ton app (App ID)
3. **User or Page Token** → **Get User Access Token**
4. Coche la permission **`ads_read`**
5. **Generate Access Token**

## 4. Passer l'app en mode Live

1. Va sur https://developers.facebook.com/apps/
2. Clique sur ton app → **Settings** → **Basic**
3. Tout en haut, bascule **App Mode** de "Development" à **Live**
4. Confirme si demandé

> Sans mode Live, `ads_read` est bloqué sur les endpoints réels même si le token l'a.

## 5. Copier le token

1. Copie le token (commence par `EA...`)
2. Ouvre `.env.local`
3. Ajoute : `META_ADS_ACCESS_TOKEN=EA...ton_token...`

## 5. Tester

```bash
npm run dev
```

Va sur http://localhost:3000/ads → cherche un mot-clé (ex: "fitness") → sélectionne → **Import**.

## Diagnostic rapide (avant soumission App Review)

1. Va sur https://developers.facebook.com/tools/explorer/
2. Sélectionne ton app en haut
3. Garde le token existant
4. Dans le champ "Query", colle exactement ceci :

```
ads_archive?search_terms=fitness&search_type=KEYWORD_UNORDERED&ad_type=ALL&ad_active_status=ALL&ad_delivery_date_min=2025-01-01&ad_reached_countries=["US"]&limit=3&fields=id,ad_creative_bodies,ad_creative_link_titles,ad_snapshot_url,page_name
```

5. Clique **Submit**

**Résultat attendu :**
- ✅ **Ça marche** → retourne des annonces → le token est bon, il faut juste passer l'app en **Live** (Settings → Basic → App Mode → Live)
- ❌ **Erreur** → `ads_read` n'est pas accordé correctement → regénère un token en cochant bien `ads_read`

## Résoudre l'erreur "Currently ineligible for submission"

Si tu vois ce message en voulant soumettre l'app en **App Review**, ignore la soumission. Passe plutôt l'app en **Live** directement :

1. https://developers.facebook.com/apps/ → ta app
2. **Settings** → **Basic**
3. Tout en haut : bascule **App Mode** de "Development" à **Live**
4. Confirme

Une fois en **Live**, le token devrait fonctionner sans passer par l'App Review.

## App Review obligatoire — Remplir les champs manquants

Même en mode Live, `ads_read` nécessite une App Review. Les 3 champs suivants sont obligatoires :

### 1. Icône de l'app (1024×1024)
- Crée un carré 1024×1024 px (logo Winning Ads ou image quelconque)
- **Settings → Basic** → **App Icon** → upload

### 2. URL de la Politique de confidentialité
- Tu as déjà une page `/privacy` dans l'app → `https://winning-ads-one.vercel.app/privacy`
- **Settings → Basic** → **Privacy Policy URL**

### 3. Catégorie
- **Settings → Basic** → **Category** → **Business Tools**

### Une fois les 3 champs remplis
1. Dashboard → **App Review** → **Permissions**
2. Clique **Request** à côté de `ads_read`
3. Remplis le formulaire (décris l'usage)
4. Soumets

L'approval peut prendre **1-2 jours**. En attendant, le token ne fonctionnera pas.

## Notes

- Le token du Graph Explorer expire au bout de **1-2h**
- Pour un token longue durée (60 jours) : génère un **Long-Lived Token** via l'endpoint `/oauth/access_token` avec le `client_secret`
- L'API ne retourne que les annonces **actives** en cours de diffusion (pas l'archive historique complète)
- Les annonces politiques nécessitent des permissions supplémentaires
