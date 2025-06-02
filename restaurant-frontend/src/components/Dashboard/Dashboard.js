import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
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
    const [timeRange, setTimeRange] = useState('month');
    const [revenueComparison, setRevenueComparison] = useState([]);

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [customRevenueComparison, setCustomRevenueComparison] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:8000/api/dashboard-data?timeRange=${timeRange}`)
            .then(res => {
                setTotalRevenue(res.data.totalRevenue);
                setTopFoods(res.data.topFoods);
                setOrdersByDay(res.data.ordersByDay);
                setOrdersByTime(res.data.ordersByTime);
                setRevenueComparison(res.data.revenueComparison || []);
            })
            .catch(err => {
                console.error('Lỗi khi lấy dữ liệu dashboard:', err);
            });
    }, [timeRange]);

    const handleCompareByDateRange = () => {
        if (!startDate || !endDate) {
            alert('Vui lòng chọn đủ ngày bắt đầu và ngày kết thúc');
            return;
        }
        if (startDate > endDate) {
            alert('Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc');
            return;
        }

        axios.get(`http://localhost:8000/api/dashboard-data/custom-comparison?startDate=${startDate}&endDate=${endDate}`)
            .then(res => {
                setCustomRevenueComparison(res.data.revenueComparison || []);
            })
            .catch(err => {
                console.error('Lỗi khi lấy dữ liệu so sánh tùy chọn:', err);
            });
    };

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

    const revenueComparisonData = {
        labels: revenueComparison.map(item => item.period),
        datasets: [
            {
                label: 'Doanh thu',
                data: revenueComparison.map(item => item.amount),
                backgroundColor: '#4f46e5',
            }
        ],
    };

    const customComparisonData = {
        labels: customRevenueComparison.map(item => item.period),
        datasets: [
            {
                label: 'Doanh thu',
                data: customRevenueComparison.map(item => item.amount),
                backgroundColor: '#f59e0b',
            }
        ],
    };

    return (
        <AdminLayout>
            <h2 className="fw-bold mb-4 fs-3 text-primary">📊 Dashboard Overview</h2>

            <div className="mb-4 w-auto" style={{ maxWidth: 200 }}>
                <select
                    className="form-select shadow-sm"
                    value={timeRange}
                    onChange={e => setTimeRange(e.target.value)}
                    aria-label="Chọn khoảng thời gian"
                >
                    <option value="day">Ngày</option>
                    <option value="week">Tuần</option>
                    <option value="month">Tháng</option>
                    <option value="quarter">Quý</option>
                    <option value="year">Năm</option>
                </select>
            </div>

            <div className="row g-4">
                <div className="col-lg-6 col-md-12 d-flex flex-column gap-4">
                    <div className="card shadow rounded-4 p-4 border-0 flex-grow-1">
                        <h6 className="fw-semibold fs-5 mb-3 text-secondary">💰 Doanh thu theo {timeRange}</h6>
                        <p className="display-6 fw-bold text-success">VND {totalRevenue.toLocaleString('vi-VN')}</p>
                    </div>

                    <div className="card shadow rounded-4 p-4 border-0 flex-grow-1">
                        <h6 className="fw-semibold fs-5 mb-3 text-secondary">📊 So sánh doanh thu</h6>
                        {revenueComparison.length > 0 ? (
                            <Bar data={revenueComparisonData} options={{ maintainAspectRatio: false, height: 250 }} />
                        ) : (
                            <p className="text-muted fst-italic">Không có dữ liệu để so sánh</p>
                        )}
                    </div>

                    <div className="card shadow rounded-4 p-4 border-0 flex-grow-1">
                        <h6 className="fw-semibold fs-5 mb-3 text-secondary">🔍 So sánh doanh thu theo ngày</h6>
                        <div className="row g-2 align-items-center mb-3">
                            <div className="col-5">
                                <label htmlFor="startDate" className="form-label mb-1">Từ ngày:</label>
                                <input
                                    id="startDate"
                                    type="date"
                                    value={startDate}
                                    onChange={e => setStartDate(e.target.value)}
                                    className="form-control shadow-sm"
                                />
                            </div>
                            <div className="col-5">
                                <label htmlFor="endDate" className="form-label mb-1">Đến ngày:</label>
                                <input
                                    id="endDate"
                                    type="date"
                                    value={endDate}
                                    onChange={e => setEndDate(e.target.value)}
                                    className="form-control shadow-sm"
                                />
                            </div>
                            <div className="col-2 d-grid">
                                <button
                                    className="btn btn-warning text-white h-100 fw-semibold"
                                    onClick={handleCompareByDateRange}
                                    style={{ whiteSpace: 'nowrap' }}
                                >
                                    So sánh
                                </button>
                            </div>
                        </div>

                        {customRevenueComparison.length > 0 ? (
                            <div style={{ height: 250 }}>
                                <Bar data={customComparisonData} options={{ maintainAspectRatio: false }} />
                            </div>
                        ) : (
                            <p className="text-muted fst-italic">Chưa có dữ liệu so sánh theo ngày bạn chọn.</p>
                        )}
                    </div>
                </div>

                <div className="col-lg-6 col-md-12 d-flex flex-column gap-4">
                    <div className="card shadow rounded-4 p-4 border-0 flex-grow-1 d-flex flex-column">
                        <h6 className="fw-semibold fs-5 mb-3 text-secondary">🕒 Phân bố đơn hàng theo thời gian</h6>
                        <div className="flex-grow-1 d-flex justify-content-center align-items-center" style={{ minHeight: 280 }}>
                            <Doughnut data={doughnutData} />
                        </div>
                    </div>

                    <div className="card shadow rounded-4 p-4 border-0 flex-grow-1 d-flex flex-column">
                        <h6 className="fw-semibold fs-5 mb-3 text-secondary">📈 Đơn hàng theo ngày</h6>
                        <div style={{ flexGrow: 1, minHeight: 250 }}>
                            <Line data={lineData} options={{ maintainAspectRatio: false }} />
                        </div>
                    </div>

                    <div className="card shadow rounded-4 p-4 border-0 flex-grow-1">
                        <h6 className="fw-semibold fs-5 mb-3 text-secondary">🍽️ Món ăn được đặt nhiều nhất</h6>
                        <ul className="list-group list-group-flush overflow-auto" style={{ maxHeight: '200px' }}>
                            {topFoods.length > 0 ? topFoods.map((food, index) => (
                                <li key={index} className="list-group-item d-flex justify-content-between align-items-center border-0 ps-0">
                                    <span>{food.name}</span>
                                    <span>
                                        <strong className="text-primary">VND {food.price.toLocaleString('vi-VN')}</strong> ({food.quantity}x)
                                    </span>
                                </li>
                            )) : (
                                <li className="list-group-item border-0 ps-0 text-muted fst-italic">Chưa có món ăn nào được đặt</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;
