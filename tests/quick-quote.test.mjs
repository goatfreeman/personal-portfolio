import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

test('Quick Quote Builder is discoverable separately and has a descriptive case study', () => {
  const home = readFileSync('dist/index.html', 'utf8');
  const projects = readFileSync('dist/projects/index.html', 'utf8');
  const link = '/personal-portfolio/projects/quick-quote-builder/';
  assert.ok(home.includes(`href="${link}"`), 'homepage links to Quick Quote Builder');
  assert.ok(projects.includes(`href="${link}"`), 'projects page links to Quick Quote Builder');
  assert.ok(existsSync('dist/projects/quick-quote-builder/index.html'), 'case study exists');
  const page = readFileSync('dist/projects/quick-quote-builder/index.html', 'utf8');
  for (const text of ['Quick Quote Builder', 'Full-Stack Web Application Developer', 'Overview', 'Key capabilities', 'Next.js', 'Supabase', 'Microsoft', 'drafts']) assert.ok(page.includes(text), `missing ${text}`);
  assert.match(page, /href="\/personal-portfolio\/projects\/"[^>]*class="back-link"/);
  assert.match(page, /aria-label="Back"/);
  assert.doesNotMatch(page, /Download notebook|Source files|Door Access Quote Tool/);
});
