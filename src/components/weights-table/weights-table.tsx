'use client';

import { useMemo, useState } from 'react';
import styles from './weights-table.module.css';

export type SortField = 'ticker' | 'buyWeight' | 'sellWeight' | 'signal';

export type SortDirection = 'asc' | 'desc';

export interface WeightRow {
    name: string;
    ticker: string;
    figi: string;
    buyWeight: string | null;
    sellWeight: string | null;
    signal: string | null;
    /** Годовая историческая волатильность, % (например, 35 = 35% годовых). */
    volatility: string | null;
    calculatedAt: Date | null;
}

interface WeightsTableProps {
    weights: WeightRow[];
}

const SORTABLE_COLUMNS: { field: SortField; label: string }[] = [
    { field: 'ticker', label: 'Тикер' },
    { field: 'buyWeight', label: 'Вес покупки' },
    { field: 'sellWeight', label: 'Вес продажи' },
    { field: 'signal', label: 'Сигнал' },
];

const SIGNAL_LABELS: Record<string, string> = {
    buy: 'Покупка',
    sell: 'Продажа',
    neutral: 'Нейтрально',
};

/** Ранг сигнала для сортировки (выше — сильнее сигнал на покупку). */
const SIGNAL_RANK: Record<string, number> = {
    sell: 0,
    neutral: 1,
    buy: 2,
};

/** Проверяет, что сигнал относится к известному набору значений. */
const isKnownSignal = (signal: string | null): signal is 'buy' | 'sell' | 'neutral' =>
    signal === 'buy' || signal === 'sell' || signal === 'neutral';

/** Форматирует дату расчёта в формате ДД.ММ.ГГГГ. */
const formatDate = (date: Date | null): string => (date ? date.toLocaleDateString('ru-RU') : '—');

/** Форматирует годовую волатильность в процентах. */
const formatVolatility = (value: string | null): string =>
    value === null ? '—' : `${Number(value).toFixed(1)}%`;

/** Базовый адрес страницы акции на Т-Банке. */
const TBANK_STOCK_URL = 'https://www.tbank.ru/invest/stocks';

/** Возвращает ссылку на страницу акции на Т-Банке по тикеру. */
const getStockUrl = (ticker: string): string =>
    `${TBANK_STOCK_URL}/${encodeURIComponent(ticker.toUpperCase())}/`;

/** Форматирует вес в процентах с одним знаком после запятой. */
const formatWeight = (value: string | null): string => (value === null ? '—' : `${Number(value).toFixed(1)}%`);

/** Возвращает «сырое» значение поля для сортировки (null — данные отсутствуют). */
const getSortValue = (row: WeightRow, field: SortField): string | number | null => {
    if (field === 'buyWeight') {
        return row.buyWeight;
    }
    if (field === 'sellWeight') {
        return row.sellWeight;
    }
    if (field === 'signal') {
        return isKnownSignal(row.signal) ? SIGNAL_RANK[row.signal] : null;
    }
    return row.ticker;
};

/** Ячейка веса со шкалой заполнения. */
const renderWeightCell = (value: string | null, side: 'buy' | 'sell') => {
    if (value === null) {
        return '—';
    }

    const number = Number(value);

    return (
        <div className={`${styles.weightCell} ${side === 'buy' ? styles.weightBuy : styles.weightSell}`}>
            <span className={styles.weightValue}>{formatWeight(value)}</span>
            <span className={styles.weightBarTrack}>
                <span
                    className={styles.weightBarFill}
                    style={{ width: `${Math.min(100, Math.max(0, number))}%` }}
                />
            </span>
        </div>
    );
};

/** Бейдж сигнала. */
const renderSignal = (signal: string | null) => {
    if (!isKnownSignal(signal)) {
        return '—';
    }

    const className =
        signal === 'buy'
            ? styles.signalBuy
            : signal === 'sell'
                ? styles.signalSell
                : styles.signalNeutral;

    return <span className={`${styles.signalBadge} ${className}`}>{SIGNAL_LABELS[signal]}</span>;
};

export function WeightsTable({ weights }: WeightsTableProps) {
    const [sortField, setSortField] = useState<SortField | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

    const toggleSort = (field: SortField): void => {
        if (sortField === field) {
            // повторный клик по той же колонке — разворот направления
            setSortDirection((direction) => (direction === 'asc' ? 'desc' : 'asc'));
        } else {
            // новая колонка — всегда начинаем с возрастания
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const sortedWeights = useMemo(() => {
        if (!sortField) {
            return weights;
        }

        const direction = sortDirection === 'asc' ? 1 : -1;

        // копируем массив, чтобы не мутировать пропсы
        return [...weights].sort((a, b) => {
            const aValue = getSortValue(a, sortField);
            const bValue = getSortValue(b, sortField);

            if (aValue === null && bValue === null) {
                return 0;
            }
            if (aValue === null) {
                return 1; // строки без значения всегда в конце списка
            }
            if (bValue === null) {
                return -1;
            }

            return (Number(aValue) - Number(bValue)) * direction;
        });
    }, [weights, sortField, sortDirection]);

    const renderSortableHeader = (field: SortField, label: string) => {
        const active = sortField === field;
        const arrow = !active ? '' : sortDirection === 'asc' ? '▲' : '▼';

        return (
            <th key={field}>
                <button
                    type="button"
                    className={
                        active ? `${styles.sortButton} ${styles.sortButtonActive}` : styles.sortButton
                    }
                    onClick={() => toggleSort(field)}
                >
                    {label}
                    <span className={styles.sortArrow}>{arrow}</span>
                </button>
            </th>
        );
    };

    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    <th>Название</th>
                    {SORTABLE_COLUMNS.map(({ field, label }) => renderSortableHeader(field, label))}
                    <th>Волатильность</th>
                    <th>Дата расчёта</th>
                </tr>
            </thead>
            <tbody>
                {sortedWeights.map((row) => (
                    <tr key={row.figi}>
                        <td>
                            <a
                                href={getStockUrl(row.ticker)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.shareLink}
                            >
                                {row.name}
                            </a>
                        </td>
                        <td>{row.ticker}</td>
                        <td>{renderWeightCell(row.buyWeight, 'buy')}</td>
                        <td>{renderWeightCell(row.sellWeight, 'sell')}</td>
                        <td>{renderSignal(row.signal)}</td>
                        <td>{formatVolatility(row.volatility)}</td>
                        <td>{formatDate(row.calculatedAt)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}