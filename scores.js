/* =====================================================================
   Fælles rangliste for alle spil (gemmes i Supabase).

   Brug i et spil (games/<mappenavn>/index.html):

     <script src="../../scores.js"></script>

     // når spillet slutter:
     gemScore("pizza-party", navn, score);

     // vis fælles top 10 i et <table>-element:
     visFaellesTop(document.getElementById("faellesTop"), "pizza-party", navn);

   Alle funktioner fejler stille: er der ingen forbindelse, gemmes scoren
   lokalt og sendes næste gang, og hentTop() giver null.
   ===================================================================== */
(function () {
  "use strict";

  // Den "publishable" nøgle må gerne være offentlig. Tabellens regler i
  // Supabase bestemmer, at man kun kan læse og tilføje scores.
  const URL = "https://uzpqgnrxitvwyeazzfin.supabase.co/rest/v1";
  const KEY = "sb_publishable_bPz2AhlylAksfjP3Vkgy7g_vCT7v4jF";
  const QUEUE_KEY = "drengene_scores_koe"; // scores der ikke kunne sendes endnu
  const TIMEOUT_MS = 6000;

  async function api(path, options = {}) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(URL + path, {
        ...options,
        signal: ctrl.signal,
        headers: { apikey: KEY, "Content-Type": "application/json", ...(options.headers || {}) },
      });
      if (!res.ok) throw new Error("Supabase svarede " + res.status);
      return res;
    } finally {
      clearTimeout(timer);
    }
  }

  function clean(spil, navn, score) {
    spil = String(spil).toLowerCase();
    if (!/^[a-z0-9-]{1,40}$/.test(spil)) throw new Error("Ugyldigt spilnavn: " + spil);
    navn = String(navn || "").trim().slice(0, 20) || "Anonym";
    score = Math.max(0, Math.min(10000000, Math.floor(Number(score) || 0)));
    return { game: spil, name: navn, score };
  }

  function loadQueue() {
    try { return JSON.parse(localStorage.getItem(QUEUE_KEY)) || []; } catch (e) { return []; }
  }
  function saveQueue(q) {
    try { localStorage.setItem(QUEUE_KEY, JSON.stringify(q.slice(-50))); } catch (e) {}
  }

  async function send(rows) {
    await api("/scores", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify(rows) });
  }

  // Sender scores, der tidligere ikke kunne sendes (fx uden internet)
  let flushing = null;
  function flushQueue() {
    if (flushing) return flushing;
    const q = loadQueue();
    if (!q.length) return Promise.resolve();
    flushing = send(q).then(() => saveQueue(loadQueue().slice(q.length))).catch(() => {})
      .finally(() => { flushing = null; });
    return flushing;
  }

  /** Gemmer en score i den fælles rangliste. Giver true hvis den blev sendt. */
  async function gemScore(spil, navn, score) {
    const row = clean(spil, navn, score);
    await flushQueue();
    try {
      await send([row]);
      return true;
    } catch (e) {
      saveQueue([...loadQueue(), row]);
      return false;
    }
  }

  /** Henter de bedste spillere i et spil: [{ name, score, last_played }] eller null ved fejl. */
  async function hentTop(spil, antal = 10) {
    try {
      const q = `?game=eq.${encodeURIComponent(spil)}&select=name,score,last_played&order=score.desc,last_played.asc&limit=${antal}`;
      return await (await api("/best_scores" + q)).json();
    } catch (e) {
      return null;
    }
  }

  /** Henter førerne i alle spil: { "pizza-party": { name, score }, ... } eller null ved fejl. */
  async function hentLedere() {
    try {
      const rows = await (await api("/best_scores?select=game,name,score&order=score.desc&limit=1000")).json();
      const ledere = {};
      for (const r of rows) if (!ledere[r.game]) ledere[r.game] = { name: r.name, score: r.score };
      return ledere;
    } catch (e) {
      return null;
    }
  }

  /** Viser den fælles top i et <table>-element. Dit eget navn markeres med class="me". */
  async function visFaellesTop(table, spil, mitNavn, antal = 10) {
    if (!table) return;
    table.innerHTML = "<tr><td>Henter fælles rangliste…</td></tr>";
    const top = await hentTop(spil, antal);
    table.innerHTML = "";
    const row = cells => {
      const tr = table.insertRow();
      for (const c of cells) tr.insertCell().textContent = c;
      if (cells.length === 1) Object.assign(tr.cells[0], { colSpan: 3 }).style.cssText = "text-align:center;width:auto";
      return tr;
    };
    if (top === null) return void row(["Kunne ikke hente den fælles rangliste lige nu"]);
    if (!top.length) return void row(["Ingen resultater endnu – vær den første!"]);
    top.forEach((e, i) => {
      const tr = row([`${i + 1}.`, e.name, e.score.toLocaleString("da-DK")]);
      if (mitNavn && e.name === mitNavn) tr.className = "me";
    });
  }

  window.gemScore = gemScore;
  window.hentTop = hentTop;
  window.hentLedere = hentLedere;
  window.visFaellesTop = visFaellesTop;

  flushQueue();
})();
