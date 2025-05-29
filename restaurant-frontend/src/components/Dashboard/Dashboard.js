import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import {Doughnut, Line } from 'react-chartjs-2';
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
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [topFoods, setTopFoods] = useState([]);
    const [ordersByDay, setOrdersByDay] = useState([]);
    const [ordersByTime, setOrdersByTime] = useState({});

    useEffect(() => {
        axios.get('http://localhost:8000/api/dashboard-data')
            .then(res => {
                setTotalRevenue(res.data.totalRevenue);
                setTopFoods(res.data.topFoods);
                setOrdersByDay(res.data.ordersByDay);
                setOrdersByTime(res.data.ordersByTime);
            });
    }, []);

    const doughnutData = {
        labels: ['Morning', 'Afternoon', 'Evening'],
        datasets: [
            {
                data: ['Morning', 'Afternoon', 'Evening'].map(time => ordersByTime[time] || 0),
                backgroundColor: ['#6366f1', '#a5b4fc', '#e0e7ff'],
                borderWidth: 2,
            },
        ],
    };

    const lineData = {
        labels: ordersByDay.map(item => item.day),
        datasets: [
            {
                label: 'Orders by Day',
                data: ordersByDay.map(item => item.count),
                borderColor: '#4f46e5',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 4,
            }
        ],
    };

    return (
        <AdminLayout>
            <h2 className="fw-bold mb-4 fs-3">📊 Dashboard Overview</h2>

            <div className="row g-4">
                <div className="col-md-6">
                    <div className="card shadow rounded-4 p-4 border-0 h-100">
                        <h6 className="fw-semibold fs-5 mb-2">💰 Revenue</h6>
                        <p className="text-muted mb-3 fs-6">IDR {totalRevenue.toLocaleString()}</p>
                        {/* Optional: Bar chart comparing revenue per day/week */}
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card shadow rounded-4 p-4 border-0 h-100">
                        <h6 className="fw-semibold fs-5 mb-3">🕒 Order Time Distribution</h6>
                        <Doughnut data={doughnutData} />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card shadow rounded-4 p-4 border-0 h-100">
                        <h6 className="fw-semibold fs-5 mb-3">📈 Orders by Day</h6>
                        <Line data={lineData} />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card shadow rounded-4 p-4 border-0 h-100">
                        <h6 className="fw-semibold fs-5 mb-3">🍽️ Most Ordered Foods</h6>
                        <ul className="list-group list-group-flush">
                            {topFoods.map((food, index) => (
                                <li key={index} className="list-group-item border-0 ps-0">
                                    {food.name} – <strong>IDR {food.price.toLocaleString()}</strong> ({food.quantity}x)
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;
