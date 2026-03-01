# Fullmakt24.se

> Din fullmakt – klar på 3 minuter

Sveriges smartaste plattform för fullmakter och medgivanden. 124 juridiskt granskade mallar.

## Tech Stack

- **Framework**: Next.js 15 + TypeScript
- **Styling**: Tailwind CSS med custom design tokens
- **Fonts**: Fraunces (headings) + DM Sans (body) + JetBrains Mono (code)
- **Deployment**: Vercel

## Snabbstart

```bash
# 1. Installera dependencies
npm install

# 2. Kopiera env-fil
cp .env.example .env.local

# 3. Starta dev-server
npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000)

## Deploy till Vercel

### 1. Pusha till GitHub

```bash
git init
git add .
git commit -m "Initial commit: Fullmakt24.se"
git remote add origin https://github.com/DITT-ANVÄNDARNAMN/fullmakt24.git
git push -u origin main
```

### 2. Importera i Vercel

1. Gå till [vercel.com/new](https://vercel.com/new)
2. Importera från GitHub
3. Välj Next.js preset
4. Deploy!

### 3. Koppla domän (Loopia DNS)

Lägg till i Loopias DNS-editor:

| Typ   | Namn | Värde              |
|-------|------|--------------------|
| A     | @    | 76.76.21.21        |
| CNAME | www  | cname.vercel-dns.com |

### 4. MaxiAI-integration

Skicka API-nyckel till MaxiAI för:
- Daglig SEO-innehållsgenerering
- Bloggartiklar 2x/vecka
- Uppdatering av mallbeskrivningar

## Sidstruktur

| Sida | Path | Status |
|------|------|--------|
| Startsida | `/` | ✅ Klar |
| Alla mallar | `/mallar` | ✅ Klar |
| Malldetalj | `/mallar/[category]/[slug]` | ✅ Klar |
| Skapa dokument | `/skapa/[slug]` | ✅ Klar |
| Priser | `/priser` | ✅ Klar |
| Mina dokument | `/mina-dokument` | ✅ Klar |
| API-dokumentation | `/api-docs` | ✅ Klar |
| Blogg | `/blogg` | ✅ Klar |
| Sitemap | `/sitemap.xml` | ✅ Auto |

## 124 Mallar i 9 Kategorier

- 👨‍👩‍👧‍👦 Föräldrar & Barn (20)
- ✈️ Resa & Transport (15)
- 🏥 Vård & Omsorg (15)
- 💼 Ekonomi, Bank & Myndigheter (20)
- 🏠 Boende & Vardag (15)
- ⚽ Förening, Skola & Fritid (15)
- 🐾 Djur & Husdjur (8)
- 👴 Seniorer & Digital Omsorg (8)
- 💻 Digitalt & Dödsbo (8)

## Nästa steg

- [ ] Supabase-integration (auth + databas)
- [ ] Stripe-betalning
- [ ] PDF-generering (jsPDF/react-pdf)
- [ ] BankID-signering
- [ ] MaxiAI API-endpoints
- [ ] Google Search Console

---

Built for the Swedish market 🇸🇪
