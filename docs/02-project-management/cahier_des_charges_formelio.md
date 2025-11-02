# CAHIER DES CHARGES - SITE WEB FORMELIO

**Version :** 1.0  
**Date :** Octobre 2025  
**Projet :** Plateforme web Formelio - Service de formalitÃ©s juridiques pour professionnels du droit

---

## 1. PRÃ‰SENTATION DU PROJET

### 1.1 Contexte

Formelio est un service spÃ©cialisÃ© dans les formalitÃ©s administratives et juridiques complexes, destinÃ© aux professionnels du droit franÃ§ais (experts-comptables, avocats, notaires). Le service se positionne sur un segment trÃ¨s spÃ©cifique : le traitement des dossiers rejetÃ©s et des situations administratives bloquÃ©es qui nÃ©cessitent une expertise approfondie des registres franÃ§ais (RNE, RCS, INSEE).

### 1.2 Valeur ajoutÃ©e unique

- **Expertise insider** : DiplÃ´me en droit de l'UniversitÃ© de Montpellier + expÃ©rience professionnelle au greffe du tribunal de commerce (service RCS)
- **Connaissance approfondie** des divergences entre bases de donnÃ©es (RNE, RCS, INSEE)
- **MaÃ®trise** des causes de rejet et des pratiques locales des greffes
- **Communication directe** avec les registres pour dÃ©bloquer les situations
- **Positionnement diffÃ©renciant** : expertise sur les cas complexes plutÃ´t que volume sur les cas simples

### 1.3 Cible principale

- Experts-comptables
- Avocats
- Notaires
- Professionnels du droit confrontÃ©s Ã  des rejets ou blocages administratifs

### 1.4 Objectifs du site

1. PrÃ©senter clairement la valeur ajoutÃ©e et l'expertise unique de Formelio
2. Rassurer les professionnels sur la capacitÃ© Ã  rÃ©soudre leurs problÃ¨mes complexes
3. Permettre aux clients de suivre leurs dossiers en temps rÃ©el
4. Faciliter les Ã©changes de documents et la communication
5. Automatiser la gestion des paiements et la facturation

---

## 2. ARCHITECTURE DU PROJET

### 2.1 Approche de dÃ©veloppement par phases

Le projet sera dÃ©veloppÃ© en 3 phases distinctes selon une approche MVP (Minimum Viable Product) :

#### **PHASE 1 : Site vitrine et Landing Page**
- Page d'accueil avec proposition de valeur
- Page "Ã€ propos"
- Page "Contact"
- Page "Mentions lÃ©gales"
- Politique de confidentialitÃ©
- CGV/CGU

#### **PHASE 2 : Espace client et authentification**
- SystÃ¨me d'authentification sÃ©curisÃ©
- Dashboard client pour suivi des procÃ©dures administratives
- Upload de documents PDF
- SystÃ¨me de chat intÃ©grÃ©
- Notifications de statut des dossiers

#### **PHASE 3 : Paiement et facturation**
- IntÃ©gration systÃ¨me de paiement en ligne
- GÃ©nÃ©ration automatique de factures
- Historique des transactions
- Gestion des abonnements (si applicable)

### 2.2 Stack technique

| Composant | Technologie choisie | Justification |
|-----------|-------------------|---------------|
| **Framework** | Next.js | Performance, SEO, rendu cÃ´tÃ© serveur |
| **Styling** | Tailwind CSS | RapiditÃ© de dÃ©veloppement, personnalisation |
| **UI Components** | Shadcn UI | Composants modernes et accessibles |
| **Backend/BDD** | Supabase | Solution complÃ¨te (auth, database, storage) |
| **Boilerplate** | Next-SaaS-Stripe-Starter | AccÃ©lÃ©ration dÃ©veloppement MVP |
| **Typographie** | Poppins + Inter | CohÃ©rence avec brand guidelines |

---

## 3. SPÃ‰CIFICATIONS FONCTIONNELLES

### 3.1 PHASE 1 - Site vitrine

#### 3.1.1 Page d'accueil

**Sections clÃ©s :**

