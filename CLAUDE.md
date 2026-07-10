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
- `data/ageBreakdown.json`, `data/regionBreakdown.json` — rovnaká časová rada, ale
  rozpad počtu poistencov po poisťovni podľa vekovej skupiny/kraja. Tvar
  `{ years: [...], ageGroups/regions: [...], insurers: { "<insurerId>": { "<rok>": [...] } } }`,
  kde `values[i]` zodpovedá `ageGroups[i]`/`regions[i]`. Slúžia ako doplnkové filtre
  k `TrendChart` (pozri nižšie) — nejde o joint distribúciu, vek a kraj sú len dve
  samostatné 2-rozmerné tabuľky voči poisťovni a roku.
- Komponenty dáta importujú priamo (`import x from '../data/x.json'`) — žiadny fetch,
  žiadny API layer. Aktuálne dáta sú ukážkové/orientačné, nie oficiálna štatistika.

## TrendChart — filtrovanie podľa poisťovne/veku/kraja

`TrendChart.jsx` renderuje tri nezávislé multi-select filtre (`FilterGroup.jsx`):
poisťovne (vždy rozbalené, len 3 položky), veková štruktúra a kraje (obe
zbalené defaultne — "všetky", rozbaľujú sa tapnutím kvôli množstvu položiek
na mobile). V každej skupine musí ostať vybraná aspoň jedna položka.

Keďže `ageBreakdown.json` a `regionBreakdown.json` sú dve oddelené 2-rozmerné
tabuľky (vek×poisťovňa×rok a kraj×poisťovňa×rok), **nemáme reálnu jointovú
distribúciu** vek×kraj. Výpočet v `TrendChart` preto:
- ak je obmedzený len vek ALEBO len kraj → presný súčet priamo z príslušnej tabuľky,
- ak sú obmedzené oba naraz → súčin (odhad za predpokladu štatistickej nezávislosti
  vek/kraj v rámci danej poisťovne a roka) a pod grafom sa zobrazí `.dashboard__note`
  upozorňujúca, že ide o orientačný odhad.

Ak pribudnú reálne kombinované dáta (vek×kraj×poisťovňa×rok), tento fallback
na súčin by sa dal nahradiť presným výpočtom.

## AgeStructureChart — 100% skladaný plošný graf

`AgeStructureChart.jsx` (hneď pod `TrendChart`) ukazuje vývoj vekovej štruktúry
pacientov v čase (2015–2025) ako percentuálny podiel, nie absolútny počet.
Počíta si dáta priamo z `ageBreakdown.json` (súčet cez všetky poisťovne za
každý rok, prevod na %) — nie je to samostatný dátový súbor.

10 pôvodných vekových pásiem je pre jeden graf príliš veľa farebných tried
(dataviz pravidlá: ordinal paleta max ~5-7, inak susedné odtiene splývajú),
preto sa tu zlučujú do 5 skupín: `0-9`, `10-19`, `20-29`, `30-39`, `40+`.
Plná desaťročná granularita ostáva dostupná vo filtri "Veková štruktúra" v
`TrendChart`. Farby sú jeden modrý ordinal ramp (svetlá = najmladší, tmavá =
najstarší), validované cez dataviz skill (`--ordinal`, 5 krokov, všetky
kontroly PASS).

Pozor na Recharts s `<Area stroke="#fff" .../>` (biely stroke kvôli 2px
medzere medzi segmentmi stacku): Recharts defaultne odvodí farbu textu aj
ikony **legendy aj tooltipu** zo `stroke`, takže bez zásahu vyjde biely text
na bielom pozadí (== neviditeľné). Legenda to rieši explicitným `payload`
(farba z `fill`) a `formatter` (text natvrdo v `#1f2430`). Tooltip nepoužíva
vstavaný `formatter` (ten len prefarbí jednu hodnotu, nie riadok), ale vlastný
`content={<AgeStructureTooltip />}` komponent, ktorý pre každú vekovú skupinu
vypíše farebnú bodku (z `group.color`) + percento + absolútny počet (ten sa
počíta do `chartData` navyše ako `<label>__count`, mimo % hodnoty použitej
na stacking).

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
npm install   # inštalácia
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
