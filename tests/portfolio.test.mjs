import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const slugs = ['hong-kong-internet-adoption','loan-approval-classification','weather-and-produce-prices','customer-segmentation'];
test('built site presents four case studies under the project base', () => {
  assert.ok(existsSync('dist/index.html'), 'run npm run build to produce the homepage');
  const home = readFileSync('dist/index.html', 'utf8');
  for (const slug of slugs) {
    assert.ok(home.includes(`/personal-portfolio/projects/${slug}/`), `missing ${slug} link`);
    assert.ok(existsSync(`dist/projects/${slug}/index.html`), `missing ${slug} page`);
  }
});


test('case studies preserve all project text, charts and notebooks', () => {
  const projects = JSON.parse(readFileSync('src/data/projects.json', 'utf8'));
  assert.equal(projects.length, 4);
  for (const p of projects) {
    const html = readFileSync(`dist/projects/${p.slug}/index.html`, 'utf8');
    for (const text of [p.question, p.method, p.finding, p.limitation, p.reflection]) {
      const escape = text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
      assert.ok(html.includes(escape), `missing content in ${p.slug}`);
    }
    assert.ok(html.includes(`/personal-portfolio/notebooks/${p.notebook}`));
    assert.ok(existsSync(`dist/notebooks/${p.notebook}`));
    for (const chart of p.charts) {
      assert.ok(html.includes(`/personal-portfolio/${chart.src}`));
      assert.ok(existsSync(`dist/${chart.src}`));
    }
  }
});

test('local asset and page URLs stay under the Pages base and resolve', () => {
  for (const path of ['dist/index.html', ...slugs.map(s => `dist/projects/${s}/index.html`)]) {
    const html = readFileSync(path, 'utf8');
    for (const match of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
      const url = match[1].split('#')[0].split('?')[0];
      assert.ok(url.startsWith('/personal-portfolio/'), `${path}: ${url} bypasses base`);
      const target = `dist/${url.slice('/personal-portfolio/'.length)}`;
      assert.ok(existsSync(target), `${path}: ${url} missing`);
    }
  }
});

 test('three primary destinations and the course collection are available', () => {
  for (const path of ['dist/index.html', 'dist/about/index.html', 'dist/projects/index.html']) {
    assert.ok(existsSync(path), `missing ${path}`);
    const html = readFileSync(path, 'utf8');
    for (const href of ['/personal-portfolio/', '/personal-portfolio/about/', '/personal-portfolio/projects/'])
      assert.ok(html.includes(`href="${href}"`), `${path} missing navigation to ${href}`);
  }
  const projects = readFileSync('dist/projects/index.html', 'utf8');
  assert.ok(projects.includes('ITCS 3162'));
  for (const slug of slugs) assert.ok(projects.includes(`/personal-portfolio/projects/${slug}/`));
});

test('about page presents resume credentials and a linked GitHub profile picture', () => {
  const html = readFileSync('dist/about/index.html', 'utf8');
  assert.match(html, /<a[^>]+href="https:\/\/github\.com\/goatfreeman"[^>]*>\s*<img[^>]+src="https:\/\/avatars\.githubusercontent\.com\/u\/85287294\?v=4"/);
  assert.match(html, /Azure Fundamentals/);
  assert.match(html, /August 2025/);
  assert.match(html, /Japanese-Language Proficiency Test N2/);
  assert.match(html, /July 2024/);
  assert.match(html, /UNC Charlotte/);
});

test('each case study offers an accessible back arrow with a projects fallback', () => {
  for (const slug of slugs) {
    const html = readFileSync(`dist/projects/${slug}/index.html`, 'utf8');
    assert.match(html, /class="back-link"/);
    assert.match(html, /href="\/personal-portfolio\/projects\/"[^>]*class="back-link"/);
    assert.match(html, /aria-label="Back"/);
    assert.match(html, /<span aria-hidden="true"[^>]*>&lt;<\/span>/);
  }
});

test('back arrow remains at the side of the viewport when scrolling', () => {
  const page = readFileSync('src/pages/projects/[slug].astro', 'utf8');
  assert.match(page, /\.back-link\s*\{[^}]*position\s*:\s*fixed/);
  assert.doesNotMatch(page, /project-title-row/);
});

test('home labels project ordering without claiming dates', () => {
  const home = readFileSync('dist/index.html', 'utf8');
  assert.match(home, /Project dates have not been provided/);
});

test('projects are grouped in a collection of distinct project blocks', () => {
  const html = readFileSync('dist/projects/index.html', 'utf8');
  assert.match(html, /class="project-collection"/);
  assert.equal((html.match(/class="project-block"/g) || []).length, 4);
});

test('navigation uses a centered menu layout', () => {
  const header = readFileSync('src/components/Header.astro', 'utf8');
  assert.match(header, /grid-template-columns:\s*1fr auto 1fr/);
});

test('starter visual language replaces the custom portfolio skin', () => {
  const css = readFileSync('src/styles/global.css', 'utf8');
  const header = readFileSync('src/components/Header.astro', 'utf8');
  const footer = readFileSync('src/components/Footer.astro', 'utf8');
  assert.doesNotMatch(css, /Portfolio layout|--green:/);
  assert.match(css, /background:\s*linear-gradient\(var\(--gray-gradient\)\)/);
  assert.match(header, /box-shadow:\s*0 2px 8px/);
  assert.match(header, /border-bottom-color:\s*var\(--accent\)/);
  assert.match(footer, /text-align:\s*center/);
});
