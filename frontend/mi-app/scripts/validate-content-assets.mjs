import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, relative, resolve, sep } from 'node:path';

const appRoot = resolve(import.meta.dirname, '..');
const jsonRoot = join(appRoot, 'src', 'json');
const publicRoot = join(appRoot, 'public');
const imageRoot = join(publicRoot, 'img');
const contextPath = join(appRoot, 'src', 'context', 'context_json_load', 'context_json_load.jsx');

const canonicalFiles = [
  'data_impacto_real.json',
  'listRouters.json',
  'products.json',
  'projects.json',
  'servicios.json',
  'testimonios.json',
  'time_line_history.json',
  'messge.json',
  'FAQ.json',
  'blogs.json',
  'timerProps.json',
  'eventos.json',
  'info_contacto.json',
];

const errors = [];
const warnings = [];
const data = {};
const fail = (message) => errors.push(message);
const warn = (message) => warnings.push(message);

const walkFiles = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = join(directory, entry.name);
    return entry.isDirectory() ? walkFiles(fullPath) : [fullPath];
  });

const normalize = (value) =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const duplicateValues = (items, selector) => {
  const counts = new Map();
  items.forEach((item) => {
    const value = normalize(selector(item));
    if (value) counts.set(value, (counts.get(value) ?? 0) + 1);
  });
  return [...counts.entries()].filter(([, count]) => count > 1).map(([value]) => value);
};

for (const file of canonicalFiles) {
  const fullPath = join(jsonRoot, file);
  if (!existsSync(fullPath)) {
    fail(`Falta JSON canónico: ${file}`);
    continue;
  }
  try {
    data[file] = JSON.parse(readFileSync(fullPath, 'utf8'));
  } catch (error) {
    fail(`JSON inválido ${file}: ${error.message}`);
  }
}

const testimonialGroups = [
  'productos_madreSelva',
  'servicios_madreSelva',
  'servicios_naluum',
  'testimonios_movimiento',
  'testimonios_naluum',
];

const validators = {
  'listRouters.json': (value) => Boolean(value && Array.isArray(value['Movimiento Naluum'])),
  'data_impacto_real.json': (value) => Array.isArray(value) && value.length >= 8,
  'products.json': Array.isArray,
  'projects.json': (value) => Boolean(value && Array.isArray(value.projects)),
  'servicios.json': Array.isArray,
  'testimonios.json': (value) =>
    Boolean(value && testimonialGroups.every((group) => Array.isArray(value[group]))),
  'time_line_history.json': Array.isArray,
  'messge.json': Array.isArray,
  'FAQ.json': Array.isArray,
  'blogs.json': (value) => Boolean(value && Array.isArray(value.blogs)),
  'timerProps.json': (value) => Boolean(value && value.timer?.targetDate),
  'eventos.json': Array.isArray,
  'info_contacto.json': (value) =>
    Array.isArray(value) &&
    value.every(
      (entry) =>
        typeof entry?.proyecto === 'string' &&
        entry.contacto &&
        typeof entry.contacto === 'object' &&
        !Array.isArray(entry.contacto),
    ),
};

Object.entries(validators).forEach(([file, validator]) => {
  if (!(file in data) || !validator(data[file])) fail(`Esquema inválido: ${file}`);
});

const collections = [
  ['products', data['products.json'] ?? []],
  ['projects', data['projects.json']?.projects ?? []],
  ['services', data['servicios.json'] ?? []],
  ['events', data['eventos.json'] ?? []],
  ['blogs', data['blogs.json']?.blogs ?? []],
  ...testimonialGroups.map((group) => [
    `testimonials.${group}`,
    data['testimonios.json']?.[group] ?? [],
  ]),
];

collections.forEach(([name, items]) => {
  const duplicates = duplicateValues(items, (item) => item.id);
  if (duplicates.length) fail(`IDs duplicados en ${name}: ${duplicates.join(', ')}`);
});

const services = data['servicios.json'] ?? [];
[
  ['ID', (item) => item.id],
  ['slug/ruta', (item) => item.slug ?? item.router ?? item.id],
  ['nombre', (item) => item.title ?? item.name],
].forEach(([label, selector]) => {
  const duplicates = duplicateValues(services, selector);
  if (duplicates.length) fail(`Servicios duplicados por ${label}: ${duplicates.join(', ')}`);
});

const faqDuplicates = duplicateValues(data['FAQ.json'] ?? [], (item) => item.question);
if (faqDuplicates.length) fail(`FAQ duplicadas: ${faqDuplicates.join(', ')}`);

const eventDate = data['eventos.json']?.[0]?.date;
const timerDate = data['timerProps.json']?.timer?.targetDate?.slice(0, 10);
if (!eventDate || eventDate !== timerDate) {
  fail(`Evento y temporizador no coinciden: ${eventDate ?? 'sin fecha'} / ${timerDate ?? 'sin fecha'}`);
}

const contactProjects = (data['info_contacto.json'] ?? []).map((entry) => entry.proyecto);
for (const project of ['Global', 'Madre Selva', "Na Lu'um"]) {
  if (!contactProjects.includes(project)) fail(`Falta contacto de ${project}`);
}

const contentText = canonicalFiles
  .filter((file) => file in data)
  .map((file) => JSON.stringify(data[file]))
  .join('\n')
  .toLowerCase();
