import { Package } from "@/lib/types";

export const packages: Package[] = [
  {
    id: "1",
    slug: "bali-ubud-a-chramy",
    title: "Bali – Ubud & Chrámy",
    area: "Bali",
    duration_days: 7,
    max_persons: 8,
    price_from: 890,
    currency: "EUR",
    perex:
      "Poznejte duchovní srdce Bali. Rýžové terasy, hinduistické chrámy a tradiční umění v Ubudu.",
    description:
      "Sedmidenní cesta za duchovním Bali. Navštívíte ikonické rýžové terasy Tegallalang, posvátný chrám Tirta Empul a opičí les v Ubudu. Zažijete tradiční balijský tanec, naučíte se vařit indonéskou kuchyni a odpočinete si v luxusních rýžových terasách.",
    itinerary: [
      { day: 1, title: "Přílet na Bali", text: "Transfer z letiště do Ubudu. Ubytování a večerní procházka městem." },
      { day: 2, title: "Rýžové terasy", text: "Výlet na Tegallalang Rice Terraces. Odpolední workshop malby na batik." },
      { day: 3, title: "Chrámy", text: "Návštěva Tirta Empul a Gunung Kawi. Rituální očistná koupel." },
      { day: 4, title: "Opičí les & umění", text: "Ubud Monkey Forest, galerie a trhy. Odpolední kurz vaření." },
      { day: 5, title: "Vodopády", text: "Trek k vodopádům Tegenungan a Kanto Lampo. Odpočinek u bazénu." },
      { day: 6, title: "Tanah Lot", text: "Celodenní výlet k chrámům Tanah Lot a Uluwatu. Kecak tanec při západu slunce." },
      { day: 7, title: "Odlet", text: "Volné dopoledne, transfer na letiště." },
    ],
    included: ["Ubytování (6 nocí)", "Snídaně", "Všechny transfery", "Český průvodce", "Vstupné do chrámů", "Kurz vaření"],
    excluded: ["Letenky", "Cestovní pojištění", "Obědy a večeře", "Osobní výdaje"],
    highlights: ["Ubud", "Tegallalang", "Tirta Empul", "Tanah Lot", "Uluwatu"],
    badge: "Bestseller",
    cover_url: "/images/bali-cover.jpg",
    gallery_urls: [],
    active: true,
  },
  {
    id: "2",
    slug: "east-java-bromo-ijen",
    title: "East Java – Bromo & Ijen",
    area: "East Java",
    duration_days: 5,
    max_persons: 8,
    price_from: 650,
    currency: "EUR",
    perex:
      "Dva nejkrásnější vulkány Jávy: východ slunce nad Bromo a modré plameny Ijenu.",
    description:
      "Pětidenní dobrodružství po východní Jávě. Zažijte nezapomenutelný východ slunce nad kalderou Bromo, noční trek ke kráteru Ijen s jeho slavnými modrými plameny a relaxaci u vodopádů Tumpak Sewu.",
    itinerary: [
      { day: 1, title: "Příjezd do Surabaye", text: "Transfer do Probolingga, ubytování s výhledem na Bromo." },
      { day: 2, title: "Východ slunce Bromo", text: "Ranní výjezd na viewpoint Penanjakan. Jízda džípem přes moře písku ke kráteru." },
      { day: 3, title: "Tumpak Sewu", text: "Přejezd k vodopádu Tumpak Sewu. Trek do kaňonu." },
      { day: 4, title: "Ijen Blue Fire", text: "Noční trek na Ijen (start ve 2:00). Modré plameny a tyrkysové jezero." },
      { day: 5, title: "Odjezd", text: "Transfer do Surabaye nebo na Bali (ferry)." },
    ],
    included: ["Ubytování (4 noci)", "Snídaně", "Džíp Bromo", "Trek průvodce", "Plynové masky Ijen"],
    excluded: ["Letenky", "Pojištění", "Obědy a večeře"],
    highlights: ["Bromo", "Ijen", "Tumpak Sewu", "Blue Fire"],
    badge: "Nové",
    cover_url: "/images/bromo-cover.jpg",
    gallery_urls: [],
    active: true,
  },
  {
    id: "3",
    slug: "flores-komodo-a-kelimutu",
    title: "Flores – Komodo & Kelimutu",
    area: "Flores",
    duration_days: 10,
    max_persons: 6,
    price_from: 1290,
    currency: "EUR",
    perex:
      "Divoký východ Indonésie: draci z Komodo, tříbarevná jezera Kelimutu a tradiční vesnice.",
    description:
      "Desetidenní expedice na Flores a Komodo. Setkáte se s komodskými draky na ostrově Rinca, uvidíte tříbarevná jezera na sopce Kelimutu, navštívíte tradiční vesnice Wae Rebo a proplouvete krásnými ostrovy Padar a Kanawa.",
    itinerary: [
      { day: 1, title: "Přílet do Labuan Bajo", text: "Transfer, ubytování u přístavu." },
      { day: 2, title: "Komodo boat trip", text: "Celodenní plavba: ostrov Padar, Pink Beach, Komodo / Rinca – draci." },
      { day: 3, title: "Kanawa & šnorchlování", text: "Ostrov Kanawa, korálové útesy, manta rays." },
      { day: 4, title: "Přejezd na Ruteng", text: "Cesta přes Spider Rice Fields do Rutengu." },
      { day: 5, title: "Wae Rebo", text: "Trek do tradiční vesnice Wae Rebo (UNESCO). Nocleh v tradičním domě." },
      { day: 6, title: "Návrat z Wae Rebo", text: "Ranní trek zpět. Přejezd do Bajawa." },
      { day: 7, title: "Bajawa & vesnice", text: "Tradiční vesnice Bena. Horké prameny." },
      { day: 8, title: "Kelimutu", text: "Východ slunce na Kelimutu – tříbarevná jezera." },
      { day: 9, title: "Ende – volný den", text: "Odpočinek, místní trhy." },
      { day: 10, title: "Odlet", text: "Transfer na letiště Ende." },
    ],
    included: ["Ubytování (9 nocí)", "Snídaně", "Boat trip Komodo", "Všechny transfery", "Průvodce", "Trek Wae Rebo"],
    excluded: ["Letenky", "Pojištění", "Obědy a většina večeří"],
    highlights: ["Komodo", "Kelimutu", "Wae Rebo", "Padar", "Pink Beach"],
    badge: "Prémiový",
    cover_url: "/images/flores-cover.jpg",
    gallery_urls: [],
    active: true,
  },
  {
    id: "4",
    slug: "raja-ampat-podvodni-raj",
    title: "Raja Ampat – Podmořský ráj",
    area: "Raja Ampat",
    duration_days: 8,
    max_persons: 6,
    price_from: 1590,
    currency: "EUR",
    perex:
      "Nejkrásnější podmořský svět na planetě. Šnorchlování, potápění a panenské ostrovy.",
    description:
      "Osmidenní výprava do Raja Ampat – podmořského ráje s nejvyšší biodiverzitou na Zemi. Šnorchlování s mantami, potápění u korálových stěn, kajak mezi karpatovými ostrůvky a život na homestay přímo nad vodou.",
    itinerary: [
      { day: 1, title: "Přílet do Sorong", text: "Transfer na speedboat do Waisai, ubytování na homestay." },
      { day: 2, title: "Pianemo viewpoint", text: "Ikonický výhled na karpatové ostrůvky. Šnorchlování." },
      { day: 3, title: "Manta Sandy", text: "Šnorchlování s mantami. Kajak okolo ostrovů." },
      { day: 4, title: "Arborek", text: "Přejezd na Arborek. Podmořská zahrada, žraloci." },
      { day: 5, title: "Potápění", text: "Dva ponory u Cape Kri a Sardine Reef (cert. potápěči)." },
      { day: 6, title: "Misool area", text: "Výlet do jižní oblasti. Skryté laguny." },
      { day: 7, title: "Volný den", text: "Odpočinek, šnorchlování přímo z homestay." },
      { day: 8, title: "Návrat", text: "Speedboat do Sorong, odlet." },
    ],
    included: ["Ubytování (7 nocí, homestay)", "Plná penze", "Speedboat transfery", "Šnorchlování", "Průvodce", "Poplatek Raja Ampat"],
    excluded: ["Letenky do Sorong", "Pojištění", "Potápěčské vybavení", "Tip pro posádku"],
    highlights: ["Raja Ampat", "Pianemo", "Manta Sandy", "Arborek", "Misool"],
    cover_url: "/images/raja-ampat-cover.jpg",
    gallery_urls: [],
    active: true,
  },
  {
    id: "5",
    slug: "sumatra-dzungle-a-orangutani",
    title: "Sumatra – Džungle & Orangutani",
    area: "Sumatra",
    duration_days: 6,
    max_persons: 8,
    price_from: 750,
    currency: "EUR",
    perex:
      "Trek pralesem Gunung Leuser za divokými orangutany. Tobské jezero a Bukit Lawang.",
    description:
      "Šestidenní expedice na Sumatru. Dvoudenní trek pralesem národního parku Gunung Leuser s přenocováním v džungli. Setkání s divokými orangutany, gibony a nosorožci. Relaxace u vulkanického jezera Toba.",
    itinerary: [
      { day: 1, title: "Přílet do Medanu", text: "Transfer do Bukit Lawang." },
      { day: 2, title: "Džungle den 1", text: "Trek pralesem. Orangutani, giboni, makakové. Nocleh v džungli." },
      { day: 3, title: "Džungle den 2", text: "Ranní trek. River tubing zpět do Bukit Lawang." },
      { day: 4, title: "Přejezd k Tobě", text: "Cesta k jezeru Toba. Ubytování na ostrově Samosir." },
      { day: 5, title: "Jezero Toba", text: "Batakovská kultura, tradiční vesnice, horké prameny." },
      { day: 6, title: "Odlet", text: "Transfer zpět do Medanu, odlet." },
    ],
    included: ["Ubytování (5 nocí)", "Snídaně", "Jungle trek + průvodce", "River tubing", "Transfery"],
    excluded: ["Letenky", "Pojištění", "Obědy a večeře"],
    highlights: ["Bukit Lawang", "Orangutani", "Gunung Leuser", "Jezero Toba", "Samosir"],
    cover_url: "/images/sumatra-cover.jpg",
    gallery_urls: [],
    active: true,
  },
];

export function getPackageBySlug(slug: string): Package | undefined {
  return packages.find((p) => p.slug === slug);
}

export function getActivePackages(): Package[] {
  return packages.filter((p) => p.active);
}

export function getAreas(): string[] {
  return [...new Set(packages.map((p) => p.area))];
}
