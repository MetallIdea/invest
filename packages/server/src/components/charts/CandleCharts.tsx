'use client'
import ReactApexChart from "react-apexcharts";
import { useState } from "react";

type Props = {
    data: {
        time: Date;
        open: number;
        close: number;
        high: number;
        low: number;
    }[]
}

export const CandleCharts = ({ data }: Props) => {
    const [state, setState] = useState({

        series: [{
            data: data.map((item) => ({
                x: item.time,
                y: [item.open, item.high, item.low, item.close,],
            }))
        }],
        options: {
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
            yaxis: {
                tooltip: {
                    enabled: true
                }
            }
        },


    });



    return (
        <div>
            <div id="chart">
                <ReactApexChart options={state.options} series={state.series} type="candlestick" height={350} />
            </div>
            <div id="html-dist"></div>
        </div>
    );
}