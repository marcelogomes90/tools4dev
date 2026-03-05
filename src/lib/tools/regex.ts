export const REGEX_MAX_TEXT_LENGTH = 20000;

export interface RegexMatch {
  match: string;
  index: number;
  groups: string[];
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function runRegex(pattern: string, flags: string, text: string) {
  if (text.length > REGEX_MAX_TEXT_LENGTH) {
    throw new Error(
      `Texto muito longo. Limite atual: ${REGEX_MAX_TEXT_LENGTH} caracteres.`,
    );
  }

  let regex: RegExp;
  try {
    regex = new RegExp(pattern, flags);
  } catch {
    throw new Error('Expressao regular inválida. Verifique pattern e flags.');
  }

  const matches: RegexMatch[] = [];

  if (!flags.includes('g')) {
    const single = regex.exec(text);
    if (!single) return [];
    return [
      {
        match: single[0],
        index: single.index,
        groups: single.slice(1),
      },
    ];
  }

  for (const item of text.matchAll(regex)) {
    matches.push({
      match: item[0],
      index: item.index ?? 0,
      groups: item.slice(1),
    });

    if (matches.length >= 5000) break;
  }

  return matches;
}

export function highlightMatches(text: string, matches: RegexMatch[]) {
  if (matches.length === 0) return escapeHtml(text);
  let cursor = 0;
  const chunks: string[] = [];

  for (const item of matches) {
    const start = item.index;
    const end = start + item.match.length;
    if (start < cursor) continue;
    chunks.push(escapeHtml(text.slice(cursor, start)));
    chunks.push(`<mark>${escapeHtml(text.slice(start, end))}</mark>`);
    cursor = end;
  }

  chunks.push(escapeHtml(text.slice(cursor)));
  return chunks.join('');
}
