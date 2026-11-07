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
