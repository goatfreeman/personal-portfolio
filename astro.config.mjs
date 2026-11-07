import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
export default defineConfig({ site: "https://goatfreeman.github.io", base: "/personal-portfolio", integrations: [mdx(), sitemap()] });
