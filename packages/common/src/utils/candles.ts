export function calcCandle({
  units,
  nano,
  lots,
}: {
  units: string;
  nano: number;
  lots: number;
}) {
  return Math.round((Number(units) + nano / 1000000000) * 100) / 100;
}

export function calcPercent(start: number, end: number) {
  return (end * 100) / start - 100;
}
