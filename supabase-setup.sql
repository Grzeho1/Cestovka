-- Run this SQL in your Supabase SQL Editor (Dashboard > SQL Editor > New query)

-- 1. Create packages table
CREATE TABLE IF NOT EXISTS packages (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         TEXT UNIQUE NOT NULL,
  title        TEXT NOT NULL,
  area         TEXT NOT NULL,
  duration_days INT NOT NULL,
  max_persons  INT NOT NULL DEFAULT 8,
  price_from   NUMERIC(10,2) NOT NULL,
  currency     TEXT DEFAULT 'EUR',
  perex        TEXT,
  description  TEXT,
  itinerary    JSONB DEFAULT '[]'::jsonb,
  included     TEXT[] DEFAULT '{}',
  excluded     TEXT[] DEFAULT '{}',
  highlights   TEXT[] DEFAULT '{}',
  badge        TEXT,
  cover_url    TEXT,
  gallery_urls TEXT[] DEFAULT '{}',
  active       BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

-- 3. Policy: anyone can read active packages
CREATE POLICY "Public can read active packages"
  ON packages FOR SELECT
  USING (active = true);

-- 4. Policy: anon can insert/update/delete (for now without auth - later restrict to authenticated admin)
CREATE POLICY "Anon can insert packages"
  ON packages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anon can update packages"
  ON packages FOR UPDATE
  USING (true);

CREATE POLICY "Anon can delete packages"
  ON packages FOR DELETE
  USING (true);

-- 5. Policy: anon can also read inactive packages (for admin listing)
CREATE POLICY "Anon can read all packages"
  ON packages FOR SELECT
  USING (true);

-- 6. Create storage bucket for package images
INSERT INTO storage.buckets (id, name, public)
VALUES ('package-images', 'package-images', true)
ON CONFLICT (id) DO NOTHING;

-- 7. Storage policy: anyone can read images
CREATE POLICY "Public can read package images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'package-images');

-- 8. Storage policy: anyone can upload images (restrict to auth later)
CREATE POLICY "Anyone can upload package images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'package-images');

CREATE POLICY "Anyone can update package images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'package-images');

CREATE POLICY "Anyone can delete package images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'package-images');

-- 9. Seed with initial data
INSERT INTO packages (slug, title, area, duration_days, max_persons, price_from, currency, perex, description, itinerary, included, excluded, highlights, badge, active) VALUES
(
  'bali-ubud-a-chramy',
  'Bali – Ubud & Chrámy',
  'Bali',
  7, 8, 890, 'EUR',
  'Poznejte duchovní srdce Bali. Rýžové terasy, hinduistické chrámy a tradiční umění v Ubudu.',
  'Sedmidenní cesta za duchovním Bali. Navštívíte ikonické rýžové terasy Tegallalang, posvátný chrám Tirta Empul a opičí les v Ubudu. Zažijete tradiční balijský tanec, naučíte se vařit indonéskou kuchyni a odpočinete si v luxusních rýžových terasách.',
  '[{"day":1,"title":"Přílet na Bali","text":"Transfer z letiště do Ubudu. Ubytování a večerní procházka městem."},{"day":2,"title":"Rýžové terasy","text":"Výlet na Tegallalang Rice Terraces. Odpolední workshop malby na batik."},{"day":3,"title":"Chrámy","text":"Návštěva Tirta Empul a Gunung Kawi. Rituální očistná koupel."},{"day":4,"title":"Opičí les & umění","text":"Ubud Monkey Forest, galerie a trhy. Odpolední kurz vaření."},{"day":5,"title":"Vodopády","text":"Trek k vodopádům Tegenungan a Kanto Lampo. Odpočinek u bazénu."},{"day":6,"title":"Tanah Lot","text":"Celodenní výlet k chrámům Tanah Lot a Uluwatu. Kecak tanec při západu slunce."},{"day":7,"title":"Odlet","text":"Volné dopoledne, transfer na letiště."}]'::jsonb,
  ARRAY['Ubytování (6 nocí)','Snídaně','Všechny transfery','Český průvodce','Vstupné do chrámů','Kurz vaření'],
  ARRAY['Letenky','Cestovní pojištění','Obědy a večeře','Osobní výdaje'],
  ARRAY['Ubud','Tegallalang','Tirta Empul','Tanah Lot','Uluwatu'],
  'Bestseller',
  true
),
(
  'east-java-bromo-ijen',
  'East Java – Bromo & Ijen',
  'East Java',
  5, 8, 650, 'EUR',
  'Dva nejkrásnější vulkány Jávy: východ slunce nad Bromo a modré plameny Ijenu.',
  'Pětidenní dobrodružství po východní Jávě. Zažijte nezapomenutelný východ slunce nad kalderou Bromo, noční trek ke kráteru Ijen s jeho slavnými modrými plameny a relaxaci u vodopádů Tumpak Sewu.',
  '[{"day":1,"title":"Příjezd do Surabaye","text":"Transfer do Probolingga, ubytování s výhledem na Bromo."},{"day":2,"title":"Východ slunce Bromo","text":"Ranní výjezd na viewpoint Penanjakan. Jízda džípem přes moře písku ke kráteru."},{"day":3,"title":"Tumpak Sewu","text":"Přejezd k vodopádu Tumpak Sewu. Trek do kaňonu."},{"day":4,"title":"Ijen Blue Fire","text":"Noční trek na Ijen (start ve 2:00). Modré plameny a tyrkysové jezero."},{"day":5,"title":"Odjezd","text":"Transfer do Surabaye nebo na Bali (ferry)."}]'::jsonb,
  ARRAY['Ubytování (4 noci)','Snídaně','Džíp Bromo','Trek průvodce','Plynové masky Ijen'],
  ARRAY['Letenky','Pojištění','Obědy a večeře'],
  ARRAY['Bromo','Ijen','Tumpak Sewu','Blue Fire'],
  'Nové',
  true
),
(
  'flores-komodo-a-kelimutu',
  'Flores – Komodo & Kelimutu',
  'Flores',
  10, 6, 1290, 'EUR',
  'Divoký východ Indonésie: draci z Komodo, tříbarevná jezera Kelimutu a tradiční vesnice.',
  'Desetidenní expedice na Flores a Komodo. Setkáte se s komodskými draky na ostrově Rinca, uvidíte tříbarevná jezera na sopce Kelimutu, navštívíte tradiční vesnice Wae Rebo a proplouvete krásnými ostrovy Padar a Kanawa.',
  '[{"day":1,"title":"Přílet do Labuan Bajo","text":"Transfer, ubytování u přístavu."},{"day":2,"title":"Komodo boat trip","text":"Celodenní plavba: ostrov Padar, Pink Beach, Komodo / Rinca – draci."},{"day":3,"title":"Kanawa & šnorchlování","text":"Ostrov Kanawa, korálové útesy, manta rays."},{"day":4,"title":"Přejezd na Ruteng","text":"Cesta přes Spider Rice Fields do Rutengu."},{"day":5,"title":"Wae Rebo","text":"Trek do tradiční vesnice Wae Rebo (UNESCO). Nocleh v tradičním domě."},{"day":6,"title":"Návrat z Wae Rebo","text":"Ranní trek zpět. Přejezd do Bajawa."},{"day":7,"title":"Bajawa & vesnice","text":"Tradiční vesnice Bena. Horké prameny."},{"day":8,"title":"Kelimutu","text":"Východ slunce na Kelimutu – tříbarevná jezera."},{"day":9,"title":"Ende – volný den","text":"Odpočinek, místní trhy."},{"day":10,"title":"Odlet","text":"Transfer na letiště Ende."}]'::jsonb,
  ARRAY['Ubytování (9 nocí)','Snídaně','Boat trip Komodo','Všechny transfery','Průvodce','Trek Wae Rebo'],
  ARRAY['Letenky','Pojištění','Obědy a většina večeří'],
  ARRAY['Komodo','Kelimutu','Wae Rebo','Padar','Pink Beach'],
  'Prémiový',
  true
),
(
  'raja-ampat-podvodni-raj',
  'Raja Ampat – Podmořský ráj',
  'Raja Ampat',
  8, 6, 1590, 'EUR',
  'Nejkrásnější podmořský svět na planetě. Šnorchlování, potápění a panenské ostrovy.',
  'Osmidenní výprava do Raja Ampat – podmořského ráje s nejvyšší biodiverzitou na Zemi. Šnorchlování s mantami, potápění u korálových stěn, kajak mezi karpatovými ostrůvky a život na homestay přímo nad vodou.',
  '[{"day":1,"title":"Přílet do Sorong","text":"Transfer na speedboat do Waisai, ubytování na homestay."},{"day":2,"title":"Pianemo viewpoint","text":"Ikonický výhled na karpatové ostrůvky. Šnorchlování."},{"day":3,"title":"Manta Sandy","text":"Šnorchlování s mantami. Kajak okolo ostrovů."},{"day":4,"title":"Arborek","text":"Přejezd na Arborek. Podmořská zahrada, žraloci."},{"day":5,"title":"Potápění","text":"Dva ponory u Cape Kri a Sardine Reef (cert. potápěči)."},{"day":6,"title":"Misool area","text":"Výlet do jižní oblasti. Skryté laguny."},{"day":7,"title":"Volný den","text":"Odpočinek, šnorchlování přímo z homestay."},{"day":8,"title":"Návrat","text":"Speedboat do Sorong, odlet."}]'::jsonb,
  ARRAY['Ubytování (7 nocí, homestay)','Plná penze','Speedboat transfery','Šnorchlování','Průvodce','Poplatek Raja Ampat'],
  ARRAY['Letenky do Sorong','Pojištění','Potápěčské vybavení','Tip pro posádku'],
  ARRAY['Raja Ampat','Pianemo','Manta Sandy','Arborek','Misool'],
  NULL,
  true
),
(
  'sumatra-dzungle-a-orangutani',
  'Sumatra – Džungle & Orangutani',
  'Sumatra',
  6, 8, 750, 'EUR',
  'Trek pralesem Gunung Leuser za divokými orangutany. Tobské jezero a Bukit Lawang.',
  'Šestidenní expedice na Sumatru. Dvoudenní trek pralesem národního parku Gunung Leuser s přenocováním v džungli. Setkání s divokými orangutany, gibony a nosorožci. Relaxace u vulkanického jezera Toba.',
  '[{"day":1,"title":"Přílet do Medanu","text":"Transfer do Bukit Lawang."},{"day":2,"title":"Džungle den 1","text":"Trek pralesem. Orangutani, giboni, makakové. Nocleh v džungli."},{"day":3,"title":"Džungle den 2","text":"Ranní trek. River tubing zpět do Bukit Lawang."},{"day":4,"title":"Přejezd k Tobě","text":"Cesta k jezeru Toba. Ubytování na ostrově Samosir."},{"day":5,"title":"Jezero Toba","text":"Batakovská kultura, tradiční vesnice, horké prameny."},{"day":6,"title":"Odlet","text":"Transfer zpět do Medanu, odlet."}]'::jsonb,
  ARRAY['Ubytování (5 nocí)','Snídaně','Jungle trek + průvodce','River tubing','Transfery'],
  ARRAY['Letenky','Pojištění','Obědy a večeře'],
  ARRAY['Bukit Lawang','Orangutani','Gunung Leuser','Jezero Toba','Samosir'],
  NULL,
  true
);
