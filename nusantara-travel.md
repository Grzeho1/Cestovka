# Ind Travel – Projektová dokumentace

Cestovní kancelář zaměřená na Indonésii. Jednoduchý web s katalogem balíků, rezervačním formulářem a admin panelem pro správu tripů.

---

## Obsah

- [Struktura webu](#struktura-webu)
- [Design systém](#design-systém)
- [Komponenty](#komponenty)
- [Tech stack](#tech-stack)
- [Datový model – balík](#datový-model--balík)
- [Admin panel](#admin-panel)
- [TODO / Roadmap](#todo--roadmap)

---

## Struktura webu

```
/                       → Frontpage (hero + katalog balíků)
/baliky                 → Plný katalog s filtrováním
/balik/[slug]           → Detail balíku (itinerář, galerie, cena)
/rezervace/[slug]       → Rezervační formulář
/admin                  → Admin panel (přidání / editace / smazání balíku)
/admin/balik/novy       → Formulář pro nový balík
/admin/balik/[slug]     → Editace existujícího balíku
```

---

## Design systém

### Barvy

```css
--sand:    #f2ead8   /* světlé pozadí, karty */
--deep:    #1a1208   /* primární text, tlačítka */
--forest:  #2d4a2d   /* akcent zelená */
--ember:   #c8521a   /* hlavní akcent, CTA, ceny */
--gold:    #d4a843   /* sekundární akcent */
--mist:    #8a9b80   /* muted text */
--cream:   #faf6ed   /* hlavní pozadí stránky */
```

### Typografie

| Použití        | Font                  | Váha       |
|----------------|-----------------------|------------|
| Nadpisy (h1–h3)| Playfair Display      | 400 / 700  |
| Kurzíva h1     | Playfair Display      | italic 400 |
| Tělo textu     | DM Sans               | 300 / 400  |
| Tlačítka, meta | DM Sans               | 500        |

```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
```

### Spacing & Border radius

- Karty: `border-radius: 1.2rem`
- Tlačítka primární: `border-radius: 0.4rem`
- Badge / tagy: `border-radius: 2rem`
- Grid gap: `1.8rem`
- Padding sekce: `4rem` (desktop), `1.5rem` (mobil)

---

## Komponenty

### Navigace

- Fixní, `backdrop-filter: blur(12px)`
- Logo: **Nusantara** + `<span>` zvýrazněný v `--ember`
- Pravá strana: CTA tlačítko „Nezávazná poptávka"

### Hero sekce

- Grid 2 sloupce: vlevo text, vpravo vizuální panel
- Vlevo: tag → h1 (s kurzívou) → perex → tlačítka → statistiky
- Vpravo: gradientní pozadí evokující džungli/sopku + plovoucí kartička s nejpopulárnějším tripem
- Animace: `fadeInUp` se staggered `animation-delay`
- Animace nebo videa na frontpage, aby zaujalo a šlo videt co se nabizí a krásy indonesie.
- možná možnost nějakého blogu? 

### Karta balíku `.pkg-card`

```
┌────────────────────────┐
│  [obrázek / gradient]  │  ← badge (Bestseller, Nové…) + ♡ favorit
│  [název v overlay]     │
├────────────────────────┤
│  📅 dny  👥 os.  🌍 oblast │
│  Název balíku           │
│  Krátký popis...        │
│  [tag] [tag] [tag]      │
├────────────────────────┤
│  €890 / os.  [Více info]│
└────────────────────────┘
```

**Hover efekt:** `translateY(-6px)` + silnější `box-shadow`

### Filter bar

Horizontální řada tlačítek pro filtrování podle destinace nebo délky.  
Aktivní stav: `background: var(--deep)`, `color: var(--sand)`.

### Sekce „Proč s námi"

- Tmavé pozadí (`var(--deep)`), grid 2 sloupce
- Vlevo: nadpis + perex
- Vpravo: 4 položky s ikonou, titulkem a popisem

---

## Tech stack

### Doporučený stack (vlastní řešení)

| Vrstva       | Technologie           | Poznámka                              |
|--------------|-----------------------|---------------------------------------|
| Frontend     | Next.js 14 + Tailwind | App Router, SSG/ISR pro rychlé načítání |
| Databáze     | Supabase (PostgreSQL) | Zdarma do 500 MB, REST API            |
| Auth (admin) | Supabase Auth         | Email/password, jen pro admina        |
| Fotky        | Supabase Storage      | nebo Cloudinary (transformace fotek)  |
| Formuláře    | React Hook Form       | Validace + error handling             |
| Email notify | Resend nebo SendGrid  | Notifikace při nové poptávce          |
| Deploy       | Vercel                | Free tier, automatický deploy z Gitu  |

### Alternativa – rychlý start bez kódování

| Možnost        | Výhoda                        | Nevýhoda              |
|----------------|-------------------------------|-----------------------|
| Webflow CMS    | Vizuální editor, rychlé       | ~$20/měsíc, méně flex |
| Notion + Super | Extrémně jednoduché           | Limitovaný design     |
| Framer         | Animace, hezký výsledek       | Dražší                |

---

## Datový model – balík

Tabulka `packages` v Supabase:

```sql
CREATE TABLE packages (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         TEXT UNIQUE NOT NULL,          -- např. "east-java-bromo-ijen"
  title        TEXT NOT NULL,                 -- "East Java – Bromo & Ijen"
  area         TEXT NOT NULL,                 -- "East Java", "Bali", "Flores"…
  duration_days INT NOT NULL,                 -- počet dní
  max_persons  INT NOT NULL DEFAULT 8,
  price_from   NUMERIC(10,2) NOT NULL,        -- cena od osoby (EUR)
  currency     TEXT DEFAULT 'EUR',
  perex        TEXT,                          -- krátký popis na kartičce
  description  TEXT,                          -- delší popis na detail stránce
  itinerary    JSONB,                         -- pole { day: 1, title: "", text: "" }
  included     TEXT[],                        -- co je zahrnuto
  excluded     TEXT[],                        -- co není zahrnuto
  highlights   TEXT[],                        -- tagy (Borobudur, Bromo…)
  badge        TEXT,                          -- "Bestseller", "Nové", "Prémiový"
  cover_url    TEXT,                          -- URL hlavní fotky
  gallery_urls TEXT[],                        -- další fotky
  active       BOOLEAN DEFAULT TRUE,          -- publikováno / skryto
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Admin panel

### Přihlášení

Chráněná route `/admin` – přihlášení přes email/heslo (Supabase Auth).  
Middleware v Next.js přesměruje nepřihlášeného uživatele na `/login`.

### Formulář pro nový/editovaný balík

Pole formuláře odpovídají sloupcům v tabulce:

- **Základní info:** Název, Slug (auto-generovaný z názvu), Oblast, Počet dní, Max osob, Cena od, Měna
- **Obsah:** Perex, Popis (rich text), Itinerář (dynamické pole – přidat/odebrat den)
- **Detaily:** Zahrnuto (textarea, každý řádek = 1 položka), Nezahrnuto, Tagy/Highlights
- **Média:** Upload cover fotky, galerie (multi-upload)
- **Nastavení:** Badge text, Aktivní toggle

### Seznam balíků v adminu

Tabulka se sloupci: Název | Oblast | Dny | Cena | Aktivní | Akce (Editovat / Smazat)

---

## TODO / Roadmap

### Fáze 1 – MVP

- [ ] Frontpage s katalogem (hotovo jako HTML mockup)
- [ ] Detail stránka balíku
- [ ] Poptávkový formulář (jméno, email, termín, počet osob, zpráva)
- [ ] Email notifikace při nové poptávce
- [ ] Admin panel – CRUD balíků
- [ ] Upload fotek

### Fáze 2

- [ ] Mobilní optimalizace (responsive)
- [ ] SEO (meta tagy, sitemap, schema.org pro turistické produkty)
- [ ] Filtrování v katalogu (podle oblasti, délky, ceny)
- [ ] Stránka s referencemi / hodnoceními
- [ ] Česká a anglická verze (i18n)

### Fáze 3

- [ ] Online platba depositu (Stripe nebo PayPal)
- [ ] Kalendář dostupnosti
- [ ] WhatsApp Business API integrace
- [ ] Blog / cestovní průvodce (SEO obsah)

---

## Poznámky

- Název **Nusantara** = starojavánský výraz pro „souostroví" (dnešní Indonésie)
- Primárně cílíme na české a slovenské turisty, do skupiny nemícháme cizince → texty v češtině, ceny v CZK nebo EUR
- Sídlo: Pangandaran, West Java – výhoda přímé místní znalosti
- Skupiny max. 8–10 osob = klíčový diferenciátor oproti velkým CK
