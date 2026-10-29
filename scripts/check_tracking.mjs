#!/usr/bin/env node
// Validate generated, trusted HTML locally. No remote scripts are fetched or run.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import vm from 'node:vm';

const GTM_URL = 'https://analytics.luratic.com/WoOxuE041FMahHgD/';
const MARKERS = /analytics\.luratic\.com\/WoOxuE041FMahHgD\/|custom_page_view|GTM-5D7RV9H/i;
// This route remains untracked after moving its original static HTML into Hugo.
const NO_TRACKING_POLICIES = new Set([
  'google-analytics-utils/privacy-policy/index.html',
  'en/google-analytics-utils/privacy-policy/index.html',
]);
const USAGE = 'Uso: node scripts/check_tracking.mjs --public public (--production | --preview)';

function attributes(text) {
  const result = {};
  const pattern = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  for (const match of text.matchAll(pattern)) {
    result[match[1].toLowerCase()] = match[2] ?? match[3] ?? match[4] ?? '';
  }
  return result;
}

function* htmlFiles(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(path);
    else if (entry.isFile() && /\.html?$/i.test(entry.name)) yield path;
  }
}

function checkProduction(html, filename) {
  const headStart = /<head\b[^>]*>/i.exec(html);
  const headEnd = /<\/head\s*>/i.exec(html);
  const bodyStart = /<body\b/i.exec(html);
  const inHead = (position) => headStart && headEnd && bodyStart
    && position >= headStart.index + headStart[0].length
    && position < headEnd.index && headEnd.index < bodyStart.index;
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)]
    .map((match) => ({ attrs: attributes(match[1]), code: match[2], position: match.index }));
  const loads = [];
  let activePosition = -1;
  const recordScript = (element) => {
    if (element.src) loads.push({ url: String(element.src), position: activePosition });
    return element;
  };
  const parent = { insertBefore: recordScript, appendChild: recordScript };
  const document = {
    head: parent,
    body: parent,
    getElementsByTagName: (tag) => tag === 'script' ? [{ parentNode: parent }] : [],
    createElement: (tag) => ({
      tagName: tag.toUpperCase(),
      setAttribute(name, value) { this[name] = String(value); },
    }),
  };
  const sandbox = { document, dataLayer: [] };
  sandbox.window = sandbox;
  sandbox.self = sandbox;
  const context = vm.createContext(sandbox, { codeGeneration: { strings: false, wasm: false } });

  for (const script of scripts) {
    activePosition = script.position;
    if (MARKERS.test(script.code) && !inHead(script.position)) {
      throw new Error('el evento y la carga de GTM deben estar dentro de <head>, antes de <body>');
    }
    if ('src' in script.attrs) {
      // Record direct script URLs, without loading any of them.
      loads.push({ url: script.attrs.src, position: script.position });
      continue;
    }
    const type = (script.attrs.type || '').toLowerCase();
    if (type && !['text/javascript', 'application/javascript'].includes(type)) continue;
    if (script.code.trim()) {
      vm.runInContext(script.code, context, { filename, timeout: 100 });
    }
  }

  const gtmLoads = loads.filter(({ url }) => url === GTM_URL);
  if (gtmLoads.length !== 1 || gtmLoads[0].url !== GTM_URL) {
    throw new Error(`se esperaba una única carga de ${GTM_URL}; detectadas: ${JSON.stringify(gtmLoads.map(({ url }) => url))}`);
  }
  if (!inHead(gtmLoads[0].position)) throw new Error('la carga de GTM está fuera de <head>');
  if (!Array.isArray(sandbox.dataLayer)) throw new Error('dataLayer no es una lista');
  const events = sandbox.dataLayer.filter((event) => event?.event === 'custom_page_view');
  if (events.length !== 1) throw new Error(`se esperaba un evento custom_page_view; detectados: ${events.length}`);
  const event = events[0];
  if (event.event_name !== 'page_view') throw new Error('custom_page_view debe usar event_name=page_view');
  for (const field of ['page_type', 'page_category', 'page_section', 'language']) {
    if (typeof event[field] !== 'string' || !event[field]) {
      throw new Error(`custom_page_view no contiene un valor válido para ${field}`);
    }
  }
}

function main() {
  let values;
  try {
    ({ values } = parseArgs({ options: {
      public: { type: 'string', default: 'public' },
      production: { type: 'boolean' },
      preview: { type: 'boolean' },
      help: { type: 'boolean', short: 'h' },
    } }));
    if (values.help) { console.log(USAGE); return 0; }
    if (Boolean(values.production) === Boolean(values.preview)) throw new Error('elige exactamente un modo');
    if (!statSync(resolve(values.public)).isDirectory()) throw new Error('--public debe ser un directorio');
  } catch (error) {
    console.error(`${error.message}\n${USAGE}`);
    return 2;
  }

  const root = resolve(values.public);
  let checked = 0;
  let skipped = 0;
  let withoutTracking = 0;
  const errors = [];
  for (const file of htmlFiles(root)) {
    const name = relative(root, file).split('\\').join('/');
    const html = readFileSync(file, 'utf8');
    const meta = [...html.matchAll(/<meta\b([^>]*)>/gi)].map((match) => attributes(match[1]));
    const alias = meta.some((attrs) => attrs['http-equiv']?.toLowerCase() === 'refresh');
    const templated = /<html\b[^>]*\blang\s*=/i.test(html)
      || meta.some((attrs) => attrs.name?.toLowerCase() === 'generator' && /hugo/i.test(attrs.content || ''));
    const noTracking = NO_TRACKING_POLICIES.has(name);
    if (!noTracking && (alias || !templated)) { skipped++; continue; }
    checked++;
    if (noTracking) withoutTracking++;
    try {
      if (values.preview || noTracking) {
        if (MARKERS.test(html)) throw new Error(`${noTracking ? 'la política de UTILS' : 'la preview'} contiene el endpoint, el contenedor o el evento de producción`);
      } else checkProduction(html, name);
    } catch (error) {
      errors.push(`${name}: ${error.message}`);
    }
  }
  if (!checked) errors.push('no se encontraron páginas de Hugo que comprobar');
  if (withoutTracking !== NO_TRACKING_POLICIES.size) errors.push(`se esperaban ${NO_TRACKING_POLICIES.size} políticas de UTILS sin GTM; detectadas: ${withoutTracking}`);
  if (errors.length) {
    for (const error of errors.slice(0, 20)) console.error(`ERROR ${error}`);
    if (errors.length > 20) console.error(`... y ${errors.length - 20} errores más.`);
    console.error(`FALLO: ${errors.length} incidencias; ${checked} páginas comprobadas, ${skipped} excluidas.`);
    return 1;
  }
  const result = values.production
    ? `${checked - withoutTracking} páginas de producción con GTM y custom_page_view en head; ${withoutTracking} políticas de UTILS sin GTM`
    : `${checked} páginas de preview sin GTM ni custom_page_view (incluidas las políticas de UTILS)`;
  console.log(`OK: ${result}; ${skipped} aliases/HTML estáticos excluidos. Sin peticiones de red.`);
  return 0;
}

process.exitCode = main();
