import type { NewsSource } from './noticias-rss'

export const NUEVAS_FUENTES: Array<NewsSource> = [
  {
    kind: 'rss',
    name: 'Minería & Desarrollo',
    feedUrl: 'https://www.mineriaydesarrollo.com/rss/noticias/',
  },

  {
    kind: 'rss',
    name: 'Rumbo Minero',
    feedUrl: 'https://www.rumbominero.com/feed/',
  },

  {
    kind: 'html',
    name: 'SaltaMining',
    listUrl: 'https://saltamining.com/',
    includePattern: '/contenido/\\d+/',
    includeFlags: 'i',
  },

  {
    kind: 'html',
    name: 'Panorama Minero',
    listUrl: 'https://www.panorama-minero.com/es',
    includePattern: '/es/news',
    includeFlags: 'i',
  },

  // =========================
  // ESPACIO PARA FUTURAS FUENTES
  // =========================

  {
    kind: 'rss',
    name: 'CAEM',
    feedUrl: 'https://caem.com.ar/comunicacion/?_cat_noticias=noticias'
  },

    {
    kind: 'rss',
    name: 'EMSE',
    feedUrl: 'https://emse.ar/blog/'
  },


  /*
  {
    kind: 'html',
    name: 'Portal económico',
    listUrl: 'https://portal.com/noticias',
    includePattern: '/noticia/',
    includeFlags: 'i'
  }
  */
]