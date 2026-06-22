import { useState, useEffect, useRef } from 'react';
import { authRegister, authLogin, authLogout, fetchProfile, updateProfile, onAuthStateChange } from './auth.js';
import {
  Menu, X, ShoppingCart, Plus, Minus, Check, MapPin, Phone, Mail,
  Stethoscope, Sparkles, Sun, Wrench, Activity, MessageCircle,
  Zap, Droplets, Wind, Briefcase, Brush, ChevronRight, Calendar, Clock, ArrowRight,
  Package, ShoppingBag, Star, Heart, Trash2, Lock, ArrowLeft, Settings,
  FileText, Upload, Link2, Layers, Tag, Pencil, Boxes, AlertTriangle,
  Percent, Share2, Download, Facebook, Twitter, Instagram, Copy, Linkedin, Send, CalendarOff,
  Image as ImageIcon, ImagePlus, ChevronLeft,
  Search, Newspaper, Users, ClipboardCheck, XCircle, CheckCircle, ChevronDown, Award, HelpCircle, SlidersHorizontal, UserCircle, LogIn
} from 'lucide-react';

const C = {
  paper: '#EEF1EC',
  card: '#FBFAF8',
  ink: '#1C2B27',
  soft: '#5E6F6A',
  pine: '#2F6B5E',
  pineDark: '#1F4A40',
  coral: '#E2745A',
  gold: '#C9A24B',
  line: '#DCE2DC',
};

const SERVICE_ICON_MAP = {
  stethoscope: Stethoscope,
  sparkles: Sparkles,
  sun: Sun,
  wrench: Wrench,
  activity: Activity,
  message: MessageCircle,
  zap: Zap,
  heart: Heart,
  calendar: Calendar,
  smile: Award,
  layers: Layers,
};

const DEFAULT_SERVICES = [
  { id: 's1', name: 'Tannimplantat', duration: '60–90 min', price: 18000, iconKey: 'zap',
    desc: 'Permanent erstatning for manglende tenner med titanskrue forankret i kjevebenet. Inkluderer konsultasjon, innsetting og krone.' },
  { id: 's2', name: 'Implantatbro', duration: '2–3 sesjoner', price: 35000, iconKey: 'layers',
    desc: 'Fast bro støttet av implantater – ideelt ved flere manglende tenner på rad. Gir full tyggefunksjon uten å slipe ned nabotennene.' },
  { id: 's3', name: 'Oralkirurgi', duration: '30–60 min', price: 2500, iconKey: 'activity',
    desc: 'Kirurgisk fjerning av tenner, visdomstenner og røtter. Utføres under lokalbedøvelse av erfarne spesialister.' },
  { id: 's4', name: 'Periodontittbehandling', duration: '60 min', price: 3200, iconKey: 'heart',
    desc: 'Behandling av tannkjøttbetennelse og periodontitt. Inkluderer grundig rens, rotplanering og oppfølgingsprotokoll.' },
  { id: 's5', name: 'Tannprotese / Gebiss', duration: '3–5 besøk', price: 12000, iconKey: 'sparkles',
    desc: 'Hel- og delprotese tilpasset din munn. Vi tilbyr også implantatforankrede proteser for optimal stabilitet.' },
  { id: 's6', name: 'Spesialistkonsultasjon', duration: '45 min', price: 900, iconKey: 'stethoscope',
    desc: 'Grundig klinisk undersøkelse, 3D-røntgen og individuell behandlingsplan. Første steg mot varig tannhelse.' },
];

const PRODUCTS = [
  { id: 'p1', sku: 'IDN-001', name: 'Jordan Clean Smile elektrisk tannbørste', price: 690, icon: Zap, tag: 'Bestselger',
    desc: 'Jordan Elektrisk tannbørste og refillbørster er utviklet i samarbeid med Wilfa. Serien passer med de fleste Oral-B tannbørster, kommer i miljøvennlig emballasje uten plast og har Jordan bust-teknologi. Refillhodene fås kjøpt i dagligvare og faghandel.',
    details: ['Langvarig batteri med rask lading', 'USB-lading', 'Indikator for lite batteri', 'Trykksensor', '2-minutters timer', '2 hastighetsmodus (8 000 / 10 000 omdr./min)', 'Praktisk reiseetui', 'Miljøvennlig emballasje uten plast'] },
  { id: 'p2', sku: 'IDN-002', name: 'Whitening tannkrem 75 ml', price: 89, icon: Sparkles,
    desc: 'Mild, daglig tannkrem med finpolerende partikler som fjerner overflateflekker og bevarer emaljen. Med fluor for kariesbeskyttelse.',
    details: ['75 ml tube', 'Fluorinnhold 1450 ppm', 'Skånsom mot emalje', 'Mintsmak'] },
  { id: 'p3', sku: 'IDN-003', name: 'Tanntråd, 3-pakk', price: 59, icon: Wind,
    desc: 'Vokset tanntråd som glir lett mellom tennene uten å flises opp. Tre ruller i pakken – nok til flere måneders bruk.',
    details: ['3 x 50 m ruller', 'Vokset, flising-fri', 'Smal profil for trange mellomrom'] },
  { id: 'p4', sku: 'IDN-004', name: 'Fluorskyll 500 ml', price: 119, icon: Droplets,
    desc: 'Alkoholfri munnskyll med fluor som styrker emaljen og gir frisk ånde i opptil 12 timer. Brukes daglig etter tannpuss.',
    details: ['500 ml flaske', 'Alkoholfri', 'Fluor for emaljestyrking', 'Frisk ånde i opp til 12 timer'] },
  { id: 'p5', sku: 'IDN-005', name: 'Reisesett – børste, pasta, tråd', price: 249, icon: Briefcase,
    desc: 'Kompakt sett med reisetannbørste, minitube tannkrem og tanntråd i et hardt etui. Perfekt i håndbagasjen eller på kontoret.',
    details: ['Reisetannbørste med beskyttelseshette', 'Tannkrem 20 ml', 'Tanntråd 10 m', 'Hardt reiseetui'] },
  { id: 'p6', sku: 'IDN-006', name: 'Tungeskrape i stål', price: 79, icon: Brush,
    desc: 'Tungeskrape i rustfritt stål som fjerner belegg fra tungen og reduserer dårlig ånde. Tåler oppvaskmaskin.',
    details: ['Rustfritt stål', 'Ergonomisk gripekant', 'Tåler oppvaskmaskin', 'Levetid flere år'] },
  { id: 'p7', sku: 'IDN-007', name: 'Mellomromsbørster, 8-pk', price: 99, icon: Wind,
    desc: 'Mellomromsbørster i tre ulike størrelser for å rengjøre mellom tenner og rundt bruer/implantater. Fargekodet etter størrelse.',
    details: ['8 børster i 3 størrelser', 'Fargekodet for enkel sortering', 'Myk wire som ikke skader tannkjøtt'] },
  { id: 'p8', sku: 'IDN-008', name: 'Hjemmebleking-sett', price: 1490, icon: Sun, tag: 'Nyhet',
    desc: 'Profesjonelt hjemmebleking-sett med individuelt tilpassede skinner og bleking­gel anbefalt av klinikken. Synlig resultat etter 7–10 dager.',
    details: ['Individuelt tilpassede skinner', '4 sprøyter blekingsgel', 'Oppbevaringsetui', 'Synlig effekt etter 7–10 dager'] },
];

const ALL_SLOTS = ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:30','13:00','13:30','14:00','14:30','15:00','15:30'];

function getSlots(dateStr) {
  if (!dateStr) return [];
  let seed = 0;
  for (const c of dateStr) seed += c.charCodeAt(0);
  return ALL_SLOTS.map((t, i) => ({ time: t, free: (seed + i) % 4 !== 0 }));
}

function formatPrice(n) {
  if (n === 0) return 'Gratis';
  return `${n.toLocaleString('nb-NO')} kr`;
}

const ICON_OPTIONS = [
  { key: 'zap', label: 'Strøm / elektrisk', icon: Zap },
  { key: 'sparkles', label: 'Glans / rens', icon: Sparkles },
  { key: 'sun', label: 'Sol / bleking', icon: Sun },
  { key: 'droplets', label: 'Skyll / væske', icon: Droplets },
  { key: 'wind', label: 'Tråd / luft', icon: Wind },
  { key: 'briefcase', label: 'Sett / veske', icon: Briefcase },
  { key: 'brush', label: 'Børste', icon: Brush },
  { key: 'stethoscope', label: 'Klinisk', icon: Stethoscope },
  { key: 'package', label: 'Pakke', icon: Package },
  { key: 'bag', label: 'Handlepose', icon: ShoppingBag },
  { key: 'star', label: 'Stjerne', icon: Star },
  { key: 'heart', label: 'Hjerte', icon: Heart },
];

function getIcon(product) {
  if (product.icon) return product.icon;
  const found = ICON_OPTIONS.find((o) => o.key === product.iconKey);
  return found ? found.icon : Package;
}

function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 90;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }
}

function buildCartKey(productId, variants, selections) {
  if (!variants || variants.length === 0) return productId;
  return productId + '::' + variants.map((g) => `${g.id}=${(selections && selections[g.id]) || ''}`).join('|');
}

function computeVariantDelta(variants, selections) {
  if (!variants) return 0;
  return variants.reduce((sum, g) => {
    const opt = g.options.find((o) => o.label === selections?.[g.id]);
    return sum + (opt?.priceDelta || 0);
  }, 0);
}

function buildVariantLabel(variants, selections) {
  if (!variants || variants.length === 0) return '';
  return variants.map((g) => (selections?.[g.id] ? `${g.name}: ${selections[g.id]}` : null)).filter(Boolean).join(' · ');
}

function defaultSelections(variants) {
  const sel = {};
  (variants || []).forEach((g) => {
    if (g.options && g.options.length) sel[g.id] = g.options[0].label;
  });
  return sel;
}

function getVariantCombinations(variants) {
  if (!variants || variants.length === 0) return [{}];
  let combos = [{}];
  variants.forEach((g) => {
    const next = [];
    combos.forEach((c) => {
      g.options.forEach((o) => {
        next.push({ ...c, [g.id]: o.label });
      });
    });
    combos = next;
  });
  return combos;
}

const LOW_STOCK_THRESHOLD = 5;

const NAV_LINKS = [
  { href: '#tjenester', label: { nb: 'Tjenester', en: 'Services' } },
  { href: '#bestill', label: { nb: 'Bestill time', en: 'Book appointment' } },
  { href: '#nettbutikk', label: { nb: 'Nettbutikk', en: 'Shop' } },
  { href: '#team', label: { nb: 'Om oss', en: 'About us' } },
  { href: '#nyheter', label: { nb: 'Nyheter', en: 'News' } },
  { href: '#faq', label: { nb: 'FAQ', en: 'FAQ' } },
  { href: '#kontakt', label: { nb: 'Kontakt', en: 'Contact' } },
];

const TRANSLATIONS = {
  heroEyebrow: { nb: 'Lørenskog · Spesialistklinikk', en: 'Lørenskog · Specialist clinic' },
  heroTitle1: { nb: 'Tannhelse som varer', en: 'Dental health that lasts' },
  heroTitle2: { nb: 'livet ut.', en: 'a lifetime.' },
  heroLead: {
    nb: 'Infinitum Dental er en spesialistklinikk i Lørenskog med ekspertise innen tannimplantater, oralkirurgi og periodontittbehandling. Vi kombinerer avansert diagnostikk med individuelt tilpassede behandlingsplaner.',
    en: 'Infinitum Dental is a specialist clinic in Lørenskog with expertise in dental implants, oral surgery and periodontitis treatment. We combine advanced diagnostics with individually tailored treatment plans.',
  },
  heroBook: { nb: 'Bestill time', en: 'Book appointment' },
  heroShop: { nb: 'Se nettbutikk', en: 'Visit shop' },
  whatsappUs: { nb: 'WhatsApp', en: 'WhatsApp' },
  servicesLabel: { nb: 'Tjenester', en: 'Services' },
  servicesTitle: { nb: 'Behandlinger vi tilbyr', en: 'Treatments we offer' },
  servicesLead: {
    nb: 'Fra rutinekontroll til mer omfattende behandling – timene kan bestilles direkte under, og du velger selv behandling, dato og klokkeslett.',
    en: 'From routine check-ups to more extensive treatment – book directly below, choosing treatment, date and time yourself.',
  },
  bookLabel: { nb: 'Bestill time', en: 'Book appointment' },
  bookTitle: { nb: 'Finn et tidspunkt som passer', en: 'Find a time that suits you' },
  bookLead: {
    nb: 'Velg behandling, dato og ledig tid. Du får en bekreftelse med en referansekode med en gang.',
    en: 'Choose treatment, date and an available time. You get a confirmation with a reference code right away.',
  },
  fieldTreatment: { nb: 'Behandling', en: 'Treatment' },
  fieldPractitioner: { nb: 'Behandler', en: 'Practitioner' },
  anyPractitioner: { nb: 'Første ledige', en: 'First available' },
  fieldDate: { nb: 'Dato', en: 'Date' },
  fieldTimes: { nb: 'Ledige tider', en: 'Available times' },
  fieldName: { nb: 'Navn', en: 'Name' },
  fieldPhone: { nb: 'Telefon', en: 'Phone' },
  fieldEmail: { nb: 'E-post (valgfritt)', en: 'Email (optional)' },
  pickDate: { nb: 'Velg en dato for å se ledige tider.', en: 'Select a date to see available times.' },
  confirmBooking: { nb: 'Bekreft time', en: 'Confirm appointment' },
  closedThatDay: { nb: 'Stengt denne dagen', en: 'Closed that day' },
  chooseAnotherDate: { nb: 'Velg en annen dato.', en: 'Please choose another date.' },
  shopLabel: { nb: 'Nettbutikk', en: 'Shop' },
  shopTitle: { nb: 'Til hjemmetannpleien', en: 'For home dental care' },
  shopLead: {
    nb: 'Produkter vi selv bruker og anbefaler i klinikken – legg i kurv og betal ved henting eller få sendt hjem.',
    en: 'Products we use and recommend at the clinic – add to cart and pay on pickup or have them shipped.',
  },
  searchPlaceholder: { nb: 'Søk i nettbutikken…', en: 'Search the shop…' },
  brandLabel: { nb: 'Merke:', en: 'Brand:' },
  all: { nb: 'Alle', en: 'All' },
  addToCart: { nb: 'Legg i kurv', en: 'Add to cart' },
  chooseVariant: { nb: 'Velg variant', en: 'Choose variant' },
  soldOut: { nb: 'Utsolgt', en: 'Sold out' },
  teamLabel: { nb: 'Om oss', en: 'About us' },
  teamTitle: { nb: 'Teamet bak Infinitum Dental', en: 'The team behind Infinitum Dental' },
  teamLead: {
    nb: 'Et spesialisert team med høy faglig kompetanse innen implantologi, oralkirurgi og periodontologi.',
    en: 'A specialist team with deep expertise in implantology, oral surgery and periodontology.',
  },
  newsLabel: { nb: 'Nyheter', en: 'News' },
  newsTitle: { nb: 'Siste fra klinikken', en: 'Latest from the clinic' },
  newsLead: { nb: 'Kampanjer, åpningstider og annet nytt fra Infinitum Dental.', en: 'Campaigns, opening hours and other news from Infinitum Dental.' },
  readMore: { nb: 'Les mer', en: 'Read more' },
  myBookingsLabel: { nb: 'Mine bestillinger', en: 'My bookings' },
  myBookingsTitle: { nb: 'Sjekk status på timen din', en: 'Check your appointment status' },
  myBookingsLead: {
    nb: 'Skriv inn referansekoden du fikk etter bestilling, sammen med telefonnummeret du oppga.',
    en: 'Enter the reference code you received after booking, along with the phone number you provided.',
  },
  refPlaceholder: { nb: 'Referanse, f.eks. INF-AB12C', en: 'Reference, e.g. INF-AB12C' },
  checkStatus: { nb: 'Sjekk status', en: 'Check status' },
  faqLabel: { nb: 'FAQ', en: 'FAQ' },
  faqTitle: { nb: 'Ofte stilte spørsmål', en: 'Frequently asked questions' },
  waitlistTitle: { nb: 'Sett deg på venteliste', en: 'Join the waiting list' },
  waitlistLead: {
    nb: 'Får du ikke en tid som passer? Sett deg på venteliste, så kontakter vi deg hvis en tidligere time blir ledig.',
    en: "Can't find a suitable time? Join the waiting list and we'll contact you if an earlier slot opens up.",
  },
  waitlistJoin: { nb: 'Sett meg på venteliste', en: 'Add me to the waiting list' },
  waitlistDone: {
    nb: 'Du er nå på ventelisten. Vi tar kontakt hvis en tidligere time blir ledig.',
    en: "You're now on the waiting list. We'll be in touch if an earlier slot opens up.",
  },
  waitlistNote: { nb: 'Kommentar (valgfritt) – f.eks. når du helst vil ha time', en: 'Note (optional) – e.g. preferred time' },
  bookAnother: { nb: 'Bestill en ny time', en: 'Book another appointment' },
  apptConfirmed: { nb: 'Time bekreftet', en: 'Appointment confirmed' },
  contactLabel: { nb: 'Kontakt', en: 'Contact' },
  hours: { nb: 'Åpningstider', en: 'Opening hours' },
  featuredTitle: { nb: 'Anbefalte produkter', en: 'Featured products' },
  offersTitle: { nb: 'På tilbud nå', en: 'On sale now' },
  freeShipDone: { nb: 'Du har fri frakt! 🎉', en: 'You qualify for free shipping! 🎉' },
  freeShipLeft: { nb: 'Handle for {x} til for fri frakt', en: 'Spend {x} more for free shipping' },
  checkout: { nb: 'Til kassen', en: 'Checkout' },
  delivery: { nb: 'Levering', en: 'Delivery' },
  pickup: { nb: 'Hent i klinikken (gratis)', en: 'Pick up at the clinic (free)' },
  shipHome: { nb: 'Hjemlevering', en: 'Home delivery' },
  subtotal: { nb: 'Delsum', en: 'Subtotal' },
  shipping: { nb: 'Frakt', en: 'Shipping' },
  free: { nb: 'Gratis', en: 'Free' },
  total: { nb: 'Totalt', en: 'Total' },
  placeOrder: { nb: 'Fullfør bestilling', en: 'Place order' },
  deliveryAddress: { nb: 'Leveringsadresse', en: 'Delivery address' },
  backToCart: { nb: 'Tilbake til kurv', en: 'Back to cart' },
};

function tr(key, lang) {
  const entry = TRANSLATIONS[key];
  if (!entry) return key;
  return entry[lang] || entry.nb;
}

const DEFAULT_CATEGORIES = [
  { id: 'cat-tannborster', name: 'Tannbørster' },
  { id: 'cat-tannkrem', name: 'Tannkrem' },
  { id: 'cat-munnskyll', name: 'Munnskyll' },
  { id: 'cat-tanntrad', name: 'Tanntråd' },
  { id: 'cat-bleking', name: 'Bleking' },
  { id: 'cat-reise', name: 'Reisesett & tilbehør' },
];

const DEFAULT_CATEGORY_MAP = {
  p1: ['cat-tannborster'],
  p2: ['cat-tannkrem', 'cat-bleking'],
  p3: ['cat-tanntrad'],
  p4: ['cat-munnskyll'],
  p5: ['cat-reise'],
  p6: ['cat-tannborster', 'cat-reise'],
  p7: ['cat-tannborster', 'cat-tanntrad'],
  p8: ['cat-bleking'],
};

const DEFAULT_VARIANTS = {
  p1: [
    {
      id: 'g-color',
      name: 'Farge',
      options: [
        { label: 'Svart', priceDelta: 0 },
        { label: 'Rosa', priceDelta: 0 },
      ],
    },
  ],
  p8: [
    {
      id: 'g-strength',
      name: 'Styrke',
      options: [
        { label: 'Standard', priceDelta: 0 },
        { label: 'Ekstra sterk', priceDelta: 200 },
      ],
    },
  ],
};

const DEFAULT_STOCK = {
  'p1::g-color=Svart': 10,
  'p1::g-color=Rosa': 8,
  p2: 40,
  p3: 60,
  p4: 25,
  p5: 2,
  p6: 0,
  p7: 30,
  'p8::g-strength=Standard': 15,
  'p8::g-strength=Ekstra sterk': 8,
};

const DEFAULT_DISCOUNTS = {
  p1: 15,
  p2: 20,
  p4: 10,
};

function applyDiscount(price, pct) {
  if (!pct) return price;
  return Math.round(price * (1 - pct / 100));
}

function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 3) {
  const words = text.split(' ');
  let line = '';
  let lines = [];
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    lines = lines.slice(0, maxLines);
    lines[maxLines - 1] = lines[maxLines - 1].replace(/\s*\S*$/, '…');
  }
  lines.forEach((l, i) => ctx.fillText(l, x, y + i * lineHeight));
  return lines.length;
}

function generateShareCard(product, price, discountPct, originalPrice) {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, 1080, 1080);
  grad.addColorStop(0, C.pine);
  grad.addColorStop(1, C.pineDark);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1080, 1080);

  // Decorative infinity mark
  ctx.save();
  ctx.translate(540, 880);
  ctx.scale(2.4, 2.4);
  ctx.translate(-200, -110);
  const infinityPath = new Path2D('M100,110 C100,40 200,40 200,110 C200,180 300,180 300,110 C300,40 200,40 200,110 C200,180 100,180 100,110 Z');
  ctx.strokeStyle = 'rgba(201,162,75,0.22)';
  ctx.lineWidth = 14;
  ctx.stroke(infinityPath);
  ctx.restore();

  ctx.textBaseline = 'alphabetic';

  // Eyebrow
  ctx.fillStyle = C.gold;
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText('INFINITUM DENTAL', 80, 100);

  let nameY = 240;
  if (discountPct) {
    roundRectPath(ctx, 80, 140, 160, 64, 32);
    ctx.fillStyle = C.coral;
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText(`-${discountPct}%`, 116, 184);
    nameY = 320;
  }

  // Product name
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 68px Georgia, serif';
  const lineCount = wrapCanvasText(ctx, product.name, 80, nameY, 920, 80, 3);

  // Price
  const priceY = nameY + lineCount * 80 + 60;
  if (discountPct) {
    ctx.font = '40px sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    const origText = formatPrice(originalPrice);
    ctx.fillText(origText, 80, priceY);
    const w = ctx.measureText(origText).width;
    ctx.strokeStyle = 'rgba(255,255,255,0.55)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(76, priceY - 14);
    ctx.lineTo(80 + w + 4, priceY - 14);
    ctx.stroke();

    ctx.font = 'bold 72px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(formatPrice(price), 80, priceY + 80);
  } else {
    ctx.font = 'bold 72px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(formatPrice(price), 80, priceY);
  }

  // Footer
  ctx.fillStyle = 'rgba(255,255,255,0.65)';
  ctx.font = '30px sans-serif';
  ctx.fillText('infinitumdental.no · Lørenskog', 80, 1000);

  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
}

const DEFAULT_TEAM = [
  { id: 't1', name: 'Dr. Maria Eriksen', role: 'Spesialist i oral kirurgi', iconKey: 'stethoscope', bookable: true,
    bio: 'Spesialist i oral kirurgi med over 10 års erfaring innen tannimplantater og kjevekirurgi. Utdannet ved Universitetet i Oslo og spesialisert ved internasjonale sentre.' },
  { id: 't2', name: 'Dr. Amir Khalid', role: 'Implantatspesialist', iconKey: 'stethoscope', bookable: true,
    bio: 'Implantatspesialist med kompetanse i avanserte implantatsystemer, beinoppbygging og full-munn rehabilitering.' },
  { id: 't3', name: 'Lisa Haugen', role: 'Spesialist i periodontologi', iconKey: 'sparkles', bookable: true,
    bio: 'Spesialist i tannkjøttsykdommer (periodontologi). Behandler periodontitt, tannkjøttkirurgi og forebyggende periodontologi.' },
  { id: 't4', name: 'Nora Aas', role: 'Klinikkkoordinator', iconKey: 'heart', bookable: false,
    bio: 'Koordinerer behandlingsforløp, timebestillinger og pasientoppfølging. Første kontaktpunkt for nye pasienter.' },
];

const DEFAULT_NEWS = [
  {
    id: 'n1',
    title: 'Velkommen til vår nye nettside',
    date: '2026-06-01',
    excerpt: 'Vi har lansert ny nettside med online timebestilling og nettbutikk – nå er det enklere enn aldri å holde tannhelsen i sjakk.',
    content: 'Vi er glade for å lansere vår nye nettside! Her kan du bestille time direkte, handle tannhelseprodukter i nettbutikken, og følge med på nyheter fra klinikken. Vi jobber kontinuerlig med å gjøre tjenestene våre mer tilgjengelige, og denne nettsiden er et viktig steg i den retningen. Ta gjerne en titt rundt, og ikke hesiter med å ta kontakt om du har spørsmål.',
  },
  {
    id: 'n2',
    title: 'Nye åpningstider fra august',
    date: '2026-07-15',
    excerpt: 'Fra august utvider vi åpningstidene på mandager og tirsdager for å møte økt etterspørsel.',
    content: 'Fra og med august vil klinikken ha utvidet åpningstid på mandager og tirsdager, slik at det blir enklere å få en avtale som passer rundt jobb og skole. De nye åpningstidene vil bli oppdatert i kontaktinformasjonen på siden. Vi ser frem til å ta godt vare på tennene dine, også utenom vanlig kontortid!',
  },
  {
    id: 'n3',
    title: 'Sommerkampanje på elektriske tannbørster',
    date: '2026-06-20',
    excerpt: 'I juni og juli har vi 15% rabatt på vår Infinitum Sonic eltannbørste – perfekt for ferien.',
    content: 'For å gjøre sommeren litt friskere har vi satt ned prisen på vår populære Infinitum Sonic eltannbørste med 15%. Den er tilgjengelig i tre farger og passer perfekt som reisevenn. Kampanjen finner du i nettbutikken under "Tannbørster".',
  },
];

const DEFAULT_BRANDS = [
  { id: 'brand-jordan', name: 'Jordan', iconKey: 'zap' },
  { id: 'brand-philips', name: 'Philips', iconKey: 'zap' },
  { id: 'brand-oralb', name: 'Oral-B', iconKey: 'brush' },
  { id: 'brand-siemens', name: 'Siemens', iconKey: 'stethoscope' },
  { id: 'brand-3m', name: '3M', iconKey: 'package' },
  { id: 'brand-gc', name: 'GC', iconKey: 'droplets' },
  { id: 'brand-colgate', name: 'Colgate', iconKey: 'sparkles' },
  { id: 'brand-infinitum', name: 'Infinitum Dental', iconKey: 'star' },
];

const DEFAULT_BRAND_MAP = {
  p1: 'brand-jordan',
  p2: 'brand-colgate',
  p3: 'brand-oralb',
  p4: 'brand-gc',
  p5: 'brand-infinitum',
  p6: 'brand-oralb',
  p7: 'brand-oralb',
  p8: 'brand-infinitum',
};

const DEFAULT_PRODUCT_IMAGES = {
  p1: [
    { type: 'url', value: 'https://www.jordanoralcare.com/wp-content/uploads/2020/10/jordan_clean_smile_1.jpg' },
    { type: 'url', value: 'https://www.jordanoralcare.com/wp-content/uploads/2020/10/jordan_clean_smile_2.jpg' },
  ],
};

const SORT_OPTIONS = [
  { value: 'standard', label: 'Standard' },
  { value: 'price-asc', label: 'Pris: Lav til høy' },
  { value: 'price-desc', label: 'Pris: Høy til lav' },
  { value: 'newest', label: 'Nyeste først' },
  { value: 'name-asc', label: 'Navn: A–Å' },
  { value: 'name-desc', label: 'Navn: Å–A' },
];

function getAddedAt(product, index) {
  if (typeof product.id === 'string' && product.id.startsWith('c')) {
    const ts = parseInt(product.id.slice(1), 10);
    if (!Number.isNaN(ts)) return ts;
  }
  return index;
}

const DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const DAY_LABELS = { mon: 'Mandag', tue: 'Tirsdag', wed: 'Onsdag', thu: 'Torsdag', fri: 'Fredag', sat: 'Lørdag', sun: 'Søndag' };

const DEFAULT_SETTINGS = {
  phone: '67 00 00 00',
  whatsapp: '4767000000',
  email: 'post@infinitumdental.no',
  address: 'Senterveien 4, 1470 Lørenskog',
  hours: {
    mon: '08:00–16:00',
    tue: '08:00–16:00',
    wed: '08:00–16:00',
    thu: '08:00–16:00',
    fri: '08:00–14:00',
    sat: 'Stengt',
    sun: 'Stengt',
  },
  bannerEnabled: true,
  bannerText: 'Gratis spesialistkonsultasjon for nye pasienter denne måneden – bestill i dag!',
  freeShippingThreshold: 499,
  shippingCost: 59,
};

const DEFAULT_FEATURED = ['p1', 'p3', 'p6'];

function getWeekdaySummary(hours) {
  const days = ['mon', 'tue', 'wed', 'thu', 'fri'];
  const allSame = days.every((d) => hours[d] === hours.mon);
  return allSame ? `Man–fre ${hours.mon}` : 'Se åpningstider';
}

