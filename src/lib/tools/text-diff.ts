import { createPatch, diffLines } from 'diff';

export interface SideBySideLine {
  left: string;
  right: string;
  leftType: 'same' | 'removed' | 'empty';
  rightType: 'same' | 'added' | 'empty';
  key: string;
}

function splitIntoLines(value: string) {
  const lines = value.split('\n');
  if (lines.length > 0 && lines[lines.length - 1] === '') {
    lines.pop();
  }
  return lines.length === 0 ? [''] : lines;
}

export function buildInlineDiff(oldText: string, newText: string) {
  return diffLines(oldText, newText);
}

export function buildPatch(oldText: string, newText: string) {
  return createPatch('text.diff', oldText, newText);
}

export function buildSideBySideDiff(
  oldText: string,
  newText: string,
): SideBySideLine[] {
  const parts = diffLines(oldText, newText);
  const rows: SideBySideLine[] = [];
  let index = 0;

  for (const part of parts) {
    const lines = splitIntoLines(part.value);

    if (part.added) {
      for (const line of lines) {
        rows.push({
          left: '',
          right: line,
          leftType: 'empty',
          rightType: 'added',
          key: `diff-${index}`,
        });
        index += 1;
      }
      continue;
    }

    if (part.removed) {
      for (const line of lines) {
        rows.push({
          left: line,
          right: '',
          leftType: 'removed',
          rightType: 'empty',
          key: `diff-${index}`,
        });
        index += 1;
      }
      continue;
    }

    for (const line of lines) {
      rows.push({
        left: line,
        right: line,
        leftType: 'same',
        rightType: 'same',
        key: `diff-${index}`,
      });
      index += 1;
    }
  }

  return rows;
}
