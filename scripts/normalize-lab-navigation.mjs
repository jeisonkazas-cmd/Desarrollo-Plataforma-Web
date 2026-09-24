import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const labsRoot = path.join(projectRoot, 'public', 'laboratorios');
const legacyLabels = [
  'Laboratorios de Física Presencial',
  'Laboratorios de Física Virtual',
  'Laboratorios de Física Remotos',
];

function findHtmlFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return findHtmlFiles(entryPath);
    return entry.isFile() && entry.name.toLowerCase().endsWith('.html') ? [entryPath] : [];
  });
}

function replacePrimaryMenu(html, filePath) {
  let normalized = html.replace(/<a\b[^>]*>[\s\S]*?<\/a>/gi, (anchor) => {
    if (/class=["'][^"']*navbar-brand/i.test(anchor)) {
      return anchor.replace(/href=(["'])[^"']*\1/i, 'href="/"');
    }
    if (/Iniciar Sesión/i.test(anchor)) {
      return anchor.replace(/href=(["'])[^"']*\1/i, 'href="/login"');
    }
    return anchor;
  });

  if (!legacyLabels.some((label) => normalized.includes(label))) {
    return normalized === html ? null : normalized;
  }

  const menuStart = /<ul\b[^>]*class=["'][^"']*navbar-nav[^"']*me-auto[^"']*["'][^>]*>/i.exec(normalized);
  if (!menuStart) {
    throw new Error(`No se encontró el menú principal en ${filePath}`);
  }

  const startIndex = menuStart.index;
  const openingTagEnd = startIndex + menuStart[0].length;
  const tagPattern = /<\/?ul\b[^>]*>/gi;
  tagPattern.lastIndex = openingTagEnd;
  let depth = 1;
  let closingTagEnd = -1;
  let match;

  while ((match = tagPattern.exec(normalized))) {
    if (/^<\/ul/i.test(match[0])) depth -= 1;
    else depth += 1;
    if (depth === 0) {
      closingTagEnd = tagPattern.lastIndex;
      break;
    }
  }

  if (closingTagEnd < 0) {
    throw new Error(`El menú no tiene cierre válido en ${filePath}`);
  }

  const eol = normalized.includes('\r\n') ? '\r\n' : '\n';
  const lineStart = normalized.lastIndexOf('\n', startIndex) + 1;
  const indent = normalized.slice(lineStart, startIndex).match(/^\s*/)?.[0] || '';
  const replacement = [
    menuStart[0],
    `${indent}  <li class="nav-item">`,
    `${indent}    <a class="nav-link" href="/" style="color:white; font-weight:600;">Laboratorios de Física</a>`,
    `${indent}  </li>`,
    `${indent}</ul>`,
  ].join(eol);

  return `${normalized.slice(0, startIndex)}${replacement}${normalized.slice(closingTagEnd)}`;
}

let updated = 0;
for (const filePath of findHtmlFiles(labsRoot)) {
  const html = fs.readFileSync(filePath, 'utf8');
  const normalized = replacePrimaryMenu(html, filePath);
  if (normalized && normalized !== html) {
    fs.writeFileSync(filePath, normalized, 'utf8');
    updated += 1;
  }
}

console.log(`Navegación normalizada en ${updated} archivos HTML.`);
