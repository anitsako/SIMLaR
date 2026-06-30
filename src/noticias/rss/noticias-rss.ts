import { createServerFn } from '@tanstack/react-start';
import Parser from 'rss-parser';

export type LatestRssItem = {
  title: string;
  url: string;
  publishedAt?: string;
  summary?: string;
  imageUrl?: string;
};

export type LatestNewsItem = LatestRssItem & {
  source?: string;
};

type Input = {
  feedUrl: string;
  limit?: number;
};

function firstString(v: unknown): string | undefined {
  if (!v) return undefined;
  if (typeof v === 'string') return v;
  if (Array.isArray(v)) {
    const s = v.find((x) => typeof x === 'string');
    return s;
  }
  return undefined;
}

function extractImgFromHtml(html?: string): string | undefined {
  if (!html) return undefined;
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m?.[1];
}

function pickImageUrl(item: any): string | undefined {
  const enclosureUrl = item?.enclosure?.url;
  if (typeof enclosureUrl === 'string' && enclosureUrl.startsWith('http')) return enclosureUrl;

  const mediaContent = item?.['media:content'];
  const mediaThumb = item?.['media:thumbnail'];

  const mediaUrl =
    firstString(mediaContent?.url) ||
    firstString(mediaThumb?.url) ||
    firstString(mediaContent?.['$']?.url) ||
    firstString(mediaThumb?.['$']?.url);

  if (mediaUrl && mediaUrl.startsWith('http')) return mediaUrl;

  const html =
    firstString(item?.['content:encoded']) ||
    firstString(item?.content) ||
    firstString(item?.summary) ||
    firstString(item?.contentSnippet) ||
    firstString(item?.description);

  const fromHtml = extractImgFromHtml(html);
  if (fromHtml && fromHtml.startsWith('http')) return fromHtml;

  return undefined;
}

function stripHtml(html?: string): string | undefined {
  if (!html) return undefined;
  const text = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text || undefined;
}

const parser = new Parser({
  customFields: {
    item: ['media:content', 'media:thumbnail', 'content:encoded', 'description'],
  },
});

export const getLatestFromRssDirect = createServerFn({ method: 'POST' })
  .validator((data: Input) => data)
  .handler(async ({ data }) => {
    const limit = Math.max(1, Math.min(50, data.limit ?? 20));

    const feed = await parser.parseURL(data.feedUrl);

    const items = feed.items.slice(0, limit).map((it: any): LatestRssItem => {
      const title = (it.title ?? '').toString().trim();
      const url = (it.link ?? it.guid ?? '').toString().trim();

      const publishedAt = (it.isoDate ?? it.pubDate ?? '').toString().trim() || undefined;

      const rawSummary =
        firstString(it.contentSnippet) ||
        stripHtml(firstString(it['content:encoded'])) ||
        stripHtml(firstString(it.content)) ||
        stripHtml(firstString(it.summary)) ||
        stripHtml(firstString(it.description));

      const imageUrl = pickImageUrl(it);

      return { title, url, publishedAt, summary: rawSummary, imageUrl };
    });

    return items.filter((x) => x.title && x.url);
  });

/* =====================================================================================
   NUEVO: AGREGADOR MULTI-PORTAL (RSS + HTML)
   - IMPORTANTE: NO se pasan RegExp en input (no serializable). Se pasan pattern/flags.
   ===================================================================================== */

export type NewsSource =
  | { kind: 'rss'; name: string; feedUrl: string }
  | {
      kind: 'html';
      name: string;
      listUrl: string;
      includePattern?: string;
      includeFlags?: string;
    };

type MultiInput = {
  sources: Array<NewsSource>;
  limit?: number;
  perSource?: number;
};

function safeDateToMs(s?: string) {
  if (!s) return 0;
  const t = Date.parse(s);
  return Number.isFinite(t) ? t : 0;
}

function normalizeUrl(u: string) {
  try {
    const url = new URL(u);
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'gclid'].forEach((k) =>
      url.searchParams.delete(k)
    );
    return url.toString();
  } catch {
    return u.trim();
  }
}