function whatsappLink(number, text) {
  const digits = (number || '').replace(/\D/g, '');
  const base = `https://wa.me/${digits}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

const LEGAL_PAGES = {
  vilkar: {
    title: 'Salgsvilkår',
    body: 'Disse vilkårene gjelder for kjøp av varer i nettbutikken til Infinitum Dental. Ved å gjennomføre en bestilling bekrefter du at du har lest og godtatt vilkårene.\n\nPriser oppgis i norske kroner inkludert merverdiavgift. Vi tar forbehold om feil i pris- og produktinformasjon. Avtalen er bindende for begge parter når bestillingen er bekreftet.\n\nBetaling skjer ved henting i klinikken eller via godkjent betalingsløsning ved hjemlevering. Levering skjer enten ved henting i klinikken (Senterveien 4, Lørenskog) eller som sending til oppgitt adresse.\n\nDette er et utkast til salgsvilkår for en demoløsning og må gjennomgås og tilpasses av en fagperson før butikken settes i ordinær drift.',
  },
  personvern: {
    title: 'Personvernerklæring',
    body: 'Infinitum Dental behandler personopplysninger i tråd med personvernforordningen (GDPR) og norsk personopplysningslov.\n\nVi samler kun inn opplysninger som er nødvendige for å levere tjenestene våre – som navn, telefonnummer, e-post og bestillingsinformasjon. Opplysningene brukes til timebestilling, ordrebehandling og nødvendig oppfølging.\n\nVi deler ikke personopplysninger med tredjeparter ut over det som er nødvendig for å levere tjenesten (f.eks. betalings- og fraktleverandør). Du har rett til innsyn, retting og sletting av egne opplysninger.\n\nDette er et utkast til personvernerklæring for en demoløsning og må gjennomgås og tilpasses av en fagperson før butikken settes i ordinær drift.',
  },
  angrerett: {
    title: 'Angrerett',
    body: 'Ved kjøp av varer i nettbutikken har du som forbruker 14 dagers angrerett i henhold til angrerettloven.\n\nAngrefristen løper fra den dagen du mottar varen. For å bruke angreretten må du gi oss melding innen fristen, for eksempel via e-post eller telefon. Varen skal returneres i tilnærmet samme stand og mengde som du mottok den.\n\nEnkelte varer kan av hygieniske årsaker være unntatt angreretten dersom forseglingen er brutt. Dette gjelder typisk åpnede munnhygieneprodukter.\n\nDette er et utkast til angrerettsinformasjon for en demoløsning og må gjennomgås og tilpasses av en fagperson før butikken settes i ordinær drift.',
  },
};

const DEFAULT_FAQ = [
  { id: 'f1', question: 'Hva koster et tannimplantat?', answer: 'Et enkeltimplantat starter fra 18 000 kr inkl. krone. Prisen varierer etter antall implantater og behov for beinoppbygging. Vi gir alltid en skriftlig behandlingsplan med priser før oppstart.' },
  { id: 'f2', question: 'Er tannimplantat smertefullt?', answer: 'Innsetting av implantat utføres under lokalbedøvelse og er normalt ikke smertefull under inngrepet. De fleste pasienter rapporterer mild ømhet i 2–3 dager etterpå, som håndteres med vanlige smertestillende.' },
  { id: 'f3', question: 'Hvem kan få tannimplantater?', answer: 'De fleste voksne med god allmenntilstand kan få tannimplantater. Faktorer som røyking, ukontrollert diabetes og utilstrekkelig kjevevolum vurderes individuelt. Vi gjør alltid en grundig undersøkelse med 3D-røntgen før behandlingsstart.' },
  { id: 'f4', question: 'Hva er periodontitt?', answer: 'Periodontitt er en bakteriebetennelse som angriper tannkjøttet og kjevebenet rundt tennene. Ubehandlet kan det føre til tannløsning. Vi tilbyr grundig behandling og oppfølgingsprogram.' },
  { id: 'f5', question: 'Tar dere mot pasienter henvist fra andre tannleger?', answer: 'Ja, vi tar imot henvisninger fra tannleger for spesialistbehandling innen implantologi, oralkirurgi og periodontologi. Ta kontakt for samarbeidsavtale.' },
  { id: 'f6', question: 'Hva er forskjellen på bro og implantat?', answer: 'En bro er festet på nabotennene og krever at disse slipes ned. Et implantat er selvstendig og bevarer nabotennene intakt. Implantater varer gjerne livet ut med riktig stell, og er som regel det beste valget på sikt.' },
];

const DEFAULT_EMAIL_TEMPLATES = {
  booking: {
    subject: 'Bekreftelse: time hos Infinitum Dental ({{ref}})',
    body: 'Hei {{name}},\n\nDin time er bekreftet:\n\nBehandling: {{service}}\nDato: {{date}}\nKlokkeslett: {{time}}\nReferanse: {{ref}}\n\nGi oss beskjed minst 24 timer i forveien dersom du må avbestille.\n\nVi sees!\nInfinitum Dental\n{{address}} · {{phone}}',
  },
  order: {
    subject: 'Bekreftelse på din bestilling – Infinitum Dental',
    body: 'Hei,\n\nTakk for din bestilling på {{total}}:\n\n{{items}}\n\nVi tar kontakt når bestillingen er klar for henting.\n\nInfinitum Dental\n{{address}} · {{phone}}',
  },
};

function fillTemplate(template, vars) {
  return (template || '').replace(/\{\{(\w+)\}\}/g, (match, key) => (vars[key] !== undefined ? vars[key] : match));
}

const DEFAULT_CLOSED_DATES = [
  { id: 'closed1', type: 'single', date: '2026-12-24', label: 'Julaften' },
  { id: 'closed2', type: 'single', date: '2026-12-25', label: '1. juledag' },
  { id: 'closed3', type: 'single', date: '2026-12-26', label: '2. juledag' },
  { id: 'closed4', type: 'single', date: '2027-01-01', label: 'Nyttårsdag' },
  { id: 'closed5', type: 'range', start: '2026-07-13', end: '2026-08-02', label: 'Sommerferie' },
];

function isWeekdayClosed(dateStr, hours) {
  const day = new Date(`${dateStr}T00:00:00`).getDay();
  const dayKey = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][day];
  return (hours?.[dayKey] || '').toLowerCase().includes('stengt');
}

function getClosureReason(dateStr, closedDates, hours) {
  if (!dateStr) return null;
  if (isWeekdayClosed(dateStr, hours)) {
    const day = new Date(`${dateStr}T00:00:00`).getDay();
    const dayKey = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][day];
    return `Stengt på ${DAY_LABELS[dayKey].toLowerCase()}er`;
  }
  for (const c of closedDates || []) {
    if (c.type === 'single' && c.date === dateStr) return c.label || 'Stengt';
    if (c.type === 'range' && dateStr >= c.start && dateStr <= c.end) return c.label || 'Stengt';
  }
  return null;
}

const MAX_IMAGE_FILE_BYTES = 400 * 1024; // 400 KB per uploaded image
const MAX_IMAGES_PER_PRODUCT = 4;

function normalizeCategoryMap(raw) {
  const out = {};
  Object.entries(raw || {}).forEach(([pid, val]) => {
    out[pid] = Array.isArray(val) ? val : [val];
  });
  return out;
}

function InfinityMark({ size = 28 }) {
  return (
    <img
      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAIAAAC2BqGFAAABCGlDQ1BJQ0MgUHJvZmlsZQAAeJxjYGA8wQAELAYMDLl5JUVB7k4KEZFRCuwPGBiBEAwSk4sLGHADoKpv1yBqL+viUYcLcKakFicD6Q9ArFIEtBxopAiQLZIOYWuA2EkQtg2IXV5SUAJkB4DYRSFBzkB2CpCtkY7ETkJiJxcUgdT3ANk2uTmlyQh3M/Ck5oUGA2kOIJZhKGYIYnBncAL5H6IkfxEDg8VXBgbmCQixpJkMDNtbGRgkbiHEVBYwMPC3MDBsO48QQ4RJQWJRIliIBYiZ0tIYGD4tZ2DgjWRgEL7AwMAVDQsIHG5TALvNnSEfCNMZchhSgSKeDHkMyQx6QJYRgwGDIYMZAKbWPz9HbOBQAAAjFklEQVR42u1dd2BV1f3/nnHvffftbLJICFNAEETABVq0uHAA/uqoVdtqtdW668CKCIqtuNs6at3UgaPuxRIQhLDDTgiEECA77+XNe+855/fHSR4pZLyQF0bl8k9I3jvjc77f7/nuizjncPzp/gcnZBSE0LG17UQtOM5xEELoOEUfSxR92B4hRMsfjiFOwscoy8sfYrgf8PNxoDtNuf8D94RcGD7KKfd/4JFEg+H40+65Jkoi4eM02z6aB6/z0FaOj8K9HSUDJnYi/D8jEFvu4ijUQPBhW9bh3PxRSDr4p7z5Ywbonzh2hw/oo0EUHoWH3eqSjnk9uuuH3dYIbf2+w6Nt9YvHDZY2gTvYndLh0banjx/gJhVCdCszCvlPCEAgV4XknrpZBAiJQQskUOImjQe0TvijEUJyxPbtqLb+yoXgnBNCcBtrshhDCBAkEnMuBBccAyKEtHrsFmcAgDEGAd161IfD8c84JxjH4Kv1+/bW19UG/BHLJAi5dHsPT1JWcqpCaQvEEe7avuW+YvgGI5E99TVVvoZgJIwwdmp6ZlJyTkoqJfsnxRijbuPsbgE6tkouOAKEMQaAlSVbv1z149KtRSV7dvsCgbBlMCEwRkQgl67npKYP6lkwftjIcUNOTnV7mnZ+SMzNhQAhJMQ7q/d9u2bF/KI1m8vLqnx1wUjI4gwAE0Lcmp6TmnZy734Xjjj9nJNGaFQBIRjncrXHEkUzzikhAPDJ8iUvfvPJsm2bguGQQoiqKBSTGPkwzgUIw2JRM4oQ7pmSdumoM28Yf3G/rFwJN+nMzmOTrijZ/NLXn369enmVv4EgrCqKSglGGCMQokmOGZYVNQ2KyeD8ghvPvfi6cedTQjo74xEGWorjdWWlU956+bt1hRRjh00nCDPOueAH0D4ChBBIUoqaZiAcSna5rx93wT2XXZXicsdJ2kIIAYJgsqNq34w5b3y4dGHYMJw2XSFUIOCcy9tjv0wQAmGMEQYQYSMaikROGzB41vV/OKXvCd2BdbcAzYUgGL/0zWdT3n4pGI147A4BwBhrmhIAIYyx3DhCSDI7CGgKA2KETGb5gsF+PXIev+6mi0eeIYRoX2hyITBGCNCrc794+N1XKxvqvQ4nQojFdocQQaj5rkbyXETzpBhjjJA/FLQp6qxrf3/9uRcmHOsEAy1ACCEIJve++cKTH7/ndTolMwIAQoARYZyFjahhmpzzGGUpCtVtNo0qQgDjnHOOEaKEhqIR0zJvvXDSjGtuVAhlnGGE2xIXEcO47V/Pvzb3c5duVxXFYlyAQIAIQkxwwzKjpmVZZmzjlBK7pmmKKsUIABBMGGe+YGD61TfcO/Eqi1kEk6MUaLnne15/YdZHb2ckJTPRRDmUEJOxxnBIV9T+OXmDc/Nyk9M9LnckGqmsqymp2rOloqyitg4T4tJ1ECDFC8EEgNf66i845YxXb70/1e05mNDkjNV+3zVPz5i3tjDV62WMCQABQDC2mNUYCmmKWtAje1BOXkF6ZrLbw5hV6asv2VtRtHP77voaXdPsqs3iTDINRrjGX//k9bfeNmFyAuk6kQaL3PPTn31wz7+eT3W7LM4FIACgmDQEG5Nc3qvOHPd/Z/5seEFflSoHfHdvbc3CjeveWzxv3vpVXHCXrjPBhEAIgFJa1+gfklfw/r3Te6Vntty8nLGirmbyX/+8ZntxstNlWKYUBQihhkCjx+6YeOrYK848Z0SfAU6b7cBJ62o+LVz6wlcfb67YleRw8mYBhRDyB0Mf3jf9gpNHM8YSoockjKLl7bdkc9EF0+6xqQrnPLbohmDw0tFjZlz9m/7ZPWNKa0srjWAc28yC9atnfvDWwqI1bqedYMK5EAhRTPzhQK+MrI/ve7RfVq7FGCVEqud76msvfvT+Tbt2eJ1Ow7JACIKxYZoRy/i/08fdO/Hqgbl5TafCGG82RqVZJA/MFwpOf/+NF7782KHrCIBzgTGOWmaay71o5j8yvElCCNxaQKtTbpbEAC2t27BpnvPgHzeU77RrmsUYAsCA/OHQ1Cuvv3/yNQBgWhZGCLWwC1pyEhcCI4Qx5kL87fMPHnnvddMy7DbdZBwAFEobw6Hc1IzPpjzeJzPbZJZCaG2g8eJH71u9fWuSw2VYJiCkYOILBdJd3lm/uXXyaWNjh4oRPphThRCMc2kovTb3y9teeVZXNSGEQKAQUu33XT/u/Jd//yfGmVSNjpibtCU5Y4xfnftFYclWp25nnCOECCENwcbHr735/snXWIwxzijZrz4fQA6SvhBCFmMgxB8nXP71w08VZOTUBwIKVeTvXbq9vKZq4uMPlFVXUkzqAo2/emr6qpItSc0Sg2JcF/AN69X3uxnPTD5trMUYY5xgTDBpVR4ihCghnHPTsq4/54Inr7/FFwpgQgDAZCzZ6Xp38dxVpdskYx1Jf3SMnAnGjZHwy9985tBtnDMpl+sDjTeef8ntF19uWhZu0lg79plJuE3LGtGn/zfTnho7eFid3yd53GLMpesle/dM/uufI6bx6rdffLliSbrbaxgmACiE1Ph85w495YupT/TNzDGZRTBujXlah9u0rBvGT7h+3IUNwUaKCQBghKOm9fxnc6TKdOSBlorad2sLiyt26arGhcAIh6KRflk9H7vmJknsqJN+ZKkUpnuTPrr/0QuGj6oLNEp7z2LM63Cu27n9F3+deu0555924knVDQ0KJgqltX7fhSNGz7l3htfutBijndTMMMZc8Eeu/m1OclrEMhFCTHCnzf7d2sKymiqCCe+a4zsR9ylCAPDp8iVSVgMAxihoRG6bMMmt2xnnuA22bX9YgjFjzKHZ3vnTtAuGjar1+xRCAcBkVqrT/fmqHx774M05dz2S7k02gPn8/jGDTnrn7mm6qrJD0skwQpyLNLfnxvMuCYRCFGEhhEpplb/hm1XLY16qIwa0lBuBSGRVyVabqnIhEEJRw+iV0WPS6WcLIbqih2KMGWOaos6+66GzBg+rDzbRtcmsHt7kZz5+55PCxd9Of8rnb+yf0/Odex6Wl/Aha2NSkbhyzLgMT5LBLARIgKAYzytaKU+iK1GFLgMtBACUVlbsqatRCRWcY0ChSOT0AUOSHa795l8XsOaMOWz623dOPSGrZ2M4JK01k/H0lLTbX/9beeW+Lx+a9cptD6a5vV20L6RhnpuSPnrAoEAkgjESAjRFLSoraYyECSECxCHgk5gkRwl0eXVVKBpBGAsAhIALPrz3ACE9ll1+MMYWs9I9nvfvnZ7q8kaMaBPNCuFU9CufnNY7O+fkgj6mZVFCuigDmeAAcMbAIYwzBIgLrlClsr6hrHIfABzabhKV5CgAoC7QyDiXVoAAIAiyU1JR4kLUGGEheJ/M7DdvnyKDJgiAC0EpiQp28aP37amrUSiVLqSuTCqV5SH5vVWqcBBS6QwZ0d11VdC1QHBi9GjGGYrpQAIAY7U5XBL/mbf1SLH79qL5Z99/y5kDh7x4890Nfr8kas65Q9W27yn/9XMzo6Yp0T9gtM7ZbwgBQM+0DJduZ4yBEFKFr6yvi1FVPBK5O4BGAOCw6TE1GSHEuaht9MWzsg7XZ3GmULpgw9o7X33u+03rrnhy2lVjzrlv4i9rGv1Ks8KX7PLM37Dm9y8+iTEWBwHdqkHY3mYAPHanU9e5aAojCiF84VA8oqOdzAWaAJgB0lxeSinfX2ACxRXlCWEUhdA1pSVXP/WIZZpZaRnvL5rbw+159sY7Svbs/nDF4lSPx7Qsk1kpLvebC79O93hn/uomizHc7uG1J1sQAIBGFY1QLjgAkb80OYtTaWnrT12laLno/B6ZbodTRpQ55yqly7ZsEELgLvhzLcYooVsrdl/+lwcbQ0FNVSPRSGZKyt++/mjWB2+/evuUkwv6NTTuN2RS3UmzPnlvxvtvUkJ48447LUZEk06NEd7/WdExMR/MSZ0WHe1/Xx5jTkpaQUZm1IoihDgIh66v2VG8ekcxQiAvqM5eIxZjCqUl+youe/z+fb46h83GGEMIMYurRPG4PLqmzr7jzzkp6YFIWKp0jFkpbs/0OW88OudNSkirQZk470mLMcMy938WgUbV/fzbWS6Jk6I7XBzjnGJ89pBhEcMgGEmFLGIYz3zyHgIE0Ok6NYnypvJdE2bcV15d6bTZGeeAEMG4NuCbfuVvbxg/IWqaBVnZ/777IYdii1oWxpgDcM6THM5p7702ZfY/peuVxWfOCSEsxliz6yhiGlHLRICg2avq1u1dVIITYYIDAMCkU89y6XbGmXS9epyuD35Y8MnyJZRQk1lx8krMb7lkc9FFM+7ZXVPlsMkxgRJS3VB7z8Sr7554lWlZKqWmZY3oM+Cdu6ciIUzLIghLX2uKy/PXD2f/5vmZgUhY+kza5yfpjVEopYTIvfjDwVA0SjCGpsgcTna5AQB1wSpIANCScIbm9z5v2GhfMEQJlsFm3abf8vLT63duV6liMevg3R6Qoy/VOErIq/O+vOTR++sa/Q6bzWr2BVb56m86f+LMa34Xc2VIEM8eMvyN26Yw07I4IzF57fG+vei7n0+9c9X2bQqlcoX8IHnNOJffCkQi0955bfbCb+WSavy+sBnFuGkjGlVkqklXNPQEBXqFAID7Jv3SrtkYY9KWVSn1h0OXPHb/gqLVClUwxhZncsOxhwvBGGPNNLW7rubXzz/++xdmYYw0VTUZQwAUk8r6ul+ffcHfbrxTerpjGyYYm8yaMPL02XdPBQFR04jdjckOd9Gu0vHT7nr43Ver/T5KiHTACiHkEuShKoT+sHnD+Gl3PTzntd8+/9ia0mIAKK+pMkwTI4wAGOd2my3N7e0i0GTq1KkJceAxzrOSUw3T+HLVj26Hk3POhVAJDUTCc5YuCIZDg/J6u3W7DOzHHhlSwRhX+Rpe/PaTP7z41A9birwOlwDBOScIE4yrffW/G3/Ji7+/W4A42NrECDPGBuTmjep7wheFy/zhoK5qXHAuhKYonIu561f958dF1f4Gj8PptTtVRZFL8IWDy7ZufOyD2VP//UpFTXWq201V5TfjLkr3Jn25ctncdSsdNpsAMC0rzZP0x4sm2xS1KwHVhMUMZZYE43ziY1O+WbsizZNkWpYAQTDmQviCgYLM7ItPOX38SSP7Zed6HS6KcdQya/wNG3eXfbe28Js1hWWVexw2XVMUmZ5AMOGc1wd991x21cxrbuLtmteMMUpp0c7S6559tKh8R4rLw2RUGwBjEjWjgXDY7XTmpaTnpKQ6dEdDoLG8rmZn9T7LNN26XVW1iqp9t0yY9PwNdwDAH1565p/ffZrsdHPBg5HwqP4D5z3yLHTNb9MJoDs4TwQWYwhQrc932eMPrCzZmubxGsyStyUhJGIYwUhYVRSvbk9yewlC0Wi0PhJsCAQZ5w5N0xQlZkBTQgLhMMV45nU33Tz+UsY5ApCGX3vKDyF1jf5bX3rm/aXzXXaHpigy9QAhRBC2OItahsVMITBCSKVUowoAEELqGhsHZvecO/0Zr9OFEbpo+r3zi1a77XYBqC7Q8MuxP3/t1ge66BrEnZIP7av6CqGUkIzk5I8fmDlmwIlV/gaCCSFENGtsKS6PXbOFDKOsam9p5e49DbWmxTx2e7LTSQlhjMsrHgmo9jUUZOZ8+uBfbh5/aSwlrH3lgWDMOEt2uWff/dDfb7zTpem1fh8HiLmwAUBXNLfu8tgdLptdJYocsKq+rm9mzpz7ZiS73AggGI2UVVWqlEiGEFz0z8qDLpcW4EMwUg7+q/T3f7p88ZWzHl68uSjDm/TZ1CduPu9SfygQDIcpxgRjENziFueMEKxSRVNUVVEwQoxzGTInBCOA+kCjyaxbL5z0/aPPjRk01LSs+OkII8w5Z5zfeN7Fi2f+/abxl1CMa/y+cDSKAEl7rymPH4TFmS8UqA80Tjx17LcPP9m7R5ZpWQih8uqqfQ21zR4FjjEe0JwlcZhERztWK0aoIRgccfuvt+8pG9L3hB8e/4fTpgPA16uXPzbnrcKSzYCQQ1Ob/MUCcSGaEqAFSMkeMYywEXXr9vOGjbzzsitP6TMAOp9KGpNvjDOZ+LytovydJfO+WrW8eM+uUDRq8aZ8EoJxssM1st/A346fMGHEadKvIgRQQj4vXHb5Xx902+1cgBBMCFg08x+DcvMZ5zJP/tBQol2SyzHdDiEmOHXYUpPTyvbt2bS77JTe/U3LOm/4qHOHjvjPih/eWTR3+daNNY31lsUBBMIEgQABjHMEwm7T+2Xm/Pykkb8YO25Yr77QnBwdU8g6rUthItWeftm5U39x3ZTJ12ytKC/et7uitjoUjdhVW25qxol5Bb0yesSCgRhhqbNvKCs1GUOAERKGaeWkpOen9ZA3TYcotwMX7aL9LT8EAB67w0O1Ks7CzJy/duXIPgMkZWGMJ506ZtKpY8prKldv37axbMeumipfOCQ41wjJSE7pl5U7tFffE/MKbKoKzUmnMULuUIi15c1ACBGEpO5BCR3UM39Qz/yDbULeIqopfdxrdxQTjGWeadSyCjKyHDZbnDG5dj5DEyB9ADjnFOMkl8eoKKOAFhStvG/yL2P0KK2M3NSM3NSMS0ad2dY4Mo+pU6HVDjePEQYEzfmiTacmv4QQxgiR5hHkPRw2jM0Vu6T+gzG2LDYorze0yG8/ZNZPANAxukv3ek3TcOv2Dbt37qqp7JmaIXMN5GZ4s03YtM9mz4HMbEMYHbyTRBWSoBYs0q5/FHZU7q2oq2nKwRQCYzSsd7/EHHligAYAgOzkVC64pihVDQ2LNxUdwPgy/kYJIZgQTDDGBGP5G4xxq+Kv/QrAxD4yUXhd2fZAKKhQigBxIdy648SevaCjXIMDWmp1p68DAADy0jObOFOgeesKARJTUNZhSWVb/41n/weEZQu3bZaBcEAQtczs1LReGVkAgNpliANaarU6YyKBzs/IpFRhjOuatrJkczAaJpgc/nrxg7cdDwdIV8Ha0m0qpZxzjCBqRgfnFcjUJxTHabWc5eAZE9nJMS813anpFmO6ppbu27t6ezEkIrWj46LULjOONNMramu27d3dlG8FiDE2ss8AAODxxS4Oqs3tWsyw9YEAACArJS3N7TUZwwiHjOj3G9c0ff7o7kgXU6VXl26LZfgxIWxUG9a7PwDgzhgprZ7HoURY2ko0FkJ4dHtuWrrBTBCgUWXJliLpvYNjoK2HAIClWzZYMuccIcM0M5OTB/csgLar74+E4x+agrD9s3paFgMAu01fX7p9V3Vl+y63rjNTQh6ZlbuyZLN0YSOEokZ0cF5BstMl0/27LqBwnPIujk0KABiS31uKEoWQal/D0s0bYmdw9MoNIRBCZTVVmyt22RRV5puZnJ02YAgAdCXXvyVoOE5AO76RAAHAiXkFuqYy6YbGMH/j2sRcVs2rYs3BMMa5NK8T1RhlxdaNNQ31lMhuXmBT1NH9B7WlQcc5acuN40TxrBy0T2ZOuidZOn/tqm3ppnWBcFhmWXRR8ZBxRUqojP5RQiihsrKo63YjAHy/YV3zVChqGj3Tewzt1aedOynB3rv4x5WtqFNc7r5ZuRV1NZoCmqLsrNy3urR4zKAhsoi1K9xNCalt9H3845Ll2zbWN/pdbufgzJ4TTx3bq0c270ISqQAghIQNY9nWjTZVk/6AsBEd1quvW7e3LDLsoj+AJlLYcY4xHl7Q77u1hQAIYxS1zO/WF44ZNES2nImffltygKxg/Hj5kvtnv7x9dznGiDSVUplPf/7BvROvvvXCSTKP6VCA5hwIWb+rdHtlhU1RmRAUYyb4mEFD5QHjRGjrndOjO2Z/hADglD4DCEIAgnOuKcr3RasZ550qqv4vlAUnhLw276sr/vJQZW1NmseT5HS7dbvH7kj3pkQs64//fPaBN14ghBzalSuT+BdtWBeKhmVvHIsxt8N+5qCTACCeoq548IlXj26ruUCrCbJDevVJcnlMxrgQuqpt3LVjS8UuhNAhCFMuOMFkRfGW2199zmW3q5SajDHOuBBcCItZGKCHN/mJz+e8v2whbYF1/NSHEREC5q5dqRGVA2CEI0Z0YFZ+v6xcIURLQuyUCd5pPTrW4T2eOwEjJITomZreLysnahoIgBLaEArNW7cSDqmqCSHMOJ/y5kuGaTbhKARGqGW4VoBw2vSH//1KfaCRNOvscd69QgiM0fbKPet2Fus2TXZViBjG2MHDKcYykpkoQx8nyo0gP8k4IxiP6jfQME2MMYDQqPLd2hXSa9Mp3UP6sucXrV66dYNHd1iCy7oNfyjk1u0R05QfYJzrVN26u/z9pQs6yzfSNTp37araRh+VJQRCaIoy7qSTE+6MTZhl2BLE008YIoUy59yuaStLt+2o2tfZqjS5yzcXfmsJ1hQsAGRy9vi1Ny9/4uU3bpuiq5rFuczasqnahz8u4q1Vx7crNzAAfL1mOcVNyQUR08hP63GKdHEcnUC3XPopffqneb0mYwCgUFrja/h2bWGMguK5SYQQhJBKX8OSTescms4Fpxj7QoFrzhp/20WT0jzeS0edcc9lVzWGggQTLrhNVdeUbC3dtzd+zVqm3+2qriws3mTXNBm7CkciZ5043KXbrUNVYw4T0AghLnhWcurQnr0jhoEJkTH8r1ctix1DPDJKgvXj1k1762pVSmX/Loeu33TepVxwy7I451eNOSc7JSVqGQBACfGHAiuKN7U8zg6ydYUAgG/WFFb56lWqSBsTYzj/5FHd4XtJfDssxjgAjB0y3GQmBsQFd2j6ss1Fpfv2dMbBJADgx20bZXI0RigcjZ7Ys2Bgdk8ESKFUCJHm9ozoOzAQDmOEECAhxIrizdAii7kDNQAhAPh85VKFEC44RigajfbKzGlW7BKQot85oDtrPUvdc9yJwx2abjVH+2sC/q9WLztAerQXYUMYAIp2lCiUSKdPxDJG9R2AMZYpkJIeR/Q5oal0A4RC6YayEgGA47D4paAo3luxbOsGh02XplYwGvnZoKEeKTe6bHN3GujOzoERFkKcmNfrhJy8UDSCERKCa4r68Y+L+X+XD7XpKQTAGNcFGrft3a1RtamAB9ApfQfB/mQBBABD83vLiLVMxy6r3lcX8Mdzicnz/qxwaX3ATzEWCLgQhJBLRo/pJg9tt3QtlAVV5508KmKa8naya7bC4q1rdpRghNq5Ept3xQFgZ9W+Kl+9rMC2mOXSbSfk5sXchBLo3hlZbofdErL2glb7Gsqr4ypxpZiYjH207Htbc9+LcDTaP6fnGScMFSC6o5kj7o4DlDR14YjTHaotlnkUjIbfXTQXmqoDOk6iLN5bETKiBCFAyLTMdE9SXlqPmKEviTYzOTXV47X2TxEtrdrT4fplQs/ybZvW7yyxx4A2oheNOM2uaewgudGNQCegJYEQJ+X3HlbQR0oPLoTTpn+yfHF9IEAwjucct+zeyRlDgDCAYZn56VluXefN3T+kWei02XKSM2QWKEJYCCjeU75fCW/3mb1obtQ0YnaWU9cvP/1siPPLR4noAABZ0jP59LMjpilBsalqaeWej5YtRB1JDykctuzehRHiIBAgk/F+2TkAwFp8UV6D+ekZFuMYmloul+zZ3T5YUkPfW1/31aplTpsuc++C0ciofoOG5PfmgpPuaQLbXUDL5V42ekxWcqppWfKitynKa/O+MJnVTkWtBMKwrOK9uzVFEbypxeUJufnw3yJHyoc+PbIFyLbfQtaAyl4tom1fLgJ4/4cFFbXVqqLI4zFM86ox4zBCUjc9loCWTQGyk1MnjDi1MRyUmTROm15YvOmzwqW4ZdfQg/VngF01leU1VSpVAIQArinKoNwCaC1JpU9mDkFERrQ0qpRXV9Y2+hFCreY4SOUvbBhvLfhGVzUZhw1Ho30ycy4ZeWYX++UcGaBj3Pubn1/s0GyCWQDAAShVn/70fbNtA1dCtm7Hdl+wUaEUEDItluJ0983KOQhoAICCHll2VWOcSw1vX0Pd1t1l8N/9JGI/SBH/nxU/rN9Z4tA0KSgC4fDE0WO9Dmcs4J1w2yIBQLfXoQJjxvnwgr4/HzbSFwpgBJxzl25fvm3ju4vmkrbrhxHA/KLVzZ1CUdQ0emflZniSpP12wNT56T0ykpKb+hkiHIlGf9iyXpowB75lEgAjZDL2jy8+Upt7MZiWleRyXDfu/ENwVXbqDDpduNC5sxUCAO64+ApVUeTOuRAO1Tbzw7drAwF8kFdTMq8vFJy3bpWuaTIgazI2sv8ghBD/bwGKZC203TEgJy9iGLKfmqqoX60u5K0JARkAfG/x/OXbNjp1nXFOEPaHgxeNPKNfVk5brXw7i0xbZ4ATRb9tEjVjo/sPvHT0Wb5QSIbDbZq2fV/Fg2+9jDE+IBogNdwPli7cvne3TdG4EFwAJXjsoKGtqhJSexndf7DJm+5bp01fsW3jD1uKMMKsRZMNGd6t8funv/eG3WaTZj0XXFeVWy6YDAAguouzOwA6YWlBCIQQD1z+K4/dGXPVJzldry/46rV5XyqUyrYCXAhZIlcfDDz1yfsO3dbk6DGN/NQep/UffLDzDyGQoaZzhw63azpvDgYJIR59743mAA2TVeay5Pb2fz2/s2aPTVG4EBSThmDgkpFnnlzQV5aAdB/K7QGdwL5TjPMB2bm3XjCpzu+jhMoScKduu/2VZ2cvmivbChCMFUqjpnnj358orayQ5IwxbgwFJ4w+02N3HOwgFgKk8Bma3/vkvgPC0ag0lNx258KNax94+2WCscz9UChFCN/1+j8+WDo/xeWxOEMAFmcuu37/5F+JtokqgXdjYmrBO1Q/uBAj+50wb/3q8poqm6oKIRAgQujHPy7cuaciyZNkmMaybZtuefmZuesKvQ6nLJXlQug27W833JHSdnMBzhgllAB8uPR7h90uhOCC66q2aNO6jWWl0kD/sXjzbf98ds6yhUkOl8UsBIgSUu2v/9PEX15+2lmyUWy3g3B4XsAub6c1pcXn/vkORJCkRMnmjaGgZrM5FNUfCgqEXDZd6moKoZX++rsuueKJa29uv1u2ADBM85xpd60t3ebUbKy5j7wv1KgqmkPX/aGA4MLVovWHLxg8Ma/X/BnP2RQVHZY3mx2md2XJ0PWwgr7P/+5OfzDY5A/hHAC8TrdGqMEsu2532nQJEyXEHwoOzsmfMumaDkvPOOc2VZ31q5uxQJwLGSBngnscLhulhmE4VJtTt0vzXValO3XbP2+5z6HZoJtfWXW4gYamjvvsyjE/e/rXtzYEg5ZlKYSippJVgRDmnEv7WCE0GIm47Y7X73jQ63R2mIslRx7df+Cs62+pDzTKtznI6JcMuXLOOWMghEJoKBIGgLfveGhIXkGi2sofRaKjpQJHCZm9cO5d/3quIRJ06XaC8X7FDQmL8YaAvyAj+607HhzVb2D8VcoWZwqhr3zz2d2v/93gzGXTm9rgAUIghACLs4ZgY15aj1dvve+swcO63mLzqAZagOBcUEI2l5c98t7rXxcuDZhRRIjMtuOCp7i9l408Y+oV12cmpXSuFlwIJgQlZMXWTQ+/+9qSLRtCkTAmWFI0IJTqcl82asyUX1ybnZza2Srzrlc8Hm6gW9I1AKwvLVmwce3WirLGcMjr9gzOyR839OQ+PbJjhtwhj7x826aFRWt31uwLh8Nep2toQd+zB52Un5EZ/8jtgHsIuB8ZoKE5utoqWR3y68j2O0IxatWe7uLIxx5FtwSFt3h5lUCAEcaJKGcTTSNDc1/opvc0HamdxgV0jFPE4VKGukNKHtkF4HheCNqpEtQEhg66wyXQfccAnXrn7E+KSLtpka1+Jd7yt8NAs0f2SWAnBdTa+56O8GX403mOvxf8ONDHgT5sl/hxoLsdpkMIMx/lB9k978DuQv304dFVDme3psMtOo42lbktauimdf50L8N23plyHOjjl+Hx56cA9FGlCyYm9+7ofI4Jnwn+39vq/7LoiL+bwHGgE0C/XexocRzoeAHtJhyPleNpx9pMwGv2ukNEtNNM92gGvR0LSAjx/0pfFofKYbjIAAAAAElFTkSuQmCC"
      alt="Infinitum Dental logo"
      width={size}
      height={size}
      style={{ display: 'block', mixBlendMode: 'multiply' }}
    />
  );
}

function WhatsAppIcon({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <path
        fill="#25D366"
        d="M16 0C7.163 0 0 7.163 0 16c0 2.823.737 5.47 2.022 7.766L0 32l8.448-2.217A15.92 15.92 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0z"
      />
      <path
        fill="#fff"
        d="M23.474 18.797c-.355-.178-2.105-1.04-2.432-1.158-.326-.119-.563-.178-.8.178-.236.355-.914 1.158-1.121 1.395-.207.237-.414.266-.77.089-2.094-1.046-3.464-1.864-4.84-4.226-.366-.628.366-.583 1.046-1.943.117-.237.06-.444-.06-.622-.118-.178-.8-1.928-1.097-2.64-.29-.693-.583-.6-.8-.611-.207-.012-.444-.014-.682-.014-.236 0-.622.089-.948.444-.326.355-1.244 1.217-1.244 2.97 0 1.752 1.276 3.444 1.453 3.682.178.237 2.456 3.751 5.954 5.116 3.498 1.366 3.498.911 4.728.852 1.23-.06 3.41-1.395 3.892-2.65.483-1.256.483-2.336.327-2.514-.148-.178-.355-.237-.71-.414z"
      />
    </svg>
  );
}

function FlagNO({ size = 18 }) {
  return (
    <svg width={size} height={size * 0.73} viewBox="0 0 22 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ borderRadius: 2, display: 'block' }}>
      <rect width="22" height="16" fill="#BA0C2F" />
      <rect x="6" width="4" height="16" fill="#fff" />
      <rect y="6" width="22" height="4" fill="#fff" />
      <rect x="7" width="2" height="16" fill="#00205B" />
      <rect y="7" width="22" height="2" fill="#00205B" />
    </svg>
  );
}

function FlagGB({ size = 18 }) {
  return (
    <svg width={size} height={size * 0.73} viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ borderRadius: 2, display: 'block' }}>
      <clipPath id="gb-clip"><rect width="60" height="40" rx="3" /></clipPath>
      <g clipPath="url(#gb-clip)">
        <rect width="60" height="40" fill="#012169" />
        <path d="M0,0 L60,40 M60,0 L0,40" stroke="#fff" strokeWidth="8" />
        <path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" strokeWidth="4" />
        <path d="M30,0 V40 M0,20 H60" stroke="#fff" strokeWidth="13" />
        <path d="M30,0 V40 M0,20 H60" stroke="#C8102E" strokeWidth="8" />
      </g>
    </svg>
  );
}

function SectionLabel({ children }) {
  return (
    <div
      className="inline-block text-xs font-semibold tracking-widest uppercase mb-3"
      style={{ color: C.coral, fontFamily: "'Manrope', sans-serif", letterSpacing: '0.18em' }}
    >
      {children}
    </div>
  );
}


export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState({});
  const [booking, setBooking] = useState({ service: DEFAULT_SERVICES[0].id, practitioner: 'any', date: '', time: '', name: '', phone: '', email: '', message: '' });
  const [confirmed, setConfirmed] = useState(null);
  const [orderDone, setOrderDone] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [view, setView] = useState('site');
  const [adminAuthed, setAdminAuthed] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [pinAttempts, setPinAttempts] = useState(0);
  const [pinLockUntil, setPinLockUntil] = useState(null);
  const [customProducts, setCustomProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [newProduct, setNewProduct] = useState({ name: '', sku: '', price: '', tag: '', iconKey: 'package', desc: '', details: '', categoryIds: [], brandId: '', stock: '', orderStatus: '' });
  const [newProductImages, setNewProductImages] = useState([]);
  const [newProductImageUrl, setNewProductImageUrl] = useState('');
  const [newProductImageError, setNewProductImageError] = useState('');
  const [newProductDatasheet, setNewProductDatasheet] = useState(null);
  const [newProductDatasheetError, setNewProductDatasheetError] = useState('');
  const [adminMessage, setAdminMessage] = useState('');

  const [datasheets, setDatasheets] = useState({});
  const [datasheetUrlDrafts, setDatasheetUrlDrafts] = useState({});
  const [datasheetError, setDatasheetError] = useState('');

  const [productVariants, setProductVariants] = useState({});
  const [variantGroupDrafts, setVariantGroupDrafts] = useState({});
  const [variantsError, setVariantsError] = useState('');
  const [selectedVariants, setSelectedVariants] = useState({});

  const [categories, setCategories] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryEditDrafts, setCategoryEditDrafts] = useState({});
  const [categoriesError, setCategoriesError] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const [stock, setStock] = useState({});
  const [orderStatusMap, setOrderStatusMap] = useState({});
  const [stockDrafts, setStockDrafts] = useState({});
  const [stockError, setStockError] = useState('');

  const [productDiscounts, setProductDiscounts] = useState({});
  const [discountDrafts, setDiscountDrafts] = useState({});
  const [discountError, setDiscountError] = useState('');

  const [categoryDiscounts, setCategoryDiscounts] = useState({});
  const [categoryDiscountDrafts, setCategoryDiscountDrafts] = useState({});
  const [globalDiscount, setGlobalDiscount] = useState(0);
  const [globalDiscountDraft, setGlobalDiscountDraft] = useState('');

  const [shareFallback, setShareFallback] = useState(null);
  const [shareBusy, setShareBusy] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('standard');

  const [teamMembers, setTeamMembers] = useState([]);
  const [teamDrafts, setTeamDrafts] = useState({});
  const [newTeamMember, setNewTeamMember] = useState({ name: '', role: '', bio: '', iconKey: 'heart' });
  const [teamError, setTeamError] = useState('');

  const [newsPosts, setNewsPosts] = useState([]);
  const [newsDrafts, setNewsDrafts] = useState({});
  const [newPost, setNewPost] = useState({ title: '', date: '', excerpt: '', content: '' });
  const [newsError, setNewsError] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [legalPage, setLegalPage] = useState(null);

  const [bookings, setBookings] = useState([]);
  const [bookingsError, setBookingsError] = useState('');
  const [lookupRef, setLookupRef] = useState('');
  const [lookupPhone, setLookupPhone] = useState('');
  const [lookupResult, setLookupResult] = useState(undefined);

  const [waitlist, setWaitlist] = useState([]);
  const [waitlistForm, setWaitlistForm] = useState({ name: '', phone: '', service: DEFAULT_SERVICES[0].id, note: '' });
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);

  const [services, setServices] = useState(DEFAULT_SERVICES);
  const [heroSlidesList, setHeroSlidesList] = useState(null); // null = not loaded yet

  const lang = 'nb';
  const [heroSlide, setHeroSlide] = useState(0);

  const DEFAULT_HERO_SLIDES = [
    {
      id: 'h1',
      eyebrow: 'Spesialistklinikk · Lørenskog',
      title1: 'Implantater og',
      title2: 'spesialistbehandling.',
      lead: 'Infinitum Dental er din spesialistklinikk for tannimplantater, oralkirurgi og avansert tannbehandling i Lørenskog. Vi tilbyr varige løsninger med høy faglig standard.',
      cta: { label: 'Bestill konsultasjon', href: 'bestill' },
      cta2: { label: 'Se behandlinger', href: 'tjenester', style: 'outline' },
      visual: 'cards',
    },
    {
      id: 'h2',
      eyebrow: 'Tannimplantat',
      title1: 'Permanent løsning –',
      title2: 'som egne tenner.',
      lead: 'Tannimplantater gir deg full tyggefunksjon og et naturlig utseende. Vi bruker dokumenterte implantatsystemer og følger deg gjennom hele behandlingsforløpet.',
      cta: { label: 'Les om implantater', href: 'tjenester' },
      cta2: null,
      visual: 'cards',
    },
    {
      id: 'h3',
      eyebrow: 'Rask og enkel timebestilling',
      title1: 'Trenger du en',
      title2: 'spesialist?',
      lead: 'Bestill time online – velg behandler, dato og tidspunkt. Vi tar oss tid til å lage en grundig behandlingsplan tilpasset deg.',
      cta: { label: 'Bestill time nå', href: 'bestill' },
      cta2: { label: 'Se behandlinger', href: 'tjenester', style: 'outline' },
      visual: 'booking',
    },
  ];
  const heroSlides = heroSlidesList ?? DEFAULT_HERO_SLIDES;

  const DEFAULT_TRUST_BADGES = [
    { id: 'tb1', iconKey: 'award', text: 'Godkjente spesialister' },
    { id: 'tb2', iconKey: 'zap', text: 'Implantateksperter' },
    { id: 'tb3', iconKey: 'check', text: 'Moderne 3D-diagnostikk' },
    { id: 'tb4', iconKey: 'mappin', text: 'Lørenskog sentrum' },
  ];
  const BADGE_ICON_MAP = { check: Check, clock: Clock, cart: ShoppingCart, mappin: MapPin, star: Star, heart: Heart, sparkles: Sparkles, award: Award, zap: Zap };
  const [trustBadges, setTrustBadges] = useState(DEFAULT_TRUST_BADGES);

  const [brands, setBrands] = useState([]);
  const [brandMap, setBrandMap] = useState({});
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandIcon, setNewBrandIcon] = useState('star');
  const [brandEditDrafts, setBrandEditDrafts] = useState({});
  const [brandsError, setBrandsError] = useState('');
  const [activeBrand, setActiveBrand] = useState('all');

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [settingsDraft, setSettingsDraft] = useState(DEFAULT_SETTINGS);
  const [settingsError, setSettingsError] = useState('');
  const [settingsSaved, setSettingsSaved] = useState(false);

  const [faqItems, setFaqItems] = useState([]);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  const [faqError, setFaqError] = useState('');
  const [openFaqId, setOpenFaqId] = useState(null);

  const [emailTemplates, setEmailTemplates] = useState(DEFAULT_EMAIL_TEMPLATES);
  const [emailDrafts, setEmailDrafts] = useState({});
  const [emailError, setEmailError] = useState('');

  const [lastOrder, setLastOrder] = useState(null);
  const [shopOrders, setShopOrders] = useState([]);

  const [featured, setFeatured] = useState([]);
  const [checkout, setCheckout] = useState({ open: false, delivery: 'pickup', name: '', phone: '', address: '' });

  const [closedDates, setClosedDates] = useState([]);
  const [closedDatesError, setClosedDatesError] = useState('');
  const [newClosedSingle, setNewClosedSingle] = useState({ date: '', label: '' });
  const [newClosedRange, setNewClosedRange] = useState({ start: '', end: '', label: '' });

  const [productImages, setProductImages] = useState({});
  const [imageUrlDrafts, setImageUrlDrafts] = useState({});
  const [imagesError, setImagesError] = useState('');
  const [galleryIndex, setGalleryIndex] = useState(0);

  const [favorites, setFavorites] = useState([]);

  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast({ message, id: Date.now() });
  };

  const [pageQty, setPageQty] = useState(1);
  const [discountCodeInput, setDiscountCodeInput] = useState('');
  const [appliedCode, setAppliedCode] = useState(null);
  const [discountCodes, setDiscountCodes] = useState([]);
  const [newCode, setNewCode] = useState({ code: '', percent: '' });
  const [codesError, setCodesError] = useState('');

  const [accounts, setAccounts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ accountType: 'private', name: '', email: '', password: '', phone: '', address: '', companyName: '', orgNumber: '' });
  const [authError, setAuthError] = useState('');
  const [accountView, setAccountView] = useState(false);
  const [profileDraft, setProfileDraft] = useState({ name: '', phone: '', address: '' });
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (cartOpen && currentUser) {
      setCheckout((c) => ({
        ...c,
        name: c.name || currentUser.name || '',
        phone: c.phone || currentUser.phone || '',
        address: c.address || currentUser.address || '',
      }));
    }
  }, [cartOpen, currentUser]);

  useEffect(() => {
    let mounted = true;
    // Safety net: never leave the loading skeletons up for more than 4s, even if a
    // storage call hangs. The product catalog itself doesn't depend on storage.
    const safetyTimer = setTimeout(() => { if (mounted) setProductsLoading(false); }, 4000);
    (async () => {
      try {
        const res = await window.storage.get('custom-products', true);
        if (mounted && res && res.value) {
          setCustomProducts(JSON.parse(res.value));
        }
      } catch (err) {
        // no custom products saved yet
      }
      try {
        const res = await window.storage.get('product-datasheets', true);
        if (mounted && res && res.value) {
          setDatasheets(JSON.parse(res.value));
        }
      } catch (err) {
        // no datasheets saved yet
      }
      try {
        const res = await window.storage.get('product-variants', true);
        if (mounted && res && res.value) {
          setProductVariants(JSON.parse(res.value));
        } else {
          throw new Error('no variants');
        }
      } catch (err) {
        // First run – seed with an example variant so it's clear how it works
        if (mounted) setProductVariants(DEFAULT_VARIANTS);
        window.storage.set('product-variants', JSON.stringify(DEFAULT_VARIANTS), true).catch(() => {});
      }
      try {
        const res = await window.storage.get('product-categories', true);
        if (mounted && res && res.value) {
          setCategories(JSON.parse(res.value));
          try {
            const mapRes = await window.storage.get('product-category-map', true);
            if (mounted && mapRes && mapRes.value) {
              setCategoryMap(normalizeCategoryMap(JSON.parse(mapRes.value)));
            }
          } catch (err) {
            // no category map saved yet
          }
        } else {
          throw new Error('no categories');
        }
      } catch (err) {
        // First run – seed with default categories and assignments
        if (mounted) {
          setCategories(DEFAULT_CATEGORIES);
          setCategoryMap(DEFAULT_CATEGORY_MAP);
        }
        window.storage.set('product-categories', JSON.stringify(DEFAULT_CATEGORIES), true).catch(() => {});
        window.storage.set('product-category-map', JSON.stringify(DEFAULT_CATEGORY_MAP), true).catch(() => {});
      }
      try {
        const res = await window.storage.get('product-stock', true);
        if (mounted && res && res.value) {
          setStock(JSON.parse(res.value));
        } else {
          throw new Error('no stock');
        }
      } catch (err) {
        if (mounted) setStock(DEFAULT_STOCK);
        window.storage.set('product-stock', JSON.stringify(DEFAULT_STOCK), true).catch(() => {});
      }
      try {
        const res = await window.storage.get('product-order-status', true);
        if (mounted && res && res.value) setOrderStatusMap(JSON.parse(res.value));
      } catch (err) { /* ingen bestillingsstatuser ennå */ }
      // Products (from the static catalog + any custom ones) and their core data are now
      // ready, so stop showing the loading skeletons. The remaining data below keeps
      // loading in the background and won't block the product grid.
      if (mounted) setProductsLoading(false);
      try {
        const res = await window.storage.get('product-discounts', true);
        if (mounted && res && res.value) {
          setProductDiscounts(JSON.parse(res.value));
        } else {
          throw new Error('no discounts');
        }
      } catch (err) {
        // First run – seed with an example campaign discount
        if (mounted) setProductDiscounts(DEFAULT_DISCOUNTS);
        window.storage.set('product-discounts', JSON.stringify(DEFAULT_DISCOUNTS), true).catch(() => {});
      }
      try {
        const res = await window.storage.get('category-discounts', true);
        if (mounted && res && res.value) {
          setCategoryDiscounts(JSON.parse(res.value));
        }
      } catch (err) {
        // no category discounts saved yet
      }
      try {
        const res = await window.storage.get('global-discount', true);
        if (mounted && res && res.value) {
          setGlobalDiscount(JSON.parse(res.value));
        }
      } catch (err) {
        // no global discount saved yet
      }
      try {
        const res = await window.storage.get('team-members', true);
        if (mounted && res && res.value) {
          setTeamMembers(JSON.parse(res.value));
        } else {
          throw new Error('no team');
        }
      } catch (err) {
        if (mounted) setTeamMembers(DEFAULT_TEAM);
        window.storage.set('team-members', JSON.stringify(DEFAULT_TEAM), true).catch(() => {});
      }
      try {
        const res = await window.storage.get('news-posts', true);
        if (mounted && res && res.value) {
          setNewsPosts(JSON.parse(res.value));
        } else {
          throw new Error('no news');
        }
      } catch (err) {
        if (mounted) setNewsPosts(DEFAULT_NEWS);
        window.storage.set('news-posts', JSON.stringify(DEFAULT_NEWS), true).catch(() => {});
      }
      try {
        const res = await window.storage.get('bookings', true);
        if (mounted && res && res.value) {
          setBookings(JSON.parse(res.value));
        }
      } catch (err) {
        // no bookings saved yet
      }
      try {
        const res = await window.storage.get('waitlist', true);
        if (mounted && res && res.value) {
          setWaitlist(JSON.parse(res.value));
        }
      } catch (err) {
        // no waitlist saved yet
      }
      try {
        const res = await window.storage.get('shop-orders', true);
        if (mounted && res && res.value) {
          setShopOrders(JSON.parse(res.value));
        }
      } catch (err) {
        // no shop orders saved yet
      }
      try {
        const res = await window.storage.get('brands', true);
        if (mounted && res && res.value) {
          setBrands(JSON.parse(res.value));
          try {
            const mapRes = await window.storage.get('product-brand-map', true);
            if (mounted && mapRes && mapRes.value) {
              setBrandMap(JSON.parse(mapRes.value));
            }
          } catch (err) {
            // no brand map saved yet
          }
        } else {
          throw new Error('no brands');
        }
      } catch (err) {
        // First run – seed with example brands and assignments
        if (mounted) {
          setBrands(DEFAULT_BRANDS);
          setBrandMap(DEFAULT_BRAND_MAP);
        }
        window.storage.set('brands', JSON.stringify(DEFAULT_BRANDS), true).catch(() => {});
        window.storage.set('product-brand-map', JSON.stringify(DEFAULT_BRAND_MAP), true).catch(() => {});
      }
      try {
        const res = await window.storage.get('site-settings', true);
        if (mounted && res && res.value) {
          const parsed = JSON.parse(res.value);
          const merged = { ...DEFAULT_SETTINGS, ...parsed, hours: { ...DEFAULT_SETTINGS.hours, ...(parsed.hours || {}) } };
          setSettings(merged);
          setSettingsDraft(merged);
        } else {
          throw new Error('no settings');
        }
      } catch (err) {
        if (mounted) {
          setSettings(DEFAULT_SETTINGS);
          setSettingsDraft(DEFAULT_SETTINGS);
        }
        window.storage.set('site-settings', JSON.stringify(DEFAULT_SETTINGS), true).catch(() => {});
      }
      try {
        const res = await window.storage.get('faq-items', true);
        if (mounted && res && res.value) {
          setFaqItems(JSON.parse(res.value));
        } else {
          throw new Error('no faq');
        }
      } catch (err) {
        if (mounted) setFaqItems(DEFAULT_FAQ);
        window.storage.set('faq-items', JSON.stringify(DEFAULT_FAQ), true).catch(() => {});
      }
      try {
        const res = await window.storage.get('email-templates', true);
        if (mounted && res && res.value) {
          const parsed = JSON.parse(res.value);
          setEmailTemplates({ ...DEFAULT_EMAIL_TEMPLATES, ...parsed });
        } else {
          throw new Error('no email templates');
        }
      } catch (err) {
        if (mounted) setEmailTemplates(DEFAULT_EMAIL_TEMPLATES);
        window.storage.set('email-templates', JSON.stringify(DEFAULT_EMAIL_TEMPLATES), true).catch(() => {});
      }
      try {
        const res = await window.storage.get('closed-dates', true);
        if (mounted && res && res.value) {
          setClosedDates(JSON.parse(res.value));
        } else {
          throw new Error('no closed dates');
        }
      } catch (err) {
        if (mounted) setClosedDates(DEFAULT_CLOSED_DATES);
        window.storage.set('closed-dates', JSON.stringify(DEFAULT_CLOSED_DATES), true).catch(() => {});
      }
      try {
        const res = await window.storage.get('hero-slides', true);
        if (mounted && res && res.value) setHeroSlidesList(JSON.parse(res.value));
      } catch (err) {}
      try {
        const res = await window.storage.get('clinic-services', true);
        if (mounted && res && res.value) setServices(JSON.parse(res.value));
      } catch (err) {}
      try {
        const res = await window.storage.get('trust-badges', true);
        if (mounted && res && res.value) setTrustBadges(JSON.parse(res.value));
      } catch (err) {}
      try {
        const res = await window.storage.get('product-images', true);
        if (mounted && res && res.value) {
          const stored = JSON.parse(res.value);
          // Merge stored images with defaults so new default images appear
          const merged = { ...DEFAULT_PRODUCT_IMAGES, ...stored };
          if (mounted) setProductImages(merged);
        } else {
          throw new Error('no images');
        }
      } catch (err) {
        if (mounted) setProductImages(DEFAULT_PRODUCT_IMAGES);
        window.storage.set('product-images', JSON.stringify(DEFAULT_PRODUCT_IMAGES), true).catch(() => {});
      }
      try {
        const res = await window.storage.get('favorites', false);
        if (mounted && res && res.value) {
          setFavorites(JSON.parse(res.value));
        }
      } catch (err) {
        // no favorites saved yet
      }

      try {
        const res = await window.storage.get('discount-codes', true);
        if (mounted && res && res.value) {
          setDiscountCodes(JSON.parse(res.value));
        } else {
          throw new Error('no codes');
        }
      } catch (err) {
        const seed = [{ code: 'VELKOMMEN10', percent: 10 }];
        if (mounted) setDiscountCodes(seed);
        window.storage.set('discount-codes', JSON.stringify(seed), true).catch(() => {});
      }
      // Auth state handled by onAuthStateChange listener below
      try {
        const res = await window.storage.get('featured-products', true);
        if (mounted && res && res.value) {
          setFeatured(JSON.parse(res.value));
        } else {
          throw new Error('no featured');
        }
      } catch (err) {
        if (mounted) setFeatured(DEFAULT_FEATURED);
        window.storage.set('featured-products', JSON.stringify(DEFAULT_FEATURED), true).catch(() => {});
      } finally {
        if (mounted) setProductsLoading(false);
      }
    })();
    const { data: authListener } = onAuthStateChange(async (user) => {
      if (!mounted) return;
      if (user) {
        const profile = await fetchProfile(user.id);
        setCurrentUser({ id: user.id, email: user.email, name: profile?.name || user.email, phone: profile?.phone || '', address: profile?.address || '', accountType: profile?.account_type || 'private', companyName: profile?.company_name || '', orgNumber: profile?.org_number || '' });
      } else {
        setCurrentUser(null);
      }
    });
    return () => { mounted = false; clearTimeout(safetyTimer); authListener?.subscription?.unsubscribe(); };
  }, []);

  const saveCustomProducts = async (next) => {
    setCustomProducts(next);
    try {
      await window.storage.set('custom-products', JSON.stringify(next), true);
    } catch (err) {
      setAdminMessage('Kunne ikke lagre – sjekk tilkoblingen og prøv igjen.');
    }
  };

  const allProducts = [...PRODUCTS, ...customProducts];

  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || '';
  const isAdmin = currentUser && ADMIN_EMAIL && currentUser.email === ADMIN_EMAIL;

  const handlePinSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (pinLockUntil && Date.now() < pinLockUntil) return;
    if (pinInput === ADMIN_PIN) {
      setAdminAuthed(true);
      setPinError('');
      setPinAttempts(0);
    } else {
      const attempts = pinAttempts + 1;
      setPinAttempts(attempts);
      setPinInput('');
      if (attempts >= 5) {
        const until = Date.now() + 30000;
        setPinLockUntil(until);
        setPinError('For mange forsøk. Prøv igjen om 30 sekunder.');
        setTimeout(() => { setPinLockUntil(null); setPinAttempts(0); setPinError(''); }, 30000);
      } else {
        setPinError(`Feil kode. ${5 - attempts} forsøk igjen.`);
      }
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const price = Number(newProduct.price);
    if (!newProduct.name.trim() || Number.isNaN(price) || price < 0) {
      setAdminMessage('Fyll inn produktnavn og en gyldig pris.');
      return;
    }
    const product = {
      id: 'c' + Date.now(),
      sku: newProduct.sku.trim() || undefined,
      name: newProduct.name.trim(),
      price,
      tag: newProduct.tag.trim() || undefined,
      iconKey: newProduct.iconKey,
      desc: newProduct.desc.trim(),
      details: newProduct.details
        .split('\n')
        .map((d) => d.trim())
        .filter(Boolean),
    };
    await saveCustomProducts([...customProducts, product]);
    if (newProduct.categoryIds.length) {
      await saveCategoryMap({ ...categoryMap, [product.id]: newProduct.categoryIds });
    }
    if (newProduct.brandId) {
      await saveBrandMap({ ...brandMap, [product.id]: newProduct.brandId });
    }
    if (newProductImages.length) {
      await saveProductImages({ ...productImages, [product.id]: newProductImages });
    }
    if (newProductDatasheet) {
      await saveDatasheets({ ...datasheets, [product.id]: newProductDatasheet });
    }
    if (newProduct.stock !== '' && !Number.isNaN(Number(newProduct.stock))) {
      const qty = Math.max(0, Math.round(Number(newProduct.stock)));
      await saveStock({ ...stock, [product.id]: qty });
    }
    if (newProduct.orderStatus) {
      await saveOrderStatusMap({ ...orderStatusMap, [product.id]: newProduct.orderStatus });
    }
    setNewProduct({ name: '', price: '', tag: '', iconKey: 'package', desc: '', details: '', categoryIds: [], brandId: '', stock: '', orderStatus: '' });
    setNewProductImages([]);
    setNewProductImageUrl('');
    setNewProductImageError('');
    setNewProductDatasheet(null);
    setNewProductDatasheetError('');
    setAdminMessage('Produkt lagt til.');
  };

  const handleDeleteProduct = async (id) => {
    await saveCustomProducts(customProducts.filter((p) => p.id !== id));
    if (datasheets[id]) {
      const next = { ...datasheets };
      delete next[id];
      await saveDatasheets(next);
    }
    if (categoryMap[id]) {
      const nextMap = { ...categoryMap };
      delete nextMap[id];
      await saveCategoryMap(nextMap);
    }
    const nextStock = {};
    let stockChanged = false;
    Object.entries(stock).forEach(([key, val]) => {
      if (key === id || key.startsWith(id + '::')) stockChanged = true;
      else nextStock[key] = val;
    });
    if (stockChanged) await saveStock(nextStock);
    if (productDiscounts[id]) {
      const nextDiscounts = { ...productDiscounts };
      delete nextDiscounts[id];
      await saveProductDiscounts(nextDiscounts);
    }
    if (brandMap[id]) {
      const nextBrandMap = { ...brandMap };
      delete nextBrandMap[id];
      await saveBrandMap(nextBrandMap);
    }
    if (productImages[id]) {
      const nextImages = { ...productImages };
      delete nextImages[id];
      await saveProductImages(nextImages);
    }
  };

  const MAX_DATASHEET_BYTES = 2 * 1024 * 1024; // 2 MB

  const saveDatasheets = async (next) => {
    setDatasheets(next);
    try {
      await window.storage.set('product-datasheets', JSON.stringify(next), true);
      setDatasheetError('');
    } catch (err) {
      setDatasheetError('Kunne ikke lagre datablad – sjekk tilkoblingen og prøv igjen.');
    }
  };

  const handleDatasheetFile = (productId, file) => {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setDatasheetError('Kun PDF-filer kan lastes opp.');
      return;
    }
    if (file.size > MAX_DATASHEET_BYTES) {
      setDatasheetError('Filen er for stor (maks 2 MB). Bruk en lenke til datablad i stedet.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      saveDatasheets({ ...datasheets, [productId]: { type: 'file', value: reader.result, name: file.name } });
    };
    reader.onerror = () => setDatasheetError('Kunne ikke lese filen.');
    reader.readAsDataURL(file);
  };

  const handleDatasheetUrlSave = (productId) => {
    const url = (datasheetUrlDrafts[productId] || '').trim();
    if (!url) return;
    saveDatasheets({ ...datasheets, [productId]: { type: 'url', value: url, name: null } });
    setDatasheetUrlDrafts((d) => ({ ...d, [productId]: '' }));
  };

  const handleDatasheetRemove = (productId) => {
    const next = { ...datasheets };
    delete next[productId];
    saveDatasheets(next);
  };

  const saveProductVariants = async (next) => {
    setProductVariants(next);
    try {
      await window.storage.set('product-variants', JSON.stringify(next), true);
      setVariantsError('');
    } catch (err) {
      setVariantsError('Kunne ikke lagre varianter – sjekk tilkoblingen og prøv igjen.');
    }
  };

  const handleAddVariantGroup = (productId) => {
    const draft = variantGroupDrafts[productId] || { name: '', options: '' };
    const name = draft.name.trim();
    const optionsRaw = draft.options.trim();
    if (!name || !optionsRaw) {
      setVariantsError('Fyll inn både navn og alternativer for varianten.');
      return;
    }
    const options = optionsRaw.split(',').map((seg) => {
      const [labelPart, deltaPart] = seg.split(':');
      const label = labelPart.trim();
      let priceDelta = 0;
      if (deltaPart) {
        const parsed = parseInt(deltaPart.replace(/[^-+\d]/g, ''), 10);
        if (!Number.isNaN(parsed)) priceDelta = parsed;
      }
      return { label, priceDelta };
    }).filter((o) => o.label);
    if (options.length === 0) {
      setVariantsError('Legg inn minst ett alternativ.');
      return;
    }
    const group = { id: 'g' + Date.now(), name, options };
    const next = { ...productVariants, [productId]: [...(productVariants[productId] || []), group] };
    saveProductVariants(next);
    setVariantGroupDrafts((d) => ({ ...d, [productId]: { name: '', options: '' } }));
  };

  const handleRemoveVariantGroup = (productId, groupId) => {
    const groups = (productVariants[productId] || []).filter((g) => g.id !== groupId);
    const next = { ...productVariants };
    if (groups.length) next[productId] = groups;
    else delete next[productId];
    saveProductVariants(next);
  };

  const saveCategories = async (next) => {
    setCategories(next);
    try {
      await window.storage.set('product-categories', JSON.stringify(next), true);
      setCategoriesError('');
    } catch (err) {
      setCategoriesError('Kunne ikke lagre kategorier – sjekk tilkoblingen og prøv igjen.');
    }
  };

  const saveCategoryMap = async (next) => {
    setCategoryMap(next);
    try {
      await window.storage.set('product-category-map', JSON.stringify(next), true);
      setCategoriesError('');
    } catch (err) {
      setCategoriesError('Kunne ikke lagre kategori-tilknytning – sjekk tilkoblingen og prøv igjen.');
    }
  };

  const handleAddCategory = () => {
    const name = newCategoryName.trim();
    if (!name) return;
    const category = { id: 'cat' + Date.now(), name };
    saveCategories([...categories, category]);
    setNewCategoryName('');
  };

  const handleRenameCategory = (id) => {
    const name = (categoryEditDrafts[id] || '').trim();
    if (!name) return;
    saveCategories(categories.map((c) => (c.id === id ? { ...c, name } : c)));
    setCategoryEditDrafts((d) => { const n = { ...d }; delete n[id]; return n; });
  };

  const handleDeleteCategory = (id) => {
    saveCategories(categories.filter((c) => c.id !== id));
    const nextMap = {};
    Object.entries(categoryMap).forEach(([pid, ids]) => {
      const filtered = (ids || []).filter((cid) => cid !== id);
      if (filtered.length) nextMap[pid] = filtered;
    });
    saveCategoryMap(nextMap);
    if (activeCategory === id) setActiveCategory('all');
  };

  const handleToggleCategory = (productId, categoryId) => {
    const current = categoryMap[productId] || [];
    const next = current.includes(categoryId)
      ? current.filter((id) => id !== categoryId)
      : [...current, categoryId];
    const nextMap = { ...categoryMap };
    if (next.length) nextMap[productId] = next;
    else delete nextMap[productId];
    saveCategoryMap(nextMap);
  };

  const saveStock = async (next) => {
    setStock(next);
    try {
      await window.storage.set('product-stock', JSON.stringify(next), true);
      setStockError('');
    } catch (err) {
      setStockError('Kunne ikke lagre lagerantall – sjekk tilkoblingen og prøv igjen.');
    }
  };

  const saveOrderStatusMap = async (next) => {
    setOrderStatusMap(next);
    window.storage.set('product-order-status', JSON.stringify(next), true).catch(() => {});
  };

  const handleStockBlur = (key, rawValue) => {
    const trimmed = rawValue.trim();
    const next = { ...stock };
    if (trimmed === '') {
      delete next[key];
    } else {
      const num = Math.max(0, parseInt(trimmed, 10) || 0);
      next[key] = num;
    }
    saveStock(next);
    setStockDrafts((d) => { const n = { ...d }; delete n[key]; return n; });
  };

  const saveProductDiscounts = async (next) => {
    setProductDiscounts(next);
    try {
      await window.storage.set('product-discounts', JSON.stringify(next), true);
      setDiscountError('');
    } catch (err) {
      setDiscountError('Kunne ikke lagre rabatt – sjekk tilkoblingen og prøv igjen.');
    }
  };

  const handleDiscountBlur = (productId, rawValue) => {
    const trimmed = rawValue.trim();
    const next = { ...productDiscounts };
    if (trimmed === '' || trimmed === '0') {
      delete next[productId];
    } else {
      const num = Math.min(99, Math.max(1, parseInt(trimmed, 10) || 0));
      next[productId] = num;
    }
    saveProductDiscounts(next);
    setDiscountDrafts((d) => { const n = { ...d }; delete n[productId]; return n; });
  };

  const saveCategoryDiscounts = async (next) => {
    setCategoryDiscounts(next);
    try {
      await window.storage.set('category-discounts', JSON.stringify(next), true);
      setDiscountError('');
    } catch (err) {
      setDiscountError('Kunne ikke lagre rabatt – sjekk tilkoblingen og prøv igjen.');
    }
  };

  const handleCategoryDiscountBlur = (categoryId, rawValue) => {
    const trimmed = rawValue.trim();
    const next = { ...categoryDiscounts };
    if (trimmed === '' || trimmed === '0') {
      delete next[categoryId];
    } else {
      const num = Math.min(99, Math.max(1, parseInt(trimmed, 10) || 0));
      next[categoryId] = num;
    }
    saveCategoryDiscounts(next);
    setCategoryDiscountDrafts((d) => { const n = { ...d }; delete n[categoryId]; return n; });
  };

  const saveGlobalDiscount = async (value) => {
    setGlobalDiscount(value);
    try {
      await window.storage.set('global-discount', JSON.stringify(value), true);
      setDiscountError('');
    } catch (err) {
      setDiscountError('Kunne ikke lagre rabatt – sjekk tilkoblingen og prøv igjen.');
    }
  };

  const handleGlobalDiscountBlur = (rawValue) => {
    const trimmed = rawValue.trim();
    const num = trimmed === '' || trimmed === '0' ? 0 : Math.min(99, Math.max(1, parseInt(trimmed, 10) || 0));
    saveGlobalDiscount(num);
    setGlobalDiscountDraft('');
  };

  // Effective discount = best of: global, any of the product's categories, or a product-specific discount.
  const getEffectiveDiscount = (productId) => {
    let best = globalDiscount || 0;
    (categoryMap[productId] || []).forEach((catId) => {
      const d = categoryDiscounts[catId];
      if (d && d > best) best = d;
    });
    const productD = productDiscounts[productId];
    if (productD && productD > best) best = productD;
    return best || 0;
  };

  const handleShare = async (product, price, discountPct) => {
    setShareBusy(true);
    try {
      const variants = productVariants[product.id] || [];
      const selections = selectedVariants[product.id] || defaultSelections(variants);
      const originalPrice = product.price + computeVariantDelta(variants, selections);
      const blob = await generateShareCard(product, price, discountPct, originalPrice);
      const fileName = (product.name || 'produkt')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') + '.png';
      const file = new File([blob], fileName, { type: 'image/png' });
      const shareUrl = `${window.location.origin}${window.location.pathname}#produkt-${product.id}`;
      const shareText = discountPct
        ? `${product.name} – nå ${formatPrice(price)} (-${discountPct}%) hos Infinitum Dental`
        : `${product.name} – ${formatPrice(price)} hos Infinitum Dental`;

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: product.name, text: shareText, url: shareUrl });
        return;
      }
      if (navigator.share) {
        await navigator.share({ title: product.name, text: shareText, url: shareUrl });
        return;
      }
      const blobUrl = URL.createObjectURL(blob);
      setShareFallback({ product, blobUrl, fileName, shareUrl, shareText });
    } catch (err) {
      // AbortError = user cancelled the native share sheet, nothing to do
    } finally {
      setShareBusy(false);
    }
  };

  const deepLinkHandled = useRef(false);
  useEffect(() => {
    if (productsLoading || deepLinkHandled.current) return;
    deepLinkHandled.current = true;
    const match = window.location.hash.match(/^#produkt-(.+)$/);
    if (match) {
      const product = allProducts.find((p) => p.id === match[1]);
      if (product) {
        setSelectedProduct(product);
        scrollToId('nettbutikk');
      }
    }
  }, [productsLoading]);

  useEffect(() => {
    setGalleryIndex(0);
    setPageQty(1);
    if (selectedProduct?.id) trackRecentlyViewed(selectedProduct.id);
  }, [selectedProduct?.id]);

  useEffect(() => {
    let title = 'Infinitum Dental – Tannlege & nettbutikk i Lørenskog';
    if (selectedProduct) title = `${selectedProduct.name} – Infinitum Dental`;
    else if (selectedPost) title = `${selectedPost.title} – Infinitum Dental`;
    else if (selectedMember) title = `${selectedMember.name} – Infinitum Dental`;
    else if (view === 'admin') title = 'Admin – Infinitum Dental';
    document.title = title;
  }, [selectedProduct, selectedPost, selectedMember, view]);

  // --- Team ---
  const saveTeam = async (next) => {
    setTeamMembers(next);
    try {
      await window.storage.set('team-members', JSON.stringify(next), true);
      setTeamError('');
    } catch (err) {
      setTeamError('Kunne ikke lagre – sjekk tilkoblingen og prøv igjen.');
    }
  };

  const handleTeamFieldBlur = (id, field, value) => {
    saveTeam(teamMembers.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
    setTeamDrafts((d) => { const n = { ...d }; delete n[`${id}-${field}`]; return n; });
  };

  const handleTeamIconChange = (id, iconKey) => {
    saveTeam(teamMembers.map((m) => (m.id === id ? { ...m, iconKey } : m)));
  };

  const handleAddTeamMember = () => {
    if (!newTeamMember.name.trim() || !newTeamMember.role.trim()) {
      setTeamError('Fyll inn navn og rolle.');
      return;
    }
    const member = { id: 'team' + Date.now(), ...newTeamMember, name: newTeamMember.name.trim(), role: newTeamMember.role.trim(), bio: newTeamMember.bio.trim() };
    saveTeam([...teamMembers, member]);
    setNewTeamMember({ name: '', role: '', bio: '', iconKey: 'heart' });
  };

  const handleDeleteTeamMember = (id) => {
    saveTeam(teamMembers.filter((m) => m.id !== id));
  };

  // --- News ---
  const saveNews = async (next) => {
    setNewsPosts(next);
    try {
      await window.storage.set('news-posts', JSON.stringify(next), true);
      setNewsError('');
    } catch (err) {
      setNewsError('Kunne ikke lagre – sjekk tilkoblingen og prøv igjen.');
    }
  };

  const handleNewsFieldBlur = (id, field, value) => {
    saveNews(newsPosts.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
    setNewsDrafts((d) => { const n = { ...d }; delete n[`${id}-${field}`]; return n; });
  };

  const handleAddPost = () => {
    if (!newPost.title.trim() || !newPost.excerpt.trim()) {
      setNewsError('Fyll inn tittel og ingress.');
      return;
    }
    const post = {
      id: 'news' + Date.now(),
      title: newPost.title.trim(),
      date: newPost.date || new Date().toISOString().split('T')[0],
      excerpt: newPost.excerpt.trim(),
      content: newPost.content.trim() || newPost.excerpt.trim(),
    };
    saveNews([post, ...newsPosts]);
    setNewPost({ title: '', date: '', excerpt: '', content: '' });
  };

  const handleDeletePost = (id) => {
    saveNews(newsPosts.filter((p) => p.id !== id));
  };

  // --- Bookings ---
  const saveBookings = async (next) => {
    setBookings(next);
    try {
      await window.storage.set('bookings', JSON.stringify(next), true);
      setBookingsError('');
    } catch (err) {
      setBookingsError('Kunne ikke lagre – sjekk tilkoblingen og prøv igjen.');
    }
  };

  const handleBookingStatusChange = (ref, status) => {
    saveBookings(bookings.map((b) => (b.ref === ref ? { ...b, status } : b)));
  };

  const handleLookupBooking = (e) => {
    e.preventDefault();
    const ref = lookupRef.trim().toUpperCase();
    const phone = lookupPhone.trim();
    const found = bookings.find((b) => b.ref.toUpperCase() === ref && b.phone.replace(/\s/g, '') === phone.replace(/\s/g, ''));
    setLookupResult(found || null);
  };

  // --- Waitlist ---
  const saveWaitlist = async (next) => {
    setWaitlist(next);
    try {
      await window.storage.set('waitlist', JSON.stringify(next), true);
    } catch (err) {
      // ignore storage error for waitlist
    }
  };

  const handleWaitlistSubmit = (e) => {
    e.preventDefault();
    if (!waitlistForm.name.trim() || !waitlistForm.phone.trim()) return;
    const entry = {
      id: 'wl' + Date.now(),
      name: waitlistForm.name.trim(),
      phone: waitlistForm.phone.trim(),
      serviceId: waitlistForm.service,
      serviceName: services.find((s) => s.id === waitlistForm.service)?.name || '',
      note: waitlistForm.note.trim(),
      createdAt: new Date().toISOString(),
      status: 'Venter',
    };
    saveWaitlist([...waitlist, entry]);
    setWaitlistForm({ name: '', phone: '', service: DEFAULT_SERVICES[0].id, note: '' });
    setWaitlistSubmitted(true);
  };

  const handleDeleteWaitlist = (id) => {
    saveWaitlist(waitlist.filter((w) => w.id !== id));
  };

  // --- Shop orders ---
  const saveShopOrders = async (next) => {
    setShopOrders(next);
    try {
      await window.storage.set('shop-orders', JSON.stringify(next), true);
    } catch (err) {
      // ignore storage error for shop orders
    }
  };

  const handleShopOrderStatusChange = (orderRef, status) => {
    saveShopOrders(shopOrders.map((o) => (o.ref === orderRef ? { ...o, status } : o)));
  };

  // --- Brands ---
  const saveBrands = async (next) => {
    setBrands(next);
    try {
      await window.storage.set('brands', JSON.stringify(next), true);
      setBrandsError('');
    } catch (err) {
      setBrandsError('Kunne ikke lagre merker – sjekk tilkoblingen og prøv igjen.');
    }
  };

  const saveBrandMap = async (next) => {
    setBrandMap(next);
    try {
      await window.storage.set('product-brand-map', JSON.stringify(next), true);
      setBrandsError('');
    } catch (err) {
      setBrandsError('Kunne ikke lagre merke-tilknytning – sjekk tilkoblingen og prøv igjen.');
    }
  };

  const handleAddBrand = () => {
    const name = newBrandName.trim();
    if (!name) return;
    const brand = { id: 'brand' + Date.now(), name, iconKey: newBrandIcon };
    saveBrands([...brands, brand]);
    setNewBrandName('');
    setNewBrandIcon('star');
  };

  const handleRenameBrand = (id) => {
    const name = (brandEditDrafts[id] || '').trim();
    if (!name) return;
    saveBrands(brands.map((b) => (b.id === id ? { ...b, name } : b)));
    setBrandEditDrafts((d) => { const n = { ...d }; delete n[id]; return n; });
  };

  const handleBrandIconChange = (id, iconKey) => {
    saveBrands(brands.map((b) => (b.id === id ? { ...b, iconKey } : b)));
  };

  const handleDeleteBrand = (id) => {
    saveBrands(brands.filter((b) => b.id !== id));
    const nextMap = { ...brandMap };
    Object.keys(nextMap).forEach((pid) => { if (nextMap[pid] === id) delete nextMap[pid]; });
    saveBrandMap(nextMap);
    if (activeBrand === id) setActiveBrand('all');
  };

  const handleAssignBrand = (productId, brandId) => {
    const next = { ...brandMap };
    if (brandId) next[productId] = brandId;
    else delete next[productId];
    saveBrandMap(next);
  };

  // --- Site settings ---
  const handleSaveSettings = async () => {
    setSettings(settingsDraft);
    try {
      await window.storage.set('site-settings', JSON.stringify(settingsDraft), true);
      setSettingsError('');
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 2000);
    } catch (err) {
      setSettingsError('Kunne ikke lagre – sjekk tilkoblingen og prøv igjen.');
    }
  };

  // --- FAQ ---
  const saveFaq = async (next) => {
    setFaqItems(next);
    try {
      await window.storage.set('faq-items', JSON.stringify(next), true);
      setFaqError('');
    } catch (err) {
      setFaqError('Kunne ikke lagre – sjekk tilkoblingen og prøv igjen.');
    }
  };

  const handleFaqFieldBlur = (id, field, value) => {
    saveFaq(faqItems.map((f) => (f.id === id ? { ...f, [field]: value } : f)));
  };

  const handleAddFaq = () => {
    if (!newFaq.question.trim() || !newFaq.answer.trim()) {
      setFaqError('Fyll inn både spørsmål og svar.');
      return;
    }
    const item = { id: 'faq' + Date.now(), question: newFaq.question.trim(), answer: newFaq.answer.trim() };
    saveFaq([...faqItems, item]);
    setNewFaq({ question: '', answer: '' });
  };

  const handleDeleteFaq = (id) => {
    saveFaq(faqItems.filter((f) => f.id !== id));
  };

  // --- Email templates ---
  const saveEmailTemplates = async (next) => {
    setEmailTemplates(next);
    try {
      await window.storage.set('email-templates', JSON.stringify(next), true);
      setEmailError('');
    } catch (err) {
      setEmailError('Kunne ikke lagre – sjekk tilkoblingen og prøv igjen.');
    }
  };

  const handleEmailFieldBlur = (templateKey, field, value) => {
    saveEmailTemplates({ ...emailTemplates, [templateKey]: { ...emailTemplates[templateKey], [field]: value } });
    setEmailDrafts((d) => { const n = { ...d }; delete n[`${templateKey}-${field}`]; return n; });
  };

  // --- Closed dates (vacation / holidays) ---
  const saveClosedDates = async (next) => {
    setClosedDates(next);
    try {
      await window.storage.set('closed-dates', JSON.stringify(next), true);
      setClosedDatesError('');
    } catch (err) {
      setClosedDatesError('Kunne ikke lagre – sjekk tilkoblingen og prøv igjen.');
    }
  };

  const handleAddClosedSingle = () => {
    if (!newClosedSingle.date) {
      setClosedDatesError('Velg en dato.');
      return;
    }
    const item = { id: 'closed' + Date.now(), type: 'single', date: newClosedSingle.date, label: newClosedSingle.label.trim() || 'Stengt' };
    saveClosedDates([...closedDates, item]);
    setNewClosedSingle({ date: '', label: '' });
  };

  const handleAddClosedRange = () => {
    if (!newClosedRange.start || !newClosedRange.end || newClosedRange.end < newClosedRange.start) {
      setClosedDatesError('Velg en gyldig start- og sluttdato.');
      return;
    }
    const item = { id: 'closed' + Date.now(), type: 'range', start: newClosedRange.start, end: newClosedRange.end, label: newClosedRange.label.trim() || 'Stengt' };
    saveClosedDates([...closedDates, item]);
    setNewClosedRange({ start: '', end: '', label: '' });
  };

  const handleDeleteClosedDate = (id) => {
    saveClosedDates(closedDates.filter((c) => c.id !== id));
  };

  // --- Product images ---
  const saveProductImages = async (next) => {
    setProductImages(next);
    try {
      await window.storage.set('product-images', JSON.stringify(next), true);
      setImagesError('');
    } catch (err) {
      setImagesError('Kunne ikke lagre bilde – sjekk tilkoblingen og prøv igjen.');
    }
  };

  const handleAddImageUrl = (productId) => {
    const url = (imageUrlDrafts[productId] || '').trim();
    if (!url) return;
    const current = productImages[productId] || [];
    if (current.length >= MAX_IMAGES_PER_PRODUCT) {
      setImagesError(`Maks ${MAX_IMAGES_PER_PRODUCT} bilder per produkt.`);
      return;
    }
    saveProductImages({ ...productImages, [productId]: [...current, { type: 'url', value: url }] });
    setImageUrlDrafts((d) => ({ ...d, [productId]: '' }));
  };

  const handleAddImageFile = (productId, file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setImagesError('Kun bildefiler kan lastes opp.');
      return;
    }
    const current = productImages[productId] || [];
    if (current.length >= MAX_IMAGES_PER_PRODUCT) {
      setImagesError(`Maks ${MAX_IMAGES_PER_PRODUCT} bilder per produkt.`);
      return;
    }
    if (file.size > MAX_IMAGE_FILE_BYTES) {
      setImagesError(`Bildet er for stort (maks ${Math.round(MAX_IMAGE_FILE_BYTES / 1024)} KB). Bruk en bildelenke i stedet for store bilder.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      saveProductImages({ ...productImages, [productId]: [...current, { type: 'file', value: reader.result, name: file.name }] });
    };
    reader.onerror = () => setImagesError('Kunne ikke lese bildet.');
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (productId, index) => {
    const next = (productImages[productId] || []).filter((_, i) => i !== index);
    const updated = { ...productImages };
    if (next.length) updated[productId] = next;
    else delete updated[productId];
    saveProductImages(updated);
  };

  // --- Favorites (wishlist) ---
  const toggleFavorite = (productId) => {
    const next = favorites.includes(productId)
      ? favorites.filter((id) => id !== productId)
      : [...favorites, productId];
    setFavorites(next);
    window.storage.set('favorites', JSON.stringify(next), false).catch(() => {});
  };


  // --- Hero carousel auto-advance ---
  useEffect(() => {
    const t = setInterval(() => setHeroSlide((s) => (s + 1) % heroSlides.length), 5000);
    return () => clearInterval(t);
  }, [heroSlides.length]);

  // --- Recently viewed (session only) ---
  const trackRecentlyViewed = (productId) => {
    setRecentlyViewed((prev) => [productId, ...prev.filter((id) => id !== productId)].slice(0, 8));
  };

  // --- Discount codes ---
  const saveDiscountCodes = async (next) => {
    setDiscountCodes(next);
    try {
      await window.storage.set('discount-codes', JSON.stringify(next), true);
      setCodesError('');
    } catch (err) {
      setCodesError('Kunne ikke lagre – sjekk tilkoblingen og prøv igjen.');
    }
  };

  const handleAddCode = () => {
    const code = newCode.code.trim().toUpperCase();
    const percent = Math.min(99, Math.max(1, parseInt(newCode.percent, 10) || 0));
    if (!code || !percent) {
      setCodesError('Fyll inn både kode og prosent.');
      return;
    }
    if (discountCodes.some((c) => c.code === code)) {
      setCodesError('Denne koden finnes allerede.');
      return;
    }
    saveDiscountCodes([...discountCodes, { code, percent }]);
    setNewCode({ code: '', percent: '' });
  };

  const handleDeleteCode = (code) => {
    saveDiscountCodes(discountCodes.filter((c) => c.code !== code));
    if (appliedCode && appliedCode.code === code) setAppliedCode(null);
  };

  const handleApplyCode = () => {
    const input = discountCodeInput.trim().toUpperCase();
    const found = discountCodes.find((c) => c.code === input);
    if (found) {
      setAppliedCode(found);
      setCodesError('');
      showToast(`Rabattkode ${found.code} aktivert`);
    } else {
      setAppliedCode(null);
      setCodesError('Ugyldig rabattkode.');
    }
  };

  const handleRegister = async () => {
    const name = authForm.name.trim();
    const email = authForm.email.trim().toLowerCase();
    const password = authForm.password;
    const isBusiness = authForm.accountType === 'business';
    if (!name || !email || !password) { setAuthError('Fyll inn navn, e-post og passord.'); return; }
    if (isBusiness && !authForm.companyName.trim()) { setAuthError('Fyll inn bedriftsnavn.'); return; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { setAuthError('Skriv inn en gyldig e-postadresse.'); return; }
    if (password.length < 6) { setAuthError('Passordet må være minst 6 tegn.'); return; }
    try {
      await authRegister({ email, password, name, phone: authForm.phone.trim(), address: authForm.address.trim(), accountType: authForm.accountType, companyName: authForm.companyName.trim(), orgNumber: authForm.orgNumber.trim() });
      setAuthOpen(false);
      setAuthError('');
      setAuthForm({ accountType: 'private', name: '', email: '', password: '', phone: '', address: '', companyName: '', orgNumber: '' });
      showToast(`Velkommen, ${name.split(' ')[0]}! Sjekk e-posten din for bekreftelse.`);
    } catch (err) {
      setAuthError(err.message === 'User already registered' ? 'Det finnes allerede en konto med denne e-posten.' : (err.message || 'Noe gikk galt. Prøv igjen.'));
    }
  };

  const handleLogin = async () => {
    const email = authForm.email.trim().toLowerCase();
    const password = authForm.password;
    if (!email || !password) { setAuthError('Fyll inn e-post og passord.'); return; }
    try {
      const user = await authLogin({ email, password });
      const profile = await fetchProfile(user.id);
      setCurrentUser({ id: user.id, email: user.email, name: profile?.name || email, phone: profile?.phone || '', address: profile?.address || '', accountType: profile?.account_type || 'private', companyName: profile?.company_name || '', orgNumber: profile?.org_number || '' });
      setAuthOpen(false);
      setAuthError('');
      setAuthForm({ accountType: 'private', name: '', email: '', password: '', phone: '', address: '', companyName: '', orgNumber: '' });
      showToast(`Velkommen tilbake, ${(profile?.name || email).split(' ')[0]}!`);
    } catch (err) {
      setAuthError('Feil e-post eller passord.');
    }
  };

  const handleLogout = async () => {
    await authLogout();
    setCurrentUser(null);
    setAccountView(false);
    showToast('Du er logget ut');
  };

  const handleSaveProfile = async () => {
    const updated = { ...currentUser, name: profileDraft.name.trim(), phone: profileDraft.phone.trim(), address: profileDraft.address.trim() };
    await updateProfile(currentUser.id, { name: updated.name, phone: updated.phone, address: updated.address });
    setCurrentUser(updated);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const openAuth = (mode) => {
    setAuthMode(mode);
    setAuthError('');
    setAuthForm({ accountType: 'private', name: '', email: '', password: '', phone: '', address: '', companyName: '', orgNumber: '' });
    setAuthOpen(true);
    setMenuOpen(false);
  };

  const openAccount = () => {
    setProfileDraft({ name: currentUser.name, phone: currentUser.phone || '', address: currentUser.address || '' });
    setAccountView(true);
    setMenuOpen(false);
    window.scrollTo(0, 0);
  };

  // --- Featured products ---
  const saveFeatured = async (next) => {
    setFeatured(next);
    try {
      await window.storage.set('featured-products', JSON.stringify(next), true);
    } catch (err) {
      // ignore
    }
  };

  const handleToggleFeatured = (productId) => {
    const next = featured.includes(productId)
      ? featured.filter((id) => id !== productId)
      : [...featured, productId];
    saveFeatured(next);
  };

  const renderAdmin = () => (
      <div style={{ background: C.paper, color: C.ink, fontFamily: "'Manrope', sans-serif", minHeight: '100vh' }} className="w-full">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400..900&family=Manrope:wght@400;500;600;700;800&display=swap');
          html { scroll-behavior: smooth; }
          body { margin: 0; }
          .display-font { font-family: 'Fraunces', serif; }
          .focus-ring:focus-visible { outline: 2px solid ${C.pine}; outline-offset: 2px; }
        `}</style>

        <header className="sticky top-0 z-40 w-full" style={{ background: 'rgba(238,241,236,0.92)', backdropFilter: 'blur(8px)', borderBottom: `1px solid ${C.line}` }}>
          <div className="max-w-4xl mx-auto flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-2">
              <InfinityMark size={30} color={C.pine} />
              <span className="display-font text-lg font-semibold">Infinitum <span style={{ color: C.pine }}>Dental</span> – Admin</span>
            </div>
            <button
              onClick={() => { setView('site'); setAdminMessage(''); }}
              className="inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full focus-ring"
              style={{ background: C.card, color: C.ink, border: `1px solid ${C.line}` }}
            >
              <ArrowLeft size={16} /> Til nettsiden
            </button>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-12">
          {!isAdmin ? (
            <div className="max-w-sm mx-auto rounded-2xl p-8 text-center" style={{ background: C.card, border: `1px solid ${C.line}` }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(47,107,94,0.1)' }}>
                <Lock size={22} color={C.pine} />
              </div>
              <h1 className="display-font text-2xl font-bold mb-2">Admin</h1>
              <p className="text-sm mb-6" style={{ color: C.soft }}>
                {currentUser ? 'Din konto har ikke admintilgang.' : 'Logg inn med admin-kontoen for å få tilgang.'}
              </p>
              {!currentUser && (
                <button
                  onClick={() => { setView('site'); openAuth('login'); }}
                  className="font-bold py-3 px-8 rounded-full focus-ring"
                  style={{ background: C.pine, color: '#fff' }}
                >
                  Logg inn
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-10">
              <div>
                <SectionLabel>Nytt produkt</SectionLabel>
                <h1 className="display-font text-3xl font-bold mb-6">Legg til produkt</h1>
                <form onSubmit={handleAddProduct} className="rounded-2xl p-6 grid gap-5" style={{ background: C.card, border: `1px solid ${C.line}` }}>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: C.soft }}>Produktnavn</label>
                      <input
                        type="text"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct((p) => ({ ...p, name: e.target.value }))}
                        className="w-full rounded-lg px-4 py-3 text-sm focus-ring"
                        style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                        placeholder="F.eks. Tannbørste for barn"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: C.soft }}>Pris (kr)</label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct((p) => ({ ...p, price: e.target.value }))}
                        className="w-full rounded-lg px-4 py-3 text-sm focus-ring"
                        style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                        placeholder="129"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: C.soft }}>Varenummer (SKU)</label>
                      <input
                        type="text"
                        value={newProduct.sku}
                        onChange={(e) => setNewProduct((p) => ({ ...p, sku: e.target.value }))}
                        className="w-full rounded-lg px-4 py-3 text-sm focus-ring"
                        style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                        placeholder="F.eks. IDN-009"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: C.soft }}>Lagerbeholdning (stk)</label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct((p) => ({ ...p, stock: e.target.value }))}
                        className="w-full rounded-lg px-4 py-3 text-sm focus-ring"
                        style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                        placeholder="f.eks. 20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: C.soft }}>Tilgjengelighet</label>
                    <select
                      value={newProduct.orderStatus}
                      onChange={(e) => setNewProduct((p) => ({ ...p, orderStatus: e.target.value }))}
                      className="w-full rounded-lg px-4 py-3 text-sm focus-ring"
                      style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                    >
                      <option value="">Lagervare – vis lagerantall</option>
                      <option value="order-10days">Bestillingsvare – Leveringstid ca. 10 dager</option>
                      <option value="order-contact">Bestillingsvare – Ta kontakt for leveringsstatus</option>
                    </select>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: C.soft }}>Merkelapp (valgfritt)</label>
                      <input
                        type="text"
                        value={newProduct.tag}
                        onChange={(e) => setNewProduct((p) => ({ ...p, tag: e.target.value }))}
                        className="w-full rounded-lg px-4 py-3 text-sm focus-ring"
                        style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                        placeholder="F.eks. Nyhet"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: C.soft }}>Ikon</label>
                      <select
                        value={newProduct.iconKey}
                        onChange={(e) => setNewProduct((p) => ({ ...p, iconKey: e.target.value }))}
                        className="w-full rounded-lg px-4 py-3 text-sm focus-ring"
                        style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                      >
                        {ICON_OPTIONS.map((o) => (
                          <option key={o.key} value={o.key}>{o.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: C.soft }}>Kategorier (valgfritt)</label>
                    {categories.length === 0 ? (
                      <p className="text-sm" style={{ color: C.soft }}>Ingen kategorier opprettet ennå.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {categories.map((c) => {
                          const active = newProduct.categoryIds.includes(c.id);
                          return (
                            <button
                              type="button"
                              key={c.id}
                              onClick={() => setNewProduct((p) => ({
                                ...p,
                                categoryIds: active ? p.categoryIds.filter((id) => id !== c.id) : [...p.categoryIds, c.id],
                              }))}
                              className="text-sm font-semibold px-3 py-2 rounded-lg focus-ring"
                              style={{
                                border: `1px solid ${active ? C.pine : C.line}`,
                                background: active ? C.pine : '#fff',
                                color: active ? '#fff' : C.ink,
                              }}
                            >
                              {c.name}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: C.soft }}>Merke (valgfritt)</label>
                    <select
                      value={newProduct.brandId}
                      onChange={(e) => setNewProduct((p) => ({ ...p, brandId: e.target.value }))}
                      className="w-full rounded-lg px-4 py-3 text-sm focus-ring"
                      style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                    >
                      <option value="">Ingen merke</option>
                      {brands.map((b) => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: C.soft }}>Beskrivelse</label>
                    <textarea
                      value={newProduct.desc}
                      onChange={(e) => setNewProduct((p) => ({ ...p, desc: e.target.value }))}
                      rows={3}
                      className="w-full rounded-lg px-4 py-3 text-sm focus-ring"
                      style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                      placeholder="Kort tekst som vises i produktvinduet."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: C.soft }}>Egenskaper (én per linje, valgfritt)</label>
                    <textarea
                      value={newProduct.details}
                      onChange={(e) => setNewProduct((p) => ({ ...p, details: e.target.value }))}
                      rows={3}
                      className="w-full rounded-lg px-4 py-3 text-sm focus-ring"
                      style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                      placeholder={'F.eks.\nMyk bust\nFor barn 3-6 år\nFargerikt design'}
                    />
                  </div>

                  {adminMessage && (
                    <p className="text-sm font-semibold" style={{ color: C.pine }}>{adminMessage}</p>
                  )}

                  {/* Image upload inside form */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: C.soft }}>
                      Produktbilder (valgfritt, maks {MAX_IMAGES_PER_PRODUCT})
                    </label>
                    {newProductImages.length > 0 && (
                      <div className="flex flex-wrap gap-3 mb-3">
                        {newProductImages.map((img, i) => (
                          <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden" style={{ border: `1px solid ${C.line}` }}>
                            <img src={img.value} alt={`Bilde ${i + 1}`} className="w-full h-full object-contain" />
                            <button
                              type="button"
                              onClick={() => setNewProductImages((imgs) => imgs.filter((_, idx) => idx !== i))}
                              className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full flex items-center justify-center"
                              style={{ background: C.coral, color: '#fff' }}
                              aria-label="Fjern bilde"
                            >
                              <X size={11} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    {newProductImageError && (
                      <p className="text-xs mb-2" style={{ color: C.coral }}>{newProductImageError}</p>
                    )}
                    {newProductImages.length < MAX_IMAGES_PER_PRODUCT && (
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={newProductImageUrl}
                            onChange={(e) => setNewProductImageUrl(e.target.value)}
                            placeholder="Lim inn bilde-URL"
                            className="flex-1 rounded-lg px-3 py-2 text-sm focus-ring"
                            style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const url = newProductImageUrl.trim();
                              if (!url) return;
                              if (newProductImages.length >= MAX_IMAGES_PER_PRODUCT) { setNewProductImageError(`Maks ${MAX_IMAGES_PER_PRODUCT} bilder.`); return; }
                              setNewProductImages((imgs) => [...imgs, { type: 'url', value: url }]);
                              setNewProductImageUrl('');
                              setNewProductImageError('');
                            }}
                            className="text-xs font-bold px-3 py-2 rounded-lg focus-ring"
                            style={{ background: C.pine, color: '#fff' }}
                          >
                            Legg til
                          </button>
                        </div>
                        <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer rounded-lg px-3 py-2 focus-ring" style={{ border: `1px solid ${C.line}`, background: C.paper }}>
                          <Upload size={15} color={C.pine} /> Last opp fil
                          <input
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={(ev) => {
                              const file = ev.target.files?.[0];
                              if (!file) return;
                              if (!file.type.startsWith('image/')) { setNewProductImageError('Kun bildefiler.'); return; }
                              if (file.size > MAX_IMAGE_FILE_BYTES) { setNewProductImageError(`Maks ${Math.round(MAX_IMAGE_FILE_BYTES / 1024)} KB. Komprimer på squoosh.app.`); return; }
                              if (newProductImages.length >= MAX_IMAGES_PER_PRODUCT) { setNewProductImageError(`Maks ${MAX_IMAGES_PER_PRODUCT} bilder.`); return; }
                              const reader = new FileReader();
                              reader.onload = (re) => {
                                setNewProductImages((imgs) => [...imgs, { type: 'upload', value: re.target.result }]);
                                setNewProductImageError('');
                              };
                              reader.readAsDataURL(file);
                              ev.target.value = '';
                            }}
                          />
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Datasheet / documentation upload */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: C.soft }}>
                      Datablad / dokumentasjon (valgfritt, PDF maks 2 MB)
                    </label>
                    {newProductDatasheet ? (
                      <div className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: C.paper, border: `1px solid ${C.line}` }}>
                        <FileText size={18} color={C.pine} />
                        <span className="flex-1 text-sm font-semibold truncate">
                          {newProductDatasheet.name || 'Lenke til datablad'}
                        </span>
                        <button
                          type="button"
                          onClick={() => { setNewProductDatasheet(null); setNewProductDatasheetError(''); }}
                          className="text-xs font-bold focus-ring rounded px-2 py-1"
                          style={{ color: C.coral }}
                        >
                          Fjern
                        </button>
                      </div>
                    ) : (
                      <div className="grid sm:grid-cols-2 gap-3">
                        <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer rounded-lg px-3 py-2.5 focus-ring" style={{ border: `1px solid ${C.line}`, background: C.paper }}>
                          <Upload size={15} color={C.pine} /> Last opp PDF
                          <input
                            type="file"
                            accept="application/pdf"
                            className="sr-only"
                            onChange={(ev) => {
                              const file = ev.target.files?.[0];
                              if (!file) return;
                              if (file.type !== 'application/pdf') { setNewProductDatasheetError('Kun PDF-filer støttes.'); return; }
                              if (file.size > MAX_DATASHEET_BYTES) { setNewProductDatasheetError('Maks 2 MB. Bruk en lenke i stedet.'); return; }
                              const reader = new FileReader();
                              reader.onload = (re) => {
                                setNewProductDatasheet({ type: 'file', value: re.target.result, name: file.name });
                                setNewProductDatasheetError('');
                              };
                              reader.onerror = () => setNewProductDatasheetError('Kunne ikke lese filen.');
                              reader.readAsDataURL(file);
                              ev.target.value = '';
                            }}
                          />
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            placeholder="Eller lim inn lenke til PDF"
                            id="new-datasheet-url"
                            className="flex-1 rounded-lg px-3 py-2.5 text-sm focus-ring"
                            style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const url = document.getElementById('new-datasheet-url')?.value?.trim();
                              if (!url) return;
                              setNewProductDatasheet({ type: 'url', value: url, name: null });
                              setNewProductDatasheetError('');
                              if (document.getElementById('new-datasheet-url')) document.getElementById('new-datasheet-url').value = '';
                            }}
                            className="text-xs font-bold px-3 py-2.5 rounded-lg focus-ring"
                            style={{ background: C.pine, color: '#fff' }}
                          >
                            Legg til
                          </button>
                        </div>
                      </div>
                    )}
                    {newProductDatasheetError && (
                      <p className="text-xs mt-1.5" style={{ color: C.coral }}>{newProductDatasheetError}</p>
                    )}
                  </div>

                  <button type="submit" className="font-bold py-3 rounded-full focus-ring justify-self-start px-6" style={{ background: C.coral, color: '#fff' }}>
                    Legg til produkt
                  </button>
                </form>
              </div>

              <div>
                <SectionLabel>Kategorier</SectionLabel>
                <h2 className="display-font text-2xl font-bold mb-2">Kategorier</h2>
                <p className="text-sm mb-6" style={{ color: C.soft }}>
                  Opprett kategorier for nettbutikken (f.eks. "Tannbørster", "Bleking", "Munnhygiene") og knytt
                  produkter til en kategori. Kategoriene vises som filter i nettbutikken.
                </p>
                {categoriesError && (
                  <p className="text-sm font-semibold mb-4" style={{ color: C.coral }}>{categoriesError}</p>
                )}

                <div className="flex gap-3 mb-6">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Ny kategori, f.eks. Tannbørster"
                    className="flex-1 rounded-lg px-4 py-3 text-sm focus-ring"
                    style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                  />
                  <button
                    onClick={handleAddCategory}
                    disabled={!newCategoryName.trim()}
                    className="font-bold px-5 py-3 rounded-full focus-ring disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ background: C.coral, color: '#fff' }}
                  >
                    Legg til
                  </button>
                </div>

                {categories.length === 0 ? (
                  <p className="text-sm mb-8" style={{ color: C.soft }}>Ingen kategorier opprettet ennå.</p>
                ) : (
                  <div className="grid gap-2 mb-8">
                    {categories.map((c) => {
                      const editing = categoryEditDrafts[c.id] !== undefined;
                      const count = allProducts.filter((p) => (categoryMap[p.id] || []).includes(c.id)).length;
                      return (
                        <div key={c.id} className="flex items-center gap-3 rounded-xl p-3" style={{ background: C.card, border: `1px solid ${C.line}` }}>
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(47,107,94,0.08)' }}>
                            <Tag size={16} color={C.pine} />
                          </div>
                          {editing ? (
                            <input
                              type="text"
                              autoFocus
                              value={categoryEditDrafts[c.id]}
                              onChange={(e) => setCategoryEditDrafts((d) => ({ ...d, [c.id]: e.target.value }))}
                              onKeyDown={(e) => { if (e.key === 'Enter') handleRenameCategory(c.id); }}
                              className="flex-1 rounded-lg px-3 py-2 text-sm focus-ring"
                              style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                            />
                          ) : (
                            <span className="flex-1 text-sm font-semibold">{c.name} <span className="text-xs font-normal" style={{ color: C.soft }}>({count} produkt{count === 1 ? '' : 'er'})</span></span>
                          )}
                          {editing ? (
                            <button
                              onClick={() => handleRenameCategory(c.id)}
                              className="text-xs font-bold px-3 py-1.5 rounded-full focus-ring"
                              style={{ background: C.pine, color: '#fff' }}
                            >
                              Lagre
                            </button>
                          ) : (
                            <button
                              onClick={() => setCategoryEditDrafts((d) => ({ ...d, [c.id]: c.name }))}
                              aria-label="Endre navn"
                              className="p-2 rounded-full focus-ring"
                              style={{ border: `1px solid ${C.line}` }}
                            >
                              <Pencil size={14} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteCategory(c.id)}
                            aria-label="Slett kategori"
                            className="p-2 rounded-full focus-ring"
                            style={{ border: `1px solid ${C.line}` }}
                          >
                            <Trash2 size={14} color={C.coral} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {categories.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: C.soft }}>Knytt produkter til kategori</h3>
                    {productsLoading ? (
                      <p className="text-sm" style={{ color: C.soft }}>Laster produkter…</p>
                    ) : (
                      <div className="grid gap-2">
                        {allProducts.map((p) => {
                          const Icon = getIcon(p);
                          const assigned = categoryMap[p.id] || [];
                          return (
                            <div key={p.id} className="flex items-center gap-3 rounded-xl p-3" style={{ background: C.card, border: `1px solid ${C.line}` }}>
                              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(47,107,94,0.08)' }}>
                                <Icon size={16} color={C.pine} />
                              </div>
                              <span className="text-sm font-semibold flex-shrink-0" style={{ minWidth: '11rem' }}>{p.name}</span>
                              <div className="flex flex-wrap gap-2">
                                {categories.map((c) => {
                                  const active = assigned.includes(c.id);
                                  return (
                                    <button
                                      key={c.id}
                                      onClick={() => handleToggleCategory(p.id, c.id)}
                                      className="text-xs font-semibold px-3 py-1.5 rounded-full focus-ring"
                                      style={{
                                        border: `1px solid ${active ? C.pine : C.line}`,
                                        background: active ? C.pine : '#fff',
                                        color: active ? '#fff' : C.soft,
                                      }}
                                    >
                                      {c.name}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <SectionLabel>Merker</SectionLabel>
                <h2 className="display-font text-2xl font-bold mb-2">Merker</h2>
                <p className="text-sm mb-6" style={{ color: C.soft }}>
                  Vis merker som Philips, Oral-B osv. (eller din egen merkevare) på produktene. Hvert produkt kan
                  ha ett merke. Merkene vises som filter i nettbutikken og som merkelapp på produktet.
                </p>
                {brandsError && (
                  <p className="text-sm font-semibold mb-4" style={{ color: C.coral }}>{brandsError}</p>
                )}

                <div className="grid sm:grid-cols-[1fr,auto,auto] gap-3 mb-6">
                  <input
                    type="text"
                    value={newBrandName}
                    onChange={(e) => setNewBrandName(e.target.value)}
                    placeholder="Nytt merke, f.eks. Philips"
                    className="rounded-lg px-4 py-3 text-sm focus-ring"
                    style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                  />
                  <select
                    value={newBrandIcon}
                    onChange={(e) => setNewBrandIcon(e.target.value)}
                    className="rounded-lg px-3 py-3 text-sm focus-ring"
                    style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                  >
                    {ICON_OPTIONS.map((o) => (
                      <option key={o.key} value={o.key}>{o.label}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleAddBrand}
                    disabled={!newBrandName.trim()}
                    className="font-bold px-5 py-3 rounded-full focus-ring disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ background: C.coral, color: '#fff' }}
                  >
                    Legg til
                  </button>
                </div>

                {brands.length === 0 ? (
                  <p className="text-sm mb-8" style={{ color: C.soft }}>Ingen merker opprettet ennå.</p>
                ) : (
                  <div className="grid gap-2 mb-8">
                    {brands.map((b) => {
                      const Icon = getIcon({ iconKey: b.iconKey });
                      const editing = brandEditDrafts[b.id] !== undefined;
                      const count = allProducts.filter((p) => brandMap[p.id] === b.id).length;
                      return (
                        <div key={b.id} className="flex items-center gap-3 rounded-xl p-3" style={{ background: C.card, border: `1px solid ${C.line}` }}>
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(47,107,94,0.08)' }}>
                            <Icon size={16} color={C.pine} />
                          </div>
                          <select
                            value={b.iconKey}
                            onChange={(e) => handleBrandIconChange(b.id, e.target.value)}
                            className="rounded-lg px-2 py-2 text-xs focus-ring flex-shrink-0"
                            style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                          >
                            {ICON_OPTIONS.map((o) => (
                              <option key={o.key} value={o.key}>{o.label}</option>
                            ))}
                          </select>
                          {editing ? (
                            <input
                              type="text"
                              autoFocus
                              value={brandEditDrafts[b.id]}
                              onChange={(e) => setBrandEditDrafts((d) => ({ ...d, [b.id]: e.target.value }))}
                              onKeyDown={(e) => { if (e.key === 'Enter') handleRenameBrand(b.id); }}
                              className="flex-1 rounded-lg px-3 py-2 text-sm focus-ring"
                              style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                            />
                          ) : (
                            <span className="flex-1 text-sm font-semibold">{b.name} <span className="text-xs font-normal" style={{ color: C.soft }}>({count} produkt{count === 1 ? '' : 'er'})</span></span>
                          )}
                          {editing ? (
                            <button
                              onClick={() => handleRenameBrand(b.id)}
                              className="text-xs font-bold px-3 py-1.5 rounded-full focus-ring"
                              style={{ background: C.pine, color: '#fff' }}
                            >
                              Lagre
                            </button>
                          ) : (
                            <button
                              onClick={() => setBrandEditDrafts((d) => ({ ...d, [b.id]: b.name }))}
                              aria-label="Endre navn"
                              className="p-2 rounded-full focus-ring"
                              style={{ border: `1px solid ${C.line}` }}
                            >
                              <Pencil size={14} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteBrand(b.id)}
                            aria-label="Slett merke"
                            className="p-2 rounded-full focus-ring"
                            style={{ border: `1px solid ${C.line}` }}
                          >
                            <Trash2 size={14} color={C.coral} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <SectionLabel>Bilder</SectionLabel>
                <h2 className="display-font text-2xl font-bold mb-2">Produktbilder</h2>
                <p className="text-sm mb-6" style={{ color: C.soft }}>
                  Last opp egne bilder (maks {Math.round(MAX_IMAGE_FILE_BYTES / 1024)} KB per bilde) eller lim inn
                  en bildelenke. Opptil {MAX_IMAGES_PER_PRODUCT} bilder per produkt – det første vises som
                  hovedbilde i nettbutikken. Uten bilder vises ikonet som før.
                </p>
                {imagesError && (
                  <p className="text-sm font-semibold mb-4" style={{ color: C.coral }}>{imagesError}</p>
                )}
                {productsLoading ? (
                  <p className="text-sm" style={{ color: C.soft }}>Laster produkter…</p>
                ) : (
                  <div className="grid gap-3">
                    {allProducts.map((p) => {
                      const Icon = getIcon(p);
                      const images = productImages[p.id] || [];
                      const atLimit = images.length >= MAX_IMAGES_PER_PRODUCT;
                      return (
                        <div key={p.id} className="rounded-xl p-4" style={{ background: C.card, border: `1px solid ${C.line}` }}>
                          <div className="flex items-center gap-4 mb-3">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(47,107,94,0.08)' }}>
                              <Icon size={18} color={C.pine} />
                            </div>
                            <p className="text-sm font-semibold flex-1">{p.name}</p>
                            <span className="text-xs" style={{ color: C.soft }}>{images.length}/{MAX_IMAGES_PER_PRODUCT}</span>
                          </div>

                          {images.length > 0 && (
                            <div className="flex flex-wrap gap-3 mb-3">
                              {images.map((img, i) => (
                                <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0" style={{ border: `1px solid ${C.line}` }}>
                                  <img src={img.value} alt={`${p.name} ${i + 1}`} className="w-full h-full object-contain" />
                                  {i === 0 && (
                                    <span className="absolute top-1 left-1 text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: C.gold, color: '#fff' }}>
                                      Hoved
                                    </span>
                                  )}
                                  <button
                                    onClick={() => handleRemoveImage(p.id, i)}
                                    aria-label="Fjern bilde"
                                    className="absolute top-1 right-1 p-1 rounded-full focus-ring"
                                    style={{ background: 'rgba(255,255,255,0.9)' }}
                                  >
                                    <X size={12} color={C.coral} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          {!atLimit && (
                            <div className="grid sm:grid-cols-[1fr,auto,auto] gap-3">
                              <input
                                type="url"
                                placeholder="https://... (bildelenke)"
                                value={imageUrlDrafts[p.id] || ''}
                                onChange={(e) => setImageUrlDrafts((d) => ({ ...d, [p.id]: e.target.value }))}
                                className="rounded-lg px-3 py-2 text-sm focus-ring"
                                style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                              />
                              <button
                                onClick={() => handleAddImageUrl(p.id)}
                                disabled={!(imageUrlDrafts[p.id] || '').trim()}
                                className="text-sm font-bold px-4 py-2 rounded-full focus-ring disabled:opacity-40 disabled:cursor-not-allowed"
                                style={{ background: C.pine, color: '#fff' }}
                              >
                                Legg til lenke
                              </button>
                              <label
                                className="flex items-center justify-center gap-2 text-sm font-semibold px-4 py-2 rounded-full cursor-pointer focus-ring"
                                style={{ border: `1px solid ${C.line}`, background: '#fff', color: C.soft }}
                              >
                                <ImagePlus size={16} />
                                Last opp
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleAddImageFile(p.id, e.target.files?.[0])}
                                />
                              </label>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <SectionLabel>Datablader</SectionLabel>
                <h2 className="display-font text-2xl font-bold mb-2">Produkter ({allProducts.length})</h2>
                <p className="text-sm mb-6" style={{ color: C.soft }}>
                  Last opp en PDF (maks 2 MB) eller lim inn en lenke til et datablad. Databladet vises som
                  nedlastingslenke i produktvinduet på nettsiden.
                </p>
                {datasheetError && (
                  <p className="text-sm font-semibold mb-4" style={{ color: C.coral }}>{datasheetError}</p>
                )}
                {productsLoading ? (
                  <p className="text-sm" style={{ color: C.soft }}>Laster produkter…</p>
                ) : (
                  <div className="grid gap-3">
                    {allProducts.map((p) => {
                      const Icon = getIcon(p);
                      const isCustom = p.id.startsWith('c');
                      const sheet = datasheets[p.id];
                      return (
                        <div key={p.id} className="rounded-xl p-4" style={{ background: C.card, border: `1px solid ${C.line}` }}>
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(47,107,94,0.08)' }}>
                              <Icon size={18} color={C.pine} />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold">{p.name} {p.tag && <span className="text-xs font-bold px-2 py-0.5 rounded-full ml-1" style={{ background: C.gold, color: '#fff' }}>{p.tag}</span>}</p>
                              <p className="text-xs" style={{ color: C.soft }}>{formatPrice(p.price)}{!isCustom && ' · standardprodukt'}</p>
                            </div>
                            {isCustom && (
                              <button
                                onClick={() => handleDeleteProduct(p.id)}
                                aria-label="Slett produkt"
                                className="p-2 rounded-full focus-ring"
                                style={{ border: `1px solid ${C.line}` }}
                              >
                                <Trash2 size={16} color={C.coral} />
                              </button>
                            )}
                          </div>

                          <div className="mt-4 pt-4 grid gap-3" style={{ borderTop: `1px solid ${C.line}` }}>
                            {sheet ? (
                              <div className="flex items-center justify-between gap-3 text-sm">
                                <div className="flex items-center gap-2 min-w-0" style={{ color: C.pine }}>
                                  <FileText size={16} className="flex-shrink-0" />
                                  <span className="truncate font-semibold">
                                    {sheet.type === 'file' ? sheet.name : sheet.value}
                                  </span>
                                  <span className="text-xs flex-shrink-0" style={{ color: C.soft }}>
                                    ({sheet.type === 'file' ? 'opplastet PDF' : 'lenke'})
                                  </span>
                                </div>
                                <button
                                  onClick={() => handleDatasheetRemove(p.id)}
                                  className="text-xs font-bold px-3 py-1.5 rounded-full focus-ring flex-shrink-0"
                                  style={{ border: `1px solid ${C.line}` }}
                                >
                                  Fjern
                                </button>
                              </div>
                            ) : (
                              <div className="grid sm:grid-cols-[1fr,auto] gap-3 items-end">
                                <div className="grid sm:grid-cols-2 gap-3">
                                  <div className="flex items-center gap-2">
                                    <Link2 size={16} color={C.soft} className="flex-shrink-0" />
                                    <input
                                      type="url"
                                      placeholder="https://... (lenke til PDF)"
                                      value={datasheetUrlDrafts[p.id] || ''}
                                      onChange={(e) => setDatasheetUrlDrafts((d) => ({ ...d, [p.id]: e.target.value }))}
                                      className="w-full rounded-lg px-3 py-2 text-sm focus-ring"
                                      style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                                    />
                                  </div>
                                  <label
                                    className="flex items-center gap-2 text-sm font-semibold px-3 py-2 rounded-lg cursor-pointer focus-ring"
                                    style={{ border: `1px solid ${C.line}`, background: '#fff', color: C.soft }}
                                  >
                                    <Upload size={16} />
                                    Last opp PDF
                                    <input
                                      type="file"
                                      accept="application/pdf"
                                      className="hidden"
                                      onChange={(e) => handleDatasheetFile(p.id, e.target.files?.[0])}
                                    />
                                  </label>
                                </div>
                                <button
                                  onClick={() => handleDatasheetUrlSave(p.id)}
                                  disabled={!(datasheetUrlDrafts[p.id] || '').trim()}
                                  className="text-sm font-bold px-4 py-2 rounded-full focus-ring disabled:opacity-40 disabled:cursor-not-allowed"
                                  style={{ background: C.pine, color: '#fff' }}
                                >
                                  Lagre lenke
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <SectionLabel>Varianter</SectionLabel>
                <h2 className="display-font text-2xl font-bold mb-2">Produktvarianter</h2>
                <p className="text-sm mb-6" style={{ color: C.soft }}>
                  Legg til valg som størrelse, farge eller smak. Skriv alternativene kommaseparert – legg til
                  "<span style={{ fontFamily: 'monospace' }}>:+50</span>" eller
                  "<span style={{ fontFamily: 'monospace' }}>:-20</span>" etter et alternativ for å justere prisen i kroner,
                  f.eks. "Liten, Medium, Stor:+50".
                </p>
                {variantsError && (
                  <p className="text-sm font-semibold mb-4" style={{ color: C.coral }}>{variantsError}</p>
                )}
                {productsLoading ? (
                  <p className="text-sm" style={{ color: C.soft }}>Laster produkter…</p>
                ) : (
                  <div className="grid gap-3">
                    {allProducts.map((p) => {
                      const Icon = getIcon(p);
                      const groups = productVariants[p.id] || [];
                      const draft = variantGroupDrafts[p.id] || { name: '', options: '' };
                      return (
                        <div key={p.id} className="rounded-xl p-4" style={{ background: C.card, border: `1px solid ${C.line}` }}>
                          <div className="flex items-center gap-4 mb-3">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(47,107,94,0.08)' }}>
                              <Icon size={18} color={C.pine} />
                            </div>
                            <p className="text-sm font-semibold flex-1">{p.name}</p>
                          </div>

                          {groups.length > 0 && (
                            <div className="grid gap-2 mb-3">
                              {groups.map((g) => (
                                <div key={g.id} className="flex items-center justify-between gap-3 text-sm rounded-lg px-3 py-2" style={{ background: C.paper }}>
                                  <div className="flex items-center gap-2 min-w-0">
                                    <Layers size={14} color={C.pine} className="flex-shrink-0" />
                                    <span className="font-semibold flex-shrink-0">{g.name}:</span>
                                    <span className="truncate" style={{ color: C.soft }}>
                                      {g.options.map((o) => o.label + (o.priceDelta ? ` (${o.priceDelta > 0 ? '+' : ''}${o.priceDelta} kr)` : '')).join(', ')}
                                    </span>
                                  </div>
                                  <button
                                    onClick={() => handleRemoveVariantGroup(p.id, g.id)}
                                    className="text-xs font-bold px-3 py-1.5 rounded-full focus-ring flex-shrink-0"
                                    style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                                  >
                                    Fjern
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="grid sm:grid-cols-[1fr,2fr,auto] gap-3">
                            <input
                              type="text"
                              placeholder="Variantnavn, f.eks. Størrelse"
                              value={draft.name}
                              onChange={(e) => setVariantGroupDrafts((d) => ({ ...d, [p.id]: { ...draft, name: e.target.value } }))}
                              className="w-full rounded-lg px-3 py-2 text-sm focus-ring"
                              style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                            />
                            <input
                              type="text"
                              placeholder="Alternativer, f.eks. Liten, Medium, Stor:+50"
                              value={draft.options}
                              onChange={(e) => setVariantGroupDrafts((d) => ({ ...d, [p.id]: { ...draft, options: e.target.value } }))}
                              className="w-full rounded-lg px-3 py-2 text-sm focus-ring"
                              style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                            />
                            <button
                              onClick={() => handleAddVariantGroup(p.id)}
                              className="text-sm font-bold px-4 py-2 rounded-full focus-ring"
                              style={{ background: C.pine, color: '#fff' }}
                            >
                              Legg til
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <SectionLabel>Lager</SectionLabel>
                <h2 className="display-font text-2xl font-bold mb-2">Lagerstyring</h2>
                <p className="text-sm mb-6" style={{ color: C.soft }}>
                  Sett antall på lager per produkt (og per variant der det finnes). Stå tom = ikke sporet
                  (vises alltid som tilgjengelig). 0 viser "Utsolgt", og {LOW_STOCK_THRESHOLD} eller færre viser
                  "Kun X igjen" i nettbutikken.
                </p>
                {stockError && (
                  <p className="text-sm font-semibold mb-4" style={{ color: C.coral }}>{stockError}</p>
                )}
                {productsLoading ? (
                  <p className="text-sm" style={{ color: C.soft }}>Laster produkter…</p>
                ) : (
                  <div className="grid gap-3">
                    {allProducts.map((p) => {
                      const Icon = getIcon(p);
                      const variants = productVariants[p.id] || [];
                      const combos = getVariantCombinations(variants);
                      return (
                        <div key={p.id} className="rounded-xl p-4" style={{ background: C.card, border: `1px solid ${C.line}` }}>
                          <div className="flex items-center gap-4 mb-3">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(47,107,94,0.08)' }}>
                              <Icon size={18} color={C.pine} />
                            </div>
                            <p className="text-sm font-semibold flex-1">{p.name}</p>
                          </div>
                          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {combos.map((combo) => {
                              const key = buildCartKey(p.id, variants, combo);
                              const label = variants.length ? buildVariantLabel(variants, combo) : 'Lagerantall';
                              const value = stockDrafts[key] !== undefined
                                ? stockDrafts[key]
                                : (stock[key] !== undefined ? String(stock[key]) : '');
                              return (
                                <div key={key}>
                                  <label className="block text-xs font-semibold mb-1" style={{ color: C.soft }}>{label}</label>
                                  <input
                                    type="number"
                                    min="0"
                                    placeholder="Ubegrenset"
                                    value={value}
                                    onChange={(e) => setStockDrafts((d) => ({ ...d, [key]: e.target.value }))}
                                    onBlur={(e) => handleStockBlur(key, e.target.value)}
                                    className="w-full rounded-lg px-3 py-2 text-sm focus-ring"
                                    style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <SectionLabel>Rabatter</SectionLabel>
                <h2 className="display-font text-2xl font-bold mb-2">Rabatter</h2>
                <p className="text-sm mb-6" style={{ color: C.soft }}>
                  Sett rabatt på hele sortimentet, en kategori, eller enkeltprodukter. Hvis flere rabatter
                  overlapper for et produkt, er det den høyeste prosenten som gjelder – rabattene legges ikke
                  sammen. Stå tom eller 0 = ingen rabatt.
                </p>
                {discountError && (
                  <p className="text-sm font-semibold mb-4" style={{ color: C.coral }}>{discountError}</p>
                )}

                <h3 className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: C.soft }}>Hele varesortimentet</h3>
                <div className="flex items-center gap-3 mb-8">
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="99"
                      placeholder="0"
                      value={globalDiscountDraft !== '' ? globalDiscountDraft : (globalDiscount ? String(globalDiscount) : '')}
                      onChange={(e) => setGlobalDiscountDraft(e.target.value)}
                      onBlur={(e) => handleGlobalDiscountBlur(e.target.value)}
                      className="w-24 rounded-lg pl-3 pr-7 py-2 text-sm text-right focus-ring"
                      style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                    />
                    <Percent size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" color={C.soft} />
                  </div>
                  {globalDiscount > 0 && (
                    <span className="text-sm font-semibold" style={{ color: C.coral }}>
                      Gjelder for alle {allProducts.length} produkter (med mindre et enkeltprodukt har høyere rabatt)
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: C.soft }}>Per kategori</h3>
                {categories.length === 0 ? (
                  <p className="text-sm mb-8" style={{ color: C.soft }}>Ingen kategorier opprettet ennå.</p>
                ) : (
                  <div className="grid gap-2 mb-8">
                    {categories.map((c) => {
                      const value = categoryDiscountDrafts[c.id] !== undefined
                        ? categoryDiscountDrafts[c.id]
                        : (categoryDiscounts[c.id] !== undefined ? String(categoryDiscounts[c.id]) : '');
                      const count = allProducts.filter((p) => (categoryMap[p.id] || []).includes(c.id)).length;
                      return (
                        <div key={c.id} className="flex items-center gap-3 rounded-xl p-3" style={{ background: C.card, border: `1px solid ${C.line}` }}>
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(47,107,94,0.08)' }}>
                            <Tag size={16} color={C.pine} />
                          </div>
                          <span className="flex-1 text-sm font-semibold">{c.name} <span className="text-xs font-normal" style={{ color: C.soft }}>({count} produkt{count === 1 ? '' : 'er'})</span></span>
                          <div className="relative flex-shrink-0">
                            <input
                              type="number"
                              min="0"
                              max="99"
                              placeholder="0"
                              value={value}
                              onChange={(e) => setCategoryDiscountDrafts((d) => ({ ...d, [c.id]: e.target.value }))}
                              onBlur={(e) => handleCategoryDiscountBlur(c.id, e.target.value)}
                              className="w-20 rounded-lg pl-3 pr-7 py-2 text-sm text-right focus-ring"
                              style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                            />
                            <Percent size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" color={C.soft} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <h3 className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: C.soft }}>Per produkt</h3>
                {productsLoading ? (
                  <p className="text-sm" style={{ color: C.soft }}>Laster produkter…</p>
                ) : (
                  <div className="grid gap-2">
                    {allProducts.map((p) => {
                      const Icon = getIcon(p);
                      const value = discountDrafts[p.id] !== undefined
                        ? discountDrafts[p.id]
                        : (productDiscounts[p.id] !== undefined ? String(productDiscounts[p.id]) : '');
                      const effective = getEffectiveDiscount(p.id);
                      return (
                        <div key={p.id} className="flex items-center gap-3 rounded-xl p-3" style={{ background: C.card, border: `1px solid ${C.line}` }}>
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(47,107,94,0.08)' }}>
                            <Icon size={16} color={C.pine} />
                          </div>
                          <span className="flex-1 text-sm font-semibold truncate">{p.name}</span>
                          {effective ? (
                            <span className="text-xs" style={{ color: C.soft }}>
                              <span className="line-through">{formatPrice(p.price)}</span>{' '}
                              <span className="font-bold" style={{ color: C.coral }}>{formatPrice(applyDiscount(p.price, effective))}</span>
                              {!productDiscounts[p.id] && <span className="ml-1">(fra kategori/sortiment)</span>}
                            </span>
                          ) : null}
                          <div className="relative flex-shrink-0">
                            <input
                              type="number"
                              min="0"
                              max="99"
                              placeholder="0"
                              value={value}
                              onChange={(e) => setDiscountDrafts((d) => ({ ...d, [p.id]: e.target.value }))}
                              onBlur={(e) => handleDiscountBlur(p.id, e.target.value)}
                              className="w-20 rounded-lg pl-3 pr-7 py-2 text-sm text-right focus-ring"
                              style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                            />
                            <Percent size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" color={C.soft} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <SectionLabel>Rabattkoder</SectionLabel>
                <h2 className="display-font text-2xl font-bold mb-2">Rabattkoder</h2>
                <p className="text-sm mb-6" style={{ color: C.soft }}>
                  Lag kampanjekoder kunden kan taste inn i kassen for prosentavslag på hele bestillingen.
                </p>
                {codesError && (
                  <p className="text-sm font-semibold mb-4" style={{ color: C.coral }}>{codesError}</p>
                )}
                {discountCodes.length === 0 ? (
                  <p className="text-sm mb-6" style={{ color: C.soft }}>Ingen rabattkoder opprettet ennå.</p>
                ) : (
                  <div className="grid gap-2 mb-6">
                    {discountCodes.map((c) => (
                      <div key={c.code} className="flex items-center gap-3 rounded-xl p-3" style={{ background: C.card, border: `1px solid ${C.line}` }}>
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(47,107,94,0.08)' }}>
                          <Percent size={16} color={C.pine} />
                        </div>
                        <span className="flex-1 text-sm font-bold tracking-wide">{c.code}</span>
                        <span className="text-sm font-semibold" style={{ color: C.coral }}>-{c.percent}%</span>
                        <button
                          onClick={() => handleDeleteCode(c.code)}
                          aria-label="Slett kode"
                          className="p-2 rounded-full focus-ring"
                          style={{ border: `1px solid ${C.line}` }}
                        >
                          <Trash2 size={14} color={C.coral} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="grid sm:grid-cols-[1fr,auto,auto] gap-3">
                  <input
                    type="text"
                    value={newCode.code}
                    onChange={(e) => setNewCode((c) => ({ ...c, code: e.target.value }))}
                    placeholder="Kode, f.eks. SOMMER20"
                    className="rounded-lg px-3 py-2.5 text-sm uppercase focus-ring"
                    style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                  />
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={newCode.percent}
                      onChange={(e) => setNewCode((c) => ({ ...c, percent: e.target.value }))}
                      placeholder="%"
                      className="w-24 rounded-lg pl-3 pr-7 py-2.5 text-sm text-right focus-ring"
                      style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                    />
                    <Percent size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" color={C.soft} />
                  </div>
                  <button
                    onClick={handleAddCode}
                    className="text-sm font-bold px-5 py-2.5 rounded-full focus-ring"
                    style={{ background: C.pine, color: '#fff' }}
                  >
                    Legg til
                  </button>
                </div>
              </div>

              <div>
                <SectionLabel>Fremhevede</SectionLabel>
                <h2 className="display-font text-2xl font-bold mb-2">Fremhevede produkter</h2>
                <p className="text-sm mb-6" style={{ color: C.soft }}>
                  Marker produkter som skal vises i "Anbefalte produkter"-raden øverst i nettbutikken. Produkter med
                  rabatt vises automatisk i "På tilbud nå"-raden.
                </p>
                {productsLoading ? (
                  <p className="text-sm" style={{ color: C.soft }}>Laster produkter…</p>
                ) : (
                  <div className="grid gap-2">
                    {allProducts.map((p) => {
                      const Icon = getIcon(p);
                      const isFeatured = featured.includes(p.id);
                      return (
                        <div key={p.id} className="flex items-center gap-3 rounded-xl p-3" style={{ background: C.card, border: `1px solid ${C.line}` }}>
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(47,107,94,0.08)' }}>
                            <Icon size={16} color={C.pine} />
                          </div>
                          <span className="flex-1 text-sm font-semibold truncate">{p.name}</span>
                          <button
                            onClick={() => handleToggleFeatured(p.id)}
                            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full focus-ring"
                            style={{
                              border: `1px solid ${isFeatured ? C.gold : C.line}`,
                              background: isFeatured ? C.gold : '#fff',
                              color: isFeatured ? '#fff' : C.soft,
                            }}
                          >
                            <Star size={13} /> {isFeatured ? 'Fremhevet' : 'Fremhev'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <SectionLabel>Om oss</SectionLabel>
                <h2 className="display-font text-2xl font-bold mb-2">Teamet</h2>
                <p className="text-sm mb-6" style={{ color: C.soft }}>
                  Ansatte som vises på "Om oss"-siden. Endringer lagres når du klikker ut av et felt.
                </p>
                {teamError && (
                  <p className="text-sm font-semibold mb-4" style={{ color: C.coral }}>{teamError}</p>
                )}
                <div className="grid gap-3 mb-6">
                  {teamMembers.map((m) => {
                    const Icon = getIcon({ iconKey: m.iconKey });
                    return (
                      <div key={m.id} className="rounded-xl p-4 grid gap-3" style={{ background: C.card, border: `1px solid ${C.line}` }}>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(47,107,94,0.08)' }}>
                            <Icon size={18} color={C.pine} />
                          </div>
                          <select
                            value={m.iconKey}
                            onChange={(e) => handleTeamIconChange(m.id, e.target.value)}
                            className="rounded-lg px-2 py-2 text-xs focus-ring"
                            style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                          >
                            {ICON_OPTIONS.map((o) => (
                              <option key={o.key} value={o.key}>{o.label}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleDeleteTeamMember(m.id)}
                            aria-label="Slett ansatt"
                            className="ml-auto p-2 rounded-full focus-ring"
                            style={{ border: `1px solid ${C.line}` }}
                          >
                            <Trash2 size={14} color={C.coral} />
                          </button>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            defaultValue={m.name}
                            onBlur={(e) => handleTeamFieldBlur(m.id, 'name', e.target.value)}
                            placeholder="Navn"
                            className="rounded-lg px-3 py-2 text-sm focus-ring"
                            style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                          />
                          <input
                            type="text"
                            defaultValue={m.role}
                            onBlur={(e) => handleTeamFieldBlur(m.id, 'role', e.target.value)}
                            placeholder="Rolle"
                            className="rounded-lg px-3 py-2 text-sm focus-ring"
                            style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                          />
                        </div>
                        <textarea
                          defaultValue={m.bio}
                          onBlur={(e) => handleTeamFieldBlur(m.id, 'bio', e.target.value)}
                          rows={2}
                          placeholder="Kort bio"
                          className="rounded-lg px-3 py-2 text-sm focus-ring"
                          style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                        />
                      </div>
                    );
                  })}
                </div>

                <h3 className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: C.soft }}>Legg til ansatt</h3>
                <div className="rounded-xl p-4 grid gap-3" style={{ background: C.card, border: `1px solid ${C.line}` }}>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={newTeamMember.name}
                      onChange={(e) => setNewTeamMember((m) => ({ ...m, name: e.target.value }))}
                      placeholder="Navn"
                      className="rounded-lg px-3 py-2 text-sm focus-ring"
                      style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                    />
                    <input
                      type="text"
                      value={newTeamMember.role}
                      onChange={(e) => setNewTeamMember((m) => ({ ...m, role: e.target.value }))}
                      placeholder="Rolle, f.eks. Tannlege"
                      className="rounded-lg px-3 py-2 text-sm focus-ring"
                      style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                    />
                  </div>
                  <textarea
                    value={newTeamMember.bio}
                    onChange={(e) => setNewTeamMember((m) => ({ ...m, bio: e.target.value }))}
                    rows={2}
                    placeholder="Kort bio"
                    className="rounded-lg px-3 py-2 text-sm focus-ring"
                    style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                  />
                  <div className="grid sm:grid-cols-[1fr,auto] gap-3">
                    <select
                      value={newTeamMember.iconKey}
                      onChange={(e) => setNewTeamMember((m) => ({ ...m, iconKey: e.target.value }))}
                      className="rounded-lg px-3 py-2 text-sm focus-ring"
                      style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                    >
                      {ICON_OPTIONS.map((o) => (
                        <option key={o.key} value={o.key}>{o.label}</option>
                      ))}
                    </select>
                    <button
                      onClick={handleAddTeamMember}
                      className="text-sm font-bold px-5 py-2 rounded-full focus-ring"
                      style={{ background: C.pine, color: '#fff' }}
                    >
                      Legg til
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <SectionLabel>Nyheter</SectionLabel>
                <h2 className="display-font text-2xl font-bold mb-2">Nyheter & blogg</h2>
                <p className="text-sm mb-6" style={{ color: C.soft }}>
                  Innlegg som vises i "Nyheter"-seksjonen, nyeste først.
                </p>
                {newsError && (
                  <p className="text-sm font-semibold mb-4" style={{ color: C.coral }}>{newsError}</p>
                )}
                <div className="grid gap-3 mb-6">
                  {newsPosts.map((post) => (
                    <div key={post.id} className="rounded-xl p-4 grid gap-3" style={{ background: C.card, border: `1px solid ${C.line}` }}>
                      <div className="grid sm:grid-cols-[1fr,auto,auto] gap-3">
                        <input
                          type="text"
                          defaultValue={post.title}
                          onBlur={(e) => handleNewsFieldBlur(post.id, 'title', e.target.value)}
                          placeholder="Tittel"
                          className="rounded-lg px-3 py-2 text-sm font-semibold focus-ring"
                          style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                        />
                        <input
                          type="date"
                          defaultValue={post.date}
                          onBlur={(e) => handleNewsFieldBlur(post.id, 'date', e.target.value)}
                          className="rounded-lg px-3 py-2 text-sm focus-ring"
                          style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                        />
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          aria-label="Slett innlegg"
                          className="p-2 rounded-full focus-ring justify-self-end"
                          style={{ border: `1px solid ${C.line}` }}
                        >
                          <Trash2 size={14} color={C.coral} />
                        </button>
                      </div>
                      <textarea
                        defaultValue={post.excerpt}
                        onBlur={(e) => handleNewsFieldBlur(post.id, 'excerpt', e.target.value)}
                        rows={2}
                        placeholder="Ingress (kort sammendrag)"
                        className="rounded-lg px-3 py-2 text-sm focus-ring"
                        style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                      />
                      <textarea
                        defaultValue={post.content}
                        onBlur={(e) => handleNewsFieldBlur(post.id, 'content', e.target.value)}
                        rows={3}
                        placeholder="Full tekst"
                        className="rounded-lg px-3 py-2 text-sm focus-ring"
                        style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                      />
                    </div>
                  ))}
                </div>

                <h3 className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: C.soft }}>Nytt innlegg</h3>
                <div className="rounded-xl p-4 grid gap-3" style={{ background: C.card, border: `1px solid ${C.line}` }}>
                  <div className="grid sm:grid-cols-[1fr,auto] gap-3">
                    <input
                      type="text"
                      value={newPost.title}
                      onChange={(e) => setNewPost((p) => ({ ...p, title: e.target.value }))}
                      placeholder="Tittel"
                      className="rounded-lg px-3 py-2 text-sm focus-ring"
                      style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                    />
                    <input
                      type="date"
                      value={newPost.date}
                      onChange={(e) => setNewPost((p) => ({ ...p, date: e.target.value }))}
                      className="rounded-lg px-3 py-2 text-sm focus-ring"
                      style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                    />
                  </div>
                  <textarea
                    value={newPost.excerpt}
                    onChange={(e) => setNewPost((p) => ({ ...p, excerpt: e.target.value }))}
                    rows={2}
                    placeholder="Ingress (kort sammendrag)"
                    className="rounded-lg px-3 py-2 text-sm focus-ring"
                    style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                  />
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost((p) => ({ ...p, content: e.target.value }))}
                    rows={3}
                    placeholder="Full tekst (valgfritt – bruker ingress hvis tom)"
                    className="rounded-lg px-3 py-2 text-sm focus-ring"
                    style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                  />
                  <button
                    onClick={handleAddPost}
                    className="text-sm font-bold px-5 py-2.5 rounded-full focus-ring justify-self-start"
                    style={{ background: C.coral, color: '#fff' }}
                  >
                    Publiser
                  </button>
                </div>
              </div>

              <div>
                <SectionLabel>Bestillinger</SectionLabel>
                <h2 className="display-font text-2xl font-bold mb-2">Bookede timer</h2>
                <p className="text-sm mb-6" style={{ color: C.soft }}>
                  Oversikt over alle bestillinger fra "Bestill time". Status oppdateres her og vises i "Mine
                  bestillinger" for kunden.
                </p>
                {bookingsError && (
                  <p className="text-sm font-semibold mb-4" style={{ color: C.coral }}>{bookingsError}</p>
                )}
                {bookings.length === 0 ? (
                  <p className="text-sm" style={{ color: C.soft }}>Ingen bestillinger ennå.</p>
                ) : (
                  <div className="grid gap-2">
                    {[...bookings].reverse().map((b) => (
                      <div key={b.ref} className="rounded-xl p-4 grid sm:grid-cols-[auto,1fr,auto] gap-3 items-center" style={{ background: C.card, border: `1px solid ${C.line}` }}>
                        <div>
                          <p className="text-xs font-bold" style={{ color: C.pine }}>{b.ref}</p>
                          <p className="text-xs" style={{ color: C.soft }}>{b.date} kl. {b.time}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{b.serviceName}{b.practitionerName ? ` · ${b.practitionerName}` : ''}</p>
                          <p className="text-xs" style={{ color: C.soft }}>{b.name} · {b.phone}</p>
                        </div>
                        <select
                          value={b.status}
                          onChange={(e) => handleBookingStatusChange(b.ref, e.target.value)}
                          className="rounded-lg px-3 py-2 text-sm font-semibold focus-ring justify-self-start sm:justify-self-end"
                          style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                        >
                          <option value="Bekreftet">Bekreftet</option>
                          <option value="Fullført">Fullført</option>
                          <option value="Avlyst">Avlyst</option>
                          <option value="Ikke møtt">Ikke møtt</option>
                        </select>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <SectionLabel>Butikkordrer</SectionLabel>
                <h2 className="display-font text-2xl font-bold mb-2">Bestillinger fra nettbutikken</h2>
                <p className="text-sm mb-6" style={{ color: C.soft }}>
                  Alle kjøp fra nettbutikken med varer, levering og status. Oppdater status etter hvert som ordren
                  behandles.
                </p>
                {shopOrders.length === 0 ? (
                  <p className="text-sm" style={{ color: C.soft }}>Ingen butikkordrer ennå.</p>
                ) : (
                  <div className="grid gap-3">
                    {[...shopOrders].reverse().map((o) => (
                      <div key={o.ref} className="rounded-xl p-4" style={{ background: C.card, border: `1px solid ${C.line}` }}>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <p className="text-xs font-bold" style={{ color: C.pine }}>{o.ref}</p>
                            <p className="text-sm font-semibold">{o.name} <span className="font-normal" style={{ color: C.soft }}>· {o.phone}</span></p>
                            <p className="text-xs" style={{ color: C.soft }}>
                              {new Date(o.createdAt).toLocaleString('nb-NO', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                              {' · '}
                              {o.delivery === 'home' ? 'Hjemlevering' : 'Henting i klinikk'}
                              {o.delivery === 'home' && o.address ? ` · ${o.address}` : ''}
                            </p>
                          </div>
                          <select
                            value={o.status}
                            onChange={(e) => handleShopOrderStatusChange(o.ref, e.target.value)}
                            className="rounded-lg px-3 py-2 text-sm font-semibold focus-ring flex-shrink-0"
                            style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                          >
                            <option value="Ny">Ny</option>
                            <option value="Under behandling">Under behandling</option>
                            <option value="Klar for henting">Klar for henting</option>
                            <option value="Sendt">Sendt</option>
                            <option value="Fullført">Fullført</option>
                            <option value="Avbrutt">Avbrutt</option>
                          </select>
                        </div>
                        <div className="rounded-lg p-3" style={{ background: C.paper }}>
                          {o.items.map((it, idx) => (
                            <div key={idx} className="flex justify-between text-sm py-0.5">
                              <span style={{ color: C.soft }}>
                                {it.qty} × {it.name}{it.variantLabel ? ` (${it.variantLabel})` : ''}
                              </span>
                              <span className="font-semibold">{formatPrice(it.lineTotal)}</span>
                            </div>
                          ))}
                          {o.discountAmount > 0 && (
                            <div className="flex justify-between text-sm pt-2 mt-2" style={{ borderTop: `1px solid ${C.line}`, color: C.coral }}>
                              <span>Rabatt{o.discountCode ? ` (${o.discountCode})` : ''}</span>
                              <span>−{formatPrice(o.discountAmount)}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-sm pt-2 mt-2" style={{ borderTop: `1px solid ${C.line}`, color: C.soft }}>
                            <span>Frakt</span>
                            <span>{o.shipping === 0 ? 'Gratis' : formatPrice(o.shipping)}</span>
                          </div>
                          <div className="flex justify-between text-sm font-bold pt-1">
                            <span>Totalt</span>
                            <span>{formatPrice(o.total)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <SectionLabel>Venteliste</SectionLabel>
                <h2 className="display-font text-2xl font-bold mb-2">Venteliste</h2>
                <p className="text-sm mb-6" style={{ color: C.soft }}>
                  Pasienter som ønsker beskjed hvis en tidligere time blir ledig. Fjern dem fra listen når de er
                  kontaktet eller har fått time.
                </p>
                {waitlist.length === 0 ? (
                  <p className="text-sm" style={{ color: C.soft }}>Ingen på venteliste ennå.</p>
                ) : (
                  <div className="grid gap-2">
                    {[...waitlist].reverse().map((w) => (
                      <div key={w.id} className="flex items-center gap-3 rounded-xl p-4" style={{ background: C.card, border: `1px solid ${C.line}` }}>
                        <div className="flex-1">
                          <p className="text-sm font-semibold">{w.name} <span className="font-normal" style={{ color: C.soft }}>· {w.phone}</span></p>
                          <p className="text-xs" style={{ color: C.soft }}>
                            {w.serviceName}{w.note ? ` · ${w.note}` : ''}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteWaitlist(w.id)}
                          aria-label="Fjern fra venteliste"
                          className="p-2 rounded-full focus-ring"
                          style={{ border: `1px solid ${C.line}` }}
                        >
                          <Trash2 size={14} color={C.coral} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <SectionLabel>Innstillinger</SectionLabel>
                <h2 className="display-font text-2xl font-bold mb-2">Kontaktinformasjon & åpningstider</h2>
                <p className="text-sm mb-6" style={{ color: C.soft }}>
                  Vises i footer, kontaktboksen og bekreftelses-e-poster. WhatsApp-nummer skrives uten "+" eller
                  mellomrom, f.eks. 4767000000 for +47 67 00 00 00.
                </p>
                {settingsError && (
                  <p className="text-sm font-semibold mb-4" style={{ color: C.coral }}>{settingsError}</p>
                )}
                <div className="rounded-xl p-4 grid gap-4" style={{ background: C.card, border: `1px solid ${C.line}` }}>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: C.soft }}>Telefon</label>
                      <input
                        type="text"
                        value={settingsDraft.phone}
                        onChange={(e) => setSettingsDraft((s) => ({ ...s, phone: e.target.value }))}
                        className="w-full rounded-lg px-3 py-2 text-sm focus-ring"
                        style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: C.soft }}>WhatsApp-nummer</label>
                      <input
                        type="text"
                        value={settingsDraft.whatsapp}
                        onChange={(e) => setSettingsDraft((s) => ({ ...s, whatsapp: e.target.value }))}
                        placeholder="4767000000"
                        className="w-full rounded-lg px-3 py-2 text-sm focus-ring"
                        style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: C.soft }}>E-post</label>
                      <input
                        type="email"
                        value={settingsDraft.email}
                        onChange={(e) => setSettingsDraft((s) => ({ ...s, email: e.target.value }))}
                        className="w-full rounded-lg px-3 py-2 text-sm focus-ring"
                        style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: C.soft }}>Adresse</label>
                      <input
                        type="text"
                        value={settingsDraft.address}
                        onChange={(e) => setSettingsDraft((s) => ({ ...s, address: e.target.value }))}
                        className="w-full rounded-lg px-3 py-2 text-sm focus-ring"
                        style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: C.soft }}>Åpningstider</label>
                    <div className="grid gap-2">
                      {DAY_KEYS.map((day) => (
                        <div key={day} className="grid grid-cols-[100px,1fr] gap-3 items-center">
                          <span className="text-sm font-semibold">{DAY_LABELS[day]}</span>
                          <input
                            type="text"
                            value={settingsDraft.hours[day]}
                            onChange={(e) => setSettingsDraft((s) => ({ ...s, hours: { ...s.hours, [day]: e.target.value } }))}
                            placeholder="f.eks. 08:00–16:00 eller Stengt"
                            className="rounded-lg px-3 py-2 text-sm focus-ring"
                            style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4" style={{ borderTop: `1px solid ${C.line}` }}>
                    <label className="flex items-center gap-2 text-sm font-bold mb-3">
                      <input
                        type="checkbox"
                        checked={!!settingsDraft.bannerEnabled}
                        onChange={(e) => setSettingsDraft((s) => ({ ...s, bannerEnabled: e.target.checked }))}
                      />
                      Vis kampanjebanner øverst
                    </label>
                    <input
                      type="text"
                      value={settingsDraft.bannerText}
                      onChange={(e) => setSettingsDraft((s) => ({ ...s, bannerText: e.target.value }))}
                      placeholder="Bannertekst, f.eks. Fri frakt over 499 kr"
                      className="w-full rounded-lg px-3 py-2 text-sm focus-ring"
                      style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: C.soft }}>Grense for fri frakt (kr)</label>
                      <input
                        type="number"
                        min="0"
                        value={settingsDraft.freeShippingThreshold}
                        onChange={(e) => setSettingsDraft((s) => ({ ...s, freeShippingThreshold: Math.max(0, parseInt(e.target.value, 10) || 0) }))}
                        className="w-full rounded-lg px-3 py-2 text-sm focus-ring"
                        style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: C.soft }}>Fraktpris (kr)</label>
                      <input
                        type="number"
                        min="0"
                        value={settingsDraft.shippingCost}
                        onChange={(e) => setSettingsDraft((s) => ({ ...s, shippingCost: Math.max(0, parseInt(e.target.value, 10) || 0) }))}
                        className="w-full rounded-lg px-3 py-2 text-sm focus-ring"
                        style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleSaveSettings}
                      className="font-bold px-6 py-2.5 rounded-full focus-ring justify-self-start"
                      style={{ background: C.coral, color: '#fff' }}
                    >
                      Lagre
                    </button>
                    {settingsSaved && (
                      <span className="text-sm font-semibold flex items-center gap-1" style={{ color: C.pine }}>
                        <Check size={16} /> Lagret
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <SectionLabel>FAQ</SectionLabel>
                <h2 className="display-font text-2xl font-bold mb-2">Ofte stilte spørsmål</h2>
                <p className="text-sm mb-6" style={{ color: C.soft }}>
                  Vises i FAQ-seksjonen på nettsiden som en utvidbar liste.
                </p>
                {faqError && (
                  <p className="text-sm font-semibold mb-4" style={{ color: C.coral }}>{faqError}</p>
                )}
                <div className="grid gap-3 mb-6">
                  {faqItems.map((f) => (
                    <div key={f.id} className="rounded-xl p-4 grid gap-3" style={{ background: C.card, border: `1px solid ${C.line}` }}>
                      <div className="flex items-start gap-3">
                        <input
                          type="text"
                          defaultValue={f.question}
                          onBlur={(e) => handleFaqFieldBlur(f.id, 'question', e.target.value)}
                          placeholder="Spørsmål"
                          className="flex-1 rounded-lg px-3 py-2 text-sm font-semibold focus-ring"
                          style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                        />
                        <button
                          onClick={() => handleDeleteFaq(f.id)}
                          aria-label="Slett spørsmål"
                          className="p-2 rounded-full focus-ring flex-shrink-0"
                          style={{ border: `1px solid ${C.line}` }}
                        >
                          <Trash2 size={14} color={C.coral} />
                        </button>
                      </div>
                      <textarea
                        defaultValue={f.answer}
                        onBlur={(e) => handleFaqFieldBlur(f.id, 'answer', e.target.value)}
                        rows={2}
                        placeholder="Svar"
                        className="rounded-lg px-3 py-2 text-sm focus-ring"
                        style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                      />
                    </div>
                  ))}
                </div>

                <h3 className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: C.soft }}>Nytt spørsmål</h3>
                <div className="rounded-xl p-4 grid gap-3" style={{ background: C.card, border: `1px solid ${C.line}` }}>
                  <input
                    type="text"
                    value={newFaq.question}
                    onChange={(e) => setNewFaq((f) => ({ ...f, question: e.target.value }))}
                    placeholder="Spørsmål"
                    className="rounded-lg px-3 py-2 text-sm focus-ring"
                    style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                  />
                  <textarea
                    value={newFaq.answer}
                    onChange={(e) => setNewFaq((f) => ({ ...f, answer: e.target.value }))}
                    rows={2}
                    placeholder="Svar"
                    className="rounded-lg px-3 py-2 text-sm focus-ring"
                    style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                  />
                  <button
                    onClick={handleAddFaq}
                    className="text-sm font-bold px-5 py-2.5 rounded-full focus-ring justify-self-start"
                    style={{ background: C.pine, color: '#fff' }}
                  >
                    Legg til
                  </button>
                </div>
              </div>

              <div>
                <SectionLabel>E-postmaler</SectionLabel>
                <h2 className="display-font text-2xl font-bold mb-2">Bekreftelses-e-poster</h2>
                <p className="text-sm mb-6" style={{ color: C.soft }}>
                  Tekstene som vises som "e-postforhåndsvisning" til kunden etter bestilling. Bruk plassholdere i
                  doble krøllparenteser – de fylles inn automatisk.
                </p>
                {emailError && (
                  <p className="text-sm font-semibold mb-4" style={{ color: C.coral }}>{emailError}</p>
                )}

                <div className="grid gap-3 mb-6">
                  <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: C.soft }}>Bekreftelse – Bestill time</h3>
                  <p className="text-xs" style={{ color: C.soft }}>
                    Plassholdere: {'{{name}}'}, {'{{service}}'}, {'{{date}}'}, {'{{time}}'}, {'{{ref}}'}, {'{{address}}'}, {'{{phone}}'}
                  </p>
                  <div className="rounded-xl p-4 grid gap-3" style={{ background: C.card, border: `1px solid ${C.line}` }}>
                    <input
                      type="text"
                      defaultValue={emailTemplates.booking.subject}
                      onBlur={(e) => handleEmailFieldBlur('booking', 'subject', e.target.value)}
                      placeholder="Emne"
                      className="rounded-lg px-3 py-2 text-sm font-semibold focus-ring"
                      style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                    />
                    <textarea
                      defaultValue={emailTemplates.booking.body}
                      onBlur={(e) => handleEmailFieldBlur('booking', 'body', e.target.value)}
                      rows={6}
                      placeholder="Tekst"
                      className="rounded-lg px-3 py-2 text-sm font-mono focus-ring"
                      style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                    />
                  </div>
                </div>

                <div className="grid gap-3">
                  <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: C.soft }}>Bekreftelse – Nettbutikk-bestilling</h3>
                  <p className="text-xs" style={{ color: C.soft }}>
                    Plassholdere: {'{{total}}'}, {'{{items}}'}, {'{{address}}'}, {'{{phone}}'}
                  </p>
                  <div className="rounded-xl p-4 grid gap-3" style={{ background: C.card, border: `1px solid ${C.line}` }}>
                    <input
                      type="text"
                      defaultValue={emailTemplates.order.subject}
                      onBlur={(e) => handleEmailFieldBlur('order', 'subject', e.target.value)}
                      placeholder="Emne"
                      className="rounded-lg px-3 py-2 text-sm font-semibold focus-ring"
                      style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                    />
                    <textarea
                      defaultValue={emailTemplates.order.body}
                      onBlur={(e) => handleEmailFieldBlur('order', 'body', e.target.value)}
                      rows={6}
                      placeholder="Tekst"
                      className="rounded-lg px-3 py-2 text-sm font-mono focus-ring"
                      style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <SectionLabel>Stengte dager</SectionLabel>
                <h2 className="display-font text-2xl font-bold mb-2">Ferie, helligdager & stengte dager</h2>
                <p className="text-sm mb-6" style={{ color: C.soft }}>
                  Datoer listet her kan ikke bestilles under "Bestill time" – kunden ser i stedet at klinikken er
                  stengt med årsak. Ukedager satt til "Stengt" under Innstillinger → Åpningstider (f.eks. helg)
                  er automatisk stengt hver uke og trenger ikke legges til her.
                </p>
                {closedDatesError && (
                  <p className="text-sm font-semibold mb-4" style={{ color: C.coral }}>{closedDatesError}</p>
                )}

                {closedDates.length === 0 ? (
                  <p className="text-sm mb-6" style={{ color: C.soft }}>Ingen stengte dager registrert ennå.</p>
                ) : (
                  <div className="grid gap-2 mb-6">
                    {[...closedDates]
                      .sort((a, b) => (a.type === 'single' ? a.date : a.start).localeCompare(b.type === 'single' ? b.date : b.start))
                      .map((c) => (
                        <div key={c.id} className="flex items-center gap-3 rounded-xl p-3" style={{ background: C.card, border: `1px solid ${C.line}` }}>
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(47,107,94,0.08)' }}>
                            <CalendarOff size={16} color={C.pine} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold">{c.label}</p>
                            <p className="text-xs" style={{ color: C.soft }}>
                              {c.type === 'single' ? c.date : `${c.start} – ${c.end}`}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteClosedDate(c.id)}
                            aria-label="Slett"
                            className="p-2 rounded-full focus-ring"
                            style={{ border: `1px solid ${C.line}` }}
                          >
                            <Trash2 size={14} color={C.coral} />
                          </button>
                        </div>
                      ))}
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="rounded-xl p-4 grid gap-3" style={{ background: C.card, border: `1px solid ${C.line}` }}>
                    <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: C.soft }}>Enkeltdag (f.eks. helligdag)</h3>
                    <input
                      type="date"
                      value={newClosedSingle.date}
                      onChange={(e) => setNewClosedSingle((s) => ({ ...s, date: e.target.value }))}
                      className="rounded-lg px-3 py-2 text-sm focus-ring"
                      style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                    />
                    <input
                      type="text"
                      value={newClosedSingle.label}
                      onChange={(e) => setNewClosedSingle((s) => ({ ...s, label: e.target.value }))}
                      placeholder="Årsak, f.eks. 1. mai"
                      className="rounded-lg px-3 py-2 text-sm focus-ring"
                      style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                    />
                    <button
                      onClick={handleAddClosedSingle}
                      className="text-sm font-bold px-5 py-2.5 rounded-full focus-ring justify-self-start"
                      style={{ background: C.pine, color: '#fff' }}
                    >
                      Legg til
                    </button>
                  </div>

                  <div className="rounded-xl p-4 grid gap-3" style={{ background: C.card, border: `1px solid ${C.line}` }}>
                    <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: C.soft }}>Periode (f.eks. ferie)</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="date"
                        value={newClosedRange.start}
                        onChange={(e) => setNewClosedRange((s) => ({ ...s, start: e.target.value }))}
                        className="rounded-lg px-3 py-2 text-sm focus-ring"
                        style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                      />
                      <input
                        type="date"
                        value={newClosedRange.end}
                        onChange={(e) => setNewClosedRange((s) => ({ ...s, end: e.target.value }))}
                        className="rounded-lg px-3 py-2 text-sm focus-ring"
                        style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                      />
                    </div>
                    <input
                      type="text"
                      value={newClosedRange.label}
                      onChange={(e) => setNewClosedRange((s) => ({ ...s, label: e.target.value }))}
                      placeholder="Årsak, f.eks. Sommerferie"
                      className="rounded-lg px-3 py-2 text-sm focus-ring"
                      style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                    />
                    <button
                      onClick={handleAddClosedRange}
                      className="text-sm font-bold px-5 py-2.5 rounded-full focus-ring justify-self-start"
                      style={{ background: C.pine, color: '#fff' }}
                    >
                      Legg til
                    </button>
                  </div>
                </div>
              </div>

              {/* --- Hero slides --- */}
              <div>
                <SectionLabel>Hero-karusell</SectionLabel>
                <h2 className="display-font text-2xl font-bold mb-6">Rediger slides</h2>
                <div className="grid gap-6">
                  {heroSlides.map((slide, idx) => (
                    <div key={slide.id} className="rounded-2xl p-6 grid gap-4" style={{ background: C.card, border: `1px solid ${C.line}` }}>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm" style={{ color: C.pine }}>Slide {idx + 1}</span>
                        <button onClick={() => { const u = heroSlides.filter((_,i)=>i!==idx); setHeroSlidesList(u); window.storage.set('hero-slides',JSON.stringify(u),true).catch(()=>{}); }} className="text-xs px-3 py-1.5 rounded-full focus-ring" style={{ background:'rgba(226,116,90,0.1)', color:C.coral }}>Slett</button>
                      </div>
                      {[['eyebrow','Toppmerke'],['title1','Tittel del 1 (svart)'],['title2','Tittel del 2 (grønn)'],['lead','Ingress']].map(([field,label]) => (
                        <div key={field}>
                          <label className="block text-xs font-semibold mb-1" style={{ color:C.soft }}>{label}</label>
                          <input value={slide[field]} onChange={(e) => { const u=heroSlides.map((s,i)=>i===idx?{...s,[field]:e.target.value}:s); setHeroSlidesList(u); window.storage.set('hero-slides',JSON.stringify(u),true).catch(()=>{}); }} className="w-full rounded-lg px-3 py-2 text-sm focus-ring" style={{ border:`1px solid ${C.line}`, background:'#fff' }} />
                        </div>
                      ))}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold mb-1" style={{ color:C.soft }}>CTA-knapp tekst</label>
                          <input value={slide.cta.label} onChange={(e) => { const u=heroSlides.map((s,i)=>i===idx?{...s,cta:{...s.cta,label:e.target.value}}:s); setHeroSlidesList(u); window.storage.set('hero-slides',JSON.stringify(u),true).catch(()=>{}); }} className="w-full rounded-lg px-3 py-2 text-sm focus-ring" style={{ border:`1px solid ${C.line}`, background:'#fff' }} />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold mb-1" style={{ color:C.soft }}>Visuell stil</label>
                          <select value={slide.visual} onChange={(e) => { const u=heroSlides.map((s,i)=>i===idx?{...s,visual:e.target.value}:s); setHeroSlidesList(u); window.storage.set('hero-slides',JSON.stringify(u),true).catch(()=>{}); }} className="w-full rounded-lg px-3 py-2 text-sm focus-ring" style={{ border:`1px solid ${C.line}`, background:'#fff' }}>
                            <option value="cards">Tjenestekort</option>
                            <option value="shop">Produkter</option>
                            <option value="booking">Timebestilling</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => { const u=[...heroSlides,{id:`h${Date.now()}`,eyebrow:'Ny slide',title1:'Tittel',title2:'del to',lead:'Beskrivelse.',cta:{label:'Les mer',href:'tjenester'},cta2:null,visual:'cards'}]; setHeroSlidesList(u); window.storage.set('hero-slides',JSON.stringify(u),true).catch(()=>{}); }} className="text-sm font-bold px-5 py-2.5 rounded-full focus-ring" style={{ background:C.pine, color:'#fff' }}>+ Legg til slide</button>
                </div>
              </div>

              {/* --- Tjenester --- */}
              <div>
                <SectionLabel>Tjenester</SectionLabel>
                <h2 className="display-font text-2xl font-bold mb-6">Behandlinger og priser</h2>
                <div className="grid gap-4">
                  {services.map((svc, idx) => (
                    <div key={svc.id} className="rounded-2xl p-5 grid gap-3" style={{ background:C.card, border:`1px solid ${C.line}` }}>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm" style={{ color:C.pine }}>{svc.name}</span>
                        <button onClick={() => { const u=services.filter((_,i)=>i!==idx); setServices(u); window.storage.set('clinic-services',JSON.stringify(u),true).catch(()=>{}); }} className="text-xs px-3 py-1.5 rounded-full focus-ring" style={{ background:'rgba(226,116,90,0.1)', color:C.coral }}>Slett</button>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div><label className="block text-xs font-semibold mb-1" style={{ color:C.soft }}>Navn</label><input value={svc.name} onChange={(e)=>{const u=services.map((s,i)=>i===idx?{...s,name:e.target.value}:s);setServices(u);window.storage.set('clinic-services',JSON.stringify(u),true).catch(()=>{});}} className="w-full rounded-lg px-3 py-2 text-sm focus-ring" style={{ border:`1px solid ${C.line}`, background:'#fff' }} /></div>
                        <div><label className="block text-xs font-semibold mb-1" style={{ color:C.soft }}>Pris (kr)</label><input type="number" value={svc.price} onChange={(e)=>{const u=services.map((s,i)=>i===idx?{...s,price:Number(e.target.value)}:s);setServices(u);window.storage.set('clinic-services',JSON.stringify(u),true).catch(()=>{});}} className="w-full rounded-lg px-3 py-2 text-sm focus-ring" style={{ border:`1px solid ${C.line}`, background:'#fff' }} /></div>
                        <div><label className="block text-xs font-semibold mb-1" style={{ color:C.soft }}>Varighet</label><input value={svc.duration} onChange={(e)=>{const u=services.map((s,i)=>i===idx?{...s,duration:e.target.value}:s);setServices(u);window.storage.set('clinic-services',JSON.stringify(u),true).catch(()=>{});}} className="w-full rounded-lg px-3 py-2 text-sm focus-ring" style={{ border:`1px solid ${C.line}`, background:'#fff' }} /></div>
                        <div><label className="block text-xs font-semibold mb-1" style={{ color:C.soft }}>Ikon</label><select value={svc.iconKey} onChange={(e)=>{const u=services.map((s,i)=>i===idx?{...s,iconKey:e.target.value}:s);setServices(u);window.storage.set('clinic-services',JSON.stringify(u),true).catch(()=>{});}} className="w-full rounded-lg px-3 py-2 text-sm focus-ring" style={{ border:`1px solid ${C.line}`, background:'#fff' }}>{Object.keys(SERVICE_ICON_MAP).map(k=><option key={k} value={k}>{k}</option>)}</select></div>
                      </div>
                      <div><label className="block text-xs font-semibold mb-1" style={{ color:C.soft }}>Beskrivelse</label><textarea value={svc.desc} rows={2} onChange={(e)=>{const u=services.map((s,i)=>i===idx?{...s,desc:e.target.value}:s);setServices(u);window.storage.set('clinic-services',JSON.stringify(u),true).catch(()=>{});}} className="w-full rounded-lg px-3 py-2 text-sm focus-ring resize-none" style={{ border:`1px solid ${C.line}`, background:'#fff' }} /></div>
                    </div>
                  ))}
                  <button onClick={()=>{const u=[...services,{id:`svc${Date.now()}`,name:'Ny behandling',duration:'30 min',price:0,iconKey:'stethoscope',desc:'Beskriv behandlingen.'}];setServices(u);window.storage.set('clinic-services',JSON.stringify(u),true).catch(()=>{});}} className="text-sm font-bold px-5 py-2.5 rounded-full focus-ring" style={{ background:C.pine, color:'#fff' }}>+ Legg til behandling</button>
                </div>
              </div>

              {/* --- Trust badges --- */}
              <div>
                <SectionLabel>Trust-badges</SectionLabel>
                <h2 className="display-font text-2xl font-bold mb-6">Grønn informasjonsrad</h2>
                <div className="grid gap-3">
                  {trustBadges.map((badge, idx) => (
                    <div key={badge.id} className="rounded-2xl p-4 flex items-center gap-4" style={{ background:C.card, border:`1px solid ${C.line}` }}>
                      <select value={badge.iconKey} onChange={(e)=>{const u=trustBadges.map((b,i)=>i===idx?{...b,iconKey:e.target.value}:b);setTrustBadges(u);window.storage.set('trust-badges',JSON.stringify(u),true).catch(()=>{});}} className="rounded-lg px-2 py-2 text-sm focus-ring" style={{ border:`1px solid ${C.line}`, background:'#fff' }}>{Object.keys(BADGE_ICON_MAP).map(k=><option key={k} value={k}>{k}</option>)}</select>
                      <input value={badge.text} onChange={(e)=>{const u=trustBadges.map((b,i)=>i===idx?{...b,text:e.target.value}:b);setTrustBadges(u);window.storage.set('trust-badges',JSON.stringify(u),true).catch(()=>{});}} className="flex-1 rounded-lg px-3 py-2 text-sm focus-ring" style={{ border:`1px solid ${C.line}`, background:'#fff' }} />
                      <button onClick={()=>{const u=trustBadges.filter((_,i)=>i!==idx);setTrustBadges(u);window.storage.set('trust-badges',JSON.stringify(u),true).catch(()=>{});}} className="text-xs px-3 py-1.5 rounded-full focus-ring" style={{ background:'rgba(226,116,90,0.1)', color:C.coral }}>Slett</button>
                    </div>
                  ))}
                  <button onClick={()=>{const u=[...trustBadges,{id:`tb${Date.now()}`,iconKey:'check',text:'Ny badge'}];setTrustBadges(u);window.storage.set('trust-badges',JSON.stringify(u),true).catch(()=>{});}} className="text-sm font-bold px-5 py-2.5 rounded-full focus-ring justify-self-start" style={{ background:C.pine, color:'#fff' }}>+ Legg til badge</button>
                </div>
              </div>

            </div>
          )}
        </main>
      </div>
  );

  const addToCart = (productId, selections, quantity = 1) => {
    const variants = productVariants[productId] || [];
    const key = buildCartKey(productId, variants, selections);
    setCart((c) => ({
      ...c,
      [key]: { productId, selections: selections || {}, qty: (c[key]?.qty || 0) + quantity },
    }));
    const prod = allProducts.find((p) => p.id === productId);
    if (prod) showToast(`${prod.name} lagt i kurv`);
  };

  const decFromCart = (key) =>
    setCart((c) => {
      const n = { ...c };
      if (n[key] && n[key].qty > 1) n[key] = { ...n[key], qty: n[key].qty - 1 };
      else delete n[key];
      return n;
    });

  const cartItems = Object.entries(cart)
    .map(([key, entry]) => {
      const product = allProducts.find((p) => p.id === entry.productId);
      if (!product) return null;
      const variants = productVariants[entry.productId] || [];
      const delta = computeVariantDelta(variants, entry.selections);
      const basePrice = product.price + delta;
      const discountPct = getEffectiveDiscount(entry.productId);
      return {
        ...product,
        cartKey: key,
        qty: entry.qty,
        selections: entry.selections,
        variantLabel: buildVariantLabel(variants, entry.selections),
        basePrice,
        discountPct,
        effectivePrice: applyDiscount(basePrice, discountPct),
      };
    })
    .filter(Boolean);
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cartItems.reduce((s, i) => s + i.qty * i.effectivePrice, 0);

  const slots = getSlots(booking.date);
  const todayStr = new Date().toISOString().split('T')[0];
  const closureReason = getClosureReason(booking.date, closedDates, settings.hours);

  const submitBooking = (e) => {
    e.preventDefault();
    if (!booking.date || !booking.time || !booking.name || !booking.phone) return;
    if (getClosureReason(booking.date, closedDates, settings.hours)) return;
    const ref = 'INF-' + Math.random().toString(36).slice(2, 7).toUpperCase();
    const serviceName = services.find((s) => s.id === booking.service)?.name || '';
    const practitionerName = booking.practitioner === 'any'
      ? tr('anyPractitioner', lang)
      : (teamMembers.find((m) => m.id === booking.practitioner)?.name || tr('anyPractitioner', lang));
    setConfirmed({ ...booking, ref, practitionerName });
    saveBookings([
      ...bookings,
      {
        ref,
        serviceId: booking.service,
        serviceName,
        practitioner: booking.practitioner,
        practitionerName,
        date: booking.date,
        time: booking.time,
        name: booking.name,
        phone: booking.phone,
        email: booking.email,
        message: booking.message,
        status: 'Bekreftet',
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const resetBooking = () => {
    setConfirmed(null);
    setBooking({ service: DEFAULT_SERVICES[0].id, practitioner: 'any', date: '', time: '', name: '', phone: '', email: '', message: '' });
  };

  const selectedService = services.find((s) => s.id === booking.service);

  const renderCartDrawer = () => (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0" style={{ background: 'rgba(28,43,39,0.4)' }} onClick={() => { setCartOpen(false); if (orderDone) setOrderDone(false); setCheckout((c) => ({ ...c, open: false })); }} />
      <div className="relative w-full max-w-sm h-full flex flex-col" style={{ background: C.card }}>
        <div className="flex items-center justify-between p-6" style={{ borderBottom: `1px solid ${C.line}` }}>
          <h3 className="display-font text-xl font-bold">Din kurv</h3>
          <button onClick={() => { setCartOpen(false); if (orderDone) setOrderDone(false); setCheckout((c) => ({ ...c, open: false })); }} aria-label="Lukk kurv" className="p-2 rounded-full focus-ring" style={{ background: C.paper }}>
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cartItems.length === 0 ? (
                <p className="text-sm" style={{ color: C.soft }}>Kurven din er tom. Legg til produkter fra nettbutikken.</p>
              ) : (
                cartItems.map((item) => {
                  const Icon = getIcon(item);
                  const itemStock = stock[item.cartKey];
                  const atLimit = itemStock !== undefined && item.qty >= itemStock;
                  return (
                    <div key={item.cartKey} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(47,107,94,0.08)' }}>
                        <Icon size={20} color={C.pine} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold leading-snug">{item.name}</p>
                        {item.variantLabel && (
                          <p className="text-xs" style={{ color: C.pine }}>{item.variantLabel}</p>
                        )}
                        <p className="text-xs" style={{ color: C.soft }}>
                          {item.discountPct ? (
                            <>
                              <span className="line-through">{formatPrice(item.basePrice)}</span>{' '}
                              <span style={{ color: C.coral, fontWeight: 700 }}>{formatPrice(item.effectivePrice)}</span> stk.
                            </>
                          ) : (
                            <>{formatPrice(item.effectivePrice)} stk.</>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => decFromCart(item.cartKey)} aria-label="Færre" className="w-7 h-7 rounded-full flex items-center justify-center focus-ring" style={{ border: `1px solid ${C.line}` }}>
                          <Minus size={14} />
                        </button>
                        <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                        <button
                          onClick={() => { if (!atLimit) addToCart(item.id, item.selections); }}
                          disabled={atLimit}
                          aria-label="Flere"
                          className="w-7 h-7 rounded-full flex items-center justify-center focus-ring disabled:opacity-40 disabled:cursor-not-allowed"
                          style={{ background: C.pine, color: '#fff' }}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}

              {cartItems.length > 0 && !orderDone && (() => {
                const inCartIds = new Set(cartItems.map((i) => i.id));
                const suggestions = allProducts
                  .filter((p) => !inCartIds.has(p.id) && !(productVariants[p.id] || []).length && stock[p.id] !== 0)
                  .slice(0, 2);
                if (suggestions.length === 0) return null;
                return (
                  <div className="pt-4 mt-2" style={{ borderTop: `1px solid ${C.line}` }}>
                    <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: C.soft }}>Du glemte kanskje…</p>
                    <div className="space-y-2">
                      {suggestions.map((sp) => {
                        const SIcon = getIcon(sp);
                        const sDisc = getEffectiveDiscount(sp.id);
                        const sImages = productImages[sp.id] || [];
                        return (
                          <div key={sp.id} className="flex items-center gap-3 rounded-xl p-2" style={{ background: C.paper }}>
                            <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(47,107,94,0.08)' }}>
                              {sImages.length > 0 ? <img src={sImages[0].value} alt={sp.name} className="w-full h-full object-contain" /> : <SIcon size={18} color={C.pine} />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold truncate">{sp.name}</p>
                              <p className="text-xs font-bold" style={{ color: sDisc ? C.coral : C.pine }}>{formatPrice(applyDiscount(sp.price, sDisc))}</p>
                            </div>
                            <button
                              onClick={() => addToCart(sp.id, {})}
                              aria-label={`Legg ${sp.name} i kurv`}
                              className="w-8 h-8 rounded-full flex items-center justify-center focus-ring flex-shrink-0"
                              style={{ background: C.pine, color: '#fff' }}
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="p-6 space-y-4" style={{ borderTop: `1px solid ${C.line}` }}>
              {orderDone ? (
                <div className="rounded-xl p-4" style={{ background: 'rgba(47,107,94,0.1)' }}>
                  <p className="text-sm flex items-center gap-2 mb-3 font-semibold" style={{ color: C.pine }}>
                    <Check size={18} /> Bestillingen er registrert{lastOrder?.ref ? ` (${lastOrder.ref})` : ''}. Du får en e-post med kvittering.
                  </p>
                  {lastOrder && (
                    <div className="rounded-xl p-4" style={{ background: C.card, border: `1px solid ${C.line}` }}>
                      <p className="text-xs font-bold uppercase tracking-wide mb-2 flex items-center gap-2" style={{ color: C.soft }}>
                        <Mail size={14} /> Forhåndsvisning av e-post
                      </p>
                      <p className="text-sm font-bold mb-2">
                        {fillTemplate(emailTemplates.order.subject, {})}
                      </p>
                      <p className="text-sm whitespace-pre-line" style={{ color: C.soft }}>
                        {fillTemplate(emailTemplates.order.body, {
                          total: formatPrice(lastOrder.total),
                          items: lastOrder.items.map((i) => `${i.qty} x ${i.name}${i.variantLabel ? ` (${i.variantLabel})` : ''} – ${formatPrice(i.effectivePrice * i.qty)}`).join('\n'),
                          address: settings.address,
                          phone: settings.phone,
                        })}
                      </p>
                    </div>
                  )}
                </div>
              ) : (() => {
                const threshold = settings.freeShippingThreshold || 0;
                const isHomeDelivery = checkout.delivery === 'home';
                const codeDiscount = appliedCode ? Math.round(cartTotal * (appliedCode.percent / 100)) : 0;
                const discountedCartTotal = cartTotal - codeDiscount;
                const qualifiesFree = !threshold || discountedCartTotal >= threshold;
                const shippingFee = !isHomeDelivery || qualifiesFree ? 0 : (settings.shippingCost || 0);
                const grandTotal = discountedCartTotal + shippingFee;
                const remaining = Math.max(0, threshold - discountedCartTotal);

                if (!checkout.open) {
                  return (
                    <>
                      {threshold > 0 && cartItems.length > 0 && (
                        <div>
                          <p className="text-xs mb-1.5 font-semibold" style={{ color: remaining === 0 ? C.pine : C.soft }}>
                            {remaining === 0 ? tr('freeShipDone', lang) : tr('freeShipLeft', lang).replace('{x}', formatPrice(remaining))}
                          </p>
                          <div className="h-2 rounded-full overflow-hidden" style={{ background: C.line }}>
                            <div className="h-full rounded-full" style={{ width: `${Math.min(100, threshold ? (cartTotal / threshold) * 100 : 100)}%`, background: remaining === 0 ? C.pine : C.coral, transition: 'width 0.3s' }} />
                          </div>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-lg">
                        <span>{tr('subtotal', lang)}</span>
                        <span>{formatPrice(cartTotal)}</span>
                      </div>
                      {!currentUser && cartItems.length > 0 ? (
                        <div className="grid gap-2">
                          <p className="text-xs text-center" style={{ color: C.soft }}>Vil du logge inn, eller fortsette som gjest?</p>
                          <button
                            onClick={() => { setCartOpen(false); openAuth('login'); }}
                            className="w-full font-bold py-3 rounded-full focus-ring flex items-center justify-center gap-2"
                            style={{ background: C.pine, color: '#fff' }}
                          >
                            <LogIn size={16} /> Logg inn / Bli medlem
                          </button>
                          <button
                            onClick={() => setCheckout((c) => ({ ...c, open: true, name: c.name, phone: c.phone }))}
                            className="w-full font-bold py-3 rounded-full focus-ring"
                            style={{ background: C.card, color: C.ink, border: `1px solid ${C.line}` }}
                          >
                            Fortsett som gjest
                          </button>
                        </div>
                      ) : (
                        <button
                          disabled={cartItems.length === 0}
                          onClick={() => setCheckout((c) => ({ ...c, open: true, name: c.name || (currentUser ? currentUser.name : ''), phone: c.phone || (currentUser ? currentUser.phone : '') }))}
                          className="w-full font-bold py-3.5 rounded-full focus-ring disabled:opacity-40 disabled:cursor-not-allowed"
                          style={{ background: C.coral, color: '#fff' }}
                        >
                          {tr('checkout', lang)}
                        </button>
                      )}
                    </>
                  );
                }

                return (
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: C.soft }}>{tr('delivery', lang)}</p>
                      <div className="grid gap-2">
                        <button
                          onClick={() => setCheckout((c) => ({ ...c, delivery: 'pickup' }))}
                          className="flex items-center justify-between gap-2 text-sm font-semibold px-3 py-2.5 rounded-lg focus-ring text-left"
                          style={{ border: `1px solid ${checkout.delivery === 'pickup' ? C.pine : C.line}`, background: checkout.delivery === 'pickup' ? 'rgba(47,107,94,0.08)' : '#fff' }}
                        >
                          <span>{tr('pickup', lang)}</span>
                          {checkout.delivery === 'pickup' && <Check size={16} color={C.pine} />}
                        </button>
                        <button
                          onClick={() => setCheckout((c) => ({ ...c, delivery: 'home' }))}
                          className="flex items-center justify-between gap-2 text-sm font-semibold px-3 py-2.5 rounded-lg focus-ring text-left"
                          style={{ border: `1px solid ${checkout.delivery === 'home' ? C.pine : C.line}`, background: checkout.delivery === 'home' ? 'rgba(47,107,94,0.08)' : '#fff' }}
                        >
                          <span>{tr('shipHome', lang)}{!qualifiesFree && (settings.shippingCost ? ` (+${formatPrice(settings.shippingCost)})` : '')}</span>
                          {checkout.delivery === 'home' && <Check size={16} color={C.pine} />}
                        </button>
                      </div>
                    </div>

                    <input
                      type="text"
                      value={checkout.name}
                      onChange={(e) => setCheckout((c) => ({ ...c, name: e.target.value }))}
                      placeholder={tr('fieldName', lang)}
                      className="w-full rounded-lg px-3 py-2.5 text-sm focus-ring"
                      style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                    />
                    <input
                      type="tel"
                      value={checkout.phone}
                      onChange={(e) => setCheckout((c) => ({ ...c, phone: e.target.value }))}
                      placeholder={tr('fieldPhone', lang)}
                      className="w-full rounded-lg px-3 py-2.5 text-sm focus-ring"
                      style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                    />
                    {isHomeDelivery && (
                      <input
                        type="text"
                        value={checkout.address}
                        onChange={(e) => setCheckout((c) => ({ ...c, address: e.target.value }))}
                        placeholder={tr('deliveryAddress', lang)}
                        className="w-full rounded-lg px-3 py-2.5 text-sm focus-ring"
                        style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                      />
                    )}

                    <div className="pt-1">
                      {appliedCode ? (
                        <div className="flex items-center justify-between rounded-lg px-3 py-2 text-sm" style={{ background: 'rgba(47,107,94,0.1)' }}>
                          <span className="font-semibold flex items-center gap-1.5" style={{ color: C.pine }}>
                            <Check size={14} /> {appliedCode.code} (-{appliedCode.percent}%)
                          </span>
                          <button onClick={() => { setAppliedCode(null); setDiscountCodeInput(''); }} className="text-xs font-bold focus-ring rounded" style={{ color: C.coral }}>Fjern</button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={discountCodeInput}
                            onChange={(e) => setDiscountCodeInput(e.target.value)}
                            placeholder="Rabattkode"
                            className="flex-1 rounded-lg px-3 py-2.5 text-sm uppercase focus-ring"
                            style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                          />
                          <button onClick={handleApplyCode} className="text-sm font-bold px-4 py-2.5 rounded-lg focus-ring" style={{ background: C.ink, color: '#fff' }}>
                            Bruk
                          </button>
                        </div>
                      )}
                      {codesError && <p className="text-xs mt-1.5" style={{ color: C.coral }}>{codesError}</p>}
                    </div>

                    <div className="space-y-1.5 text-sm pt-2" style={{ borderTop: `1px solid ${C.line}` }}>
                      <div className="flex justify-between" style={{ color: C.soft }}>
                        <span>{tr('subtotal', lang)}</span><span>{formatPrice(cartTotal)}</span>
                      </div>
                      {codeDiscount > 0 && (
                        <div className="flex justify-between font-semibold" style={{ color: C.coral }}>
                          <span>Rabatt ({appliedCode.code})</span><span>−{formatPrice(codeDiscount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between" style={{ color: C.soft }}>
                        <span>{tr('shipping', lang)}</span>
                        <span>{shippingFee === 0 ? tr('free', lang) : formatPrice(shippingFee)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg pt-1" style={{ color: C.ink }}>
                        <span>{tr('total', lang)}</span><span>{formatPrice(grandTotal)}</span>
                      </div>
                    </div>

                    <button
                      disabled={cartItems.length === 0 || !checkout.name.trim() || !checkout.phone.trim() || (isHomeDelivery && !checkout.address.trim())}
                      onClick={() => {
                        const orderRef = 'ORD-' + Math.random().toString(36).slice(2, 7).toUpperCase();
                        const orderRecord = {
                          ref: orderRef,
                          items: cartItems.map((i) => ({
                            name: i.name,
                            variantLabel: i.variantLabel,
                            qty: i.qty,
                            unitPrice: i.effectivePrice,
                            lineTotal: i.effectivePrice * i.qty,
                          })),
                          subtotal: cartTotal,
                          discountCode: appliedCode ? appliedCode.code : '',
                          discountAmount: codeDiscount,
                          shipping: shippingFee,
                          total: grandTotal,
                          delivery: checkout.delivery,
                          name: checkout.name.trim(),
                          phone: checkout.phone.trim(),
                          address: checkout.delivery === 'home' ? checkout.address.trim() : '',
                          status: 'Ny',
                          userId: currentUser ? currentUser.id : null,
                          createdAt: new Date().toISOString(),
                        };
                        saveShopOrders([...shopOrders, orderRecord]);
                        // Automatically reduce stock for items that have stock tracking
                        const nextStock = { ...stock };
                        let stockTouched = false;
                        cartItems.forEach((i) => {
                          if (nextStock[i.cartKey] !== undefined) {
                            nextStock[i.cartKey] = Math.max(0, nextStock[i.cartKey] - i.qty);
                            stockTouched = true;
                          }
                        });
                        if (stockTouched) saveStock(nextStock);
                        setLastOrder({ items: cartItems, total: grandTotal, ref: orderRef });
                        setOrderDone(true);
                        setCart({});
                        setAppliedCode(null);
                        setDiscountCodeInput('');
                        setCheckout((c) => ({ ...c, open: false }));
                      }}
                      className="w-full font-bold py-3.5 rounded-full focus-ring disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ background: C.coral, color: '#fff' }}
                    >
                      {tr('placeOrder', lang)}
                    </button>
                    <button
                      onClick={() => setCheckout((c) => ({ ...c, open: false }))}
                      className="w-full text-sm font-semibold py-2 rounded-full focus-ring"
                      style={{ color: C.soft }}
                    >
                      {tr('backToCart', lang)}
                    </button>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
  );

  const renderToast = () => (
    <div className="fixed left-1/2 -translate-x-1/2 bottom-6 z-[60] pointer-events-none" style={{ animation: 'toastIn 0.25s ease-out' }}>
      <div className="flex items-center gap-2 px-5 py-3 rounded-full shadow-lg" style={{ background: C.ink, color: '#fff' }}>
        <Check size={16} color={C.gold} />
        <span className="text-sm font-semibold">{toast.message}</span>
      </div>
    </div>
  );

  const renderShareFallback = () => (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0" style={{ background: 'rgba(28,43,39,0.45)' }} onClick={() => { URL.revokeObjectURL(shareFallback.blobUrl); setShareFallback(null); }} />
          <div className="relative w-full max-w-sm rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto" style={{ background: C.card }}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="display-font text-xl font-bold">Del produkt</h3>
                <button
                  onClick={() => { URL.revokeObjectURL(shareFallback.blobUrl); setShareFallback(null); }}
                  aria-label="Lukk"
                  className="p-2 rounded-full focus-ring"
                  style={{ border: `1px solid ${C.line}` }}
                >
                  <X size={18} />
                </button>
              </div>
              <img src={shareFallback.blobUrl} alt={shareFallback.product.name} className="w-full rounded-xl mb-4" style={{ border: `1px solid ${C.line}` }} />
              <a
                href={shareFallback.blobUrl}
                download={shareFallback.fileName}
                className="flex items-center justify-center gap-2 w-full font-bold py-3 rounded-full focus-ring mb-3"
                style={{ background: C.pine, color: '#fff' }}
              >
                <Download size={16} /> Last ned bilde
              </a>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareFallback.shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 text-sm font-bold py-2.5 rounded-full focus-ring"
                  style={{ border: `1px solid ${C.line}`, color: C.ink }}
                >
                  <Facebook size={16} /> Facebook
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareFallback.shareText)}&url=${encodeURIComponent(shareFallback.shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 text-sm font-bold py-2.5 rounded-full focus-ring"
                  style={{ border: `1px solid ${C.line}`, color: C.ink }}
                >
                  <Twitter size={16} /> X
                </a>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`${shareFallback.shareText} ${shareFallback.shareUrl}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 text-sm font-bold py-2.5 rounded-full focus-ring"
                  style={{ border: `1px solid ${C.line}`, color: C.ink }}
                >
                  <WhatsAppIcon size={16} /> WhatsApp
                </a>
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(shareFallback.shareUrl)}&text=${encodeURIComponent(shareFallback.shareText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 text-sm font-bold py-2.5 rounded-full focus-ring"
                  style={{ border: `1px solid ${C.line}`, color: C.ink }}
                >
                  <Send size={16} /> Telegram
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareFallback.shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 text-sm font-bold py-2.5 rounded-full focus-ring col-span-2"
                  style={{ border: `1px solid ${C.line}`, color: C.ink }}
                >
                  <Linkedin size={16} /> LinkedIn
                </a>
              </div>
              <div className="rounded-xl p-3 text-sm flex items-start gap-2" style={{ background: C.paper, color: C.soft }}>
                <Instagram size={16} className="flex-shrink-0 mt-0.5" />
                <span>
                  Instagram støtter ikke direkte deling fra nettsider. Last ned bildet ovenfor og legg det inn som
                  innlegg eller story i appen – eller bruk Del-knappen på mobil for å dele direkte.
                </span>
              </div>
              <button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(`${shareFallback.shareText} ${shareFallback.shareUrl}`);
                  } catch (err) {
                    // clipboard not available
                  }
                }}
                className="flex items-center justify-center gap-2 w-full text-sm font-bold py-2.5 rounded-full focus-ring mt-3"
                style={{ border: `1px solid ${C.line}`, color: C.ink }}
              >
                <Copy size={14} /> Kopier tekst og lenke
              </button>
            </div>
          </div>
        </div>
  );

  const sharedStyle = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400..900&family=Manrope:wght@400;500;600;700;800&display=swap');
      html { scroll-behavior: smooth; }
      body { margin: 0; }
      .display-font { font-family: 'Fraunces', serif; }
      .focus-ring:focus-visible { outline: 2px solid ${C.pine}; outline-offset: 2px; }
    `}</style>
  );

  const renderPageHeader = (backLabel, onBack) => (
    <header className="sticky top-0 z-40 w-full" style={{ background: 'rgba(238,241,236,0.92)', backdropFilter: 'blur(8px)', borderBottom: `1px solid ${C.line}` }}>
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold focus-ring rounded" style={{ color: C.pine }}>
          <ArrowLeft size={18} /> {backLabel}
        </button>
        <a onClick={(e) => { e.preventDefault(); onBack(); scrollToId('hjem'); }} href="#hjem" className="flex items-center gap-2 focus-ring rounded cursor-pointer">
          <InfinityMark size={32} color={C.pine} />
          <span className="display-font text-lg font-semibold" style={{ color: C.ink }}>Infinitum <span style={{ color: C.pine }}>Dental</span></span>
        </a>
        <button
          aria-label="Åpne kurv"
          onClick={() => setCartOpen(true)}
          className="relative p-2 rounded-full focus-ring"
          style={{ background: C.card, border: `1px solid ${C.line}` }}
        >
          <ShoppingCart size={20} color={C.ink} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center" style={{ background: C.coral, color: '#fff' }}>
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );

  if (view === 'admin') return renderAdmin();

  if (accountView && currentUser) {
    const myOrders = shopOrders.filter((o) => o.userId === currentUser.id);
    return (
      <div style={{ background: C.paper, color: C.ink, fontFamily: "'Manrope', sans-serif", minHeight: '100vh' }} className="w-full">
        {sharedStyle}
        {renderPageHeader('Tilbake', () => { setAccountView(false); scrollToId('hjem'); })}
        <main className="max-w-3xl mx-auto px-6 py-10 md:py-16">
          <div className="flex items-center justify-between gap-3 mb-2">
            <h1 className="display-font text-3xl md:text-4xl font-bold">Min konto</h1>
            <button onClick={handleLogout} className="text-sm font-bold px-4 py-2 rounded-full focus-ring" style={{ border: `1px solid ${C.line}`, color: C.coral }}>
              Logg ut
            </button>
          </div>
          <p className="text-sm mb-8" style={{ color: C.soft }}>Innlogget som {currentUser.email}</p>

          <div className="rounded-2xl p-5 mb-8" style={{ background: C.card, border: `1px solid ${C.line}` }}>
            <h2 className="display-font text-xl font-bold mb-4">Profil & leveringsadresse</h2>
            <div className="grid gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: C.soft }}>Navn</label>
                <input type="text" value={profileDraft.name} onChange={(e) => setProfileDraft((d) => ({ ...d, name: e.target.value }))} className="w-full rounded-lg px-3 py-2.5 text-sm focus-ring" style={{ border: `1px solid ${C.line}`, background: '#fff' }} />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: C.soft }}>Telefon</label>
                <input type="tel" value={profileDraft.phone} onChange={(e) => setProfileDraft((d) => ({ ...d, phone: e.target.value }))} className="w-full rounded-lg px-3 py-2.5 text-sm focus-ring" style={{ border: `1px solid ${C.line}`, background: '#fff' }} />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: C.soft }}>Leveringsadresse</label>
                <input type="text" value={profileDraft.address} onChange={(e) => setProfileDraft((d) => ({ ...d, address: e.target.value }))} placeholder="Gate, postnr og sted" className="w-full rounded-lg px-3 py-2.5 text-sm focus-ring" style={{ border: `1px solid ${C.line}`, background: '#fff' }} />
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handleSaveProfile} className="font-bold px-5 py-2.5 rounded-full focus-ring justify-self-start" style={{ background: C.pine, color: '#fff' }}>Lagre</button>
                {profileSaved && <span className="text-sm font-semibold flex items-center gap-1" style={{ color: C.pine }}><Check size={16} /> Lagret</span>}
              </div>
            </div>
          </div>

          <h2 className="display-font text-xl font-bold mb-4">Mine bestillinger</h2>
          {myOrders.length === 0 ? (
            <p className="text-sm" style={{ color: C.soft }}>Du har ingen bestillinger ennå.</p>
          ) : (
            <div className="grid gap-3">
              {[...myOrders].reverse().map((o) => (
                <div key={o.ref} className="rounded-xl p-4" style={{ background: C.card, border: `1px solid ${C.line}` }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold" style={{ color: C.pine }}>{o.ref}</span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: 'rgba(47,107,94,0.1)', color: C.pine }}>{o.status}</span>
                  </div>
                  <p className="text-xs mb-2" style={{ color: C.soft }}>
                    {new Date(o.createdAt).toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric' })} · {o.delivery === 'home' ? 'Hjemlevering' : 'Henting'}
                  </p>
                  {o.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-sm py-0.5">
                      <span style={{ color: C.soft }}>{it.qty} × {it.name}</span>
                      <span>{formatPrice(it.lineTotal)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm font-bold pt-2 mt-1" style={{ borderTop: `1px solid ${C.line}` }}>
                    <span>Totalt</span><span>{formatPrice(o.total)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
        {cartOpen && renderCartDrawer()}
        {shareFallback && renderShareFallback()}
        {toast && renderToast()}
      </div>
    );
  }

  if (legalPage && LEGAL_PAGES[legalPage]) {
    const lp = LEGAL_PAGES[legalPage];
    return (
      <div style={{ background: C.paper, color: C.ink, fontFamily: "'Manrope', sans-serif", minHeight: '100vh' }} className="w-full">
        {sharedStyle}
        {renderPageHeader('Tilbake', () => setLegalPage(null))}
        <main className="max-w-3xl mx-auto px-6 py-10 md:py-16">
          <h1 className="display-font text-3xl md:text-4xl font-bold mb-6">{lp.title}</h1>
          <p className="text-base leading-relaxed whitespace-pre-line" style={{ color: C.soft }}>{lp.body}</p>
        </main>
        {cartOpen && renderCartDrawer()}
        {shareFallback && renderShareFallback()}        {toast && renderToast()}
      </div>
    );
  }

  if (selectedMember) {
    const m = selectedMember;
    const Icon = getIcon({ iconKey: m.iconKey });
    const others = teamMembers.filter((x) => x.id !== m.id);
    return (
      <div style={{ background: C.paper, color: C.ink, fontFamily: "'Manrope', sans-serif", minHeight: '100vh' }} className="w-full">
        {sharedStyle}
        {renderPageHeader(tr('teamLabel', lang), () => setSelectedMember(null))}
        <main className="max-w-3xl mx-auto px-6 py-10 md:py-16">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-28 h-28 rounded-full flex items-center justify-center mb-5" style={{ background: 'rgba(47,107,94,0.1)' }}>
              <Icon size={52} color={C.pine} />
            </div>
            <h1 className="display-font text-3xl md:text-4xl font-bold mb-1">{m.name}</h1>
            <p className="text-sm font-bold uppercase tracking-wide mb-6" style={{ color: C.coral }}>{m.role}</p>
            <p className="text-base leading-relaxed max-w-xl" style={{ color: C.soft }}>{m.bio}</p>
            {m.bookable && (
              <button
                onClick={() => { setBooking((b) => ({ ...b, practitioner: m.id })); setSelectedMember(null); window.scrollTo(0, 0); setTimeout(() => scrollToId('bestill'), 100); }}
                className="inline-flex items-center gap-2 font-bold px-6 py-3 rounded-full focus-ring mt-8"
                style={{ background: C.pine, color: '#fff' }}
              >
                {tr('bookLabel', lang)} hos behandler <ArrowRight size={18} />
              </button>
            )}
          </div>

          {others.length > 0 && (
            <div className="mt-14">
              <h2 className="display-font text-2xl font-bold mb-5">Resten av teamet</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {others.map((o) => {
                  const OIcon = getIcon({ iconKey: o.iconKey });
                  return (
                    <button
                      key={o.id}
                      onClick={() => { setSelectedMember(o); window.scrollTo(0, 0); }}
                      className="text-left rounded-2xl p-5 flex flex-col gap-3 focus-ring transition-transform hover:-translate-y-0.5"
                      style={{ background: C.card, border: `1px solid ${C.line}` }}
                    >
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(47,107,94,0.1)' }}>
                        <OIcon size={22} color={C.pine} />
                      </div>
                      <div>
                        <h3 className="display-font text-base font-semibold leading-tight">{o.name}</h3>
                        <p className="text-xs font-bold uppercase tracking-wide" style={{ color: C.coral }}>{o.role}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </main>
        {cartOpen && renderCartDrawer()}
        {shareFallback && renderShareFallback()}        {toast && renderToast()}
      </div>
    );
  }

  if (selectedPost) {
    const post = selectedPost;
    const others = newsPosts.filter((x) => x.id !== post.id).slice(0, 3);
    return (
      <div style={{ background: C.paper, color: C.ink, fontFamily: "'Manrope', sans-serif", minHeight: '100vh' }} className="w-full">
        {sharedStyle}
        {renderPageHeader(tr('newsLabel', lang), () => setSelectedPost(null))}
        <main className="max-w-3xl mx-auto px-6 py-10 md:py-16">
          <article>
            <span className="text-xs font-bold uppercase tracking-wide" style={{ color: C.soft }}>
              {new Date(post.date).toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <h1 className="display-font text-3xl md:text-4xl font-bold mt-2 mb-6">{post.title}</h1>
            <p className="text-base leading-relaxed whitespace-pre-line" style={{ color: C.soft }}>{post.content}</p>
          </article>

          {others.length > 0 && (
            <div className="mt-14 pt-10" style={{ borderTop: `1px solid ${C.line}` }}>
              <h2 className="display-font text-2xl font-bold mb-5">Flere nyheter</h2>
              <div className="grid sm:grid-cols-3 gap-5">
                {others.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => { setSelectedPost(o); window.scrollTo(0, 0); }}
                    className="text-left rounded-2xl p-5 flex flex-col gap-2 focus-ring transition-transform hover:-translate-y-0.5"
                    style={{ background: C.card, border: `1px solid ${C.line}` }}
                  >
                    <span className="text-xs font-bold uppercase tracking-wide" style={{ color: C.soft }}>
                      {new Date(o.date).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' })}
                    </span>
                    <h3 className="display-font text-base font-semibold leading-snug">{o.title}</h3>
                  </button>
                ))}
              </div>
            </div>
          )}
        </main>
        {cartOpen && renderCartDrawer()}
        {shareFallback && renderShareFallback()}        {toast && renderToast()}
      </div>
    );
  }

  if (selectedProduct) {
    const product = selectedProduct;
    const Icon = getIcon(product);
    const variants = productVariants[product.id] || [];
    const currentSelections = selectedVariants[product.id] || defaultSelections(variants);
    const cartKey = buildCartKey(product.id, variants, currentSelections);
    const qty = cart[cartKey]?.qty || 0;
    const effectivePrice = product.price + computeVariantDelta(variants, currentSelections);
    const discountPct = getEffectiveDiscount(product.id);
    const finalPrice = applyDiscount(effectivePrice, discountPct);
    const currentStock = stock[cartKey];
    const orderStatus = orderStatusMap[product.id];
    const isOutOfStock = !orderStatus && currentStock === 0;
    const isLowStock = !orderStatus && currentStock !== undefined && currentStock > 0 && currentStock <= LOW_STOCK_THRESHOLD;
    const atStockLimit = !orderStatus && currentStock !== undefined && qty >= currentStock;
    const images = productImages[product.id] || [];
    const safeIndex = Math.min(galleryIndex, Math.max(0, images.length - 1));
    const brand = brandMap[product.id] ? brands.find((b) => b.id === brandMap[product.id]) : null;
    const chooseOption = (groupId, label) => {
      setSelectedVariants((s) => ({ ...s, [product.id]: { ...currentSelections, [groupId]: label } }));
    };
    const relatedProducts = allProducts
      .filter((p) => p.id !== product.id && (
        brandMap[p.id] === brandMap[product.id] ||
        (categoryMap[p.id] || []).some((c) => (categoryMap[product.id] || []).includes(c))
      ))
      .slice(0, 4);

    return (
      <div style={{ background: C.paper, color: C.ink, fontFamily: "'Manrope', sans-serif", minHeight: '100vh' }} className="w-full">
        {sharedStyle}

        <header className="sticky top-0 z-40 w-full" style={{ background: 'rgba(238,241,236,0.92)', backdropFilter: 'blur(8px)', borderBottom: `1px solid ${C.line}` }}>
          <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
            <button onClick={() => { setSelectedProduct(null); setTimeout(() => scrollToId('nettbutikk'), 80); }} className="flex items-center gap-2 text-sm font-bold focus-ring rounded" style={{ color: C.pine }}>
              <ArrowLeft size={18} /> {tr('shopLabel', lang)}
            </button>
            <a onClick={(e) => { e.preventDefault(); setSelectedProduct(null); scrollToId('hjem'); }} href="#hjem" className="flex items-center gap-2 focus-ring rounded cursor-pointer">
              <InfinityMark size={32} color={C.pine} />
              <span className="display-font text-lg font-semibold" style={{ color: C.ink }}>Infinitum <span style={{ color: C.pine }}>Dental</span></span>
            </a>
            <button
              aria-label="Åpne kurv"
              onClick={() => setCartOpen(true)}
              className="relative p-2 rounded-full focus-ring"
              style={{ background: C.card, border: `1px solid ${C.line}` }}
            >
              <ShoppingCart size={20} color={C.ink} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center" style={{ background: C.coral, color: '#fff' }}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-8 md:py-12">
          {/* Breadcrumb */}
          <nav className="flex flex-wrap items-center gap-1.5 text-sm mb-6" style={{ color: C.soft }}>
            <button onClick={() => { setSelectedProduct(null); scrollToId('hjem'); }} className="focus-ring rounded hover:underline">Hjem</button>
            <ChevronRight size={14} />
            <button onClick={() => { setSelectedProduct(null); setActiveCategory('all'); setTimeout(() => scrollToId('produktliste'), 80); }} className="focus-ring rounded hover:underline">{tr('shopLabel', lang)}</button>
            {(categoryMap[product.id] || []).length > 0 && (() => {
              const catId = (categoryMap[product.id] || [])[0];
              const cat = categories.find((c) => c.id === catId);
              if (!cat) return null;
              return (
                <>
                  <ChevronRight size={14} />
                  <button
                    onClick={() => { setSelectedProduct(null); setActiveCategory(catId); setActiveBrand('all'); setShowFavorites(false); setTimeout(() => scrollToId('produktliste'), 80); }}
                    className="focus-ring rounded hover:underline font-semibold"
                    style={{ color: C.pine }}
                  >
                    {cat.name}
                  </button>
                </>
              );
            })()}
            <ChevronRight size={14} />
            <span className="font-semibold" style={{ color: C.ink }}>{product.name}</span>
          </nav>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Image gallery */}
            <div>
              <div className="rounded-2xl overflow-hidden relative aspect-square flex items-center justify-center" style={{ background: 'rgba(47,107,94,0.08)', border: `1px solid ${C.line}` }}>
                {images.length > 0 ? (
                  <img src={images[safeIndex].value} alt={product.name} className="w-full h-full object-contain" />
                ) : (
                  <Icon size={96} color={C.pine} />
                )}
                {product.tag && (
                  <span className="absolute top-4 left-4 text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: C.gold, color: '#fff' }}>{product.tag}</span>
                )}
                {discountPct ? (
                  <span className="absolute top-4 right-4 text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: C.coral, color: '#fff' }}>-{discountPct}%</span>
                ) : null}
                {images.length > 1 && (
                  <>
                    <button onClick={() => setGalleryIndex((i) => (i - 1 + images.length) % images.length)} aria-label="Forrige bilde" className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full focus-ring" style={{ background: 'rgba(255,255,255,0.9)' }}>
                      <ChevronLeft size={18} color={C.ink} />
                    </button>
                    <button onClick={() => setGalleryIndex((i) => (i + 1) % images.length)} aria-label="Neste bilde" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full focus-ring" style={{ background: 'rgba(255,255,255,0.9)' }}>
                      <ChevronRight size={18} color={C.ink} />
                    </button>
                  </>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 mt-3">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setGalleryIndex(i)}
                      className="w-16 h-16 rounded-lg overflow-hidden focus-ring flex-shrink-0"
                      style={{ border: `2px solid ${i === safeIndex ? C.pine : C.line}` }}
                    >
                      <img src={img.value} alt={`${product.name} ${i + 1}`} className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product info */}
            <div>
              {brand && (() => {
                const BIcon = getIcon({ iconKey: brand.iconKey });
                return (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide mb-2" style={{ color: C.soft }}>
                    <BIcon size={14} color={C.pine} /> {brand.name}
                  </span>
                );
              })()}
              {product.sku && (
                <span className="text-xs font-mono mb-1 block" style={{ color: C.soft }}>Varenr. {product.sku}</span>
              )}
              <div className="flex items-start justify-between gap-3 mb-3">
                <h1 className="display-font text-3xl md:text-4xl font-bold">{product.name}</h1>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    aria-label={favorites.includes(product.id) ? 'Fjern fra favoritter' : 'Legg til favoritter'}
                    className="p-2.5 rounded-full focus-ring"
                    style={{ border: `1px solid ${C.line}` }}
                  >
                    <Heart size={18} color={C.coral} fill={favorites.includes(product.id) ? C.coral : 'none'} />
                  </button>
                  <button
                    onClick={() => handleShare(product, finalPrice, discountPct)}
                    disabled={shareBusy}
                    aria-label="Del produkt"
                    className="p-2.5 rounded-full focus-ring disabled:opacity-50"
                    style={{ border: `1px solid ${C.line}` }}
                  >
                    <Share2 size={18} color={C.pine} />
                  </button>
                </div>
              </div>


              <div className="flex items-center gap-3 mb-5 flex-wrap">
                {discountPct ? (
                  <>
                    <span className="text-base line-through" style={{ color: C.soft }}>{formatPrice(effectivePrice)}</span>
                    <p className="font-bold text-2xl" style={{ color: C.coral }}>{formatPrice(finalPrice)}</p>
                  </>
                ) : (
                  <p className="font-bold text-2xl" style={{ color: C.pine }}>{formatPrice(finalPrice)}</p>
                )}
                {isOutOfStock ? (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: C.ink, color: '#fff' }}>{tr('soldOut', lang)}</span>
                ) : isLowStock ? (
                  <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: C.coral, color: '#fff' }}>
                    <AlertTriangle size={12} /> Få igjen – kun {currentStock} på lager
                  </span>
                ) : orderStatus ? (
                  <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: C.pine, color: '#fff' }}>
                    <Clock size={12} />
                    {orderStatus === 'order-10days' ? 'Bestillingsvare – ca. 10 dager' : 'Bestillingsvare – ta kontakt'}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: 'rgba(47,107,94,0.12)', color: C.pine }}>
                    <Check size={12} /> På lager
                  </span>
                )}
              </div>

              {isOutOfStock && (
                <div className="rounded-xl p-4 mb-5" style={{ background: C.card, border: `1px solid ${C.line}` }}>
                  <p className="text-sm font-semibold mb-1">Utsolgt akkurat nå</p>
                  <p className="text-sm" style={{ color: C.soft }}>
                    Sett deg på <button onClick={() => { setSelectedProduct(null); scrollToId('mine-bestillinger'); }} className="font-bold focus-ring rounded" style={{ color: C.pine }}>ventelisten</button> eller ta kontakt på WhatsApp, så gir vi deg beskjed når varen er tilbake.
                  </p>
                </div>
              )}

              {orderStatus && (
                <div className="rounded-xl p-4 mb-5" style={{ background: 'rgba(47,107,94,0.07)', border: `1px solid rgba(47,107,94,0.2)` }}>
                  <p className="text-sm font-semibold mb-1" style={{ color: C.pine }}>Bestillingsvare</p>
                  <p className="text-sm" style={{ color: C.soft }}>
                    {orderStatus === 'order-10days'
                      ? 'Leveringstid ca. 10 dager etter bestilling. Legg i kurv og vi kontakter deg.'
                      : 'Ta kontakt for leveringsstatus — ring oss, send e-post eller skriv på WhatsApp.'}
                  </p>
                </div>
              )}

              <p className="text-base mb-6" style={{ color: C.soft }}>{product.desc}</p>

              {variants.map((group) => (
                <div key={group.id} className="mb-5">
                  <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: C.soft }}>{group.name}</label>
                  <div className="flex flex-wrap gap-2">
                    {group.options.map((opt) => {
                      const active = currentSelections[group.id] === opt.label;
                      const optionKey = buildCartKey(product.id, variants, { ...currentSelections, [group.id]: opt.label });
                      const optionOut = stock[optionKey] === 0;
                      return (
                        <button
                          key={opt.label}
                          type="button"
                          disabled={optionOut}
                          onClick={() => chooseOption(group.id, opt.label)}
                          className="text-sm font-semibold px-3 py-2 rounded-lg focus-ring disabled:cursor-not-allowed"
                          style={{
                            border: `1px solid ${active ? C.pine : C.line}`,
                            background: active ? C.pine : '#fff',
                            color: optionOut ? '#bbb' : active ? '#fff' : C.ink,
                            textDecoration: optionOut ? 'line-through' : 'none',
                          }}
                        >
                          {opt.label}{opt.priceDelta ? ` (${opt.priceDelta > 0 ? '+' : ''}${opt.priceDelta} kr)` : ''}{optionOut ? ' (utsolgt)' : ''}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {!isOutOfStock && qty === 0 && (
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-sm font-semibold" style={{ color: C.soft }}>Antall:</span>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setPageQty((q) => Math.max(1, q - 1))} aria-label="Færre" className="w-9 h-9 rounded-full flex items-center justify-center focus-ring" style={{ border: `1px solid ${C.line}` }}>
                      <Minus size={16} />
                    </button>
                    <span className="text-base font-bold w-6 text-center">{pageQty}</span>
                    <button onClick={() => setPageQty((q) => q + 1)} aria-label="Flere" className="w-9 h-9 rounded-full flex items-center justify-center focus-ring" style={{ border: `1px solid ${C.line}` }}>
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 mb-6">
                {isOutOfStock ? (
                  <button disabled className="flex-1 font-bold py-3.5 rounded-full disabled:cursor-not-allowed" style={{ background: C.paper, color: C.soft }}>
                    {tr('soldOut', lang)}
                  </button>
                ) : qty === 0 ? (
                  <button onClick={() => { addToCart(product.id, currentSelections, pageQty); setPageQty(1); }} className="flex-1 font-bold py-3.5 rounded-full focus-ring" style={{ background: C.pine, color: '#fff' }}>
                    {tr('addToCart', lang)}{pageQty > 1 ? ` (${pageQty})` : ''}
                  </button>
                ) : (
                  <div className="flex-1 flex items-center justify-center gap-4 py-1">
                    <button onClick={() => decFromCart(cartKey)} aria-label="Færre" className="w-10 h-10 rounded-full flex items-center justify-center focus-ring" style={{ border: `1px solid ${C.line}` }}>
                      <Minus size={18} />
                    </button>
                    <span className="text-lg font-bold w-8 text-center">{qty}</span>
                    <button onClick={() => { if (!atStockLimit) addToCart(product.id, currentSelections); }} disabled={atStockLimit} aria-label="Flere" className="w-10 h-10 rounded-full flex items-center justify-center focus-ring disabled:opacity-40 disabled:cursor-not-allowed" style={{ background: C.pine, color: '#fff' }}>
                      <Plus size={18} />
                    </button>
                  </div>
                )}
                <button onClick={() => setCartOpen(true)} className="font-bold py-3.5 px-6 rounded-full focus-ring" style={{ background: C.coral, color: '#fff' }}>
                  {tr('checkout', lang)}
                </button>
              </div>

              {(() => {
                const bundle = allProducts
                  .filter((bp) => bp.id !== product.id && !(productVariants[bp.id] || []).length && stock[bp.id] !== 0)
                  .filter((bp) => !(categoryMap[bp.id] || []).some((c) => (categoryMap[product.id] || []).includes(c)))
                  .slice(0, 2);
                if (bundle.length === 0) return null;
                const bundleTotal = applyDiscount(product.price, discountPct) + bundle.reduce((s, bp) => s + applyDiscount(bp.price, getEffectiveDiscount(bp.id)), 0);
                return (
                  <div className="rounded-xl p-4 mb-6" style={{ background: C.card, border: `1px solid ${C.line}` }}>
                    <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: C.soft }}>Ofte kjøpt sammen</p>
                    <div className="flex flex-col gap-2 mb-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold">{product.name}</span>
                        <span style={{ color: C.soft }}>{formatPrice(applyDiscount(product.price, discountPct))}</span>
                      </div>
                      {bundle.map((bp) => (
                        <button key={bp.id} onClick={() => { setSelectedProduct(bp); setGalleryIndex(0); window.scrollTo(0, 0); }} className="flex items-center justify-between text-sm focus-ring rounded text-left">
                          <span className="flex items-center gap-1.5" style={{ color: C.pine }}><Plus size={13} /> {bp.name}</span>
                          <span style={{ color: C.soft }}>{formatPrice(applyDiscount(bp.price, getEffectiveDiscount(bp.id)))}</span>
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-3" style={{ borderTop: `1px solid ${C.line}` }}>
                      <span className="text-sm font-bold">Totalt {formatPrice(bundleTotal)}</span>
                      <button
                        onClick={() => {
                          addToCart(product.id, currentSelections);
                          bundle.forEach((bp) => addToCart(bp.id, {}));
                          setCartOpen(true);
                        }}
                        className="text-xs font-bold px-4 py-2 rounded-full focus-ring"
                        style={{ background: C.pine, color: '#fff' }}
                      >
                        Legg alle i kurv
                      </button>
                    </div>
                  </div>
                );
              })()}

              {product.details && product.details.length > 0 && (
                <ul className="space-y-2 mb-6">
                  {product.details.map((d, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check size={16} color={C.pine} className="mt-0.5 flex-shrink-0" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              )}

              {datasheets[product.id] && (
                <a
                  href={datasheets[product.id].value}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={datasheets[product.id].type === 'file' ? datasheets[product.id].name : undefined}
                  className="inline-flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-full focus-ring"
                  style={{ border: `1px solid ${C.line}`, color: C.pine }}
                >
                  <FileText size={16} /> Last ned datablad (PDF)
                </a>
              )}
            </div>
          </div>


          {relatedProducts.length > 0 && (
            <div className="mt-14">
              <h2 className="display-font text-2xl font-bold mb-5">Andre produkter du kanskje liker</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {relatedProducts.map((rp) => {
                  const RIcon = getIcon(rp);
                  const rImages = productImages[rp.id] || [];
                  const rDisc = getEffectiveDiscount(rp.id);
                  return (
                    <button
                      key={rp.id}
                      onClick={() => { setSelectedProduct(rp); setGalleryIndex(0); window.scrollTo(0, 0); }}
                      className="text-left rounded-2xl overflow-hidden flex flex-col focus-ring transition-transform hover:-translate-y-0.5"
                      style={{ background: C.card, border: `1px solid ${C.line}` }}
                    >
                      <div className="h-28 flex items-center justify-center" style={{ background: 'rgba(47,107,94,0.08)' }}>
                        {rImages.length > 0 ? <img src={rImages[0].value} alt={rp.name} className="w-full h-full object-contain" /> : <RIcon size={30} color={C.pine} />}
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-semibold leading-snug mb-1">{rp.name}</p>
                        <span className="font-bold text-sm" style={{ color: rDisc ? C.coral : C.pine }}>{formatPrice(applyDiscount(rp.price, rDisc))}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {(() => {
            const recent = recentlyViewed.filter((id) => id !== product.id).map((id) => allProducts.find((p) => p.id === id)).filter(Boolean).slice(0, 4);
            if (recent.length === 0) return null;
            return (
              <div className="mt-14">
                <h2 className="display-font text-2xl font-bold mb-5">Nylig sett</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                  {recent.map((rp) => {
                    const RIcon = getIcon(rp);
                    const rImages = productImages[rp.id] || [];
                    const rDisc = getEffectiveDiscount(rp.id);
                    return (
                      <button
                        key={rp.id}
                        onClick={() => { setSelectedProduct(rp); setGalleryIndex(0); window.scrollTo(0, 0); }}
                        className="text-left rounded-2xl overflow-hidden flex flex-col focus-ring transition-transform hover:-translate-y-0.5"
                        style={{ background: C.card, border: `1px solid ${C.line}` }}
                      >
                        <div className="h-28 flex items-center justify-center" style={{ background: 'rgba(47,107,94,0.08)' }}>
                          {rImages.length > 0 ? <img src={rImages[0].value} alt={rp.name} className="w-full h-full object-contain" /> : <RIcon size={30} color={C.pine} />}
                        </div>
                        <div className="p-3">
                          <p className="text-sm font-semibold leading-snug mb-1">{rp.name}</p>
                          <span className="font-bold text-sm" style={{ color: rDisc ? C.coral : C.pine }}>{formatPrice(applyDiscount(rp.price, rDisc))}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </main>

        {cartOpen && renderCartDrawer()}
        {shareFallback && renderShareFallback()}        {toast && renderToast()}
      </div>
    );
  }

  return (
    <div style={{ background: C.paper, color: C.ink, fontFamily: "'Manrope', sans-serif", minHeight: '100vh' }} className="w-full">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400..900&family=Manrope:wght@400;500;600;700;800&display=swap');
        html { scroll-behavior: smooth; }
        body { margin: 0; }
        .display-font { font-family: 'Fraunces', serif; }
        .infinity-draw path {
          stroke-dasharray: 900;
          stroke-dashoffset: 900;
          animation: draw 2.2s ease-out forwards;
        }
        @keyframes draw { to { stroke-dashoffset: 0; } }
        .focus-ring:focus-visible {
          outline: 2px solid ${C.pine};
          outline-offset: 2px;
        }
        .slot-btn:hover:not(:disabled) { background: ${C.pine}; color: #fff; }
        .skeleton { background: linear-gradient(90deg, rgba(0,0,0,0.04) 25%, rgba(0,0,0,0.08) 37%, rgba(0,0,0,0.04) 63%); background-size: 400% 100%; animation: shimmer 1.4s ease infinite; }
        @keyframes shimmer { 0% { background-position: 100% 50%; } 100% { background-position: 0 50%; } }
        @keyframes toastIn { from { opacity: 0; transform: translate(-50%, 12px); } to { opacity: 1; transform: translate(-50%, 0); } }
        @media (prefers-reduced-motion: reduce) {
          .infinity-draw path { animation: none; stroke-dashoffset: 0; }
        }
      `}</style>

      {/* Campaign banner */}
      {settings.bannerEnabled && settings.bannerText && (
        <div className="w-full text-center text-sm font-semibold px-4 py-2.5" style={{ background: C.coral, color: '#fff' }}>
          {settings.bannerText}
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 w-full">

        {/* Main header */}
        <div className="w-full" style={{ background: 'rgba(238,241,236,0.97)', backdropFilter: 'blur(8px)', borderBottom: `1px solid ${C.line}` }}>
          <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
            <a href="#hjem" onClick={(e) => { e.preventDefault(); scrollToId('hjem'); }} className="flex items-center gap-2.5 focus-ring rounded flex-shrink-0">
              <InfinityMark size={40} color={C.pine} />
              <span className="display-font text-2xl font-semibold" style={{ color: C.ink }}>
                Infinitum <span style={{ color: C.pine }}>Dental</span>
              </span>
            </a>

            <div className="flex items-center gap-3">
              <a
                href="#bestill"
                onClick={(e) => { e.preventDefault(); scrollToId('bestill'); }}
                className="hidden sm:inline-flex items-center gap-2 text-sm font-bold px-5 py-2 rounded-full focus-ring"
                style={{ background: C.coral, color: '#fff' }}
              >
                {tr('heroBook', lang)}
              </a>
              <button
                aria-label="Åpne kurv"
                onClick={() => setCartOpen(true)}
                className="relative p-2 rounded-full focus-ring"
                style={{ background: C.card, border: `1px solid ${C.line}` }}
              >
                <ShoppingCart size={20} color={C.ink} />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                    style={{ background: C.coral, color: '#fff' }}
                  >
                    {cartCount}
                  </span>
                )}
              </button>
              <button
                aria-label={currentUser ? 'Min konto' : 'Logg inn'}
                onClick={() => currentUser ? openAccount() : openAuth('login')}
                className="hidden sm:flex relative p-2 rounded-full focus-ring items-center justify-center"
                style={{ background: currentUser ? C.pine : C.card, border: `1px solid ${currentUser ? C.pine : C.line}` }}
              >
                {currentUser ? <UserCircle size={20} color="#fff" /> : <UserCircle size={20} color={C.ink} />}
              </button>
              <button
                aria-label="Åpne meny"
                className="lg:hidden p-2 rounded-full focus-ring"
                style={{ background: C.card, border: `1px solid ${C.line}` }}
                onClick={() => setMenuOpen((v) => !v)}
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Category nav bar */}
        <div className="hidden lg:block w-full" style={{ background: '#fff', borderBottom: `1px solid ${C.line}` }}>
          <div className="max-w-6xl mx-auto px-6">
            <nav className="flex items-center gap-0">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={(e) => { e.preventDefault(); scrollToId(l.href.slice(1)); }}
                  className="text-sm font-semibold px-4 py-3 focus-ring relative transition-colors hover:text-pine group"
                  style={{ color: C.soft }}
                >
                  <span className="relative">
                    {l.label[lang] || l.label.nb}
                    <span className="absolute -bottom-3 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" style={{ background: C.pine }} />
                  </span>
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden px-6 pb-4 flex flex-col gap-3" style={{ background: '#fff', borderTop: `1px solid ${C.line}` }}>
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => { e.preventDefault(); setMenuOpen(false); scrollToId(l.href.slice(1)); }}
                className="text-sm font-semibold pt-3"
                style={{ color: C.ink }}
              >
                {l.label[lang] || l.label.nb}
              </a>
            ))}
            <a
              href="#mine-bestillinger"
              onClick={(e) => { e.preventDefault(); setMenuOpen(false); scrollToId('mine-bestillinger'); }}
              className="text-sm font-semibold pt-3 flex items-center gap-2"
              style={{ color: C.ink }}
            >
              <ClipboardCheck size={16} color={C.pine} /> Mine bestillinger
            </a>
            {currentUser ? (
              <button
                onClick={openAccount}
                className="text-sm font-semibold pt-3 flex items-center gap-2 text-left"
                style={{ color: C.ink }}
              >
                <UserCircle size={16} color={C.pine} /> Min konto ({currentUser.name.split(' ')[0]})
              </button>
            ) : (
              <button
                onClick={() => openAuth('login')}
                className="text-sm font-semibold pt-3 flex items-center gap-2 text-left"
                style={{ color: C.ink }}
              >
                <LogIn size={16} color={C.pine} /> Logg inn / Bli medlem
              </button>
            )}
          </div>
        )}
      </header>

      {/* Hero */}
      {/* Hero carousel */}
      <section id="hjem" style={{ background: C.bg }}>
        {/* Slides — CSS grid stacking keeps height = tallest slide, no jumping */}
        <div style={{ display: 'grid' }}>
          {heroSlides.map((slide, i) => (
            <div
              key={i}
              className="transition-opacity duration-700"
              style={{
                gridArea: '1 / 1',
                opacity: heroSlide === i ? 1 : 0,
                visibility: heroSlide === i ? 'visible' : 'hidden',
                pointerEvents: heroSlide === i ? 'auto' : 'none',
              }}
            >
              <div className="max-w-6xl mx-auto px-6 py-4 md:py-14 grid md:grid-cols-2 gap-6 md:gap-10 items-center">
                {/* Left: text */}
                <div>
                  <SectionLabel>{slide.eyebrow}</SectionLabel>
                  <h1 className="display-font text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-3 md:mb-6" style={{ color: C.ink, overflowWrap: 'break-word', wordBreak: 'break-word' }}>
                    {slide.title1} <span style={{ color: C.pine }}>{slide.title2}</span>
                  </h1>
                  <p className="text-base md:text-lg mb-4 md:mb-8 max-w-md" style={{ color: C.soft }}>{slide.lead}</p>
                  <div className="flex flex-wrap gap-4 mb-4">
                    <a
                      href={`#${slide.cta.href}`}
                      onClick={(e) => { e.preventDefault(); scrollToId(slide.cta.href); }}
                      className="inline-flex items-center gap-2 font-bold px-7 py-3.5 rounded-full focus-ring text-base"
                      style={{ background: C.pine, color: '#fff' }}
                    >
                      {slide.cta.label} <ArrowRight size={18} />
                    </a>
                    {slide.cta2 && (
                      <a
                        href={`#${slide.cta2.href}`}
                        onClick={(e) => { e.preventDefault(); scrollToId(slide.cta2.href); }}
                        className="inline-flex items-center gap-2 font-bold px-7 py-3.5 rounded-full focus-ring text-base"
                        style={slide.cta2.style === 'outline'
                          ? { border: `2px solid ${C.pine}`, color: C.pine }
                          : { background: C.coral, color: '#fff' }}
                      >
                        {slide.cta2.label}
                      </a>
                    )}
                  </div>
                </div>

                {/* Right: visual */}
                <div className="hidden md:flex items-center justify-center">
                  {slide.visual === 'cards' && (
                    <div className="grid grid-cols-2 gap-4 w-full">
                      {[
                        { icon: Stethoscope, label: 'Undersøkelse', sub: 'Fra 600 kr', href: 'tjenester' },
                        { icon: Sparkles, label: 'Tannbleking', sub: 'Fra 2 990 kr', href: 'tjenester' },
                        { icon: ShoppingBag, label: 'Nettbutikk', sub: 'Produkter vi anbefaler', href: 'nettbutikk' },
                        { icon: Calendar, label: 'Bestill time', sub: 'Raskt og enkelt', href: 'bestill' },
                      ].map(({ icon: Icon, label, sub, href }) => (
                        <button key={label} onClick={() => scrollToId(href)} className="flex flex-col items-start gap-3 p-5 rounded-2xl text-left focus-ring transition-transform hover:-translate-y-0.5" style={{ background: '#fff', border: `1px solid ${C.line}` }}>
                          <span className="p-2.5 rounded-xl" style={{ background: 'rgba(47,107,94,0.1)' }}><Icon size={22} color={C.pine} /></span>
                          <div>
                            <p className="font-bold text-sm" style={{ color: C.ink }}>{label}</p>
                            <p className="text-xs mt-0.5" style={{ color: C.soft }}>{sub}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  {slide.visual === 'shop' && (
                    <div className="grid grid-cols-2 gap-4 w-full">
                      {allProducts.slice(0, 4).map((p) => {
                        const Icon = getIcon(p);
                        const imgs = productImages[p.id] || [];
                        return (
                          <button key={p.id} onClick={() => scrollToId('nettbutikk')} className="rounded-2xl overflow-hidden text-left focus-ring hover:-translate-y-0.5 transition-transform" style={{ background: '#fff', border: `1px solid ${C.line}` }}>
                            <div className="h-28 flex items-center justify-center" style={{ background: 'rgba(47,107,94,0.06)' }}>
                              {imgs[0] ? <img src={imgs[0].value} alt={p.name} className="h-full w-full object-contain p-3" /> : <Icon size={32} color={C.pine} style={{ opacity: 0.5 }} />}
                            </div>
                            <div className="p-3">
                              <p className="text-xs font-bold line-clamp-1" style={{ color: C.ink }}>{p.name}</p>
                              <p className="text-xs font-bold mt-0.5" style={{ color: C.pine }}>{formatPrice(p.price)}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {slide.visual === 'booking' && (
                    <div className="w-full rounded-2xl p-8 flex flex-col gap-5" style={{ background: '#fff', border: `1px solid ${C.line}` }}>
                      <p className="font-bold text-lg" style={{ color: C.ink }}>Bestill time online</p>
                      {[
                        { icon: Check, text: 'Velg behandler du ønsker' },
                        { icon: Calendar, text: 'Velg dato og tidspunkt' },
                        { icon: Clock, text: 'Bekreftelse på SMS/e-post' },
                        { icon: MapPin, text: 'Lørenskog sentrum' },
                      ].map(({ icon: Icon, text }) => (
                        <div key={text} className="flex items-center gap-3">
                          <span className="p-2 rounded-full flex-shrink-0" style={{ background: 'rgba(47,107,94,0.1)' }}><Icon size={16} color={C.pine} /></span>
                          <span className="text-sm font-medium" style={{ color: C.soft }}>{text}</span>
                        </div>
                      ))}
                      <button onClick={() => scrollToId('bestill')} className="mt-2 font-bold py-3 rounded-full focus-ring" style={{ background: C.pine, color: '#fff' }}>
                        Gå til timebestilling <ArrowRight size={16} className="inline ml-1" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

        </div>

        {/* Location links + carousel controls — always visible below slides */}
        <div className="flex flex-col items-center gap-2 py-3 px-6" style={{ background: C.bg }}>
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-1 text-sm" style={{ color: C.soft }}>
            <button onClick={() => scrollToId('kontakt')} className="flex items-center gap-1.5 focus-ring rounded hover:underline" style={{ color: C.soft }}>
              <MapPin size={15} color={C.pine} /> Lørenskog sentrum
            </button>
            <button onClick={() => scrollToId('apningstider')} className="flex items-center gap-1.5 focus-ring rounded hover:underline" style={{ color: C.soft }}>
              <Clock size={15} color={C.pine} /> {getWeekdaySummary(settings.hours)}
            </button>
            {settings.whatsapp && (
              <a href={whatsappLink(settings.whatsapp, 'Hei!')} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 font-semibold focus-ring rounded" style={{ color: C.pine }}>
                <WhatsAppIcon size={15} /> WhatsApp
              </a>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setHeroSlide((s) => (s - 1 + heroSlides.length) % heroSlides.length)}
              className="p-2.5 rounded-full border focus-ring"
              style={{ background: '#fff', borderColor: C.line }}
              aria-label="Forrige slide"
            >
              <ArrowLeft size={18} color={C.ink} />
            </button>
            <div className="flex items-center gap-2">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setHeroSlide(i)}
                  aria-label={`Slide ${i + 1}`}
                  className="rounded-full transition-all focus-ring"
                  style={{ width: heroSlide === i ? 24 : 8, height: 8, background: heroSlide === i ? C.pine : C.line }}
                />
              ))}
            </div>
            <button
              onClick={() => setHeroSlide((s) => (s + 1) % heroSlides.length)}
              className="p-2.5 rounded-full border focus-ring"
              style={{ background: '#fff', borderColor: C.line }}
              aria-label="Neste slide"
            >
              <ArrowRight size={18} color={C.ink} />
            </button>
          </div>
        </div>

        {/* Trust badges */}
        <div className="w-full" style={{ background: C.pine }}>
          <div className="max-w-6xl mx-auto px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustBadges.map(({ id, iconKey, text }) => {
              const Icon = BADGE_ICON_MAP[iconKey] || Check;
              return (
              <div key={id} className="flex items-center gap-2.5">
                <span className="p-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }}><Icon size={14} color="#fff" /></span>
                <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.92)' }}>{text}</span>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Shop */}
      <section id="nettbutikk" className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: C.coral }}>Nettbutikk</p>
            <h2 className="display-font text-3xl md:text-4xl font-bold">{tr('shopTitle', lang)}</h2>
          </div>
          <a href="#produktliste" onClick={(e) => { e.preventDefault(); scrollToId('produktliste'); }} className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold focus-ring rounded hover:underline" style={{ color: C.pine }}>
            Se alle produkter <ArrowRight size={15} />
          </a>
        </div>

        {(() => {
          const renderMiniCard = (p) => {
            const Icon = getIcon(p);
            const images = productImages[p.id] || [];
            const discountPct = getEffectiveDiscount(p.id);
            const discounted = applyDiscount(p.price, discountPct);
            const isOut = (stock[p.id] ?? null) === 0;
            return (
              <button
                key={p.id}
                onClick={() => { setSelectedProduct(p); setGalleryIndex(0); window.scrollTo(0, 0); }}
                className="text-left rounded-2xl overflow-hidden flex flex-col focus-ring group"
                style={{ background: '#fff', border: `1px solid ${C.line}`, transition: 'box-shadow 0.18s, transform 0.18s' }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(47,107,94,0.13)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = ''; }}
              >
                <div className="h-48 flex items-center justify-center relative overflow-hidden" style={{ background: 'rgba(47,107,94,0.06)' }}>
                  {images.length > 0 ? (
                    <img src={images[0].value} alt={p.name} className="w-full h-full object-contain p-4 transition-transform group-hover:scale-105" />
                  ) : (
                    <Icon size={48} color={C.pine} style={{ opacity: 0.6 }} />
                  )}
                  {discountPct ? (
                    <span className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: C.coral, color: '#fff' }}>-{discountPct}%</span>
                  ) : p.tag ? (
                    <span className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: C.gold, color: '#fff' }}>{p.tag}</span>
                  ) : null}
                  {isOut && (
                    <span className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: C.ink, color: '#fff' }}>Utsolgt</span>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  {p.sku && <p className="text-xs font-mono mb-1" style={{ color: C.soft }}>{p.sku}</p>}
                  <p className="text-sm font-bold leading-snug mb-2 line-clamp-2 flex-1" style={{ color: C.ink }}>{p.name}</p>
                  <div className="flex items-center justify-between mt-auto">
                    {discountPct ? (
                      <span className="flex flex-col">
                        <span className="text-xs line-through" style={{ color: C.soft }}>{formatPrice(p.price)}</span>
                        <span className="text-base font-bold" style={{ color: C.coral }}>{formatPrice(discounted)}</span>
                      </span>
                    ) : (
                      <span className="text-base font-bold" style={{ color: C.pine }}>{formatPrice(p.price)}</span>
                    )}
                    <span className="p-2 rounded-full" style={{ background: 'rgba(47,107,94,0.1)' }}>
                      <ShoppingCart size={15} color={C.pine} />
                    </span>
                  </div>
                </div>
              </button>
            );
          };

          const explicitlyFeatured = allProducts.filter((p) => featured.includes(p.id));
          const featuredProducts = explicitlyFeatured.length > 0 ? explicitlyFeatured : allProducts.slice(0, 4);
          const offerProducts = allProducts.filter((p) => getEffectiveDiscount(p.id) > 0);

          return (
            <>
              {featuredProducts.length > 0 && (
                <div className="mb-12">
                  <div className="flex items-center gap-2 mb-5">
                    <Star size={16} color={C.gold} fill={C.gold} />
                    <h3 className="display-font text-xl font-bold">{tr('featuredTitle', lang)}</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                    {featuredProducts.map(renderMiniCard)}
                  </div>
                </div>
              )}
              {offerProducts.length > 0 && (
                <div className="mb-10">
                  <div className="flex items-center gap-2 mb-5">
                    <Percent size={16} color={C.coral} />
                    <h3 className="display-font text-xl font-bold">{tr('offersTitle', lang)}</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                    {offerProducts.map(renderMiniCard)}
                  </div>
                </div>
              )}
            </>
          );
        })()}

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" color={C.soft} />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={tr('searchPlaceholder', lang)}
              className="w-full rounded-full pl-11 pr-4 py-3 text-sm focus-ring"
              style={{ border: `1px solid ${C.line}`, background: C.card }}
            />
          </div>
          <div className="relative sm:w-56">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-full pl-4 pr-10 py-3 text-sm font-semibold focus-ring appearance-none"
              style={{ border: `1px solid ${C.line}`, background: C.card, color: C.ink }}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>Sorter: {o.label}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" color={C.soft} />
          </div>
          <button
            onClick={() => setShowFavorites((v) => !v)}
            className="flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold focus-ring"
            style={{
              border: `1px solid ${showFavorites ? C.coral : C.line}`,
              background: showFavorites ? C.coral : C.card,
              color: showFavorites ? '#fff' : C.ink,
            }}
          >
            <Heart size={16} fill={showFavorites ? '#fff' : 'none'} color={showFavorites ? '#fff' : C.coral} />
            Favoritter{favorites.length > 0 ? ` (${favorites.length})` : ''}
          </button>
        </div>

        <div id="produktliste" style={{ scrollMarginTop: '80px' }} />

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            <button
              onClick={() => setActiveCategory('all')}
              className="text-sm font-semibold px-4 py-2 rounded-full focus-ring"
              style={{
                background: activeCategory === 'all' ? C.pine : C.card,
                color: activeCategory === 'all' ? '#fff' : C.ink,
                border: `1px solid ${activeCategory === 'all' ? C.pine : C.line}`,
              }}
            >
              {tr('all', lang)}
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className="text-sm font-semibold px-4 py-2 rounded-full focus-ring"
                style={{
                  background: activeCategory === c.id ? C.pine : C.card,
                  color: activeCategory === c.id ? '#fff' : C.ink,
                  border: `1px solid ${activeCategory === c.id ? C.pine : C.line}`,
                }}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}

        {brands.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <span className="text-xs font-bold uppercase tracking-wide mr-1" style={{ color: C.soft }}>{tr('brandLabel', lang)}</span>
            <button
              onClick={() => setActiveBrand('all')}
              className="text-sm font-semibold px-4 py-2 rounded-full focus-ring"
              style={{
                background: activeBrand === 'all' ? C.pineDark : C.card,
                color: activeBrand === 'all' ? '#fff' : C.ink,
                border: `1px solid ${activeBrand === 'all' ? C.pineDark : C.line}`,
              }}
            >
              {tr('all', lang)}
            </button>
            {brands.map((b) => {
              const Icon = getIcon({ iconKey: b.iconKey });
              const active = activeBrand === b.id;
              return (
                <button
                  key={b.id}
                  onClick={() => setActiveBrand(b.id)}
                  className="text-sm font-semibold pl-3 pr-4 py-2 rounded-full focus-ring flex items-center gap-1.5"
                  style={{
                    background: active ? C.pineDark : C.card,
                    color: active ? '#fff' : C.ink,
                    border: `1px solid ${active ? C.pineDark : C.line}`,
                  }}
                >
                  <Icon size={14} /> {b.name}
                </button>
              );
            })}
          </div>
        )}

        {(() => {
          const query = searchQuery.trim().toLowerCase();
          const filteredProducts = allProducts
            .map((p, i) => ({ ...p, _addedAt: getAddedAt(p, i) }))
            .filter((p) => !showFavorites || favorites.includes(p.id))
            .filter((p) => activeCategory === 'all' || (categoryMap[p.id] || []).includes(activeCategory))
            .filter((p) => activeBrand === 'all' || brandMap[p.id] === activeBrand)
            .filter((p) => !query || p.name.toLowerCase().includes(query) || (p.desc || '').toLowerCase().includes(query));

          filteredProducts.sort((a, b) => {
            switch (sortBy) {
              case 'price-asc':
                return applyDiscount(a.price, getEffectiveDiscount(a.id)) - applyDiscount(b.price, getEffectiveDiscount(b.id));
              case 'price-desc':
                return applyDiscount(b.price, getEffectiveDiscount(b.id)) - applyDiscount(a.price, getEffectiveDiscount(a.id));
              case 'newest':
                return b._addedAt - a._addedAt;
              case 'name-asc':
                return a.name.localeCompare(b.name, 'nb');
              case 'name-desc':
                return b.name.localeCompare(a.name, 'nb');
              default:
                return 0;
            }
          });

          if (productsLoading) {
            return (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="rounded-2xl overflow-hidden" style={{ background: C.card, border: `1px solid ${C.line}` }}>
                    <div className="h-48 skeleton" />
                    <div className="p-5 flex flex-col gap-3">
                      <div className="h-4 w-3/4 rounded skeleton" />
                      <div className="h-3 w-full rounded skeleton" />
                      <div className="h-3 w-1/2 rounded skeleton" />
                    </div>
                  </div>
                ))}
              </div>
            );
          }
          if (filteredProducts.length === 0) {
            return (
              <div className="text-center py-12">
                {showFavorites ? (
                  <>
                    <Heart size={40} color={C.line} className="mx-auto mb-3" />
                    <p className="text-sm" style={{ color: C.soft }}>Du har ingen favoritter ennå. Trykk på hjertet på et produkt for å lagre det her.</p>
                  </>
                ) : (
                  <p className="text-sm" style={{ color: C.soft }}>
                    {query ? `Ingen produkter samsvarer med "${searchQuery}".` : 'Ingen produkter i denne kategorien ennå.'}
                  </p>
                )}
              </div>
            );
          }
          return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          {filteredProducts.map((p) => {
            const Icon = getIcon(p);
            const variants = productVariants[p.id] || [];
            const hasVariants = variants.length > 0;
            const combos = getVariantCombinations(variants);
            const comboKeys = combos.map((c) => buildCartKey(p.id, variants, c));
            const allOut = comboKeys.length > 0 && comboKeys.every((k) => stock[k] === 0);
            const productStock = stock[p.id];
            const orderStatus = orderStatusMap[p.id];
            const lowStock = !orderStatus && !hasVariants && productStock !== undefined && productStock > 0 && productStock <= LOW_STOCK_THRESHOLD;
            const qty = cart[p.id]?.qty || 0;
            const atStockLimit = !hasVariants && productStock !== undefined && qty >= productStock;
            const discountPct = getEffectiveDiscount(p.id);
            const discountedPrice = applyDiscount(p.price, discountPct);
            const images = productImages[p.id] || [];
            return (
              <div
                key={p.id}
                onClick={() => { setSelectedProduct(p); setGalleryIndex(0); window.scrollTo(0, 0); }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setSelectedProduct(p); setGalleryIndex(0); window.scrollTo(0, 0); } }}
                className="rounded-2xl overflow-hidden flex flex-col cursor-pointer transition-transform focus-ring hover:-translate-y-0.5"
                style={{ background: C.card, border: `1px solid ${C.line}`, opacity: allOut ? 0.7 : 1 }}
              >
                <div className="h-48 flex items-center justify-center relative" style={{ background: 'rgba(47,107,94,0.08)' }}>
                  {images.length > 0 ? (
                    <img src={images[0].value} alt={p.name} className="w-full h-full object-contain" />
                  ) : (
                    <Icon size={52} color={C.pine} />
                  )}
                  <div className="absolute top-3 left-3 flex flex-col items-start gap-1">
                    {p.tag && (
                      <span
                        className="text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{ background: C.gold, color: '#fff' }}
                      >
                        {p.tag}
                      </span>
                    )}
                    {discountPct ? (
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: C.coral, color: '#fff' }}>
                        -{discountPct}%
                      </span>
                    ) : null}
                  </div>
                  <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
                    {datasheets[p.id] && (
                      <span
                        className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{ background: C.card, color: C.pine, border: `1px solid ${C.line}` }}
                      >
                        <FileText size={12} /> PDF
                      </span>
                    )}
                    {orderStatus ? (
                      <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: C.pine, color: '#fff' }}>
                        {orderStatus === 'order-10days' ? 'Bestillingsvare' : 'Bestillingsvare'}
                      </span>
                    ) : allOut ? (
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: C.ink, color: '#fff' }}>
                        Utsolgt
                      </span>
                    ) : lowStock ? (
                      <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: C.coral, color: '#fff' }}>
                        <AlertTriangle size={12} /> Kun {productStock} igjen
                      </span>
                    ) : null}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(p.id); }}
                    aria-label={favorites.includes(p.id) ? `Fjern ${p.name} fra favoritter` : `Legg ${p.name} til favoritter`}
                    className="absolute bottom-3 right-14 p-2 rounded-full focus-ring"
                    style={{ background: 'rgba(255,255,255,0.9)', border: `1px solid ${C.line}` }}
                  >
                    <Heart size={14} color={C.coral} fill={favorites.includes(p.id) ? C.coral : 'none'} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleShare(p, discountedPrice, discountPct); }}
                    disabled={shareBusy}
                    aria-label={`Del ${p.name}`}
                    className="absolute bottom-3 right-3 p-2 rounded-full focus-ring disabled:opacity-50"
                    style={{ background: 'rgba(255,255,255,0.9)', border: `1px solid ${C.line}` }}
                  >
                    <Share2 size={14} color={C.pine} />
                  </button>
                </div>
                <div className="p-5 flex flex-col gap-2.5 flex-1">
                  {brandMap[p.id] && (
                    <span className="text-xs font-bold uppercase tracking-wide flex items-center gap-1" style={{ color: C.soft }}>
                      {(() => { const b = brands.find((br) => br.id === brandMap[p.id]); if (!b) return null; const BIcon = getIcon({ iconKey: b.iconKey }); return (<><BIcon size={12} /> {b.name}</>); })()}
                    </span>
                  )}
                  <h3 className="text-base font-bold leading-snug">{p.name}</h3>

                  {p.desc && (
                    <p className="text-sm leading-snug flex-1" style={{ color: C.soft, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {p.desc}
                    </p>
                  )}
                  <div className="flex flex-col gap-3 mt-1">
                    <div>
                      {discountPct ? (
                        <span className="flex items-baseline gap-2 whitespace-nowrap">
                          <span className="text-xs line-through" style={{ color: C.soft }}>{formatPrice(p.price)}</span>
                          <span className="font-bold text-lg" style={{ color: C.coral }}>{formatPrice(discountedPrice)}</span>
                        </span>
                      ) : (
                        <span className="font-bold text-lg whitespace-nowrap" style={{ color: C.pine }}>{formatPrice(p.price)}</span>
                      )}
                    </div>
                    {allOut ? (
                      <span className="text-xs font-bold px-3 py-2.5 rounded-full text-center" style={{ background: C.paper, color: C.soft }}>
                        {tr('soldOut', lang)}
                      </span>
                    ) : hasVariants ? (
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedProduct(p); setGalleryIndex(0); window.scrollTo(0, 0); }}
                        className="w-full text-sm font-bold px-3 py-2.5 rounded-full focus-ring flex items-center justify-center gap-1.5"
                        style={{ background: C.pine, color: '#fff' }}
                      >
                        <Layers size={14} /> {tr('chooseVariant', lang)}
                      </button>
                    ) : qty === 0 ? (
                      <button
                        onClick={(e) => { e.stopPropagation(); addToCart(p.id, {}); }}
                        className="w-full text-sm font-bold px-3 py-2.5 rounded-full focus-ring"
                        style={{ background: C.pine, color: '#fff' }}
                      >
                        {tr('addToCart', lang)}
                      </button>
                    ) : (
                      <div className="flex items-center justify-center gap-3">
                        <button onClick={(e) => { e.stopPropagation(); decFromCart(p.id); }} aria-label="Færre" className="w-9 h-9 rounded-full flex items-center justify-center focus-ring" style={{ border: `1px solid ${C.line}` }}>
                          <Minus size={16} />
                        </button>
                        <span className="text-base font-bold w-6 text-center">{qty}</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); if (!atStockLimit) addToCart(p.id, {}); }}
                          disabled={atStockLimit}
                          aria-label="Flere"
                          className="w-9 h-9 rounded-full flex items-center justify-center focus-ring disabled:opacity-40 disabled:cursor-not-allowed"
                          style={{ background: C.pine, color: '#fff' }}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
          );
        })()}
      </section>

      {/* Services */}
      <section id="tjenester" className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <SectionLabel>{tr('servicesLabel', lang)}</SectionLabel>
        <h2 className="display-font text-3xl md:text-4xl font-bold mb-3">{tr('servicesTitle', lang)}</h2>
        <p className="max-w-xl mb-10" style={{ color: C.soft }}>{tr('servicesLead', lang)}</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s) => {
            const Icon = SERVICE_ICON_MAP[s.iconKey] || Stethoscope;
            return (
              <div
                key={s.id}
                className="p-6 rounded-2xl flex flex-col gap-3"
                style={{ background: C.card, border: `1px solid ${C.line}` }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'rgba(47,107,94,0.1)' }}>
                  <Icon size={22} color={C.pine} />
                </div>
                <h3 className="display-font text-lg font-semibold">{s.name}</h3>
                <p className="text-sm flex-1" style={{ color: C.soft }}>{s.desc}</p>
                <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: C.line }}>
                  <span className="text-xs font-semibold" style={{ color: C.soft }}>{s.duration}</span>
                  <span className="font-bold" style={{ color: C.pine }}>{formatPrice(s.price)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Booking */}
      <section id="bestill" className="py-16 md:py-24" style={{ background: C.pineDark }}>
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-[1.2fr,1fr] gap-12">
          <div>
            <SectionLabel>{tr('bookLabel', lang)}</SectionLabel>
            <h2 className="display-font text-3xl md:text-4xl font-bold mb-3" style={{ color: '#fff' }}>
              {tr('bookTitle', lang)}
            </h2>
            <p className="max-w-md mb-8" style={{ color: 'rgba(255,255,255,0.75)' }}>{tr('bookLead', lang)}</p>

            {confirmed ? (
              <div className="rounded-2xl p-6 md:p-8" style={{ background: C.card }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(47,107,94,0.12)' }}>
                    <Check size={20} color={C.pine} />
                  </div>
                  <h3 className="display-font text-xl font-bold">{tr('apptConfirmed', lang)}</h3>
                </div>
                <p className="text-sm mb-4" style={{ color: C.soft }}>
                  Vi har reservert tiden din. En bekreftelse er sendt til {confirmed.email || 'din kontaktinfo'}.
                </p>
                <dl className="text-sm grid grid-cols-2 gap-y-2 mb-6">
                  <dt style={{ color: C.soft }}>Referanse</dt><dd className="font-bold text-right">{confirmed.ref}</dd>
                  <dt style={{ color: C.soft }}>Behandling</dt><dd className="text-right">{services.find(s => s.id === confirmed.service)?.name}</dd>
                  <dt style={{ color: C.soft }}>{tr('fieldPractitioner', lang)}</dt><dd className="text-right">{confirmed.practitionerName}</dd>
                  <dt style={{ color: C.soft }}>Dato</dt><dd className="text-right">{confirmed.date}</dd>
                  <dt style={{ color: C.soft }}>Klokkeslett</dt><dd className="text-right">{confirmed.time}</dd>
                  <dt style={{ color: C.soft }}>Navn</dt><dd className="text-right">{confirmed.name}</dd>
                </dl>

                <div className="rounded-xl p-4 mb-6" style={{ background: C.paper, border: `1px solid ${C.line}` }}>
                  <p className="text-xs font-bold uppercase tracking-wide mb-2 flex items-center gap-2" style={{ color: C.soft }}>
                    <Mail size={14} /> Forhåndsvisning av e-post
                  </p>
                  <p className="text-sm font-bold mb-2">
                    {fillTemplate(emailTemplates.booking.subject, {
                      ref: confirmed.ref,
                      name: confirmed.name,
                      service: services.find((s) => s.id === confirmed.service)?.name || '',
                      date: confirmed.date,
                      time: confirmed.time,
                    })}
                  </p>
                  <p className="text-sm whitespace-pre-line" style={{ color: C.soft }}>
                    {fillTemplate(emailTemplates.booking.body, {
                      ref: confirmed.ref,
                      name: confirmed.name,
                      service: services.find((s) => s.id === confirmed.service)?.name || '',
                      date: confirmed.date,
                      time: confirmed.time,
                      address: settings.address,
                      phone: settings.phone,
                    })}
                  </p>
                </div>

                <button
                  onClick={resetBooking}
                  className="font-bold px-5 py-2.5 rounded-full focus-ring"
                  style={{ background: C.pine, color: '#fff' }}
                >
                  {tr('bookAnother', lang)}
                </button>
              </div>
            ) : (
              <form onSubmit={submitBooking} className="rounded-2xl p-6 md:p-8 grid gap-5" style={{ background: C.card }}>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: C.soft }}>{tr('fieldTreatment', lang)}</label>
                  <select
                    value={booking.service}
                    onChange={(e) => setBooking((b) => ({ ...b, service: e.target.value }))}
                    className="w-full rounded-lg px-4 py-3 text-sm focus-ring"
                    style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>{s.name} – {s.duration} – {formatPrice(s.price)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: C.soft }}>{tr('fieldPractitioner', lang)}</label>
                  <select
                    value={booking.practitioner}
                    onChange={(e) => setBooking((b) => ({ ...b, practitioner: e.target.value }))}
                    className="w-full rounded-lg px-4 py-3 text-sm focus-ring"
                    style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                  >
                    <option value="any">{tr('anyPractitioner', lang)}</option>
                    {teamMembers.filter((m) => m.bookable).map((m) => (
                      <option key={m.id} value={m.id}>{m.name} – {m.role}</option>
                    ))}
                  </select>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: C.soft }}>{tr('fieldDate', lang)}</label>
                    <div className="relative">
                      <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2" color={C.soft} />
                      <input
                        type="date"
                        min={todayStr}
                        value={booking.date}
                        onChange={(e) => setBooking((b) => ({ ...b, date: e.target.value, time: '' }))}
                        className="w-full rounded-lg pl-10 pr-4 py-3 text-sm focus-ring"
                        style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: C.soft }}>{tr('fieldTimes', lang)}</label>
                    {booking.date ? (
                      closureReason ? (
                        <div className="flex items-center gap-2 text-sm py-3 px-3 rounded-lg" style={{ background: C.paper, color: C.coral }}>
                          <CalendarOff size={16} className="flex-shrink-0" />
                          {tr('closedThatDay', lang)} ({closureReason}). {tr('chooseAnotherDate', lang)}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1">
                          {slots.map((s) => (
                            <button
                              type="button"
                              key={s.time}
                              disabled={!s.free}
                              onClick={() => setBooking((b) => ({ ...b, time: s.time }))}
                              className="slot-btn text-xs font-semibold px-3 py-2 rounded-lg transition-colors focus-ring"
                              style={{
                                border: `1px solid ${booking.time === s.time ? C.pine : C.line}`,
                                background: booking.time === s.time ? C.pine : '#fff',
                                color: booking.time === s.time ? '#fff' : s.free ? C.ink : '#bbb',
                                cursor: s.free ? 'pointer' : 'not-allowed',
                                textDecoration: s.free ? 'none' : 'line-through',
                              }}
                            >
                              {s.time}
                            </button>
                          ))}
                        </div>
                      )
                    ) : (
                      <p className="text-sm py-3" style={{ color: C.soft }}>{tr('pickDate', lang)}</p>
                    )}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: C.soft }}>{tr('fieldName', lang)}</label>
                    <input
                      type="text"
                      required
                      value={booking.name}
                      onChange={(e) => setBooking((b) => ({ ...b, name: e.target.value }))}
                      className="w-full rounded-lg px-4 py-3 text-sm focus-ring"
                      style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                      placeholder={tr('fieldName', lang)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: C.soft }}>{tr('fieldPhone', lang)}</label>
                    <input
                      type="tel"
                      required
                      value={booking.phone}
                      onChange={(e) => setBooking((b) => ({ ...b, phone: e.target.value }))}
                      className="w-full rounded-lg px-4 py-3 text-sm focus-ring"
                      style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                      placeholder={tr('fieldPhone', lang)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: C.soft }}>{tr('fieldEmail', lang)}</label>
                  <input
                    type="email"
                    value={booking.email}
                    onChange={(e) => setBooking((b) => ({ ...b, email: e.target.value }))}
                    className="w-full rounded-lg px-4 py-3 text-sm focus-ring"
                    style={{ border: `1px solid ${C.line}`, background: '#fff' }}
                    placeholder="navn@eksempel.no"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!booking.date || !booking.time || !booking.name || !booking.phone || !!closureReason}
                  className="font-bold px-6 py-3.5 rounded-full focus-ring disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: C.coral, color: '#fff' }}
                >
                  {tr('confirmBooking', lang)}
                </button>
              </form>
            )}
          </div>

          <div className="rounded-2xl p-6 md:p-8 self-start" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
            <h3 className="display-font text-xl font-semibold mb-4" style={{ color: '#fff' }}>Du har valgt</h3>
            <div className="space-y-3 text-sm" style={{ color: 'rgba(255,255,255,0.85)' }}>
              <div className="flex justify-between"><span>Behandling</span><span className="font-semibold">{selectedService?.name}</span></div>
              <div className="flex justify-between"><span>Varighet</span><span className="font-semibold">{selectedService?.duration}</span></div>
              <div className="flex justify-between"><span>Pris</span><span className="font-semibold">{formatPrice(selectedService?.price || 0)}</span></div>
              <div className="flex justify-between"><span>Dato</span><span className="font-semibold">{booking.date || '–'}</span></div>
              <div className="flex justify-between"><span>Tid</span><span className="font-semibold">{booking.time || '–'}</span></div>
            </div>
            <div className="mt-6 pt-6 text-sm space-y-3" style={{ borderTop: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)' }}>
              <div className="flex items-center gap-2"><MapPin size={16} color={C.gold} /> {settings.address}</div>
              <div className="flex items-center gap-2"><Phone size={16} color={C.gold} /> {settings.phone}</div>
              <div className="flex items-center gap-2"><Mail size={16} color={C.gold} /> {settings.email}</div>
              <div className="flex items-center gap-2"><Clock size={16} color={C.gold} /> {getWeekdaySummary(settings.hours)}</div>
              {settings.whatsapp && (
                <a
                  href={whatsappLink(settings.whatsapp, 'Hei! Jeg har et spørsmål om en time hos Infinitum Dental.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-semibold focus-ring rounded"
                  style={{ color: C.gold }}
                >
                  <WhatsAppIcon size={16} /> Send melding på WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      </section>


      {/* Team / About */}
      <section id="team" className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <SectionLabel>{tr('teamLabel', lang)}</SectionLabel>
        <h2 className="display-font text-3xl md:text-4xl font-bold mb-3">{tr('teamTitle', lang)}</h2>
        <p className="max-w-xl mb-10" style={{ color: C.soft }}>{tr('teamLead', lang)}</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {teamMembers.map((m) => {
            const Icon = getIcon({ iconKey: m.iconKey });
            return (
              <button
                key={m.id}
                onClick={() => { setSelectedMember(m); window.scrollTo(0, 0); }}
                className="text-left rounded-2xl p-6 flex flex-col gap-3 focus-ring transition-transform hover:-translate-y-0.5"
                style={{ background: C.card, border: `1px solid ${C.line}` }}
              >
                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'rgba(47,107,94,0.1)' }}>
                  <Icon size={26} color={C.pine} />
                </div>
                <div>
                  <h3 className="display-font text-lg font-semibold">{m.name}</h3>
                  <p className="text-xs font-bold uppercase tracking-wide" style={{ color: C.coral }}>{m.role}</p>
                </div>
                <p className="text-sm" style={{ color: C.soft, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{m.bio}</p>
                <span className="text-sm font-bold flex items-center gap-1 mt-1" style={{ color: C.pine }}>
                  {tr('readMore', lang)} <ChevronRight size={14} />
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* News / Blog */}
      <section id="nyheter" className="py-16 md:py-24" style={{ background: C.card, borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}` }}>
        <div className="max-w-6xl mx-auto px-6">
          <SectionLabel>{tr('newsLabel', lang)}</SectionLabel>
          <h2 className="display-font text-3xl md:text-4xl font-bold mb-3">{tr('newsTitle', lang)}</h2>
          <p className="max-w-xl mb-10" style={{ color: C.soft }}>{tr('newsLead', lang)}</p>
          {newsPosts.length === 0 ? (
            <p className="text-sm" style={{ color: C.soft }}>Ingen nyheter publisert ennå.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...newsPosts]
                .sort((a, b) => (a.date < b.date ? 1 : -1))
                .map((post) => (
                  <button
                    key={post.id}
                    onClick={() => { setSelectedPost(post); window.scrollTo(0, 0); }}
                    className="text-left rounded-2xl p-6 flex flex-col gap-3 focus-ring transition-transform hover:-translate-y-0.5"
                    style={{ background: C.paper, border: `1px solid ${C.line}` }}
                  >
                    <span className="text-xs font-bold uppercase tracking-wide" style={{ color: C.soft }}>
                      {new Date(post.date).toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    <h3 className="display-font text-lg font-semibold">{post.title}</h3>
                    <p className="text-sm flex-1" style={{ color: C.soft }}>{post.excerpt}</p>
                    <span className="text-sm font-bold flex items-center gap-1" style={{ color: C.pine }}>
                      Les mer <ChevronRight size={14} />
                    </span>
                  </button>
                ))}
            </div>
          )}
        </div>
      </section>

      {/* My bookings */}
      <section id="mine-bestillinger" className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <SectionLabel>{tr('myBookingsLabel', lang)}</SectionLabel>
        <h2 className="display-font text-3xl md:text-4xl font-bold mb-3">{tr('myBookingsTitle', lang)}</h2>
        <p className="max-w-xl mb-8" style={{ color: C.soft }}>{tr('myBookingsLead', lang)}</p>
        <form onSubmit={handleLookupBooking} className="grid sm:grid-cols-[1fr,1fr,auto] gap-3 max-w-xl mb-6">
          <input
            type="text"
            required
            value={lookupRef}
            onChange={(e) => setLookupRef(e.target.value)}
            placeholder={tr('refPlaceholder', lang)}
            className="rounded-lg px-4 py-3 text-sm focus-ring"
            style={{ border: `1px solid ${C.line}`, background: C.card }}
          />
          <input
            type="tel"
            required
            value={lookupPhone}
            onChange={(e) => setLookupPhone(e.target.value)}
            placeholder="Telefonnummer"
            className="rounded-lg px-4 py-3 text-sm focus-ring"
            style={{ border: `1px solid ${C.line}`, background: C.card }}
          />
          <button
            type="submit"
            className="font-bold px-6 py-3 rounded-full focus-ring flex items-center justify-center gap-2"
            style={{ background: C.pine, color: '#fff' }}
          >
            <ClipboardCheck size={16} /> {tr('checkStatus', lang)}
          </button>
        </form>

        {lookupResult === null && (
          <div className="rounded-xl p-4 flex items-center gap-2 text-sm max-w-xl" style={{ background: C.card, border: `1px solid ${C.line}`, color: C.soft }}>
            <XCircle size={18} color={C.coral} />
            Fant ingen bestilling med denne referansen og telefonnummeret. Sjekk at begge er riktige.
          </div>
        )}

        {lookupResult && (
          <div className="rounded-2xl p-6 max-w-xl" style={{ background: C.card, border: `1px solid ${C.line}` }}>
            <div className="flex items-center gap-3 mb-4">
              {lookupResult.status === 'Bekreftet' && <CheckCircle size={20} color={C.pine} />}
              {lookupResult.status === 'Fullført' && <CheckCircle size={20} color={C.pine} />}
              {(lookupResult.status === 'Avlyst' || lookupResult.status === 'Ikke møtt') && <XCircle size={20} color={C.coral} />}
              <span className="font-bold text-lg" style={{ color: lookupResult.status === 'Avlyst' || lookupResult.status === 'Ikke møtt' ? C.coral : C.pine }}>
                {lookupResult.status}
              </span>
            </div>
            <dl className="text-sm grid grid-cols-2 gap-y-2">
              <dt style={{ color: C.soft }}>Referanse</dt><dd className="text-right font-bold">{lookupResult.ref}</dd>
              <dt style={{ color: C.soft }}>Behandling</dt><dd className="text-right">{lookupResult.serviceName}</dd>
              <dt style={{ color: C.soft }}>Dato</dt><dd className="text-right">{lookupResult.date}</dd>
              <dt style={{ color: C.soft }}>Klokkeslett</dt><dd className="text-right">{lookupResult.time}</dd>
              <dt style={{ color: C.soft }}>Navn</dt><dd className="text-right">{lookupResult.name}</dd>
            </dl>
          </div>
        )}

        <div className="mt-10 pt-10" style={{ borderTop: `1px solid ${C.line}` }}>
          <h3 className="display-font text-2xl font-bold mb-2">{tr('waitlistTitle', lang)}</h3>
          <p className="max-w-xl mb-6" style={{ color: C.soft }}>{tr('waitlistLead', lang)}</p>
          {waitlistSubmitted ? (
            <div className="rounded-xl p-4 flex items-center gap-2 text-sm max-w-xl" style={{ background: 'rgba(47,107,94,0.1)', color: C.pine }}>
              <CheckCircle size={18} /> {tr('waitlistDone', lang)}
            </div>
          ) : (
            <form onSubmit={handleWaitlistSubmit} className="grid sm:grid-cols-2 gap-3 max-w-xl">
              <input
                type="text"
                required
                value={waitlistForm.name}
                onChange={(e) => setWaitlistForm((f) => ({ ...f, name: e.target.value }))}
                placeholder={tr('fieldName', lang)}
                className="rounded-lg px-4 py-3 text-sm focus-ring"
                style={{ border: `1px solid ${C.line}`, background: C.card }}
              />
              <input
                type="tel"
                required
                value={waitlistForm.phone}
                onChange={(e) => setWaitlistForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder={tr('fieldPhone', lang)}
                className="rounded-lg px-4 py-3 text-sm focus-ring"
                style={{ border: `1px solid ${C.line}`, background: C.card }}
              />
              <select
                value={waitlistForm.service}
                onChange={(e) => setWaitlistForm((f) => ({ ...f, service: e.target.value }))}
                className="rounded-lg px-4 py-3 text-sm focus-ring sm:col-span-2"
                style={{ border: `1px solid ${C.line}`, background: C.card }}
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <input
                type="text"
                value={waitlistForm.note}
                onChange={(e) => setWaitlistForm((f) => ({ ...f, note: e.target.value }))}
                placeholder={tr('waitlistNote', lang)}
                className="rounded-lg px-4 py-3 text-sm focus-ring sm:col-span-2"
                style={{ border: `1px solid ${C.line}`, background: C.card }}
              />
              <button
                type="submit"
                className="font-bold px-6 py-3 rounded-full focus-ring sm:col-span-2 justify-self-start"
                style={{ background: C.pine, color: '#fff' }}
              >
                {tr('waitlistJoin', lang)}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 md:py-24" style={{ background: C.card, borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}` }}>
        <div className="max-w-3xl mx-auto px-6">
          <SectionLabel>{tr('faqLabel', lang)}</SectionLabel>
          <h2 className="display-font text-3xl md:text-4xl font-bold mb-3">{tr('faqTitle', lang)}</h2>
          <p className="mb-10" style={{ color: C.soft }}>
            Finner du ikke svar her? Send oss en melding på <a href={whatsappLink(settings.whatsapp, 'Hei! Jeg har et spørsmål til Infinitum Dental.')} target="_blank" rel="noopener noreferrer" className="font-bold focus-ring rounded" style={{ color: C.pine }}>WhatsApp</a> eller ta kontakt under.
          </p>
          {faqItems.length === 0 ? (
            <p className="text-sm" style={{ color: C.soft }}>Ingen spørsmål publisert ennå.</p>
          ) : (
            <div className="grid gap-3">
              {faqItems.map((f) => {
                const open = openFaqId === f.id;
                return (
                  <div key={f.id} className="rounded-2xl overflow-hidden" style={{ background: C.paper, border: `1px solid ${C.line}` }}>
                    <button
                      onClick={() => setOpenFaqId(open ? null : f.id)}
                      className="w-full flex items-center justify-between gap-3 text-left p-5 focus-ring"
                      aria-expanded={open}
                    >
                      <span className="font-semibold flex items-center gap-2">
                        <HelpCircle size={18} color={C.pine} className="flex-shrink-0" />
                        {f.question}
                      </span>
                      <ChevronDown size={18} color={C.soft} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
                    </button>
                    {open && (
                      <div className="px-5 pb-5 text-sm" style={{ color: C.soft }}>
                        {f.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Contact / Footer */}
      <footer id="kontakt" style={{ background: C.ink }}>
        <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <InfinityMark size={30} color={C.gold} />
              <span className="display-font text-lg font-semibold" style={{ color: '#fff' }}>Infinitum Dental</span>
            </div>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Spesialistklinikk i Lørenskog med ekspertise innen tannimplantater, oralkirurgi og periodontittbehandling.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: C.gold }}>{tr('contactLabel', lang)}</h4>
            <div className="space-y-3 text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 focus-ring rounded hover:underline"
                style={{ color: 'rgba(255,255,255,0.75)' }}
              >
                <MapPin size={16} /> {settings.address}
              </a>
              <div className="flex items-center gap-2"><Phone size={16} /> {settings.phone}</div>
              <div className="flex items-center gap-2"><Mail size={16} /> {settings.email}</div>
              {settings.whatsapp && (
                <a
                  href={whatsappLink(settings.whatsapp, 'Hei! Jeg har et spørsmål til Infinitum Dental.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-semibold focus-ring rounded"
                  style={{ color: '#fff' }}
                >
                  <WhatsAppIcon size={16} /> Skriv på WhatsApp
                </a>
              )}
              <div className="rounded-xl overflow-hidden mt-2" style={{ border: '1px solid rgba(255,255,255,0.12)' }}>
                <iframe
                  title="Kart til Infinitum Dental"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(settings.address)}&z=15&output=embed`}
                  width="100%"
                  height="180"
                  style={{ border: 0, display: 'block' }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(settings.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold focus-ring rounded"
                style={{ color: C.gold }}
              >
                <MapPin size={14} /> Få veibeskrivelse
              </a>
            </div>
          </div>
          <div id="apningstider" style={{ scrollMarginTop: '90px' }}>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: C.gold }}>{tr('hours', lang)}</h4>
            <div className="space-y-2 text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
              {DAY_KEYS.map((day) => (
                <div key={day} className="flex justify-between max-w-xs">
                  <span>{DAY_LABELS[day]}</span><span>{settings.hours[day]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-3 text-center text-xs py-6" style={{ color: 'rgba(255,255,255,0.4)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <button onClick={() => { setLegalPage('vilkar'); window.scrollTo(0, 0); }} className="focus-ring rounded hover:underline" style={{ color: 'rgba(255,255,255,0.55)' }}>Salgsvilkår</button>
            <button onClick={() => { setLegalPage('angrerett'); window.scrollTo(0, 0); }} className="focus-ring rounded hover:underline" style={{ color: 'rgba(255,255,255,0.55)' }}>Angrerett</button>
            <button onClick={() => { setLegalPage('personvern'); window.scrollTo(0, 0); }} className="focus-ring rounded hover:underline" style={{ color: 'rgba(255,255,255,0.55)' }}>Personvern</button>
          </div>
          <span>© {new Date().getFullYear()} Infinitum Dental. Alle rettigheter reservert.</span>
          <button
            onClick={() => {
              setView('admin');
              setSelectedProduct(null);
              setSelectedPost(null);
              setSelectedMember(null);
              setAccountView(false);
              setLegalPage(null);
              window.scrollTo(0, 0);
            }}
            className="inline-flex items-center gap-1 focus-ring rounded"
            style={{ color: 'rgba(255,255,255,0.55)' }}
          >
            <Settings size={12} /> Admin
          </button>
        </div>
      </footer>

      {/* Cart drawer */}
      {cartOpen && renderCartDrawer()}

      {/* Share fallback panel */}
      {shareFallback && renderShareFallback()}      {toast && renderToast()}

      {/* Auth modal */}
      {authOpen && (
        <div className="fixed inset-0 z-[55] flex items-center justify-center p-4">
          <div className="absolute inset-0" style={{ background: 'rgba(28,43,39,0.45)' }} onClick={() => setAuthOpen(false)} />
          <div className="relative w-full max-w-sm rounded-2xl overflow-hidden" style={{ background: C.card }}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-1">
                <h3 className="display-font text-xl font-bold">{authMode === 'login' ? 'Logg inn' : 'Bli medlem'}</h3>
                <button onClick={() => setAuthOpen(false)} aria-label="Lukk" className="p-2 rounded-full focus-ring" style={{ border: `1px solid ${C.line}` }}>
                  <X size={18} />
                </button>
              </div>
              <p className="text-xs mb-4" style={{ color: C.soft }}>
                Passordet ditt er kryptert og lagret sikkert.
              </p>
              <div className="grid gap-3">
                {authMode === 'register' && (
                  <>
                    {/* Account type toggle */}
                    <div className="flex rounded-lg overflow-hidden" style={{ border: `1px solid ${C.line}` }}>
                      {[{ value: 'private', label: 'Privatperson' }, { value: 'business', label: 'Bedrift' }].map(({ value, label }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setAuthForm((f) => ({ ...f, accountType: value }))}
                          className="flex-1 py-2 text-sm font-semibold transition-colors focus-ring"
                          style={{ background: authForm.accountType === value ? C.pine : '#fff', color: authForm.accountType === value ? '#fff' : C.soft }}
                        >{label}</button>
                      ))}
                    </div>
                    <input type="text" value={authForm.name} onChange={(e) => setAuthForm((f) => ({ ...f, name: e.target.value }))} placeholder={authForm.accountType === 'business' ? 'Kontaktperson' : 'Navn'} className="rounded-lg px-3 py-2.5 text-sm focus-ring" style={{ border: `1px solid ${C.line}`, background: '#fff' }} />
                    {authForm.accountType === 'business' && (
                      <>
                        <input type="text" value={authForm.companyName} onChange={(e) => setAuthForm((f) => ({ ...f, companyName: e.target.value }))} placeholder="Bedriftsnavn" className="rounded-lg px-3 py-2.5 text-sm focus-ring" style={{ border: `1px solid ${C.line}`, background: '#fff' }} />
                        <input type="text" value={authForm.orgNumber} onChange={(e) => setAuthForm((f) => ({ ...f, orgNumber: e.target.value }))} placeholder="Org.nummer (valgfritt)" className="rounded-lg px-3 py-2.5 text-sm focus-ring" style={{ border: `1px solid ${C.line}`, background: '#fff' }} />
                      </>
                    )}
                  </>
                )}
                <input type="email" value={authForm.email} onChange={(e) => setAuthForm((f) => ({ ...f, email: e.target.value }))} placeholder="E-post" className="rounded-lg px-3 py-2.5 text-sm focus-ring" style={{ border: `1px solid ${C.line}`, background: '#fff' }} />
                <input type="password" value={authForm.password} onChange={(e) => setAuthForm((f) => ({ ...f, password: e.target.value }))} placeholder="Passord" className="rounded-lg px-3 py-2.5 text-sm focus-ring" style={{ border: `1px solid ${C.line}`, background: '#fff' }} />
                {authMode === 'register' && (
                  <>
                    <input type="tel" value={authForm.phone} onChange={(e) => setAuthForm((f) => ({ ...f, phone: e.target.value }))} placeholder="Telefon (valgfritt)" className="rounded-lg px-3 py-2.5 text-sm focus-ring" style={{ border: `1px solid ${C.line}`, background: '#fff' }} />
                    <input type="text" value={authForm.address} onChange={(e) => setAuthForm((f) => ({ ...f, address: e.target.value }))} placeholder="Leveringsadresse (valgfritt)" className="rounded-lg px-3 py-2.5 text-sm focus-ring" style={{ border: `1px solid ${C.line}`, background: '#fff' }} />
                  </>
                )}
                {authError && <p className="text-sm" style={{ color: C.coral }}>{authError}</p>}
                <button
                  onClick={authMode === 'login' ? handleLogin : handleRegister}
                  className="font-bold py-3 rounded-full focus-ring"
                  style={{ background: C.pine, color: '#fff' }}
                >
                  {authMode === 'login' ? 'Logg inn' : 'Opprett konto'}
                </button>
                <button
                  onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setAuthError(''); }}
                  className="text-sm font-semibold focus-ring rounded"
                  style={{ color: C.pine }}
                >
                  {authMode === 'login' ? 'Har du ikke konto? Bli medlem' : 'Har du allerede konto? Logg inn'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
