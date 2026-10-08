# Prompt til at lave et nyt spil

Kopiér alt mellem de to streger herunder ind til Claude. Udfyld afsnittet **"MIT SPIL"** nederst – resten skal du ikke røre.

---

Du skal lave et lille, sjovt browserspil til mig og mine venner. Vi konkurrerer om, hvem der får den højeste score, så spillet skal være fair, hurtigt at gå til og sjovt at prøve igen og igen.

## Faste krav (skal altid overholdes)

**Teknik**
- Spillet skal ligge i én enkelt `index.html`-fil med al HTML, CSS og JavaScript inline. Ingen build-step, ingen frameworks der kræver installation, ingen server.
- Læg filen i mappen `games/<spillets-navn>/index.html` i dette repo (navnet med små bogstaver og bindestreger, fx `games/hop-frø/index.html`).
- Spillet skal virke ved blot at åbne filen i en browser og når det hostes som statisk side (fx GitHub Pages).
- Brug gerne `<canvas>` til grafik. Billeder/lyde skal enten tegnes i kode, laves med Web Audio API eller være emojis – ingen eksterne filer.

**Både mobil og computer**
- Spillet skal kunne spilles fuldt ud på både telefon (touch) og computer (tastatur og/eller mus).
- Styringen skal føles naturlig på begge: fx tryk/swipe på mobil og piletaster/mellemrum på computer. Vis kort på startskærmen, hvordan man styrer på den enhed, man bruger.
- Layoutet skal tilpasse sig skærmen (både stående og liggende telefon) uden at man skal zoome eller scrolle. Brug `<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">`.
- Forhindr at siden scroller, zoomer eller markerer tekst, når man trykker i spillet (`touch-action: none`, `user-select: none` osv.).
- Knapper skal være store nok til at ramme med en tommelfinger (mindst ca. 44×44 px).
- Spillet skal køre lige hurtigt uanset skærmens opdateringshastighed (brug delta-tid i game loop, ikke antal frames).

**Spilletid**
- Et spil må højst vare **ca. 2 minutter**. Enten med en fast nedtælling, eller ved at sværhedsgraden stiger så et normalt spil slutter inden for den tid.
- Vis tydeligt den resterende tid (hvis der er en timer).
- Der skal være en kort startskærm og en slutskærm. Man skal kunne starte et nyt spil med ét tryk.

**Score og rangliste**
- Spillet skal have en klar, tal-baseret score, der vises hele tiden under spillet.
- Højere score = bedre. Det skal være tydeligt på startskærmen, hvordan man får point.
- Scoren skal afhænge af evner, ikke held: brug evt. en fast "seed" til tilfældighed, så alle får den samme bane/rækkefølge, og alle spil dermed er fair at sammenligne.
- På startskærmen skal man kunne skrive sit navn (huskes til næste gang via `localStorage`).
- På slutskærmen skal der vises:
  - Den opnåede score og evt. et par sjove statistikker (fx "længste combo").
  - En lokal top 10 over de bedste resultater på denne enhed (navn, score, dato), gemt i `localStorage`.
  - En knap **"Kopiér resultat"**, der kopierer en kort tekst til udklipsholderen, som vi kan sende i vores gruppechat, fx:
    `🎮 Hop Frø – Mads: 1.240 point (bedste: 1.580)`
    Brug også Web Share API (`navigator.share`) på telefoner, hvis den findes.
- Gør det svært at snyde ved et uheld (fx må scoren ikke kunne stige, mens spillet er pauset eller i baggrunden).

**Kvalitet**
- Spillet skal være til at forstå på 10 sekunder uden en lang forklaring.
- Al tekst i spillet skal være på **dansk**.
- Spillet skal pause automatisk, hvis man skifter fane eller app.
- Lyd skal kunne slås fra med en knap, og lyden må først starte efter brugerens første tryk (krav i mobilbrowsere).
- Hold koden overskuelig og kommentér de vigtigste dele, så vi selv kan pille ved den.

## Fremgangsmåde

1. Læs beskrivelsen i "MIT SPIL" nedenfor. Hvis noget vigtigt er uklart, så stil mig højst 3 korte spørgsmål – ellers træf selv fornuftige valg og fortæl hvilke.
2. Byg spillet.
3. Test at det virker: tjek gerne i en headless browser både i mobil-størrelse (fx 390×844 med touch) og desktop-størrelse (fx 1280×800), og at et spil faktisk slutter inden for ca. 2 minutter.
4. Tilføj spillet til listen i `README.md` med navn, en kort beskrivelse og link til mappen.
5. Commit og push ændringerne.
6. Giv mig til sidst en kort opsummering: hvordan spillet spilles, hvordan man får point, og eventuelle ting du var i tvivl om.

## MIT SPIL

**Spillets navn:**
<!-- fx "Hop Frø" -->

**Hvad går spillet ud på?**
<!-- Beskriv idéen med dine egne ord. Fx: "Man er en frø, der skal hoppe mellem åkander uden at falde i vandet." -->

**Hvordan får man point?**
<!-- Fx: "1 point per hop, bonus for at ramme midten, mister liv hvis man falder i." -->

**Hvordan skal man styre?**
<!-- Fx: "Tryk for at hoppe. Jo længere man holder, jo længere hopper man." Lad stå tom hvis Claude må vælge. -->

**Stemning og udseende:**
<!-- Fx: "Retro pixel-stil", "Neonfarver", "Tegneserieagtigt", "Mørkt og uhyggeligt". -->

**Andre ønsker eller sjove detaljer:**
<!-- Fx: power-ups, bosser, indforståede jokes fra vennegruppen, lyde, særlige regler. -->

---
