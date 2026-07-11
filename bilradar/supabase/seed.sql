-- Bilradar – seed-data (speiler lib/seed/data.ts)
-- Kjør etter 0001_init.sql. Idempotent på slug/unike felt.

-- ---------- Merker ----------
insert into public.brands (navn, slug, logo_url) values
  ('Tesla','tesla','/brands/tesla.svg'),
  ('Toyota','toyota','/brands/toyota.svg'),
  ('Volkswagen','volkswagen','/brands/volkswagen.svg'),
  ('Volvo','volvo','/brands/volvo.svg'),
  ('MG','mg','/brands/mg.svg'),
  ('BYD','byd','/brands/byd.svg'),
  ('Škoda','skoda','/brands/skoda.svg'),
  ('Hyundai','hyundai','/brands/hyundai.svg'),
  ('Kia','kia','/brands/kia.svg'),
  ('Polestar','polestar','/brands/polestar.svg'),
  ('Nissan','nissan','/brands/nissan.svg'),
  ('Cupra','cupra','/brands/cupra.svg')
on conflict (slug) do nothing;

-- ---------- Tilbud ----------
insert into public.offers
  (brand_id, modell, slug, segment, drivlinje, tilbudstype, maanedspris, startleie, bindingstid_mnd, km_per_aar, forhandler, forhandler_url, bilde_urls, popularitet, aktiv, opprettet)
values
  ((select id from public.brands where slug='tesla'),'Model Y RWD','tesla-model-y-rwd','suv','elbil','leasing',3990,45000,36,15000,'Tesla Norge','https://www.tesla.com/no_no', array['/cars/elbil.svg'],98,true,'2026-06-28'),
  ((select id from public.brands where slug='toyota'),'Yaris Cross Hybrid','toyota-yaris-cross-hybrid','kompakt','hybrid','leasing',2790,29000,36,15000,'Toyota Oslo','https://www.toyota.no', array['/cars/kompakt.svg'],90,true,'2026-06-30'),
  ((select id from public.brands where slug='volkswagen'),'ID.4 Pro','volkswagen-id4-pro','suv','elbil','leasing',3490,39000,36,15000,'Møller Bil','https://www.vw.no', array['/cars/suv.svg'],84,true,'2026-07-01'),
  ((select id from public.brands where slug='volvo'),'EX30 Single Motor','volvo-ex30-single-motor','suv','elbil','leasing',3290,35000,36,15000,'Volvo Bilia','https://www.volvocars.com/no', array['/cars/suv-2.svg'],88,true,'2026-07-03'),
  ((select id from public.brands where slug='mg'),'MG4 Electric','mg4-electric','kompakt','elbil','leasing',2490,25000,36,15000,'MG Motor Norge','https://mgmotor.no', array['/cars/kompakt.svg'],76,true,'2026-06-20'),
  ((select id from public.brands where slug='byd'),'ATTO 3','byd-atto-3','suv','elbil','leie',4290,0,12,20000,'BYD RSA','https://www.byd.com/no', array['/cars/elbil.svg'],70,true,'2026-07-05'),
  ((select id from public.brands where slug='skoda'),'Enyaq 85','skoda-enyaq-85','suv','elbil','lån',5290,80000,60,0,'Harald A. Møller','https://www.skoda.no', array['/cars/suv.svg'],66,true,'2026-06-18'),
  ((select id from public.brands where slug='hyundai'),'Kona Electric','hyundai-kona-electric','kompakt','elbil','leasing',3190,30000,36,15000,'Hyundai Motor Norway','https://www.hyundai.no', array['/cars/kompakt.svg'],72,true,'2026-06-25'),
  ((select id from public.brands where slug='kia'),'EV6 GT-Line','kia-ev6-gt-line','premium','elbil','leasing',4990,55000,36,15000,'Kia Bilia','https://www.kia.com/no', array['/cars/premium.svg'],80,true,'2026-07-02'),
  ((select id from public.brands where slug='polestar'),'Polestar 2 Long Range','polestar-2-long-range','premium','elbil','leasing',4590,50000,36,15000,'Polestar Oslo','https://www.polestar.com/no', array['/cars/sedan.svg'],74,true,'2026-06-22'),
  ((select id from public.brands where slug='nissan'),'Leaf','nissan-leaf','kompakt','elbil','leie',3690,0,12,20000,'Nissan Norge','https://www.nissan.no', array['/cars/kompakt.svg'],55,true,'2026-06-10'),
  ((select id from public.brands where slug='cupra'),'Born','cupra-born','kompakt','elbil','leasing',3390,34000,36,15000,'Cupra Oslo','https://www.cupraofficial.no', array['/cars/premium-2.svg'],68,true,'2026-07-06'),
  ((select id from public.brands where slug='toyota'),'Corolla Touring Sports','toyota-corolla-touring-sports','stasjonsvogn','hybrid','leasing',3590,32000,36,15000,'Toyota Bergen','https://www.toyota.no', array['/cars/stasjonsvogn.svg'],62,true,'2026-06-15'),
  ((select id from public.brands where slug='volkswagen'),'Polo Life','volkswagen-polo-life','småbil','bensin','leasing',2290,22000,36,15000,'Møller Bil','https://www.vw.no', array['/cars/smaabil.svg'],50,true,'2026-06-12'),
  ((select id from public.brands where slug='volvo'),'V60 B4 mild-hybrid','volvo-v60-b4','stasjonsvogn','hybrid','lån',5990,90000,60,0,'Volvo Bilia','https://www.volvocars.com/no', array['/cars/stasjonsvogn.svg'],58,true,'2026-06-08')
