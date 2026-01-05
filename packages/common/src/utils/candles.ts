export function calcCandle({ units, nano }: { units: string; nano: number }) {
  return Number(units) + nano / 1000000000;
}

export function calcPercent(start: number, end: number) {
  return end * 100 / start - 100;
}