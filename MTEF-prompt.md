# Honlap-építő prompt — Magyar Tűzvédelmi Egyeztető Fórum (MTEF)

## A feladat

Készíts egy egyoldalas (single-page), modern, **informális hangvételű, mégis tekintélyt sugárzó landing page-et** a **Magyar Tűzvédelmi Egyeztető Fórum (MTEF)** számára. A cél az, hogy a hazai tűzvédelmi szakma frissen alakult ernyőszervezete méltó online megjelenést kapjon, amely egyszerre szól a kormányzati döntéshozóknak, a szakmai közönségnek és a tájékozódni vágyó nagyközönségnek.

A landing page legyen letisztult, levegős, mai. Kerüld a hagyományos, túlzsúfolt "kamarai" weboldalak stílusát — inkább egy modern szakmai platform vagy think tank esztétikája legyen a referencia (pl. Stripe, Linear, Apple keynote-megjelenések, vagy a magyar szervezetek közül a 2024-2026-os modernebb szakmai oldalak).

-----

## Vizuális identitás

### Színpaletta

- **Elsődleges színek (nemzeti motívum, finoman):**
  - Tűzpiros: `#CD2A3E` (akcentus, hívóelem, láng)
  - Fehér: `#FFFFFF` (alapszín, levegő)
  - Mély zöld: `#436F4D` (másodlagos akcentus, stabilitás)
- **Semleges színek (a fő dizájn vázát ezek adják):**
  - Antracit / sötét grafit: `#1A1D21` (főszöveg, nagy címek)
  - Meleg szürke: `#6B7280` (másodlagos szöveg)
  - Halvány homokszín / törtfehér: `#F8F6F2` (szekciók háttere, melegség)
  - Vékony szürke vonal: `#E5E7EB` (elválasztók)
- **Hangulat:** a piros-fehér-zöld **soha ne legyen harsány**, hanem mértékkel, akcentusként jelenjen meg (pl. egy gradiens vonal a hero alján, ikonok színei, kiemelt szavak alatti aláhúzás). Az oldal alaphangulata **letisztult, semleges, prémium**, és csak finoman utal a nemzeti karakterre.

### Tipográfia

- **Főcímek:** modern, geometrikus sans-serif — javasolt: **Inter**, **DM Sans**, vagy **Geist**. Bold (700) súly, szoros betűköz (`tracking-tight`), nagy méret (hero: 56–72px desktop).
- **Szövegtörzs:** ugyanaz a család Regular (400) súllyal, 17–18px, kényelmes sortávval (`leading-relaxed`, ~1.7).
- **Idézetek / kiemelt mondatok:** szerif kiegészítő font (pl. **Fraunces**, **Source Serif** vagy **Newsreader**) a mérnöki precizitás és a hagyomány érzékeltetésére.
- **Számok / dátumok:** tabular-nums, esetleg monospace (pl. **JetBrains Mono**) finom hatásként a "mérnöki" karakterhez.

### Vizuális motívumok (finoman, soha nem harsányan)

1. **Láng sziluett:** a logóból kiinduló, absztrahált láng-formavilág — vékony vonalas, SVG illusztrációként, halvány opacitással háttérelemként vagy szekció-elválasztóként.
2. **Mérnöki blueprint vonalak:** vékony, pontosan szerkesztett geometriai vonalrajzok (pl. tűzszakasz-határok absztrakciója, alaprajzi részletek halvány körvonala) háttér-textúraként, **5–8% opacitással**.
3. **Nemzeti utalás:** egy vékony, vízszintes piros-fehér-zöld gradiens csík (pl. a hero alsó szegélyén, vagy a footer fölött) — sehol másutt ne ismétlődjön zászlószerűen.
4. **Tűzoltó-mérnöki kettősség:** a hero szekcióban két finom vizuális réteg — egyrészt egy **operatív tűzoltó** (sisak, sugár, lángok absztrahálva, fekete-fehér vagy duotone), másrészt egy **tervezőasztal / alaprajz / mérnöki rajz** réteg. A kettő együtt jeleníti meg a szakma két oldalát: a tüzet eloltó hős és a tüzet előre megtervezve elkerülő mérnök.
5. **Textúra:** finom papír- vagy lenvászon-textúra a világos szekciókban (1–2% noise overlay), hogy ne legyen steril a felület.
6. **Mozgás:** csak nagyon visszafogott, tartalomalapú animációk — scroll-trigger fade-in, a hero lángjának lassú, alig észrevehető pulzálása. **Nincs hero-videó autoplay, nincs parallax túlzás.**

