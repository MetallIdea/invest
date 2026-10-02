'use client';

import { useState } from 'react';
import { Alert, Button, Space } from 'antd';
import { calculateIndicatorsAction, calculateVwapAction, calculateWeightsAction, syncCandlesAction, syncSharesAction, type SyncResult } from '@/actions/sync';

type SyncKind = 'shares' | 'candles' | 'vwap' | 'indicators' | 'weights';

export function SyncPanel() {
    const [loading, setLoading] = useState<SyncKind | null>(null);
    const [result, setResult] = useState<SyncResult | null>(null);

    const run = async (kind: SyncKind, action: () => Promise<SyncResult>) => {
        setLoading(kind);
        setResult(null);

        try {
            setResult(await action());
        } finally {
            setLoading(null);
        }
    };

    return (
        <Space orientation="vertical" size="middle" style={{ width: '100%', maxWidth: 800 }}>
            <Space wrap>
                <Button
                    type="primary"
                    loading={loading === 'shares'}
                    disabled={loading !== null}
                    onClick={() => run('shares', syncSharesAction)}
                >
                    Получение акций
                </Button>
                <Button
                    type="primary"
                    loading={loading === 'candles'}
                    disabled={loading !== null}
                    onClick={() => run('candles', syncCandlesAction)}
                >
                    Получение свечей
                </Button>
                <Button
                    type="primary"
                    loading={loading === 'vwap'}
                    disabled={loading !== null}
                    onClick={() => run('vwap', calculateVwapAction)}
                >
                    Расчёт VWAP
                </Button>
                <Button
                    type="primary"
                    loading={loading === 'indicators'}
                    disabled={loading !== null}
                    onClick={() => run('indicators', calculateIndicatorsAction)}
                >
                    Расчёт индикаторов
                </Button>
                <Button
                    type="primary"
                    loading={loading === 'weights'}
                    disabled={loading !== null}
                    onClick={() => run('weights', calculateWeightsAction)}
                >
                    Расчёт весов
                </Button>
            </Space>

            {result && <Alert type={result.ok ? 'success' : 'error'} showIcon title={result.message} />}
        </Space>
    );
}