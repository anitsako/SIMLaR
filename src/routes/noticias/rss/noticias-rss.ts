import { createServerFn } from '@tanstack/react-start';
import Parser from 'rss-parser';

export type LatestRssItem = {
  title: string;
  url: string;
  publishedAt?: string;
  summary?: string;
  imageUrl?: string;
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
.inputValidator((data: Input) => data)
.handler(async ({ data }) => {
    const limit = Math.max(1, Math.min(50, data.limit ?? 20));

    const feed = await parser.parseURL(data.feedUrl);

    const items = feed.items.slice(0, limit).map((it: any): LatestRssItem => {
      const title = (it.title ?? '').toString().trim();
      const url = (it.link ?? it.guid ?? '').toString().trim();

      const publishedAt =
        (it.isoDate ?? it.pubDate ?? '').toString().trim() || undefined;

      const rawSummary =
        firstString(it.contentSnippet) ||
        stripHtml(firstString(it['content:encoded'])) ||
        stripHtml(firstString(it.content)) ||
        stripHtml(firstString(it.summary)) ||
        stripHtml(firstString(it.description));

      const imageUrl = pickImageUrl(it);

      return {
        title,
        url,
        publishedAt,
        summary: rawSummary,
        imageUrl,
      };
    });

    return items.filter((x) => x.title && x.url);
  });
