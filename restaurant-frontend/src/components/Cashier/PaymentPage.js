import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const PaymentPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [method, setMethod] = useState('cash');
  const [cash, setCash] = useState(0);
  const navigate = useNavigate();
  const invoiceRef = useRef();

  useEffect(() => {
    if (!orderId) return;
    axios.get(`http://localhost:8000/api/cashier/orders/${orderId}`)
        .then(res => setOrder(res.data))
        .catch(err => console.error(err));
  }, [orderId]);

  if (!order) {
    return (
        <div className="text-center mt-5">
          <div className="spinner-border text-secondary" role="status"></div>
          <p className="mt-3">Đang tải đơn hàng...</p>
        </div>
    );
  }

  const total = order.order_details.reduce(
      (sum, item) => sum + item.food.price * item.quantity, 0
  );

  const change = cash - total;

  const handlePayment = () => {
    axios.post(`http://localhost:8000/api/cashier/orders/${orderId}/complete`)
        .then(() => {
          alert('Thanh toán thành công!');
          navigate('/cashier');
        })
        .catch(err => console.error(err));
  };

  const handlePrint = () => {
    const printContent = invoiceRef.current.innerHTML;
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Hóa đơn</title>');
    printWindow.document.write(
        '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"/>'
    );
    printWindow.document.write('</head><body>');
    printWindow.document.write(printContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();

    printWindow.onload = function () {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };
  };

  return (
      <div className="container mt-4">
        {/* Hóa đơn */}
        <div ref={invoiceRef} className="border rounded p-4 shadow-sm mb-4 bg-white">
          <h3 className="text-center mb-4 text-dark">🧾 HÓA ĐƠN THANH TOÁN</h3>

          <div className="d-flex justify-content-between mb-2">
            <div><strong>Ngày:</strong> {new Date().toLocaleString()}</div>
            <div><strong>Bàn:</strong> {order.table.table_number}</div>
          </div>
          <div className="mb-2"><strong>Mã đơn:</strong> {order.id}</div>

          <table className="table table-bordered table-sm">
            <thead className="table-light">
            <tr>
              <th>Món</th>
              <th>Số lượng</th>
              <th>Đơn giá</th>
              <th>Thành tiền</th>
            </tr>
            </thead>
            <tbody>
            {order.order_details.map(item => (
                <tr key={item.id}>
                  <td>{item.food.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.food.price.toLocaleString()} VND</td>
                  <td>{(item.food.price * item.quantity).toLocaleString()} VND</td>
                </tr>
            ))}
            </tbody>
          </table>

          <div className="text-end mt-3">
            <h5>Tổng tiền: <strong>{total.toLocaleString()} VND</strong></h5>
          </div>

          {method === 'cash' && (
              <div className="mt-2">
                <p><strong>Tiền khách đưa:</strong> {cash.toLocaleString()} VND</p>
                <p><strong>Tiền thối lại:</strong> {change > 0 ? change.toLocaleString() : 0} VND</p>
              </div>
          )}

          <p className="mt-2">
            <strong>Phương thức thanh toán:</strong> {method === 'cash' ? 'Tiền mặt' : 'Chuyển khoản'}
          </p>

          {/* QR Code luôn hiển thị trong hóa đơn */}
          <div className="text-center mt-4">
            <img
                src={`https://api.vietqr.io/image/970422-766666886-lBuj84N.jpg?accountName=DINH%20TUNG%20LAM&amount=${total}`}
                alt="QR Code"
                className="img-fluid"
                style={{ maxWidth: '200px' }}
            />
            <p className="text-muted mt-2">Vui lòng quét mã để thanh toán</p>
          </div>
        </div>

        {/* Form chọn phương thức thanh toán và nhập tiền */}
        <div className="mb-4">
          <div className="mb-3">
            <label className="form-label">Phương thức thanh toán:</label>
            <select
                className="form-select"
                value={method}
                onChange={e => setMethod(e.target.value)}
            >
              <option value="cash">Tiền mặt</option>
              <option value="bank">Chuyển khoản</option>
            </select>
          </div>

          {method === 'cash' && (
              <div className="mb-3">
                <label className="form-label">Tiền khách đưa:</label>
                <input
                    type="number"
                    className="form-control"
                    placeholder="Nhập số tiền"
                    value={cash}
                    onChange={e => setCash(Number(e.target.value))}
                />
              </div>
          )}

          <div className="d-flex gap-2">
            <button className="btn btn-success" onClick={handlePayment}>
              💳 Hoàn tất thanh toán
            </button>
            <button className="btn btn-outline-secondary" onClick={handlePrint}>
              🖨️ In hóa đơn
            </button>
          </div>
        </div>
      </div>
  );
};

export default PaymentPage;