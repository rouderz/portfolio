import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { getPosts, getProjects } from "@/lib/content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/projects/", "/blog/", "/about/"].map((path) => ({
    url: absoluteUrl(path),
  }));
  const projects = getProjects().map((p) => ({
    url: absoluteUrl(`/projects/${p.slug}/`),
    lastModified: p.date,
  }));
  const posts = getPosts().map((p) => ({
    url: absoluteUrl(`/blog/${p.slug}/`),
    lastModified: p.date,
  }));
  return [...pages, ...projects, ...posts];
}
