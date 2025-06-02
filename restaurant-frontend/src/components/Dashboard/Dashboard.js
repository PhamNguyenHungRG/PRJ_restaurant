// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import AdminLayout from './AdminLayout';
// import { Doughnut, Line, Bar } from 'react-chartjs-2';
// import {
//     Chart as ChartJS,
//     CategoryScale,
//     LinearScale,
//     BarElement,
//     ArcElement,
//     PointElement,
//     LineElement,
//     Tooltip,
//     Legend,
// } from 'chart.js';

// ChartJS.register(
//     CategoryScale,
//     LinearScale,
//     BarElement,
//     ArcElement,
//     PointElement,
//     LineElement,
//     Tooltip,
//     Legend
// );

// const Dashboard = () => {
//     const [totalRevenue, setTotalRevenue] = useState(0);
//     const [topFoods, setTopFoods] = useState([]);
//     const [ordersByDay, setOrdersByDay] = useState([]);
//     const [ordersByTime, setOrdersByTime] = useState({});
//     const [timeRange, setTimeRange] = useState('month');
//     const [revenueComparison, setRevenueComparison] = useState([]);

//     const [startDate, setStartDate] = useState('');
//     const [endDate, setEndDate] = useState('');
//     const [customRevenueComparison, setCustomRevenueComparison] = useState([]);

//     useEffect(() => {
//         axios.get(`http://localhost:8000/api/dashboard-data?timeRange=${timeRange}`)
//             .then(res => {
//                 setTotalRevenue(res.data.totalRevenue);
//                 setTopFoods(res.data.topFoods);
//                 setOrdersByDay(res.data.ordersByDay);
//                 setOrdersByTime(res.data.ordersByTime);
//                 setRevenueComparison(res.data.revenueComparison || []);
//             })
//             .catch(err => {
//                 console.error('Lỗi khi lấy dữ liệu dashboard:', err);
//             });
//     }, [timeRange]);

//     const handleCompareByDateRange = () => {
//         if (!startDate || !endDate) {
//             alert('Vui lòng chọn đủ ngày bắt đầu và ngày kết thúc');
//             return;
//         }
//         if (startDate > endDate) {
//             alert('Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc');
//             return;
//         }

//         axios.get(`http://localhost:8000/api/dashboard-data/custom-comparison?startDate=${startDate}&endDate=${endDate}`)
//             .then(res => {
//                 setCustomRevenueComparison(res.data.revenueComparison || []);
//             })
//             .catch(err => {
//                 console.error('Lỗi khi lấy dữ liệu so sánh tùy chọn:', err);
//             });
//     };

//     const doughnutData = {
//         labels: ['Morning', 'Afternoon', 'Evening'],
//         datasets: [
//             {
//                 data: ['Morning', 'Afternoon', 'Evening'].map(time => ordersByTime[time] || 0),
//                 backgroundColor: ['#6366f1', '#a5b4fc', '#e0e7ff'],
//                 borderWidth: 2,
//             },
//         ],
//     };

//     const lineData = {
//         labels: ordersByDay.map(item => item.day),
//         datasets: [
//             {
//                 label: 'Orders by Day',
//                 data: ordersByDay.map(item => item.count),
//                 borderColor: '#4f46e5',
//                 backgroundColor: 'rgba(79, 70, 229, 0.1)',
//                 tension: 0.4,
//                 fill: true,
//                 pointRadius: 4,
//             }
//         ],
//     };

//     const revenueComparisonData = {
//         labels: revenueComparison.map(item => item.period),
//         datasets: [
//             {
//                 label: 'Doanh thu',
//                 data: revenueComparison.map(item => item.amount),
//                 backgroundColor: '#4f46e5',
//             }
//         ],
//     };

//     const customComparisonData = {
//         labels: customRevenueComparison.map(item => item.period),
//         datasets: [
//             {
//                 label: 'Doanh thu',
//                 data: customRevenueComparison.map(item => item.amount),
//                 backgroundColor: '#f59e0b',
//             }
//         ],
//     };

//     return (
//         <AdminLayout>
//             <h2 className="fw-bold mb-4 fs-3 text-primary">📊 Dashboard Overview</h2>

