# Phase 2 & 3 - Tasks complÃ¨tes

---

# PHASE 2: DASHBOARD & AUTHENTICATION (11 tasks, 98h)

## P2-02 - Dashboard Layout & Navigation

**ID**: P2-02 | **Phase**: 2 | **Priority**: P0 | **Effort**: 8h | **Status**: ðŸ”´ TODO  
**Branch**: `feature/phase2-dashboard`

### Description
Layout du dashboard avec sidebar navigation, header user menu, et structure responsive.

### Acceptance Criteria
- [ ] Sidebar avec navigation (Dossiers, Documents, Messages, Profil)
- [ ] Header avec user menu dropdown
- [ ] Mobile: collapsible sidebar
- [ ] Breadcrumbs pour navigation
- [ ] Active states sur liens
- [ ] Protected layout (redirect si non auth)

### Implementation
```typescript
// app/dashboard/layout.tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { DashboardHeader } from '@/components/dashboard/header';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header>
          <DashboardHeader user={user} />
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

// components/dashboard/sidebar.tsx
'use client'

const navItems = [
  { name: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Mes dossiers', href: '/dashboard/cases', icon: Folder },
  { name: 'Documents', href: '/dashboard/documents', icon: FileText },
  { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
  { name: 'Profil', href: '/dashboard/profile', icon: User },
];
```

---

## P2-03 - Cases List & Filters

**ID**: P2-03 | **Phase**: 2 | **Priority**: P0 | **Effort**: 10h | **Status**: ðŸ”´ TODO  
**Branch**: `feature/phase2-dashboard`

### Description
Liste des dossiers avec filtres (statut, type, date), recherche, et pagination.

### Acceptance Criteria
- [ ] Table responsive avec colonnes (rÃ©fÃ©rence, titre, type, statut, date)
- [ ] Filtres: statut (pending, in_progress, resolved), type (rejected, complex)
- [ ] Barre de recherche
- [ ] Pagination (20 items/page)
- [ ] Badge colorÃ© pour chaque statut
- [ ] Click row â†’ navigate to detail

### Implementation
```typescript
// app/dashboard/cases/page.tsx
'use client'

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import type { Case } from '@/types/database';

export default function CasesPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCases();
  }, [statusFilter, search]);

  async function fetchCases() {
    const supabase = createClient();
    let query = supabase.from('cases').select('*').order('created_at', { ascending: false });

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    if (search) {
      query = query.or(`reference.ilike.%${search}%,title.ilike.%${search}%`);
    }

    const { data } = await query;
    setCases(data || []);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Mes dossiers</h1>
      
      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          {/* Status options */}
        </Select>
        <Input 
          placeholder="Rechercher..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Cases table */}
      <div className="border rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th>RÃ©fÃ©rence</th>
              <th>Titre</th>
              <th>Type</th>
              <th>Statut</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((c) => (
              <tr key={c.id} className="cursor-pointer hover:bg-gray-50" onClick={() => router.push(`/dashboard/cases/${c.id}`)}>
                <td>{c.reference}</td>
                <td>{c.title}</td>
                <td>{c.type}</td>
                <td><Badge variant={getStatusVariant(c.status)}>{c.status}</Badge></td>
                <td>{formatDate(c.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

---

## P2-04 - Case Detail Page

**ID**: P2-04 | **Phase**: 2 | **Priority**: P0 | **Effort**: 8h | **Status**: ðŸ”´ TODO  
**Branch**: `feature/phase2-dashboard`

### Description
Page de dÃ©tail d'un dossier avec timeline, documents associÃ©s, et actions.

### Acceptance Criteria
- [ ] Infos du dossier (rÃ©fÃ©rence, titre, type, statut, description)
- [ ] Timeline des Ã©vÃ©nements
- [ ] Liste des documents attachÃ©s
- [ ] Actions: tÃ©lÃ©charger docs, envoyer message, clÃ´turer
- [ ] Responsive
- [ ] Realtime updates du statut

### Implementation
```typescript
// app/dashboard/cases/[id]/page.tsx
import { createClient } from '@/lib/supabase/server';
import { CaseHeader } from '@/components/dashboard/case-header';
import { CaseTimeline } from '@/components/dashboard/case-timeline';
import { CaseDocuments } from '@/components/dashboard/case-documents';