-----

## Oldal-szerkezet (szekciók sorrendben)

### 1. Navigáció (sticky, áttetsző háttér scroll után)

- Bal oldalon: MTEF logó (a megadott láng-logó kicsinyítve)
- Középen / jobbra: `Rólunk` · `Alapítók` · `Céljaink` · `Közlemény` · `Kapcsolat`
- Jobb szélen: kis CTA gomb — `Kapcsolat` (szolid piros, fehér felirat, kerekített sarok)

### 2. Hero szekció (full viewport magasság)

- **Háttér:** világos, törtfehér alap. Bal oldalon halvány duotone tűzoltó-fotó (sisakos tűzoltó hátulról, lángok), jobb oldalon halvány mérnöki vonalrajz / alaprajzi kompozíció. A két réteg középen finoman találkozik — szimbolizálva a fórum egyesítő szerepét.
- **Felül kicsi felirat:** `KÖZLEMÉNY · BUDAPEST · 2026. MÁJUS 4.` (uppercase, tracking-wide, kis méret, szürke)
- **Főcím (H1):** *"Megalakult a Magyar Tűzvédelmi Egyeztető Fórum."* — nagy, bold, fekete, 2-3 sorban tördelve.
- **Alcím (lead):** *"A hazai tűzvédelem hat meghatározó civil szakmai szervezete egységes platformot hozott létre a magyarországi tűzvédelem modernizációjáért, az emberi élet és a vagyonbiztonság védelméért."* — 18-20px, szürke, nyugodt sortávval.
- **CTA-gombok (kettő):**
  - Elsődleges (kitöltött piros): `A teljes közlemény` → görget a közlemény szekcióhoz
  - Másodlagos (outline): `Kapcsolat felvétele`
- **Hero alatti finom elem:** egy vékony piros-fehér-zöld gradiens vonal, alatta apró felirat: *"Kelt Szent Flórián napjának előestéjén, 2026. május 3-án."*

### 3. "Mit jelent ez?" — bevezető szekció (világos háttér)

Egy rövid, 2-3 mondatos közérthető összefoglaló a fórum lényegéről — **nem hivatalos közleményi nyelven**, hanem barátságosan, érthetően:

> *"A magyar tűzvédelem évek óta küzd a széttagoltsággal. Tűzoltók, mérnökök, építészek, vállalkozók és kutatók eddig külön-külön dolgoztak ugyanazon a célon: hogy kevesebb tűz keletkezzen, és ahol mégis, ott kevesebb kár essen. A Magyar Tűzvédelmi Egyeztető Fórum ezt változtatja meg — egy asztalhoz hívja a szakma minden szereplőjét."*

Háttérben: halvány, vékony vonalakkal rajzolt épület-alaprajz egy láng-sziluettel kombinálva.

### 4. Alapító szervezetek — kártyás grid

Hat egyenlő méretű, fehér hátterű, finom árnyékos kártya, **3×2 desktop / 1 oszlop mobil** elrendezésben. Mindegyik kártyán:

- A szervezet logója (a megadott infografikán látható módon)
- A szervezet teljes neve
- 1 mondatos szerepleírás (pl. a Mérnöki Kamaránál: *"A tűzvédelmi tervezés szabályozási és szakmai képviselete."*)

