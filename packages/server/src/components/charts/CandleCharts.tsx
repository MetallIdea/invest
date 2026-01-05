'use client'
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState } from "react";

type Props = {
    data: {
        time: Date;
        open: number;
        close: number;
        high: number;
        low: number;
        sma200: number;
        ema50: number;
        atr14: number;
    }[]
}

const OPTIONS: ApexOptions = {
    chart: {
        type: 'candlestick',
        height: 350
    },
    title: {
        text: 'CandleStick Chart',
        align: 'left'
    },
    xaxis: {
        type: 'datetime'
    },
    yaxis: [{
        tooltip: {
            enabled: true
        }
    }]
};

export const CandleCharts = ({ data }: Props) => {
    const [state, setState] = useState<ApexOptions>({
        series: [{
            name: 'Candles',
            data: data.map((item) => ({
                x: item.time,
                y: [item.open, item.high, item.low, item.close,],
            }))
        },
        {
            name: 'SMA',
            type: 'line',
            data: data.map((item) => ({
                x: item.time,
                y: item.sma200,
            }))
        },
        {
            name: 'EMA',
            type: 'line',
            data: data.map((item) => ({
                x: item.time,
                y: item.ema50,
            }))
        }]
    });

    if (typeof window === 'undefined') {
        return;
    }


    return (
        <div>
            <div id="chart">
                <ReactApexChart options={OPTIONS} series={state.series} type="candlestick" height={350} />
            </div>
            <div id="html-dist"></div>
        </div>
    );
}