//             <div className="mb-4 w-auto" style={{ maxWidth: 200 }}>
//                 <select
//                     className="form-select shadow-sm"
//                     value={timeRange}
//                     onChange={e => setTimeRange(e.target.value)}
//                     aria-label="Chọn khoảng thời gian"
//                 >
//                     <option value="day">Ngày</option>
//                     <option value="week">Tuần</option>
//                     <option value="month">Tháng</option>
//                     <option value="quarter">Quý</option>
//                     <option value="year">Năm</option>
//                 </select>
//             </div>

//             <div className="row g-4">
//                 <div className="col-lg-6 col-md-12 d-flex flex-column gap-4">
//                     <div className="card shadow rounded-4 p-4 border-0 flex-grow-1">
//                         <h6 className="fw-semibold fs-5 mb-3 text-secondary">💰 Doanh thu theo {timeRange}</h6>
//                         <p className="display-6 fw-bold text-success">VND {totalRevenue.toLocaleString('vi-VN')}</p>
//                     </div>

//                     <div className="card shadow rounded-4 p-4 border-0 flex-grow-1">
//                         <h6 className="fw-semibold fs-5 mb-3 text-secondary">📊 So sánh doanh thu</h6>
//                         {revenueComparison.length > 0 ? (
//                             <Bar data={revenueComparisonData} options={{ maintainAspectRatio: false, height: 250 }} />
//                         ) : (
//                             <p className="text-muted fst-italic">Không có dữ liệu để so sánh</p>
//                         )}
//                     </div>

//                     <div className="card shadow rounded-4 p-4 border-0 flex-grow-1">
//                         <h6 className="fw-semibold fs-5 mb-3 text-secondary">🔍 So sánh doanh thu theo ngày</h6>
//                         <div className="row g-2 align-items-center mb-3">
//                             <div className="col-5">
//                                 <label htmlFor="startDate" className="form-label mb-1">Từ ngày:</label>
//                                 <input
//                                     id="startDate"
//                                     type="date"
//                                     value={startDate}
//                                     onChange={e => setStartDate(e.target.value)}
//                                     className="form-control shadow-sm"
//                                 />
//                             </div>
//                             <div className="col-5">
//                                 <label htmlFor="endDate" className="form-label mb-1">Đến ngày:</label>
//                                 <input
//                                     id="endDate"
//                                     type="date"
//                                     value={endDate}
//                                     onChange={e => setEndDate(e.target.value)}
//                                     className="form-control shadow-sm"
//                                 />
//                             </div>
//                             <div className="col-2 d-grid">
//                                 <button
//                                     className="btn btn-warning text-white h-100 fw-semibold"
//                                     onClick={handleCompareByDateRange}
//                                     style={{ whiteSpace: 'nowrap' }}
//                                 >
//                                     So sánh
//                                 </button>
//                             </div>
//                         </div>

//                         {customRevenueComparison.length > 0 ? (
//                             <div style={{ height: 250 }}>
//                                 <Bar data={customComparisonData} options={{ maintainAspectRatio: false }} />
//                             </div>
//                         ) : (
//                             <p className="text-muted fst-italic">Chưa có dữ liệu so sánh theo ngày bạn chọn.</p>
//                         )}
//                     </div>
//                 </div>

//                 <div className="col-lg-6 col-md-12 d-flex flex-column gap-4">
//                     <div className="card shadow rounded-4 p-4 border-0 flex-grow-1 d-flex flex-column">
//                         <h6 className="fw-semibold fs-5 mb-3 text-secondary">🕒 Phân bố đơn hàng theo thời gian</h6>
//                         <div className="flex-grow-1 d-flex justify-content-center align-items-center" style={{ minHeight: 280 }}>
//                             <Doughnut data={doughnutData} />
//                         </div>
//                     </div>

//                     <div className="card shadow rounded-4 p-4 border-0 flex-grow-1 d-flex flex-column">
//                         <h6 className="fw-semibold fs-5 mb-3 text-secondary">📈 Đơn hàng theo ngày</h6>
//                         <div style={{ flexGrow: 1, minHeight: 250 }}>
//                             <Line data={lineData} options={{ maintainAspectRatio: false }} />
//                         </div>
//                     </div>