const transactionalPatterns = [
  /payment_methods/,
  /\bpayment\b/,
  /\bcheckout\b/,
  /paypal/,
  /mercado pago/,
  /stripe/,
  /transferencia/,
  /efectivo/,
  /cripto/,
  /cuotas?/,
  /comprobante/,
  /pasarela/,
];
transactionalPatterns.forEach((pattern) => {
  if (pattern.test(contentText)) fail(`Referencia transaccional en JSON: ${pattern}`);
});

const contextSource = readFileSync(contextPath, 'utf8');
const importedJson = [...contextSource.matchAll(/^import\s+.+?from\s+['"]\.\.\/\.\.\/json\/(.+?\.json)['"];?$/gm)].map(
  (match) => match[1],
);
if (importedJson.length !== canonicalFiles.length) {
  fail(`Imports JSON estáticos: ${importedJson.length}; se esperaban ${canonicalFiles.length}`);
}
for (const file of canonicalFiles) {
  if (!importedJson.includes(file)) fail(`El contexto no importa ${file}`);
}
if (/VITE_API_URL|fetch\s*\(/.test(contextSource)) {
  fail('El contexto de contenido conserva una petición remota');
}

const imageReferences = [];
const externalImageReferences = [];
const collectStrings = (value, trail = []) => {
  if (Array.isArray(value)) return value.forEach((item, index) => collectStrings(item, [...trail, index]));
  if (value && typeof value === 'object') {
    return Object.entries(value).forEach(([key, item]) => collectStrings(item, [...trail, key]));
  }
  if (typeof value !== 'string') return;
  if (value.startsWith('/img/')) imageReferences.push({ trail: trail.join('.'), value });
  if (/^https?:\/\//i.test(value) && /image|img|logo|hero|background|photo|thumbnail/i.test(trail.at(-1))) {
    externalImageReferences.push({ trail: trail.join('.'), value });
  }
};
Object.entries(data).forEach(([file, value]) => collectStrings(value, [file]));

if (externalImageReferences.length) {
  externalImageReferences.forEach(({ trail, value }) => fail(`Imagen externa ${trail}: ${value}`));
}
if (imageReferences.some(({ value }) => value.endsWith('/imagen-no-recuperada.svg'))) {
  fail('El placeholder genérico sigue referenciado');
}

const signatureMatches = (file, bytes) => {
  const extension = extname(file).toLowerCase();
  if (extension === '.jpg' || extension === '.jpeg') return bytes[0] === 0xff && bytes[1] === 0xd8;
  if (extension === '.png') return bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  if (extension === '.webp') return bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP';
  if (extension === '.svg') return bytes.toString('utf8', 0, Math.min(bytes.length, 2048)).includes('<svg');
  return true;
};

const referencedImages = [...new Set(imageReferences.map(({ value }) => value))];
for (const reference of referencedImages) {
  const file = join(publicRoot, reference.replace(/^\//, ''));
  if (!existsSync(file)) {
    fail(`Asset inexistente: ${reference}`);
    continue;
  }
  const bytes = readFileSync(file);
  if (!signatureMatches(file, bytes)) fail(`Firma binaria incompatible: ${reference}`);
  const basename = reference.split('/').at(-1);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*\.(?:jpg|jpeg|png|webp|svg|gif|avif)$/.test(basename)) {
    fail(`Nombre de asset no normalizado: ${reference}`);
  }
}

const imageFiles = walkFiles(imageRoot).filter((file) =>
  /\.(?:jpg|jpeg|png|webp|svg|gif|avif)$/i.test(file),
);
const hashes = new Map();
for (const file of imageFiles) {
  const hash = createHash('sha256').update(readFileSync(file)).digest('hex');
  hashes.set(hash, [...(hashes.get(hash) ?? []), file]);
}
for (const files of hashes.values()) {
  if (files.length > 1) {
    fail(`Duplicado exacto: ${files.map((file) => relative(imageRoot, file)).join(', ')}`);
  }
}

const totalImageBytes = imageFiles.reduce((total, file) => total + statSync(file).size, 0);
if (totalImageBytes > 40 * 1024 * 1024) fail(`Imágenes sobre 40 MiB: ${(totalImageBytes / 1048576).toFixed(2)}`);
for (const file of imageFiles) {
  if (extname(file).toLowerCase() === '.svg') continue;
  const relativePath = relative(imageRoot, file).split(sep).join('/');
  const bytes = statSync(file).size;
  const isHero = /(^hero\/|backgrounds\/|-hero(?:-|\.)|portada\.)/.test(relativePath);
  const isContent = /^(blog|sections)\//.test(relativePath);
  const limit = isHero ? 900 : isContent ? 600 : 500;
  if (bytes > limit * 1024) fail(`${relativePath} supera el presupuesto de ${limit} KiB`);
}

console.log(`JSON canónicos: ${canonicalFiles.length}`);
console.log(`Imports estáticos: ${importedJson.length}`);
console.log(`Assets JSON: ${imageReferences.length} apariciones / ${referencedImages.length} únicos`);
console.log(`Imágenes en public: ${imageFiles.length} / ${(totalImageBytes / 1048576).toFixed(2)} MiB`);
console.log(`Duplicados exactos: ${[...hashes.values()].filter((files) => files.length > 1).length}`);
warnings.forEach((message) => console.warn(`ADVERTENCIA: ${message}`));
if (errors.length) {
  errors.forEach((message) => console.error(`ERROR: ${message}`));
  console.error(`Validación fallida: ${errors.length} error(es).`);
  process.exit(1);
}
console.log('Validación completada sin errores.');