on conflict (slug) do nothing;

-- ---------- Bloggartikler ----------
insert into public.posts (tittel, slug, utdrag, cover_url, kategori, tags, publisert, opprettet, innhold) values
  ('Leasing eller billån i 2026? Slik velger du riktig','leasing-eller-billan-2026','Privatleasing har eksplodert i popularitet, men er det alltid det smarteste? Vi bryter ned totalkostnaden, restverdi og fleksibilitet.','/blog/leasing-guide.svg','Kjøpsguide', array['leasing','billån','økonomi'], true, '2026-07-04', E'## Hva er forskjellen?\n\nVed **privatleasing** betaler du en fast månedspris for å bruke bilen i en avtalt periode – typisk 36 måneder – uten å eie den. Ved **billån** kjøper du bilen og nedbetaler et lån.\n\n## Totalkostnad over tid\n\nDet viktigste er å regne på totalkostnaden, ikke bare månedsprisen.\n\n- **Leasing** passer deg som vil ha forutsigbarhet.\n- **Billån** passer deg som kjører mye og vil eie bilen.'),
  ('Elbil om vinteren: Dette taper du på rekkevidden','elbil-vinter-rekkevidde','Kulde stjeler rekkevidde. Vi tester hvor mye du realistisk mister på norske vinterveier – og hva du kan gjøre med det.','/blog/elbil-vinter.svg','Test', array['elbil','vinter','rekkevidde'], true, '2026-06-27', E'## Kulden koster\n\nDe fleste elbiler mister mellom **15 og 30 %** av rekkevidden når temperaturen kryper under null.\n\n## Slik minimerer du tapet\n\n1. Forvarm bilen på lading.\n2. Bruk setevarme fremfor kupévarme.\n3. Planlegg lading.'),
  ('Disse bilene dominerer det norske markedet i 2026','mest-solgte-biler-norge-2026','Tesla og Volkswagen kjemper i toppen, men et kinesisk merke klatrer raskt. Her er trendene bak registreringstallene.','/blog/mest-solgte.svg','Nyheter', array['statistikk','marked','elbil'], true, '2026-07-08', E'## Elbilen er normen\n\nOver 9 av 10 nye personbiler i Norge er nå elektriske.\n\n## Kina tar markedsandeler\n\nMerker som **BYD** og **MG** vokser raskt.')
on conflict (slug) do nothing;

-- ---------- Salgsstatistikk (juni + mai 2026) ----------
insert into public.sales_stats (brand_id, modell, maaned, antall_registreringer, plassering) values
  ((select id from public.brands where slug='tesla'),'Model Y','2026-06-01',2410,1),
  ((select id from public.brands where slug='volkswagen'),'ID.4','2026-06-01',1320,2),
  ((select id from public.brands where slug='toyota'),'bZ4X / Yaris Cross','2026-06-01',1180,3),
  ((select id from public.brands where slug='volvo'),'EX30','2026-06-01',1105,4),
  ((select id from public.brands where slug='byd'),'ATTO 3 / Seal','2026-06-01',980,5),
  ((select id from public.brands where slug='skoda'),'Enyaq','2026-06-01',870,6),
  ((select id from public.brands where slug='hyundai'),'Kona / Ioniq','2026-06-01',760,7),
  ((select id from public.brands where slug='mg'),'MG4','2026-06-01',720,8),
  ((select id from public.brands where slug='kia'),'EV6 / Niro','2026-06-01',690,9),
  ((select id from public.brands where slug='nissan'),'Ariya / Leaf','2026-06-01',540,10),
  ((select id from public.brands where slug='tesla'),'Model Y','2026-05-01',2180,1),
  ((select id from public.brands where slug='volkswagen'),'ID.4','2026-05-01',1400,2),
  ((select id from public.brands where slug='toyota'),'bZ4X / Yaris Cross','2026-05-01',1090,3),
  ((select id from public.brands where slug='volvo'),'EX30','2026-05-01',860,4),
  ((select id from public.brands where slug='byd'),'ATTO 3 / Seal','2026-05-01',640,7),
  ((select id from public.brands where slug='skoda'),'Enyaq','2026-05-01',900,5),
  ((select id from public.brands where slug='hyundai'),'Kona / Ioniq','2026-05-01',780,6),
  ((select id from public.brands where slug='mg'),'MG4','2026-05-01',590,9),
  ((select id from public.brands where slug='kia'),'EV6 / Niro','2026-05-01',710,8),
  ((select id from public.brands where slug='nissan'),'Ariya / Leaf','2026-05-01',505,10)
on conflict (brand_id, maaned) do nothing;