export default async function CaseDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: caseData } = await supabase.from('cases').select('*').eq('id', params.id).single();
  
  if (!caseData) notFound();

  const { data: documents } = await supabase.from('documents').select('*').eq('case_id', params.id);

  return (
    <div className="space-y-6">
      <CaseHeader case={caseData} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CaseTimeline caseId={params.id} />
        </div>
        <div>
          <CaseDocuments documents={documents || []} caseId={params.id} />
        </div>
      </div>
    </div>
  );
}
```

---

## P2-05 - Document Upload System

**ID**: P2-05 | **Phase**: 2 | **Priority**: P0 | **Effort**: 10h | **Status**: ðŸ”´ TODO  
**Branch**: `feature/phase2-dashboard`

### Description
SystÃ¨me d'upload de documents PDF sÃ©curisÃ© avec Supabase Storage.

### Acceptance Criteria
- [ ] Drag & drop area
- [ ] Upload multiple files
- [ ] Preview avant upload
- [ ] Progress bar
- [ ] Validation: PDF only, max 10MB
- [ ] Upload vers Supabase Storage (bucket documents)
- [ ] Metadata enregistrÃ©e en DB
- [ ] Error handling

### Implementation
```typescript
// components/dashboard/document-uploader.tsx
'use client'

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { createClient } from '@/lib/supabase/client';
import { Progress } from '@/components/ui/progress';
import { Upload } from 'lucide-react';

interface Props {
  caseId: string;
  onUploadComplete: () => void;
}