A hat alapító:

1. **Magyar Tűzoltó Szövetség**
2. **Magyar Mérnöki Kamara** — Tűzvédelmi Tagozat
3. **Magyar Építész Kamara** — Tűzvédelmi Tagozat
4. **TSZVSZ Magyar Tűzvédelmi Szövetség**
5. **Építési Vállalkozók Országos Szakszövetsége** — Tűzvédelmi Tagozat
6. **Tűzvédelmi Mérnökök Közhasznú Egyesülete**

Szekció-cím: *"Hat szervezet, egy közös ügy"*
Alcím: *"Az alapítók 2025 őszén együttműködési megállapodást írtak alá. Ennek szerves folytatásaként 2026. április 29-én megalakították az MTEF-et."*

### 5. Céljaink — három fő pillér (világos háttér, ikonokkal)

Három oszlop, mindegyikben egy nagy, vékony vonalas SVG ikon (saját rajzú, nem stock), cím és 2-3 mondatos magyarázat:

1. **🎯 Modernizáció** — *"A magyarországi tűzvédelem megújítása az emberi élet és a vagyonbiztonság javításáért. A fejlesztés nemzetgazdasági előnyökkel jár, és a fenntarthatóságot is szolgálja."*
2. **🏛️ Szakmai párbeszéd** — *"Eltökélt szándékunk a kormányzati munka támogatása. Kezdeményezzük a Kormányzat és az MTEF közötti szakmai párbeszéd mielőbbi elindítását."*
3. **🤝 Összehangolás** — *"A tűzvédelem három hagyományos alappillérének — a tűzmegelőzésnek, a tűzoltásnak és a tűzesetek vizsgálatának — összehangolt működtetése."*

### 6. A tűzvédelem három alappillére — vizuális szekció

Sötét háttér (antracit `#1A1D21`), fehér szöveg, hátul nagyon halvány lángtextúra. Három blokk vízszintesen, nagy számokkal (01, 02, 03), egymást követő logikai sorrendben:

- **01 · Tűzmegelőzés** — *"Mielőtt baj történne. Tervezés, szabályozás, oktatás, kockázatelemzés."*
- **02 · Tűzoltás** — *"Amikor mégis baj történik. Operatív beavatkozás, mentés, kárcsökkentés."*
- **03 · Tűzesetvizsgálat** — *"Hogy tanuljunk belőle. Okfeltárás, adatgyűjtés, visszacsatolás a megelőzésbe."*

A három blokkot vékony piros vonal köti össze — szimbolizálva a kör visszacsatolódását.

### 7. A teljes közlemény (hivatalos szekció)

Világos, törtfehér háttér, középre igazított, max-width ~720px, könnyen olvasható tördelés. Stílusa egy modern szerkesztőségi cikk vagy hivatalos közlemény (referencia: NYT op-ed, hvg.hu hosszú cikk).

**Felül:**

- Kis felirat: `HIVATALOS KÖZLEMÉNY`
- Cím: *"Megalakult a Magyar Tűzvédelmi Egyeztető Fórum"*
- Dátum + helyszín: *"Budapest, 2026. május 4., hétfő · 10:50"*
- Forrás: *"Nemzeti Közleménytár"*

**Tartalom (pontos szöveg, szépen tördelve, esetleg drop cap-pel az első bekezdésben):**