function uniqByUrl(items: Array<LatestNewsItem>) {
  const seen = new Set<string>();
  const out: Array<LatestNewsItem> = [];
  for (const it of items) {
    const key = it.url ? `u:${it.url}` : `t:${it.title.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(it);
  }
  return out;
}

async function fetchFromRssSource(sourceName: string, feedUrl: string, limit: number) {
  const feed = await parser.parseURL(feedUrl);

  const rawItems = Array.isArray((feed as any).items) ? (feed as any).items : [];
  const items = rawItems.slice(0, limit).map((it: any): LatestNewsItem => {
    const title = (it.title ?? '').toString().trim();
    const url = normalizeUrl((it.link ?? it.guid ?? '').toString().trim());

    const publishedAt = (it.isoDate ?? it.pubDate ?? '').toString().trim() || undefined;

    const rawSummary =
      firstString(it.contentSnippet) ||
      stripHtml(firstString(it['content:encoded'])) ||
      stripHtml(firstString(it.content)) ||
      stripHtml(firstString(it.summary)) ||
      stripHtml(firstString(it.description));

    const imageUrl = pickImageUrl(it);

    return { title, url, publishedAt, summary: rawSummary, imageUrl, source: sourceName };
  });

  return items.filter((x: LatestNewsItem) => x.title && x.url);
}

/* ---------- HTML helpers ---------- */

function extractLinks(html: string, baseUrl: string, include?: RegExp) {
  const base = new URL(baseUrl);
  const matches = [...html.matchAll(/href=["']([^"']+)["']/gi)];

  const urls = matches
    .map((m) => m[1])
    .filter((href): href is string => typeof href === 'string' && href.length > 0)
    .map((href) => {
      try {
        return new URL(href, base).toString();
      } catch {
        return '';
      }
    })
    .filter((u) => u && u.startsWith(base.origin));

  const filtered = include ? urls.filter((u) => include.test(u)) : urls;
  return Array.from(new Set(filtered));
}

function pickMeta(html: string, propOrName: string) {
  const re1 = new RegExp(`<meta[^>]+property=["']${propOrName}["'][^>]+content=["']([^"']+)["'][^>]*>`, 'i');
  const re2 = new RegExp(`<meta[^>]+name=["']${propOrName}["'][^>]+content=["']([^"']+)["'][^>]*>`, 'i');
  return html.match(re1)?.[1] ?? html.match(re2)?.[1];
}

async function fetchArticleMeta(url: string) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'SIMLaR/1.0 (+https://larioja.gob.ar/)' },
  });
  const html = await res.text();

  const title = pickMeta(html, 'og:title') || html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() || '';

  const summary = pickMeta(html, 'og:description') || pickMeta(html, 'description') || undefined;
  const imageUrl = pickMeta(html, 'og:image') || undefined;
  const publishedAt = pickMeta(html, 'article:published_time') || pickMeta(html, 'og:updated_time') || undefined;

  return {
    title: stripHtml(title) || title,
    summary: stripHtml(summary),
    imageUrl,
    publishedAt,
  };
}

async function fetchFromHtmlSource(
  sourceName: string,
  listUrl: string,
  include: RegExp | undefined,
  perSource: number
) {
  const res = await fetch(listUrl, {
    headers: { 'User-Agent': 'SIMLaR/1.0 (+https://larioja.gob.ar/)' },
  });
  const html = await res.text();

  const links = extractLinks(html, listUrl, include).slice(0, perSource * 3);

  const out: Array<LatestNewsItem> = [];
  for (const link of links) {
    try {
      const meta = await fetchArticleMeta(link);
      if (!meta.title) continue;

      out.push({
        title: meta.title,
        url: normalizeUrl(link),
        publishedAt: meta.publishedAt,
        summary: meta.summary,
        imageUrl: meta.imageUrl,
        source: sourceName,
      });

      if (out.length >= perSource) break;
    } catch {
      // ignorar fallos individuales
    }
  }
  return out;
}

function toRegExp(pattern?: string, flags?: string): RegExp | undefined {
  if (!pattern) return undefined;
  try {
    return new RegExp(pattern, flags || undefined);
  } catch {
    return undefined;
  }
}

export const getLatestFromSources = createServerFn({ method: 'POST' })
  .validator((data: MultiInput) => data)
  .handler(async ({ data }) => {
    const limit = Math.max(1, Math.min(100, data.limit ?? 30));
    const perSource = Math.max(1, Math.min(30, data.perSource ?? 10));

    const results = await Promise.allSettled(
      data.sources.map(async (s) => {
        if (s.kind === 'rss') return fetchFromRssSource(s.name, s.feedUrl, perSource);

        const include = toRegExp(s.includePattern, s.includeFlags);
        return fetchFromHtmlSource(s.name, s.listUrl, include, perSource);
      })
    );

    const all = results.flatMap((r) => (r.status === 'fulfilled' ? r.value : []));
    const deduped = uniqByUrl(all);

    deduped.sort((a, b) => safeDateToMs(b.publishedAt) - safeDateToMs(a.publishedAt));
    return deduped.slice(0, limit);
  });
