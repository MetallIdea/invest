'use client'
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState } from "react";
import { Candle } from "common/src/entities/candles";

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
        type: 'candlestick'
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

type Props = {
    data: Candle[];
    suggestions: {
        buy: number | null;
        sell: number | null;
        buyTime: Date | null;
        sellTime: Date | null;
    }[]
}

export const CandleCharts = ({ data, suggestions }: Props) => {
    const [state] = useState<ApexOptions>({
        series: [{
            name: 'Candles',
            data: data.map((item) => ({
                x: item.time,
                y: [item.open, item.high, item.low, item.close],
                fillColor: (() => {
                    const suggestionBuy = suggestions.find((sug) => sug.buyTime?.getTime() === item.time.getTime());
                    const suggestionSell = suggestions.find((sug) => (sug.sellTime && sug.sellTime.getTime() === item.time.getTime()));

                    if (suggestionSell?.sell) {
                        return '#b00000ff'
                    }

                    if (suggestionBuy?.buy) {
                        return '#009c00ff'
                    }

                    return item.close > item.open ? '#00FF00' : '#ff0000'
                })()
            }))
        },
        {
            name: 'SMA50',
            type: 'line',
            data: data.map((item) => ({
                x: item.time,
                y: item.sma50,
            }))
        },
        {
            name: 'EMA12',
            type: 'line',
            data: data.map((item) => ({
                x: item.time,
                y: item.ema12,
            }))
        },]
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
                name: 'Value+',
                type: 'bar',
                color: 'green',
                data: data.map((item) => ({
                    x: item.time,
                    y: item.signalValue! > 0 ? item.signalValue : null,
                }))
            },
            {
                name: 'Value-',
                type: 'bar',
                color: 'red',
                data: data.map((item) => ({
                    x: item.time,
                    y: item.signalValue! < 0 ? item.signalValue : null,
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
                <ReactApexChart options={OPTIONS_MACD} series={stateMACD.series} type="candlestick" height={350} />
            </div>
        </div>
    );
}