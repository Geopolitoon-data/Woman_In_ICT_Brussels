/* Les femmes dans les effectifs TIC / Women on Brussels-area ICT payrolls
 *
 * One data file, no build step. Everything the page shows comes from
 * data/bxl-data.json, produced by build_map_data.py from the filed accounts.
 *
 * Two rules the map must never break, both inherited from the brief:
 *   - a commune below the record floor is "not reported", never a colour
 *   - communes outside the study frame are drawn as context and never coloured,
 *     because the universe was built Brussels-first and does not sample them
 */
(function () {
  "use strict";

  var YEARS = ["2021", "2022", "2023", "2024", "2025"];
  // NACE divisions, the level the National Bank reports at. Order is by weight
  // in this dataset, so the filter reads largest-first.
  var FAMILIES = ["62 · Programming & consultancy", "61 · Telecommunications",
                  "63 · Information services", "26 · Electronics manufacturing",
                  "58 · Software publishing", "00 · Added by hand"];
  var SIZES = [
    { id: "10-49", lo: 10, hi: 49 },
    { id: "50-249", lo: 50, hi: 249 },
    { id: "250+", lo: 250, hi: Infinity }
  ];

  var I18N = {
    fr: {
      title: "Les femmes dans les effectifs TIC, employeur par employeur",
      standfirst: "Chaque entreprise belge déclare ses effectifs par sexe. J'ai lu cinq ans de dépôts pour 817 employeurs du secteur des TIC à Bruxelles, du Brabant et de Louvain. Les femmes y sont 28 % du personnel, et 2,5 fois plus souvent à temps partiel que leurs collègues masculins.",
      noteBcr: "",
      noteMetro: "",
      year: "Exercice", sector: "Secteur", size: "Taille de l'entreprise",
      legendTitle: "Part des femmes (effectif)",
      view: "Affichage", viewRegions: "Communes", viewFirms: "Entreprises",
      searchPlaceholder: "Rechercher une entreprise ou une commune…",
      metric: "Indicateur", metricShare: "Part des femmes", metricPt: "Écart temps partiel",
      metricEvo: "Évolution",
      about: "M\u00e9thode", close: "Fermer",
      aboutTitle: "Comment lire cette carte",
      evolutionLabel: "\u00c9volution",
      ptChartTitle: "Temps plein / temps partiel",
      ftLabel: "Temps plein", ptLabel: "Temps partiel",
      distHint: "Glissez sur l'échelle pour définir votre périmètre.",
      segOverview: "Aperçu", colMen: "Hommes",
      bestHere: "Les plus paritaires", worstHere: "Les moins paritaires",
      allHere: "Toutes les entreprises", ptShareHere: "Part des femmes parmi les temps partiels",
      medianHere: "Part des femmes", evoHere: "Évolution médiane",
      ofWhichWomen: "Dont femmes",
      sizeLegend: "Taille du point\u202f= effectif de l\u2019entreprise",
      ptTimes: "fois plus souvent", ptEqual: "Hommes et femmes recourent au temps partiel dans les mêmes proportions.",
      ptMenMore: "Ce sont les hommes qui travaillent le plus à temps partiel ici.",

      legendEvo: "Évolution de la part des femmes (points)",
      rangeAll: "Tout", rangeShown: "affichées",
      men: "Hommes", women: "Femmes", total: "Total",
      theCompany: "l’entreprise", oneWoman: "femme", manyWomen: "femmes",
      oneMan: "homme", manyMen: "hommes",
      ptUnknown: "Non ventilé dans le dépôt", ptNoneAll: "Aucun temps partiel",
      colYear: "Exercice", colShare: "Part", colWomen: "Femmes", colChange: "Évol.",
      evoSince: "Depuis", onlyOneFiling: "Un seul dépôt, pas d'évolution",
      latest: "Dernier dépôt", latestNote: "Dernier exercice déposé par chaque entreprise",
      filedFor: "Exercice",
      legendGap: "Écart temps partiel (points)",
      ptTitle: "Temps partiel", ptMen: "Hommes à temps partiel",
      ptWomen: "Femmes à temps partiel", ptGap: "Écart (femmes − hommes)",
      ptOfAll: "Part des femmes parmi les temps partiels",
      ptOfStaff: "Part des femmes dans les effectifs",
      ptNone: "Aucun temps partiel déclaré",
      ptHint: "Un écart positif signifie que les femmes occupent plus souvent un temps partiel que les hommes, dans la même entreprise.",
      reset: "Vue", noResults: "Aucun résultat",
      kindFirm: "entreprise", kindCommune: "commune",
      wholeArea: "Ensemble de la zone", staffTotal: "Salariés couverts",
      womenTotal: "Dont femmes", bySector: "Par secteur", bySize: "Par taille",
      trend: "Évolution 2021-2025", firmsShort: "ent.",
      scope: "Périmètre", scopeBcr: "Bruxelles", scopeMetro: "+ périphérie",
      siteTag: "site BXL",
      legendThin: "Trop peu de données",
      legendOutside: "Hors périmètre de l'étude",
      all: "Tous",
      overview: "Vue d'ensemble",
      overviewSub: "Entreprises de 10 salariés ou plus",
      companies: "Entreprises", records: "Observations", communes: "Communes cartographiées",
      medianShare: "Part des femmes",
      largest: "Plus gros employeurs",
      best: "Part des femmes la plus élevée",
      worst: "Part des femmes la plus faible",
      movers: "Plus fortes évolutions depuis 2021",
      staff: "salariés", inCommune: "Dans cette commune",
      history: "Évolution",
      back: "← Retour à la vue d'ensemble",
      hint: "Cliquez sur une commune ou une entreprise. Les entreprises de moins de 10 salariés sont exclues : un seul départ y déplace la part de plus de 10 points. Le périmètre « Bruxelles » retient le siège social, plus les sociétés au siège périphérique exploitant un site bruxellois.",
      thin: "Trop peu d'observations pour publier un pourcentage",
      noData: "Pas de dépôt pour cet exercice",
      pts: "pts"
    },
    en: {
      title: "Women on ICT Payrolls, Employer by Employer",
      standfirstA: "Every Belgian company files its workforce by sex. I read five years of it for 817 ICT-sector employers across Brussels, Brabant and Leuven.",
      standfirstB: "Women are 28% of staff and 2.5 times more likely than their male colleagues to be working part-time.",
      noteBcr: "",
      noteMetro: "",
      year: "Financial year", sector: "Sector", size: "Company size",
      legendTitle: "Female share (headcount)",
      view: "Show", viewRegions: "Communes", viewFirms: "Companies",
      searchPlaceholder: "Search a company or commune…",
      metric: "Measure", metricShare: "Female share", metricPt: "Part-time gap",
      metricEvo: "Evolution",
      about: "Method", close: "Close",
      aboutTitle: "How to read this map",
      evolutionLabel: "Evolution",
      ptChartTitle: "Full-time / part-time",
      ftLabel: "Full-time", ptLabel: "Part-time",
      distHint: "Drag across the scale to define your scope.",
      segOverview: "Overview", colMen: "Men",
      bestHere: "Most balanced here", worstHere: "Least balanced here",
      allHere: "All companies", ptShareHere: "Women as a share of part-timers",
      medianHere: "Female share", evoHere: "Median evolution",
      ofWhichWomen: "of whom women",
      sizeLegend: "Dot size = number of staff",
      ptTimes: "as likely to work part-time", ptEqual: "Men and women here take part-time work at the same rate.",
      ptMenMore: "Here it is the men who work part-time more often.",

      legendEvo: "Change in female share (points)",
      rangeAll: "All", rangeShown: "shown",
      men: "Men", women: "Women", total: "Total",
      theCompany: "the company", oneWoman: "woman", manyWomen: "women",
      oneMan: "man", manyMen: "men",
      ptUnknown: "Not broken out in the filing", ptNoneAll: "No part-time staff",
      colYear: "Year", colShare: "Share", colWomen: "Women", colChange: "Change",
      evoSince: "Since", onlyOneFiling: "Only one filing, no trend",
      latest: "Latest filing", latestNote: "Each company’s most recent financial year",
      filedFor: "Financial year",
      legendGap: "Part-time: who does more of it",
      gapMen: "men", gapWomen: "women",
      ptTitle: "Part-time work", ptMen: "Men working part-time",
      ptWomen: "Women working part-time", ptGap: "Gap (women − men)",
      ptOfAll: "Women as a share of part-timers",
      ptOfStaff: "Women as a share of all staff",
      ptNone: "No part-time staff reported",
      ptHint: "A positive gap means women take part-time roles more often than men do, inside the same company.",
      reset: "Reset", noResults: "No match",
      kindFirm: "company", kindCommune: "commune",
      wholeArea: "Whole area", staffTotal: "Staff covered",
      womenTotal: "of whom women", bySector: "By sector", bySize: "By size",
      trend: "Trend 2021-2025", firmsShort: "firms",
      scope: "Area", scopeBcr: "Brussels", scopeMetro: "+ periphery",
      siteTag: "BXL site",
      legendThin: "Too few records",
      legendOutside: "Outside the study",
      all: "All",
      overview: "Overview",
      overviewSub: "Companies of 10 staff or more",
      companies: "Companies", records: "Records", communes: "Communes mapped",
      medianShare: "Female share",
      largest: "Largest employers",
      best: "Highest female share",
      worst: "Lowest female share",
      movers: "Biggest movers since 2021",
      staff: "staff", inCommune: "In this commune",
      history: "Evolution",
      back: "← Back to overview",
      hint: "Click a commune or a company. Companies under 10 staff are excluded: one person leaving moves the share by more than 10 points. The Brussels area uses the registered seat, plus periphery-registered companies that run a site in Brussels.",
      thin: "Too few records to publish a percentage",
      noData: "No filing for this year",
      pts: "pts"
    }
  };

  var state = {
    lang: "en",
    metric: "share",           // 'share' = female share, 'parttime' = the gap
    view: "companies",         // dots first: the named employers are the story
    scope: "metro",            // default: the whole study area, so the
                               // opening view matches the article's figures
    year: "latest",            // always the latest filing; see the builder
    range: null,               // [lo, hi] filter on the active measure
    families: new Set(FAMILIES),
    sizes: new Set(SIZES.map(function (s) { return s.id; })),
    selection: null            // {type:'commune'|'firm', id}
  };

  var seenMeasure = { share: true };
  var gHits, applyZoom, animated;
  var D, colour, gapColour, evoColour, projection, path, svg, root, zoomer, gMap, gCtx, gFirms, tip, studyFeatures;

  // Editorial: the page reads as a critique of equality not being met, so a low
  // female share is red and a balanced one green. Deliberately not a neutral
  // palette. Muted rather than traffic-light, so it holds on the navy ground.
  var RAMP = ["#A8362A", "#C9603A", "#DFA05A", "#C9BE79", "#8FA556", "#4E7C4A"];

  // The part-time gap runs the other way: zero is the good outcome, so the
  // ramp starts green and only reddens as women take disproportionately more
  // part-time work. Stops follow the observed commune spread
  // (p25 +1.9, median +9.5, p75 +20.9, p90 +40.0).
  var GAP_RAMP = ["#24405F", "#5B7B99", "#EDE2CB", "#E9A377", "#DD6B33", "#A83C14"];
  var GAP_DOMAIN = [-20, -6, 0, 10, 22, 40];

  // Evolution is diverging around zero: falling red, rising green. Bounded at
  // the 90th percentile of absolute change (15 pts) rather than the extreme,
  // because one company moved 36 points and scaling to it would flatten
  // everyone else into a single indistinguishable band.
  var EVO_RAMP = ["#A8362A", "#C9603A", "#C9BE79", "#C9BE79", "#8FA556", "#4E7C4A"];
  var EVO_DOMAIN = [-15, -6, -1.5, 1.5, 6, 15];
  var SHARE_DOMAIN = [10, 18, 24, 30, 38, 50];

  // Orange Belgium has 2,367 staff and the median firm has ~30. An unclamped
  // sqrt scale turns the largest employers into blobs that swallow the map.
  // Capped tighter than the data would suggest: 400 dots have to coexist inside
  // 19 communes, and a mark big enough to swallow its neighbours cannot be
  // separated by any amount of relaxation.
  // Area-proportional, so a dot twice the area means twice the staff.
  //
  // The previous version floored at 2 px and everything under about 59 staff
  // landed on that floor - which is 78% of the companies here, median 17
  // staff. Most of the map was drawn at one size and the size key meant
  // nothing. A sqrt scale across the real range separates them.
  var RADIUS = null;
  function radius(hc) {
    if (!RADIUS) RADIUS = d3.scaleSqrt().domain([10, 2400]).range([2.2, 9.5]).clamp(true);
    return RADIUS(Math.max(10, hc || 10));
  }

  // How much to divide the radius by inside the zoom group.
  //
  // Dividing by k exactly holds a mark at a constant SCREEN size - correct in
  // principle, but as the geography spreads underneath, the dots read as
  // shrinking and get harder to hit. Dividing by k^0.62 lets them grow as
  // k^0.38: at 4x zoom they are ~1.7x bigger on screen, while the map itself is
  // 4x wider, so crowding still eases. Floored so a dot never drops below a
  // clickable size however far out you are.
  function markDivisor(k) { return Math.pow(k, 0.62); }

  // "Brussels" means the registered seat is in the region OR the company runs
  // an establishment there - 51 firms in the analysis base are Brussels
  // employers registered just outside it, and dropping them would understate
  // the city. Communes have no establishments, so they use the seat flag alone.
  function zoomK() {
    return (svg && svg.node()) ? (d3.zoomTransform(svg.node()).k || 1) : 1;
  }

  function inScope(d) {
    if (state.scope === "metro") return true;
    return !!(d && (d.bcr || d.bxl_site));
  }

  function famLabel(f) { return String(f).replace(/^\d+\s*\u00b7\s*/, ""); }

  function t(k) { return I18N[state.lang][k]; }
  function fmtPc(v) { return v == null ? "–" : v.toFixed(1).replace(".", state.lang === "fr" ? "," : ".") + "%"; }
  function communeName(c) { return state.lang === "fr" ? c.name_fr : (c.name_fr || c.name_nl); }

  // ---------------------------------------------------------------- filters
  // Which filing represents a company right now. In "latest" mode that is its
  // most recent one, so a company with no 2025 accounts yet does not vanish
  // from the map - 143 of them, including one with 980 staff.
  function rec(f) {
    return state.year === "latest" ? f.history[f.latest_year] : f.history[state.year];
  }

  function recYear(f) {
    return state.year === "latest" ? f.latest_year : state.year;
  }

  function firmPasses(f) {
    if (!inScope(f)) return false;
    if (state.range && !inRange(firmValue(rec(f), f))) return false;
    if (!state.families.has(f.family)) return false;
    var h = rec(f);
    if (!h) return false;
    var ok = false;
    SIZES.forEach(function (s) {
      if (state.sizes.has(s.id) && h.hc >= s.lo && h.hc <= s.hi) ok = true;
    });
    return ok;
  }

  // A commune must clear the pooled floor to appear at all, and have enough
  // records in the selected year to be coloured for that year. Anything else is
  // "not reported" - never a colour, which would invent precision.
  function communeValue(c) {
    if (!c.reported || !inScope(c)) return null;
    var y = state.year === "latest" ? c.latest : c.by_year[state.year];
    if (!y || y.n < D.meta.min_year) return null;
    if (state.metric === "parttime") {
      // The gap needs both sexes present, so a commune can be reportable on
      // female share and still have too few records to carry a gap.
      return (y.gap != null && y.gap_n >= D.meta.min_year) ? y.gap : null;
    }
    if (state.metric === "evolution") {
      var e = c.evolution;
      return (e && e.n >= D.meta.min_year) ? e.median : null;
    }
    return y.share;
  }

  function firmValue(h, f) {
    if (!h) return null;
    if (state.metric === "parttime") return h.ptk === false ? null : h.gap;
    if (state.metric === "evolution") return f ? f.evolution : null;
    return h.share;
  }

  function scale() {
    return state.metric === "parttime" ? gapColour
         : state.metric === "evolution" ? evoColour : colour;
  }

  function activeDomain() {
    return state.metric === "parttime" ? GAP_DOMAIN
         : state.metric === "evolution" ? EVO_DOMAIN : SHARE_DOMAIN;
  }

  function fmtVal(v) {
    if (v == null) return "–";
    var s = v.toFixed(1).replace(".", state.lang === "fr" ? "," : ".");
    if (state.metric === "share") return s + "%";
    return (v > 0 ? "+" + s : s) + " pts";
  }

  function signed(v) {
    if (v == null) return "–";
    var s = Math.abs(v).toLocaleString(state.lang);
    return v > 0 ? "+" + s : v < 0 ? "−" + s : "0";
  }

  // ---------------------------------------------------------------- draw
  // Guard against the class of bug that removed the Evolution button for
  // months: a stale copy of an older builder sat inside the scope handler and
  // re-joined #metricmode with two items instead of three, so the control
  // silently lost a button on every scope click. If a group is ever short, put
  // it back rather than letting the reader find out.
  function ensureControls() {
    var want = { "#metricmode": 3, "#viewmode": 2, "#scopemode": 2 };
    var short = Object.keys(want).some(function (sel) {
      return document.querySelectorAll(sel + " button").length !== want[sel];
    });
    if (short) { buildSegments(); applyLang(); }
  }

  function render() {
    ensureControls();
    var firmsView = state.view === "companies";

    gMap.selectAll("path.commune")
      .attr("fill", function (d) {
        // Out of the chosen area, a commune is background, never a value.
        if (!inScope(d.__c)) return "#E0D5BD";
        // In the companies view the choropleth would fight the dots for
        // attention, so it drops back to a flat ground.
        if (firmsView) return "#DCCFB2";
        var v = communeValue(d.__c);
        return v == null ? "#C8BA9B" : scale()(v);
      })
      .classed("reported", function (d) {
        return !firmsView && communeValue(d.__c) != null;
      })
      .style("pointer-events", firmsView ? "none" : null);

    gHits.style("display", firmsView ? null : "none")
      .selectAll("circle.hit")
      .style("display", function (d) { return firmPasses(d) ? null : "none"; });
    var selId = state.selection && state.selection.type === "firm"
      ? state.selection.id : null;
    gFirms.style("display", firmsView ? null : "none")
      .selectAll("circle.firm")
      .classed("dim", function (d) { return !firmPasses(d); })
      .classed("sel", function (d) { return d.id === selId; })
      .attr("r", function (d) {
        var h = rec(d);
        return h ? radius(h.hc) / markDivisor(zoomK()) : 0;
      })
      .attr("fill", function (d) {
        var v = firmValue(rec(d), d);
        return v == null ? "#C9BCA0" : scale()(v);
      });

    d3.select("#sizelegend").style("display", firmsView ? null : "none");
    paintRangeText();
    paintSide();
  }

  // ---------------------------------------------------------------- side panel
  function rows(list, valueFn, metaFn) {
    var ul = d3.create("ul").attr("class", "ranklist");
    var li = ul.selectAll("li").data(list).join("li")
      .on("click", function (e, d) { select({ type: "firm", id: d.id }); });
    var left = li.append("div");
    left.append("div").attr("class", "nm").html(function (d) {
      var nm = d.name.replace(/[&<>]/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c];
      });
      return nm + (d.bxl_site && !d.bcr
        ? '<span class="tag-site">' + t("siteTag") + "</span>" : "");
    });
    left.append("div").attr("class", "meta").text(metaFn);
    li.append("div").attr("class", "pc").text(valueFn);
    return ul.node();
  }

  function overview() {
    var side = d3.select("#side").html("");
    var live = D.companies.filter(firmPasses);
    var shares = live.map(function (f) { return rec(f).share; }).sort(d3.ascending);
    var mapped = Object.values(D.communes).filter(function (c) { return communeValue(c) != null; });

    side.append("h2").text(t("wholeArea"));
    side.append("p").attr("class", "sub").text(t("overviewSub"));

    var staff = d3.sum(live, function (f) { return rec(f).hc; });
    // Women summed from each filing rather than inferred from the median
    // - a median of percentages says nothing about how many people that is.
    // Use the stored headcount, not headcount times the rounded share, which
    // put this two people out across the study.
    var women = d3.sum(live, function (f) { return rec(f).wh; });

    [[t("companies"), live.length.toLocaleString(state.lang)],
     [t("communes"), mapped.length],
     [t("staffTotal"), Math.round(staff).toLocaleString(state.lang)],
     [t("womenTotal"), Math.round(women).toLocaleString(state.lang)],
     [t("medianShare"), fmtPc(staff ? women / staff * 100 : 0), true]
    ].forEach(function (r) {
      var s = side.append("div").attr("class", "stat");
      s.append("div").attr("class", "k").text(r[0]);
      s.append("div").attr("class", "v" + (r[2] ? " gold" : "")).text(r[1]);
    });

    // Part-time totalled over the companies the reader is actually looking at.
    // Reading the study-wide block here made the panel contradict the two rows
    // above it, which are filtered.
    var pt = (function () {
      var mft = 0, mpt = 0, wft = 0, wpt = 0, seen = 0;
      live.forEach(function (f) {
        var h = rec(f);
        if (!h || !h.ptk || h.mptn == null) return;
        seen++;
        mpt += h.mptn; wpt += h.wptn;
        mft += h.mh - h.mptn; wft += h.wh - h.wptn;
      });
      var m = mft + mpt, w = wft + wpt;
      if (!seen || !m || !w || !(mpt + wpt)) return null;
      return { men_rate: mpt / m * 100, women_rate: wpt / w * 100,
               women_of_parttime: wpt / (mpt + wpt) * 100,
               women_of_staff: w / (m + w) * 100 };
    })();
    if (pt && pt.men_rate != null) {
      side.append("div").attr("class", "ctl-label")
        .style("margin", "22px 0 4px").text(t("ptTitle"));
      [[t("ptMen"), fmtPc(pt.men_rate)],
       [t("ptWomen"), fmtPc(pt.women_rate), true],
       [t("ptOfAll"), fmtPc(pt.women_of_parttime)]
      ].forEach(function (r) {
        var st_ = side.append("div").attr("class", "stat");
        st_.append("div").attr("class", "k").text(r[0]);
        st_.append("div").attr("class", "v" + (r[2] ? " gold" : "")).text(r[1]);
      });
    }

    section(side, t("trend"), areaTrend(live));
    section(side, t("bySector"), breakdown(live, function (f) { return f.family; }, FAMILIES, famLabel));
    section(side, t("bySize"), breakdown(live, function (f) {
      var hc = rec(f).hc;
      return hc < 50 ? "10-49" : hc < 250 ? "50-249" : "250+";
    }, ["10-49", "50-249", "250+"]));

    // Three shortlists, so the article's angle can be chosen from evidence
    // rather than decided first and evidenced afterwards.
    var bySize = live.slice().sort(function (a, b) {
      return rec(b).hc - rec(a).hc;
    }).slice(0, 8);
    section(side, t("largest"), rows(bySize,
      function (d) { return fmtPc(rec(d).share); },
      function (d) { return rec(d).hc.toLocaleString(state.lang) + " " + t("staff") + " · " + d.commune_fr; }));

    var big = live.filter(function (f) { return rec(f).hc >= 50; });
    var sorted = big.slice().sort(function (a, b) {
      return rec(b).share - rec(a).share;
    });
    section(side, t("best"), rows(sorted.slice(0, 5),
      function (d) { return fmtPc(rec(d).share); },
      function (d) { return rec(d).hc.toLocaleString(state.lang) + " " + t("staff"); }));
    section(side, t("worst"), rows(sorted.slice(-5).reverse(),
      function (d) { return fmtPc(rec(d).share); },
      function (d) { return rec(d).hc.toLocaleString(state.lang) + " " + t("staff"); }));

    var movers = live.filter(function (f) {
      return f.history["2021"] && rec(f) && rec(f).hc >= 50;
    }).map(function (f) {
      f.__delta = rec(f).share - f.history["2021"].share;
      return f;
    }).sort(function (a, b) { return Math.abs(b.__delta) - Math.abs(a.__delta); }).slice(0, 6);
    if (movers.length) {
      section(side, t("movers"), rows(movers,
        function (d) { return (d.__delta > 0 ? "+" : "") + d.__delta.toFixed(1).replace(".", state.lang === "fr" ? "," : ".") + " " + t("pts"); },
        function (d) { return fmtPc(d.history["2021"].share) + " → " + fmtPc(rec(d).share); }));
    }

    side.append("p").attr("class", "hint").text(t("hint"));
  }

  // A median per group, drawn on one shared scale so the groups are comparable
  // at a glance rather than only readable one row at a time.
  function breakdown(live, keyFn, order, labelFn) {
    // The share of all the people employed in the group, summed then divided
    // once, which is what the article reports. A median of company
    // percentages would give a ten-person firm the same weight as Orange.
    var g = d3.rollup(live, function (v) {
      var w = d3.sum(v, function (f) { return rec(f).wh; });
      var m = d3.sum(v, function (f) { return rec(f).mh; });
      return { n: v.length, med: (w + m) ? w / (w + m) * 100 : null };
    }, keyFn);
    var wrap = d3.create("div").attr("class", "bars");
    order.forEach(function (k) {
      var d = g.get(k);
      var row = wrap.append("div").attr("class", "bar");
      row.append("div").attr("class", "bl").text(labelFn ? labelFn(k) : k);
      var track = row.append("div").attr("class", "bt");
      if (d) {
        track.append("i").style("width", Math.max(2, d.med / 50 * 100) + "%")
          .style("background", colour(d.med));
      }
      row.append("div").attr("class", "bv")
        .text(d ? fmtPc(d.med) + "  " + d.n : "–");
    });
    return wrap.node();
  }

  // The whole area's median across the five years, so a reader can see whether
  // anything is moving before drilling into a single commune or firm.
  function areaTrend(live) {
    var W = 296, H = 92, PAD = { t: 16, r: 48, b: 24, l: 24 };
    var pts = YEARS.map(function (y) {
      var here = D.companies.filter(function (f) {
        return inScope(f) && state.families.has(f.family) && f.history[y];
      });
      var w = d3.sum(here, function (f) { return f.history[y].wh || 0; });
      var m = d3.sum(here, function (f) { return f.history[y].mh || 0; });
      return (w + m) ? { y: y, v: w / (w + m) * 100 } : null;
    }).filter(Boolean);
    var svgEl = d3.create("svg").attr("class", "spark")
      .attr("viewBox", "0 0 " + W + " " + H).attr("width", "100%");
    if (pts.length < 2) return svgEl.node();
    var x = d3.scalePoint().domain(YEARS).range([PAD.l, W - PAD.r]);
    var lo = Math.max(0, d3.min(pts, function (d) { return d.v; }) - 4);
    var hi = d3.max(pts, function (d) { return d.v; }) + 4;
    var y = d3.scaleLinear().domain([lo, hi]).range([H - PAD.b, PAD.t]);
    // Bare axes with arrowheads: enough to say "this goes up and this goes
    // along", without a grid or ticks competing with a five-point line.
    var ax = PAD.l - 8, ay = H - PAD.b + 4;
    var AXC = "#B9A987";
    svgEl.append("path").attr("fill", "none").attr("stroke", AXC).attr("stroke-width", 1)
      .attr("d", "M" + ax + "," + (PAD.t - 6) + "V" + ay + "H" + (W - PAD.r + 16));
    svgEl.append("path").attr("fill", AXC)
      .attr("d", "M" + ax + "," + (PAD.t - 11) + "l3.2,5.4h-6.4Z");            // up
    svgEl.append("path").attr("fill", AXC)
      .attr("d", "M" + (W - PAD.r + 21) + "," + ay + "l-5.4,3.2v-6.4Z");       // right

    svgEl.append("path").datum(pts).attr("fill", "none")
      .attr("stroke", "#24405F").attr("stroke-width", 1.6)
      .attr("d", d3.line().x(function (d) { return x(d.y); }).y(function (d) { return y(d.v); }));
    svgEl.selectAll("circle").data(pts).join("circle")
      .attr("cx", function (d) { return x(d.y); }).attr("cy", function (d) { return y(d.v); })
      .attr("r", function (d) { return d.y === state.year ? 4 : 2.6; })
      .attr("fill", function (d) { return colour(d.v); });
    var last = pts[pts.length - 1];
    svgEl.append("text").attr("x", x(last.y) + 8).attr("y", y(last.v) + 4)
      .attr("fill", "#4A443C").attr("font-family", "ui-monospace,monospace")
      .attr("font-size", 11).text(fmtPc(last.v));
    svgEl.selectAll("text.yr").data([YEARS[0], YEARS[YEARS.length - 1]]).join("text")
      .attr("class", "yr").attr("x", function (d) { return x(d); }).attr("y", H - 4)
      .attr("fill", "#857C6E").attr("font-family", "ui-monospace,monospace")
      .attr("font-size", 10).attr("text-anchor", "middle").text(function (d) { return d; });
    return svgEl.node();
  }

  function section(side, label, node) {
    side.append("div").attr("class", "ctl-label")
      .style("margin", "22px 0 4px").text(label);
    side.node().appendChild(node);
  }

  function communePanel(id) {
    var c = D.communes[id];
    var side = d3.select("#side").html("");
    side.append("button").attr("class", "back").text(t("back"))
      .on("click", function () { select(null); });
    side.append("h2").text(communeName(c));

    // Everything below is computed from the companies currently on screen, so
    // the panel answers the sector, size and range filters instead of quietly
    // reporting the unfiltered commune.
    var here = D.companies.filter(function (f) {
      return f.commune === id && firmPasses(f);
    });
    side.append("p").attr("class", "sub")
      .text(here.length + " " + (here.length === 1 ? t("kindFirm") : t("companies").toLowerCase()));

    if (!here.length) {
      side.append("p").attr("class", "hint").style("border", "none").text(t("thin"));
      return;
    }

    var recs = here.map(rec);
    var staff = d3.sum(recs, function (h) { return h.hc; });
    var women = d3.sum(recs, function (h) { return h.wh || 0; });
    var men = d3.sum(recs, function (h) { return h.mh || 0; });
    var shares = recs.map(function (h) { return h.share; }).sort(d3.ascending);
    var evos = here.map(function (f) { return f.evolution; })
      .filter(function (v) { return v != null; });

    // ---- overview
    var seg1 = side.append("div").attr("class", "cardseg s1");
    seg1.append("div").attr("class", "seghead").text(t("segOverview"));
    var split = seg1.append("div").attr("class", "sexsplit");
    [[t("men"), men, ""], [t("women"), women, "w"], [t("total"), staff, ""]]
      .forEach(function (cell) {
        var el = split.append("div");
        el.append("div").attr("class", "k").text(cell[0]);
        el.append("div").attr("class", "v " + cell[2])
          .text(Math.round(cell[1]).toLocaleString(state.lang));
      });
    statRow(seg1, t("medianHere"), fmtPc(staff ? women / staff * 100 : 0), "gold");
    if (evos.length) {
      var me = d3.median(evos);
      statRow(seg1, t("evoHere"),
        (me > 0 ? "+" : "") + me.toFixed(1).replace(".", state.lang === "fr" ? "," : ".") + " pts",
        null, me > 0 ? "#3F8F4A" : me < 0 ? "#C0392B" : null);
    }

    // ---- part-time, aggregated across the commune's own filings
    var ok = recs.filter(function (h) {
      return h.ptk !== false && h.mpt != null && h.wpt != null;
    });
    if (ok.length) {
      var mpt = d3.sum(ok, function (h) { return (h.mh || 0) * h.mpt / 100; });
      var wpt = d3.sum(ok, function (h) { return (h.wh || 0) * h.wpt / 100; });
      var mtot = d3.sum(ok, function (h) { return h.mh || 0; });
      var wtot = d3.sum(ok, function (h) { return h.wh || 0; });
      if (mtot && wtot) {
        var mr = mpt / mtot * 100, wr = wpt / wtot * 100;
        var seg2 = side.append("div").attr("class", "cardseg s2");
        seg2.append("div").attr("class", "seghead").text(t("ptChartTitle"));
        seg2.node().appendChild(ptChart(null, { mh: mtot, wh: wtot, mpt: mr, wpt: wr }));
        if (mpt + wpt > 0) {
          statRow(seg2, t("ptShareHere"), fmtPc(wpt / (mpt + wpt) * 100));
        }
        seg2.append("p").attr("class", "ptsentence")
          .html(ptSentence({ mpt: mr, wpt: wr }));
      }
    }

    // ---- who is doing well, and who is not
    var seg3 = side.append("div").attr("class", "cardseg s3");
    var sorted = here.slice().sort(function (a, b) { return rec(b).share - rec(a).share; });
    var meta = function (d) {
      return rec(d).hc.toLocaleString(state.lang) + " " + t("staff") +
             " \u00b7 " + famLabel(d.family);
    };
    var val = function (d) { return fmtPc(rec(d).share); };
    if (sorted.length >= 6) {
      seg3.append("div").attr("class", "seghead").text(t("bestHere"));
      seg3.node().appendChild(rows(sorted.slice(0, 3), val, meta));
      seg3.append("div").attr("class", "seghead").style("margin-top", "16px")
        .text(t("worstHere"));
      seg3.node().appendChild(rows(sorted.slice(-3).reverse(), val, meta));
    } else {
      seg3.append("div").attr("class", "seghead").text(t("allHere"));
      seg3.node().appendChild(rows(sorted, val, meta));
    }
    if (sorted.length > 6) {
      var more = side.append("div").attr("class", "cardseg s1");
      more.append("div").attr("class", "seghead").text(t("allHere"));
      more.node().appendChild(rows(sorted, val, meta));
    }
  }

  function statRow(parent, label, value, cls, colour) {
    var r = parent.append("div").attr("class", "stat");
    r.append("div").attr("class", "k").text(label);
    var v = r.append("div").attr("class", "v" + (cls ? " " + cls : "")).text(value);
    if (colour) v.style("color", colour);
    return r;
  }

  function firmPanel(id) {
    var f = D.companies.find(function (x) { return x.id === id; });
    if (!f) return;
    var side = d3.select("#side").html("");
    side.append("button").attr("class", "back").text(t("back"))
      .on("click", function () { select(null); });
    side.append("h2").text(f.name);
    side.append("p").attr("class", "sub")
      .text(f.commune_fr + " · " + famLabel(f.family) +
            (f.bxl_site && !f.bcr ? " · " + t("siteTag") : ""));

    var h = rec(f);
    side.append("p").attr("class", "sub").style("margin-top", "-10px")
      .text(t("filedFor") + " " + recYear(f));

    var seg1 = side.append("div").attr("class", "cardseg s1");
    seg1.append("div").attr("class", "seghead").text(t("segOverview"));

    // Headcount by sex, so the share is read against the people it describes.
    var split = seg1.append("div").attr("class", "sexsplit");
    [[t("men"), h ? h.mh : null, ""],
     [t("women"), h ? h.wh : null, "w"],
     [t("total"), h ? h.hc : null, ""]
    ].forEach(function (c) {
      var cell = split.append("div");
      cell.append("div").attr("class", "k").text(c[0]);
      cell.append("div").attr("class", "v " + c[2])
        .text(c[1] == null ? "–" : c[1].toLocaleString(state.lang));
    });

    var st0 = seg1.append("div").attr("class", "stat");
    st0.append("div").attr("class", "k").text(t("medianShare"));
    st0.append("div").attr("class", "v gold").text(h ? fmtPc(h.share) : "–");

    var st1 = seg1.append("div").attr("class", "stat");
    st1.append("div").attr("class", "k")
      .text(t("evoSince") + " " + (f.first_year || YEARS[0]));
    st1.append("div").attr("class", "v")
      .style("color", f.evolution == null ? "var(--ink-3)"
                    : f.evolution > 0 ? "#3F8F4A" : f.evolution < 0 ? "#C0392B" : "var(--ink-3)")
      .text(f.evolution == null ? "–"
            : (f.evolution > 0 ? "+" : "") +
              f.evolution.toFixed(1).replace(".", state.lang === "fr" ? "," : ".") + " pts");

    if (h && h.ptk === false) {
      var segA = side.append("div").attr("class", "cardseg s2");
      segA.append("div").attr("class", "seghead").text(t("ptChartTitle"));
      segA.append("p").attr("class", "hint").style("border", "none")
        .style("padding-top", "0").text(t("ptUnknown"));
    } else if (h && h.gap === 0 && h.mpt === 0 && h.wpt === 0) {
      var segB = side.append("div").attr("class", "cardseg s2");
      segB.append("div").attr("class", "seghead").text(t("ptChartTitle"));
      segB.append("p").attr("class", "hint").style("border", "none")
        .style("padding-top", "0").text(t("ptNoneAll"));
    } else if (h && h.gap != null) {
      var seg2 = side.append("div").attr("class", "cardseg s2");
      seg2.append("div").attr("class", "seghead").text(t("ptChartTitle"));
      seg2.node().appendChild(ptChart(f, h));
      // "+13.0 pts" in red reads as a score, and a positive number coloured
      // like a warning is worse than no number. Say it in words instead.
      seg2.append("p").attr("class", "ptsentence").html(ptSentence(h));
    } else if (h) {
      side.append("p").attr("class", "hint").text(t("ptNone"));
    }

    var seg3 = side.append("div").attr("class", "cardseg s3");
    seg3.append("div").attr("class", "seghead").text(t("history"));
    seg3.node().appendChild(sparkline(f));
    seg3.node().appendChild(yearTable(f));
    var read = readout(f);
    if (read) seg3.append("p").attr("class", "readout").text(read);
  }

  function sparkline(f) {
    var W = 296, H = 100, PAD = { t: 16, r: 48, b: 24, l: 24 };
    var pts = YEARS.filter(function (y) { return f.history[y]; })
      .map(function (y) { return { y: y, v: f.history[y].share }; });
    var svgEl = d3.create("svg").attr("class", "spark")
      .attr("viewBox", "0 0 " + W + " " + H).attr("width", "100%");
    if (!pts.length) return svgEl.node();
    var x = d3.scalePoint().domain(YEARS).range([PAD.l, W - PAD.r]);
    var lo = Math.max(0, d3.min(pts, function (d) { return d.v; }) - 6);
    var hi = Math.min(100, d3.max(pts, function (d) { return d.v; }) + 6);
    var y = d3.scaleLinear().domain([lo, hi]).range([H - PAD.b, PAD.t]);

    // Bare axes with arrowheads - enough to say "this goes up and this goes
    // along" without a grid competing with a five-point line.
    var ax = PAD.l - 10, ay = H - PAD.b + 5, AXC = "#B9A987";
    svgEl.append("path").attr("fill", "none").attr("stroke", AXC).attr("stroke-width", 1)
      .attr("d", "M" + ax + "," + (PAD.t - 6) + "V" + ay + "H" + (W - PAD.r + 16));
    svgEl.append("path").attr("fill", AXC)
      .attr("d", "M" + ax + "," + (PAD.t - 12) + "l3.4,6h-6.8Z");
    svgEl.append("path").attr("fill", AXC)
      .attr("d", "M" + (W - PAD.r + 22) + "," + ay + "l-6,3.4v-6.8Z");

    svgEl.append("path").datum(pts)
      .attr("fill", "none").attr("stroke", "#24405F").attr("stroke-width", 1.6)
      .attr("d", d3.line().x(function (d) { return x(d.y); }).y(function (d) { return y(d.v); }));
    svgEl.selectAll("circle").data(pts).join("circle")
      .attr("cx", function (d) { return x(d.y); }).attr("cy", function (d) { return y(d.v); })
      .attr("r", function (d) { return d.y === recYear(f) ? 4 : 2.6; })
      .attr("fill", function (d) { return d.y === recYear(f) ? "#DD6B33" : "#24405F"; });
    var last = pts[pts.length - 1];
    svgEl.append("text").attr("x", x(last.y) + 8).attr("y", y(last.v) + 4)
      .attr("fill", "#DD6B33").attr("font-family", "ui-monospace,monospace")
      .attr("font-size", 11).text(fmtPc(last.v));
    svgEl.selectAll("text.yr").data([YEARS[0], YEARS[YEARS.length - 1]]).join("text")
      .attr("class", "yr").attr("x", function (d) { return x(d); }).attr("y", H - 5)
      .attr("fill", "#857C6E").attr("font-family", "ui-monospace,monospace")
      .attr("font-size", 10).attr("text-anchor", "middle").text(function (d) { return d; });
    return svgEl.node();
  }

  // A percentage on its own hides the size of the thing that moved: 25% to 30%
  // is two people in a firm of forty. The table puts the headcount of women and
  // its year-on-year movement beside the share.

  // A percentage on its own hides direction of travel: Orange Belgium's share
  // fell while it added 275 women. This says out loud what the numbers do.
  // A percentage on its own hides direction of travel: Orange Belgium's share
  // fell while it added 275 women. This says out loud what the numbers do.
  // A percentage hides direction of travel: a share can rise because women
  // arrived or because men left, and those are not the same finding. This
  // states both movements from their own signs, then the consequence.
  function readout(f) {
    var years = YEARS.filter(function (y) { return f.history[y]; });
    if (years.length < 2) return null;
    var a = f.history[years[0]], b = f.history[years[years.length - 1]];
    var dW = b.wh - a.wh, dM = b.mh - a.mh, dS = b.share - a.share;
    var L = state.lang === "fr";
    var span = years[0] + "\u2013" + years[years.length - 1];
    var pts = Math.abs(dS).toFixed(1).replace(".", L ? "," : ".");

    function nOf(v, one, many) {
      var n = Math.abs(v);
      return n.toLocaleString(state.lang) + " " + t(n === 1 ? one : many);
    }
    var W = nOf(dW, "oneWoman", "manyWomen");
    var M = nOf(dM, "oneMan", "manyMen");

    // ---- what actually happened to the two headcounts
    var move;
    if (dW > 0 && dM > 0) {
      move = L ? "a recrut\u00e9 " + W + " et " + M
               : "added " + W + " and " + M;
    } else if (dW > 0 && dM < 0) {
      move = L ? "a recrut\u00e9 " + W + " et perdu " + M
               : "added " + W + " and lost " + M;
    } else if (dW < 0 && dM > 0) {
      move = L ? "a perdu " + W + " et recrut\u00e9 " + M
               : "lost " + W + " and added " + M;
    } else if (dW < 0 && dM < 0) {
      move = L ? "a perdu " + W + " et " + M
               : "lost " + W + " and " + M;
    } else if (dW === 0 && dM !== 0) {
      move = L ? (dM > 0 ? "a recrut\u00e9 " + M : "a perdu " + M)
                 + " sans changement c\u00f4t\u00e9 femmes"
               : (dM > 0 ? "added " : "lost ") + M + " and no women";
    } else if (dM === 0 && dW !== 0) {
      move = L ? (dW > 0 ? "a recrut\u00e9 " + W : "a perdu " + W)
                 + " sans changement c\u00f4t\u00e9 hommes"
               : (dW > 0 ? "added " : "lost ") + W + " and no men";
    } else {
      return L
        ? "Entre " + span + ", ni l\u2019un ni l\u2019autre effectif n\u2019a boug\u00e9."
        : "Between " + span + " neither headcount moved.";
    }

    // ---- and what it did to the share
    var effect;
    if (Math.abs(dS) < 0.05) {
      effect = L ? ", sans effet sur la part des femmes"
                 : ", leaving the female share unchanged";
    } else if (dS > 0) {
      effect = L ? "\u202f: la part des femmes progresse de " + pts + " points"
                 : ", lifting the female share " + pts + " points";
    } else {
      effect = L ? "\u202f: la part des femmes recule de " + pts + " points"
                 : ", pushing the female share down " + pts + " points";
    }

    return L
      ? "Entre " + span + ", " + t("theCompany") + " " + move + effect + "."
      : "Between " + span + " " + t("theCompany") + " " + move + effect + ".";
  }

  function yearTable(f) {
    var tbl = d3.create("table").attr("class", "yeartable");
    var head = tbl.append("thead").append("tr");
    [t("colYear"), t("colShare"), t("colWomen"), t("colMen")].forEach(function (h) {
      head.append("th").text(h);
    });
    var body = tbl.append("tbody");
    var years = YEARS.filter(function (y) { return f.history[y]; });
    years.forEach(function (y, i) {
      var cur = f.history[y];
      var prev = i > 0 ? f.history[years[i - 1]] : null;
      var dw = prev ? cur.wh - prev.wh : null;
      var dm = prev ? cur.mh - prev.mh : null;
      var tr = body.append("tr");
      var ds = prev ? cur.share - prev.share : null;
      tr.append("td").text(y);
      var tds = tr.append("td");
      tds.append("span").text(fmtPc(cur.share));
      if (ds != null && Math.abs(ds) >= 0.05) {
        tds.append("span")
          .attr("class", ds > 0 ? "up" : "down")
          .style("font-size", "10px").style("margin-left", "5px")
          .text((ds > 0 ? "+" : "\u2212") +
                Math.abs(ds).toFixed(1).replace(".", state.lang === "fr" ? "," : "."));
      }
      // Both sexes, each with its own year-on-year movement: a rising women
      // count means nothing until you can see what the men did.
      [[cur.wh, dw], [cur.mh, dm]].forEach(function (pair) {
        var td = tr.append("td");
        td.append("span").text(pair[0] == null ? "\u2013" : pair[0].toLocaleString(state.lang));
        if (pair[1] != null && pair[1] !== 0) {
          td.append("span")
            .attr("class", pair[1] > 0 ? "up" : "down")
            .style("font-size", "10px").style("margin-left", "5px")
            .text(signed(pair[1]));
        }
      });
    });
    return tbl.node();
  }


  // Full-time / part-time, one bar per sex on a shared scale.
  //
  // Two rates side by side ("5.4% and 18.3%") make the reader do the comparison
  // in their head. Drawn to a common width, the part-time block on the women's
  // bar is simply longer, and the point lands before the numbers are read.

  // The part-time comparison in words. A ratio is what a reader actually
  // thinks ("twice as likely"), but it breaks when men's rate is zero, so fall
  // back to points there.
  function ptSentence(h) {
    var m = h.mpt, w = h.wpt;
    if (m == null || w == null) return "";
    var esc = function (x) { return String(x); };
    if (Math.abs(w - m) < 0.5) return t("ptEqual");
    if (w < m) return t("ptMenMore");
    if (m >= 0.5) {
      var x = w / m;
      var num = (x >= 10 ? Math.round(x) : Math.round(x * 10) / 10)
        .toString().replace(".", state.lang === "fr" ? "," : ".");
      return state.lang === "fr"
        ? "Les femmes y travaillent <b>" + num + "\u00d7 " + t("ptTimes") + "</b> que les hommes."
        : "Women here are <b>" + num + "\u00d7 " + t("ptTimes") + "</b> as men.";
    }
    var pts = (w - m).toFixed(1).replace(".", state.lang === "fr" ? "," : ".");
    return state.lang === "fr"
      ? "<b>" + fmtPc(w) + "</b> des femmes travaillent \u00e0 temps partiel, contre "
        + fmtPc(m) + " des hommes (" + pts + " points d\u2019\u00e9cart)."
      : "<b>" + fmtPc(w) + "</b> of women work part-time against " + fmtPc(m)
        + " of men \u2014 " + pts + " points apart.";
  }

  function ptChart(f, h) {   // f may be null: communes pass a synthetic total
    var W = 296, ROW = 26, PAD_L = 54, PAD_R = 46, H = ROW * 2 + 16;
    var wrap = d3.create("div").attr("class", "ptchart");
    var svgEl = wrap.append("svg").attr("viewBox", "0 0 " + W + " " + H)
      .attr("width", "100%");

    var rows = [
      { label: t("men"), ft: (h.mh || 0) - Math.round((h.mh || 0) * (h.mpt || 0) / 100),
        pt: Math.round((h.mh || 0) * (h.mpt || 0) / 100), rate: h.mpt },
      { label: t("women"), ft: (h.wh || 0) - Math.round((h.wh || 0) * (h.wpt || 0) / 100),
        pt: Math.round((h.wh || 0) * (h.wpt || 0) / 100), rate: h.wpt }
    ];
    var maxTotal = d3.max(rows, function (r) { return r.ft + r.pt; }) || 1;
    var x = d3.scaleLinear().domain([0, maxTotal]).range([0, W - PAD_L - PAD_R]);

    rows.forEach(function (r, i) {
      var y = 6 + i * ROW;
      var g = svgEl.append("g").attr("transform", "translate(" + PAD_L + "," + y + ")");
      g.append("rect").attr("x", 0).attr("y", 0).attr("height", 13)
        .attr("width", Math.max(0, x(r.ft))).attr("fill", "#24405F").attr("rx", 1);
      g.append("rect").attr("x", x(r.ft)).attr("y", 0).attr("height", 13)
        .attr("width", Math.max(0, x(r.pt))).attr("fill", "#DD6B33").attr("rx", 1);
      svgEl.append("text").attr("class", "lab").attr("x", PAD_L - 8).attr("y", y + 10)
        .attr("text-anchor", "end").text(r.label);
      svgEl.append("text").attr("class", "val")
        .attr("x", PAD_L + x(r.ft + r.pt) + 6).attr("y", y + 10)
        .text(r.rate == null ? "" : r.rate.toFixed(1).replace(".", state.lang === "fr" ? "," : ".") + "%");
    });

    var leg = wrap.append("div").attr("class", "ptlegend");
    [[t("ftLabel"), "#24405F"], [t("ptLabel"), "#DD6B33"]].forEach(function (l) {
      var sp = leg.append("span");
      sp.append("i").style("background", l[1]);
      sp.append("text").text(l[0]);
    });
    return wrap.node();
  }

  function paintSide() {
    if (!state.selection) return overview();
    if (state.selection.type === "commune") return communePanel(state.selection.id);
    return firmPanel(state.selection.id);
  }

  function select(sel) { state.selection = sel; paintSide(); }

  // ---------------------------------------------------------------- tooltip
  function showTip(html, e) {
    var stage = document.querySelector(".stage").getBoundingClientRect();
    tip.html(html).classed("on", true)
      .style("left", (e.clientX - stage.left + 14) + "px")
      .style("top", (e.clientY - stage.top + 14) + "px");
  }
  function hideTip() { tip.classed("on", false); }

  // ---------------------------------------------------------------- build
  function build(data) {
    D = data;
    colour = d3.scaleLinear().domain(SHARE_DOMAIN).range(RAMP).clamp(true);
    gapColour = d3.scaleLinear().domain(GAP_DOMAIN).range(GAP_RAMP).clamp(true);
    evoColour = d3.scaleLinear().domain(EVO_DOMAIN).range(EVO_RAMP).clamp(true);

    svg = d3.select("#map");
    studyFeatures = D.study.map(toFeature);

    projection = d3.geoMercator();
    path = d3.geoPath(projection);

    root = svg.append("g");
    gCtx = root.append("g");
    gCtx.selectAll("path.context")
      .data(D.context.map(toFeature)).join("path")
      .attr("class", "context");

    gMap = root.append("g");
    gMap.selectAll("path.commune")
      .data(studyFeatures).join("path")
      .attr("class", "commune")
      .each(function (d) {
        d.__c = D.communes[d.id] || { by_year: {}, reported: false, bcr: d.properties.bcr,
                                      name_fr: d.properties.name_fr, name_nl: d.properties.name_nl };
        d.__bcr = d.properties.bcr;
      })
      .on("mousemove", function (e, d) {
        var c = d.__c, v = communeValue(c), y = c.by_year[state.year];
        showTip("<b>" + communeName(c) + "</b>" +
          (v == null
            ? "<span class='r'>" + (y ? t("thin") : t("noData")) + "</span>"
            : "<span class='big'>" + fmtVal(v) + "</span><br><span class='r'>" +
              y.n + " " + t("records").toLowerCase() + "</span>"), e);
      })
      .on("mouseleave", hideTip)
      .on("click", function (e, d) {
        // Without this the click bubbles to the svg's background handler, which
        // clears the selection again and makes communes look unclickable.
        e.stopPropagation();
        if (communeValue(d.__c) != null) select({ type: "commune", id: d.id });
      });

    gFirms = root.append("g");
    // A 2 px dot is unclickable however far you zoom, because the marks are
    // held at a constant on-screen size. An invisible companion circle gives
    // every firm a finger-sized target without changing how it looks.
    gHits = root.append("g");
    gFirms.selectAll("circle.firm")
      .data(D.companies).join("circle")
      .attr("class", "firm")
      .attr("cx", function (d) { return projection(d.at)[0]; })
      .attr("cy", function (d) { return projection(d.at)[1]; })
      .on("mousemove", function (e, d) {
        var h = rec(d);
        if (!h) return;
        var v = firmValue(h);
        showTip("<b>" + d.name + "</b><span class='big'>" + fmtVal(v) + "</span>" +
          "<br><span class='r'>" + h.hc.toLocaleString(state.lang) + " " + t("staff") +
          " · " + d.commune_fr + " · " + recYear(d) + "</span>", e);
      })
      .on("mouseleave", hideTip)
      .on("click", function (e, d) { e.stopPropagation(); select({ type: "firm", id: d.id }); });

    gHits.selectAll("circle.hit")
      .data(D.companies).join("circle")
      .attr("class", "hit")
      .on("mousemove", function (e, d) {
        var h = rec(d);
        if (!h || !firmPasses(d)) return;
        var v = firmValue(h, d);
        showTip("<b>" + d.name + "</b><span class='big'>" + fmtVal(v) + "</span>" +
          "<br><span class='r'>" + h.hc.toLocaleString(state.lang) + " " + t("staff") +
          " \u00b7 " + d.commune_fr + " \u00b7 " + recYear(d) + "</span>", e);
      })
      .on("mouseleave", hideTip)
      .on("click", function (e, d) {
        if (!firmPasses(d)) return;
        e.stopPropagation();
        select({ type: "firm", id: d.id });
      });

    fit();

    zoomer = d3.zoom().scaleExtent([1, 14])
      .on("start", function () { svg.classed("dragging", true); })
      .on("end", function () { svg.classed("dragging", false); })
      .on("zoom", function (e) {
        root.attr("transform", e.transform);
        // Marks are point symbols, not geography: counter the transform so they
        // keep a constant on-screen size instead of growing into blobs.
        gFirms.selectAll("circle.firm").attr("r", function (d) {
          var h = rec(d);
          return h ? radius(h.hc) / markDivisor(e.transform.k) : 0;
        });
        gHits.selectAll("circle.hit").attr("r", function (d) {
          var h = rec(d);
          return h ? Math.max(radius(h.hc), 8) / markDivisor(e.transform.k) : 0;
        });
      });

    // Re-relax once the gesture settles. Doing it every frame would be wasteful,
    // and the layout only has to be right when the reader stops moving.
    var relaxTimer = null;
    zoomer.on("end.relax", function () {
      clearTimeout(relaxTimer);
      relaxTimer = setTimeout(layoutFirms, 120);
    });
    svg.call(zoomer);

    // d3 transitions run off requestAnimationFrame, which the browser throttles
    // whenever the page is not visible - so an animated zoom silently does
    // nothing in a background tab. Animate only when it is safe to, and always
    // fall back to applying the transform outright.
    // Apply the transform outright, never through a transition.
    //
    // d3 transitions are driven by requestAnimationFrame, which browsers
    // throttle whenever they judge the page not to be actively displayed -
    // embedded, backgrounded, occluded. `document.hidden` does not reliably
    // report that, so an animated zoom silently does nothing and the buttons
    // appear dead. A control that always works beats one that sometimes glides.
    applyZoom = function (fn, arg) { svg.call(fn, arg); };
    d3.select("#zoom-in").on("click", function () { applyZoom(zoomer.scaleBy, 1.6); });
    d3.select("#zoom-out").on("click", function () { applyZoom(zoomer.scaleBy, 1 / 1.6); });
    d3.select("#zoom-reset").on("click", function () {
      applyZoom(zoomer.transform, d3.zoomIdentity);
      d3.select("#q").property("value", "");
      d3.select("#results").classed("on", false);
      select(null);
    });

    svg.on("click", function () { select(null); });

    buildSegments();
    buildChips();
    paintSizeKey();
    applyLang();
    paintLegend();
    render();
  }

  // Refit whenever the chosen area changes: the projection frames only the
  // communes actually in view, so switching to Brussels-Capital zooms in
  // instead of leaving the city as a speck in a Brabant-shaped frame.
  function fit() {
    var box = svg.node().getBoundingClientRect();
    var shown = studyFeatures.filter(function (f) { return inScope({ bcr: f.properties.bcr }); });
    if (!shown.length) shown = studyFeatures;
    projection.fitExtent([[64, 58], [box.width - 64, box.height - 96]],
                         { type: "FeatureCollection", features: shown });
    gMap.selectAll("path.commune").attr("d", path);
    gCtx.selectAll("path.context").attr("d", path);
    layoutFirms();
    if (zoomer && root) {
      root.attr("transform", null);
      svg.call(zoomer.transform, d3.zoomIdentity);
    }
  }

  // Companies sit at their commune's centroid, so dozens share a coordinate
  // exactly and would draw as one mark.
  //
  // The relaxation runs in SCREEN space at the current zoom, the way the
  // Digital Leaders map does it, which makes it self-cancelling: as you zoom
  // in, real separation grows, the collisions stop happening, and every dot
  // settles onto its true position. Displacement only ever exists where marks
  // would otherwise be indistinguishable.
  function layoutFirms() {
    var k = zoomK();
    var live = D.companies.filter(function (d) { return inScope(d) && rec(d); });
    D.companies.forEach(function (d) { d.x = d.y = null; });

    var nodes = live.map(function (d) {
      var p = projection(d.at);
      return { d: d, tx: p[0] * k, ty: p[1] * k, x: p[0] * k, y: p[1] * k };
    });
    d3.forceSimulation(nodes)
      .force("home-x", d3.forceX(function (n) { return n.tx; }).strength(0.28))
      .force("home-y", d3.forceY(function (n) { return n.ty; }).strength(0.28))
      .force("collide", d3.forceCollide(function (n) {
        return radius(rec(n.d).hc) + 1;        // on-screen radius plus a hair
      }).strength(1).iterations(3))
      .stop()
      .tick(220);

    // Back into the zoom group's own units.
    nodes.forEach(function (n) { n.d.x = n.x / k; n.d.y = n.y / k; });

    gFirms.selectAll("circle.firm")
      .attr("cx", function (d) { return d.x == null ? -9999 : d.x; })
      .attr("cy", function (d) { return d.y == null ? -9999 : d.y; })
      .attr("r", function (d) {
        var h = rec(d);
        return h ? radius(h.hc) / markDivisor(k) : 0;
      });
    gHits.selectAll("circle.hit")
      .attr("cx", function (d) { return d.x == null ? -9999 : d.x; })
      .attr("cy", function (d) { return d.y == null ? -9999 : d.y; })
      .attr("r", function (d) {
        var h = rec(d);
        return h ? Math.max(radius(h.hc), 8) / markDivisor(k) : 0;
      });
  }

  function toFeature(c) {
    return { type: "Feature", id: c.id, geometry: c.geometry,
             properties: { name_fr: c.name_fr, name_nl: c.name_nl, bcr: !!c.bcr } };
  }

  function paintLegend() {
    var dom = activeDomain();
    var lo = dom[0], hi = dom[dom.length - 1], sc = scale();
    var unit = state.metric === "share" ? "%" : "";
    var r = d3.select("#ramp").html("");
    d3.range(0, 40).forEach(function (i) {
      r.append("i").style("background", sc(lo + (i / 39) * (hi - lo)));
    });
    if (state.metric === "parttime") {
      // A signed gap needs its direction spelled out, not just its numbers.
      d3.select("#ramp-lo").text(t("gapMen"));
      d3.select("#ramp-hi").text(t("gapWomen"));
    } else {
      // The colour scale clamps at both ends, so a company at 60% and one at
      // 95% are drawn identically. Saying "50%" at the top implies the scale
      // reaches its maximum there; it does not, and 120 companies sit above it.
      d3.select("#ramp-lo").text("≤" + lo + unit);
      d3.select("#ramp-hi").text("≥"
        + (hi > 0 && state.metric !== "share" ? "+" : "") + hi + unit);
    }
    d3.select("#legend-title").text(t(
      state.metric === "parttime" ? "legendGap"
      : state.metric === "evolution" ? "legendEvo" : "legendTitle"));

    paintDist();
    paintRangeText();
  }


  // A distribution you drag across, instead of two sliders whose numbers mean
  // nothing until you have already moved them. The bars show where companies
  // actually sit on the active measure, coloured by the same scale as the map,
  // so the filter and the legend are the same object.
  function paintDist() {
    var svgEl = d3.select("#dist");
    svgEl.selectAll("*").remove();
    if (!D) return;
    var dom = activeDomain(), lo = dom[0], hi = dom[dom.length - 1];
    var W = 180, H = 42, BOT = 9;

    var vals = D.companies.filter(function (f) {
      return inScope(f) && state.families.has(f.family) && rec(f);
    }).map(function (f) { return firmValue(rec(f), f); })
      .filter(function (v) { return v != null; });

    var x = d3.scaleLinear().domain([lo, hi]).range([0, W]).clamp(true);
    var bins = d3.bin().domain([lo, hi]).thresholds(28)(vals);
    var maxN = d3.max(bins, function (b) { return b.length; }) || 1;
    var y = d3.scaleLinear().domain([0, maxN]).range([H - BOT, 2]);

    var sel = state.range;
    svgEl.append("g").selectAll("rect").data(bins).join("rect")
      .attr("class", function (b) {
        var mid = (b.x0 + b.x1) / 2;
        return "bar" + (sel && (mid < sel[0] || mid > sel[1]) ? " out" : "");
      })
      .attr("x", function (b) { return x(b.x0); })
      .attr("width", function (b) { return Math.max(1, x(b.x1) - x(b.x0) - 0.7); })
      .attr("y", function (b) { return y(b.length); })
      .attr("height", function (b) { return (H - BOT) - y(b.length); })
      .attr("fill", function (b) { return scale()((b.x0 + b.x1) / 2); });

    svgEl.append("line").attr("x1", 0).attr("x2", W)
      .attr("y1", H - BOT).attr("y2", H - BOT)
      .attr("stroke", "#B9A987").attr("stroke-width", 0.7);

    var brush = d3.brushX()
      .extent([[0, 0], [W, H - BOT]])
      .on("end", function (e) {
        if (!e.sourceEvent) return;
        if (!e.selection) { state.range = null; }
        else {
          var a = x.invert(e.selection[0]), b = x.invert(e.selection[1]);
          state.range = (Math.abs(a - lo) < 0.3 && Math.abs(b - hi) < 0.3) ? null
                      : [Math.round(a * 10) / 10, Math.round(b * 10) / 10];
        }
        paintDist();
        paintRangeText();
        render();
      });
    var g = svgEl.append("g").attr("class", "brush").call(brush);
    if (sel) g.call(brush.move, [x(sel[0]), x(sel[1])]);

    svgEl.append("text").attr("class", "axis").attr("x", 0).attr("y", H - 1).text(lo);
    svgEl.append("text").attr("class", "axis").attr("x", W).attr("y", H - 1)
      .attr("text-anchor", "end").text((hi > 0 && state.metric !== "share" ? "+" : "") + hi);
  }

  function paintRangeText() {
    var dom = activeDomain(), lo = dom[0], hi = dom[dom.length - 1];
    var r = state.range;
    d3.select("#rangetext").text(
      r ? fmtVal(r[0]) + " \u2192 " + fmtVal(r[1]) : fmtVal(lo) + " \u2192 " + fmtVal(hi));
    d3.select("#rangeclear").style("visibility", r ? "visible" : "hidden");
  }

  function countShown() {
    if (!D) return 0;
    return D.companies.filter(function (f) { return firmPasses(f); }).length;
  }

  // The range gate. Anything without a value under the active measure is out:
  // a company with one filing has no evolution, and hiding it is more honest
  // than parking it at zero.
  function inRange(v) {
    if (!state.range) return true;
    if (v == null) return false;
    return v >= state.range[0] && v <= state.range[1];
  }

  // View and area are exclusive choices, not filters: exactly one is always on.
  function buildSegments() {
    d3.select("#viewmode").selectAll("button")
      .data([["companies", "viewFirms"], ["regions", "viewRegions"]]).join("button")
      .attr("class", "chip").attr("data-i18n-seg", function (d) { return d[1]; })
      .attr("aria-pressed", function (d) { return state.view === d[0]; })
      .on("click", function (e, d) {
        state.view = d[0];
        select(null);
        d3.select("#viewmode").selectAll("button")
          .attr("aria-pressed", function (x) { return state.view === x[0]; });
        render();
      });
    d3.select("#metricmode").selectAll("button")
      .data([["share", "metricShare"], ["parttime", "metricPt"],
             ["evolution", "metricEvo"]]).join("button")
      .attr("class", "chip").attr("data-i18n-seg", function (d) { return d[1]; })
      .attr("aria-pressed", function (d) { return state.metric === d[0]; })
      .on("click", function (e, d) {
        state.metric = d[0];
        state.range = null;                 // a range on one measure means nothing on another
        // Explain a measure the first time it is picked, then stay out of the
        // way - the "?" beside MEASURE brings it back on demand.
        if (!seenMeasure[d[0]]) { seenMeasure[d[0]] = true; openSheet(measureHtml()); }
        d3.select("#metricmode").selectAll("button")
          .attr("aria-pressed", function (x) { return state.metric === x[0]; });
        paintLegend();
        render();
      });
    d3.select("#scopemode").selectAll("button")
      .data([["bcr", "scopeBcr"], ["metro", "scopeMetro"]]).join("button")
      .attr("class", "chip").attr("data-i18n-seg", function (d) { return d[1]; })
      .attr("aria-pressed", function (d) { return state.scope === d[0]; })
      .on("click", function (e, d) {
        state.scope = d[0];
        select(null);
        d3.select("#scopenote").text(t(state.scope === "bcr" ? "noteBcr" : "noteMetro"));
        d3.select("#scopemode").selectAll("button")
          .attr("aria-pressed", function (x) { return state.scope === x[0]; });
        fit();
        render();
      });
  }

  // Three reference marks beside the label, drawn at the exact radii the map
  // uses for a small, mid-size and large employer - so the control doubles as
  // the size key and the legend box stays small.
  function paintSizeKey() {
    // Median headcount of each band in this dataset: 17, 85, 424.
    var rs = [radius(17), radius(85), radius(424)];
    var pad = 4, gap = 7;
    var w = rs.reduce(function (a, r) { return a + r * 2 + gap; }, pad);
    var h = Math.ceil(rs[rs.length - 1] * 2) + 2;
    var svgEl = d3.select("#sizekey").html("")
      .attr("viewBox", "0 0 " + Math.ceil(w) + " " + h)
      .attr("width", Math.ceil(w)).attr("height", h);
    var x = pad;
    rs.forEach(function (r) {
      svgEl.append("circle").attr("cx", x + r).attr("cy", h / 2).attr("r", r);
      x += r * 2 + gap;
    });
  }

  function buildChips() {
    // The division number is methodology, not a label - it lives in the
    // methodology sheet's code table instead.
    d3.select("#families").selectAll("button").data(FAMILIES).join("button")
      .attr("class", "chip").attr("aria-pressed", "true")
      .text(function (d) { return famLabel(d); })
      .on("click", function (e, d) {
        if (!toggle(state.families, d)) return;
        d3.select(this).attr("aria-pressed", state.families.has(d));
        render();
      });
    d3.select("#sizes").selectAll("button").data(SIZES).join("button")
      .attr("class", "chip").attr("aria-pressed", "true").text(function (d) { return d.id; })
      .on("click", function (e, d) {
        if (!toggle(state.sizes, d.id)) return;
        d3.select(this).attr("aria-pressed", state.sizes.has(d.id));
        render();
      });
  }

  // Emptying a group would blank the map, so the last active chip simply
  // refuses to switch off. Snapping the whole group back on instead - which is
  // what this used to do - looked like the filter had reset itself.
  function toggle(set, key) {
    if (set.has(key)) {
      if (set.size === 1) return false;      // keep the last one lit
      set.delete(key);
    } else set.add(key);
    return true;
  }

  function applyLang() {
    document.documentElement.lang = state.lang;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-seg]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-i18n-seg"));
    });
    document.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
      el.placeholder = t(el.getAttribute("data-i18n-ph"));
    });
    document.title = t("title");
    document.getElementById("maptitle").textContent = t("title");
    d3.select("#scopenote").text(t(state.scope === "bcr" ? "noteBcr" : "noteMetro"));
    if (D) paintLegend();
    d3.select("#lang-fr").attr("aria-pressed", state.lang === "fr");
    d3.select("#lang-en").attr("aria-pressed", state.lang === "en");
  }


  // ---------------------------------------------------------------- sheet
  var CODE_TABLE =
    "<table class='codetable'><thead><tr><th>Code</th><th>Activity</th><th>Division</th></tr></thead><tbody>"
    + "<tr><td>62100</td><td>Computer programming</td><td rowspan='3'>62 \u00b7 Programming &amp; consultancy</td></tr>"
    + "<tr><td>62200</td><td>IT consultancy &amp; facilities management</td></tr>"
    + "<tr><td>62900</td><td>Other IT services</td></tr>"
    + "<tr><td>61100</td><td>Wired, wireless &amp; satellite telecoms</td><td rowspan='3'>61 \u00b7 Telecommunications</td></tr>"
    + "<tr><td>61200</td><td>Telecom resale &amp; intermediation</td></tr>"
    + "<tr><td>61900</td><td>Other telecoms</td></tr>"
    + "<tr><td>58210</td><td>Video game publishing</td><td rowspan='2'>58 \u00b7 Software publishing</td></tr>"
    + "<tr><td>58290</td><td>Other software publishing</td></tr>"
    + "<tr><td>26110</td><td>Electronic components</td><td rowspan='5'>26 \u00b7 Electronics manufacturing</td></tr>"
    + "<tr><td>26120</td><td>Assembled electronic boards</td></tr>"
    + "<tr><td>26200</td><td>Computers &amp; peripherals</td></tr>"
    + "<tr><td>26300</td><td>Communication equipment</td></tr>"
    + "<tr><td>26400</td><td>Consumer electronics</td></tr>"
    + "<tr><td>63100</td><td>Hosting, data processing &amp; infrastructure</td><td>63 \u00b7 Information services</td></tr>"
    + "</tbody></table>";

  var COPY = {
    en: {
      about:
        "<h3>How to read this map</h3>"
        + "<p class='lede'>Every company in Belgium files its staff numbers by sex with the "
        + "National Bank each year. This map reads five years of those filings \u2014 not a "
        + "survey, not estimates.</p>"

        + "<h4>The 14 activity codes I used</h4>" + CODE_TABLE
        + "<p><b>Not included:</b> 63910 and 63920 (web portals and \u201cother information "
        + "services\u201d) \u2014 catch-alls holding a call centre, a printer and a charity. "
        + "Book and newspaper publishing, and non-computing electronics such as clocks and "
        + "optical instruments.</p>"

        + "<h4>Which companies count</h4>"
        + "<ul><li>An ICT code must be the company\u2019s <b>registered main activity</b>, not a "
        + "side listing. Louis Vuitton Services Europe carries an ICT code; its main activity is "
        + "call centres, so it is out.</li>"
        + "<li><b>Two hand-curated lists sit either side of that rule</b>, because a register "
        + "code and a company\u2019s actual business sometimes disagree in both directions. A "
        + "keep-list adds back firms the rule wrongly excludes; a drop-list removes firms it "
        + "wrongly admits \u2014 usually companies whose second registered activity, not the "
        + "ICT one, is the real business. Both lists are short and every entry carries its "
        + "reason.</li>"
        + "<li><b>10 staff minimum.</b></li>"
        + "<li><b>“Brussels” means the registered seat is in Brussels-Capital, or the "
        + "company runs an establishment there.</b> 51 firms registered just outside qualify on "
        + "that second test and are marked “BXL site” wherever they appear.</li></ul>"

        + "<h4>Coverage</h4>"
        + "<p>The same method was applied to all four areas, and each was read to the same completeness \u2014 the periphery is not a thinner sample than Brussels.</p>"
        + '<table class="codetable covtable"><thead><tr><th>Area</th><th>In the register</th><th>Retrieved</th><th>Coverage</th></tr></thead><tbody><tr><td>Brussels-Capital</td><td>10,129</td><td>10,119</td><td>99.90%</td></tr><tr><td>Leuven area</td><td>5,601</td><td>5,598</td><td>99.95%</td></tr><tr><td>Flemish Brabant</td><td>4,964</td><td>4,963</td><td>99.98%</td></tr><tr><td>Walloon Brabant</td><td>4,123</td><td>4,119</td><td>99.90%</td></tr></tbody></table>'
        + "<p>The shortfall is 212 companies that carry these activities only under the older NACE 2008 coding: 114 in Brussels, 42 around Leuven, 28 in each Brabant. It is proportional to size, so it does not favour one area over another.</p>"
        + "<h4>What it shows</h4>"
        + "<p>Employers at their most recent filing, placed in the commune where they are "
        + "registered. Communes show the share of women across their ICT staff.</p>"

        + "<h4>What it cannot show</h4>"
        + "<ul><li><b>Not roles</b></li><li><b>Not pay or seniority</b></li>"
        + "<li><b>Not street addresses</b></li><li><b>Not all of Belgium</b></li></ul>",

      m_share: "<h3>Female share</h3>"
        + "<p>Women as a share of the workforce, counted in <b>people</b>.</p>"
        + "<p>Everyone on the payroll counts once, whether they work five days a week or two. "
        + "So this answers one question only: how many of the people here are women. How those "
        + "people split their hours is a separate question, and the part-time view answers it.</p>"
        + "<p><b>Read it as:</b> red is few women, green approaches balance. A commune shows the "
        + "share of women across all its ICT staff.</p>",

      m_parttime: "<h3>Part-time gap</h3>"
        + "<p>Who does the part-time work, inside a single company \u2014 the share of women "
        + "working part-time minus the share of men, in percentage points.</p>"
        + "<p><b>Read it as:</b> pale means the two sexes take part-time work at the same rate. "
        + "Orange means women take more of it, navy means men do. The deeper the colour, the "
        + "wider the gap.</p>",

      m_evolution: "<h3>Evolution</h3>"
        + "<p>The change in female share between a company\u2019s first and latest filing.</p>"
        + "<p><b>Read it as:</b> green is rising, red is falling. The scale stops at \u00b115 "
        + "points, so a few extreme movers don\u2019t flatten everyone else.</p>"
        + "<p><b>Careful:</b> a falling share can still mean more women. Open a company to see "
        + "the headcounts behind it.</p>"
    }
  };
  var CODE_TABLE_FR =
    "<table class='codetable'><thead><tr><th>Code</th><th>Activit\u00e9</th><th>Division</th></tr></thead><tbody>"
    + "<tr><td>62100</td><td>Activit\u00e9s de programmation informatique</td><td rowspan='3'>62 \u00b7 Programmation &amp; conseil</td></tr>"
    + "<tr><td>62200</td><td>Conseil en informatique et gestion d\u2019installations informatiques</td></tr>"
    + "<tr><td>62900</td><td>Autres activit\u00e9s de service informatique</td></tr>"
    + "<tr><td>61100</td><td>T\u00e9l\u00e9communications filaires, sans fil et satellitaires</td><td rowspan='3'>61 \u00b7 T\u00e9l\u00e9communications</td></tr>"
    + "<tr><td>61200</td><td>Revente de t\u00e9l\u00e9communications et interm\u00e9diation</td></tr>"
    + "<tr><td>61900</td><td>Autres activit\u00e9s de t\u00e9l\u00e9communications</td></tr>"
    + "<tr><td>58210</td><td>\u00c9dition de jeux vid\u00e9o</td><td rowspan='2'>58 \u00b7 \u00c9dition de logiciels</td></tr>"
    + "<tr><td>58290</td><td>\u00c9dition d\u2019autres logiciels</td></tr>"
    + "<tr><td>26110</td><td>Fabrication de composants \u00e9lectroniques</td><td rowspan='5'>26 \u00b7 Fabrication \u00e9lectronique</td></tr>"
    + "<tr><td>26120</td><td>Fabrication de cartes \u00e9lectroniques assembl\u00e9es</td></tr>"
    + "<tr><td>26200</td><td>Fabrication d\u2019ordinateurs et d\u2019\u00e9quipements p\u00e9riph\u00e9riques</td></tr>"
    + "<tr><td>26300</td><td>Fabrication d\u2019\u00e9quipements de communication</td></tr>"
    + "<tr><td>26400</td><td>Fabrication de produits \u00e9lectroniques grand public</td></tr>"
    + "<tr><td>63100</td><td>Infrastructure informatique, traitement de donn\u00e9es et h\u00e9bergement</td><td>63 \u00b7 Services d\u2019information</td></tr>"
    + "</tbody></table>";

  COPY.fr = {
    about:
      "<h3>Comment lire cette carte</h3>"
      + "<p class='lede'>Chaque entreprise belge d\u00e9pose tous les ans un bilan social \u00e0 la "
      + "Banque nationale, o\u00f9 elle ventile son personnel par sexe. Cette carte lit cinq "
      + "ann\u00e9es de ces d\u00e9p\u00f4ts\u202f: ce ne sont ni des estimations, ni des "
      + "d\u00e9clarations volontaires.</p>"

      + "<h4>Les 14 codes d\u2019activit\u00e9 retenus</h4>" + CODE_TABLE_FR
      + "<p><b>\u00c9cart\u00e9s\u202f:</b> les codes 63910 et 63920 (portails web et «\u202fautres "
      + "services d\u2019information\u202f»), fourre-tout qui abritaient un centre d\u2019appels, une "
      + "imprimerie et une ONG. Ainsi que l\u2019\u00e9dition de livres et de presse, et "
      + "l\u2019\u00e9lectronique non informatique \u2014 horlogerie, optique, appareils "
      + "m\u00e9dicaux.</p>"

      + "<h4>Quelles entreprises comptent</h4>"
      + "<ul><li>Un code TIC doit \u00eatre l\u2019<b>activit\u00e9 principale enregistr\u00e9e</b> "
      + "de l\u2019entreprise, et pas une activit\u00e9 secondaire. Louis Vuitton Services Europe "
      + "porte un code TIC, mais son activit\u00e9 principale est «\u202fcentres "
      + "d\u2019appels\u202f»\u202f: elle est exclue.</li>"
      + "<li><b>Deux listes tenues à la main encadrent cette règle</b>, car le "
      + "code enregistré et le métier réel divergent parfois dans les deux "
      + "sens. Une liste d’ajout réintègre les entreprises que la règle "
      + "exclut à tort ; une liste d’exclusion retire celles qu’elle "
      + "admet à tort, le plus souvent des sociétés dont la seconde "
      + "activité enregistrée, et non les TIC, constitue le vrai métier. Les "
      + "deux listes sont courtes et chaque entrée porte son motif.</li>"
      + "<li><b>10 salari\u00e9s minimum.</b></li>"
      + "<li><b>\u00ab\u202fBruxelles\u202f\u00bb d\u00e9signe un si\u00e8ge social en R\u00e9gion "
      + "bruxelloise, ou un si\u00e8ge d\u2019exploitation qui s\u2019y trouve.</b> 51 "
      + "entreprises enregistr\u00e9es juste \u00e0 l\u2019ext\u00e9rieur remplissent ce second "
      + "crit\u00e8re et portent la mention \u00ab\u202fsite BXL\u202f\u00bb.</li></ul>"

      + "<h4>Couverture</h4>"
      + "<p>La m\u00eame m\u00e9thode a \u00e9t\u00e9 appliqu\u00e9e aux quatre zones, lues avec la m\u00eame exhaustivit\u00e9\u202f: la p\u00e9riph\u00e9rie n\u2019est pas un \u00e9chantillon plus mince que Bruxelles.</p>"
      + '<table class="codetable covtable"><thead><tr><th>Zone</th><th>Dans le registre</th><th>Récupérées</th><th>Couverture</th></tr></thead><tbody><tr><td>Bruxelles-Capitale</td><td>10 129</td><td>10 119</td><td>99,90 %</td></tr><tr><td>Région de Louvain</td><td>5 601</td><td>5 598</td><td>99,95 %</td></tr><tr><td>Brabant flamand</td><td>4 964</td><td>4 963</td><td>99,98 %</td></tr><tr><td>Brabant wallon</td><td>4 123</td><td>4 119</td><td>99,90 %</td></tr></tbody></table>'
      + "<p>Le manque porte sur 212 entreprises dont ces activit\u00e9s ne figurent que sous l\u2019ancien code NACE 2008\u202f: 114 \u00e0 Bruxelles, 42 autour de Louvain, 28 dans chaque Brabant. Il est proportionnel \u00e0 la taille de chaque zone.</p>"
      + "<h4>Ce que la carte montre</h4>"
      + "<p>Des employeurs, \u00e0 leur dernier d\u00e9p\u00f4t, situ\u00e9s dans la commune de "
      + "leur si\u00e8ge social. Une commune affiche la part des femmes parmi tout son personnel TIC.</p>"

      + "<h4>Ce qu\u2019elle ne montre pas</h4>"
      + "<ul><li><b>Pas les m\u00e9tiers</b></li><li><b>Ni salaires, ni anciennet\u00e9</b></li>"
      + "<li><b>Pas d\u2019adresses</b></li><li><b>Pas toute la Belgique</b></li></ul>",

    m_share: "<h3>Part des femmes</h3>"
      + "<p>La part des femmes dans l’effectif, comptée en <b>personnes</b>.</p>"
      + "<p>Chaque personne employée compte pour une, qu’elle travaille cinq jours "
      + "par semaine ou deux. Ce chiffre répond donc à une seule question : "
      + "combien de ces personnes sont des femmes. La répartition des heures est une "
      + "autre question, traitée par la vue temps partiel.</p>"
      + "<p><b>\u00c0 lire ainsi\u202f:</b> le rouge signale peu de femmes, le vert s\u2019approche "
      + "de la parit\u00e9. Une commune affiche la part des femmes parmi son personnel TIC.</p>",

    m_parttime: "<h3>\u00c9cart temps partiel</h3>"
      + "<p>Qui assume le temps partiel dans une m\u00eame entreprise\u202f: la part des femmes "
      + "\u00e0 temps partiel moins celle des hommes, en points.</p>"
      + "<p><b>\u00c0 lire ainsi\u202f:</b> le beige signale un recours identique. L\u2019orange "
      + "indique que les femmes en assument davantage, le bleu que ce sont les hommes. Plus la "
      + "couleur est dense, plus l\u2019\u00e9cart est large.</p>",

    m_evolution: "<h3>\u00c9volution</h3>"
      + "<p>La variation de la part des femmes entre le premier d\u00e9p\u00f4t d\u2019une "
      + "entreprise et le plus r\u00e9cent.</p>"
      + "<p><b>\u00c0 lire ainsi\u202f:</b> le vert monte, le rouge descend. L\u2019\u00e9chelle "
      + "s\u2019arr\u00eate \u00e0 \u00b115 points, pour que quelques cas extr\u00eames "
      + "n\u2019\u00e9crasent pas tous les autres.</p>"
      + "<p><b>Attention\u202f:</b> une part qui baisse peut cacher une hausse du nombre de "
      + "femmes. Ouvrez une entreprise pour voir les effectifs derri\u00e8re le pourcentage.</p>"
  };

  function openSheet(html) {
    d3.select("#sheetbody").html(html);
    d3.select("#sheet").attr("hidden", null);
  }

  function closeSheet() { d3.select("#sheet").attr("hidden", true); }

  function aboutHtml() { return (COPY[state.lang] || COPY.en).about; }

  function measureHtml() {
    var c = COPY[state.lang] || COPY.en;
    return c["m_" + state.metric] || c.m_share;
  }

  // ---------------------------------------------------------------- search
  function norm(x) {
    return (x || "").toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "");
  }

  // Every token has to appear somewhere in the haystack, in any order, and a
  // space-free version is matched too. So "wizards data", "data wizards" and
  // "datawizards" all find DATA WIZARDS SOLUTIONS, and a commune matches on
  // either language regardless of which one is on screen.
  function matches(q, haystacks) {
    var hay = haystacks.filter(Boolean).map(norm).join(" ");
    var flat = hay.replace(/ /g, "");
    var tokens = norm(q).split(/\s+/).filter(Boolean);
    if (!tokens.length) return false;
    return tokens.every(function (tk) {
      return hay.indexOf(tk) !== -1 || flat.indexOf(tk) !== -1;
    });
  }

  function searchHits(q) {
    var out = [];
    if (norm(q).replace(/\s+/g, "").length < 2) return out;
    D.companies.forEach(function (f) {
      if (inScope(f) && matches(q, [f.name, f.commune_fr, f.family])) {
        out.push({ kind: "firm", id: f.id, label: f.name, sub: f.commune_fr });
      }
    });
    Object.keys(D.communes).forEach(function (id) {
      var c = D.communes[id];
      if (!inScope(c)) return;
      if (matches(q, [c.name_fr, c.name_nl])) {
        out.push({ kind: "commune", id: id, label: communeName(c),
                   sub: c.records + " " + t("records").toLowerCase() });
      }
    });
    // Communes first: there are 14 of them against hundreds of companies, so a
    // name that is both (Bruxelles) would otherwise be buried.
    out.sort(function (a, b) {
      if (a.kind !== b.kind) return a.kind === "commune" ? -1 : 1;
      return a.label.localeCompare(b.label);
    });
    return out.slice(0, 40);
  }

  function runSearch() {
    var q = document.getElementById("q").value;
    var hits = searchHits(q);
    var box = d3.select("#results");
    if (!q || q.length < 2) return box.classed("on", false).html("");
    if (!hits.length) {
      return box.classed("on", true)
        .html('<div class="none">' + t("noResults") + "</div>");
    }
    box.classed("on", true).html("");
    box.selectAll("button").data(hits).join("button")
      .html(function (d) {
        var safe = d.label.replace(/[&<>]/g, function (c) {
          return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c];
        });
        return safe + '<span class="kind">' +
               t(d.kind === "firm" ? "kindFirm" : "kindCommune") + "</span>";
      })
      .on("click", function (e, d) {
        document.getElementById("q").value = d.label;
        box.classed("on", false);
        // A company is only visible in the companies view; jump there rather
        // than selecting something the map is not currently drawing.
        if (d.kind === "firm" && state.view !== "companies") {
          state.view = "companies";
          d3.select("#viewmode").selectAll("button")
            .attr("aria-pressed", function (x) { return state.view === x[0]; });
        }
        select({ type: d.kind, id: d.id });
        render();
        if (d.kind === "firm") flyTo(d.id);
      });
  }


  // Fly the map to a company and leave it under the cursor. Centred on its
  // projected coordinate rather than its relaxed screen position, because the
  // relaxation re-runs at the new zoom and would otherwise leave it off-centre.
  function flyTo(id) {
    var f = D.companies.find(function (x) { return x.id === id; });
    if (!f || !applyZoom) return;
    var box = svg.node().getBoundingClientRect();
    var p = projection(f.at);
    // Deep enough to separate a dense commune, shallow enough to keep the
    // surrounding city on screen - at 7x the reader lands on blank ground.
    var K = 3.4;
    applyZoom(zoomer.transform,
      d3.zoomIdentity.translate(box.width / 2, box.height / 2).scale(K)
        .translate(-p[0], -p[1]), 480);
  }

  // ---------------------------------------------------------------- controls

  ["fr", "en"].forEach(function (l) {
    d3.select("#lang-" + l).on("click", function () {
      state.lang = l; applyLang(); render();
    });
  });

  d3.select("#rangeclear").on("click", function () {
    state.range = null; paintLegend(); render();
  });
  d3.select("#about").on("click", function () { openSheet(aboutHtml()); });
  d3.select("#measurehelp").on("click", function () { openSheet(measureHtml()); });
  d3.select("#sheetclose").on("click", closeSheet);
  d3.select("#sheet").on("click", function (e) { if (e.target === this) closeSheet(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeSheet();
  });

  d3.select("#q").on("input", function () { if (D) runSearch(); })
    .on("keydown", function (e) {
      if (e.key === "Escape") { this.value = ""; d3.select("#results").classed("on", false); }
    });
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".search")) d3.select("#results").classed("on", false);
  });

  // The first fit runs the moment the data lands, which can be before the web
  // fonts arrive and before the toolbar has finished wrapping - both change the
  // map's height, and the projection was framed against the old box. Watching
  // the stage re-frames on any layout change, including the window resize this
  // used to handle on its own.
  var refitTimer = null;
  function scheduleRefit() {
    clearTimeout(refitTimer);
    refitTimer = setTimeout(function () { if (D) { fit(); render(); } }, 60);
  }
  window.addEventListener("resize", scheduleRefit);
  if (window.ResizeObserver) {
    new ResizeObserver(scheduleRefit).observe(document.querySelector(".stage"));
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(scheduleRefit);
  }

  tip = d3.select("#tip");
  d3.json("./bxl-data.json?v=3").then(build).catch(function (err) {
    d3.select("#side").html("<h2>Data failed to load</h2><p class='sub'>" +
      err.message + "</p>");
    console.error(err);
  });
})();
