'use client'
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState } from "react";
import { Candle } from "common/src/entities/candles";

type Props = {
    data: Candle[];
    suggestions: {
        buy: number;
        sell: number;
        buyTime: Date;
        sellTime: Date;
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
        type: 'datetime',
    },
    yaxis: [{
        tooltip: {
            enabled: true
        }
    }],
};

const OPTIONS_MACD: ApexOptions = {
    chart: {
        type: 'line',
        height: 350
    },
    title: {
        text: 'MACD Chart',
        align: 'left'
    },
    xaxis: {
        type: 'datetime',
    },
    yaxis: [{
        tooltip: {
            enabled: true
        }
    }],
};

export const CandleCharts = ({ data, suggestions }: Props) => {
    const [state] = useState<ApexOptions>({
        series: [{
            name: 'Candles',
            data: data.map((item) => ({
                x: item.time,
                y: [item.open, item.high, item.low, item.close],
            }))
        },
        {
            name: 'SMA',
            type: 'line',
            data: data.map((item) => ({
                x: item.time,
                y: item.sma50,
            }))
        },
        {
            name: 'EMA',
            type: 'line',
            data: data.map((item) => ({
                x: item.time,
                y: item.ema12,
            }))
        },
        {
            name: 'Buy',
            type: 'bar',
            data: data.map((item) => {
                const suggestion = suggestions.find((sug) => sug.buyTime.getTime() === item.time.getTime());
                return {
                    x: item.time,
                    y: suggestion ? suggestion.buy : null,
                    columnWidthOffset: 3
                }
            })
        },
        {
            name: 'Sell',
            type: 'bar',
            data: data.map((item) => {
                const suggestion = suggestions.find((sug) => sug.sellTime?.getTime() === item.time.getTime());
                return {
                    x: item.time,
                    y: suggestion?.sell ? suggestion.sell : null,
                    columnWidthOffset: 5
                }
            })
        }]
    });

    const [stateMACD] = useState<ApexOptions>({
        series: [
            {
                name: 'MACD',
                type: 'line',
                data: data.map((item) => ({
                    x: item.time,
                    y: item.macd,
                }))
            },
            {
                name: 'Signal',
                type: 'line',
                data: data.map((item) => ({
                    x: item.time,
                    y: item.signal,
                }))
            },
            {
                name: 'Value',
                type: 'bar',
                data: data.map((item) => ({
                    x: item.time,
                    y: item.signalValue,
                }))
            }]
    });

    if (typeof window === 'undefined') {
        return;
    }


    return (
        <div>
            <div>
                <ReactApexChart options={OPTIONS} series={state.series} type="candlestick" height={350} />
            </div>
            <div>
                <ReactApexChart options={OPTIONS_MACD} series={stateMACD.series} type="line" height={350} />
            </div>
        </div>
    );
}