export function toLocalInputValue(value) {
    if (!value) return "";

    if (value instanceof Date) {
        const pad = (n) => String(n).padStart(2, "0");

        return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}T${pad(value.getHours())}:${pad(value.getMinutes())}`;
    }

    return value.slice(0, 16);
}

export function localInputToIso(localValue) {
  if (!localValue) return null;
  return new Date(localValue).toISOString();
}

export function toDateInputValue(value) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
