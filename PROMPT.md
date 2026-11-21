# Prompt til at lave et nyt spil

Det nemmeste er bare at starte en ny Claude Code-session i dette repo og skrive **"Vi vil lave et nyt spil"**. Så spørger Claude først, hvem I er, og guider jer derefter igennem alle beslutningerne (se `CLAUDE.md`).

Vil du hellere give det hele på én gang, kan du kopiere alt mellem de to streger herunder ind til Claude og udfylde afsnittet **"MIT SPIL"** nederst. Det, du lader stå tomt, spørger Claude ind til.

---

Du skal lave et lille, sjovt browserspil til mig og mine venner. Vi konkurrerer om, hvem der får den højeste score, så spillet skal være fair, hurtigt at gå til og sjovt at prøve igen og igen.

## Faste krav (skal altid overholdes)

**Teknik**
- Spillet skal ligge i én enkelt `index.html`-fil med al HTML, CSS og JavaScript inline. Ingen build-step, ingen frameworks der kræver installation, ingen server. Eneste undtagelse er den fælles rangliste: `<script src="../../scores.js"></script>`.
- Læg filen i mappen `games/<mappenavn>/index.html` i dette repo. Mappenavnet må kun have små bogstaver a-z, tal og bindestreger (fx `games/hop-froe/index.html`).
- Læg også en `games/<mappenavn>/meta.json` med spillets navn, en emoji og en kort beskrivelse (se `CLAUDE.md`). Forsiden bruger den til at vise spillet.
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
  - Den **fælles rangliste** for hele vennegruppen: kald `gemScore("<mappenavn>", navn, score)` når spillet slutter, og vis derefter top 10 med `visFaellesTop(tabelElement, "<mappenavn>", navn)` (se toppen af `scores.js`). Gem kun én gang per spil, og kun når et spil er spillet færdigt.
  - En lokal top 10 over de bedste resultater på denne enhed (navn, score, dato), gemt i `localStorage`. Den virker også uden internet.
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

## Multiplayer (kun hvis "MIT SPIL" beder om det)

Spil kan godt have flere spillere på hver sin enhed. Det kører over vores egen WebSocket-server: **Laravel Reverb på `ws.realtime.gaarde.it`** (repo: `gaardee/realtime-gaming`). Der skal ikke installeres noget, der skal ikke bruges noget bibliotek, og der gemmes intet på serveren. `games/pizza-party-multi/index.html` er et færdigt eksempel. Genbrug dens `Net`-objekt (en lille Reverb-klient på ca. 60 linjer) og dens opbygning.

```js
// Serveren (nøglen er offentlig og må gerne stå i spillet)
const RT = { host: "ws.realtime.gaarde.it", port: 443, key: "833bf8063cc73883e1bb79b99e48e33f" };
```

**Sådan skal det bygges**
- **Rum med kode:** Én spiller trykker "Opret rum" og får en kode på 4 bogstaver og et link (`…/#KODE`). De andre skriver koden eller åbner linket. Der er en lobby, hvor man kan se, hvem der er med, og hvor værten trykker "Start".
- **Værten bestemmer:** Værtens browser kører det fælles spil (fjender, ting man kan samle op, point, liv, tid) og afgør, hvem der kom først. Hver spiller styrer selv sin egen figur lokalt, så det føles hurtigt, og sender sin position til værten.
- **Kanaler:**
  - Én fælles kanal pr. rum (fx `<mappenavn>-KODE`), hvor **kun værten sender** (lobby, start, spillets tilstand, slut).
  - Én kanal pr. spiller (fx `<mappenavn>-KODE-<spiller-id>`), som **kun den spiller og værten** er med på. Her sender spilleren sin position, så den ikke går ud til alle de andre.
  - Kanalnavne må kun indeholde bogstaver, tal og `-_=@,.;`. Brug altid spillets mappenavn i kanalnavnet, så spil ikke blander sig med hinanden.
- **Send sjældent og glid blødt:** Send ca. 6-8 gange i sekundet (ikke hver frame), brug hele tal i beskederne, og lad de andre spilleres figurer glide blødt hen mod den seneste position.
- **Undtagelser fra de faste krav:**
  - Kun værten kan pause, fordi en pause gælder for alle. Skifter værten app, pauses spillet for alle. Skifter en anden spiller app, står deres figur bare stille.
  - Hver spiller gemmer sin egen score med `gemScore(...)`. Slutskærmen viser også stillingen for runden.
  - Spillere, der forsvinder midt i spillet, må ikke få spillet til at gå i stå for de andre.
- **Kun på GitHub Pages:** Serveren tager kun imod spil fra `gaardee.github.io` (også PR-previews). Åbnes spillet lokalt, kan man ikke spille multiplayer. Vis en tydelig besked om det i stedet for at vente forgæves.

**Serverens grænser**

| | Grænse |
|---|---|
| Beskeder pr. forbindelse | max 30 pr. sekund (spillene bruger ca. 8) |
| Størrelse pr. besked | max 10 KB (Pizza Party Multi med 11 spillere bruger under 1 KB) |
| Samtidige forbindelser | max 500 for alle spil tilsammen |
| Beskeder i alt | ingen grænse |

Når en spiller abonnerer på mange kanaler på én gang, tæller det også med i de 30 pr. sekund. Hold det under ca. 20 kanaler pr. spiller.

**Test:** Serveren afviser `localhost`, så i Playwright skal spillet ligge på `https://gaardee.github.io/drengene-games/...`. Brug `context.route("https://gaardee.github.io/**", …)` til at svare med de lokale filer, og erstat `scores.js` med en tom udgave, så testen ikke gemmer rigtige scores. Åbn 3 eller flere browser-kontekster (én vært, resten spillere, blandet mobil og desktop), og tjek lobby, start, at point tælles, slutskærm og "ny runde".

## Fremgangsmåde

1. Spørg først, hvem der laver spillet, og omdøb samtalen med deres navne (se "Nyt spil" i `CLAUDE.md`).
2. Læs "MIT SPIL" nedenfor, og guid os igennem de punkter, der er tomme eller uklare: ét emne ad gangen, med 2-4 forslag vi kan vælge imellem. Opsummér planen, og få den godkendt, før du bygger.
3. Byg spillet.
4. Test at det virker: tjek gerne i en headless browser både i mobil-størrelse (fx 390×844 med touch) og desktop-størrelse (fx 1280×800), og at et spil faktisk slutter inden for ca. 2 minutter.
5. Følg git-reglerne i `CLAUDE.md`: arbejd på en branch (aldrig direkte på `main`), rør kun filer i din egen spilmappe, og push branchen.
6. Opret en pull request mod `main`. Når en af os har merget den, ligger spillet på `https://gaardee.github.io/drengene-games/games/<mappenavn>/` og dukker selv op på forsiden.
7. Giv mig til sidst et link til pull requesten og en kort opsummering: hvordan spillet spilles, hvordan man får point, og eventuelle ting du var i tvivl om. Skriv navnene på dem, der har lavet spillet, i pull requesten.

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

**Multiplayer?**
<!-- Lad stå tom for et almindeligt spil for én spiller. Eller fx: "Ja, op til 4 spillere på hver sin telefon – vi spiller om, hvem der får flest point." -->

**Andre ønsker eller sjove detaljer:**
<!-- Fx: power-ups, bosser, indforståede jokes fra vennegruppen, lyde, særlige regler. -->

---
