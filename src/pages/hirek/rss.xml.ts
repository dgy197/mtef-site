import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getNews, urlOf, labelOf } from '../../lib/news';

/** /hirek/rss.xml: every published item, newest first. */
export const GET: APIRoute = async (context) => {
  const news = await getNews();
  return rss({
    title: 'MTEF – hírek és közlemények',
    description: 'A Magyar Tűzvédelmi Egyeztető Fórum hírei és szakmai közleményei.',
    site: context.site!,
    items: news.map((e) => ({
      title: e.data.title,
      description: e.data.summary,
      pubDate: e.data.date,
      link: urlOf(e),
      categories: [labelOf(e)],
    })),
    customData: '<language>hu-hu</language>',
  });
};
