# Mises à jour Stripe - Phase 3

**Date**: Octobre 2025
**Version**: 2.0

Ce fichier contient les mises à jour des tasks Phase 3 pour intégrer les nouvelles pratiques Stripe 2025.

---

## P3-01 - Stripe Integration & Setup (UPDATED)

**ID**: P3-01 | **Phase**: 3 | **Priority**: P0 | **Effort**: 8h (était 6h) | **Status**: TODO
**Branch**: `feature/phase3-payment`

### Documentation
- Guide complet : [STRIPE_INTEGRATION_GUIDE.md](../STRIPE_INTEGRATION_GUIDE.md)
- Architecture : [PAYMENTS_ARCHITECTURE.md](../PAYMENTS_ARCHITECTURE.md)

### Nouveautés 2025
- Support Apple Pay & Google Pay
- Customer Portal Stripe configuré
- API version fixée à 2024-11-20
- Séparation stricte Test/Production

### Acceptance Criteria UPDATED
- [ ] Compte Stripe créé (Test + Production séparés)
- [ ] API keys en env vars (validation au démarrage)
- [ ] Stripe SDK installé (stripe@14.0.0, @stripe/stripe-js@2.4.0)
- [ ] API version fixée à 2024-11-20
- [ ] Webhook endpoint avec validation signature
- [ ] Stripe CLI installé pour dev local
- [ ] Customer Portal configuré (Dashboard Stripe)
- [ ] Apple Pay & Google Pay activés

---

## P3-02 - Payment Flow & Checkout (UPDATED)

**Ajouts nouveaux**:
- Support payment_method_types: ['card', 'apple_pay', 'google_pay']
- Création/récupération Stripe Customer ID
- Idempotency keys pour éviter doublons
- Error handling avec handleStripeError()

---

## P3-08 - Customer Portal (NOUVELLE TASK)

**ID**: P3-08 | **Phase**: 3 | **Priority**: P1 | **Effort**: 4h | **Status**: TODO
**Branch**: `feature/phase3-payment`

### Description
Intégration du Customer Portal Stripe pour gestion self-service des paiements.

### Acceptance Criteria
- [ ] Route API /api/create-portal-session
- [ ] Bouton "Gérer mes paiements" dans dashboard
- [ ] Configuration Portal dans Stripe Dashboard
- [ ] Branding Formelio appliqué
- [ ] Return URL configurée

### Implementation

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

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single();

  if (!profile?.stripe_customer_id) {
    return NextResponse.json({ error: 'No payment history' }, { status: 404 });
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${stripeConfig.baseUrl}/dashboard/billing`,
  });

  return NextResponse.json({ url: session.url });
}
```

---

## Nouvelles ressources Stripe

### Documentation officielle
- Supabase Stripe Integration: https://supabase.com/docs/guides/database/extensions/wrappers/stripe
- Stripe Webhooks: https://supabase.com/docs/guides/functions/examples/stripe-webhooks

### Exemples de référence
- Vercel Next.js Subscription Payments: https://github.com/vercel/nextjs-subscription-payments
- Next.js SaaS Starter (Official): https://github.com/nextjs/saas-starter
- Adrian Hajdin SaaS Template: https://github.com/adrianhajdin/saas-template

### Alternative avancée
- **Supabase Stripe Wrapper** : Extension Postgres pour requêtes SQL sur données Stripe
  - Utilisation : SELECT * FROM stripe_customers WHERE email = 'user@example.com';
  - Quand l'utiliser : Requêtes complexes, éviter duplication données
  - Quand l'éviter : Flow simple de paiement (overhead inutile)

---

## Checklist de migration Phase 3

- [ ] Lire STRIPE_INTEGRATION_GUIDE.md entièrement
- [ ] Lire PAYMENTS_ARCHITECTURE.md pour le schéma DB
- [ ] Créer les migrations SQL (transactions, invoices, webhook_events)
- [ ] Implémenter P3-01 avec nouvelles pratiques
- [ ] Implémenter P3-02 avec Apple/Google Pay
- [ ] Implémenter P3-08 Customer Portal
- [ ] Tester avec Stripe CLI en local
- [ ] Configurer webhooks production

