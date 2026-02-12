import { createServerFn } from '@tanstack/react-start'
import Parser from 'rss-parser'

const parser = new Parser()

type Input = {
  feedUrl: string
  limit?: number
}

type OutputItem = {
  title: string
  url: string
  publishedAt?: string
  summary?: string
  imageUrl?: string
}

let cache: { key: string; at: number; data: OutputItem[] } | null = null
const TTL = 10 * 60 * 1000 // 10 minutos

function cleanString(v: unknown): string {
  return typeof v === 'string' ? v.trim() : ''
}

export const getLatestFromRssDirect = createServerFn({ method: 'POST' }).handler(
  async ({ data }: { data: Input }) => {
    const feedUrl = cleanString(data?.feedUrl)
    const limit = typeof data?.limit === 'number' ? data.limit : 30

    if (!feedUrl) throw new Error('feedUrl requerido')

    const key = `${feedUrl}::${limit}`
    if (cache && cache.key === key && Date.now() - cache.at < TTL) {
      return cache.data
    }

    const feed = await parser.parseURL(feedUrl)

    const items: OutputItem[] =
      (feed.items ?? []).slice(0, limit).map((item: any) => {
        const title = cleanString(item?.title) || 'Sin título'
        const url = cleanString(item?.link) || '#'
        const publishedAt = item?.isoDate || item?.pubDate || undefined

        const summaryRaw =
          item?.contentSnippet ?? item?.summary ?? item?.content ?? ''
        const summary =
          cleanString(String(summaryRaw)).replace(/\s+/g, ' ').slice(0, 220) ||
          undefined

        const imageUrl =
          item?.enclosure?.url ||
          item?.itunes?.image ||
          undefined

        return { title, url, publishedAt, summary, imageUrl }
      })

    cache = { key, at: Date.now(), data: items }
    return items
  },
)
