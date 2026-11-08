import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('mobile headings use a smaller readable scale', () => {
  const css = readFileSync('src/styles/global.css', 'utf8');
  assert.match(css, /@media\s*\(max-width:\s*720px\)[\s\S]*?h1\s*\{[^}]*font-size:\s*2(?:\.\d+)?em/);
});

test('mobile brand has its own non-overlapping tap target', () => {
  const header = readFileSync('src/components/Header.astro', 'utf8');
  assert.match(header, /@media\s*\(max-width:\s*720px\)[\s\S]*?nav h2 a\s*\{[^}]*display:\s*block/);
  assert.match(header, /nav h2 a\s*\{[^}]*min-height:\s*44px/);
});

test('mobile back arrow sits below the navigation', () => {
  for (const file of ['src/pages/projects/[slug].astro', 'src/pages/projects/quick-quote-builder.astro']) {
    const page = readFileSync(file, 'utf8');
    assert.match(page, /@media\s*\(max-width:\s*720px\)\s*\{\s*\.back-link\s*\{[^}]*top:\s*120px/);
  }
});
