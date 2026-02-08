'use client';

import { Input } from "antd";
import { CandleParams } from "common/src/entities/candlesParams"
import Link from "next/link";
import { ChangeEventHandler, useState } from "react";

type Props = {
    params: CandleParams[];
}

export function ParamsPage({ params }: Props) {
    const [filter, setFilter] = useState('');

    const filteredParams = params.filter((param) => param.name?.toLowerCase().includes(filter.toLowerCase()));

    const handleFilterChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setFilter(e.target.value);
    }

    return (<div>
        <Link href={`/params/new`}>
            Создать
        </Link>
        <Input value={filter} onChange={handleFilterChange} />
        <div>
            {filteredParams.map((param) => (
                <div key={param.id}>
                    <Link href={`/params/${param.id}`}>
                        {param.name}
                    </Link>
                </div>
            ))}
        </div>
    </div>)
}