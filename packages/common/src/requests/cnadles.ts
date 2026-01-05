export async function fetchCandles({
  investApiUrl,
  investApiToken,
  instrumentId,
  startTime,
  endTime,
}: {
  investApiUrl: string;
  investApiToken: string;
  instrumentId: string;
  startTime: string;
  endTime: string;
}) {
  return await fetch(
    `${investApiUrl}/rest/tinkoff.public.invest.api.contract.v1.MarketDataService/GetCandles`,
    {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${investApiToken}`,
      }),
      body: JSON.stringify({
        from: startTime,
        to: endTime,
        interval: "CANDLE_INTERVAL_DAY",
        candleSourceType: "CANDLE_SOURCE_UNSPECIFIED",
        instrumentId,
        limit: 2400,
      }),
    }
  );
}
