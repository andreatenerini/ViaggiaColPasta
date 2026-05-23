# ──────────────────────────────────────────────────────────────────
# Si Travel Perugia — genera .env.local con i valori già noti
# Lanciare DA QUESTA CARTELLA (sitravel/):
#   powershell -ExecutionPolicy Bypass -File .\setup-env.ps1
# ──────────────────────────────────────────────────────────────────

$ErrorActionPreference = "Stop"

# Genera secret Payload random (48 caratteri)
$rnd = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 48 | ForEach-Object { [char]$_ })

$envContent = @"
# Generato automaticamente da setup-env.ps1 — non committare
DATABASE_URI=postgresql://USER:PASSWORD@HOST.neon.tech/neondb?sslmode=require
PAYLOAD_SECRET=$rnd
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000

# Stripe — PLACEHOLDER (sostituire con le test keys da dashboard.stripe.com)
STRIPE_SECRET_KEY=sk_test_PLACEHOLDER
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_PLACEHOLDER
STRIPE_WEBHOOK_SECRET=whsec_PLACEHOLDER

# Resend — PLACEHOLDER (sostituire quando creiamo l'account)
RESEND_API_KEY=re_PLACEHOLDER
RESEND_FROM_EMAIL=noreply@sitravelperugia.it
RESEND_REPLY_TO=moreno.maitini@sitravelperugia.it

# Vercel Blob — vuoto in locale, lo settiamo dopo il deploy
BLOB_READ_WRITE_TOKEN=

# WhatsApp — PLACEHOLDER (sostituire col numero reale di Moreno, formato 39…)
NEXT_PUBLIC_WHATSAPP_NUMBER=39000000000

# Tariffario preventivi (centesimi)
PREZZO_PREVENTIVO_TO_LUNGO_RAGGIO=5000
PREZZO_PREVENTIVO_TO_MEDIO_RAGGIO=4000
PREZZO_PREVENTIVO_TO_ITALIA_MARE=3000
PREZZO_PREVENTIVO_TO_CROCIERE=4000
PREZZO_PREVENTIVO_ITINERARIO_LIBERO=5000

SCONTO_FEDELTA_SOGLIA=5
SCONTO_FEDELTA_PERCENTUALE=10
"@

$path = Join-Path $PSScriptRoot ".env.local"
if (Test-Path $path) {
  Write-Host "ATTENZIONE: .env.local esiste gia'. Lo sostituisco? [y/N]" -ForegroundColor Yellow
  $ans = Read-Host
  if ($ans -ne "y" -and $ans -ne "Y") {
    Write-Host "Annullato." -ForegroundColor Red
    exit 0
  }
}

$envContent | Out-File -FilePath $path -Encoding utf8 -NoNewline
Write-Host "OK .env.local creato in $path" -ForegroundColor Green
Write-Host ""
Write-Host "Adesso puoi:"
Write-Host "  npm run dev"
Write-Host ""
Write-Host "Il sito sara' su http://localhost:3000"
Write-Host "L'admin Payload su http://localhost:3000/admin"
Write-Host ""
Write-Host "I valori PLACEHOLDER (Stripe, Resend, WhatsApp) li sostituirai man mano."
