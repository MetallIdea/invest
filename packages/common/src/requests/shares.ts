export async function fetchShares({
  investApiUrl,
  investApiToken,
}: {
  investApiUrl: string;
  investApiToken: string;
}) {
  return await fetch(
      `${investApiUrl}/rest/tinkoff.public.invest.api.contract.v1.InstrumentsService/Shares`,
      {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: `Bearer ${investApiToken}`,
        }),
        body: JSON.stringify({
          instrumentStatus: "INSTRUMENT_STATUS_UNSPECIFIED",
          instrumentExchange: "INSTRUMENT_EXCHANGE_UNSPECIFIED",
        }),
      }
    );
}
