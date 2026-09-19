# La Bonne Relance

Mini CRM de gestion de prospects et de relances commerciales.

Le projet permet d’enregistrer des prospects, de suivre leur avancement commercial et de créer des séquences d’e-mails personnalisées.

Il a été réalisé comme projet personnel d’apprentissage autour de **Next.js**, **Supabase**, **Python/FastAPI** et **Brevo**.

> Le parcours principal fonctionne de bout en bout : un prospect peut être inscrit dans une automatisation, les e-mails sont planifiés dans Supabase puis envoyés par le backend Python avec Brevo. Le déclenchement périodique des traitements reste à automatiser.

## État du projet

| Fonctionnalité | État |
| --- | --- |
| Authentification | Fonctionnelle |
| Gestion des prospects | Fonctionnelle |
| Tableau de bord | Fonctionnel |
| Création d’automatisations | Fonctionnelle |
| Inscription d’un prospect | Fonctionnelle |
| Planification des e-mails | Fonctionnelle |
| Envoi réel avec Brevo | Fonctionnel |
| Suivi des statuts d’envoi | Fonctionnel |
| Déclenchement périodique | À faire |
| Déploiement du frontend | Vercel |
| Déploiement du backend | À faire |

## Fonctionnalités disponibles

### Authentification

- Création de compte avec Supabase Auth
- Connexion et déconnexion
- Protection des routes privées
- Redirection des utilisateurs non authentifiés
- Isolation des données avec les politiques RLS de Supabase

### Gestion des prospects

- Ajout d’un prospect
- Consultation de la liste
- Recherche et filtres
- Affichage d’une fiche détaillée
- Modification
- Suppression avec confirmation
- Gestion de l’origine et du statut commercial
- Programmation d’une prochaine relance
- Notes associées au prospect

### Tableau de bord

- Nombre de prospects actifs
- Relances prévues et en retard
- Propositions en cours
- Prospects gagnés
- Taux de conversion
- Répartition des prospects par origine
- Affichage des prochaines relances

Les données du tableau de bord sont calculées depuis Supabase.

### Automatisations

- Création d’une séquence d’e-mails
- Ajout de plusieurs étapes
- Configuration du délai de chaque étape
- Personnalisation de l’objet et du contenu
- Activation et désactivation d’une automatisation
- Inscription manuelle d’un prospect à une séquence
- Remplacement de variables dans les messages :

```text
{{prenom}}
{{nom}}
{{nom_complet}}
{{entreprise}}
```

### Backend Python

Le backend FastAPI permet de :

- se connecter à Supabase avec une clé serveur ;
- récupérer les inscriptions en attente ;
- calculer les dates d’envoi ;
- générer les messages personnalisés ;
- créer les e-mails dans la file `scheduled_emails` ;
- empêcher la création de doublons ;
- récupérer les e-mails arrivés à échéance ;
- envoyer les messages avec l’API Brevo ;
- enregistrer les statuts `pending`, `processing`, `sent` et `failed` ;
- conserver l’identifiant du message retourné par Brevo ;
- enregistrer les erreurs d’envoi ;
- protéger les routes internes avec une clé API.

Les traitements sont actuellement déclenchés manuellement depuis Swagger.

## Stack technique

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Supabase SSR

### Backend

- Python 3.13
- FastAPI
- Pydantic Settings
- Supabase Python
- HTTPX
- API transactionnelle Brevo

### Base de données

- PostgreSQL avec Supabase
- Supabase Auth
- Row Level Security
- Migrations SQL versionnées

### Hébergement prévu

- Vercel pour le frontend
- Railway pour le backend Python
- Supabase pour la base de données et l’authentification
- Brevo pour l’envoi des e-mails

## Architecture

```text
la-bonne-relance/
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── types/
├── backend/
│   ├── app/
│   │   ├── services/
│   │   │   ├── automation_service.py
│   │   │   └── email_service.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── main.py
│   │   └── security.py
│   ├── requirements.txt
│   └── .env.example
├── supabase/
│   └── migrations/
└── README.md
```

## Fonctionnement général

