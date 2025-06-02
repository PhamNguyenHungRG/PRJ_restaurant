import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InventoryStats = () => {
  const [period, setPeriod] = useState('day');
  const [stats, setStats] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [details, setDetails] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        let url = '';
        const today = new Date().toISOString().slice(0, 10);
        const currentMonth = new Date().toISOString().slice(0, 7);
        const currentYear = new Date().getFullYear();

        if (period === 'day') {
          url = `http://localhost:8000/api/reports/daily?date=${today}`;
        } else if (period === 'month') {
          url = `http://localhost:8000/api/reports/monthly?month=${currentMonth}`;
        } else if (period === 'year') {
          url = `http://localhost:8000/api/reports/yearly?year=${currentYear}`;
        }

        const response = await axios.get(url);

        const result = Array.isArray(response.data)
            ? response.data
            : response.data?.data || [];

        setStats(result);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu thống kê:', error);
        setStats([]);
      }
    };

    fetchStats();
  }, [period]);

  const handleShowDetail = async (date) => {
    try {
      setSelectedDate(date);
      const res = await axios.get(`http://localhost:8000/api/inventory-receipts?date=${date}`);
      setDetails(res.data || []);
      setShowModal(true);
    } catch (err) {
      console.error('Lỗi khi lấy chi tiết:', err);
    }
  };

  const formatCurrency = (amount) =>
      new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  const getDateLabel = (row) =>
      row.date || row.day || row.time || row.month || row.year || '---';

  return (
    <div className="container mt-4">
      <h3 className="mb-4 fw-bold text-primary">📦 Thống kê nhập nguyên liệu</h3>

      <select
        className="form-select mb-3 w-auto"
        value={period}
        onChange={(e) => setPeriod(e.target.value)}
        aria-label="Chọn khoảng thời gian thống kê"
      >
        <option value="day">Theo ngày</option>
        <option value="month">Theo tháng</option>
        <option value="year">Theo năm</option>
      </select>

      <div className="table-responsive">
        <table className="table table-striped table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>🗓️ Thời gian</th>
              <th>📥 Tổng số lượng nhập</th>
              <th>💰 Tổng số tiền nhập</th>
              <th>🔍 Hành động</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(stats) && stats.length > 0 ? (
              stats.map((row, idx) => (
                <tr key={idx}>
                  <td>{getDateLabel(row)}</td>
                  <td>{row.total_quantity}</td>
                  <td>{formatCurrency(row.total_value)}</td>
                  <td>
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => handleShowDetail(getDateLabel(row))}
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  Không có dữ liệu thống kê.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal chi tiết */}
      {showModal && (
        <div
          className="modal fade show"
          tabIndex="-1"
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modalTitle"
          onClick={() => setShowModal(false)}
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered"
            role="document"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="modalTitle">
                  📝 Chi tiết nhập kho ngày {selectedDate}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {details.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>🥬 Nguyên liệu</th>
                          <th>Số lượng</th>
                          <th>Đơn giá</th>
                          <th>Thành tiền</th>
                          <th>🕓 Ngày giờ nhập</th>
                        </tr>
                      </thead>
                      <tbody>
                        {details.map((item, index) => (
                          <tr key={index}>
                            <td>{item.ingredient_name}</td>
                            <td>{item.quantity}</td>
                            <td>{formatCurrency(item.unit_price)}</td>
                            <td>{formatCurrency(item.quantity * item.unit_price)}</td>
                            <td>{item.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted">Không có chi tiết nhập kho.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryStats;
