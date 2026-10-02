import { InvestAPIClient } from '@ttech-pub/invest-rest-client';

const tinvest = new InvestAPIClient({
  url: `https://${process.env.INVEST_API_HOST}/rest`,
  token: process.env.INVEST_API_TOKEN!,
});

/** Цена/котировка в формате Tinkoff Invest API: целая часть + нано-доля. */
export interface Quotation {
  units?: string | number;
  nano?: number;
}

/** Минимальный набор полей инструмента «акция» из Tinkoff Invest API. */
export interface ShareInstrument {
  figi?: string;
  name?: string;
  ticker?: string;
  sector?: string;
  countryOfRiskName?: string;
}

/** Минимальный набор полей свечи из Tinkoff Invest API. */
export interface CandleInstrument {
  figi?: string;
  interval?: string;
  open?: Quotation;
  high?: Quotation;
  low?: Quotation;
  close?: Quotation;
  volume?: string | number;
  time?: string | Date;
  isComplete?: boolean;
}

/** Возвращает справочник акций из Tinkoff Invest API. */
export async function getAllShares(): Promise<ShareInstrument[]> {
  const response = await tinvest.restClient.instrumentsServiceShares({
    instrumentStatus: 'INSTRUMENT_STATUS_BASE',
  });

  return (response as { instruments?: ShareInstrument[] }).instruments ?? [];
}

/** Возвращает свечи по инструменту за период from..to с заданным интервалом. */
export async function getCandlesByShare(
  figi: string,
  from: Date,
  to: Date,
  interval: string,
): Promise<CandleInstrument[]> {
  const response = await tinvest.restClient.marketDataServiceGetCandles({
    figi,
    from,
    to,
    interval,
  });

  console.log(response.candles)

  return (response as { candles?: CandleInstrument[] }).candles ?? [];
}