> Magyarországi tűzvédelem meghatározó civil szakmai szervezetei kezdeményezik a Kormányzat és a Magyar Tűzvédelmi Egyeztető Fórum közötti szakmai párbeszéd mielőbbi elindítását.
>
> A magyarországi tűzvédelem meghatározó civil szakmai szervezetei 2025. őszén együttműködési megállapodást írtak alá. Ennek szerves folytatásaként 2026. április 29-én
>
> – a Magyar Tűzoltó Szövetség,
> – a Magyar Mérnöki Kamara (kapcsolattartó: Tűzvédelmi Tagozat),
> – a Magyar Építész Kamara (kapcsolattartó: Tűzvédelmi Tagozat),
> – a TSZVSZ Magyar Tűzvédelmi Szövetség,
> – az Építési Vállalkozók Országos Szakszövetsége (kapcsolattartó: Tűzvédelmi Tagozat) és
> – a Tűzvédelmi Mérnökök Közhasznú Egyesülete
>
> megalakították a Magyar Tűzvédelmi Egyeztető Fórumot, amelynek koordinátora **Gyapjas János** (email: info@mtef.hu).
>
> A Magyar Tűzvédelmi Egyeztető Fórum célja a magyarországi tűzvédelem modernizációja, az emberi élet védelmének és a vagyonbiztonság javítása. Az előző években a tűzvédelem aggasztóan elhanyagolt terület volt, amelynek fejlesztése jelentős nemzetgazdasági előnyökkel jár, javítja a gazdasági versenyképességet, valamint a fenntarthatósági célokat is szolgálja.
>
> A magyarországi tűzvédelmi helyzet megújítását a jelenlegi szabályozási környezet és államigazgatási struktúra akadályozza.
>
> Eltökélt szándékunk a hazai tűzvédelem megújítása és a kormányzati munka támogatása. Nélkülözhetetlen a tűzvédelem három hagyományos alappillérének: a tűzmegelőzésnek, a tűzoltásnak és a tűzesetek vizsgálatának összehangolása, az ehhez szükséges adatgyűjtések, vizsgálatok, szakmai párbeszédek és egyeztetések lefolytatása.
>
> A kormányzati döntések megalapozásához különösen fontosnak tartjuk Magyarország tűzvédelmi problématérképének elkészítését az ország ma még hiányzó tűzvédelmi stratégiájának megalkotásához.
>
> Közös céljaink eléréséhez kezdeményezzük a Kormányzat és a Magyar Tűzvédelmi Egyeztető Fórum közötti szakmai párbeszéd mielőbbi elindítását.
>
> *Kelt Szent Flórián napjának előestéjén, 2026. május 3-án.*

**A közlemény alatt:** kis "Letöltés PDF-ben" link finom ikonnal + "Megosztás" gombsor (LinkedIn, Facebook, link másolása).

### 8. Koordinátor / Kapcsolat szekció

Egyszerű, tiszta blokk fehér alapon:

- Bal oldalon: kis kör portré-helykitöltő (vagy monogram-avatar `GJ`-vel, ha nincs fotó)
- Jobb oldalon:
  - `Koordinátor`
  - **Gyapjas János** (nagy, bold)
  - `info@mtef.hu` (kattintható mailto link)
  - 1 mondat: *"Sajtó- és szakmai megkeresések, együttműködési javaslatok."*

### 9. Footer

- Sötét antracit háttér
- Felül: az MTEF logó + a slogan: *"Együttműködés · Szakmaiság · Felelősség · Biztonság"* (a megadott infografikán is ez szerepel — ezt használd fel!)
- Középen: a hat alapító szervezet kicsinyített logósora (egysoros)
- Alul, kicsiben: copyright `© 2026 Magyar Tűzvédelmi Egyeztető Fórum` · `info@mtef.hu` · `Adatvédelem` · `Impresszum`
- Egészen alul: vékony piros-fehér-zöld gradiens vonal a footer aljára.

-----

## Tartalmi és hangnemi irányelvek

- **Hangnem:** szakmailag pontos, de **nem szárazon hivatalos**. Olyan, mintha egy okos, tájékozott szakember magyarázná el a barátjának, miért fontos ez. Tegezés sehol — **maradj az általános, személytelen formánál** (mi, célunk, kezdeményezzük).
- A hivatalos közlemény szövegét **szóról szóra** kell hozni a 7. szekcióban — ezt nem írjuk át.
- A többi szekcióban tömörítsd, fogalmazd át közérthetően.
- Kerüld a klisét: `"a biztonság mindannyiunk közös ügye"`, `"a jövőért dolgozunk"` stb. Helyette konkrét, mérhető, szakmai megfogalmazások.

