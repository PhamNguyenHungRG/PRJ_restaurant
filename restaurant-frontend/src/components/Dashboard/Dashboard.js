import React from 'react';
import AdminLayout from './AdminLayout';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    PointElement,
    LineElement,
    Tooltip,
    Legend
);

const Dashboard = () => {
    const barData = {
        labels: ['01', '02', '03', '04', '05', '06', '07'],
        datasets: [
            {
                label: 'Last 6 days',
                data: [30, 40, 45, 50, 40, 60, 70],
                backgroundColor: '#4f46e5',
            },
            {
                label: 'Last week',
                data: [25, 35, 30, 40, 30, 45, 50],
                backgroundColor: '#cbd5e1',
            },
        ],
    };

    const doughnutData = {
        labels: ['Afternoon', 'Evening', 'Morning'],
        datasets: [
            {
                data: [40, 32, 28],
                backgroundColor: ['#6366f1', '#a5b4fc', '#e0e7ff'],
            },
        ],
    };

    const lineData = {
        labels: ['01', '02', '03', '04', '05', '06'],
        datasets: [
            {
                label: 'Last 6 days',
                data: [10, 20, 25, 30, 28, 40],
                borderColor: '#4f46e5',
                tension: 0.4,
            },
            {
                label: 'Last week',
                data: [15, 18, 20, 25, 22, 35],
                borderColor: '#94a3b8',
                tension: 0.4,
            },
        ],
    };

    return (
        <AdminLayout>
            <h2 className="fw-bold mb-3">📊 Dashboard</h2>

            <div className="row g-4">
                <div className="col-md-6">
                    <div className="card shadow-sm p-3">
                        <h6 className="fw-bold">Revenue</h6>
                        <p className="text-muted">IDR 7.852.000</p>
                        <Bar data={barData} />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card shadow-sm p-3">
                        <h6 className="fw-bold">Order Time</h6>
                        <Doughnut data={doughnutData} />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card shadow-sm p-3">
                        <h6 className="fw-bold">Order Trend</h6>
                        <Line data={lineData} />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card shadow-sm p-3">
                        <h6 className="fw-bold">Most Ordered Food</h6>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">🥗 Fresh Salad Bowl - IDR 45.000</li>
                            <li className="list-group-item">🍜 Chicken Noodles - IDR 75.000</li>
                            <li className="list-group-item">🍹 Smoothie Fruits - IDR 45.000</li>
                            <li className="list-group-item">🍗 Hot Chicken Wings - IDR 45.000</li>
                        </ul>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;
