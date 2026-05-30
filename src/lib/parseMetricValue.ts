export function parseMetricValue(raw: string): {
  numeric: number;
  prefix: string;
  suffix: string;
  decimals: number;
} {
  const trimmed = raw.trim();
  const match = trimmed.match(/^([^0-9.-]*)([\d,]+(?:\.\d+)?)(.*)$/);
  if (!match) {
    return { numeric: 0, prefix: '', suffix: trimmed, decimals: 0 };
  }
  const [, prefix, numPart, suffix] = match;
  const numeric = parseFloat(numPart.replace(/,/g, ''));
  const decimals = numPart.includes('.')
    ? (numPart.split('.')[1]?.length ?? 0)
    : 0;
  return {
    numeric: Number.isFinite(numeric) ? numeric : 0,
    prefix: prefix ?? '',
    suffix: suffix ?? '',
    decimals,
  };
}