export function DocumentUploader({ caseId, onUploadComplete }: Props) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    for (const file of acceptedFiles) {
      // Upload to Storage
      const filePath = `${user!.id}/${caseId}/${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          onUploadProgress: (progress) => {
            setProgress((progress.loaded / progress.total) * 100);
          },
        });

      if (error) {
        console.error('Upload error:', error);
        continue;
      }

      // Save metadata to DB
      await supabase.from('documents').insert({
        case_id: caseId,
        user_id: user!.id,
        filename: file.name,
        original_filename: file.name,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type,
      });
    }

    setUploading(false);
    setProgress(0);
    onUploadComplete();
  }, [caseId]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
        isDragActive && "border-primary bg-primary/5"
      )}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <p>Glissez-dÃ©posez vos fichiers PDF ou cliquez pour sÃ©lectionner</p>
      <p className="text-sm text-gray-500 mt-2">Max 10MB par fichier</p>
      
      {uploading && (
        <div className="mt-4">
          <Progress value={progress} />
          <p className="text-sm mt-2">{Math.round(progress)}%</p>
        </div>
      )}
    </div>
  );
}
```

---

## P2-06 - Document Viewer & Management

**ID**: P2-06 | **Phase**: 2 | **Priority**: P1 | **Effort**: 6h | **Status**: ðŸ”´ TODO  
**Branch**: `feature/phase2-dashboard`

### Description
Visionneuse de documents PDF et gestion (tÃ©lÃ©chargement, suppression).

### Acceptance Criteria
- [ ] Liste des documents avec preview thumbnails
- [ ] Modal viewer pour PDF
- [ ] Boutons: tÃ©lÃ©charger, supprimer
- [ ] Confirmation avant suppression
- [ ] GÃ©nÃ©ration d'URL signÃ©e pour download sÃ©curisÃ©

---

## P2-07 - Chat System - UI Components

**ID**: P2-07 | **Phase**: 2 | **Priority**: P0 | **Effort**: 12h | **Status**: ðŸ”´ TODO  
**Branch**: `feature/phase2-chat`

### Description
Interface de chat avec liste des conversations et zone de messages.

### Acceptance Criteria
- [ ] Layout 2 colonnes: conversations list + chat area
- [ ] Message bubbles (user vs admin)
- [ ] Input zone avec bouton send
- [ ] Attachment button
- [ ] Timestamps
- [ ] Responsive (mobile: vue unique, toggle)

---

## P2-08 - Chat System - Realtime Integration

**ID**: P2-08 | **Phase**: 2 | **Priority**: P0 | **Effort**: 10h | **Status**: ðŸ”´ TODO  
**Branch**: `feature/phase2-chat`

### Description
IntÃ©gration Supabase Realtime pour chat en temps rÃ©el.

### Acceptance Criteria
- [ ] Messages en temps rÃ©el via Supabase Realtime
- [ ] Typing indicator
- [ ] Read receipts
- [ ] Scroll to bottom auto
- [ ] Notifications pour nouveaux messages

### Implementation
```typescript
// hooks/use-chat-messages.ts
'use client'

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Message } from '@/types/database';

export function useChatMessages(caseId: string) {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const supabase = createClient();

    // Fetch initial messages
    supabase
      .from('messages')
      .select('*')
      .eq('case_id', caseId)
      .order('created_at')
      .then(({ data }) => setMessages(data || []));

    // Subscribe to new messages
    const channel = supabase
      .channel(`case-${caseId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `case_id=eq.${caseId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [caseId]);

  return messages;
}
```

---

## P2-09 - Notifications System

**ID**: P2-09 | **Phase**: 2 | **Priority**: P1 | **Effort**: 8h | **Status**: ðŸ”´ TODO  
**Branch**: `feature/phase2-dashboard`

### Description
SystÃ¨me de notifications in-app avec badge count et dropdown.

### Acceptance Criteria
- [ ] Bell icon avec badge count
- [ ] Dropdown liste des notifications
- [ ] Types: case_update, message, payment, document
- [ ] Mark as read
- [ ] Link vers ressource associÃ©e
- [ ] Realtime updates

---

## P2-10 - User Profile & Settings

**ID**: P2-10 | **Phase**: 2 | **Priority**: P1 | **Effort**: 6h | **Status**: ðŸ”´ TODO  
**Branch**: `feature/phase2-auth`

### Description
Page de profil utilisateur avec modification des informations.

### Acceptance Criteria
- [ ] Affichage infos: nom, email, profession, entreprise
- [ ] Form d'Ã©dition avec validation
- [ ] Upload avatar (Supabase Storage bucket avatars)
- [ ] Change password
- [ ] Delete account

---

## P2-11 - Admin Dashboard (Formelio team)

**ID**: P2-11 | **Phase**: 2 | **Priority**: P2 | **Effort**: 12h | **Status**: ðŸ”´ TODO  
**Branch**: `feature/phase2-dashboard`

### Description
Interface admin pour l'Ã©quipe Formelio (vue tous les dossiers, rÃ©pondre aux messages).

### Acceptance Criteria
- [ ] Vue tous les cas (tous users)
- [ ] Filtres avancÃ©s
- [ ] Assigner cas Ã  admin
- [ ] Changer statut
- [ ] Envoyer messages aux clients
- [ ] RLS policy pour role admin

---

## P2-12 - Email Notifications

**ID**: P2-12 | **Phase**: 2 | **Priority**: P1 | **Effort**: 8h | **Status**: ðŸ”´ TODO  
**Branch**: `feature/phase2-auth`

### Description
Emails transactionnels avec Resend ou similaire.

### Acceptance Criteria
- [ ] Email de bienvenue (aprÃ¨s inscription)
- [ ] Email de rÃ©initialisation mot de passe
- [ ] Email notification nouveau message
- [ ] Email changement statut dossier
- [ ] Templates branded (logo Formelio)
- [ ] Unsubscribe link

### Implementation
```typescript
// lib/email/send.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(to: string, name: string) {
  await resend.emails.send({
    from: 'Formelio <noreply@formelio.fr>',
    to,
    subject: 'Bienvenue sur Formelio',
    html: `<h1>Bienvenue ${name} !</h1><p>Votre compte a Ã©tÃ© crÃ©Ã© avec succÃ¨s...</p>`,
  });
}

export async function sendCaseUpdateEmail(to: string, caseRef: string, newStatus: string) {
  await resend.emails.send({
    from: 'Formelio <noreply@formelio.fr>',
    to,
    subject: `Dossier ${caseRef} : mise Ã  jour`,
    html: `<p>Le statut de votre dossier ${caseRef} a Ã©tÃ© mis Ã  jour : <strong>${newStatus}</strong></p>`,
  });
}
```

---

# PHASE 3: PAYMENT & BILLING (7 tasks, 48h)

## P3-01 - Stripe Integration & Setup

**ID**: P3-01 | **Phase**: 3 | **Priority**: P0 | **Effort**: 6h | **Status**: ðŸ”´ TODO  
**Branch**: `feature/phase3-payment`

### Description
Configuration Stripe et intÃ©gration SDK dans l'app Next.js.

### Acceptance Criteria
- [ ] Compte Stripe crÃ©Ã© et configurÃ©
- [ ] API keys ajoutÃ©es en env vars
- [ ] Stripe SDK installÃ© (`stripe`, `@stripe/stripe-js`)
- [ ] Webhook endpoint configurÃ©
- [ ] Test mode validÃ©

---

## P3-02 - Payment Flow & Checkout

**ID**: P3-02 | **Phase**: 3 | **Priority**: P0 | **Effort**: 10h | **Status**: ðŸ”´ TODO  
**Branch**: `feature/phase3-payment`

### Description
Flux de paiement complet avec Stripe Checkout.

### Acceptance Criteria
- [ ] Page "Paiement" avec montant et description
- [ ] Bouton "Payer" lance Stripe Checkout
- [ ] Success URL et Cancel URL
- [ ] Gestion des erreurs de paiement
- [ ] Enregistrement transaction en DB

### Implementation
```typescript
// app/api/create-checkout-session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  const { caseId, amount } = await request.json();
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Dossier ${caseId}`,
            description: 'FormalitÃ©s juridiques Formelio',
          },
          unit_amount: amount * 100, // en centimes
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${request.headers.get('origin')}/dashboard/cases/${caseId}?payment=success`,
    cancel_url: `${request.headers.get('origin')}/dashboard/cases/${caseId}?payment=cancelled`,
    metadata: {
      caseId,
      userId: user!.id,
    },
  });

  return NextResponse.json({ sessionId: session.id });
}

// components/payment/checkout-button.tsx
'use client'

import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export function CheckoutButton({ caseId, amount }: { caseId: string; amount: number }) {
  async function handleCheckout() {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caseId, amount }),
    });

    const { sessionId } = await response.json();
    const stripe = await stripePromise;
    await stripe!.redirectToCheckout({ sessionId });
  }

  return (
    <Button onClick={handleCheckout} size="lg">
      Payer {amount}â‚¬
    </Button>
  );
}
```

---

## P3-03 - Invoice Generation

**ID**: P3-03 | **Phase**: 3 | **Priority**: P0 | **Effort**: 10h | **Status**: ðŸ”´ TODO  
**Branch**: `feature/phase3-payment`

### Description
GÃ©nÃ©ration automatique de factures PDF conformes lÃ©galement.

### Acceptance Criteria
- [ ] PDF gÃ©nÃ©rÃ© avec mentions lÃ©gales franÃ§aises
- [ ] NumÃ©ro de facture unique (FA-YYYY-NNNN)
- [ ] Montant HT, TVA 20%, TTC
- [ ] Logo Formelio
- [ ] Sauvegarde en Supabase Storage (bucket invoices)
- [ ] Email PDF au client

### Implementation
```typescript
// lib/invoices/generate.ts
import PDFDocument from 'pdfkit';
import { createClient } from '@/lib/supabase/server';

export async function generateInvoice(transactionId: string) {
  const supabase = createClient();
  const { data: transaction } = await supabase.from('transactions').select('*, profiles(*)').eq('id', transactionId).single();
  
  const doc = new PDFDocument();
  const buffers: Buffer[] = [];

  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', async () => {
    const pdfData = Buffer.concat(buffers);
    const invoiceNumber = `FA-${new Date().getFullYear()}-${String(Math.random()).slice(2, 6)}`;
    
    // Upload to Supabase Storage
    const { data } = await supabase.storage
      .from('invoices')
      .upload(`${transaction.user_id}/${invoiceNumber}.pdf`, pdfData, {
        contentType: 'application/pdf',
      });

    // Save invoice record
    await supabase.from('invoices').insert({
      transaction_id: transactionId,
      user_id: transaction.user_id,
      invoice_number: invoiceNumber,
      pdf_path: data!.path,
      amount_ht: transaction.amount / 1.2,
      amount_ttc: transaction.amount,
    });
  });

  // Generate PDF content
  doc.fontSize(20).text('FACTURE', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`NumÃ©ro: ${invoiceNumber}`);
  // ... rest of invoice content
  
  doc.end();
}
```

---

## P3-04 - Transaction History

**ID**: P3-04 | **Phase**: 3 | **Priority**: P1 | **Effort**: 6h | **Status**: ðŸ”´ TODO  
**Branch**: `feature/phase3-payment`

### Description
Page historique des transactions avec filtres et tÃ©lÃ©chargement factures.

### Acceptance Criteria
- [ ] Table des transactions (date, montant, statut, facture)
- [ ] Filtres par statut et date
- [ ] Download facture PDF
- [ ] Badge colorÃ© par statut (paid, pending, refunded)

---

## P3-05 - Subscription Management (Optional)

**ID**: P3-05 | **Phase**: 3 | **Priority**: P2 | **Effort**: 8h | **Status**: ðŸ”´ TODO  
**Branch**: `feature/phase3-payment`

### Description
Gestion d'abonnements rÃ©currents (si applicable au business model).

### Note
Cette task est optionnelle selon le modÃ¨le Ã©conomique final de Formelio.

---

## P3-06 - Webhooks & Payment Events

**ID**: P3-06 | **Phase**: 3 | **Priority**: P0 | **Effort**: 8h | **Status**: ðŸ”´ TODO  
**Branch**: `feature/phase3-payment`

### Description
Endpoint webhook Stripe pour gÃ©rer les Ã©vÃ©nements de paiement.

### Acceptance Criteria
- [ ] Webhook endpoint: /api/webhooks/stripe
- [ ] Signature validation
- [ ] Gestion Ã©vÃ©nements: payment_intent.succeeded, payment_intent.failed, charge.refunded
- [ ] Mise Ã  jour statut transaction en DB
- [ ] GÃ©nÃ©ration facture auto aprÃ¨s paiement rÃ©ussi
- [ ] Email notification client

### Implementation
```typescript
// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { generateInvoice } from '@/lib/invoices/generate';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = headers().get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = createClient();

  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      
      // Update transaction status
      await supabase
        .from('transactions')
        .update({ status: 'paid', paid_at: new Date().toISOString() })
        .eq('stripe_payment_intent_id', paymentIntent.id);

      // Generate invoice
      const { data: transaction } = await supabase
        .from('transactions')
        .select('id')
        .eq('stripe_payment_intent_id', paymentIntent.id)
        .single();

      if (transaction) {
        await generateInvoice(transaction.id);
      }
      break;

    case 'payment_intent.payment_failed':
      // Handle failed payment
      break;
  }

  return NextResponse.json({ received: true });
}
```

---

## P3-07 - Financial Dashboard (Admin)

**ID**: P3-07 | **Phase**: 3 | **Priority**: P2 | **Effort**: 10h | **Status**: ðŸ”´ TODO  
**Branch**: `feature/phase3-payment`

### Description
Dashboard financier pour l'Ã©quipe Formelio (revenus, statistiques).

### Acceptance Criteria
- [ ] Vue des revenus (jour, semaine, mois)
- [ ] Graphiques (Chart.js ou Recharts)
- [ ] Liste des transactions rÃ©centes
- [ ] Export CSV
- [ ] MÃ©triques: CA, nombre de transactions, panier moyen

---

**Total Phase 2**: 12 tasks, 98 heures  
**Branches**: `feature/phase2-auth`, `feature/phase2-dashboard`, `feature/phase2-chat`

**Total Phase 3**: 7 tasks, 48 heures  
**Branche**: `feature/phase3-payment`

---

# RÃ‰CAPITULATIF COMPLET

## Toutes les tasks (30)

| Phase | Tasks | Effort | Branches |
|-------|-------|--------|----------|
| **Phase 0** | 3 | 13h | `feature/phase0-setup` |
| **Phase 1** | 8 | 41h | `feature/phase1-landing` |
| **Phase 2** | 12 | 98h | `phase2-auth`, `phase2-dashboard`, `phase2-chat` |
| **Phase 3** | 7 | 48h | `feature/phase3-payment` |
| **TOTAL** | **30** | **200h** | **7 branches** |

## Ordre de dÃ©veloppement recommandÃ©

1. **Sprint 1 (Week 1)**: Phase 0 â†’ Merge vers `develop`
2. **Sprint 2-3 (Week 2-4)**: Phase 1 â†’ Merge vers `develop` â†’ Merge vers `main` (v1.0.0)
3. **Sprint 4-6 (Week 5-10)**: Phase 2 (auth â†’ dashboard â†’ chat) â†’ Merge vers `develop` â†’ Merge vers `main` (v1.1.0)
4. **Sprint 7-8 (Week 11-13)**: Phase 3 â†’ Merge vers `develop` â†’ Merge vers `main` (v1.2.0)

---

âœ… **Documentation des 30 tasks complÃ¨te**
