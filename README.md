# Portfolio

A website to publish the **projects** and **articles** of Wolfgang Welcomez and team.
Built with **Next.js + React + TypeScript**, exported as a **static** site (real HTML per page) and hosted for free on GitHub Pages.

Includes: home page, project list with **tag filtering**, one page per project, blog, about page, RSS, sitemap, SEO/OpenGraph,
light/dark mode, responsive and accessible design (semantic HTML, skip link, visible focus, `prefers-reduced-motion`).

## Stack

| Piece     | Choice                                     | Why                                                           |
| --------- | ------------------------------------------ | ------------------------------------------------------------- |
| Framework | Next.js (App Router, `output: "export"`)   | Well-known React, static HTML per page (good SEO), no server. |
| Language  | Strict TypeScript                          | Errors caught at compile time.                                |
| Styling   | CSS Modules                                | Each component's CSS lives in its own file, no dependencies.  |
| Content   | MDX/Markdown in `content/` + `gray-matter` | Adding a project means adding a file.                         |
| Quality   | ESLint, Prettier, `tsc`                    | The same checks locally and in CI.                            |

## Structure

Everything lives in its own file: markup (`.tsx`), styles (`.module.css`) and data (`content/`, `lib/`) are never mixed.

```
content/
├── projects/            # one .md/.mdx per project
└── blog/                # one .md/.mdx per post
public/                  # files served as-is (favicon, images)
src/
├── app/                 # routes (one folder = one URL)
│   ├── layout.tsx       # shared structure: header, content, footer
│   ├── globals.css      # design tokens (colors, dark theme) and base styles
│   ├── page.tsx         # home
│   ├── projects/        # list + [slug]/ (detail)
│   ├── blog/            # list + [slug]/
│   ├── about/
│   └── rss.xml/ sitemap.ts robots.ts
├── components/          # one folder per component:
│   └── ProjectCard/     #   ProjectCard.tsx + ProjectCard.module.css
└── lib/
    ├── site.ts          # name, author, links, navigation   <- edit me
    ├── team.ts          # team shown on the About page      <- edit me
    ├── content.ts       # content loading and validation
    └── format.ts
```

## Adding content

### A project

1. Create `content/projects/my-project.mdx` (the file name is the URL).
2. Fill in the frontmatter:

```mdx
---
title: My project
description: One short sentence.
date: 2026-10-20
tags: [Web, TypeScript]
cover: /images/my-cover.png # optional; the file goes in public/images/
coverAlt: Description of the image
featured: true # shown on the home page
draft: false # true = hidden
authors: [Wolfgang Welcomez]
links:
  - label: Demo
    href: https://example.com
---

Text in Markdown. In .mdx you can use <Callout title="Heads up">components</Callout>.
```

3. `git add . && git commit -m "feat(content): add my-project" && git push`.

If `title` or `description` is missing, or the date is invalid, the build fails with a message naming the file.

### A post

Same thing, in `content/blog/`, with `title`, `description`, `date` and optionally `tags`, `authors`, `draft`.

### A new component

Create `src/components/MyThing/MyThing.tsx` and `MyThing.module.css`. Import it with `@/components/MyThing/MyThing`.
To use it inside an `.mdx` file, register it in `src/components/Prose/Prose.tsx`.

In `.mdx` files you can already use `<Callout>` and `<Screenshots title="…" items={[{ src, alt, caption }]} />` (see `content/projects/gift-it.mdx`). Put images in `public/images/<project>/`; WebP keeps them small.

## Local development

Requires Node.js >= 22.12.

```bash
npm install
npm run dev            # http://localhost:3000
npm run lint           # ESLint
npm run typecheck      # TypeScript
npm run format         # Prettier
npm run build          # generates the static site in out/
```

## Free hosting comparison

| Option                    | Pros                                                     | Cons                                             |
| ------------------------- | -------------------------------------------------------- | ------------------------------------------------ |
| **GitHub Pages** (chosen) | Free, integrated with the repo, HTTPS and custom domain. | Static only; public repo on the free plan.       |
| Cloudflare Pages          | Generous bandwidth, PR previews, private repos.          | Extra account.                                   |
| Vercel (Hobby)            | Most convenient for Next.js, PR previews.                | Hobby plan is personal, non-commercial use only. |
| Netlify (Free)            | Previews, forms.                                         | Credit system: the allowance runs out sooner.    |

Limits change; check each provider's pricing page. The site is static, so moving to another host is easy.

## Deploying to GitHub Pages

1. Create the repo on GitHub and push the code (public on the free plan).
2. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
3. Every push to `main` runs `.github/workflows/deploy.yml`: install, lint, type-check, format check, build and publish. Pull requests only build.
4. The site lives at `https://<user>.github.io/<repo>/`. The workflow derives `SITE_URL` and `BASE_PATH` from the user and repo name.

### Custom domain

1. At your DNS provider, create a `CNAME` pointing to `<user>.github.io` ([official guide](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site)).
2. **Settings → Pages → Custom domain**, and enable _Enforce HTTPS_.
3. In the workflow set `SITE_URL: https://yourdomain.com` and `BASE_PATH: ""`.
4. Same if the repo is named `<user>.github.io`: `BASE_PATH: ""`.

## Notes

- `public/og-default.svg` is the default OpenGraph image; some social networks only accept PNG/JPG, so replace it with a 1200×630 image when you can.
- No telemetry, no cookies.
- With `output: "export"` there is no server: don't use dynamic routes without `generateStaticParams`, or Server Actions.

## Contributing

1. Create a branch (`git switch -c feat/my-change`).
2. Use [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `chore:`…).
3. Before opening a PR: `npm run lint && npm run typecheck && npm run format:check && npm run build`.
4. Open a PR to `main`; CI must pass.

## License

[MIT](LICENSE)
