import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DestructionStats = () => {
    const [data, setData] = useState([]);
    const [period, setPeriod] = useState('day');
    const [details, setDetails] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchStats();
    }, [period]);

    const fetchStats = async () => {
        try {
            const today = new Date().toISOString().slice(0, 10);
            const currentMonth = new Date().toISOString().slice(0, 7);
            const currentYear = new Date().getFullYear();

            let url = '';
            if (period === 'day') {
                url = `http://localhost:8000/api/reports/destruction/daily/${today}`;
            } else if (period === 'month') {
                url = `http://localhost:8000/api/reports/destruction/monthly/${currentMonth}`;
            } else {
                url = `http://localhost:8000/api/reports/destruction/yearly/${currentYear}`;
            }

            const res = await axios.get(url);
            setData(res.data || []);
        } catch (err) {
            console.error('Lỗi tải thống kê:', err);
            setData([]);
        }
    };

    const handleViewDetails = async (date) => {
        try {
            const res = await axios.get(`http://localhost:8000/api/destruction/by-date/${date}`);
            setSelectedDate(date);
            setDetails(res.data || []);
        } catch (err) {
            console.error('Lỗi tải chi tiết:', err);
            setDetails([]);
        }
    };

    return (
        <div className="container my-5">
            <div className="bg-white p-4 p-md-5 rounded shadow border border-light">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="text-danger fw-bold">🔥 Thống kê tiêu hủy nguyên liệu</h2>
                    <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
                        ← Quay lại Dashboard
                    </button>
                </div>

                <div className="mb-3">
                    <select value={period} onChange={(e) => setPeriod(e.target.value)} className="form-select">
                        <option value="day">Theo ngày</option>
                        <option value="month">Theo tháng</option>
                        <option value="year">Theo năm</option>
                    </select>
                </div>

                <table className="table table-bordered table-hover align-middle">
                    <thead className="table-light text-center">
                        <tr>
                            <th>Thời gian</th>
                            <th>Tổng số lượng</th>
                            <th>Tổng thiệt hại</th>
                            <th>Chi tiết</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.date || item.day || item.month || item.year}</td>
                                    <td>{item.total_quantity}</td>
                                    <td>{item.total_loss}</td>
                                    <td className="text-center">
                                        <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => handleViewDetails(item.date || item.day)}
                                        >
                                            Xem chi tiết
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center">Không có dữ liệu</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {details.length > 0 && (
                    <>
                        <h5 className="mt-5 mb-3">📋 Chi tiết tiêu hủy ngày {selectedDate}</h5>
                        <table className="table table-bordered table-sm">
                            <thead className="table-secondary text-center">
                                <tr>
                                    <th>Nguyên liệu</th>
                                    <th>Số lượng</th>
                                    <th>Thiệt hại</th>
                                    <th>Lý do</th>
                                    <th>Thời gian</th>
                                </tr>
                            </thead>
                            <tbody>
                                {details.map((d, idx) => (
                                    <tr key={idx}>
                                        <td>{d.ingredient_name}</td>
                                        <td>{d.quantity}</td>
                                        <td>{d.loss_value}</td>
                                        <td>{d.reason}</td>
                                        <td>{d.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}
            </div>
        </div>
    );
};

export default DestructionStats;