```text
Next.js
   ↓
Supabase
   ↓
Inscription à une automatisation
   ↓
Planification par FastAPI
   ↓
Table scheduled_emails
   ↓
Envoi par FastAPI et Brevo
   ↓
Mise à jour du statut
```

Next.js gère l’interface et les actions de l’utilisateur.

Supabase conserve les comptes, les prospects, les automatisations, les inscriptions, les e-mails programmés et l’historique.

Le backend Python transforme les inscriptions en e-mails planifiés, récupère les messages arrivés à échéance puis les transmet à Brevo.

## Prérequis

- Node.js 22 ou version compatible
- npm
- Python 3.13
- Git
- Un projet Supabase
- Un compte Brevo avec une adresse d’expéditeur vérifiée

## Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/sebastien-duhaillier/la-bonne-relance.git
cd la-bonne-relance
```

### 2. Configurer Supabase

Créer un projet Supabase, puis exécuter dans le SQL Editor les migrations présentes dans `supabase/migrations`, dans l’ordre chronologique :

```text
20260918100000_create_prospects.sql
20260918180000_create_automations.sql
20260918190000_prevent_duplicate_scheduled_emails.sql
```

Ces migrations créent notamment :

- `prospects`
- `automations`
- `automation_steps`
- `automation_enrollments`
- `scheduled_emails`
- `activities`

Elles activent également les politiques RLS nécessaires à l’isolation des données.

### 3. Installer le frontend

```bash
cd frontend
npm install
```

Créer `frontend/.env.local` à partir de `frontend/.env.example` :

```env
NEXT_PUBLIC_SUPABASE_URL=https://identifiant-projet.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=cle_publique_supabase
```

La clé publique peut être utilisée dans le frontend. La clé secrète Supabase ne doit jamais être placée dans ce fichier.

Lancer le frontend :

```bash
npm run dev
```

Le site est alors accessible sur :

```text
http://localhost:3000
```

Vérifier le build de production :

```bash
npm run build
```

### 4. Configurer Brevo

Dans Brevo :

1. ajouter une adresse d’expéditeur ;
2. valider cette adresse ;
3. générer une clé API dédiée au backend ;
4. conserver la clé uniquement dans `backend/.env`.

Pour une utilisation en production, il est recommandé d’authentifier un domaine d’envoi avec DKIM et DMARC.

### 5. Installer le backend Python

Depuis la racine du projet :

```bash
cd backend
python -m venv .venv
```

Activation sous Windows PowerShell :

```powershell
.\.venv\Scripts\Activate.ps1
```

Activation sous macOS ou Linux :

```bash
source .venv/bin/activate
```

Installer les dépendances :

```bash
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

Créer `backend/.env` à partir de `backend/.env.example` :

```env
SUPABASE_URL=https://identifiant-projet.supabase.co
SUPABASE_SECRET_KEY=cle_secrete_supabase
INTERNAL_API_KEY=cle_interne_aleatoire

BREVO_API_KEY=cle_api_brevo
BREVO_SENDER_EMAIL=adresse_expediteur_verifiee
BREVO_SENDER_NAME=La Bonne Relance
```

Une clé interne peut être générée avec :

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

La clé secrète Supabase contourne les politiques RLS. Elle doit rester exclusivement dans le backend.

Lancer FastAPI :

```bash
python -m uvicorn app.main:app --reload
```

L’API est accessible sur :

```text
http://127.0.0.1:8000
```

La documentation Swagger est disponible sur :

```text
http://127.0.0.1:8000/docs
```

## Tester le parcours complet

Pour éviter l’envoi de messages à des tiers, utiliser uniquement une adresse de test que vous contrôlez.

1. Créer un compte.
2. Se connecter.
3. Ajouter un prospect avec une adresse e-mail de test.
4. Créer une automatisation comportant une ou plusieurs étapes.
5. Activer l’automatisation.
6. Ouvrir la fiche du prospect.
7. Inscrire le prospect à l’automatisation.
8. Ouvrir Swagger sur `http://127.0.0.1:8000/docs`.
9. Exécuter :

```text
POST /jobs/schedule-enrollments
```

10. Fournir la clé interne dans l’en-tête :

```text
X-Internal-API-Key
```

Pour une inscription comportant deux étapes, le résultat peut être :

