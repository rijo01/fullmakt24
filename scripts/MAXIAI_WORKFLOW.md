# MaxiAI Workflow – Daglig SEO-innehållsgenerering för Fullmakt24.se

## ÖVERSIKT

MaxiAI genererar SEO-optimerat innehåll för alla 124 mallsidor på Fullmakt24.se.
Innehållet sparas som JSON-filer i `/content/mallar/` och committas till GitHub.
Vercel auto-deployar vid varje push.

## DAGLIGT SCHEMA

**Kl 08:00 varje vardag:**
1. Kontrollera vilka mallar som saknar innehåll
2. Generera SEO-innehåll för 5 mallar per dag (alla 124 klara på ~25 vardagar)
3. Committa och pusha till GitHub
4. Vercel auto-deployar

## STEG-FÖR-STEG

### 1. MaxiAI tar emot följande prompt:

```
Du ska generera SEO-innehåll för Fullmakt24.se.

Läs instruktionerna i scripts/MAXIAI_SEO_PROMPT.md i repot rijo01/fullmakt24.

Kolla vilka mallar i content/mallar/ som SAKNAR en .json-fil.

Generera innehåll för de 5 första mallarna som saknar innehåll, baserat på
template-data i data/templates.ts.

Spara varje mall som content/mallar/{slug}.json

Committa med meddelande: "SEO: Lagt till innehåll för [mallnamn1], [mallnamn2], ..."

Pusha till main-branchen.
```

### 2. Prioriteringsordning för innehåll:

**Fas 1 (Vecka 1) – De 20 mest populära:**
1. fullmakt-bank (21 345 skapade)
2. fullmakt-apotek (15 678)
3. fullmakt-skatteverket (14 567)
4. fullmakt-paket-post (13 456)
5. foraldraredgivande-resa-annan-vuxen (12 847)
6. fullmakt-sjukvard (12 345)
7. fullmakt-agarbyte-bil (11 432)
8. medgivande-foto-film (11 234)
9. fullmakt-barns-sjukvard (11 234)
10. fullmakt-deklaration (11 234)
11. fullmakt-bostadsforening (9 876)
12. fullmakt-forsikringskassan (9 876)
13. fullmakt-bonusforalder (9 543)
14. reseintyg-barn-internationell (9 832)
15. medgivande-skolresa (8 923)
16. fullmakt-besiktning (8 765)
17. medgivande-akut-vard (8 765)
18. begransad-fullmakt (8 765)
19. fullmakt-foreningsstamma (7 654)
20. medgivande-passansokan (7 654)

**Fas 2 (Vecka 2-3) – Resterande med >3000 skapade**

**Fas 3 (Vecka 4-5) – Alla övriga**

### 3. Git-kommandon som MaxiAI kör:

```bash
cd ~/Projects/fullmakt24
# Skapa/uppdatera JSON-filer i content/mallar/
git add content/mallar/
git commit -m "SEO: Lagt till innehåll för [lista av mallar]"
git push origin main
```

### 4. Veckovis bloggartiklar (2 st/vecka):

MaxiAI skapar också bloggartiklar i `/content/blogg/`:

**Ämnesförslag:**
- "Fullmakt vs framtidsfullmakt – vad är skillnaden?"
- "Resefullmakt för barn – komplett guide inför semestern"
- "Bankfullmakt – allt du behöver veta 2025"
- "Digital dödsboförvaltning – så hanterar du digitala tillgångar"
- "Föräldramedgivande – när behöver du ett?"
- "Fullmakt för äldre – hjälp dina föräldrar med digitala tjänster"
- "Så skriver du en juridiskt giltig fullmakt"
- "5 vanliga misstag med fullmakter (och hur du undviker dem)"

### 5. Säsongsbundet innehåll:

**Maj-Juni:** Uppdatera alla reserelaterade mallar (sommarresor)
**Augusti:** Skolstart – uppdatera skolrelaterade medgivanden
**November-December:** Julresor, vinterlovsresor
**Januari:** Deklarationsperiod – uppdatera skattefullmakter
**Löpande:** Uppdatera mallar äldre än 90 dagar

## KVALITETSKONTROLL

Varje genererad JSON-fil ska:
- [ ] Ha metabeskrivning på exakt 150-160 tecken
- [ ] Ha H1 med primärt sökord och årtal
- [ ] Ha 5 FAQ-frågor som matchar faktiska Google-sökningar
- [ ] Ha steg-för-steg-guide med 4-6 steg
- [ ] Ha 4-5 vanliga misstag
- [ ] Ha 2-3 interna länkar till relaterade mallar
- [ ] Inte innehålla felaktiga juridiska påståenden
- [ ] Vara skriven på korrekt svenska

## TEKNISK SETUP

### Filstruktur:
```
content/
  mallar/
    fullmakt-bank.json
    fullmakt-apotek.json
    foraldraredgivande-resa-annan-vuxen.json
    ... (124 filer totalt)
  blogg/
    fullmakt-vs-framtidsfullmakt.json
    resefullmakt-barn-guide.json
    ...
```

### Att JSON-filerna servas via Next.js:
Filerna i `content/mallar/` behöver vara tillgängliga via `/content/mallar/[slug].json`.
Konfigurera i `next.config.js` eller lägg dem i `public/content/mallar/`.

## MÄTVÄRDEN

MaxiAI övervakar:
- Antal indexerade sidor i Google Search Console
- Klick och visningar per mallsida
- Genomsnittlig position per sökord
- Vilka mallar som genererar mest trafik
- Konverteringsgrad (besök → skapad fullmakt)
