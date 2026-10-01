import { CandleInterval, InstrumentStatus } from '@ttech-pub/grpc-node-client';
import { InvestNodeSDK, GetSharesCommand, GetCandlesCommand } from '@ttech-pub/invest-sdk-node';

const tinvest = await InvestNodeSDK.create({
  token: process.env.INVEST_API_TOKEN!,
  url: process.env.INVEST_API_HOST,
});

async function getAllShares() {
    const result = await tinvest.send(new GetSharesCommand({
        instrumentStatus: InstrumentStatus.INSTRUMENT_STATUS_ALL
    }));
    return result.instruments;
}

async function getCandlesByShare(figi: string, from: Date, to: Date, interval: CandleInterval = CandleInterval.CANDLE_INTERVAL_DAY) {
    const result = await tinvest.send(new GetCandlesCommand({
        figi,
        from,
        to,
        interval
    }));
    return result.candles;
}