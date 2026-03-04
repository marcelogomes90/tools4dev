function onlyDigits(value: string) {
  return value.replace(/\D/g, '');
}

const firstWeights = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const secondWeights = [6, ...firstWeights];

function calcDigit(base: string, weights: number[]) {
  const sum = base.split('').reduce((acc, digit, idx) => acc + Number(digit) * weights[idx], 0);
  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

function randomDigit() {
  return Math.floor(Math.random() * 10);
}

export function isValidCnpj(input: string) {
  const cnpj = onlyDigits(input);
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cnpj)) return false;

  const first = calcDigit(cnpj.slice(0, 12), firstWeights);
  const second = calcDigit(`${cnpj.slice(0, 12)}${first}`, secondWeights);

  return cnpj === `${cnpj.slice(0, 12)}${first}${second}`;
}

export function formatCnpj(cnpj: string) {
  const digits = onlyDigits(cnpj).slice(0, 14);
  return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

export function generateCnpj(masked = true) {
  const root = Array.from({ length: 8 }, () => randomDigit()).join('');
  const branch = '0001';
  const base = `${root}${branch}`;
  const first = calcDigit(base, firstWeights);
  const second = calcDigit(`${base}${first}`, secondWeights);
  const cnpj = `${base}${first}${second}`;
  return masked ? formatCnpj(cnpj) : cnpj;
}

export function generateCnpjBatch(quantity: number, masked = true) {
  const total = Math.min(100, Math.max(1, quantity));
  return Array.from({ length: total }, () => generateCnpj(masked));
}
