'use server';

import { revalidatePath } from 'next/cache';
import { syncCandles } from '@/data/services/candles-cache';
import { calculateIndicators, calculateVwap } from '@/data/services/indicators-cache';
import { calculateShareWeights } from '@/data/services/share-weights-cache';
import { syncShares } from '@/data/services/shares-cache';

export interface SyncResult {
  ok: boolean;
  message: string;
}

/** Запрашивает акции из Tinkoff Invest API и сохраняет их в базу. */
export async function syncSharesAction(): Promise<SyncResult> {
  try {
    const count = await syncShares();
    revalidatePath('/');

    return { ok: true, message: `Акции синхронизированы: ${count} шт.` };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'Не удалось синхронизировать акции.',
    };
  }
}

/** Запрашивает свечи из Tinkoff Invest API для акций из базы и сохраняет их. */
export async function syncCandlesAction(): Promise<SyncResult> {
  try {
    const result = await syncCandles();
    revalidatePath('/');

    if (result.sharesCount === 0) {
      return { ok: false, message: 'В базе нет акций. Сначала выполните «Получение акций».' };
    }

    return {
      ok: true,
      message: `Свечи синхронизированы: ${result.candlesCount} шт. (инструментов: ${result.sharesCount}).`,
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'Не удалось синхронизировать свечи.',
    };
  }
}

/** Вычисляет индикатор VWAP по сохранённым свечам для всех акций и сохраняет его в базу. */
export async function calculateVwapAction(): Promise<SyncResult> {
  try {
    const result = await calculateVwap();
    revalidatePath('/');

    if (result.sharesCount === 0) {
      return { ok: false, message: 'В базе нет акций. Сначала выполните «Получение акций».' };
    }

    return {
      ok: true,
      message: `VWAP рассчитан: ${result.valuesCount} значений (инструментов: ${result.sharesCount}).`,
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'Не удалось рассчитать VWAP.',
    };
  }
}

/** Вычисляет технические индикаторы (ATR, RSI, MACD, EMA) по сохранённым свечам для всех акций. */
export async function calculateIndicatorsAction(): Promise<SyncResult> {
  try {
    const result = await calculateIndicators();
    revalidatePath('/');

    if (result.sharesCount === 0) {
      return { ok: false, message: 'В базе нет акций. Сначала выполните «Получение акций».' };
    }

    return {
      ok: true,
      message: `Индикаторы рассчитаны: ${result.valuesCount} значений (инструментов: ${result.sharesCount}).`,
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'Не удалось рассчитать индикаторы.',
    };
  }
}

/** Рассчитывает веса «покупка»/«продажа» по последним значениям индикаторов для всех акций. */
export async function calculateWeightsAction(): Promise<SyncResult> {
  try {
    const result = await calculateShareWeights();
    revalidatePath('/');

    if (result.sharesCount === 0) {
      return { ok: false, message: 'В базе нет акций. Сначала выполните «Получение акций».' };
    }

    return {
      ok: true,
      message: `Веса рассчитаны: ${result.weightsCount} акций.`,
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'Не удалось рассчитать веса.',
    };
  }
}