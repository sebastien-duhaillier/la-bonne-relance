# La Bonne Relance

Mini CRM de gestion de prospects et de relances commerciales.

Le projet permet d’enregistrer des prospects, de suivre leur avancement commercial et de préparer des séquences d’e-mails automatisées.

Il a été réalisé comme projet personnel d’apprentissage autour de **Next.js**, **Supabase** et **Python/FastAPI**.

> Le projet est en cours de développement. La création et la planification des relances fonctionnent, mais aucun e-mail réel n’est encore envoyé.

## Fonctionnalités disponibles

### Authentification

* Création de compte avec Supabase Auth
* Connexion et déconnexion
* Protection des routes privées
* Redirection des utilisateurs non authentifiés
* Isolation des données avec les politiques RLS de Supabase

### Gestion des prospects

* Ajout d’un prospect
* Consultation de la liste
* Recherche et filtres
* Affichage d’une fiche détaillée
* Modification
* Suppression avec confirmation
* Gestion de l’origine et du statut commercial
* Programmation d’une prochaine relance
* Notes associées au prospect

### Tableau de bord

* Nombre de prospects actifs
* Relances prévues et en retard
* Propositions en cours
* Prospects gagnés
* Taux de conversion
* Répartition des prospects par origine
* Affichage des prochaines relances

Les données du tableau de bord sont calculées depuis Supabase.

### Automatisations

* Création d’une séquence d’e-mails
* Ajout de plusieurs étapes
* Configuration du délai de chaque étape
* Personnalisation de l’objet et du contenu
* Activation et désactivation d’une automatisation
* Inscription manuelle d’un prospect à une séquence
* Remplacement de variables :

```text
{{prenom}}
{{nom}}
{{nom_complet}}
{{entreprise}}
```

### Backend Python

Le backend FastAPI peut :

* se connecter à Supabase avec une clé serveur ;
* récupérer les inscriptions en attente ;
* calculer les dates d’envoi ;
* générer les messages personnalisés ;
* créer les e-mails dans la file `scheduled_emails` ;
* empêcher la création de doublons ;
* enregistrer l’inscription dans l’historique ;
* protéger les routes internes avec une clé API.

Le traitement est actuellement déclenché manuellement depuis Swagger.

## Stack technique

### Frontend

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS
* Supabase SSR

### Backend

* Python 3.13
* FastAPI
* Pydantic Settings
* Supabase Python

### Base de données

* PostgreSQL avec Supabase
* Supabase Auth
* Row Level Security
* Migrations SQL versionnées

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
Inscriptions aux automatisations
   ↓
Backend Python
   ↓
E-mails programmés
```

Next.js gère l’interface et les actions utilisateur.

Supabase conserve les comptes, les prospects, les automatisations, les inscriptions, les e-mails programmés et l’historique.

Le backend Python transforme les inscriptions en e-mails planifiés.

## Prérequis

* Node.js 22 ou version compatible
* npm
* Python 3.13
* Un projet Supabase
* Git

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

* `prospects`
* `automations`
* `automation_steps`
* `automation_enrollments`
* `scheduled_emails`
* `activities`

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

Le site est accessible sur :

```text
http://localhost:3000
```

Vérifier le build de production :

```bash
npm run build
```

### 4. Installer le backend Python

Depuis la racine :

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
```

Une clé interne peut être générée avec :

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

La clé secrète Supabase contourne les politiques RLS. Elle doit rester exclusivement dans le backend.

Lancer FastAPI :

```bash
fastapi dev app/main.py
```

L’API est accessible sur :

```text
http://127.0.0.1:8000
```

La documentation Swagger est disponible sur :

```text
http://127.0.0.1:8000/docs
```

## Tester le parcours actuel

1. Créer un compte.
2. Se connecter.
3. Ajouter un prospect.
4. Créer une automatisation comportant une ou plusieurs étapes.
5. Activer l’automatisation.
6. Ouvrir la fiche du prospect.
7. Inscrire le prospect à l’automatisation.
8. Ouvrir Swagger sur `http://127.0.0.1:8000/docs`.
9. Exécuter :

```text
POST /jobs/schedule-enrollments
```

10. Fournir la clé dans l’en-tête :

```text
X-Internal-API-Key
```

Pour une inscription comportant deux étapes, le résultat attendu est :

```json
{
  "processed": 1,
  "scheduled": 2,
  "failed": 0,
  "stopped": 0
}
```

Les lignes correspondantes doivent ensuite être visibles dans la table `scheduled_emails`.

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

## Sécurité

Les fichiers suivants ne doivent jamais être envoyés sur GitHub :

```text
frontend/.env.local
backend/.env
backend/.venv/
```

Le frontend utilise uniquement la clé publique Supabase.

La clé secrète Supabase et la clé interne FastAPI restent exclusivement dans le backend.

La base utilise des politiques RLS afin qu’un utilisateur ne puisse consulter et modifier que ses propres données.

## Reste à faire pour terminer le MVP

* Connecter un prestataire d’envoi d’e-mails
* Envoyer réellement les e-mails arrivés à échéance
* Mettre à jour les statuts `pending`, `processing`, `sent` et `failed`
* Enregistrer les succès et les erreurs dans `activities`
* Afficher l’historique réel sur la fiche prospect
* Exécuter automatiquement le worker à intervalle régulier
* Ajouter quelques tests essentiels
* Déployer le frontend et le backend
* Tester les envois uniquement avec une adresse personnelle dédiée

## Évolutions futures

Les fonctionnalités suivantes sont volontairement exclues du MVP :

* Déclenchement automatique lors de la création d’un prospect
* Déclenchement lors d’un changement de statut
* Détection des prospects inactifs
* Arrêt automatique lorsqu’un prospect répond
* Gestion des désinscriptions
* Réception des événements par webhooks
* Gestion avancée des nouvelles tentatives
* Verrouillage contre plusieurs workers simultanés
* Modification et suppression des automatisations
* Annulation d’une inscription en cours
* Import de prospects par CSV
* Statistiques avancées d’ouverture et de clic
* Gestion séparée du prénom et du nom
* Réinitialisation complète du mot de passe
* Gestion d’équipes et de plusieurs utilisateurs
* Utilisation complète de la CLI Supabase pour le suivi des migrations

## Limites actuelles

* Aucun e-mail réel n’est encore envoyé.
* Le worker est déclenché manuellement.
* Seul le déclenchement manuel d’une automatisation est opérationnel.
* Le prénom et le nom sont déduits d’un champ `name` unique.
* Le suivi des réponses et des désinscriptions n’est pas encore disponible.
* Les migrations ont été exécutées manuellement dans le SQL Editor.

## Objectif pédagogique

Ce projet permet de travailler sur :

* l’App Router de Next.js ;
* les composants serveur et client ;
* les Server Actions ;
* l’authentification Supabase ;
* PostgreSQL et les politiques RLS ;
* la séparation frontend/backend ;
* la création d’un worker Python ;
* la sécurisation des variables d’environnement ;
* la conception d’un système de relances asynchrones.

## Auteur

Sébastien Duhaillier

* [GitHub](https://github.com/sebastien-duhaillier)
* [Portfolio](https://sebastien-duhaillier.github.io/portfolio/)
