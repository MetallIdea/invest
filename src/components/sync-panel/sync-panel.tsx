'use client';

import { useState } from 'react';
import { Alert, Button, Space } from 'antd';
import { syncCandlesAction, syncSharesAction, type SyncResult } from '@/actions/sync';

type SyncKind = 'shares' | 'candles';

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
            </Space>

            {result && <Alert type={result.ok ? 'success' : 'error'} showIcon title={result.message} />}
        </Space>
    );
}