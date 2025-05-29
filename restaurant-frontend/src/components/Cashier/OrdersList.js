// OrdersList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const OrdersList = ({ onSelectOrder }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/cashier/orders')
      .then(res => setOrders(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container my-4">
      <div className="text-center mb-4">
        <h2 className="fw-bold text-dark" style={{ fontFamily: 'Georgia, serif' }}>
          Hóa Đơn Chưa Thanh Toán
        </h2>
        <p className="text-muted">Vui lòng chọn bàn để tiếp tục thanh toán</p>
      </div>

      <div className="row justify-start">
        {orders.map(order => (
          <div key={order.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card shadow-sm border-0 rounded-4">
              <div className="card-body">
                <h5 className="card-title mb-2">
                  <span className="fw-semibold">Bàn số:</span> {order.table.table_number}
                </h5>
                <p className="card-text mb-3 text-muted">
                  Trạng thái: <strong>{order.table.status}</strong>
                </p>

                {order.table.status === 'đã lên hết món' ? (
                  <button
                    className="btn btn-success w-100 rounded-pill"
                    onClick={() => onSelectOrder(order.id)}
                  >
                    <FaCheckCircle className="me-2" />
                    Thanh toán ngay
                  </button>
                ) : (
                  <button
                    className="btn btn-outline-secondary w-100 rounded-pill" disabled
                  >
                    <FaTimesCircle className="me-2" />
                    Chưa thể thanh toán
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersList;
