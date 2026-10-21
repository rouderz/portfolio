import { absoluteUrl, site } from "@/lib/site";
import { getPosts, getProjects } from "@/lib/content";

export const dynamic = "force-static";

const escape = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function GET() {
  const items = [
    ...getPosts().map((e) => ({ ...e, path: `/blog/${e.slug}/` })),
    ...getProjects().map((e) => ({ ...e, path: `/projects/${e.slug}/` })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .map(
      (e) => `    <item>
      <title>${escape(e.title)}</title>
      <link>${absoluteUrl(e.path)}</link>
      <guid>${absoluteUrl(e.path)}</guid>
      <pubDate>${e.date.toUTCString()}</pubDate>
      <description>${escape(e.description)}</description>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escape(site.title)}</title>
    <link>${absoluteUrl("/")}</link>
    <description>${escape(site.description)}</description>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
