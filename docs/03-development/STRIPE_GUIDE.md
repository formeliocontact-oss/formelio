# Guide Stripe Complet - Formelio

**Version** : 2.0 (Consolidé)
**Date** : Octobre 2025
**Projet** : Formelio - Intégration complète des paiements Stripe

> 📚 **Ce guide consolide** : STRIPE_INTEGRATION_GUIDE.md + PAYMENTS_ARCHITECTURE.md + STRIPE_RULES.md

---

## 📋 Table des matières

1. [Vue d'ensemble](#1-vue-densemble)
2. [Configuration Initiale](#2-configuration-initiale)
3. [Architecture Database](#3-architecture-database)
4. [Payment Flow Implementation](#4-payment-flow-implementation)
5. [Webhooks & Synchronization](#5-webhooks--synchronization)
6. [Invoice Generation](#6-invoice-generation)
7. [Customer Portal](#7-customer-portal)
8. [Sécurité](#8-sécurité)
9. [Testing Stripe](#9-testing-stripe)
10. [Troubleshooting](#10-troubleshooting)
11. [Ressources Externes](#11-ressources-externes)

---

## 1. Vue d'ensemble

### 1.1 Principes architecturaux

1. **Source de vérité unique** : Stripe est la source de vérité pour les paiements
2. **Synchronisation événementielle** : Webhooks Stripe → mise à jour Supabase
3. **Idempotence** : Toutes les opérations sont idempotentes (retry-safe)
4. **Auditabilité** : Logs complets de toutes les transactions
5. **Sécurité** : RLS sur toutes les tables, validation stricte

### 1.2 Fonctionnalités couvertes

- ✅ Paiements one-time pour les dossiers juridiques
- ✅ Génération automatique de factures PDF
- ✅ Gestion des webhooks pour la synchronisation
- ✅ Customer Portal pour gestion self-service
- ✅ Support des méthodes de paiement modernes (Apple Pay, Google Pay)
- ✅ Gestion des remboursements
- ✅ Monitoring et alertes

### 1.3 Stack utilisée

- **Stripe SDK** : `stripe` (Node.js) + `@stripe/stripe-js` (client)
- **API Version** : `2024-11-20` (fixe pour stabilité)
- **Backend** : Next.js API Routes + Supabase
- **Database** : Supabase PostgreSQL avec RLS

### 1.4 Diagramme d'architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT                              │
│  (Next.js Frontend - React Components)                      │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ 1. Initier paiement
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    NEXT.JS API ROUTES                       │
│  - /api/create-checkout-session                             │
│  - /api/create-portal-session                               │
│  - /api/webhooks/stripe                                     │
└─────────────────┬───────────────────────────────────────────┘
                  │
         ┌────────┴─────────┐
         │                  │
         ▼                  ▼
┌─────────────────┐  ┌──────────────────┐
│     STRIPE      │  │    SUPABASE      │
│  - Checkout     │  │  - Transactions  │
│  - Webhooks     │  │  - Invoices      │
│  - Portal       │  │  - Cases         │
└─────────────────┘  └──────────────────┘
         │                  ▲
         │                  │
         └──────────────────┘
            3. Webhook sync
```

---

## 2. Configuration Initiale

### 2.1 Installation des packages

```bash
npm install stripe @stripe/stripe-js
npm install -D @types/stripe
```

### 2.2 Variables d'environnement

#### Développement (Test Mode)

```bash
# .env.local
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_test_xxxxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### Production

```bash
# Vercel Environment Variables
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
NEXT_PUBLIC_APP_URL=https://formelio.fr
```

⚠️ **IMPORTANT** :
- Ne JAMAIS commiter les clés Stripe dans Git
- Ajouter `.env.local` au `.gitignore`
- Utiliser Vercel Environment Variables pour la production

### 2.3 Initialisation Stripe

#### Client Stripe (Browser)

```typescript
// lib/stripe/client.ts
import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
    );
  }
  return stripePromise;
};
```

#### Serveur Stripe (Server-side)

```typescript
// lib/stripe/server.ts
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20', // ✅ Version fixe pour stabilité
  typescript: true,
});
```

#### Configuration centralisée

```typescript
// lib/stripe/config.ts
export const stripeConfig = {
  isTestMode: process.env.NODE_ENV !== 'production',
  publicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  secretKey: process.env.STRIPE_SECRET_KEY!,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,

  // URLs selon l'environnement
  baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',

  // Montants minimum/maximum
  minAmount: 100, // 1€ en centimes
  maxAmount: 100000, // 1000€ en centimes
};

// Validation au démarrage
if (!stripeConfig.publicKey || !stripeConfig.secretKey) {
  throw new Error('Missing Stripe configuration. Check .env.local');
}
```

### 2.4 Webhooks par environnement

| Environnement | Endpoint Webhook | Configuration |
|---------------|------------------|---------------|
| **Local** | `http://localhost:3000/api/webhooks/stripe` | Stripe CLI forward |
| **Preview (Vercel)** | `https://preview-xxx.vercel.app/api/webhooks/stripe` | Webhook endpoint dédié |
| **Production** | `https://formelio.fr/api/webhooks/stripe` | Webhook endpoint principal |

#### Setup local avec Stripe CLI

```bash
# Installation Stripe CLI
# https://stripe.com/docs/stripe-cli

# Login Stripe
stripe login

# Forward webhooks vers localhost
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Copier le webhook secret affiché dans .env.local
```

---

## 3. Architecture Database

### 3.1 Table : `transactions`

```sql
-- Table principale pour les transactions
CREATE TABLE transactions (
  -- Identifiants
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE RESTRICT,

  -- Stripe IDs
  stripe_session_id TEXT UNIQUE, -- Checkout Session ID
  stripe_payment_intent_id TEXT UNIQUE, -- PaymentIntent ID
  stripe_charge_id TEXT, -- Charge ID (pour remboursements)

  -- Montants (en centimes)
  amount INTEGER NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'eur',
  refund_amount INTEGER DEFAULT 0 CHECK (refund_amount >= 0),

  -- Statuts
  status TEXT NOT NULL DEFAULT 'pending',
    CHECK (status IN ('pending', 'processing', 'paid', 'failed', 'refunded', 'partially_refunded')),
  payment_status TEXT,
    CHECK (payment_status IN ('paid', 'unpaid', 'canceled', 'refunded')),

  -- Métadonnées
  description TEXT,
  error_message TEXT,

  -- Dates
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ,

  -- Audit
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Index pour performance
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_case_id ON transactions(case_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_stripe_session_id ON transactions(stripe_session_id);
CREATE INDEX idx_transactions_stripe_payment_intent_id ON transactions(stripe_payment_intent_id);

-- Trigger pour updated_at
CREATE TRIGGER set_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Policy : Les utilisateurs ne voient que leurs propres transactions
CREATE POLICY "Users can view their own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

-- Policy : Admin peut tout voir (optionnel)
CREATE POLICY "Admins can view all transactions"
  ON transactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### 3.2 Table : `invoices`

```sql
-- Table pour les factures générées
CREATE TABLE invoices (
  -- Identifiants
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE NOT NULL, -- Format: INV-2025-0001
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE RESTRICT,

  -- Informations client
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_address JSONB, -- { line1, line2, city, postal_code, country }
  customer_siret TEXT, -- Pour professionnels français

  -- Montants
  subtotal INTEGER NOT NULL, -- HT en centimes
  tax_rate DECIMAL(5, 2) NOT NULL DEFAULT 20.00, -- TVA 20%
  tax_amount INTEGER NOT NULL, -- Montant TVA en centimes
  total INTEGER NOT NULL, -- TTC en centimes
  currency TEXT NOT NULL DEFAULT 'eur',

  -- Détails de la facture
  items JSONB NOT NULL, -- Array d'items facturés
  /*
  Exemple:
  [
    {
      "description": "Dossier rejeté - Modification statuts",
      "quantity": 1,
      "unit_price": 15000,
      "amount": 15000
    }
  ]
  */

  -- Fichier PDF
  pdf_url TEXT, -- URL Supabase Storage
  pdf_path TEXT, -- Chemin dans Storage

  -- Statuts
  status TEXT NOT NULL DEFAULT 'draft',
    CHECK (status IN ('draft', 'sent', 'paid', 'canceled')),

  -- Dates
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  paid_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Métadonnées
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Index
CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_invoices_transaction_id ON invoices(transaction_id);
CREATE INDEX idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX idx_invoices_status ON invoices(status);

-- Trigger updated_at
CREATE TRIGGER set_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own invoices"
  ON invoices FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all invoices"
  ON invoices FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### 3.3 Table : `webhook_events` (idempotence)

```sql
-- Table de log des webhooks
CREATE TABLE webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  error_message TEXT
);

CREATE INDEX idx_webhook_events_stripe_event_id ON webhook_events(stripe_event_id);
CREATE INDEX idx_webhook_events_event_type ON webhook_events(event_type);
```

### 3.4 Extensions aux tables existantes

```sql
-- Ajouter colonne Stripe Customer ID à profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE;

CREATE INDEX idx_profiles_stripe_customer_id ON profiles(stripe_customer_id);

-- Ajouter colonnes de paiement à cases
ALTER TABLE cases
  ADD COLUMN IF NOT EXISTS price INTEGER, -- Prix en centimes
  ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'unpaid'
    CHECK (payment_status IN ('unpaid', 'pending', 'paid', 'refunded'));

CREATE INDEX idx_cases_payment_status ON cases(payment_status);
```

### 3.5 Fonction helper : `update_updated_at_column()`

```sql
-- Fonction pour auto-update du champ updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### 3.6 États et transitions - Transaction

```
                 ┌─────────┐
                 │ pending │ (transaction créée)
                 └────┬────┘
                      │
       ┌──────────────┼──────────────┐
       │                             │
       ▼                             ▼
┌────────────┐              ┌────────────┐
│ processing │              │   failed   │
└──────┬─────┘              └────────────┘
       │
       ▼
┌────────────┐
│    paid    │ (paiement réussi)
└──────┬─────┘
       │
       ├──────────────┐
       │              │
       ▼              ▼
┌──────────────┐  ┌──────────────────────┐
│   refunded   │  │ partially_refunded   │
└──────────────┘  └──────────────────────┘
```

#### Validation des transitions

```sql
CREATE OR REPLACE FUNCTION validate_transaction_status_transition()
RETURNS TRIGGER AS $$
BEGIN
  -- Vérifier que la transition est valide
  IF OLD.status = 'paid' AND NEW.status NOT IN ('paid', 'refunded', 'partially_refunded') THEN
    RAISE EXCEPTION 'Invalid status transition from paid to %', NEW.status;
  END IF;

  IF OLD.status = 'refunded' AND NEW.status != 'refunded' THEN
    RAISE EXCEPTION 'Cannot change status from refunded';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_transaction_status
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION validate_transaction_status_transition();
```

---

## 4. Payment Flow Implementation

### 4.1 Flux complet de paiement

```
Client clique "Payer"
     │
     ▼
API: create-checkout-session
     │
     ├─→ Authentification user
     ├─→ Vérifier ownership case
     ├─→ Récupérer prix from DB
     ├─→ Créer/récupérer Stripe Customer
     ├─→ Créer Checkout Session
     ├─→ Créer transaction 'pending'
     │
     ▼
Client → Stripe Checkout
     │
     ▼
Paiement réussi
     │
     ▼
Webhook: checkout.session.completed
     │
     ├─→ Valider signature
     ├─→ Update transaction → 'paid'
     ├─→ Update case → 'paid'
     ├─→ Générer facture PDF
     └─→ Envoyer email
```

### 4.2 API Route : Créer Checkout Session

```typescript
// app/api/create-checkout-session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import { createClient } from '@/lib/supabase/server';
import { stripeConfig } from '@/lib/stripe/config';

export async function POST(request: NextRequest) {
  const supabase = createClient();

  // 1. Authentification
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Récupérer les données de paiement
  const { caseId, description } = await request.json();

  // 3. Vérifier ownership et récupérer prix
  const { data: caseData, error: caseError } = await supabase
    .from('cases')
    .select('id, title, user_id, price')
    .eq('id', caseId)
    .single();

  if (caseError || caseData.user_id !== user.id) {
    return NextResponse.json(
      { error: 'Case not found or unauthorized' },
      { status: 404 }
    );
  }

  // 4. ✅ CRITIQUE : Utiliser le prix de la DB (pas du client)
  const amount = caseData.price;

  // 5. Validation du montant
  if (!amount || amount < stripeConfig.minAmount || amount > stripeConfig.maxAmount) {
    return NextResponse.json(
      { error: 'Invalid payment amount' },
      { status: 400 }
    );
  }

  try {
    // 6. Créer ou récupérer le Stripe Customer
    let customerId: string;

    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (profile?.stripe_customer_id) {
      customerId = profile.stripe_customer_id;
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id,
        },
      });

      customerId = customer.id;

      // Sauvegarder le customer ID
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);
    }

    // 7. Créer la Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'payment',
      payment_method_types: [
        'card',
        'apple_pay',    // Support Apple Pay
        'google_pay',   // Support Google Pay
      ],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Dossier ${caseData.title}`,
              description: description || 'Traitement de formalités juridiques',
            },
            unit_amount: amount, // En centimes
          },
          quantity: 1,
        },
      ],
      metadata: {
        case_id: caseId,
        user_id: user.id,
      },
      success_url: `${stripeConfig.baseUrl}/dashboard/cases/${caseId}?payment=success`,
      cancel_url: `${stripeConfig.baseUrl}/dashboard/cases/${caseId}?payment=canceled`,
      // Optionnel : Invoice automatique
      invoice_creation: {
        enabled: true,
      },
    });

    // 8. Créer une transaction pending en DB
    await supabase.from('transactions').insert({
      user_id: user.id,
      case_id: caseId,
      stripe_session_id: session.id,
      amount: amount,
      currency: 'eur',
      status: 'pending',
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Payment initialization failed' },
      { status: 500 }
    );
  }
}
```

### 4.3 Composant de paiement côté client

```typescript
// components/payment/checkout-button.tsx
'use client'

import { useState } from 'react';
import { getStripe } from '@/lib/stripe/client';
import { Button } from '@/components/ui/button';

interface CheckoutButtonProps {
  caseId: string;
  amount: number;
  description?: string;
}

export function CheckoutButton({ caseId, amount, description }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);

    try {
      // 1. Créer la session de paiement
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseId, description }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId } = await response.json();

      // 2. Rediriger vers Stripe Checkout
      const stripe = await getStripe();
      const { error } = await stripe!.redirectToCheckout({ sessionId });

      if (error) {
        console.error('Stripe redirect error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Erreur lors du paiement. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={loading}
      size="lg"
      className="w-full"
    >
      {loading ? 'Chargement...' : `Payer ${(amount / 100).toFixed(2)} €`}
    </Button>
  );
}
```

---

## 5. Webhooks & Synchronization

### 5.1 Implémentation sécurisée des webhooks

```typescript
// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import { stripeConfig } from '@/lib/stripe/config';
import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text(); // ✅ text(), pas json()
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    // ✅ CRITIQUE : Vérifier la signature du webhook
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      stripeConfig.webhookSecret
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  const supabase = createClient();

  // ✅ Idempotence : vérifier si déjà traité
  const { data: existing } = await supabase
    .from('webhook_events')
    .select('id')
    .eq('stripe_event_id', event.id)
    .single();

  if (existing) {
    console.log(`Event ${event.id} already processed`);
    return NextResponse.json({ received: true });
  }

  // Gérer les événements
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        // Mettre à jour la transaction
        await supabase
          .from('transactions')
          .update({
            status: 'paid',
            stripe_payment_intent_id: session.payment_intent as string,
            paid_at: new Date().toISOString(),
          })
          .eq('stripe_session_id', session.id);

        // Mettre à jour le statut du dossier
        const caseId = session.metadata?.case_id;
        if (caseId) {
          await supabase
            .from('cases')
            .update({ payment_status: 'paid' })
            .eq('id', caseId);
        }

        // TODO: Générer la facture
        // await generateInvoice(transactionId);

        console.log(`✅ Payment successful for session ${session.id}`);
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        await supabase
          .from('transactions')
          .update({
            status: 'paid',
            paid_at: new Date().toISOString(),
          })
          .eq('stripe_payment_intent_id', paymentIntent.id);

        console.log(`✅ PaymentIntent succeeded: ${paymentIntent.id}`);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        await supabase
          .from('transactions')
          .update({
            status: 'failed',
            error_message: paymentIntent.last_payment_error?.message,
          })
          .eq('stripe_payment_intent_id', paymentIntent.id);

        console.error(`❌ PaymentIntent failed: ${paymentIntent.id}`);
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;

        await supabase
          .from('transactions')
          .update({
            status: 'refunded',
            refunded_at: new Date().toISOString(),
          })
          .eq('stripe_payment_intent_id', charge.payment_intent as string);

        console.log(`🔄 Charge refunded: ${charge.id}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // ✅ Logger comme traité
    await supabase.from('webhook_events').insert({
      stripe_event_id: event.id,
      event_type: event.type,
      payload: event,
      processed_at: new Date().toISOString(),
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);

    // Logger l'erreur
    await supabase.from('webhook_events').insert({
      stripe_event_id: event.id,
      event_type: event.type,
      payload: event,
      error_message: error instanceof Error ? error.message : 'Unknown error',
    });

    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// IMPORTANT: Désactiver le body parsing pour les webhooks
export const config = {
  api: {
    bodyParser: false,
  },
};
```

### 5.2 Événements Stripe à surveiller

| Événement | Description | Action |
|-----------|-------------|--------|
| `checkout.session.completed` | Session de paiement complétée | Marquer transaction comme payée |
| `payment_intent.succeeded` | Paiement réussi | Confirmation paiement |
| `payment_intent.payment_failed` | Paiement échoué | Logger erreur, notifier client |
| `charge.refunded` | Remboursement émis | Mettre à jour statut transaction |
| `customer.subscription.created` | Abonnement créé (si applicable) | Activer abonnement |
| `customer.subscription.deleted` | Abonnement annulé | Désactiver abonnement |

---

## 6. Invoice Generation

### 6.1 Architecture de génération

```
Transaction paid
     │
     ▼
generateInvoice()
     │
     ├─→ Générer numéro facture (INV-2025-0001)
     │
     ├─→ Calculer TVA (20%)
     │
     ├─→ Créer record en DB
     │
     ├─→ Générer PDF
     │
     ├─→ Upload vers Supabase Storage
     │
     └─→ Envoyer email avec facture attachée
```

### 6.2 Fonction principale de génération

```typescript
// lib/invoices/generate.ts
import { createClient } from '@/lib/supabase/server';
import { generateInvoicePDF } from './pdf-generator';
import { sendInvoiceEmail } from './email';

export async function generateInvoice(transactionId: string) {
  const supabase = createClient();

  // 1. Récupérer la transaction
  const { data: transaction, error: txError } = await supabase
    .from('transactions')
    .select(`
      *,
      cases (
        title,
        type,
        user:user_id (
          email,
          profiles (
            company_name,
            siret,
            address
          )
        )
      )
    `)
    .eq('id', transactionId)
    .single();

  if (txError || !transaction) {
    throw new Error('Transaction not found');
  }

  // 2. Générer numéro de facture
  const invoiceNumber = await generateInvoiceNumber();

  // 3. Calculer montants
  const taxRate = 20.0; // TVA 20%
  const subtotal = transaction.amount; // HT
  const taxAmount = Math.round(subtotal * (taxRate / 100));
  const total = subtotal + taxAmount;

  // 4. Créer items
  const items = [
    {
      description: `Dossier ${transaction.cases.title}`,
      quantity: 1,
      unit_price: subtotal,
      amount: subtotal,
    },
  ];

  // 5. Créer facture en DB
  const { data: invoice, error: invError } = await supabase
    .from('invoices')
    .insert({
      invoice_number: invoiceNumber,
      user_id: transaction.user_id,
      transaction_id: transactionId,
      customer_name: transaction.cases.user.profiles.company_name,
      customer_email: transaction.cases.user.email,
      customer_address: transaction.cases.user.profiles.address,
      customer_siret: transaction.cases.user.profiles.siret,
      subtotal,
      tax_rate: taxRate,
      tax_amount: taxAmount,
      total,
      items,
      status: 'paid',
      issue_date: new Date().toISOString().split('T')[0],
      due_date: new Date().toISOString().split('T')[0],
      paid_date: new Date().toISOString().split('T')[0],
    })
    .select()
    .single();

  if (invError || !invoice) {
    throw new Error('Failed to create invoice');
  }

  // 6. Générer PDF
  const pdfBuffer = await generateInvoicePDF(invoice);

  // 7. Upload vers Supabase Storage
  const fileName = `${invoiceNumber}.pdf`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('invoices')
    .upload(`${transaction.user_id}/${fileName}`, pdfBuffer, {
      contentType: 'application/pdf',
      upsert: false,
    });

  if (uploadError) {
    throw new Error('Failed to upload invoice PDF');
  }

  // 8. Mettre à jour facture avec URL PDF
  const { data: { publicUrl } } = supabase.storage
    .from('invoices')
    .getPublicUrl(uploadData.path);

  await supabase
    .from('invoices')
    .update({
      pdf_url: publicUrl,
      pdf_path: uploadData.path,
    })
    .eq('id', invoice.id);

  // 9. Envoyer email avec facture
  await sendInvoiceEmail(transaction.cases.user.email, {
    invoiceNumber,
    pdfUrl: publicUrl,
  });

  return invoice;
}

// Générer numéro de facture séquentiel
async function generateInvoiceNumber(): Promise<string> {
  const supabase = createClient();
  const year = new Date().getFullYear();

  // Récupérer le dernier numéro de l'année
  const { data: lastInvoice } = await supabase
    .from('invoices')
    .select('invoice_number')
    .ilike('invoice_number', `INV-${year}-%`)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  let nextNumber = 1;

  if (lastInvoice) {
    const match = lastInvoice.invoice_number.match(/INV-\d{4}-(\d+)/);
    if (match) {
      nextNumber = parseInt(match[1], 10) + 1;
    }
  }

  // Format: INV-2025-0001
  return `INV-${year}-${nextNumber.toString().padStart(4, '0')}`;
}
```

### 6.3 Génération PDF (exemple simple)

```typescript
// lib/invoices/pdf-generator.ts
import PDFDocument from 'pdfkit';

export async function generateInvoicePDF(invoice: Invoice): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // En-tête
    doc
      .fontSize(20)
      .text('FACTURE', 50, 50, { align: 'right' })
      .fontSize(10)
      .text(`N° ${invoice.invoice_number}`, { align: 'right' })
      .text(`Date: ${invoice.issue_date}`, { align: 'right' });

    // Informations Formelio
    doc
      .fontSize(12)
      .text('Formelio', 50, 120)
      .fontSize(10)
      .text('Adresse de votre entreprise')
      .text('SIRET: XXXXX')
      .text('TVA: FRXXXXX');

    // Informations client
    doc
      .fontSize(12)
      .text('Facturé à:', 300, 120)
      .fontSize(10)
      .text(invoice.customer_name, 300, 140)
      .text(invoice.customer_email)
      .text(`SIRET: ${invoice.customer_siret || 'N/A'}`);

    // Ligne
    doc.moveTo(50, 220).lineTo(550, 220).stroke();

    // Tableau des items
    let yPosition = 250;

    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('Description', 50, yPosition);
    doc.text('Quantité', 300, yPosition);
    doc.text('Prix unitaire', 380, yPosition);
    doc.text('Total HT', 480, yPosition);

    doc.font('Helvetica');
    yPosition += 20;

    invoice.items.forEach((item: any) => {
      doc.text(item.description, 50, yPosition);
      doc.text(item.quantity.toString(), 300, yPosition);
      doc.text(`${(item.unit_price / 100).toFixed(2)} €`, 380, yPosition);
      doc.text(`${(item.amount / 100).toFixed(2)} €`, 480, yPosition);
      yPosition += 20;
    });

    // Totaux
    yPosition += 20;
    doc.moveTo(50, yPosition).lineTo(550, yPosition).stroke();
    yPosition += 20;

    doc.text('Total HT:', 380, yPosition);
    doc.text(`${(invoice.subtotal / 100).toFixed(2)} €`, 480, yPosition);
    yPosition += 20;

    doc.text(`TVA (${invoice.tax_rate}%):`, 380, yPosition);
    doc.text(`${(invoice.tax_amount / 100).toFixed(2)} €`, 480, yPosition);
    yPosition += 20;

    doc.font('Helvetica-Bold');
    doc.text('Total TTC:', 380, yPosition);
    doc.text(`${(invoice.total / 100).toFixed(2)} €`, 480, yPosition);

    // Footer
    doc
      .fontSize(8)
      .font('Helvetica')
      .text(
        'Merci pour votre confiance - Formelio',
        50,
        700,
        { align: 'center' }
      );

    doc.end();
  });
}
```

---

## 7. Customer Portal

### 7.1 Configuration Dashboard Stripe

1. Aller sur [Dashboard Stripe → Settings → Customer Portal](https://dashboard.stripe.com/settings/billing/portal)
2. Activer les fonctionnalités :
   - ✅ Télécharger les factures
   - ✅ Mettre à jour les moyens de paiement
   - ✅ Voir l'historique des paiements
3. Configurer le branding :
   - Logo Formelio
   - Couleurs primaires (#2E5F7E)

### 7.2 API Route : Créer Portal Session

```typescript
// app/api/create-portal-session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import { createClient } from '@/lib/supabase/server';
import { stripeConfig } from '@/lib/stripe/config';

export async function POST(request: NextRequest) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Récupérer le Stripe Customer ID
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (!profile?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'No payment history found' },
        { status: 404 }
      );
    }

    // Créer la session Portal
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${stripeConfig.baseUrl}/dashboard/billing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Portal session error:', error);
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    );
  }
}
```

### 7.3 Bouton d'accès au portail

```typescript
// components/billing/portal-button.tsx
'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

export function CustomerPortalButton() {
  const [loading, setLoading] = useState(false);

  const handlePortal = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to create portal session');

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Portal error:', error);
      alert('Erreur lors de l\'accès au portail de facturation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePortal}
      disabled={loading}
      variant="outline"
    >
      <ExternalLink className="mr-2 h-4 w-4" />
      {loading ? 'Chargement...' : 'Gérer mes paiements'}
    </Button>
  );
}
```

---

## 8. Sécurité

### 8.1 ⚠️ Règles critiques (INTERDICTIONS ABSOLUES)

```typescript
// ❌ JAMAIS commiter les clés Stripe dans le code
const apiKey = 'sk_live_xxxxx'; // ❌ DANGER - Fuite de sécurité

// ✅ TOUJOURS utiliser les variables d'environnement
const apiKey = process.env.STRIPE_SECRET_KEY; // ✅

// ❌ JAMAIS exposer la clé secrète côté client
// components/checkout.tsx
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // ❌ DANGER

// ✅ TOUJOURS séparer client/server Stripe
// lib/stripe/client.ts (Browser)
import { loadStripe } from '@stripe/stripe-js';
export const getStripe = () => loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// lib/stripe/server.ts (Server only)
import Stripe from 'stripe';
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// ❌ JAMAIS faire confiance aux montants côté client
const amount = request.body.amount; // ❌ Peut être manipulé

// ✅ TOUJOURS recalculer les montants côté serveur
const { data: caseData } = await supabase.from('cases').select('price').eq('id', caseId).single();
const amount = caseData.price; // ✅ Source de vérité

// ❌ JAMAIS skip la validation de signature webhook
const event = JSON.parse(request.body); // ❌ DANGER - Peut être falsifié

// ✅ TOUJOURS valider la signature webhook
const signature = headers().get('stripe-signature');
const event = stripe.webhooks.constructEvent(body, signature!, webhookSecret); // ✅
```

### 8.2 Checklist sécurité complète

#### Avant tout développement

- [ ] ✅ Clés Stripe dans `.env.local` (jamais dans le code)
- [ ] ✅ `.env.local` dans `.gitignore`
- [ ] ✅ API version fixée à `2024-11-20`
- [ ] ✅ Séparation client.ts / server.ts
- [ ] ✅ Validation de configuration au démarrage

#### Avant chaque commit

- [ ] ✅ Aucune clé Stripe en dur dans le code
- [ ] ✅ Validation de signature webhook présente
- [ ] ✅ Montants recalculés côté serveur (pas de confiance client)
- [ ] ✅ Vérification user_id pour authorization
- [ ] ✅ Gestion d'erreurs complète
- [ ] ✅ Logs sans exposer les clés secrètes

#### Avant la production

- [ ] ✅ Clés Live configurées dans Vercel
- [ ] ✅ Webhooks Production configurés dans Dashboard Stripe
- [ ] ✅ HTTPS activé (obligatoire pour webhooks)
- [ ] ✅ Table `webhook_events` créée (idempotence)
- [ ] ✅ RLS activé sur table `transactions`
- [ ] ✅ Tests E2E paiements réussis
- [ ] ✅ Customer Portal configuré et brandé

### 8.3 Gestion des erreurs Stripe

```typescript
// lib/stripe/error-handler.ts
import Stripe from 'stripe';

export function handleStripeError(error: unknown): string {
  if (error instanceof Stripe.errors.StripeCardError) {
    return error.message; // Carte refusée, fonds insuffisants
  }

  if (error instanceof Stripe.errors.StripeRateLimitError) {
    return 'Service temporairement indisponible. Veuillez réessayer.';
  }

  if (error instanceof Stripe.errors.StripeInvalidRequestError) {
    console.error('Invalid Stripe request:', error);
    return 'Erreur de configuration du paiement.';
  }

  if (error instanceof Stripe.errors.StripeAPIError) {
    console.error('Stripe API error:', error);
    return 'Erreur du service de paiement. Veuillez réessayer.';
  }

  if (error instanceof Stripe.errors.StripeConnectionError) {
    return 'Problème de connexion. Vérifiez votre connexion internet.';
  }

  console.error('Unknown Stripe error:', error);
  return 'Une erreur est survenue. Veuillez réessayer.';
}
```

---

## 9. Testing Stripe

### 9.1 Cartes de test Stripe

| Carte | Numéro | Comportement |
|-------|--------|--------------|
| **Visa réussie** | `4242 4242 4242 4242` | Paiement réussit toujours |
| **Mastercard réussie** | `5555 5555 5555 4444` | Paiement réussit toujours |
| **Carte refusée** | `4000 0000 0000 0002` | Paiement décliné |
| **Fonds insuffisants** | `4000 0000 0000 9995` | Insuffisance fonds |
| **3D Secure requis** | `4000 0025 0000 3155` | Demande authentification |

### 9.2 Tester en local avec Stripe CLI

```bash
# 1. Login Stripe
stripe login

# 2. Forward webhooks vers localhost
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# 3. Copier webhook secret affiché
# whsec_xxxxx

# 4. Tester un webhook manuellement
stripe trigger payment_intent.succeeded
```

### 9.3 Tests E2E recommandés

```typescript
// tests/e2e/payment.spec.ts (Playwright)
import { test, expect } from '@playwright/test';

test('Complete payment flow', async ({ page }) => {
  // 1. Login
  await page.goto('/login');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password');
  await page.click('button[type="submit"]');

  // 2. Naviguer vers un dossier
  await page.goto('/dashboard/cases/test-case-id');

  // 3. Cliquer "Payer"
  await page.click('button:has-text("Payer")');

  // 4. Remplir formulaire Stripe (test card)
  await page.fill('input[name="cardNumber"]', '4242 4242 4242 4242');
  await page.fill('input[name="cardExpiry"]', '12/34');
  await page.fill('input[name="cardCvc"]', '123');
  await page.fill('input[name="billingName"]', 'Test User');

  // 5. Soumettre paiement
  await page.click('button:has-text("Pay")');

  // 6. Vérifier redirection vers success
  await expect(page).toHaveURL(/payment=success/);

  // 7. Vérifier transaction en DB
  // ...
});
```

---

## 10. Troubleshooting

### 10.1 Erreurs courantes

#### "Invalid signature" (Webhook)

**Cause** : Signature webhook invalide ou secret incorrect

**Solution** :
```typescript
// Vérifier que le webhook secret est correct
console.log('Webhook secret:', process.env.STRIPE_WEBHOOK_SECRET);

// En local, utiliser Stripe CLI :
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

#### "No such customer"

**Cause** : Stripe Customer ID invalide ou supprimé

**Solution** :
```typescript
// Vérifier que le customer existe
const customer = await stripe.customers.retrieve(customerId);

// Si erreur, recréer un customer
const newCustomer = await stripe.customers.create({
  email: user.email,
  metadata: { supabase_user_id: user.id },
});
```

#### "Amount must be at least $0.50 usd"

**Cause** : Montant trop faible (< 50 centimes)

**Solution** :
```typescript
// Ajouter validation
if (amount < 50) {
  throw new Error('Amount must be at least 0.50 EUR');
}
```

### 10.2 Debug Webhooks

```typescript
// Ajouter logs détaillés
console.log('[Webhook] Event received:', {
  id: event.id,
  type: event.type,
  created: event.created,
});

// Vérifier table webhook_events
const { data: webhooks } = await supabase
  .from('webhook_events')
  .select('*')
  .order('created_at', { ascending: false })
  .limit(10);

console.log('Recent webhooks:', webhooks);
```

### 10.3 Monitoring Production

```typescript
// Dashboard admin : Métriques paiements
export async function getPaymentMetrics(supabase: SupabaseClient) {
  // Total des paiements (30 derniers jours)
  const { data: totalPaid } = await supabase
    .from('transactions')
    .select('amount')
    .eq('status', 'paid')
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

  const revenue = totalPaid?.reduce((sum, t) => sum + t.amount, 0) || 0;

  // Taux de succès
  const { count: totalTransactions } = await supabase
    .from('transactions')
    .select('*', { count: 'exact', head: true });

  const { count: successfulTransactions } = await supabase
    .from('transactions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'paid');

  const successRate = (successfulTransactions! / totalTransactions!) * 100;

  return {
    revenue: revenue / 100, // En euros
    successRate,
    totalTransactions,
  };
}
```

---

## 11. Ressources Externes

### 11.1 Documentation officielle

| Ressource | Lien |
|-----------|------|
| **Stripe API Reference** | [stripe.com/docs/api](https://stripe.com/docs/api) |
| **Supabase Stripe Integration** | [supabase.com/docs/guides/database/extensions/wrappers/stripe](https://supabase.com/docs/guides/database/extensions/wrappers/stripe) |
| **Stripe Checkout** | [stripe.com/docs/payments/checkout](https://stripe.com/docs/payments/checkout) |
| **Stripe Webhooks** | [stripe.com/docs/webhooks](https://stripe.com/docs/webhooks) |
| **Stripe Testing Cards** | [stripe.com/docs/testing](https://stripe.com/docs/testing) |

### 11.2 Exemples de code

| Exemple | Lien |
|---------|------|
| **Next.js Subscription Payments** | [github.com/vercel/nextjs-subscription-payments](https://github.com/vercel/nextjs-subscription-payments) |
| **Next.js SaaS Starter** | [github.com/nextjs/saas-starter](https://github.com/nextjs/saas-starter) |
| **Stripe Samples** | [github.com/stripe-samples](https://github.com/stripe-samples) |

### 11.3 Projets SaaS open-source

| Projet | Stripe Features | Points forts |
|--------|----------------|--------------|
| **Dub.co** | One-time payments, Customer Portal | API moderne, webhooks bien structurés |
| **Cal.com** | Subscriptions, Invoicing | Multi-tenant, gestion complexe billing |
| **Supastarter** | Stripe + Supabase complet | Tests Stripe, webhooks, Customer Portal |

### 11.4 Outils

| Outil | Description |
|-------|-------------|
| **Stripe CLI** | Outil CLI pour tester les webhooks en local |
| **Stripe Dashboard** | Interface de gestion des paiements |

---

## 🔗 Documents liés

- [MIGRATION_GUIDE_2025.md](../MIGRATION_GUIDE_2025.md) - Guide de migration (Section Stripe)
- [CHANGELOG.md](../CHANGELOG.md) - Historique des mises à jour Stripe
- [SUPABASE_RLS_GUIDE.md](SUPABASE_RLS_GUIDE.md) - Sécurisation des données paiements
- [PHASE2_AND_PHASE3_TASKS.md](tasks/PHASE2_AND_PHASE3_TASKS.md) - Tasks P3-01 à P3-07

---

## ✅ Checklist de déploiement

Avant de passer en production :

- [ ] ✅ Toutes les migrations SQL appliquées
- [ ] ✅ RLS activé sur toutes les tables
- [ ] ✅ Indexes créés
- [ ] ✅ Clés Stripe production configurées dans Vercel
- [ ] ✅ Webhooks Stripe pointant vers production
- [ ] ✅ Bucket Supabase Storage `invoices` créé
- [ ] ✅ Tests E2E paiement réussis
- [ ] ✅ Génération PDF factures testée
- [ ] ✅ Emails de confirmation configurés
- [ ] ✅ Monitoring et alertes activés

---

**Version** : 2.0 (Consolidé)
**Dernière mise à jour** : Octobre 2025
**Auteur** : Équipe Formelio

**Fichiers sources fusionnés** :
- STRIPE_INTEGRATION_GUIDE.md (800 lignes)
- PAYMENTS_ARCHITECTURE.md (600 lignes)
- STRIPE_RULES.md (300 lignes)

💙 **Formelio** - Votre temps, notre priorité
