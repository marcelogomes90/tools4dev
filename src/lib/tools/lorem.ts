const classicWords = [
  'lorem',
  'ipsum',
  'dolor',
  'sit',
  'amet',
  'consectetur',
  'adipiscing',
  'elit',
  'sed',
  'do',
  'eiusmod',
  'tempor',
  'incididunt',
  'ut',
  'labore',
  'et',
  'dolore',
  'magna',
  'aliqua',
];

const ptWords = [
  'desenvolvimento',
  'produto',
  'time',
  'escala',
  'qualidade',
  'arquitetura',
  'performatico',
  'modular',
  'seguro',
  'confiavel',
  'observavel',
  'automatizado',
  'iterativo',
  'documentado',
];

const enWords = [
  'developer',
  'workflow',
  'shipping',
  'quality',
  'testing',
  'scalable',
  'secure',
  'reliable',
  'tooling',
  'automation',
  'design',
  'architecture',
  'velocity',
];

function pickWords(language: 'classic' | 'pt' | 'en') {
  if (language === 'pt') return ptWords;
  if (language === 'en') return enWords;
  return classicWords;
}

function randomWord(words: string[]) {
  return words[Math.floor(Math.random() * words.length)];
}

function sentence(words: string[], wordCount: number) {
  const count = Math.max(3, wordCount);
  const tokens = Array.from({ length: count }, () => randomWord(words));
  const first = `${tokens[0][0].toUpperCase()}${tokens[0].slice(1)}`;
  return `${[first, ...tokens.slice(1)].join(' ')}.`;
}

export function generateLorem(
  mode: 'words' | 'sentences' | 'paragraphs',
  quantity: number,
  language: 'classic' | 'pt' | 'en',
) {
  const words = pickWords(language);
  const total = Math.max(1, Math.min(200, quantity));

  if (mode === 'words') {
    return Array.from({ length: total }, () => randomWord(words)).join(' ');
  }

  if (mode === 'sentences') {
    return Array.from({ length: total }, () => sentence(words, 8)).join(' ');
  }

  return Array.from({ length: total }, () =>
    Array.from({ length: 4 }, () => sentence(words, 10 + Math.floor(Math.random() * 6))).join(' '),
  ).join('\n\n');
}
