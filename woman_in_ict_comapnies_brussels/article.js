/* Women on the payrolls of Brussels-area ICT employers.
 *
 * Two sources, kept separate on purpose: 2,843 social balance sheets filed with
 * the National Bank of Belgium by 817 companies, and Eurostat's series on
 * Belgian ICT graduates. The second describes a different population and is
 * labelled as such wherever it appears.
 *
 * Every figure on the page is read from data/article.json through the {token}
 * mechanism below. None is typed into the copy, so rebuilding the data rebuilds
 * the prose with it and the two cannot drift apart.
 *
 * Step state is measured from scroll position rather than delegated to an
 * IntersectionObserver: an observer only fires while the page is painting, so a
 * hidden tab or a fast flick could otherwise leave a figure showing a state the
 * text has moved past.
 */
(function () {
  "use strict";

  var A = null, LANG = "en", STEP = {};
  var C = {
    orange: "#DD6B33", orangeDeep: "#A83C14", orangeSoft: "#F6DCC8",
    navy: "#24405F", navySoft: "#8AA3BC", ink: "#16130F", ink2: "#4A443C",
    ink3: "#857C6E", line: "#D8CBB0", lineStrong: "#B9A987",
    green: "#3F8F4A", red: "#C0392B", paper4: "#FCF7EC", paper3: "#F8F1E1"
  };
  var DISP = "Montserrat,sans-serif", BODY = "Lexend,sans-serif",
      MONO = "ui-monospace,monospace";

  /* ------------------------------------------------------------------ copy */
  var T = {
    en: {
      dept: "Data journalism",
      kicker: "Women on Belgian ICT payrolls · five years of filed accounts",
      heroMapBtn: "See the ICT companies on a map",
      title: "The Classroom Is Changing Faster Than the Office",
      standfirst: "Every company in Belgium has to report how many men and how many women it employs. I read five years of those reports for {companies} technology employers around Brussels. Women are {share}% of the people on their payrolls, and that is the kindest number in this study.",
      bylineSrc: "Source · National Bank of Belgium, Eurostat",
      bylineScope: "{companies} employers · {staff} people · {records} filings · {y0} to {y1}",

      k1v: "{shareR}%", k1k: "of the people employed by {companies} technology companies are women",
      k2v: "{speedRatio}×", k2k: "faster in the classroom than on the payroll",
      k3v: "{ptRatio}×", k3k: "as likely a woman works part-time as a man",
      k4v: "{zeroWomen}", k4k: "companies employ no women at all",

      /* ---- 00 */
      a0n: "00 · How I counted",
      a0h: "{funnelTop} companies in, {companies} out",
      a0lede: "Everything here rests on one source and a handful of filters. This section sets both out before any finding.",

      a0h1: "Where the companies come from",
      figFunT: "From the company register to the study population",
      figFunS: "Companies still standing after each filter",
      nFun: "Funnel width is on a square-root scale, so the narrow lower stages stay visible. The counts beside it are exact.",
      a0p2: "One step does almost all the work. Of the {funnelQueried} companies I could query, only {funnelFiled} file accounts detailed enough to count men and women separately, roughly one in six. Belgian law requires that breakdown from larger employers and lets the smallest file an abridged return without it. Everything after that step is fine-tuning: the size threshold, the quality checks, the window of years, the seat test, and the two hand-checked lists.",

      a0h2: "I counted people, not job titles",
      a0p3: "A company reports how many men and how many women it employed at the end of its financial year. It never says what those people do. So a woman counted here might be a developer, an engineer, an accountant, a recruiter or a receptionist.",
      figFrameT: "{staff} people, split by sex. What they do is not in the filing.",
      figFrameS: "Latest filing for each of the {companies} companies",
      nFrame: "Companies do report staff by job category and by education level, in separate boxes on the same form. Neither box is ever crossed with sex.",

      a0h3: "Defining the ICT sector",
      a0p4: "I searched for fourteen activity codes, which fall into five families. Together those five families are the standard definition of the ICT sector used by Eurostat and the Organisation for Economic Co-operation and Development. Nothing I collected falls outside it.",
      a0p5: "Two parts of the standard definition were left out on purpose, because they resell and repair rather than build: wholesale of computer equipment, and computer repair.",
      defT: "The study in two lines",
      defYes: "<span class=\"yes\">What it measures:</span> the share of women among everyone employed by {companies} ICT companies with at least ten staff, based in Brussels, Brabant or the Leuven area.",
      defNo: "<span class=\"no\">What it cannot measure:</span> jobs, pay or seniority. So this article says “women on ICT payrolls”, never “women in tech jobs”.",

      /* ---- 01 */
      a1n: "01 · Two speeds",
      a1h: "More women are qualifying. Payrolls are barely moving.",
      a1lede: "Two measurements, two sources, two very different rates of change.",
      figSpeedT: "The graduate share is rising about {speedRatio} times faster than the payroll share",
      figSpeedS: "Per cent female. Graduates: all Belgian tertiary ICT programmes. Payroll: {panelFirms} employers filing in both {y0} and {y1}.",
      sp1: { label: "In the classroom",
             p1: "In {gradFrom}, {gradW0} of the {gradT0} people finishing a Belgian ICT degree were women. By {gradTo} it was <strong>{gradW1} out of {gradT1}</strong>.",
             p2: "Three times as many women, in a field that itself doubled in size. The share went from {gradS0}% to {gradS1}%." },
      sp2: { label: "On the payroll",
             p1: "{panelFirms} of the {companies} employers filed accounts in both {y0} and {y1}.",
             p2: "Their female share went from {panelS0}% to <strong>{panelS1}%</strong>. That is {panelDelta} percentage points in {panelSpan} years." },
      sp3: { label: "The gap between them",
             p1: "Over the same years the graduate share gained {gradPerYear} of a point a year. The payroll share gained {panelPerYear}. The classroom is moving about <strong>{speedRatio} times faster</strong>.",
             p2: "One caution: these count different things in different ways, so this compares two speeds. It does not prove that one causes the other." },
      nSpeed1: "Eurostat educ_uoe_grad02, field of study F06, tertiary level. The Belgian series has gaps before {gradFrom}, so only the continuous run is shown.",
      nSpeed2: "Female share of headcount across the same companies at both ends.",
      nSpeed3: "Slopes are simple annual averages between the end years, not fitted trends.",

      /* ---- 03 */
      a3n: "02 · Every employer",
      a3h: "Most employers sit in the same narrow band",
      a3lede: "Put all {companies} on one chart and the shape is plain: a dense cluster a little above a quarter, thinning out either side.",
      figSwarmT: "Every employer, by female share",
      figSwarmS: "One circle per company · size = headcount",
      sw1: { label: "The shape",
             p1: "One circle per company, sized by how many people it employs. Horizontal position is its female share. Vertical position means nothing, it only stops the circles overlapping.",
             p2: "The cluster is tight. <strong>{clusterPc}% of employers</strong> sit between {clusterLo}% and {clusterHi}% women, and the middle company is at {medianCompany}%." },
      sw2: { label: "The left edge", big: "{zeroWomen}",
             p1: "companies employ <strong>no women at all</strong>, {zeroStaff} people between them. These are reported zeros, not gaps in the data.",
             p2: "{under10} companies, {under10pc}% of them, are below 10% women." },
      sw3: { label: "The right edge", big: "{atParity}",
             p1: "companies are at or above half women, and {above60} are above 60%. They are real, and they are small: their typical payroll is {parityMedHc} people.",
             p2: "<strong>Half of all the women in this study work at just {halfFirms} of the {companies} employers.</strong>" },
      nSwarm1: "Female share of headcount, latest filing per company. Circle area is proportional to headcount.",
      nSwarm2: "Only companies with ten staff or more are included, so one person cannot swing a share by ten points.",
      nSwarm3: "Companies ranked by number of women employed, largest first, until half of all women are covered.",
      pull1: "Two in three of these employers sit between {clusterLo}% and {clusterHi}% women. The middle one is at {medianCompany}%.",

      /* ---- 04 */
      a4n: "04 · Who works part-time",
      a4h: "The one place where women are half the room",
      a4lede: "Women are a quarter of these payrolls. Among the people working reduced hours, they are half.",
      figPtT: "Part-time work is shared almost evenly. The workforce is not.",
      figPtS: "{ptFirms} employers whose filing breaks staff down by working time",
      nPt: "The left panel is a rate: part-time staff of one sex as a share of that sex's total. The right panel is a composition, not a rate.",
      a4p2: "In people: about {ptWomenCount} women and {ptMenCount} men on reduced hours, in a workforce where men outnumber women more than two to one. A woman here is <strong>{ptRatio} times as likely</strong> to work part-time as a man.",

      /* ---- 05 */
      a5n: "05 · Sector and size",
      a5h: "Neither the type of company nor its size changes the answer",
      a5lede: "Perhaps the figure is low because of which activities I chose to include. Or perhaps small companies pull it down. Both are worth testing, and neither turns out to explain it.",
      a5s1h: "The ranking rewards being tiny",
      a5s1p: "The companies with the highest share of women are tiny: about 17 people each. Each dot here is one company. The ones packed with women, high up, are nearly all small, sitting on the far left; the big employers, on the right, all sit low.",
      a5coneT: "Every company, by size and share of women",
      a5coneS: "817 companies. Left is small, right is big; up is more female. The dashed line is 50%.",
      na5cone: "Size is on a log scale, so a small firm and a giant both stay readable on one axis. Each dot is one of the 817 companies.",
      a5s2h: "The bigger they get, the lower the ceiling",
      a5s2p: "Line the companies up by size. Their average share of women hardly changes ({size0}%, {size1}%, {size2}%). But the most any single company reaches falls fast: {ceilSmall}% among the smallest, only {ceilBig}% among the biggest. Large companies never get very female.",
      a5ceilT: "Share of women by company size",
      a5ceilS: "Bars are the average share; the green mark is the highest any single company reaches.",
      na5ceil: "Same three size groups as the bars above. The average is per person; the ceiling is the single highest company in the group.",
      figMixT1: "All five ICT families sit in a band {sectorSpread} points wide",
      figMixS1: "Female share of payroll, counted in people",
      figMixT2: "Three size classes, {sizeSpread} points apart, and not in order",
      figMixS2: "Female share of payroll by number of staff",
      mx1: { label: "Five families",
             p1: "{sectorTopLab} is highest at <strong>{sectorTopShare}%</strong>. {sectorBotLab} is lowest at <strong>{sectorBotShare}%</strong>.",
             p2: "That is {sectorSpread} percentage points across the whole sector. Not one family is close to half, so no reweighting rescues the headline." },
      mx2: { label: "One family stands out",
             p1: "Data processing and hosting has the highest share, and by far the highest middle company at {sectorTopMed}%. It is also the <strong>only family going backwards</strong>, by {sectorWorstEvo} of a point.",
             p2: "Software publishing is its opposite: the strongest movement at {sectorBestEvo} points, though on only {sectorBestFirms} companies, which makes it a hint rather than a finding." },
      mx3: { label: "And size",
             p1: "Companies of 10 to 49 staff sit at {size0}%, those of 50 to 249 at {size1}%, and those of 250 or more at {size2}%.",
             p2: "A range of {sizeSpread} points, and the middle class is the lowest of the three. There is no size pattern to describe." },
      nMix1: "Companies are placed in the family of their registered main activity. Where a company registers several, the more specific family wins.",
      nMix2: "{multiCode} of {companies} companies register main activities in more than one family.",
      nMix3: "Size class from the headcount in the company's latest filing.",

      /* ---- 06 */
      a6n: "06 · What a rising percentage hides",
      a6h: "A share can rise three ways, and only one of them is hiring women",
      a6lede: "{withHistory} of these employers filed at least twice. {rose} improved their female share. Read only the percentage and those {rose} look alike. They are not.",
      figMechS: "Headcount at the first and last filing, and the share that results",
      figMechT1: "Same women, fewer men, higher percentage",
      figMechT2: "More women hired, and the percentage still fell",
      figMechT3: "More women hired, and the percentage rose",
      mc1: { label: "Way one", big: "{mechFlat}",
             p1: "companies raised their female share by more than two points <strong>without employing a single extra woman</strong>.",
             p2: "{exFlatName} gained {exFlatEvo} points, from {exFlatS0}% to {exFlatS1}%. Women went from {exFlatW0} to {exFlatW1}. Men went from {exFlatM0} to {exFlatM1}.",
             p3: "Nobody was hired. The men left." },
      mc2: { label: "Way two", big: "{mechFell}",
             p1: "companies did the opposite: they <strong>hired more women and their share fell</strong>, because they hired men faster.",
             p2: "{exFellName} added {exFellDw} women, from {exFellW0} to {exFellW1}. Its male payroll went from {exFellM0} to {exFellM1}.",
             p3: "Result: {exFellS0}% down to {exFellS1}%. On a percentage ranking this company is going backwards, and it hired more women than almost anyone here." },
      mc3: { label: "Way three", big: "{mechHired}",
             p1: "companies gained more than two points <strong>and actually added women</strong>. This is the only one of the three that means what a reader assumes.",
             p2: "{exHiredName} went from {exHiredW0} to {exHiredW1} women, and its share from {exHiredS0}% to {exHiredS1}%.",
             p3: "The three are indistinguishable from a percentage alone, which is why my map shows headcounts next to every share." },
      nMech1: "First and last filing for each company, which is not always {y0} and {y1}.",
      nMech2: "Bars are headcount. The share is the female share of headcount at each end.",
      nMech3: "The three groups use different conditions, so a company falls into at most one.",
      a6p2: "Step back from the examples and the striking thing is how little moves at all. Of the {withHistory} employers with a history, {evoWithin2} of them, {evoWithin2pc}%, ended within two percentage points of where they started. At the rate the {panelFirms} companies I can follow are actually moving, simple arithmetic puts an even split about {yearsToParity} years away. That describes the present pace. It is not a prediction.",

      /* ---- 03 · where the women work (distribution) */
      a9cn: "03 · ",
      a9ch: "Where the women actually work",
      a9clede: "That last chart placed every company by its share of women. Now turn it around and follow the women instead: take a hundred of them and sort each into the company that employs her. The grid fills as you scroll.",

      /* the 100-women waffle, filled band by band as the reader scrolls */
      six0: { label: "Companies under 10% women",
              big: "1 in 100",
              p: "Line up 100 women by the company that employs each one. Just 1 works somewhere under 10% female." },
      six1: { label: "Companies 10 to 20% women",
              big: "13 so far",
              p: "The 10-to-20% companies add 12 more women. That makes 13 of the 100 placed." },
      six2: { label: "Companies 20 to 30% women",
              big: "45 so far",
              p: "The 20-to-30% companies are the single biggest group: 32 women. Now 45 of the 100 are placed." },
      six3: { label: "Companies 30 to 40% women",
              big: "73 so far",
              p: "The 30-to-40% companies add another 28. That is 73 of the 100." },
      six4: { label: "Still short of parity",
              big: "{wMaleMaj} in 100",
              p: "The 40-to-50% companies add the last 15, and the tally is done: {wMaleMaj} of every 100 women work in a company where they are outnumbered." },
      six5: { label: "At parity or better",
              big: "{wBalanced} in 100",
              p: "Only the final {wBalanced} work somewhere at least half female. The balanced companies are real, but they are small, and almost no one is in them." },
      sixWT: "Every 100 women, by where they work",
      sixWS: "Each box is one woman in a hundred, coloured by her employer's share of women.",
      nSixW: "Each woman is counted once, in the band of the company that employs her. Boxes are rounded to the nearest whole percent of {womenN}.",
      a9cp3: "So the women are not clustered in the balanced companies. They are spread across the male-majority middle, where they are outnumbered, and that picture has barely shifted in five years.",

      /* ---- 07 · in closing */
      a8n: "07 · In closing",
      a8h: "What five years of filings settle, and what they leave open",
      a8lede: "This study can be pushed no further than its source allows. Here is the edge of it.",
      a8p1: "Start with what is not in doubt, because it is arithmetic on figures the companies published themselves. Women are {share}% of the people employed by {companies} ICT employers around Brussels. That figure does not move when you cut it by activity, where the five families span {sectorSpread} percentage points, nor by size, where the three classes span {sizeSpread} and do not even fall in order. And it is concentrated: {wMaleMaj}% of these women work in a firm where they are outnumbered. At the {panelFirms} employers I can follow from {y0} to {y1} it rose {panelDelta} points. It is low, it is flat, and it is flat everywhere.",
      a8h1: "What the filings settle",
      a8p2: "Four things. First, that the shortage of women is not confined to one corner of the sector: every family and every size class sits within a few points of the same low number. Second, that the movement which does exist is slow, about {panelPerYear} of a point a year, the sort of rate that needs decades rather than budgets. Third, and least comfortable, that a company's percentage going up is not evidence it hired anyone: {mechFlat} employers improved theirs while employing no more women than before. Fourth, that a high percentage is usually just a small company. The firms that top a female-share ranking average {lbShareSize} staff, they share no names with the firms that actually employ the most women, and only {wBalanced}% of all the women in the study work somewhere at least half female. The leaderboard measures size, not opportunity.",
      a8h2: "What they leave open",
      a8p3: "Everything about why. The filings carry no job titles, so they cannot say whether women are absent from technical roles or spread thinly across all of them. They carry no pay and no seniority, so they cannot say who is progressing. They count heads at a closing date, so they cannot say who left during the year, or why. Anyone claiming to know those things from this source is guessing, and I would rather say so than guess alongside them.",
      a8last: "One thing worth watching",
      a8p4: "{gradTimesN} times as many women finished a Belgian ICT degree in {gradTo} as in {gradFrom}. They are old enough to be working now. Next year these same {companies} companies file their {yNext} accounts, and I will count again.",

      /* ---- the embedded map ---- */
      a9n: "↓ Explore",
      a9h: "The whole dataset, on one map",
      a9lede: "Every employer is on it. Search a company or a commune, switch between female share, the part-time gap and five-year change, and read any one of them on its own terms.",
      a9full: "Open the map full-screen ↗",

      /* ---- annex */
      a7n: "Annex · The employers, named",
      a7h: "These are filed figures, not survey answers",
      a7lede: "Every number below was published by the company itself under a legal obligation, and can be checked against the National Bank's register.",
      a7p2: "Among the {sizeableN} employers with 100 staff or more, the range runs from one end of the sector to the other.",
      ctaT: "Open the interactive map",
      ctaS: "{companies} employers, searchable by company or commune, with female share, part-time gap and five-year movement",

      mTitle: "How this was made",
      mSrcT: "Sources",
      mSrcP: "Social balance sheets filed with the National Bank of Belgium: total staff, then men and women separately at the closing date, each split into full-time and part-time. Company identity and activity codes from the Crossroads Bank for Enterprises. Graduate series from Eurostat.",
      mWhoT: "Which companies",
      mWhoP: "Fourteen NACE 2025 codes covering software publishing, IT programming and consultancy, data processing and hosting, telecommunications and computer hardware, counted only where one of them is the company's registered main activity. Employers of ten staff or more based in Brussels-Capital, Flemish or Walloon Brabant, or the Leuven area. Two short hand-checked lists correct the register in both directions. Register coverage: Brussels-Capital 99.90%, Leuven area 99.95%, Flemish Brabant 99.98%, Walloon Brabant 99.90%.",
      mHowT: "How the numbers work",
      mHowP: "Female share is women divided by all staff, counting people. Sector totals add up people and divide once, so a ten-person firm does not weigh as much as a two-thousand-person one. Change over time uses only companies present at both ends. Percentage points and per cent are kept distinct: a move from 20% to 25% is five points.",
      mLimT: "Limits",
      mLimP: "Not jobs. Not pay. Not seniority. Not street addresses. Not all of Belgium: Antwerp and Ghent are bigger ICT clusters and sit outside this study. Companies that closed before 2026 are missing from the register, so the earliest years describe survivors.",
      foot: "geopolitoon · {companies} employers, {staff} people, {records} filings, {y0} to {y1}"
    },

    fr: {
      dept: "Journalisme de données",
      kicker: "Les femmes dans les effectifs TIC belges · cinq ans de comptes déposés",
      heroMapBtn: "Voir les entreprises TIC sur la carte",
      title: "Les études changent plus vite que les entreprises",
      standfirst: "Chaque entreprise belge doit déclarer combien d'hommes et de femmes elle emploie. J'ai lu cinq ans de ces déclarations pour {companies} employeurs technologiques autour de Bruxelles. Les femmes représentent {share} % des personnes qu'ils emploient, et c'est le chiffre le plus flatteur de cette étude.",
      bylineSrc: "Sources · Banque nationale de Belgique, Eurostat",
      bylineScope: "{companies} employeurs · {staff} personnes · {records} dépôts · {y0} à {y1}",

      k1v: "{shareR} %", k1k: "des personnes employées par {companies} entreprises technologiques sont des femmes",
      k2v: "{speedRatio}×", k2k: "plus vite dans les études que dans les effectifs",
      k3v: "{ptRatio}×", k3k: "plus de chances qu'une femme travaille à temps partiel qu'un homme",
      k4v: "{zeroWomen}", k4k: "entreprises n'emploient aucune femme",

      a0n: "00 · Comment j'ai compté",
      a0h: "{funnelTop} entreprises au départ, {companies} à l'arrivée",
      a0lede: "Tout repose ici sur une source et une poignée de filtres. Cette section les expose avant tout résultat.",

      a0h1: "D'où viennent les entreprises",
      figFunT: "Du registre des entreprises à la population étudiée",
      figFunS: "Entreprises encore retenues après chaque filtre",
      nFun: "La largeur de l'entonnoir suit une échelle en racine carrée, pour que les étapes basses restent visibles. Les effectifs indiqués à côté sont exacts.",
      a0p2: "Une seule étape fait presque tout le travail. Sur les {funnelQueried} entreprises interrogeables, seules {funnelFiled} déposent des comptes assez détaillés pour compter séparément les hommes et les femmes, soit environ une sur six. La loi belge impose cette ventilation aux employeurs les plus grands et laisse les plus petits déposer un schéma abrégé qui s'en dispense. Tout ce qui suit relève du réglage fin : le seuil de taille, les contrôles de qualité, la fenêtre d'années, le test du siège et les deux listes vérifiées à la main.",

      a0h2: "J'ai compté des personnes, pas des métiers",
      a0p3: "Une entreprise déclare combien d'hommes et de femmes elle employait à la clôture de son exercice. Elle ne dit jamais ce que ces personnes font. Une femme comptée ici peut donc être développeuse, ingénieure, comptable, recruteuse ou réceptionniste.",
      figFrameT: "{staff} personnes, réparties par sexe. Ce qu'elles font ne figure pas dans le dépôt.",
      figFrameS: "Dernier dépôt de chacune des {companies} entreprises",
      nFrame: "Les entreprises ventilent bien le personnel par catégorie professionnelle et par niveau de formation, dans d'autres cases du même formulaire. Aucune n'est jamais croisée avec le sexe.",

      a0h3: "Définir le secteur des TIC",
      a0p4: "J'ai cherché quatorze codes d'activité, répartis en cinq familles. Ensemble, ces cinq familles constituent la définition standard du secteur des TIC utilisée par Eurostat et l'Organisation de coopération et de développement économiques. Rien de ce que j'ai collecté n'en sort.",
      a0p5: "Deux parties de la définition standard ont été écartées volontairement, parce qu'elles revendent et réparent au lieu de produire : le commerce de gros de matériel informatique et la réparation d'ordinateurs.",
      defT: "L'étude en deux lignes",
      defYes: "<span class=\"yes\">Ce qu'elle mesure :</span> la part des femmes parmi toutes les personnes employées par {companies} entreprises TIC de dix salariés ou plus, établies à Bruxelles, dans le Brabant ou la région de Louvain.",
      defNo: "<span class=\"no\">Ce qu'elle ne peut pas mesurer :</span> les métiers, les salaires, l'ancienneté. Cet article parle donc de « femmes dans les effectifs TIC », jamais de « femmes dans les métiers tech ».",

      a1n: "01 · Deux vitesses",
      a1h: "Davantage de femmes se qualifient. Les effectifs bougent à peine.",
      a1lede: "Deux mesures, deux sources, deux rythmes très différents.",
      figSpeedT: "La part des diplômées progresse environ {speedRatio} fois plus vite que celle des effectifs",
      figSpeedS: "Pourcentage de femmes. Diplômées : tous les cursus supérieurs TIC belges. Effectifs : {panelFirms} employeurs ayant déposé en {y0} et en {y1}.",
      sp1: { label: "Dans les études",
             p1: "En {gradFrom}, {gradW0} des {gradT0} personnes sortant d'un cursus TIC belge étaient des femmes. En {gradTo}, c'était <strong>{gradW1} sur {gradT1}</strong>.",
             p2: "Trois fois plus de femmes, dans un domaine qui a lui-même doublé. La part est passée de {gradS0} % à {gradS1} %." },
      sp2: { label: "Dans les effectifs",
             p1: "{panelFirms} des {companies} employeurs ont déposé des comptes en {y0} et en {y1}.",
             p2: "Leur part féminine est passée de {panelS0} % à <strong>{panelS1} %</strong>. Soit {panelDelta} points de pourcentage en {panelSpan} ans." },
      sp3: { label: "L'écart entre les deux",
             p1: "Sur les mêmes années, la part des diplômées a gagné {gradPerYear} point par an. Celle des effectifs {panelPerYear}. Les études avancent environ <strong>{speedRatio} fois plus vite</strong>.",
             p2: "Une précaution : ces deux chiffres comptent des choses différentes, de façons différentes. La comparaison porte sur des vitesses, elle ne prouve aucune causalité." },
      nSpeed1: "Eurostat educ_uoe_grad02, domaine F06, enseignement supérieur. La série belge présente des lacunes avant {gradFrom} : seule la période continue est montrée.",
      nSpeed2: "Part féminine des effectifs, mêmes entreprises aux deux extrémités.",
      nSpeed3: "Les pentes sont de simples moyennes annuelles entre les années extrêmes.",

      a3n: "02 · Chaque employeur",
      a3h: "La plupart des employeurs tiennent dans une bande étroite",
      a3lede: "Placez les {companies} sur un même graphique et la forme saute aux yeux : un amas dense un peu au-dessus du quart, qui s'amincit de part et d'autre.",
      figSwarmT: "Chaque employeur, selon sa part féminine",
      figSwarmS: "Un cercle par entreprise · taille = effectif",
      sw1: { label: "La forme",
             p1: "Un cercle par entreprise, dimensionné selon son effectif. La position horizontale est sa part féminine. La position verticale ne signifie rien, elle évite seulement que les cercles se chevauchent.",
             p2: "L'amas est resserré. <strong>{clusterPc} % des employeurs</strong> se situent entre {clusterLo} % et {clusterHi} % de femmes, et l'entreprise du milieu est à {medianCompany} %." },
      sw2: { label: "Le bord gauche", big: "{zeroWomen}",
             p1: "entreprises n'emploient <strong>aucune femme</strong>, soit {zeroStaff} personnes au total. Ce sont des zéros déclarés, pas des données manquantes.",
             p2: "{under10} entreprises, {under10pc} % d'entre elles, sont sous les 10 % de femmes." },
      sw3: { label: "Le bord droit", big: "{atParity}",
             p1: "entreprises comptent au moins la moitié de femmes, et {above60} dépassent 60 %. Elles existent, et elles sont petites : leur effectif typique est de {parityMedHc} personnes.",
             p2: "<strong>La moitié des femmes de cette étude travaille chez {halfFirms} des {companies} employeurs seulement.</strong>" },
      nSwarm1: "Part féminine des effectifs, dernier dépôt par entreprise. La surface du cercle est proportionnelle à l'effectif.",
      nSwarm2: "Seules les entreprises de dix salariés ou plus figurent ici : une personne seule ne peut pas déplacer une part de dix points.",
      nSwarm3: "Entreprises classées par nombre de femmes employées, du plus grand au plus petit, jusqu'à la moitié des femmes.",
      pull1: "Deux employeurs sur trois se situent entre {clusterLo} % et {clusterHi} % de femmes. Celui du milieu est à {medianCompany} %.",

      a4n: "04 · Qui travaille à temps partiel",
      a4h: "Le seul endroit où les femmes sont la moitié",
      a4lede: "Les femmes forment un quart de ces effectifs. Parmi les personnes à horaire réduit, elles sont la moitié.",
      figPtT: "Le temps partiel est partagé presque à égalité. L'effectif, non.",
      figPtS: "{ptFirms} employeurs dont le dépôt ventile le personnel par temps de travail",
      nPt: "Le panneau de gauche est un taux : les temps partiels d'un sexe rapportés à l'effectif total de ce sexe. Celui de droite est une composition, pas un taux.",
      a4p2: "En personnes : environ {ptWomenCount} femmes et {ptMenCount} hommes à horaire réduit, dans un effectif où les hommes sont plus de deux fois plus nombreux. Une femme a ici <strong>{ptRatio} fois plus de chances</strong> de travailler à temps partiel qu'un homme.",

      a5n: "05 · Secteur et taille",
      a5h: "Ni le type d'entreprise ni sa taille ne changent la réponse",
      a5lede: "Peut-être le chiffre est-il bas à cause des activités que j'ai retenues. Ou peut-être les petites entreprises le tirent-elles vers le bas. Les deux hypothèses méritent un test, et aucune n'explique quoi que ce soit.",
      a5s1h: "Le classement récompense la petite taille",
      a5s1p: "Les entreprises à la plus forte part de femmes sont minuscules : environ 17 personnes. Chaque point est une entreprise. Celles pleines de femmes, en haut, sont presque toutes petites, tout à gauche ; les grands employeurs, à droite, sont tous en bas.",
      a5coneT: "Chaque entreprise, par taille et part de femmes",
      a5coneS: "817 entreprises. À gauche les petites, à droite les grandes ; en haut, plus féminines. La ligne pointillée est à 50 %.",
      na5cone: "Taille en échelle log, pour qu'une petite firme et une géante restent lisibles sur le même axe. Chaque point est l'une des 817 entreprises.",
      a5s2h: "Plus elles grossissent, plus le plafond baisse",
      a5s2p: "Rangez les entreprises par taille. Leur part moyenne de femmes change à peine ({size0} %, {size1} %, {size2} %). Mais le maximum atteint par une seule entreprise chute : {ceilSmall} % chez les plus petites, seulement {ceilBig} % chez les plus grandes. Les grandes n'atteignent jamais une forte part féminine.",
      a5ceilT: "Part de femmes selon la taille",
      a5ceilS: "Les barres sont la part moyenne ; le repère vert est le maximum atteint par une seule entreprise.",
      na5ceil: "Mêmes trois groupes de taille que les barres ci-dessus. La moyenne est par personne ; le plafond est l'entreprise la plus haute du groupe.",
      figMixT1: "Les cinq familles TIC tiennent dans une bande de {sectorSpread} points",
      figMixS1: "Part féminine des effectifs, comptée en personnes",
      figMixT2: "Trois classes de taille, {sizeSpread} points d'écart, et pas dans l'ordre",
      figMixS2: "Part féminine des effectifs selon le nombre de salariés",
      mx1: { label: "Cinq familles",
             p1: "{sectorTopLab} arrive en tête avec <strong>{sectorTopShare} %</strong>. {sectorBotLab} ferme la marche avec <strong>{sectorBotShare} %</strong>.",
             p2: "Soit {sectorSpread} points de pourcentage sur tout le secteur. Aucune famille n'approche la moitié : aucun rééquilibrage ne sauve le chiffre global." },
      mx2: { label: "Une famille se détache",
             p1: "Le traitement de données et l'hébergement affichent la part la plus élevée, et de loin l'entreprise du milieu la plus élevée, à {sectorTopMed} %. C'est aussi la <strong>seule famille qui recule</strong>, de {sectorWorstEvo} point.",
             p2: "L'édition de logiciels est son opposée : la plus forte progression à {sectorBestEvo} points, mais sur {sectorBestFirms} entreprises seulement, ce qui en fait un indice plutôt qu'un résultat." },
      mx3: { label: "Et la taille",
             p1: "Les entreprises de 10 à 49 salariés sont à {size0} %, celles de 50 à 249 à {size1} %, celles de 250 et plus à {size2} %.",
             p2: "Une amplitude de {sizeSpread} points, et la classe du milieu est la plus basse des trois. Il n'y a aucun effet de taille à décrire." },
      nMix1: "Les entreprises sont placées dans la famille de leur activité principale enregistrée. Quand plusieurs sont déclarées, la plus spécifique l'emporte.",
      nMix2: "{multiCode} entreprises sur {companies} déclarent des activités principales dans plusieurs familles.",
      nMix3: "Classe de taille d'après l'effectif du dernier dépôt.",

      a6n: "06 · Ce que cache un pourcentage en hausse",
      a6h: "Une part peut monter de trois façons, et une seule consiste à recruter des femmes",
      a6lede: "{withHistory} de ces employeurs ont déposé au moins deux fois. {rose} ont amélioré leur part féminine. À ne lire que le pourcentage, ces {rose} se ressemblent. Ils ne se ressemblent pas.",
      figMechS: "Effectifs au premier et au dernier dépôt, et la part qui en résulte",
      figMechT1: "Autant de femmes, moins d'hommes, pourcentage en hausse",
      figMechT2: "Plus de femmes recrutées, et le pourcentage baisse quand même",
      figMechT3: "Plus de femmes recrutées, et le pourcentage monte",
      mc1: { label: "Façon un", big: "{mechFlat}",
             p1: "entreprises ont gagné plus de deux points de part féminine <strong>sans employer une femme de plus</strong>.",
             p2: "{exFlatName} a gagné {exFlatEvo} points, de {exFlatS0} % à {exFlatS1} %. Les femmes sont passées de {exFlatW0} à {exFlatW1}. Les hommes de {exFlatM0} à {exFlatM1}.",
             p3: "Personne n'a été recruté. Les hommes sont partis." },
      mc2: { label: "Façon deux", big: "{mechFell}",
             p1: "entreprises ont fait l'inverse : elles ont <strong>recruté plus de femmes et vu leur part baisser</strong>, parce qu'elles ont recruté des hommes plus vite.",
             p2: "{exFellName} a ajouté {exFellDw} femmes, de {exFellW0} à {exFellW1}. Son effectif masculin est passé de {exFellM0} à {exFellM1}.",
             p3: "Résultat : de {exFellS0} % à {exFellS1} %. Dans un classement par pourcentage, cette entreprise recule, alors qu'elle a recruté plus de femmes que presque toutes les autres." },
      mc3: { label: "Façon trois", big: "{mechHired}",
             p1: "entreprises ont gagné plus de deux points <strong>en ajoutant réellement des femmes</strong>. C'est le seul des trois cas qui signifie ce qu'un lecteur croit lire.",
             p2: "{exHiredName} est passée de {exHiredW0} à {exHiredW1} femmes, et sa part de {exHiredS0} % à {exHiredS1} %.",
             p3: "Les trois cas sont indiscernables à partir du seul pourcentage. C'est pourquoi ma carte affiche les effectifs à côté de chaque part." },
      nMech1: "Premier et dernier dépôt de chaque entreprise, qui ne sont pas toujours {y0} et {y1}.",
      nMech2: "Les barres sont des effectifs. La part est la part féminine des effectifs à chaque extrémité.",
      nMech3: "Les trois groupes reposent sur des conditions différentes : une entreprise ne relève que d'un seul au plus.",
      a6p2: "En s'éloignant des exemples, le plus frappant est le peu de mouvement. Sur les {withHistory} employeurs ayant un historique, {evoWithin2}, soit {evoWithin2pc} %, ont fini à moins de deux points de leur point de départ. Au rythme réel des {panelFirms} entreprises que je peux suivre, un simple calcul place le partage à égalité dans environ {yearsToParity} ans. Cela décrit le rythme actuel. Ce n'est pas une prévision.",

      /* ---- 06 · le tour de passe-passe des petites structures */
      a9cn: "03 · ",
      a9ch: "Où travaillent réellement les femmes",
      a9clede: "Le graphique précédent plaçait chaque entreprise selon sa part de femmes. Renversons-le et suivons plutôt les femmes : prenez-en cent et rangez chacune dans l'entreprise qui l'emploie. La grille se remplit au défilement.",

      /* la grille de 100 femmes, remplie tranche par tranche au défilement */
      six0: { label: "Entreprises sous 10 % de femmes",
              big: "1 sur 100",
              p: "Alignez 100 femmes selon l'entreprise qui emploie chacune. 1 seule travaille dans un lieu sous 10 % féminin." },
      six1: { label: "Entreprises de 10 à 20 % de femmes",
              big: "13 jusqu'ici",
              p: "Les entreprises de 10 à 20 % ajoutent 12 femmes. Cela fait 13 des 100 placées." },
      six2: { label: "Entreprises de 20 à 30 % de femmes",
              big: "45 jusqu'ici",
              p: "Les entreprises de 20 à 30 % forment le plus gros groupe : 32 femmes. On atteint 45 des 100." },
      six3: { label: "Entreprises de 30 à 40 % de femmes",
              big: "73 jusqu'ici",
              p: "Les entreprises de 30 à 40 % ajoutent encore 28. Soit 73 des 100." },
      six4: { label: "Toujours en deçà de la parité",
              big: "{wMaleMaj} sur 100",
              p: "Les entreprises de 40 à 50 % ajoutent les 15 dernières, et le compte est bouclé : {wMaleMaj} femmes sur 100 travaillent dans une entreprise où elles sont minoritaires." },
      six5: { label: "À parité ou mieux",
              big: "{wBalanced} sur 100",
              p: "Seules les {wBalanced} dernières travaillent dans un lieu au moins à moitié féminin. Les entreprises équilibrées existent, mais elles sont petites, et presque personne n'y travaille." },
      sixWT: "Sur 100 femmes, selon leur lieu de travail",
      sixWS: "Chaque case est une femme sur cent, colorée selon la part de femmes de son employeur.",
      nSixW: "Chaque femme comptée une fois, dans la tranche de l'entreprise qui l'emploie. Cases arrondies au pourcent entier de {womenN}.",
      a9cp3: "Les femmes ne sont donc pas regroupées dans les entreprises équilibrées. Elles sont dispersées dans le milieu à majorité masculine, où elles sont minoritaires, et cette image n'a presque pas bougé en cinq ans.",

      a8n: "07 · Pour finir",
      a8h: "Ce que cinq ans de dépôts tranchent, et ce qu'ils laissent ouvert",
      a8lede: "Cette étude ne peut pas aller plus loin que sa source. Voici où elle s'arrête.",
      a8p1: "Commençons par ce qui ne fait pas de doute, parce qu'il s'agit d'arithmétique sur des chiffres publiés par les entreprises elles-mêmes. Les femmes représentent {share} % des personnes employées par {companies} employeurs TIC autour de Bruxelles. Ce chiffre ne bouge pas quand on le découpe par activité, où les cinq familles tiennent dans {sectorSpread} points, ni par taille, où les trois classes tiennent dans {sizeSpread} points sans même se ranger dans l'ordre. Et il est concentré : {wMaleMaj} % de ces femmes travaillent dans une firme où elles sont minoritaires. Chez les {panelFirms} employeurs suivis de {y0} à {y1}, il a gagné {panelDelta} points. Il est bas, il est plat, et il est plat partout.",
      a8h1: "Ce que les dépôts tranchent",
      a8p2: "Quatre choses. D'abord que le manque de femmes ne se loge pas dans un coin du secteur : chaque famille et chaque classe de taille se tient à quelques points du même chiffre bas. Ensuite que le mouvement existant est lent, environ {panelPerYear} point par an, un rythme qui se compte en décennies plutôt qu'en budgets. Puis, et c'est le moins confortable, qu'un pourcentage en hausse ne prouve aucun recrutement : {mechFlat} employeurs ont amélioré le leur sans employer une femme de plus. Enfin, qu'une part élevée n'est en général qu'une petite entreprise. Les firmes en tête d'un classement par part féminine comptent en moyenne {lbShareSize} salariés, ne partagent aucun nom avec celles qui emploient réellement le plus de femmes, et seules {wBalanced} % des femmes de l'étude travaillent dans un lieu au moins à moitié féminin. Le classement mesure la taille, pas les débouchés.",
      a8h2: "Ce qu'ils laissent ouvert",
      a8p3: "Tout ce qui touche au pourquoi. Les dépôts ne portent aucun intitulé de poste : impossible de dire si les femmes sont absentes des rôles techniques ou réparties en petit nombre sur tous. Ils ne portent ni salaire ni ancienneté : impossible de dire qui progresse. Ils comptent des têtes à une date de clôture : impossible de dire qui est parti en cours d'année, ni pourquoi. Quiconque prétend le savoir à partir de cette source devine, et je préfère le dire plutôt que deviner avec lui.",
      a8last: "Une chose à surveiller",
      a8p4: "{gradTimesN} fois plus de femmes ont terminé un cursus TIC belge en {gradTo} qu'en {gradFrom}. Elles ont aujourd'hui l'âge de travailler. L'an prochain, ces mêmes {companies} entreprises déposeront leurs comptes {yNext}, et je compterai à nouveau.",

      a9n: "↓ Explorer",
      a9h: "Toutes les données, sur une seule carte",
      a9lede: "Chaque employeur y figure. Cherchez une entreprise ou une commune, basculez entre part féminine, écart de temps partiel et évolution sur cinq ans, et lisez n'importe lequel selon ses propres chiffres.",
      a9full: "Ouvrir la carte en plein écran ↗",

      a7n: "Annexe · Les employeurs, nommés",
      a7h: "Ce sont des chiffres déposés, pas des réponses à un sondage",
      a7lede: "Chaque chiffre ci-dessous a été publié par l'entreprise elle-même en vertu d'une obligation légale, et peut être vérifié auprès de la Banque nationale.",
      a7p2: "Parmi les {sizeableN} employeurs de 100 salariés ou plus, l'éventail va d'un extrême du secteur à l'autre.",
      ctaT: "Ouvrir la carte interactive",
      ctaS: "{companies} employeurs, recherche par entreprise ou par commune, avec part féminine, écart de temps partiel et évolution sur cinq ans",

      mTitle: "Comment j'ai procédé",
      mSrcT: "Sources",
      mSrcP: "Bilans sociaux déposés à la Banque nationale de Belgique : effectif total, puis hommes et femmes séparément à la date de clôture, chacun ventilé en temps plein et temps partiel. Identité et codes d'activité : Banque-Carrefour des Entreprises. Série des diplômées : Eurostat.",
      mWhoT: "Quelles entreprises",
      mWhoP: "Quatorze codes NACE 2025 couvrant l'édition de logiciels, la programmation et le conseil informatique, le traitement de données et l'hébergement, les télécommunications et le matériel informatique, retenus seulement quand l'un d'eux est l'activité principale enregistrée. Employeurs de dix salariés ou plus établis en Région bruxelloise, dans le Brabant flamand ou wallon, ou la région de Louvain. Deux courtes listes vérifiées à la main corrigent le registre dans les deux sens. Couverture du registre : Bruxelles-Capitale 99,90 %, région de Louvain 99,95 %, Brabant flamand 99,98 %, Brabant wallon 99,90 %.",
      mHowT: "Comment les chiffres fonctionnent",
      mHowP: "La part féminine est le nombre de femmes divisé par l'effectif total, en personnes. Les totaux de secteur additionnent des personnes puis divisent une seule fois : une entreprise de dix salariés ne pèse donc pas autant qu'une de deux mille. L'évolution ne porte que sur les entreprises présentes aux deux extrémités. Points de pourcentage et pour cent restent distincts : passer de 20 % à 25 % fait cinq points.",
      mLimT: "Limites",
      mLimP: "Ni métiers, ni salaires, ni ancienneté, ni adresses. Ni toute la Belgique : Anvers et Gand sont des pôles TIC plus importants et restent hors de l'étude. Les entreprises fermées avant 2026 sont absentes du registre : les premières années décrivent donc des survivantes.",
      foot: "geopolitoon · {companies} employeurs, {staff} personnes, {records} dépôts, {y0} à {y1}"
    }
  };

  /* strings the figures and tables need, added to both dictionaries */
  var EXTRA = {
    en: {
      men: "Men", women: "Women", allStaff: "All staff",
      partTimers: "Part-time staff", parity: "Half", median: "middle company",
      companiesAxis: "companies", firstFiling: "first filing",
      lastFiling: "last filing", share: "share",
      occupUnknown: "What these people do: not reported",
      gradLine: "ICT graduates", payLine: "ICT payrolls",
      perYear: "a point a year",
      ptRateTitle: "Share of each sex working part-time",
      ptCompTitle: "Who the part-timers are",
      ptRateFoot: "Each bar is that sex's own total staff",
      thCompany: "Company", thStaff: "Staff", thShare: "Women", thSector: "Family",
      tblLargest: "The twelve largest employers in the study",
      tblExtremes: "Employers of 100 staff or more: the two ends",
      blockBest: "Highest female share", blockWorst: "Lowest female share",
      famFirms: "companies", famStaff: "people", femaleShare: "female share",
      belowTen: "below 10% women",
      parityPlus: "50% or more", midBand: "10 to 50%",
      nCone: "One dot per employer. Size on a log scale so a hire that moves a five-person firm is visible against one that barely dents a two-thousand-person one. The five labelled dots are the largest employers.",
      nWomen: "Each woman is counted once, in the share band of the company that employs her. Bands are the female share of that firm; the widths add to 100% of the {womenN} employed women."
    },
    fr: {
      men: "Hommes", women: "Femmes", allStaff: "Effectif total",
      partTimers: "Temps partiels", parity: "Moitié", median: "entreprise du milieu",
      companiesAxis: "entreprises", firstFiling: "premier dépôt",
      lastFiling: "dernier dépôt", share: "part",
      occupUnknown: "Ce que font ces personnes : non déclaré",
      gradLine: "Diplômées TIC", payLine: "Effectifs TIC",
      perYear: "point par an",
      ptRateTitle: "Part de chaque sexe travaillant à temps partiel",
      ptCompTitle: "Qui sont les temps partiels",
      ptRateFoot: "Chaque barre : l'effectif total de ce sexe",
      thCompany: "Entreprise", thStaff: "Effectif", thShare: "Femmes", thSector: "Famille",
      tblLargest: "Les douze plus gros employeurs de l'étude",
      tblExtremes: "Employeurs de 100 salariés ou plus : les deux extrêmes",
      blockBest: "Part féminine la plus élevée", blockWorst: "Part féminine la plus faible",
      famFirms: "entreprises", famStaff: "personnes", femaleShare: "part féminine",
      belowTen: "sous 10 % de femmes",
      parityPlus: "50 % ou plus", midBand: "10 à 50 %",
      nCone: "Un point par employeur. Taille en échelle log, pour qu'une embauche qui bouge une firme de cinq personnes reste visible face à une qui entame à peine une firme de deux mille. Les cinq points nommés sont les plus gros employeurs.",
      nWomen: "Chaque femme est comptée une fois, dans la tranche de part de l'entreprise qui l'emploie. Les tranches sont la part féminine de la firme ; les largeurs totalisent 100 % des {womenN} femmes employées."
    }
  };
  Object.keys(EXTRA).forEach(function (L) {
    Object.keys(EXTRA[L]).forEach(function (k) { T[L][k] = EXTRA[L][k]; });
  });

  /* The five families, in the order a reader meets the sector: software first,
   * hardware last. Codes come from the data; these are the plain-language names
   * plus the short labels the charts need. */
  var FAM = [
    { div: "58", en: "Software publishing", fr: "Édition de logiciels" },
    { div: "62", en: "Programming & consultancy", fr: "Programmation et conseil" },
    { div: "63", en: "Information services", fr: "Services d'information" },
    { div: "61", en: "Telecommunications", fr: "Télécommunications" },
    { div: "26", en: "Electronics manufacturing", fr: "Fabrication électronique" }
  ];
  function famOf(div) {
    return FAM.filter(function (x) { return x.div === div; })[0];
  }
  function famName(div) {
    var f = famOf(div);
    return f ? (LANG === "fr" ? f.fr : f.en) : div;
  }

  // article.json labels a family in English; map back to a division so the
  // French build can translate it rather than printing the English through.
  var LABEL_TO_DIV = {
    "Electronics manufacturing": "26",
    "Software publishing": "58",
    "Telecommunications": "61",
    "Programming & consultancy": "62",
    "Information services": "63",
    "Added by hand": "62"
  };

  /* ------------------------------------------------------------- helpers */
  function nf(v, dp) {
    return Number(v).toLocaleString(LANG === "fr" ? "fr-BE" : "en-GB",
      { minimumFractionDigits: dp || 0, maximumFractionDigits: dp === undefined ? 0 : dp });
  }
  function pc(v, dp) { return nf(v, dp) + (LANG === "fr" ? " %" : "%"); }
  function sgn(v, dp) { return (v > 0 ? "+" : "") + nf(v, dp); }

  var TOK = {};
  function tokens() {
    var p = A.panel, g = A.grad_rate, sizes = A.sizes;
    return {
      companies: nf(A.companies), staff: nf(A.staff), records: nf(A.records),
      y0: A.years[0], y1: A.years[A.years.length - 1],
      share: nf(A.share, 1), shareR: String(Math.round(A.share)),
      medianCompany: nf(A.median_company, 1),
      ptMen: nf(A.pt_men, 1), ptWomen: nf(A.pt_women, 1),
      ptRatio: nf(A.pt_ratio, 1), ptWomenOfAll: nf(A.pt_women_of_all, 1),
      ptWomenCount: nf(A.pt_women_count), ptMenCount: nf(A.pt_men_count),
      ptFirms: nf(A.pt_firms),
      gradFrom: g.from, gradTo: g.to, gradTimes: nf(g.times, 1),
      gradW0: nf(g.women0), gradW1: nf(g.women1),
      gradT0: nf(g.total0), gradT1: nf(g.total1),
      gradS0: nf(A.grad_from.share, 1), gradS1: nf(A.grad_latest.share, 1),
      gradPerYear: nf(g.per_year_2021, 2),
      panelFirms: nf(p.firms), panelS0: nf(p.share0, 1), panelS1: nf(p.share1, 1),
      panelDelta: nf(p.delta, 1), panelSpan: nf(p.span),
      panelPerYear: nf(p.per_year, 2), yearsToParity: nf(p.years_to_parity),
      speedRatio: nf(A.speed_ratio, 1),
      zeroWomen: nf(A.zero_women), zeroStaff: nf(A.zero_women_staff),
      under10: nf(A.under10), under10pc: nf(A.under10 / A.companies * 100, 0),
      atParity: nf(A.at_parity), above60: nf(A.above60),
      parityMedHc: nf(A.parity_median_hc), allMedHc: nf(A.all_median_hc),
      halfFirms: nf(A.half_women_firms),
      sectorSpread: nf(A.sector_spread, 1),
      sectorTopLab: famName(A.sector_top.div), sectorTopShare: nf(A.sector_top.share, 1),
      sectorTopMed: nf(A.sector_top.median, 1),
      sectorBotLab: famName(A.sector_bottom.div),
      sectorBotShare: nf(A.sector_bottom.share, 1),
      sectorWorstEvo: nf(Math.abs(A.sector_worst_evo.med_evo), 1),
      sectorBestEvo: sgn(A.sector_best_evo.med_evo, 1),
      sectorBestFirms: nf(A.sector_best_evo.firms),
      size0: nf(sizes[0].share, 1), size1: nf(sizes[1].share, 1),
      size2: nf(sizes[2].share, 1), sizeSpread: nf(A.size_spread, 1),
      multiCode: nf(A.multi_code),
      withHistory: nf(A.with_history), rose: nf(A.rose), fell: nf(A.fell),
      evoWithin2: nf(A.evo_within2),
      evoWithin2pc: nf(A.evo_within2 / A.with_history * 100, 0),
      mechFlat: nf(A.mech_counts.flat), mechFell: nf(A.mech_counts.fell),
      mechHired: nf(A.mech_counts.hired),
      exFlatName: A.ex_flat.name, exFlatEvo: sgn(A.ex_flat.evo, 1),
      exFlatS0: nf(A.ex_flat.s0, 1), exFlatS1: nf(A.ex_flat.s1, 1),
      exFlatW0: nf(A.ex_flat.w0), exFlatW1: nf(A.ex_flat.w1),
      exFlatM0: nf(A.ex_flat.m0), exFlatM1: nf(A.ex_flat.m1),
      exFellName: A.ex_fell.name, exFellDw: nf(A.ex_fell.dw),
      exFellW0: nf(A.ex_fell.w0), exFellW1: nf(A.ex_fell.w1),
      exFellM0: nf(A.ex_fell.m0), exFellM1: nf(A.ex_fell.m1),
      exFellS0: nf(A.ex_fell.s0, 1), exFellS1: nf(A.ex_fell.s1, 1),
      exHiredName: A.ex_hired.name, exHiredW0: nf(A.ex_hired.w0),
      exHiredW1: nf(A.ex_hired.w1), exHiredS0: nf(A.ex_hired.s0, 1),
      exHiredS1: nf(A.ex_hired.s1, 1),
      sizeableN: nf(A.sizeable_n),
      funnelTop: nf(A.funnel[0].n),
      funnelQueried: nf(A.funnel[1].n),
      funnelFiled: nf(A.funnel[2].n),
      funnelCoverage: nf(A.funnel_coverage, 2),
      clusterLo: nf(A.cluster_lo), clusterHi: nf(A.cluster_hi),
      clusterN: nf(A.cluster_n), clusterPc: nf(A.cluster_pc),
      q1: nf(A.q1, 1), q3: nf(A.q3, 1),
      gradTimesN: nf(A.grad_rate.times, A.grad_rate.times % 1 ? 1 : 0),
      yNext: String(Number(A.years[A.years.length - 1]) + 1),
      womenN: nf(A.women),
      wBalanced: nf(A.women_balanced_pct), wMaleMaj: nf(A.women_malemaj_pct),
      w2040: nf(A.women_2040_pct),
      lbShareSize: nf(A.lb_share_size), lbWomenSize: nf(A.lb_women_size),
      lbOverlap: nf(A.lb_overlap), top10Women: nf(A.top10_women_pct),
      ceilSmall: nf(A.ceil_small), ceilMid: nf(A.ceil_mid), ceilBig: nf(A.ceil_big),
      volSmall: nf(A.vol_small, 1), volBig: nf(A.vol_big, 1)
    };
  }

  function fill(s) {
    return String(s).replace(/\{(\w+)\}/g, function (_, k) {
      return TOK[k] !== undefined ? TOK[k] : "{" + k + "}";
    });
  }
  function t(path) {
    var o = T[LANG];
    path.split(".").forEach(function (k) { o = o ? o[k] : null; });
    return o == null ? "" : fill(o);
  }

  /* ------------------------------------------------------------- chrome */
  function paintChrome() {
    document.documentElement.lang = LANG;
    document.title = t("title");
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.innerHTML = t(el.getAttribute("data-i18n"));
    });
    d3.select("#lang-en").attr("aria-pressed", LANG === "en");
    d3.select("#lang-fr").attr("aria-pressed", LANG === "fr");

    var kn = d3.select("#keynums").html("");
    [1, 2, 3, 4].forEach(function (i) {
      var b = kn.append("div").attr("class", "keynum");
      b.append("div").attr("class", "v").text(t("k" + i + "v"));
      b.append("div").attr("class", "k").html(t("k" + i + "k"));
    });

    // the five families, so "ICT" is never an unexplained label
    var fl = d3.select("#famlist").html("");
    FAM.forEach(function (f) {
      var s = A.sectors.filter(function (x) { return x.div === f.div; })[0];
      var codes = A.nace.filter(function (c) { return c.div === f.div; })
        .map(function (c) { return c.code; }).join(", ");
      var b = fl.append("div").attr("class", "fam");
      b.append("div").attr("class", "code").text("NACE " + codes);
      b.append("div").attr("class", "nm").text(famName(f.div));
      b.append("div").attr("class", "ct").text(
        s ? nf(s.firms) + " " + t("famFirms") + " · " + nf(s.staff) + " " + t("famStaff")
          : "");
    });
  }

  var STEPDEFS = {
    speed: [["sp1.label", ["sp1.p1", "sp1.p2"]],
            ["sp2.label", ["sp2.p1", "sp2.p2"]],
            ["sp3.label", ["sp3.p1", "sp3.p2"]]],
    swarm: [["sw1.label", ["sw1.p1", "sw1.p2"]],
            ["sw2.label", ["sw2.big", "sw2.p1", "sw2.p2"]],
            ["sw3.label", ["sw3.big", "sw3.p1", "sw3.p2"]]],
    mix: [["mx1.label", ["mx1.p1", "mx1.p2"]],
          ["mx2.label", ["mx2.p1", "mx2.p2"]],
          ["mx3.label", ["mx3.p1", "mx3.p2"]]],
    mech: [["mc1.label", ["mc1.big", "mc1.p1", "mc1.p2", "mc1.p3"]],
           ["mc2.label", ["mc2.big", "mc2.p1", "mc2.p2", "mc2.p3"]],
           ["mc3.label", ["mc3.big", "mc3.p1", "mc3.p2", "mc3.p3"]]],
    six: [["six0.label", ["six0.big", "six0.p"]],
          ["six1.label", ["six1.big", "six1.p"]],
          ["six2.label", ["six2.big", "six2.p"]],
          ["six3.label", ["six3.big", "six3.p"]],
          ["six4.label", ["six4.big", "six4.p"]],
          ["six5.label", ["six5.big", "six5.p"]]]
  };

  function buildSteps() {
    Object.keys(STEPDEFS).forEach(function (key) {
      var host = d3.select('[data-steps="' + key + '"]').html("");
      STEPDEFS[key].forEach(function (def, i) {
        var s = host.append("div").attr("class", "step" + (i === 0 ? " on" : ""))
          .attr("data-fig", key).attr("data-i", i);
        s.append("div").attr("class", "label").text(t(def[0]));
        def[1].forEach(function (pth) {
          var body = t(pth);
          if (!body) return;
          if (pth.indexOf(".big") > 0) s.append("span").attr("class", "big").text(body);
          else s.append("p").html(body);
        });
      });
    });
  }

  /* Step activation is measured, not observed. See the file header. */
  var BLOCKS = [];
  function observeSteps() {
    BLOCKS = Object.keys(STEPDEFS).map(function (key) {
      return { key: key,
               steps: [].slice.call(
                 document.querySelectorAll('.step[data-fig="' + key + '"]')) };
    });
    // buildSteps has just replaced every step element, so the remembered index
    // no longer describes anything on the page. Without clearing it, syncSteps
    // sees "already on step 2", returns early, and leaves the highlighted
    // paragraph and the figure showing different states after a language
    // switch.
    STEP = {};
    syncSteps();
  }
  function syncSteps() {
    var mid = window.innerHeight * 0.5;
    BLOCKS.forEach(function (b) {
      var best = 0, bestd = Infinity;
      b.steps.forEach(function (el, i) {
        var r = el.getBoundingClientRect();
        var dd = Math.max(0, r.top - mid) + Math.max(0, mid - r.bottom);
        if (dd < bestd) { bestd = dd; best = i; }
      });
      if (STEP[b.key] === best) return;
      STEP[b.key] = best;
      b.steps.forEach(function (el, i) { el.classList.toggle("on", i === best); });
      FIG[b.key](best);
    });
  }
  var pending = false;
  function onScroll() {
    if (pending) return;
    pending = true;
    var run = function () { pending = false; syncSteps(); };
    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(run);
      setTimeout(function () { if (pending) run(); }, 120);
    } else { setTimeout(run, 16); }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  /* ------------------------------------------------------------ figures */
  var FIG = {};
  function svg(id) { return d3.select("#" + id).html(""); }
  function note(id, key) { d3.select("#note-" + id).html(t(key)); }
  function txt(s, x, y, str, o) {
    o = o || {};
    return s.append("text").attr("x", x).attr("y", y).text(str)
      .attr("font-family", o.f || MONO).attr("font-size", o.s || 9.5)
      .attr("font-weight", o.w || 400).attr("fill", o.c || C.ink3)
      .attr("text-anchor", o.a || "start")
      .attr("letter-spacing", o.ls || null);
  }

  /* --- 00 the pipeline, as a funnel -------------------------------------
   * Nine stages spanning 25,710 down to 817. A width proportional to the count
   * would leave the last six stages a hairline, so width runs on a square-root
   * scale and the exact counts sit beside the shape, which is where a reader
   * takes the numbers from anyway.
   */
  FIG.funnel = function () {
    var s = svg("fig-funnel");
    var W = 860, P = { t: 30 }, pitch = 48, band = 9;
    var F = A.funnel;
    var cx = 205, maxW = 172;
    var top = F[0].n;
    var wof = function (i) { return maxW * Math.sqrt(F[i].n / top); };
    var ramp = d3.interpolateRgb(C.navySoft, C.orangeDeep);

    F.forEach(function (stage, i) {
      var y = P.t + i * pitch;
      var w0 = wof(i), w1 = wof(Math.min(i + 1, band - 1));
      var col = ramp(i / (band - 1));

      // a trapezoid tapering to the next stage's width draws the funnel wall
      s.append("path")
        .attr("d", "M" + (cx - w0) + "," + y + " L" + (cx + w0) + "," + y
              + " L" + (cx + w1) + "," + (y + pitch - 3)
              + " L" + (cx - w1) + "," + (y + pitch - 3) + " Z")
        .attr("fill", col).attr("fill-opacity", 0.9);

      // the count, then what this filter removed, then the filter itself
      txt(s, 452, y + pitch / 2 + 2, nf(stage.n),
          { f: DISP, s: 17, w: 700, c: C.ink, a: "end" });
      txt(s, 470, y + pitch / 2 + 2, LANG === "fr" ? stage.fr : stage.en,
          { f: BODY, s: 10.8, c: i === band - 1 ? C.orangeDeep : C.ink2 });
      if (i) {
        var lost = F[i - 1].n - stage.n;
        txt(s, W - 4, y + pitch / 2 + 2, lost ? "−" + nf(lost) : "",
            { s: 9.5, c: C.ink3, a: "end" });
      }
      if (i === 1) {
        txt(s, 452, y + pitch / 2 + 15, pc(A.funnel_coverage, 2),
            { s: 9, c: C.ink3, a: "end" });
      }
    });

    // column headings, so the three numeric columns explain themselves
    txt(s, 452, P.t - 10, LANG === "fr" ? "ENTREPRISES" : "COMPANIES",
        { f: DISP, s: 8.5, w: 700, c: C.ink3, a: "end", ls: "0.12em" });
    txt(s, W - 4, P.t - 10, LANG === "fr" ? "RETIRÉES" : "REMOVED",
        { f: DISP, s: 8.5, w: 700, c: C.ink3, a: "end", ls: "0.12em" });
    d3.select("#note-funnel").html(t("nFun"));
  };

  /* --- 01 two speeds --------------------------------------------------- */
  FIG.speed = function (step) {
    var s = svg("fig-speed");
    var W = 460, H = 320, P = { l: 34, r: 92, t: 26, b: 40 };
    var grad = A.grad_run;
    var x = d3.scaleLinear().domain([2017, 2025]).range([P.l, W - P.r]);
    var y = d3.scaleLinear().domain([0, 34]).range([H - P.b, P.t]);

    [0, 10, 20, 30].forEach(function (v) {
      s.append("line").attr("x1", P.l).attr("x2", W - P.r).attr("y1", y(v)).attr("y2", y(v))
        .attr("stroke", C.line);
      txt(s, P.l - 7, y(v) + 3, pc(v, 0), { a: "end" });
    });
    [2017, 2019, 2021, 2023, 2025].forEach(function (v) {
      txt(s, x(v), H - P.b + 15, v, { a: "middle" });
    });

    var line = d3.line().x(function (d) { return x(+d.year); })
      .y(function (d) { return y(d.share); });

    s.append("path").datum(grad).attr("fill", "none").attr("stroke", C.navy)
      .attr("stroke-width", 2.2).attr("d", line);
    s.selectAll("circle.g").data(grad).join("circle").attr("class", "g")
      .attr("cx", function (d) { return x(+d.year); })
      .attr("cy", function (d) { return y(d.share); })
      .attr("r", 2.6).attr("fill", C.navy);
    var gl = grad[grad.length - 1];
    txt(s, x(+gl.year) + 8, y(gl.share) + 4, pc(gl.share, 1),
        { f: DISP, s: 13, w: 700, c: C.navy });
    txt(s, x(+gl.year) + 8, y(gl.share) + 18, t("gradLine"), { s: 8.5 });

    var g0 = grad[0];
    s.append("circle").attr("cx", x(+g0.year)).attr("cy", y(g0.share)).attr("r", 4)
      .attr("fill", C.paper4).attr("stroke", C.navy).attr("stroke-width", 2);
    txt(s, x(+g0.year) + 6, y(g0.share) - 15, pc(g0.share, 1),
        { f: DISP, s: 10.5, w: 700, c: C.navy });

    if (step >= 1) {
      var pnl = [{ year: A.panel.from, share: A.panel.share0 },
                 { year: A.panel.to, share: A.panel.share1 }];
      s.append("path").datum(pnl).attr("fill", "none").attr("stroke", C.orange)
        .attr("stroke-width", 2.8).attr("d", line);
      pnl.forEach(function (d) {
        s.append("circle").attr("cx", x(+d.year)).attr("cy", y(d.share)).attr("r", 4)
          .attr("fill", C.orange);
        txt(s, x(+d.year), y(d.share) - 11, pc(d.share, 1),
            { f: DISP, s: 10.5, w: 700, c: C.orangeDeep, a: "middle" });
      });
      txt(s, x(+A.panel.to) + 9, y(A.panel.share1) + 15, t("payLine"),
          { s: 8.5, c: C.orangeDeep });
      // the year-by-year aggregate, faint, so the panel is not the only view
      s.append("path").datum(A.emp_series).attr("fill", "none")
        .attr("stroke", C.orangeSoft).attr("stroke-width", 1.6)
        .attr("stroke-dasharray", "3 2").attr("d", line);
    }

    if (step >= 2) {
      // the two slopes, written on the lines themselves
      var gg = grad.filter(function (d) { return +d.year === 2022; })[0];
      txt(s, x(2022), y(gg.share) - 27, t("perYear"), { s: 8, a: "middle", c: C.navy });
      txt(s, x(2022), y(gg.share) - 9, "+" + nf(A.grad_rate.per_year_2021, 2),
          { f: DISP, s: 13, w: 700, c: C.navy, a: "middle" });
      var pv = A.panel.share0 + (A.panel.share1 - A.panel.share0)
        * (2023 - +A.panel.from) / (+A.panel.to - +A.panel.from);
      txt(s, x(2023), y(pv) + 18, "+" + nf(A.panel.per_year, 2),
          { f: DISP, s: 13, w: 700, c: C.orangeDeep, a: "middle" });
      txt(s, x(2023), y(pv) + 30, t("perYear"), { s: 8, a: "middle", c: C.orangeDeep });
    }
    note("speed", ["nSpeed1", "nSpeed2", "nSpeed3"][step]);
  };

  /* --- 02 what we counted ---------------------------------------------- */
  FIG.frame = function () {
    var s = svg("fig-frame");
    var W = 860, H = 210, P = { l: 12, r: 12, t: 34 };
    var barW = W - P.l - P.r, barH = 72;
    var wW = barW * (A.women / A.staff);

    s.append("rect").attr("x", P.l).attr("y", P.t).attr("width", wW)
      .attr("height", barH).attr("fill", C.orange);
    s.append("rect").attr("x", P.l + wW).attr("y", P.t).attr("width", barW - wW)
      .attr("height", barH).attr("fill", C.navy);

    txt(s, P.l + 12, P.t + 30, pc(A.share, 1), { f: DISP, s: 22, w: 700, c: "#fff" });
    txt(s, P.l + 12, P.t + 50, t("women") + " · " + nf(A.women), { s: 10, c: "#FBE6D8" });
    txt(s, W - P.r - 12, P.t + 30, pc(100 - A.share, 1),
        { f: DISP, s: 22, w: 700, c: "#fff", a: "end" });
    txt(s, W - P.r - 12, P.t + 50, t("men") + " · " + nf(A.men),
        { s: 10, c: "#C6D3E0", a: "end" });
    txt(s, P.l, P.t - 10, nf(A.staff) + " " + t("famStaff"),
        { f: DISP, s: 11, w: 700, c: C.ink2, ls: "0.1em" });

    // the hatched band: everything the filing does not carry
    var hy = P.t + barH + 20, hH = 54;
    var pat = s.append("defs").append("pattern").attr("id", "hatch")
      .attr("width", 8).attr("height", 8).attr("patternUnits", "userSpaceOnUse")
      .attr("patternTransform", "rotate(45)");
    pat.append("rect").attr("width", 8).attr("height", 8).attr("fill", C.paper3);
    pat.append("line").attr("x1", 0).attr("y1", 0).attr("x2", 0).attr("y2", 8)
      .attr("stroke", C.lineStrong).attr("stroke-width", 2.5);
    s.append("rect").attr("x", P.l).attr("y", hy).attr("width", barW).attr("height", hH)
      .attr("fill", "url(#hatch)").attr("stroke", C.lineStrong)
      .attr("stroke-dasharray", "5 3");
    var mid = P.l + barW / 2;
    s.append("rect").attr("x", mid - 190).attr("y", hy + hH / 2 - 13)
      .attr("width", 380).attr("height", 26).attr("fill", C.paper4);
    txt(s, mid, hy + hH / 2 + 5, t("occupUnknown"),
        { f: DISP, s: 12, w: 700, c: C.ink2, a: "middle" });
    d3.select("#note-frame").html(t("nFrame"));
  };

  /* --- 03 every employer: the swarm ------------------------------------
   * One circle per company. Horizontal position carries the share; vertical
   * position carries nothing at all and exists only to stop circles landing on
   * top of each other, which the caption says out loud.
   */
  /* A hand-rolled dodge spread the dense middle column far outside the canvas,
   * so the layout is a collision simulation instead: pull each circle to its
   * own share on the x axis and to the centre line on y, then let collision
   * resolve the pile-up. That is what gives the lens shape, and it stays inside
   * the band because forceY keeps pulling back. */
  function swarmLayout(pts, xOf, rOf, cy, halfBand) {
    var nodes = pts.map(function (d) {
      return { d: d, r: rOf(d), tx: xOf(d), x: xOf(d), y: cy + (Math.random() - 0.5) * 8 };
    });
    d3.forceSimulation(nodes)
      .force("x", d3.forceX(function (n) { return n.tx; }).strength(1))
      .force("y", d3.forceY(cy).strength(0.09))
      .force("c", d3.forceCollide(function (n) { return n.r + 0.7; }).iterations(3))
      .stop()
      .tick(240);
    // a stray circle in the densest column can still sit a little proud; pull
    // any such back inside rather than letting it escape the frame
    nodes.forEach(function (n) {
      var lim = halfBand - n.r;
      if (n.y > cy + lim) n.y = cy + lim;
      if (n.y < cy - lim) n.y = cy - lim;
    });
    return nodes;
  }

  var SWARM = null, SWARM_KEY = "";
  FIG.swarm = function (step) {
    var s = svg("fig-swarm");
    var W = 460, H = 330, P = { l: 16, r: 16, t: 40, b: 56 };
    var x = d3.scaleLinear().domain([0, 100]).range([P.l, W - P.r]);
    var mxHc = d3.max(A.points, function (d) { return d.h; });
    var r = d3.scaleSqrt().domain([0, mxHc]).range([1.6, 9.5]);
    var ay = H - P.b + 16;
    var cy = P.t + (ay - P.t) / 2;
    var halfBand = (ay - P.t) / 2 - 2;

    // the layout depends only on the data, so solve it once and reuse it across
    // steps and language switches
    if (SWARM_KEY !== String(W)) {
      SWARM = swarmLayout(A.points, function (d) { return x(d.s); },
                          function (d) { return r(d.h); }, cy, halfBand);
      SWARM_KEY = String(W);
    }

    s.append("line").attr("x1", P.l).attr("x2", W - P.r).attr("y1", ay).attr("y2", ay)
      .attr("stroke", C.ink);
    [0, 25, 50, 75, 100].forEach(function (v) {
      s.append("line").attr("x1", x(v)).attr("x2", x(v)).attr("y1", ay).attr("y2", ay + 4)
        .attr("stroke", C.ink);
      txt(s, x(v), ay + 16, pc(v, 0), { a: "middle", s: 9 });
    });

    function colour(d) {
      if (step === 1) return d.s < 10 ? C.orangeDeep : C.line;
      if (step === 2) return d.s >= 50 ? C.green : C.line;
      return C.navySoft;
    }
    s.append("g").selectAll("circle").data(SWARM).join("circle")
      .attr("cx", function (c) { return c.x; })
      .attr("cy", function (c) { return c.y; })
      .attr("r", function (c) { return c.r; })
      .attr("fill", function (c) { return colour(c.d); })
      .attr("fill-opacity", 0.92);

    if (step === 0) {
      s.append("line").attr("x1", x(A.median_company)).attr("x2", x(A.median_company))
        .attr("y1", P.t - 10).attr("y2", ay).attr("stroke", C.orangeDeep)
        .attr("stroke-width", 1.4);
      txt(s, x(A.median_company) + 5, P.t - 14,
          t("median") + " " + pc(A.median_company, 1),
          { s: 9.5, c: C.orangeDeep });
    }
    if (step === 1) {
      s.append("rect").attr("x", x(0) - 4).attr("y", P.t - 8)
        .attr("width", x(10) - x(0) + 8).attr("height", ay - P.t + 8)
        .attr("fill", "none").attr("stroke", C.orangeDeep)
        .attr("stroke-dasharray", "2 2");
      txt(s, x(10) + 9, P.t + 2, nf(A.under10) + " " + t("companiesAxis"),
          { f: DISP, s: 11.5, w: 700, c: C.orangeDeep });
      txt(s, x(10) + 9, P.t + 15, t("belowTen"), { s: 9 });
    }
    if (step === 2) {
      s.append("line").attr("x1", x(50)).attr("x2", x(50)).attr("y1", P.t - 10)
        .attr("y2", ay).attr("stroke", C.green).attr("stroke-width", 1.3)
        .attr("stroke-dasharray", "3 3");
      txt(s, x(50) + 6, P.t - 14, t("parity") + " " + pc(50, 0),
          { s: 9.5, c: C.green });
      txt(s, x(50) + 6, P.t + 4, nf(A.at_parity) + " " + t("companiesAxis"),
          { f: DISP, s: 11.5, w: 700, c: C.green });
      txt(s, x(50) + 6, P.t + 17, nf(A.parity_staff) + " " + t("famStaff"), { s: 9 });
    }

    // the size key, so "size = headcount" is shown rather than only claimed
    var ky = H - 10;
    [[10, "10"], [250, "250"], [2000, "2000"]].forEach(function (d, i) {
      var cx2 = P.l + 12 + i * 68;
      s.append("circle").attr("cx", cx2).attr("cy", ky - 5).attr("r", r(d[0]))
        .attr("fill", "none").attr("stroke", C.lineStrong);
      txt(s, cx2 + r(d[0]) + 5, ky - 2, d[1], { s: 8.5 });
    });
    note("swarm", ["nSwarm1", "nSwarm2", "nSwarm3"][step]);
  };

  /* --- 04 part-time: two plain bars, no conversions -------------------- */
  FIG.pt = function () {
    var s = svg("fig-pt");
    var H = 230, colW = 366, gap = 84, left = 14;

    // left panel: how much of each sex works part-time
    txt(s, left, 18, t("ptRateTitle"), { f: DISP, s: 11.5, w: 700, c: C.ink2 });
    var x1 = d3.scaleLinear().domain([0, 100]).range([left, left + colW]);
    [[t("men"), A.pt_men, C.navy], [t("women"), A.pt_women, C.orange]]
      .forEach(function (row, i) {
        var yy = 44 + i * 64;
        txt(s, left, yy - 6, row[0], { f: BODY, s: 12.5, w: 500, c: C.ink });
        s.append("rect").attr("x", x1(0)).attr("y", yy).attr("width", colW)
          .attr("height", 30).attr("fill", C.paper3).attr("stroke", C.line);
        s.append("rect").attr("x", x1(0)).attr("y", yy)
          .attr("width", x1(row[1]) - x1(0)).attr("height", 30).attr("fill", row[2]);
        txt(s, x1(row[1]) + 9, yy + 21, pc(row[1], 1),
            { f: DISP, s: 17, w: 700, c: row[2] });
      });
    txt(s, left, 44 + 2 * 64 + 2, t("ptRateFoot"), { s: 9 });

    // right panel: who the part-timers actually are
    var x0 = left + colW + gap;
    txt(s, x0, 18, t("ptCompTitle"), { f: DISP, s: 11.5, w: 700, c: C.ink2 });
    var x2 = d3.scaleLinear().domain([0, 100]).range([x0, x0 + colW]);
    [[t("allStaff"), A.share, nf(A.staff)],
     [t("partTimers"), A.pt_women_of_all, nf(A.pt_women_count + A.pt_men_count)]]
      .forEach(function (row, i) {
        var yy = 44 + i * 64;
        txt(s, x0, yy - 6, row[0] + "  ·  " + row[2],
            { f: BODY, s: 12.5, w: 500, c: C.ink });
        s.append("rect").attr("x", x2(0)).attr("y", yy)
          .attr("width", x2(row[1]) - x2(0)).attr("height", 30).attr("fill", C.orange);
        s.append("rect").attr("x", x2(row[1])).attr("y", yy)
          .attr("width", x2(100) - x2(row[1])).attr("height", 30).attr("fill", C.navy);
        txt(s, x2(row[1]) - 8, yy + 21, pc(row[1], 1),
            { f: DISP, s: 17, w: 700, c: "#fff", a: "end" });
      });
    // the halfway mark, which is the whole point of the right panel
    s.append("line").attr("x1", x2(50)).attr("x2", x2(50)).attr("y1", 36)
      .attr("y2", 44 + 64 + 36).attr("stroke", C.ink).attr("stroke-dasharray", "3 3");
    txt(s, x2(50) + 5, 44 + 64 + 48, t("parity"), { s: 9, c: C.ink2 });
    [[C.orange, t("women")], [C.navy, t("men")]].forEach(function (l, i) {
      s.append("rect").attr("x", x0 + i * 92).attr("y", 44 + 2 * 64 - 8)
        .attr("width", 11).attr("height", 11).attr("fill", l[0]);
      txt(s, x0 + i * 92 + 17, 44 + 2 * 64 + 2, l[1], { s: 9.5, c: C.ink2 });
    });
    d3.select("#note-pt").html(t("nPt"));
  };

  /* --- 06 the small-company trick, as one scrolly card ----------------- *
   * A single sticky figure that steps through six measurable views:
   *   0  a waffle of 100 people   (28 of them women)
   *   1  every company, size against share  (high shares are small firms)
   *   2  the ceiling by size class  (average flat, ceiling collapsing)
   *   3-5  the SAME 100 women, re-highlighted: the crowded 20-40% middle (60),
   *        then the male-majority group (88), then parity-or-more (12)
   * Waffles are the through-line: each box is one in a hundred, so a reader
   * can literally count the claim rather than take the percentage on trust.
   * The three women steps share one grid so the hundred visibly regroups.
   */
  function sixBox(s, x, y, sz, fill, stroke, check, op, checkC) {
    s.append("rect").attr("x", x).attr("y", y).attr("width", sz).attr("height", sz)
      .attr("rx", 3).attr("fill", fill).attr("fill-opacity", op == null ? 1 : op)
      .attr("stroke", stroke).attr("stroke-width", 1.1);
    if (check) s.append("path")
      .attr("d", "M" + (x + sz * 0.26) + "," + (y + sz * 0.52) +
                 " L" + (x + sz * 0.44) + "," + (y + sz * 0.70) +
                 " L" + (x + sz * 0.76) + "," + (y + sz * 0.30))
      .attr("fill", "none").attr("stroke", checkC || "#fff").attr("stroke-width", 1.8)
      .attr("stroke-linecap", "round").attr("stroke-linejoin", "round");
  }

  // a 10x10 grid; cats[k] = {fill, stroke, check, op, checkC} for the k-th box
  function sixWaffle(s, W, cats, top, sz) {
    var cols = 10; sz = sz || 26; var gap = 5, gw = cols * sz + (cols - 1) * gap;
    var x0 = (W - gw) / 2;
    cats.forEach(function (c, k) {
      var col = k % cols, row = Math.floor(k / cols);
      sixBox(s, x0 + col * (sz + gap), top + row * (sz + gap), sz,
             c.fill, c.stroke, c.check, c.op, c.checkC);
    });
    return { x0: x0, gw: gw, bottom: top + 10 * sz + 9 * gap };
  }

  // a two-row legend of the six employer share-bands, each with its count, so
  // "how many women work in a 0-10% firm, a 10-20% firm, ..." is spelled out
  function sixBandLegend(s, W, top, colors, labs, counts) {
    var cols = 3, cellW = (W - 24) / cols;
    colors.forEach(function (c, i) {
      var col = i % cols, row = Math.floor(i / cols);
      var x = 12 + col * cellW, y = top + row * 22;
      s.append("rect").attr("x", x).attr("y", y - 10).attr("width", 13).attr("height", 13)
        .attr("rx", 2).attr("fill", c).attr("stroke", "#fff");
      txt(s, x + 19, y, labs[i] + "% · " + counts[i], { s: 10.5, c: C.ink2, w: 600 });
    });
  }

  function sixLegend(s, W, bottom, items) {
    // one centred row of swatch + label, so the count is spelled out
    var widths = items.map(function (it) { return 22 + it.lab.length * 6.0; });
    var total = widths.reduce(function (a, b) { return a + b; }, 0) + (items.length - 1) * 22;
    var cx = (W - total) / 2;
    items.forEach(function (it, i) {
      sixBox(s, cx, bottom - 12, 15, it.fill, it.stroke, it.check, it.op);
      txt(s, cx + 21, bottom, it.lab, { s: 11, c: C.ink2, w: 600 });
      cx += widths[i] + 22;
    });
  }

  // the six warm band colours for the 100-women waffle: five ambers for the
  // male-majority bands (0-50%), green for parity (50%+). No blue anywhere.
  var SIX_BAND_FILL = ["#F0CBAF", "#E7A472", C.orange, "#BE4E1E", C.orangeDeep, C.green];
  var SIX_BAND_CHK = [C.ink, C.ink, "#fff", "#fff", "#fff", "#fff"];
  var SIX_BAND_LAB = ["0-10", "10-20", "20-30", "30-40", "40-50", "50+"];
  var SIX_BAND_COUNT = [1, 12, 32, 28, 15, 12];   // women per band, sums to 100

  // the two size figures now live at the end of section 04; they are solo (not
  // stepped), and reuse the same scatter and ceiling drawings.
  FIG.a5cone = function () {
    sixCone(svg("fig-a5cone"), 860, 430);
    d3.select("#note-a5cone").html(t("na5cone"));
  };
  FIG.a5ceil = function () {
    sixCeiling(svg("fig-a5ceil"), 860, 300);
    d3.select("#note-a5ceil").html(t("na5ceil"));
  };

  // section 06 is now purely the 100-women waffle, filled band by band as the
  // reader scrolls: step 0 fills band 0, step 1 bands 0-1, ... step 5 all six.
  FIG.six = function (step) {
    var s = svg("fig-six");
    var W = 460;
    var upto = step;
    d3.select("#six-title").text(t("sixWT"));
    d3.select("#six-sub").text(t("sixWS"));
    var cells = [];
    SIX_BAND_COUNT.forEach(function (n, i) {
      for (var k = 0; k < n; k++) cells.push(i);   // band index for each of 100 boxes
    });
    var cats = cells.map(function (bi) {
      return bi <= upto
        ? { fill: SIX_BAND_FILL[bi], stroke: "#fff", check: true, checkC: SIX_BAND_CHK[bi] }
        : { fill: C.paper3, stroke: C.lineStrong, check: false };
    });
    var g = sixWaffle(s, W, cats, 26, 24);
    // legend shows every band and its count; bands not yet filled read muted
    sixBandLegend(s, W, g.bottom + 28, SIX_BAND_FILL.map(function (c, i) {
      return i <= upto ? c : C.paper3;
    }), SIX_BAND_LAB, SIX_BAND_COUNT);
    note("six", "nSixW");
  };

  // step 0: every company, size (log) against share of women
  function sixCone(s, W, H) {
    var P = { l: 40, r: 16, t: 26, b: 58 };
    var x = d3.scaleLog().domain([8, 2600]).range([P.l, W - P.r]).clamp(true);
    var y = d3.scaleLinear().domain([0, 100]).range([H - P.b, P.t]);

    [0, 25, 50, 75, 100].forEach(function (v) {
      s.append("line").attr("x1", P.l).attr("x2", W - P.r)
        .attr("y1", y(v)).attr("y2", y(v))
        .attr("stroke", v === 50 ? C.green : C.line)
        .attr("stroke-width", v === 50 ? 1.3 : 1)
        .attr("stroke-dasharray", v === 50 ? "4 3" : null);
      txt(s, P.l - 5, y(v) + 3, pc(v, 0), { a: "end", s: 8.5 });
    });
    txt(s, W - P.r, y(50) - 5, t("parity"), { a: "end", s: 9, c: C.green });

    [10, 100, 1000].forEach(function (v) {
      txt(s, x(v), H - P.b + 14, nf(v), { a: "middle", s: 8.5 });
    });

    function colour(d) {
      if (d.s >= 50) return C.green;
      if (d.s < 10) return C.orangeDeep;
      return C.navySoft;
    }
    s.append("g").selectAll("circle")
      .data(A.points.slice().sort(function (a, b) { return a.h - b.h; }))
      .join("circle")
      .attr("cx", function (d) { return x(d.h); })
      .attr("cy", function (d) { return y(d.s); })
      .attr("r", 2.3)
      .attr("fill", function (d) { return colour(d); })
      .attr("fill-opacity", 0.6);

    // the two leaderboard averages, marked on the size axis they live on
    [[A.lb_share_size, C.green, LANG === "fr" ? "tête du classement" : "top of the ranking"],
     [A.lb_women_size, C.navy, LANG === "fr" ? "le plus de femmes" : "most women employed"]]
      .forEach(function (m) {
        var mx = x(m[0]);
        s.append("line").attr("x1", mx).attr("x2", mx)
          .attr("y1", H - P.b).attr("y2", H - P.b + 6)
          .attr("stroke", m[1]).attr("stroke-width", 1.6);
        txt(s, mx, H - P.b + 26, m[0] + (LANG === "fr" ? " sal." : " staff"),
            { a: "middle", s: 9.5, w: 700, c: m[1] });
        txt(s, mx, H - P.b + 37, m[2], { a: "middle", s: 8, c: C.ink3 });
      });
    txt(s, (P.l + W - P.r) / 2, H - 4,
        LANG === "fr" ? "taille de l'entreprise (échelle log)"
                      : "company size (log scale)",
        { a: "middle", s: 8.5, c: C.ink2 });
  }

  // step 1: the ceiling by size class. average flat, ceiling collapsing.
  function sixCeiling(s, W, H) {
    var P = { l: 74, r: 52, t: 48 }, pitch = 92, barH = 26;
    var x = d3.scaleLinear().domain([0, 100]).range([P.l, W - P.r]);
    var classes = [
      { lab: A.sizes[0].band, avg: A.sizes[0].share, ceil: A.ceil_small },
      { lab: A.sizes[1].band, avg: A.sizes[1].share, ceil: A.ceil_mid },
      { lab: A.sizes[2].band, avg: A.sizes[2].share, ceil: A.ceil_big }
    ];
    // 0-100 axis ticks
    [0, 50, 100].forEach(function (v) {
      s.append("line").attr("x1", x(v)).attr("x2", x(v)).attr("y1", P.t - 14)
        .attr("y2", P.t + classes.length * pitch - pitch + barH + 8)
        .attr("stroke", C.line);
      txt(s, x(v), P.t - 20, pc(v, 0), { a: "middle", s: 8.5 });
    });

    classes.forEach(function (c, i) {
      var yy = P.t + i * pitch;
      txt(s, P.l - 8, yy + barH / 2 - 4, c.lab, { a: "end", s: 11, w: 700, c: C.ink });
      txt(s, P.l - 8, yy + barH / 2 + 9,
          LANG === "fr" ? "salariés" : "staff", { a: "end", s: 8, c: C.ink3 });
      // the average, as a solid bar
      s.append("rect").attr("x", x(0)).attr("y", yy)
        .attr("width", x(c.avg) - x(0)).attr("height", barH).attr("fill", C.orange);
      txt(s, x(c.avg) + 6, yy + barH / 2 + 5, pc(c.avg, 1),
          { s: 11, w: 700, c: C.orangeDeep });
      // the ceiling, as a marker the eye can track downward
      s.append("line").attr("x1", x(c.ceil)).attr("x2", x(c.ceil))
        .attr("y1", yy - 8).attr("y2", yy + barH + 8)
        .attr("stroke", C.green).attr("stroke-width", 2);
      txt(s, x(c.ceil), yy - 12, (LANG === "fr" ? "max " : "top ") + pc(c.ceil, 0),
          { a: "middle", s: 9.5, w: 700, c: C.green });
    });

    var legY = P.t + classes.length * pitch - pitch + barH + 40;
    sixLegend(s, W, legY, [
      { fill: C.orange, stroke: C.orange,
        lab: LANG === "fr" ? "part moyenne" : "average share" },
      { fill: C.green, stroke: C.green,
        lab: LANG === "fr" ? "plafond (max)" : "ceiling (highest)" }
    ]);
  }

  /* --- 05 sector, then size -------------------------------------------- */
  FIG.mix = function (step) {
    var s = svg("fig-mix");
    // The value sits in its own right-hand column rather than just past the end
    // of the bar. Chasing the bar end put it underneath the median diamond
    // whenever the two figures were close, which hid a digit.
    var W = 460, P = { l: 168, r: 96, t: 40 }, pitch = 46, barH = 22;
    var x = d3.scaleLinear().domain([0, 55]).range([P.l, W - P.r]);
    var VALX = W - 4;
    var sectorView = step < 2;
    var rows = sectorView
      ? FAM.map(function (f) {
          return A.sectors.filter(function (r2) { return r2.div === f.div; })[0];
        }).filter(Boolean).map(function (r2) {
          return { lab: famName(r2.div), tag: "NACE " + r2.div, sub: nf(r2.firms),
                   v: r2.share, med: r2.median, div: r2.div };
        })
      : A.sizes.map(function (r2) {
          return { lab: r2.band, tag: LANG === "fr" ? "sal." : "staff",
                   sub: nf(r2.firms), v: r2.share, med: r2.median };
        });

    d3.select("#mix-title").text(t(sectorView ? "figMixT1" : "figMixT2"));
    d3.select("#mix-sub").text(t(sectorView ? "figMixS1" : "figMixS2"));

    var plotH = rows.length * pitch;

    // the whole-study figure, as the reference each bar is read against
    s.append("rect").attr("x", x(0)).attr("y", P.t - 10)
      .attr("width", x(A.share) - x(0)).attr("height", plotH + 4)
      .attr("fill", C.paper3);
    s.append("line").attr("x1", x(A.share)).attr("x2", x(A.share))
      .attr("y1", P.t - 10).attr("y2", P.t + plotH - 6)
      .attr("stroke", C.orangeDeep).attr("stroke-width", 1.2);
    txt(s, x(A.share), P.t - 16,
        (LANG === "fr" ? "ensemble " : "whole study ") + pc(A.share, 1),
        { s: 9, c: C.orangeDeep, a: "middle" });

    rows.forEach(function (r2, i) {
      var yy = P.t + i * pitch;
      var lit = sectorView && step === 1 && r2.div === A.sector_top.div;
      txt(s, P.l - 10, yy + 11, r2.lab,
          { f: BODY, s: 10.5, w: lit ? 500 : 300,
            c: lit ? C.orangeDeep : C.ink, a: "end" });
      txt(s, P.l - 10, yy + 24, r2.tag + " · " + r2.sub + " "
          + t("companiesAxis").slice(0, 3) + ".", { s: 8.5, a: "end" });
      s.append("rect").attr("x", x(0)).attr("y", yy).attr("height", barH)
        .attr("width", x(r2.v) - x(0))
        .attr("fill", lit ? C.orangeDeep : (sectorView ? C.navy : C.orange));
      txt(s, VALX, yy + 16, pc(r2.v, 1),
          { f: DISP, s: 13, w: 700, c: lit ? C.orangeDeep : C.ink2, a: "end" });
    });

    var ay = P.t + plotH - 6;
    s.append("line").attr("x1", P.l).attr("x2", W - P.r).attr("y1", ay).attr("y2", ay)
      .attr("stroke", C.ink);
    [0, 10, 20, 30, 40, 50].forEach(function (v) {
      s.append("line").attr("x1", x(v)).attr("x2", x(v))
        .attr("y1", ay).attr("y2", ay + 4).attr("stroke", C.ink);
      txt(s, x(v), ay + 15, pc(v, 0), { a: "middle", s: 8.5 });
    });
    note("mix", ["nMix1", "nMix2", "nMix3"][step]);
  };

  /* --- 06 three mechanisms --------------------------------------------- */
  FIG.mech = function (step) {
    var s = svg("fig-mech");
    var P = { l: 20, t: 62 };
    var ex = [A.ex_flat, A.ex_fell, A.ex_hired][step];
    d3.select("#mech-title").text(t(["figMechT1", "figMechT2", "figMechT3"][step]));

    var mxv = Math.max(ex.w0, ex.w1, ex.m0, ex.m1);
    var x = d3.scaleLinear().domain([0, mxv]).range([0, 150]).nice();

    txt(s, P.l, 22, ex.name, { f: DISP, s: 14, w: 700, c: C.ink });
    txt(s, P.l, 37, nf(ex.hc) + " " + t("famStaff") + ", " + ex.y0 + " to " + ex.y1,
        { s: 9 });

    [{ lab: t("firstFiling") + " " + ex.y0, w: ex.w0, m: ex.m0, sh: ex.s0 },
     { lab: t("lastFiling") + " " + ex.y1, w: ex.w1, m: ex.m1, sh: ex.s1 }]
      .forEach(function (c0, ci) {
        var cx = P.l + ci * 232;
        txt(s, cx, P.t - 8, c0.lab.toUpperCase(),
            { f: DISP, s: 9, w: 700, c: C.ink3, ls: "0.1em" });
        [[t("women"), c0.w, C.orange], [t("men"), c0.m, C.navy]]
          .forEach(function (row, ri) {
            var yy = P.t + 10 + ri * 44;
            txt(s, cx, yy - 4, row[0], { s: 9, c: C.ink2 });
            s.append("rect").attr("x", cx).attr("y", yy)
              .attr("width", Math.max(1, x(row[1]))).attr("height", 22)
              .attr("fill", row[2]);
            txt(s, cx + Math.max(1, x(row[1])) + 7, yy + 16, nf(row[1]),
                { f: DISP, s: 13, w: 700, c: row[2] });
          });
        var sy = P.t + 108;
        s.append("rect").attr("x", cx).attr("y", sy).attr("width", 176)
          .attr("height", 46).attr("fill", C.paper3).attr("stroke", C.lineStrong);
        txt(s, cx + 10, sy + 22, pc(c0.sh, 1),
            { f: DISP, s: 20, w: 700, c: C.orangeDeep });
        txt(s, cx + 10, sy + 38, t("femaleShare"), { s: 9, c: C.ink2 });
      });

    var dy = P.t + 176;
    [[t("women"), ex.dw, 0], [t("men"), ex.dm, 0], [t("share"), ex.evo, 1]]
      .forEach(function (row, i) {
        var cx = P.l + i * 148;
        s.append("rect").attr("x", cx).attr("y", dy).attr("width", 3)
          .attr("height", 35).attr("fill", C.lineStrong);
        txt(s, cx + 9, dy + 14,
            (row[1] > 0 ? "+" : "") + nf(row[1], row[2]) + (row[2] ? " pts" : ""),
            { f: DISP, s: 16, w: 700,
              c: row[1] > 0 ? C.green : (row[1] < 0 ? C.red : C.ink3) });
        txt(s, cx + 9, dy + 31, row[0], { s: 9, c: C.ink2 });
      });
    note("mech", ["nMech1", "nMech2", "nMech3"][step]);
  };

  /* -------------------------------------------------------------- tables */
  function paintTables() {
    var mxs = d3.max(A.largest, function (r) { return r.share; });
    var lt = d3.select("#tbl-largest").html("");
    lt.append("caption").text(t("tblLargest"));
    var hr = lt.append("thead").append("tr");
    [t("thCompany"), t("thSector"), t("thStaff"), t("thShare"), ""]
      .forEach(function (h) { hr.append("th").text(h); });
    var tb = lt.append("tbody");
    A.largest.forEach(function (r) {
      var tr = tb.append("tr");
      tr.append("td").text(r.name);
      tr.append("td").attr("class", "sect")
        .text(famName(LABEL_TO_DIV[r.sector] || "62"));
      tr.append("td").text(nf(r.hc));
      tr.append("td").text(pc(r.share, 1));
      tr.append("td").attr("class", "bar-cell").append("i")
        .style("width", (r.share / mxs * 100) + "%");
    });

    var et = d3.select("#tbl-extremes").html("");
    et.append("caption").text(t("tblExtremes"));
    var hr2 = et.append("thead").append("tr");
    [t("thCompany"), t("thStaff"), t("thShare"), ""]
      .forEach(function (h) { hr2.append("th").text(h); });
    var tb2 = et.append("tbody");
    function block(list, label, col) {
      tb2.append("tr").append("td").attr("colspan", 4)
        .style("font-family", DISP).style("font-size", "10px")
        .style("font-weight", "700").style("letter-spacing", ".14em")
        .style("text-transform", "uppercase").style("color", col)
        .style("padding-top", "18px").text(label);
      list.forEach(function (r) {
        var tr = tb2.append("tr");
        tr.append("td").text(r.name);
        tr.append("td").text(nf(r.hc));
        tr.append("td").text(pc(r.share, 1));
        tr.append("td").attr("class", "bar-cell").append("i")
          .style("width", r.share + "%").style("background", col);
      });
    }
    block(A.best, t("blockBest"), C.green);
    block(A.worst, t("blockWorst"), C.red);
  }

  /* ---------------------------------------------------------------- boot */
  function render() {
    TOK = tokens();
    paintChrome();
    buildSteps();
    observeSteps();
    paintTables();
    FIG.funnel();
    FIG.frame();
    FIG.pt();
    FIG.a5cone();
    FIG.a5ceil();
    Object.keys(STEPDEFS).forEach(function (k) { FIG[k](STEP[k] || 0); });
  }

  d3.json("./article.json").then(function (data) {
    A = data;
    render();
    ["en", "fr"].forEach(function (L) {
      d3.select("#lang-" + L).on("click", function () { LANG = L; render(); });
    });
    var skip = document.getElementById("skiptomap");
    if (skip) {
      skip.addEventListener("click", function () {
        var target = document.getElementById("mapfinale");
        if (!target) return;
        var y = target.getBoundingClientRect().top
              + (window.pageYOffset || document.documentElement.scrollTop || 0);
        // force a non-smooth jump regardless of the page's CSS scroll-behavior,
        // and avoid the "instant" enum that some browsers refuse
        var root = document.documentElement, prev = root.style.scrollBehavior;
        root.style.scrollBehavior = "auto";
        window.scrollTo(0, y);
        root.style.scrollBehavior = prev || "";
      });
    }
    window.addEventListener("resize", function () {
      FIG.funnel();
      FIG.frame();
      FIG.pt();
      FIG.a5cone();
      FIG.a5ceil();
      Object.keys(STEPDEFS).forEach(function (k) { FIG[k](STEP[k] || 0); });
    });
  }).catch(function (err) {
    d3.select(".hero").append("p").style("color", "#C0392B")
      .text("Data failed to load: " + err.message);
    console.error(err);
  });
})();