1. **Hero Section**
   - Titre percutant mettant en avant l'expertise sur cas complexes
   - Sous-titre prÃ©cisant le positionnement : "SpÃ©cialiste des dossiers bloquÃ©s et rejetÃ©s"
   - Call-to-action principal : "DÃ©bloquer mon dossier"
   - Visuel du logo Formelio avec tagline "Votre temps, notre prioritÃ©"

2. **Value Proposition**
   - Mise en avant de l'expertise insider (greffe RCS)
   - 3-4 points diffÃ©renciants :
     * Communication directe avec les registres
     * Connaissance des divergences RNE/RCS/INSEE
     * Expertise des causes de rejet
     * RÃ©solution avant soumission

3. **Services proposÃ©s**
   - DÃ©blocage de dossiers rejetÃ©s
   - FormalitÃ©s complexes (restructurations, cas atypiques)
   - Accompagnement pour professionnels du droit
   - Audit prÃ©ventif avant soumission

4. **Process de travail**
   - Ã‰tape 1 : Analyse du dossier
   - Ã‰tape 2 : Identification du blocage
   - Ã‰tape 3 : RÃ©solution et soumission
   - Ã‰tape 4 : Suivi jusqu'Ã  validation

5. **TÃ©moignages/Social Proof**
   - Citations de clients (Ã  dÃ©velopper)
   - Statistiques de rÃ©ussite (Ã  dÃ©velopper)

6. **CTA final**
   - Formulaire de contact
   - Lien vers prise de rendez-vous

#### 3.1.2 Page "Ã€ propos"

**Contenu :**
- Histoire et genÃ¨se de Formelio
- PrÃ©sentation du fondateur et de son expertise
- Parcours universitaire (UniversitÃ© de Montpellier)
- ExpÃ©rience au greffe du tribunal de commerce
- Vision et valeurs
- Pourquoi Formelio est diffÃ©rent

#### 3.1.3 Page "Contact"

**Ã‰lÃ©ments :**
- Formulaire de contact structurÃ© :
  * Nom/PrÃ©nom
  * Email professionnel
  * TÃ©lÃ©phone
  * Profession (dropdown : Expert-comptable, Avocat, Notaire, Autre)
  * Type de problÃ¨me (dropdown : Dossier rejetÃ©, FormalitÃ© complexe, Question, Autre)
  * Message dÃ©taillÃ©
  * Upload de document (optionnel)
- CoordonnÃ©es de contact (email, tÃ©lÃ©phone si applicable)
- Horaires de disponibilitÃ©

#### 3.1.4 Pages lÃ©gales

- **Mentions lÃ©gales** : Informations lÃ©gales obligatoires
- **Politique de confidentialitÃ©** : ConformitÃ© RGPD
- **CGV/CGU** : Conditions gÃ©nÃ©rales adaptÃ©es aux services juridiques

### 3.2 PHASE 2 - Authentification et Dashboard

#### 3.2.1 SystÃ¨me d'authentification

**FonctionnalitÃ©s :**
- Inscription/Connexion via email + mot de passe
- Validation email obligatoire
- RÃ©cupÃ©ration de mot de passe
- Authentification Ã  deux facteurs (2FA) - optionnel mais recommandÃ©
- Gestion des sessions sÃ©curisÃ©es

**Profil utilisateur :**
- Informations personnelles
- Informations professionnelles (cabinet, structure)
- PrÃ©fÃ©rences de notification

#### 3.2.2 Dashboard client

**Vue d'ensemble :**
- Liste des dossiers en cours
- Statuts visuels clairs (En attente, En cours, BloquÃ©, RÃ©solu, ValidÃ©)
- Notifications importantes
- AccÃ¨s rapide aux actions prioritaires

**DÃ©tail d'un dossier :**
- Informations du dossier (rÃ©fÃ©rence, type, date)
- Timeline dÃ©taillÃ©e des actions
- Statut actuel avec explication
- Historique des Ã©changes
- Documents liÃ©s

#### 3.2.3 Upload de documents

