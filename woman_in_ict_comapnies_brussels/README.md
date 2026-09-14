# Women on ICT Payrolls — geopolitoon

A single-page data story: a scrollytelling article that ends with the full
interactive map embedded in it. Keep every file at the repository ROOT — no
`data/` or `vendor/` sub-folders — because GitHub's uploader flattens folders
and the code now references everything at the top level.

- `article.html` — the page (article + a "Jump to the map" button + the map at the end)
- `index.html` — redirects to `article.html`
- `map.html` / `map.js` — the map, framed inside the article
- `article.js`, `article.json`, `bxl-data.json` — scripts and data
- `d3.v7.min.js`, `lexend.css`, `montserrat.css`, `tokens.css` — library, fonts, styles

GitHub Pages: Settings → Pages → Deploy from a branch → main / (root).
Wix blog: Embed Code → Embed a Site → the page URL, full width, ~900px tall.
