# Regler for dette repo

Repoet indeholder små browserspil, som en vennegruppe laver med Claude og konkurrerer i. Spillene hostes med GitHub Pages fra `main`: https://gaardee.github.io/drengene-games/

## Nyt spil: guid os igennem med spørgsmål

Når nogen vil lave et nyt spil (også hvis de bare skriver "lav et spil", eller indsætter prompten fra `PROMPT.md` med huller i), skal du **ikke** gå i gang med at bygge med det samme. Tag os i stedet med igennem de beslutninger, der skal træffes, som en samtale:

1. **Spørg først, hvem der laver spillet.** Fx: "Hvem er med til at lave spillet i dag? Skriv jeres navne." Vent på svaret, før du går videre.
2. **Omdøb samtalen med navnene**, så snart du har dem, fx `Mads & Jonas`. I Claude Code på nettet/appen gør du det med værktøjet `set_session_title` (claude-code-remote). Hent først sessionens id med `get_session` uden `session_id`. Hvis værktøjet ikke findes (fx lokalt i terminalen), så bed os om at skrive `/rename Mads & Jonas`. Når spillet har fået et navn, omdøber du igen til fx `Mads & Jonas – Hop Frø`.
3. **Gå derefter beslutningerne igennem, ét emne ad gangen.** Stil korte spørgsmål, og giv altid 2-4 konkrete forslag, vi kan vælge imellem (brug gerne `AskUserQuestion`). Vi kan også svare "vælg selv". Spring de punkter over, som vi allerede har besvaret:
   - **Idé:** Har I en idé, eller vil I have nogle forslag? (Kom med 3 forskellige, sjove idéer, hvis vi ikke har en.)
   - **Navn:** Hvad skal spillet hedde? (Foreslå navne. Fortæl hvilket mappenavn det giver, fx `hop-froe`.)
   - **Point:** Hvordan får man point, og hvad gør det svært?
   - **Styring:** Hvordan styrer man på telefon og på computer?
   - **Spilletid:** Fast nedtælling, eller bliver det sværere, indtil man taber?
   - **Stemning og udseende:** Fx retro pixel, neon, tegneserie, uhyggeligt.
   - **Én spiller eller multiplayer?**
   - **Ekstra:** Power-ups, bosser, lyde, indforståede jokes fra vennegruppen?
4. **Opsummér planen** i en kort punktliste, og spørg om den er godkendt, før du bygger.
5. **Byg og test spillet** efter kravene i `PROMPT.md`. Fortæl derefter kort, hvad der er lavet, og spørg om noget skal ændres, før du opretter pull requesten.
6. Skriv navnene på dem, der har lavet spillet, i pull requestens beskrivelse ("Lavet af: …").

Hold tonen let og hurtig. Det skal føles som at lave spillet sammen, ikke som at udfylde en formular.

## Git: altid branch + pull request

Flere personer laver spil samtidig, så for at undgå konflikter gælder:

- **Push aldrig direkte til `main`.** Alt arbejde laves på en branch og kommer ind i `main` via en pull request.
- Har sessionen fået tildelt en branch, så brug den. Ellers opret en ny branch fra den nyeste `main` med navnet `spil/<spillets-mappenavn>` (fx `spil/hop-froe`). Én branch og én PR per spil.
- Start altid fra den nyeste `main` (`git fetch origin main` først).
- Når arbejdet er færdigt: commit, push branchen og **opret en pull request mod `main`** med en kort beskrivelse af spillet, hvordan man styrer og hvordan man får point. Merge ikke selv PR'en – det gør en af os.
- Hvis PR'en får konflikter med `main`: merge den nyeste `main` ind i branchen og løs konflikten. Ingen force-push.

## Hold dig til din egen mappe

- Et nyt spil ligger udelukkende i sin egen mappe: `games/<mappenavn>/`. Mappenavnet må kun indeholde små bogstaver a-z, tal og bindestreger (ingen æ/ø/å eller mellemrum).
- Mappen skal indeholde:
  - `index.html` – hele spillet i én fil.
  - `meta.json` – bruges af forsiden til at vise spillet:
    ```json
    { "navn": "Hop Frø", "emoji": "🐸", "beskrivelse": "Hop mellem åkanderne uden at falde i vandet." }
    ```
- Forsiden (`index.html` i roden) finder selv alle spil i `games/`, så den skal **ikke** redigeres, når der tilføjes et spil. Rør heller ikke `README.md`, `PROMPT.md`, `CLAUDE.md` eller andres spilmapper, medmindre opgaven udtrykkeligt handler om dem.

## Fælles rangliste (Supabase)

- `scores.js` i roden gemmer og henter scores fra Supabase. Alle spil bruger den via `<script src="../../scores.js"></script>`, med `gemScore(...)` og `visFaellesTop(...)` (se kommentaren øverst i filen).
- Spilnavnet, der sendes, skal være præcis det samme som spillets mappenavn. Forsiden bruger det til at vise, hvem der fører.
- Nøglen i `scores.js` er den offentlige "publishable" nøgle og må gerne ligge i repoet. Læg **aldrig** en `service_role`/secret-nøgle i repoet.
- Ret ikke i `scores.js` som en del af et nyt spil. Ændringer af den hører til i en separat PR.

## Krav til spillene

Se `PROMPT.md` for de faste krav (én HTML-fil, virker på mobil og computer, max ca. 2 minutters spilletid, score + "Kopiér resultat", dansk tekst).