-----

## Technikai specifikáció

- **Framework:** egyetlen `index.html` fájl, **Tailwind CSS** CDN-ről behúzva, vagy single-file React komponens (`.jsx`) Tailwinddel — a választható.
- **Reszponzivitás:** mobile-first, töréspontok 640 / 768 / 1024 / 1280px.
- **Hozzáférhetőség:** WCAG AA kontraszt, szemantikus HTML (`<header>`, `<main>`, `<section>`, `<article>`, `<footer>`), megfelelő `aria-label`-ek, fókuszállapotok.
- **Teljesítmény:** semmi nehéz JS, minden vizuális elem SVG-ben (a láng-logó, az ikonok, a háttérvonalak). Képek `loading="lazy"`-vel.
- **SEO alap:**
  - `<title>`: *Magyar Tűzvédelmi Egyeztető Fórum (MTEF)*
  - `<meta description>`: *Hat meghatározó tűzvédelmi szakmai szervezet együttműködési platformja a hazai tűzvédelem modernizációjáért.*
  - Open Graph kép: az MTEF logó nemzeti színű lánggal, sötét háttéren.
- **Animációk:** vanilla CSS / Tailwind animation utilities, vagy minimális Framer Motion (csak ha React). Scroll-fade az egyes szekciókhoz, ne legyen több.
- **Kerüld:** localStorage / sessionStorage használatát (nem támogatott a futtatókörnyezetben), bombasztikus videó-háttereket, autoplay hangokat, 3rd-party tracker scripteket.

-----

## Asset-igények (mit használj fel a generálás során)

1. **MTEF logó:** a megadott első kép (lángforma piros-fehér-zöld átmenettel, alatta `MAGYAR TŰZVÉDELMI EGYEZTETŐ FÓRUM` felirat). SVG-ként rekonstruálva.
2. **A 6 alapító szervezet logói:** a második kép (infografika) tartalmazza ezeket — kerüld a pixeles átemelést, inkább helykitöltőként hivatkozz rájuk a kódban (`/logos/mmk.svg` stb.), és jelöld kommentben, hogy ezeket a végleges integrációkor cserélni kell.
3. **Tűzoltó-fotó (hero):** stock vagy AI-generált, duotone feldolgozással (antracit + halvány piros), alacsony opacitással háttérben. Egy hátulról fotózott tűzoltó sisakkal és palackkal, lángok előtte — épp olyan, mint a megadott infografika bal oldalán.
4. **Mérnöki rajz / blueprint:** SVG-ben rajzolt absztrakt épület-alaprajz vagy szerkezeti vázlat, tűzszakasz-határokra utaló elemekkel.

-----

## Kimenet formája

A generálás eredménye **egyetlen, futtatható, önmagában működő fájl** legyen (`index.html` vagy `App.jsx`), minden inline stílussal, SVG-vel, scripttel. A fájl megnyitásakor a teljes landing page rögtön renderelődjön, külső erőforrás-függőség nélkül (a Tailwind CDN-en kívül).

A fájl elején rövid kommentben jelöld meg:

- a komponens / oldal célját,
- a kötelező TODO-kat (pl. "Cserélni: alapítói logók a `/logos/` mappából`", "Cserélni: tűzoltó hero-fotó"),
- a használt fontokat (Google Fonts CDN linkkel az `<head>`-ben).

-----

**Cél:** olyan honlap szülessen, amelyet a fórum nyugodt szívvel megmutathat a kormányzatnak, a sajtónak és a szakmának — egyszerre tükrözze a tűzvédelmi szakma komolyságát és a fórum modern, párbeszédorientált karakterét.
