import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getPublicEvents } from '../src/data/events.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const indexPath = path.join(distDir, 'index.html');
const SITE_URL = 'https://movimientonaluum.org';

const escapeHtml = (value = '') =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

const removeExistingTag = (html, pattern) => html.replace(pattern, '');

const injectHeadMeta = (html, event) => {
  const canonical = `${SITE_URL}/eventos/${event.slug}/`;
  const image = event.image ? new URL(event.image, SITE_URL).toString() : '';
  let output = html;

  output = output.replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(event.seo_title)}</title>`);
  output = output.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${escapeHtml(event.seo_description)}" />`
  );

  output = removeExistingTag(output, /<link\s+rel="canonical"[^>]*>\s*/i);
  output = removeExistingTag(output, /<meta\s+property="og:title"[^>]*>\s*/i);
  output = removeExistingTag(output, /<meta\s+property="og:description"[^>]*>\s*/i);
  output = removeExistingTag(output, /<meta\s+property="og:image"[^>]*>\s*/i);
  output = removeExistingTag(output, /<meta\s+property="og:url"[^>]*>\s*/i);
  output = removeExistingTag(output, /<meta\s+name="twitter:card"[^>]*>\s*/i);

  const meta = [
    `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
    `<meta property="og:title" content="${escapeHtml(event.seo_title)}" />`,
    `<meta property="og:description" content="${escapeHtml(event.seo_description)}" />`,
    image ? `<meta property="og:image" content="${escapeHtml(image)}" />` : '',
    `<meta property="og:url" content="${escapeHtml(canonical)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ]
    .filter(Boolean)
    .join('\n    ');

  return output.replace('</head>', `    ${meta}\n  </head>`);
};

const generate = async () => {
  const baseHtml = await readFile(indexPath, 'utf8');
  const publicEvents = getPublicEvents();

  for (const event of publicEvents) {
    const eventDir = path.join(distDir, event.slug);
    const eventHtml = injectHeadMeta(baseHtml, event);

    await mkdir(eventDir, { recursive: true });
    await writeFile(path.join(eventDir, 'index.html'), eventHtml);
  }

  console.log(`Generated ${publicEvents.length} public event page(s).`);
};

generate().catch((error) => {
  console.error(error);
  process.exit(1);
});
