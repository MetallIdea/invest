'use client';

import { useMemo, useState } from 'react';
import styles from './shares-table.module.css';

export type SortField = 'close' | 'vwap' | 'closeChange';

export type SortDirection = 'asc' | 'desc';

export interface ShareRow {
    name: string;
    ticker: string;
    figi: string;
    lastCandleClose: string | null;
    previousCandleClose: string | null;
    lastCandleTime: Date | null;
    lastVwap: string | null;
    lastVwapTime: Date | null;
}

interface SharesTableProps {
    shares: ShareRow[];
}

const SORTABLE_COLUMNS: { field: SortField; label: string }[] = [
    { field: 'close', label: 'Цена закрытия' },
    { field: 'closeChange', label: 'Изменение, %' },
    { field: 'vwap', label: 'Последний VWAP' },
];

/** Форматирует дату свечи в формате ДД.ММ.ГГГГ. */
const formatDate = (date: Date): string => date.toLocaleDateString('ru-RU');

/** Базовый адрес страницы акции на Т-Банке. */
const TBANK_STOCK_URL = 'https://www.tbank.ru/invest/stocks';

/** Возвращает ссылку на страницу акции на Т-Банке по тикеру. */
const getStockUrl = (ticker: string): string =>
    `${TBANK_STOCK_URL}/${encodeURIComponent(ticker.toUpperCase())}/`;

/** Убирает хвостовые нули у цены (numeric из БД приходит строкой). */
const formatClose = (value: string | null): string => {
    if (!value) {
        return '—';
    }

    return value.includes('.') ? value.replace(/0+$/, '').replace(/\.$/, '') : value;
};

/** Возвращает изменение цены закрытия в процентах между текущей и предыдущей свечой. */
const getCloseChangePct = (row: ShareRow): number | null => {
    if (!row.lastCandleClose || !row.previousCandleClose) {
        return null;
    }

    const current = parseFloat(row.lastCandleClose);
    const previous = parseFloat(row.previousCandleClose);

    if (!Number.isFinite(current) || !Number.isFinite(previous) || previous === 0) {
        return null;
    }

    return ((current - previous) / previous) * 100;
};

/** Форматирует изменение в процентах со знаком и направлением для окраски. */
const formatChange = (row: ShareRow): { text: string; direction: 'up' | 'down' | null } | null => {
    const pct = getCloseChangePct(row);

    if (pct === null) {
        return null;
    }

    return {
        text: `${pct > 0 ? '+' : ''}${pct.toFixed(2)}%`,
        direction: pct > 0 ? 'up' : pct < 0 ? 'down' : null,
    };
};

/** Возвращает «сырое» значение поля для сортировки (null — данные отсутствуют). */
const getSortValue = (row: ShareRow, field: SortField): string | number | null => {
    if (field === 'close') {
        return row.lastCandleClose;
    }
    if (field === 'vwap') {
        return row.lastVwap;
    }
    return getCloseChangePct(row);
};

export function SharesTable({ shares }: SharesTableProps) {
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

    const sortedShares = useMemo(() => {
        if (!sortField) {
            return shares;
        }

        const direction = sortDirection === 'asc' ? 1 : -1;

        // копируем массив, чтобы не мутировать пропсы
        return [...shares].sort((a, b) => {
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
    }, [shares, sortField, sortDirection]);

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
                    <th>Тикер</th>
                    <th>ФИГИ</th>
                    <th>Дата последней свечи</th>
                    {SORTABLE_COLUMNS.map(({ field, label }) => renderSortableHeader(field, label))}
                </tr>
            </thead>
            <tbody>
                {sortedShares.map((share) => {
                    const change = formatChange(share);
                    const changeClass =
                        change?.direction === 'up'
                            ? styles.changePositive
                            : change?.direction === 'down'
                                ? styles.changeNegative
                                : undefined;

                    return (
                        <tr key={share.figi}>
                            <td>
                                <a
                                    href={getStockUrl(share.ticker)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.shareLink}
                                >
                                    {share.name}
                                </a>
                            </td>
                            <td>{share.ticker}</td>
                            <td>{share.figi}</td>
                            <td>{share.lastCandleTime ? formatDate(share.lastCandleTime) : '—'}</td>
                            <td>{formatClose(share.lastCandleClose)}</td>
                            <td className={changeClass}>{change?.text ?? '—'}</td>
                            <td>{formatClose(share.lastVwap)}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}