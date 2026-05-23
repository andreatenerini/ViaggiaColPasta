# Si Travel Perugia — sito web

Sito agenzia tour operator per **Moreno Maitini · Si Travel Perugia**.

**Stack:** Next.js 15 (App Router) · Payload CMS 3 · PostgreSQL (Neon) · Stripe (pagamento preventivi) · Resend (email) · Vercel Blob (media) · Tailwind CSS.

---

## Funzionalità

- **Home** con 3 CTA (Preventivo TO, Preventivo Itinerario Libero, Offerte).
- **Preventivo Tour Operator** (4 tipologie · Lungo Raggio / Medio Raggio / Italia Mare / Crociere) — pagamento via Stripe, prezzo configurabile per tipologia.
- **Preventivo Itinerario Libero** — percorso libero, prezzo fisso.
- **Sconto fedeltà 10%** automatico dopo i primi 5 preventivi pagati dello stesso cliente (riconosciuto via email).
- **Offerte** — vetrina senza carrello, ogni card ha un bottone WhatsApp che apre la chat con Moreno.
- **Videogallery** per luogo (YouTube / Vimeo / file caricato).
- **Email di ringraziamento** automatica dopo il pagamento, con riepilogo e nota sullo sconto sul viaggio finale.
- **Admin Payload** su `/admin` per gestire luoghi, offerte, video, vedere preventivi e anagrafica clienti.

---

## Setup locale

### 1) Variabili d'ambiente

Copia il template e riempi i valori:

```powershell
Copy-Item env-template.txt .env.local
```

Apri `.env.local` e inserisci:

- `DATABASE_URI` → connection string Neon (te l'ha passata Moreno)
- `PAYLOAD_SECRET` → stringa random lunga (almeno 32 caratteri). Genera con:
  ```powershell
  -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 48 | ForEach-Object {[char]$_})
  ```
- `STRIPE_SECRET_KEY` + `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` → da `dashboard.stripe.com → Developers → API keys` (per ora usa le **test keys**)
- `STRIPE_WEBHOOK_SECRET` → si genera dopo (vedi sezione Stripe in fondo)
- `RESEND_API_KEY` → da `resend.com → API Keys` (opzionale: senza email, i pagamenti funzionano lo stesso ma niente mail di ringraziamento)
- `NEXT_PUBLIC_WHATSAPP_NUMBER` → numero WhatsApp di Moreno (formato `39…` senza `+` né spazi)
- Tariffario preventivi (in centesimi). Default: 50/40/30/40 € per le 4 tipologie TO e 50 € per Itinerario Libero. Da farsi confermare da Moreno.

### 2) Installa dipendenze

```bash
npm install --legacy-peer-deps
```

### 3) Avvia

```bash
npm run dev
```

- Sito: <http://localhost:3000>
- Admin: <http://localhost:3000/admin> — al primo avvio crei l'utente admin (email + password).

Al primo avvio Payload crea automaticamente le tabelle nel database Neon.

---

## Modello dati

Tutte le collection sono in `src/collections/`:

| Collection | A cosa serve |
|---|---|
| `users` | Utenti admin (Moreno e staff) |
| `media` | Immagini e file caricati |
| `luoghi` | Catalogo destinazioni (tipologia + sottocategoria + slug) |
| `preventivi-tour-operator` | Preventivi da catalogo (pagati o in attesa) |
| `preventivi-itinerario-libero` | Preventivi su itinerario libero |
| `offerte` | Vetrina offerte (link WhatsApp, niente carrello) |
| `video` | Video della galleria, raggruppati per `luogo` |
| `clienti` | Anagrafica unificata (per sconto fedeltà) |

---

## Stripe — configurazione webhook

Il webhook Stripe è quello che riceve la conferma del pagamento e marca il preventivo come "pagato".

### In locale

Installa la Stripe CLI: <https://docs.stripe.com/stripe-cli> · poi:

```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

Copia il `whsec_…` che ti stampa e mettilo in `.env.local` come `STRIPE_WEBHOOK_SECRET`.

### In produzione

1. `dashboard.stripe.com → Developers → Webhooks → Add endpoint`
2. URL: `https://sitravelperugia.it/api/webhook/stripe`
3. Eventi: `checkout.session.completed`
4. Copia il **Signing secret** e mettilo nelle env di Vercel come `STRIPE_WEBHOOK_SECRET`.

---

## Decisioni di default già prese (da confermare con Moreno)

Queste scelte sono ragionevoli ma vanno validate:

1. **Storage media:** Vercel Blob in MVP, migrazione a Cloudflare R2 successiva (R2 ora richiede l'iscrizione al piano con metodo di pagamento, anche se gratis).
2. **Itinerario Libero:** percorso testuale libero + multiselect "Stati di interesse" (logica del Word principale).
3. **Sconto 10%:** si applica al **preventivo successivo** dal 6° in poi, riconoscendo il cliente via email.
4. **Voce "iNSR"** del menu nei doc Word: **ignorata** (sembra un typo).
5. **Tariffario preventivi:** placeholder a 50/40/30/40/50 € — Moreno deve confermare i valori reali.
6. **Sottocategorie LR/MR:** lasciate libere come campo testo, configurabili dall'admin senza enum fissa.

---

## Prossimi step

- [ ] Far creare a Moreno l'utente admin al primo avvio
- [ ] Inserire i luoghi nel catalogo (collection `luoghi`)
- [ ] Confermare tariffario reale
- [ ] Configurare dominio Aruba → Vercel (record A + CNAME)
- [ ] Verificare il dominio email su Resend per evitare spam (DNS TXT/DKIM)
- [ ] Migrazione media a Cloudflare R2 quando supera 1 GB
