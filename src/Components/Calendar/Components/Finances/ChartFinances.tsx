import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import faker from 'faker';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    interaction: {
        mode: 'index' as const,
        intersect: false,
    },
    stacked: false,
    plugins: {
        title: {
            display: false,
            text: 'Chart.js Line Chart - Multi Axis',
        },
    },
    scales: {
        y: {
            type: 'linear' as const,
            display: true,
            position: 'left' as const,
            suggestedMin: 30,
            suggestedMax: 1000,
        },
        y1: {
            type: 'linear' as const,
            display: true,
            position: 'right' as const,
            grid: {
                drawOnChartArea: false,
            },
            suggestedMin: 30,
            suggestedMax: 1000,
        },
    },
};
//todo: separar por meses, reativo filtros
const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', "September"];

export const data = {
    labels,
    datasets: [
        {
            label: 'Entradas',
            data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
            borderColor: '#2E7D32',
            backgroundColor: '#2E7D32',
            yAxisID: 'y',

        },
        {
            label: 'Saidas',
            data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
            borderColor: '#D64045',
            backgroundColor: '#D64045',
            yAxisID: 'y1',
        },
    ],
};
export function ChartFinances() {
    return (
        <div style={{ width: '800px' }}>

            <Line options={options} data={data} />;
        </div>
    )
}
