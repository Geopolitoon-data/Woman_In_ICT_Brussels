# Women on ICT Payrolls — geopolitoon

A single-page data story: a scrollytelling article that ends with the full
interactive map embedded in it. 817 ICT-sector employers around Brussels, from
five years of filed social balance sheets (National Bank of Belgium).

## Important: keep every file at the repository ROOT

All files reference each other with no sub-folders, because GitHub's uploader
flattens folders. Do not put anything inside a `data/` or `vendor/` folder — the
`.json`, `.css` and `.js` files must sit next to the `.html` files at the top
level of the repo, exactly as they are in this archive.

| File            | Role                                             |
|-----------------|--------------------------------------------------|
| `article.html`  | The page — the article with the map at its end   |
| `index.html`    | Redirects to `article.html` (so the root opens it)|
| `map.html`      | The map on its own, framed inside the article    |
| `article.js` / `map.js`      | Their scripts                       |
| `article.json` / `bxl-data.json` | Their data                      |
| `d3.v7.min.js`, `lexend.css`, `montserrat.css`, `tokens.css` | Library, fonts, map styles |

## Publish on GitHub Pages

1. Public repo, all files at the root (as above).
2. **Settings → Pages → Deploy from a branch → `main` / `/(root)` → Save.**
3. Live at `https://<user>.github.io/<repo>/` after a minute.

## Wix blog (one page)

Add an **Embed Code → Embed a Site** element pointing at
`https://<user>.github.io/<repo>/article.html`, full width and tall. The article
scrolls inside it and the map appears at the end.

## Sources
National Bank of Belgium, Crossroads Bank for Enterprises, Eurostat.