```json
{
  "processed": 1,
  "scheduled": 2,
  "failed": 0,
  "stopped": 0
}
```

11. Vérifier les lignes créées dans `scheduled_emails`.
12. Attendre que `scheduled_for` soit arrivé à échéance.
13. Exécuter :

```text
POST /jobs/send-emails
```

Le résultat attendu pour un message est :

```json
{
  "processed": 1,
  "sent": 1,
  "failed": 0,
  "skipped": 0
}
```

Le message doit être reçu par le destinataire et la ligne correspondante doit passer au statut `sent`.

## Vérifications techniques

Frontend :

```bash
cd frontend
npm run build
```

Backend :

```bash
cd backend
python -m compileall app
```

Test de disponibilité de l’API :

```text
GET /health
```

Test de la connexion Supabase :

```text
GET /health/database
```

## Sécurité

Les fichiers suivants ne doivent jamais être envoyés sur GitHub :

```text
frontend/.env.local
backend/.env
backend/.venv/
```

Le frontend utilise uniquement la clé publique Supabase.

Les éléments suivants restent exclusivement dans le backend :

- clé secrète Supabase ;
- clé API Brevo ;
- clé interne FastAPI.

Les routes de traitement sont protégées par l’en-tête `X-Internal-API-Key`.

La base utilise des politiques RLS afin qu’un utilisateur ne puisse consulter et modifier que ses propres données.

Les clés exposées accidentellement doivent être immédiatement révoquées et remplacées.

## Reste à faire pour terminer le MVP

- Déclencher automatiquement les traitements à intervalle régulier
- Passer une inscription au statut `completed` après le dernier e-mail
- Mettre à jour la position de l’étape en cours
- Enregistrer les succès et les erreurs dans `activities`
- Afficher l’historique réel des envois sur la fiche prospect
- Ajouter quelques tests automatisés essentiels
- Déployer le backend FastAPI sur Railway
- Configurer les variables d’environnement de production
- Configurer les URL d’authentification Supabase pour Vercel
- Tester le parcours complet après déploiement

## Évolutions futures

Les fonctionnalités suivantes sont volontairement exclues du MVP initial :

- Déclenchement automatique lors de la création d’un prospect
- Déclenchement lors d’un changement de statut
- Détection des prospects inactifs
- Arrêt automatique lorsqu’un prospect répond
- Gestion des désinscriptions
- Réception des événements Brevo par webhooks
- Gestion avancée des nouvelles tentatives
- Annulation d’une inscription en cours
- Import de prospects par CSV
- Statistiques avancées d’ouverture et de clic
- Gestion séparée du prénom et du nom
- Réinitialisation complète du mot de passe
- Gestion d’équipes et de plusieurs utilisateurs
- Utilisation complète de la CLI Supabase pour le suivi des migrations
- Authentification DKIM et DMARC d’un domaine d’envoi personnalisé

## Limites actuelles

- Les deux traitements Python doivent être déclenchés manuellement.
- Une inscription reste actuellement active après l’envoi de sa dernière étape.
- Les erreurs d’envoi sont enregistrées mais ne sont pas retentées automatiquement.
- Seul le déclenchement manuel d’une automatisation est opérationnel.
- Le prénom et le nom sont déduits d’un champ `name` unique.
- Le suivi des réponses et des désinscriptions n’est pas disponible.
- L’expéditeur Brevo de démonstration utilise une adresse gratuite, moins adaptée à la délivrabilité en production.
- Les migrations sont actuellement exécutées manuellement dans le SQL Editor Supabase.

## Objectif pédagogique

Ce projet permet de travailler sur :

- l’App Router de Next.js ;
- les composants serveur et client ;
- les Server Actions ;
- l’authentification Supabase ;
- PostgreSQL et les politiques RLS ;
- la séparation frontend/backend ;
- la création d’un worker Python ;
- l’utilisation d’une API transactionnelle ;
- la sécurisation des variables d’environnement ;
- la conception d’un système de relances asynchrones ;
- le déploiement séparé d’un frontend et d’un backend.

## Auteur

Sébastien Duhaillier

- [GitHub](https://github.com/sebastien-duhaillier)
- [Portfolio](https://sebastien-duhaillier.github.io/portfolio/)