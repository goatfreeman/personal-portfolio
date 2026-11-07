# Matthew Ho — data portfolio

Four ITCS 3162 project case studies, built from [goatfreeman/astro-blog-starter-template](https://github.com/goatfreeman/astro-blog-starter-template). The template theme is based on [Bear Blog](https://github.com/HermanMartinus/bearblog/).

## Local development

Requires Node.js 22.23.4 or newer (Node.js 24 recommended). Run `npm ci`, `npm run dev`, `npm run build`, and `npm test`. The static output is in `dist/`, configured for GitHub Pages at `/personal-portfolio/`. Change `site` in `astro.config.mjs` if the GitHub account changes. GitHub Actions builds and deploys `main` to GitHub Pages.

Project content is in `src/data/projects.json`; chart images and cleaned notebook downloads are in `public/`. The datasets are not included. See `public/notebooks/README.md` and obtain appropriately licensed source data before running notebooks. Project findings are exploratory; consult each case study's limitations.
