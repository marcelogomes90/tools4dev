const MS_PER_DAY = 24 * 60 * 60 * 1000;

function startOfDayUtc(value: Date) {
    return Date.UTC(
        value.getUTCFullYear(),
        value.getUTCMonth(),
        value.getUTCDate(),
    );
}

export function parseDateInput(value: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        throw new Error('Data inválida. Use o formato YYYY-MM-DD.');
    }

    const [year, month, day] = value.split('-').map(Number);
    const parsed = new Date(Date.UTC(year ?? 0, (month ?? 1) - 1, day ?? 1));

    if (
        parsed.getUTCFullYear() !== year ||
        parsed.getUTCMonth() !== (month ?? 1) - 1 ||
        parsed.getUTCDate() !== day
    ) {
        throw new Error('Data inválida. Verifique dia, mês e ano.');
    }

    return parsed;
}

export function formatDateInput(value: Date) {
    const year = value.getUTCFullYear();
    const month = `${value.getUTCMonth() + 1}`.padStart(2, '0');
    const day = `${value.getUTCDate()}`.padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export function formatDatePtBr(input: string) {
    const date = parseDateInput(input);
    const day = `${date.getUTCDate()}`.padStart(2, '0');
    const month = `${date.getUTCMonth() + 1}`.padStart(2, '0');
    const year = date.getUTCFullYear();

    return `${day}/${month}/${year}`;
}

export function daysBetweenDates(
    start: string,
    end: string,
    inclusive = false,
) {
    const startDate = parseDateInput(start);
    const endDate = parseDateInput(end);

    const diff = Math.abs(startOfDayUtc(endDate) - startOfDayUtc(startDate));
    const base = Math.floor(diff / MS_PER_DAY);

    return inclusive ? base + 1 : base;
}

export function addDaysToDate(input: string, amount: number) {
    const date = parseDateInput(input);
    const safeAmount = Math.trunc(amount);
    const next = new Date(startOfDayUtc(date) + safeAmount * MS_PER_DAY);

    return formatDateInput(next);
}

export function subtractDaysFromDate(input: string, amount: number) {
    return addDaysToDate(input, -Math.trunc(amount));
}

export function subtractDates(start: string, end: string) {
    const startDate = parseDateInput(start);
    const endDate = parseDateInput(end);

    return Math.floor(
        (startOfDayUtc(startDate) - startOfDayUtc(endDate)) / MS_PER_DAY,
    );
}
