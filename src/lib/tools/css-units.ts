export type CssUnit = 'px' | 'rem' | 'em' | '%' | 'vw' | 'vh';

export interface CssUnitContext {
  rootFontSize: number;
  parentFontSize: number;
  viewportWidth: number;
  viewportHeight: number;
}

function normalizeContext(context: CssUnitContext) {
  return {
    rootFontSize: Math.max(1, context.rootFontSize),
    parentFontSize: Math.max(1, context.parentFontSize),
    viewportWidth: Math.max(1, context.viewportWidth),
    viewportHeight: Math.max(1, context.viewportHeight),
  };
}

function toPx(value: number, unit: CssUnit, context: CssUnitContext) {
  const safe = normalizeContext(context);

  if (unit === 'px') return value;
  if (unit === 'rem') return value * safe.rootFontSize;
  if (unit === 'em') return value * safe.parentFontSize;
  if (unit === '%') return (value / 100) * safe.parentFontSize;
  if (unit === 'vw') return (value / 100) * safe.viewportWidth;
  return (value / 100) * safe.viewportHeight;
}

function fromPx(valuePx: number, unit: CssUnit, context: CssUnitContext) {
  const safe = normalizeContext(context);

  if (unit === 'px') return valuePx;
  if (unit === 'rem') return valuePx / safe.rootFontSize;
  if (unit === 'em') return valuePx / safe.parentFontSize;
  if (unit === '%') return (valuePx / safe.parentFontSize) * 100;
  if (unit === 'vw') return (valuePx / safe.viewportWidth) * 100;
  return (valuePx / safe.viewportHeight) * 100;
}

export function convertCssUnit(
  value: number,
  from: CssUnit,
  to: CssUnit,
  context: CssUnitContext,
) {
  const asPx = toPx(value, from, context);
  return fromPx(asPx, to, context);
}

export function formatCssUnitValue(value: number) {
  if (!Number.isFinite(value)) return '0';
  return Number(value.toFixed(4)).toString();
}
