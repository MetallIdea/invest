import { getAllShares } from '@/api/tinvest';
import { db } from '@/data/db';
import { shares } from '@/data/entities/shares';

const BATCH_SIZE = 500;

/** Минимальный набор полей инструмента «акция» из Tinkoff Invest API. */
interface ShareInstrument {
    name: string;
    ticker: string;
    figi: string;
    sector?: string;
    countryOfRiskName?: string;
}

/**
 * Кеширует справочник акций из Tinkoff Invest API в таблицу shares.
 * Новые инструменты добавляются, существующие (по figi) обновляются.
 * Возвращает количество обработанных акций.
 */
export async function syncShares(): Promise<number> {
    const instruments = (await getAllShares()) as ShareInstrument[];

    const rows = instruments.map((instrument) => ({
        name: instrument.name,
        ticker: instrument.ticker,
        figi: instrument.figi,
        sector: instrument.sector || null,
        country: instrument.countryOfRiskName || null,
    }));

    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
        const chunk = rows.slice(i, i + BATCH_SIZE);

        await db.insert(shares)
            .values(chunk);
    }

    return rows.length;
}