**SpÃ©cifications :**
- Upload PDF (taille max : 10 MB par fichier)
- Upload multiple possible
- PrÃ©visualisation des documents uploadÃ©s
- Organisation par dossier
- SÃ©curisation et chiffrement des fichiers

**Types de documents acceptÃ©s :**
- Kbis rejetÃ©s
- Statuts de sociÃ©tÃ©
- PV d'assemblÃ©e
- Justificatifs d'identitÃ©
- Autres documents administratifs

#### 3.2.4 SystÃ¨me de chat

**FonctionnalitÃ©s :**
- Chat en temps rÃ©el avec l'Ã©quipe Formelio
- PiÃ¨ces jointes dans le chat
- Historique des conversations par dossier
- Notifications de nouveaux messages
- Indication de lecture/typing
- Interface responsive (desktop et mobile)

**ConsidÃ©rations techniques :**
- Utilisation de Supabase Realtime pour le chat
- Stockage des messages et fichiers sÃ©curisÃ©
- ConformitÃ© RGPD pour les donnÃ©es Ã©changÃ©es

### 3.3 PHASE 3 - Paiement et facturation

#### 3.3.1 SystÃ¨me de paiement

**IntÃ©gration :**
- Solution de paiement (Stripe recommandÃ© via le boilerplate)
- Paiements sÃ©curisÃ©s par carte bancaire
- PossibilitÃ© de virement bancaire pour montants importants
- Devis avant paiement pour les cas complexes

**ModÃ¨le tarifaire :**
- Tarification Ã  dÃ©finir selon complexitÃ©
- PossibilitÃ© d'acompte + solde
- Facturation sur devis pour cas exceptionnels

#### 3.3.2 GÃ©nÃ©ration de factures

**FonctionnalitÃ©s :**
- GÃ©nÃ©ration automatique de factures conformes (mentions lÃ©gales franÃ§aises)
- NumÃ©rotation automatique
- TÃ©lÃ©chargement PDF
- Envoi par email
- Historique des factures dans le dashboard

**Informations facture :**
- NumÃ©ro de facture
- Date d'Ã©mission
- CoordonnÃ©es Formelio (SIREN/SIRET Ã  obtenir)
- CoordonnÃ©es client
- DÃ©tail des prestations
- Montant HT/TTC
- TVA applicable
- Mentions lÃ©gales obligatoires

#### 3.3.3 Historique des transactions

**Vue client :**
- Liste de toutes les transactions
- Statut (PayÃ©, En attente, RemboursÃ©)
- Montants
- Dates
- Factures associÃ©es tÃ©lÃ©chargeables

---

## 4. SPÃ‰CIFICATIONS TECHNIQUES

### 4.1 Architecture technique

```
Frontend (Next.js)
â”œâ”€â”€ App Router (Next.js 13+)
â”œâ”€â”€ Pages
â”‚   â”œâ”€â”€ Landing page (/)
â”‚   â”œâ”€â”€ Ã€ propos (/a-propos)
â”‚   â”œâ”€â”€ Contact (/contact)
â”‚   â”œâ”€â”€ Legal (/mentions-legales, /confidentialite, /cgu)
â”‚   â”œâ”€â”€ Auth (/login, /register, /reset-password)
â”‚   â””â”€â”€ Dashboard (/dashboard/*)
â”œâ”€â”€ Components (Shadcn UI + custom)
â””â”€â”€ Styles (Tailwind CSS)

Backend (Supabase)
â”œâ”€â”€ Authentication (Supabase Auth)
â”œâ”€â”€ Database (PostgreSQL)
â”‚   â”œâ”€â”€ Users
â”‚   â”œâ”€â”€ Cases (dossiers)
â”‚   â”œâ”€â”€ Documents
â”‚   â”œâ”€â”€ Messages
â”‚   â”œâ”€â”€ Transactions
â”‚   â””â”€â”€ Invoices
â”œâ”€â”€ Storage (documents & files)
â””â”€â”€ Realtime (chat)

Paiements
â””â”€â”€ Stripe Integration
```

### 4.2 Base de donnÃ©es (schÃ©ma prÃ©liminaire)

