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
import { Typography } from '@mui/material';
import { monthNames as labels } from './utils/month';
import { useCheckout } from '../../../../Provider/Checkout/Checkout';

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
        }
    },
};
//todo: separar por meses, reativo filtros


export function ChartFinances() {
    const { checkoutsYearly, currentDate } = useCheckout()

    const data = {
        labels,
        datasets: [
            {
                label: 'Entradas',
                data: labels.filter((month, index) => new Date().getMonth() >= index).map((month, index) => checkoutsYearly.filter(checkout => new Date(checkout.date).getMonth() == index && checkout.type == 1).reduce((a, band) => a + Number(band.value), 0)) || null,
                borderColor: '#2E7D32',
                backgroundColor: '#2E7D32',
                yAxisID: 'y',

            },
            {
                label: 'Saídas',
                data: labels.filter((month, index) => new Date().getMonth() >= index).map((month, index) => checkoutsYearly.filter(checkout => new Date(checkout.date).getMonth() == index && checkout.type == 2).reduce((a, band) => a + Number(band.value), 0)) || null,
                borderColor: '#D64045',
                backgroundColor: '#D64045',
                yAxisID: 'y',
            },
        ],
    };
    return (
        <div>
            <Typography marginTop={"32px"}>Gráfico anual do fluxo de finanças: 2023</Typography>
            <Line options={options} data={data} />
        </div>
    )
}