//                     <div className="card shadow rounded-4 p-4 border-0 flex-grow-1">
//                         <h6 className="fw-semibold fs-5 mb-3 text-secondary">🍽️ Món ăn được đặt nhiều nhất</h6>
//                         <ul className="list-group list-group-flush overflow-auto" style={{ maxHeight: '200px' }}>
//                             {topFoods.length > 0 ? topFoods.map((food, index) => (
//                                 <li key={index} className="list-group-item d-flex justify-content-between align-items-center border-0 ps-0">
//                                     <span>{food.name}</span>
//                                     <span>
//                                         <strong className="text-primary">VND {food.price.toLocaleString('vi-VN')}</strong> ({food.quantity}x)
//                                     </span>
//                                 </li>
//                             )) : (
//                                 <li className="list-group-item border-0 ps-0 text-muted fst-italic">Chưa có món ăn nào được đặt</li>
//                             )}
//                         </ul>
//                     </div>
//                 </div>
//             </div>
//         </AdminLayout>
//     );
// };

// export default Dashboard;
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
                backgroundColor: ['#f5e6a4', '#f7f1c1', '#faf7d6'], // tone vàng nhạt dịu
                borderWidth: 2,
                borderColor: '#d4af37', // vàng ánh kim viền
            },
        ],
    };

    const lineData = {
        labels: ordersByDay.map(item => item.day),
        datasets: [
            {
                label: 'Orders by Day',
                data: ordersByDay.map(item => item.count),
                borderColor: '#d4af37',  // vàng ánh kim
                backgroundColor: 'rgba(212, 175, 55, 0.2)', // trong suốt vàng ánh kim
                tension: 0.4,
                fill: true,
                pointRadius: 5,
                pointBackgroundColor: '#d4af37',
            }
        ],
    };

    const revenueComparisonData = {
        labels: revenueComparison.map(item => item.period),
        datasets: [
            {
                label: 'Doanh thu',
                data: revenueComparison.map(item => item.amount),
                backgroundColor: '#d4af37', // vàng ánh kim
            }
        ],
    };

    const customComparisonData = {
        labels: customRevenueComparison.map(item => item.period),
        datasets: [
            {
                label: 'Doanh thu',
                data: customRevenueComparison.map(item => item.amount),
                backgroundColor: '#f9e79f', // vàng nhạt sáng
            }
        ],
    };

    const cardStyle = {
        borderRadius: '12px',
        boxShadow: '0 8px 20px rgb(0 0 0 / 0.08)',
        backgroundColor: 'white',
        border: 'none',
        padding: '1.5rem',
        color: '#111',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    };

    const labelStyle = {
        color: '#d4af37', // vàng ánh kim
        fontWeight: '600',
    };

    const buttonStyle = {
        backgroundColor: '#f9e79f', // vàng nhạt nhẹ nhàng
        color: '#000',
        border: 'none',
        padding: '0.5rem 1.2rem',
        borderRadius: '10px',
        fontWeight: '600',
        boxShadow: '0 3px 8px rgba(212,175,55,0.3)',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
    };

    const buttonHoverStyle = {
        backgroundColor: '#d4af37',
        boxShadow: '0 6px 15px rgba(212,175,55,0.6)',
        color: '#fff',
    };

    const [isBtnHovered, setIsBtnHovered] = useState(false);

    return (
        <AdminLayout>
            <h2
              className="fw-bold mb-4 fs-3"
              style={{ color: '#111', fontFamily: "'Georgia', serif" }}
            >
              📊 Dashboard Overview
            </h2>

            <div className="mb-4" style={{ maxWidth: 200 }}>
                <select
                    className="form-select shadow-sm"
                    value={timeRange}
                    onChange={e => setTimeRange(e.target.value)}
                    aria-label="Chọn khoảng thời gian"
                    style={{
                      borderRadius: '10px',
                      borderColor: '#d4af37',
                      color: '#111',
                      fontWeight: '600',
                    }}
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
                    <div style={cardStyle}>
                        <h6 style={{...labelStyle, fontSize: '1.25rem', marginBottom: '1rem'}}>💰 Doanh thu theo {timeRange}</h6>
                        <p className="display-6 fw-bold" style={{ color: '#111' }}>
                            VND {totalRevenue.toLocaleString('vi-VN')}
                        </p>
                    </div>

                    <div style={cardStyle}>
                        <h6 style={{...labelStyle, fontSize: '1.25rem', marginBottom: '1rem'}}>📊 So sánh doanh thu</h6>
                        {revenueComparison.length > 0 ? (
                            <div style={{ height: 250 }}>
                                <Bar data={revenueComparisonData} options={{ maintainAspectRatio: false }} />
                            </div>
                        ) : (
                            <p style={{ fontStyle: 'italic', color: '#777' }}>Không có dữ liệu để so sánh</p>
                        )}
                    </div>

                    <div style={cardStyle}>
                        <h6 style={{...labelStyle, fontSize: '1.25rem', marginBottom: '1rem'}}>🔍 So sánh doanh thu theo ngày</h6>
                        <div className="row g-2 align-items-center mb-3">
                            <div className="col-5">
                                <label htmlFor="startDate" style={{ fontWeight: '600', color: '#d4af37' }}>Từ ngày:</label>
                                <input
                                    id="startDate"
                                    type="date"
                                    value={startDate}
                                    onChange={e => setStartDate(e.target.value)}
                                    className="form-control shadow-sm"
                                    style={{ borderRadius: '10px', borderColor: '#d4af37' }}
                                />
                            </div>
                            <div className="col-5">
                                <label htmlFor="endDate" style={{ fontWeight: '600', color: '#d4af37' }}>Đến ngày:</label>
                                <input
                                    id="endDate"
                                    type="date"
                                    value={endDate}
                                    onChange={e => setEndDate(e.target.value)}
                                    className="form-control shadow-sm"
                                    style={{ borderRadius: '10px', borderColor: '#d4af37' }}
                                />
                            </div>
                            <div className="col-2 d-flex align-items-end">
                                <button
                                    style={{...buttonStyle, ...(isBtnHovered ? buttonHoverStyle : {})}}
                                    onMouseEnter={() => setIsBtnHovered(true)}
                                    onMouseLeave={() => setIsBtnHovered(false)}
                                    onClick={handleCompareByDateRange}
                                    aria-label="So sánh doanh thu theo khoảng ngày"
                                >
                                    So sánh
                                </button>
                            </div>
                        </div>

                        {customRevenueComparison.length > 0 && (
                            <div style={{ height: 230 }}>
                                <Bar data={customComparisonData} options={{ maintainAspectRatio: false }} />
                            </div>
                        )}
                    </div>
                </div>

                <div className="col-lg-6 col-md-12 d-flex flex-column gap-4">
                    <div style={cardStyle}>
                        <h6 style={{...labelStyle, fontSize: '1.25rem', marginBottom: '1rem'}}>📋 Top 5 món ăn được đặt nhiều nhất</h6>
                        {topFoods.length > 0 ? (
                            <ul className="list-group">
                                {topFoods.map((food, idx) => (
                                    <li
                                        key={food.id}
                                        className={`list-group-item d-flex justify-content-between align-items-center ${idx < 3 ? 'fw-bold text-warning' : ''}`}
                                        style={{
                                            borderRadius: '8px',
                                            marginBottom: '0.5rem',
                                            border: '1px solid #f9e79f',
                                            backgroundColor: idx < 3 ? '#fffbea' : 'white',
                                            color: '#111',
                                        }}
                                    >
                                        <span>{idx + 1}. {food.name}</span>
                                        <span style={{ color: '#d4af37' }}>{food.count} đặt</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p style={{ fontStyle: 'italic', color: '#777' }}>Chưa có dữ liệu món ăn</p>
                        )}
                    </div>

                    <div style={cardStyle}>
                        <h6 style={{...labelStyle, fontSize: '1.25rem', marginBottom: '1rem'}}>⏰ Đơn hàng theo thời gian trong ngày</h6>
                        <div style={{ height: 250 }}>
                            <Doughnut data={doughnutData} options={{
                                plugins: {
                                    legend: {
                                        position: 'bottom',
                                        labels: {
                                            color: '#d4af37',
                                            font: {
                                                weight: '600',
                                            },
                                        },
                                    },
                                },
                                maintainAspectRatio: false,
                            }} />
                        </div>
                    </div>

                    <div style={cardStyle}>
                        <h6 style={{...labelStyle, fontSize: '1.25rem', marginBottom: '1rem'}}>📈 Đơn hàng theo ngày</h6>
                        <div style={{ height: 250 }}>
                            <Line data={lineData} options={{
                                plugins: {
                                    legend: {
                                        labels: {
                                            color: '#d4af37',
                                            font: {
                                                weight: '600',
                                            },
                                        },
                                    },
                                },
                                scales: {
                                    x: {
                                        ticks: { color: '#d4af37', font: { weight: '600' } },
                                        grid: { color: 'rgba(212,175,55,0.1)' },
                                    },
                                    y: {
                                        ticks: { color: '#d4af37', font: { weight: '600' } },
                                        grid: { color: 'rgba(212,175,55,0.1)' },
                                    },
                                },
                                maintainAspectRatio: false,
                            }} />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;