#### Table : `users`
- id (UUID, PK)
- email (unique)
- full_name
- profession (enum)
- company_name
- phone
- created_at
- updated_at

#### Table : `cases`
- id (UUID, PK)
- user_id (FK â†’ users)
- reference (unique, auto-generated)
- title
- description
- type (enum: rejected, complex, audit)
- status (enum: pending, in_progress, blocked, resolved, validated)
- created_at
- updated_at
- closed_at

#### Table : `documents`
- id (UUID, PK)
- case_id (FK â†’ cases)
- user_id (FK â†’ users)
- filename
- file_path (Supabase Storage)
- file_size
- mime_type
- uploaded_at

#### Table : `messages`
- id (UUID, PK)
- case_id (FK â†’ cases)
- sender_id (FK â†’ users)
- content
- has_attachment
- created_at
- read_at

#### Table : `transactions`
- id (UUID, PK)
- case_id (FK â†’ cases)
- user_id (FK â†’ users)
- amount
- status (enum: pending, paid, refunded)
- payment_method
- stripe_payment_id
- created_at

#### Table : `invoices`
- id (UUID, PK)
- transaction_id (FK â†’ transactions)
- invoice_number (unique)
- pdf_path
- issued_at

### 4.3 SÃ©curitÃ© et conformitÃ©

#### SÃ©curitÃ©
- HTTPS obligatoire (SSL/TLS)
- Authentification JWT via Supabase
- Row Level Security (RLS) sur toutes les tables Supabase
- Validation et sanitization des inputs
- Rate limiting sur API
- Chiffrement des documents sensibles au repos
- Logs d'accÃ¨s et d'actions

#### ConformitÃ© RGPD
- Consentement explicite pour traitement des donnÃ©es
- Droit d'accÃ¨s aux donnÃ©es personnelles
- Droit de rectification
- Droit Ã  l'effacement
- PortabilitÃ© des donnÃ©es
- Politique de confidentialitÃ© claire
- DPO (Data Protection Officer) - Ã  dÃ©finir selon taille
- HÃ©bergement des donnÃ©es en Europe (Supabase EU region)

**Note importante :** Compte tenu de la nature confidentielle des donnÃ©es juridiques, la conformitÃ© RGPD est CRITIQUE. Tous les documents clients doivent Ãªtre traitÃ©s avec le plus haut niveau de sÃ©curitÃ©.

### 4.4 Performance et optimisation

- Next.js App Router pour optimisation SEO
- Images optimisÃ©es (next/image)
- Lazy loading des composants
- Code splitting automatique
- Caching stratÃ©gique
- CDN pour assets statiques
- Compression Gzip/Brotli

### 4.5 Responsive Design

- Mobile-first approach
- Breakpoints Tailwind standards :
  * sm: 640px
  * md: 768px
  * lg: 1024px
  * xl: 1280px
  * 2xl: 1536px
- Tests sur devices principaux (iOS Safari, Android Chrome, Desktop)

---

## 5. DESIGN ET IDENTITÃ‰ VISUELLE

### 5.1 Charte graphique

**Logo :** Formelio avec double chevron (>>)  
**Tagline :** "Votre temps, notre prioritÃ©"

**Typographies :**
- **Titres :** Poppins (Bold, SemiBold)
- **Corps de texte :** Inter (Regular, Medium)

