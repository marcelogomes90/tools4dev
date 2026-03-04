function onlyDigits(value: string) {
  return value.replace(/\D/g, '');
}

function calcCpfDigit(base: string) {
  let sum = 0;
  for (let i = 0; i < base.length; i += 1) {
    sum += Number(base[i]) * (base.length + 1 - i);
  }
  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

export function isValidCpf(input: string) {
  const cpf = onlyDigits(input);
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  const first = calcCpfDigit(cpf.slice(0, 9));
  const second = calcCpfDigit(cpf.slice(0, 10));
  return cpf === `${cpf.slice(0, 9)}${first}${second}`;
}

export function formatCpf(cpf: string) {
  const digits = onlyDigits(cpf).slice(0, 11);
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function randomDigit() {
  return Math.floor(Math.random() * 10);
}

export function generateCpf(masked = true) {
  const base = Array.from({ length: 9 }, () => randomDigit()).join('');
  const first = calcCpfDigit(base);
  const second = calcCpfDigit(`${base}${first}`);
  const cpf = `${base}${first}${second}`;
  return masked ? formatCpf(cpf) : cpf;
}

export function generateCpfBatch(quantity: number, masked = true) {
  const total = Math.min(100, Math.max(1, quantity));
  return Array.from({ length: total }, () => generateCpf(masked));
}
