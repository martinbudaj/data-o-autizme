# data-o-autizme dashboard

Vite + React dashboard s grafmi (Recharts), ktorý sa embeduje do cudzej stránky
cez `<div id="dashboard">`. Nasadzuje sa na GitHub Pages pod `/data-o-autizme/`.

## Štruktúra

```
data/            JSON dáta pre grafy (mimo src/, aby sa dali ľahko editovať/generovať)
src/
  main.jsx       mount do #dashboard
  App.jsx        layout stránky (header, KPI karty, sekcie s grafmi)
  dashboard.css  všetky štýly, scopované pod #dashboard
  components/    jednotlivé grafy a UI kúsky
```

## Dáta

- Každý JSON súbor v `/data` je objekt keyovaný rokom (`"2024"`, `"2025"`, ...),
  aby fungoval prepínač rokov v hlavičke (`YearToggle`).
- `data/summary.json` — KPI hodnoty (počet, medziročný nárast, prevalencia, najpočetnejšia veková skupina).
- `data/ageDistribution.json`, `data/regionDistribution.json`, `data/diagnosisStructure.json` —
  dáta pre jednotlivé grafy, každý záznam `{ label, count/percent }`.
- `data/insuranceHistory.json` — výnimka z `{ "<rok>": [...] }` tvaru: nie je viazaná
  na ročný prepínač, ale nesie celú časovú radu `2015–2025` naraz (pre hlavný graf
  `TrendChart`). Tvar `{ years: [...], insurers: [{ id, name, color, values: [...] }] }`,
  kde `values[i]` zodpovedá `years[i]`.
- Komponenty dáta importujú priamo (`import x from '../data/x.json'`) — žiadny fetch,
  žiadny API layer. Aktuálne dáta sú ukážkové/orientačné, nie oficiálna štatistika.

## Ako pridať nový graf

1. Priprav dáta ako nový JSON v `/data`, ideálne v tvare `{ "<rok>": [...] }`
   ak má graf reagovať na prepínač rokov.
2. Vytvor komponent v `src/components/`, ktorý dostane dáta cez props a vyrenderuje
   Recharts komponent (viď `AgeChart.jsx` / `RegionChart.jsx` ako predlohu).
3. V `App.jsx` importuj dáta aj komponent a pridaj novú `<section className="dashboard__section">`.
4. Štýly pridávaj do `src/dashboard.css` a vždy ich píš pod selektorom `#dashboard ...`
   (pozri nižšie prečo).

## CSS scoping — dôležité

Táto appka sa embeduje do cudzej stránky, takže:

- Žiadne globálne resety (`*`, `body`, `html`, ...) mimo `#dashboard`.
- Každé pravidlo v `dashboard.css` musí začínať `#dashboard ...`, aby nič neuniklo
  a nerozbilo hosťujúcu stránku.
- `App.jsx` nevykresľuje vlastný `<div id="dashboard">` — ten je už v `index.html`
  (resp. v hostiteľskej stránke pri embede) a React sa doň iba mountuje cez `main.jsx`.
- Platí to aj opačným smerom: hosťujúca stránka môže mať vlastné neskopované
  pravidlá na holé tagy (napr. kompasio.sk má v `style.css` `section { float: left;
  padding: 100px 0; ... }` pre svoje vlastné sekcie), ktoré nám bez varovania
  rozbijú layout zvnútra. Preto `dashboard.css` obsahuje defenzívny reset
  (`#dashboard section, #dashboard header { float: none; position: static; ... }`),
  ktorý vďaka ID selektoru prebije hostiteľove pravidlá na holé tagy bez ohľadu
  na poradie štýlov v `<head>`. Ak pridáš komponent s ďalším sémantickým tagom
  (napr. `<article>`, `<aside>`), over si na cieľovej stránke, či ho hostiteľ
  tiež neštyluje, a pridaj mu rovnaký reset.

## Build

- `base: '/data-o-autizme/'` vo `vite.config.js` — zodpovedá GitHub Pages ceste repa.
- `build.rollupOptions.output` má natvrdo zafixované názvy výstupov bez hashov:
  `assets/app.js` a `assets/app.css`. Vďaka tomu sa dá appka embedovať cez stabilnú
  URL, ktorá sa pri každom novom builde nemení.
  - Pozor: ak by v budúcnosti pribudol `import()` dynamický import a vznikol by
    ďalší JS chunk, kolidoval by s `assets/app.js` a build zlyhá — v takom prípade
    buď dynamický import odstráň, alebo uprav `chunkFileNames`.

Príkazy:

```
npm install   # inštalácia (žiadny package-lock.json zatiaľ nie je commitnutý)
npm run dev   # lokálny dev server
npm run build # produkčný build do dist/
```

## Deploy

`.github/workflows/deploy.yml` pri každom pushi do `main`:

1. `npm install` + `npm run build`
2. build z `dist/` sa nahrá cez `actions/upload-pages-artifact`
3. `actions/deploy-pages` nasadí na GitHub Pages

V repe treba mať v **Settings → Pages** nastavený zdroj `GitHub Actions`.

`dist/index.html` (výstup buildu) obsahuje kompletnú HTML stránku s `<div id="dashboard">`
a scriptom, takže výsledok sa dá otvoriť priamo na GitHub Pages URL repa aj bez embedu —
slúži to na rýchle vizuálne otestovanie pred embedovaním do cieľovej stránky.