**Palette de couleurs :**
BasÃ©e sur le logo actuel (bleus) :
- **Primaire :** Bleu Formelio (#2E5F7E - Ã  valider selon logo exact)
- **Secondaire :** Bleu clair (#4A90B5 - Ã  valider)
- **Accent :** Ã€ dÃ©finir (orange/vert pour CTA ?)
- **Neutres :** Gris (Ã©chelle de gris pour textes et backgrounds)
- **SuccÃ¨s :** Vert (#10B981)
- **Erreur :** Rouge (#EF4444)
- **Warning :** Orange (#F59E0B)

### 5.2 Composants UI (Shadcn UI)

**Composants principaux Ã  utiliser :**
- Button (primary, secondary, outline, ghost)
- Card (pour affichage dossiers)
- Form (inputs, select, textarea)
- Dialog/Modal
- Alert/Toast (notifications)
- Badge (statuts)
- Progress (avancement dossiers)
- Tabs
- Dropdown Menu
- Avatar

### 5.3 Tone of Voice

**Principes de rÃ©daction :**
- **Professionnel mais accessible** : on s'adresse Ã  des experts
- **Rassurant** : on met en avant l'expertise et la capacitÃ© Ã  rÃ©soudre
- **Direct** : pas de jargon inutile, aller Ã  l'essentiel
- **Expert** : dÃ©montrer la connaissance technique sans Ãªtre pÃ©dant
- **OrientÃ© solution** : focus sur le dÃ©blocage et la rÃ©solution

**Exemples de messages :**
- âŒ "Nous sommes experts en formalitÃ©s"
- âœ… "Nous dÃ©bloquons les dossiers que les autres services rejettent"

- âŒ "Service de qualitÃ©"
- âœ… "Anciens du greffe RCS, nous connaissons les rouages administratifs de l'intÃ©rieur"

---

## 6. CONTENUS ET MESSAGING

### 6.1 Messages clÃ©s de la marque

**Positionnement :**
"Formelio rÃ©sout les problÃ¨mes administratifs complexes que les autres services ne peuvent pas traiter. Notre expertise insider du systÃ¨me des greffes franÃ§ais nous permet de dÃ©bloquer les situations les plus compliquÃ©es."

**Propositions de valeur :**
1. **Expertise unique** : ExpÃ©rience directe au greffe du tribunal de commerce
2. **Communication privilÃ©giÃ©e** : Contact direct avec les registres
3. **RÃ©solution avant soumission** : On identifie et corrige les problÃ¨mes en amont
4. **Connaissance des divergences** : MaÃ®trise des incohÃ©rences entre RNE, RCS et INSEE

### 6.2 Contenu de la landing page (propositions)

#### Hero
**Titre :** "Votre dossier est bloquÃ© ? Nous le dÃ©bloquerons."  
**Sous-titre :** "Service spÃ©cialisÃ© dans les formalitÃ©s juridiques complexes et les dossiers rejetÃ©s. Expertise insider des greffes franÃ§ais."  
**CTA :** "DÃ©bloquer mon dossier" | "En savoir plus"

#### Section problÃ¨mes/solutions
**Titre :** "Les situations que nous rÃ©solvons"

- Dossier rejetÃ© par le greffe sans explication claire
- IncohÃ©rences entre RNE, RCS et INSEE
- FormalitÃ©s complexes (restructurations, cas atypiques)
- Blocages administratifs incomprÃ©hensibles
- DÃ©lais qui s'Ã©ternisent

#### Section expertise
**Titre :** "Pourquoi Formelio rÃ©ussit lÃ  oÃ¹ d'autres Ã©chouent"

- ðŸŽ“ Formation juridique spÃ©cialisÃ©e (UniversitÃ© de Montpellier)
- ðŸ›ï¸ ExpÃ©rience au sein du greffe du tribunal de commerce (service RCS)
- ðŸ” Connaissance approfondie des causes de rejet
- ðŸ¤ Relations directes avec les registres
- âš¡ RÃ©solution des problÃ¨mes AVANT soumission

---

## 7. PLANNING ET LIVRABLES

### 7.1 Phases de dÃ©veloppement

| Phase | DurÃ©e estimÃ©e | Livrables |
|-------|--------------|-----------|
| **Phase 1** | 3-4 semaines | Site vitrine complet + pages lÃ©gales |
| **Phase 2** | 4-6 semaines | Authentification + Dashboard + Upload + Chat |
| **Phase 3** | 2-3 semaines | Paiement + Facturation |
| **Tests & Recette** | 1-2 semaines | Site validÃ© et dÃ©ployÃ© |

### 7.2 MÃ©thodologie

- DÃ©veloppement itÃ©ratif par phase
- Validation client Ã  la fin de chaque phase
- Tests utilisateurs sur groupe restreint
- DÃ©ploiement progressif (staging â†’ production)

---

## 8. HÃ‰BERGEMENT ET DÃ‰PLOIEMENT

### 8.1 Infrastructure

**HÃ©bergement Frontend :**
- Vercel (recommandÃ© pour Next.js) ou Netlify
- RÃ©gion : Europe (France/Allemagne de prÃ©fÃ©rence)

**Backend et Base de donnÃ©es :**
- Supabase (rÃ©gion EU)

**DNS et domaine :**
- Nom de domaine : formelio.fr (Ã  vÃ©rifier disponibilitÃ©)
- Configuration DNS optimale pour performance

### 8.2 Environnements

- **Development** : Local + Supabase dev project
- **Staging** : Preview deployments (Vercel)
- **Production** : Domaine principal formelio.fr

---

## 9. MAINTENANCE ET Ã‰VOLUTIONS

### 9.1 Maintenance

**Maintenance technique :**
- Mises Ã  jour de sÃ©curitÃ© (dÃ©pendances npm)
- Monitoring des performances
- Sauvegarde rÃ©guliÃ¨re de la base de donnÃ©es
- Logs et analyse des erreurs

**Maintenance contenu :**
- Mise Ã  jour des contenus lÃ©gaux si nÃ©cessaire
- Ajout de tÃ©moignages clients
- Actualisation des informations

### 9.2 Ã‰volutions futures possibles

**Post-MVP (aprÃ¨s Phase 3) :**
- Module de prise de rendez-vous en ligne
- SystÃ¨me de tickets/helpdesk plus avancÃ©
- IntÃ©gration API avec logiciels de comptabilitÃ©
- Espace partenaires (pour prescripteurs)
- Blog/ressources juridiques
- Formation en ligne pour prÃ©venir les rejets
- Application mobile (iOS/Android)
- Chatbot IA pour qualification des demandes

---

## 10. CONTRAINTES ET RISQUES

### 10.1 Contraintes

**RÃ©glementaires :**
- ConformitÃ© RGPD stricte (donnÃ©es sensibles juridiques)
- Secret professionnel applicable aux professions juridiques
- Mentions lÃ©gales obligatoires pour services juridiques
- TVA applicable selon services rendus

**Techniques :**
- CompatibilitÃ© navigateurs (Chrome, Firefox, Safari, Edge)
- Performance mobile (3G minimum)
- AccessibilitÃ© (WCAG 2.1 niveau AA minimum)

**BudgÃ©taires :**
- Approche MVP pour maÃ®triser les coÃ»ts initiaux
- Solutions open-source privilÃ©giÃ©es
- Scaling progressif de l'infrastructure

### 10.2 Risques identifiÃ©s

| Risque | Impact | ProbabilitÃ© | Mitigation |
|--------|--------|-------------|------------|
| Non-conformitÃ© RGPD | Ã‰levÃ© | Moyen | Audit RGPD dÃ¨s Phase 1, conseils juridiques |
| ProblÃ¨mes de performance | Moyen | Faible | Tests de charge, optimisation continue |
| Faille de sÃ©curitÃ© | Ã‰levÃ© | Faible | Audit sÃ©curitÃ©, best practices, updates rÃ©guliÃ¨res |
| ComplexitÃ© fonctionnelle | Moyen | Moyen | Approche MVP, dÃ©veloppement par phases |
| Adoption utilisateurs | Moyen | Moyen | Tests utilisateurs, feedback itÃ©ratif |

---

## 11. BUDGET PRÃ‰VISIONNEL

### 11.1 CoÃ»ts de dÃ©veloppement (estimatifs)

| Poste | CoÃ»t estimÃ© |
|-------|-------------|
| DÃ©veloppement Phase 1 | Variable selon dev interne/externe |
| DÃ©veloppement Phase 2 | Variable selon dev interne/externe |
| DÃ©veloppement Phase 3 | Variable selon dev interne/externe |
| Design UI/UX | Variable selon ressources |
| RÃ©daction de contenus | Variable selon ressources |

### 11.2 CoÃ»ts d'exploitation mensuels (estimatifs)

| Service | CoÃ»t mensuel (dÃ©but) | CoÃ»t mensuel (scale) |
|---------|---------------------|---------------------|
| HÃ©bergement Vercel | 0â‚¬ (Hobby) â†’ 20â‚¬ (Pro) | 20-100â‚¬ |
| Supabase | 0â‚¬ (Free tier) â†’ 25â‚¬/mois | 25-100â‚¬+ |
| Stripe | 0â‚¬ fixe + % transactions | % transactions |
| Nom de domaine | ~1-2â‚¬/mois | ~1-2â‚¬/mois |
| Email transactionnel | 0-10â‚¬ (selon volume) | 10-50â‚¬ |
| **Total estimÃ©** | **0-50â‚¬/mois** (dÃ©but) | **50-250â‚¬/mois** (scale) |

**Note :** Les coÃ»ts rÃ©els dÃ©pendront du volume d'utilisation. L'approche choisie permet de dÃ©marrer avec des coÃ»ts quasi-nuls et de scaler progressivement.

---

## 12. CRITÃˆRES DE SUCCÃˆS

### 12.1 Indicateurs de performance (KPIs)

**Phase 1 :**
- Taux de rebond < 60%
- Temps moyen sur site > 2 min
- Taux de conversion formulaire contact > 2%
- Score PageSpeed > 80

**Phase 2 :**
- Taux d'inscription utilisateurs
- Taux d'activation (upload 1er document)
- Engagement chat (temps de rÃ©ponse, satisfaction)
- NPS (Net Promoter Score) > 40

**Phase 3 :**
- Taux de conversion payment > 70% (sur devis acceptÃ©s)
- Panier moyen
- Taux de clients rÃ©currents
- CA mensuel

### 12.2 Objectifs business

**Court terme (6 mois) :**
- 50 professionnels inscrits
- 20 dossiers traitÃ©s
- Retours clients positifs (testimonials)

**Moyen terme (12 mois) :**
- 200 professionnels inscrits
- 100 dossiers traitÃ©s
- RentabilitÃ© opÃ©rationnelle
- NotoriÃ©tÃ© dans le rÃ©seau des professionnels du droit

---

## 13. VALIDATION ET CONTACT

### 13.1 Validation du cahier des charges

Ce document doit Ãªtre validÃ© par :
- âœ… Porteur du projet (fondateur Formelio)
- â¬œ Ã‰quipe technique (dÃ©veloppeur lead)
- â¬œ Designer UI/UX (si externe)
- â¬œ Conseil juridique (pour aspects RGPD et lÃ©gaux)

### 13.2 Prochaines Ã©tapes

1. **Validation du CDC** : Revue et ajustements nÃ©cessaires
2. **Wireframes/Mockups** : CrÃ©ation des maquettes UI (Figma)
3. **Setup technique** : Configuration environnements dev
4. **DÃ©veloppement Phase 1** : DÃ©marrage du dÃ©veloppement
5. **ItÃ©rations** : Feedbacks et ajustements

---

## 14. ANNEXES

### 14.1 Glossaire

- **RCS** : Registre du Commerce et des SociÃ©tÃ©s
- **RNE** : RÃ©pertoire National des Entreprises
- **INSEE** : Institut National de la Statistique et des Ã‰tudes Ã‰conomiques
- **Kbis** : Extrait d'immatriculation d'une entreprise
- **RGPD** : RÃ¨glement GÃ©nÃ©ral sur la Protection des DonnÃ©es
- **MVP** : Minimum Viable Product
- **CTA** : Call To Action

### 14.2 RÃ©fÃ©rences et inspiration

**Concurrents/Services similaires :**
(Ã€ complÃ©ter selon benchmarking)

**Technologies/Documentation :**
- Next.js : https://nextjs.org/
- Supabase : https://supabase.com/
- Shadcn UI : https://ui.shadcn.com/
- Tailwind CSS : https://tailwindcss.com/

---

**Document Ã©tabli le Octobre 2025**  
**Version 1.0 - Document de travail**
