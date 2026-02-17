import { parseStringPromise } from "xml2js";

const MPLUS_BASE = "https://wsearch.nlm.nih.gov/ws/query";

const KEYWORDS = [
  { q: "postpartum care", tag: "Mother" },
  { q: "postnatal care", tag: "Mother" },
  { q: "breastfeeding", tag: "Mother + Baby" },
  { q: "infant and newborn care", tag: "Baby" },
  { q: "infant development", tag: "Baby" },
  { q: "newborn screening", tag: "Baby" },
];

let cache = { expiresAt: 0, data: [] };

function todayKey() {
  const d = new Date();
  return `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`;
}

function pickKeywordsForToday() {
  const seed = todayKey().split("-").reduce((a, x) => a + Number(x), 0);
  return [
    KEYWORDS[seed % KEYWORDS.length],
    KEYWORDS[(seed + 1) % KEYWORDS.length],
    KEYWORDS[(seed + 2) % KEYWORDS.length],
  ];
}

function buildUrl(term) {
  const params = new URLSearchParams({
    db: "healthTopics",
    term,
    retmax: "10",
  });
  return `${MPLUS_BASE}?${params.toString()}`;
}

// MedlinePlus format: <content name="title">...</content>
function getContentValue(doc, wantedName) {
  const contents = doc?.content;
  if (!contents) return "";
  const list = Array.isArray(contents) ? contents : [contents];

  const match = list.find((c) => c?.$?.name === wantedName);
  if (!match) return "";

  if (typeof match === "string") return match;
  if (typeof match?._ === "string") return match._;
  return String(match._ ?? "");
}

function estimateReadTime(text) {
  const words = (text || "").trim().split(/\s+/).filter(Boolean).length;
  const mins = Math.max(2, Math.round(words / 180));
  return `${mins} min`;
}

async function fetchTopics(term) {
  const res = await fetch(buildUrl(term), {
    headers: {
      "User-Agent": "Mozilla/5.0 (MedlinePlus Fetcher)",
      Accept: "application/xml",
    },
  });

  if (!res.ok) throw new Error(`MedlinePlus error ${res.status}`);

  const xml = await res.text();

  const parsed = await parseStringPromise(xml, {
    explicitArray: false,
    trim: true,
  });

  const docsRaw = parsed?.nlmSearchResult?.list?.document;
  if (!docsRaw) return [];

  const docs = Array.isArray(docsRaw) ? docsRaw : [docsRaw];

return docs
  .map((doc) => {
    const title = getContentValue(doc, "title");
    const desc =
      getContentValue(doc, "FullSummary") ||
      getContentValue(doc, "summary") ||
      getContentValue(doc, "snippet");

    const url =
      doc?.$?.url || getContentValue(doc, "url");

    return { title, desc, url };
  })
  .filter((x) => x.title && x.url);

}

function keywordOrderForToday() {
  const seed = todayKey().split("-").reduce((a, x) => a + Number(x), 0);

  // rotate keywords deterministically based on date
  const shift = seed % KEYWORDS.length;
  return KEYWORDS.slice(shift).concat(KEYWORDS.slice(0, shift));
}


// THIS IS THE EXPORT ROUTE EXPECTS
export async function getDailyArticles(max = 7) {
  const now = Date.now();
  if (cache.data.length && now < cache.expiresAt) return cache.data;

  const orderedKeywords = keywordOrderForToday();
  const result = [];
  const seen = new Set();

  for (const pick of orderedKeywords) {
    const topics = await fetchTopics(pick.q);

    for (const t of topics) {
      if (!t.url || seen.has(t.url)) continue;
      seen.add(t.url);

      result.push({
        id: t.url,
        title: t.title,
        desc: t.desc,
        tag: pick.tag,
        readTime: estimateReadTime(t.desc),
        url: t.url,
        source: "MedlinePlus",
      });

      if (result.length >= max) break;
    }

    if (result.length >= max) break;
  }

  // fallback only if STILL empty
  if (result.length === 0) {
    result.push(
      {
        id: "https://medlineplus.gov/postpartumcare.html",
        title: "Postpartum Care",
        desc: "Care for mothers after childbirth, including physical and emotional recovery.",
        tag: "Mother",
        readTime: "4 min",
        url: "https://medlineplus.gov/postpartumcare.html",
        source: "MedlinePlus",
      },
      {
        id: "https://medlineplus.gov/infantandnewborncare.html",
        title: "Infant and Newborn Care",
        desc: "Essential information on caring for newborn babies.",
        tag: "Baby",
        readTime: "4 min",
        url: "https://medlineplus.gov/infantandnewborncare.html",
        source: "MedlinePlus",
      }
    );
  }

  cache = { data: result, expiresAt: now + 24 * 60 * 60 * 1000 };
  return result;
}
