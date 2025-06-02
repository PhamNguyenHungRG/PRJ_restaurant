import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const PaymentPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [method, setMethod] = useState('cash');
  const [cash, setCash] = useState('');
  const navigate = useNavigate();
  const invoiceRef = useRef();
  const [isBackHovered, setIsBackHovered] = useState(false);

  const buttonStyle = {
    background: 'linear-gradient(45deg, #d4af37, #f9e79f)', // gradient vàng ánh kim
    border: 'none',
    color: '#000',
    fontWeight: '600',
    transition: 'filter 0.3s ease',
    borderRadius: '12px',
    padding: '0.5rem 1.5rem',
  };

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

  const cashNumber = Number(cash);
  const change = cashNumber - total;
  const isCashEnough = method === 'cash' ? cashNumber >= total : true;

  const handlePayment = () => {
    if (method === 'cash' && !isCashEnough) {
      alert('Tiền khách đưa chưa đủ!');
      return;
    }

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
    <div className="container mt-5 mb-5">
      {/* Invoice */}
      <div ref={invoiceRef} className="border rounded p-4 shadow-sm bg-white">
        <h3 className="text-center mb-4 text-primary fw-bold">🧾 HÓA ĐƠN THANH TOÁN</h3>

        <div className="d-flex justify-content-between mb-3 fs-6">
          <div><strong>Ngày:</strong> {new Date().toLocaleString()}</div>
          <div><strong>Bàn:</strong> {order.table.table_number}</div>
        </div>
        <div className="mb-3 fs-6"><strong>Mã đơn:</strong> {order.id}</div>

        <table className="table table-bordered table-sm align-middle">
          <thead className="table-light text-center">
            <tr>
              <th>Món</th>
              <th>Số lượng</th>
              <th>Đơn giá</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {order.order_details.map(item => (
              <tr key={item.id} className="text-center">
                <td className="text-start">{item.food.name}</td>
                <td>{item.quantity}</td>
                <td>{item.food.price.toLocaleString()} VND</td>
                <td>{(item.food.price * item.quantity).toLocaleString()} VND</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-end mt-4 fs-5">
          <span className="fw-semibold">Tổng tiền: </span>
          <span className="text-danger fw-bold">{total.toLocaleString()} VND</span>
        </div>

        {method === 'cash' && (
          <div className="mt-3 fs-6">
            <p><strong>Tiền khách đưa:</strong> {cashNumber ? cashNumber.toLocaleString() : 0} VND</p>
            <p><strong>Tiền thối lại:</strong> {change > 0 ? change.toLocaleString() : 0} VND</p>
          </div>
        )}

        <p className="mt-3 fs-6">
          <strong>Phương thức thanh toán:</strong> {method === 'cash' ? 'Tiền mặt' : 'Chuyển khoản'}
        </p>

        {/* QR Code */}
        <div className="text-center mt-4">
          <img
            src={`https://api.vietqr.io/image/970422-766666886-lBuj84N.jpg?accountName=DINH%20TUNG%20LAM&amount=${total}`}
            alt="QR Code"
            className="img-fluid"
            style={{ maxWidth: '180px', borderRadius: '8px', boxShadow: '0 0 8px rgba(0,0,0,0.15)' }}
          />
          <p className="text-muted mt-2 fst-italic">Vui lòng quét mã để thanh toán</p>
        </div>
      </div>

      {/* Payment method and cash input */}
      <div className="mt-5 p-4 border rounded shadow-sm bg-light">
        <div className="mb-3">
          <label className="form-label fw-semibold">Phương thức thanh toán:</label>
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
            <label className="form-label fw-semibold">Tiền khách đưa:</label>
            <input
              type="number"
              min={total}
              className={`form-control ${cashNumber < total ? 'is-invalid' : ''}`}
              placeholder="Nhập số tiền"
              value={cash}
              onChange={e => setCash(e.target.value)}
            />
            {cashNumber < total && (
              <div className="invalid-feedback">
                Số tiền phải lớn hơn hoặc bằng tổng tiền!
              </div>
            )}
          </div>
        )}

        <div className="d-flex gap-3">
          <button
            className="btn btn-success flex-grow-1"
            onClick={handlePayment}
            disabled={!isCashEnough}
            title={!isCashEnough ? 'Tiền khách đưa chưa đủ' : 'Hoàn tất thanh toán'}
          >
            💳 Hoàn tất thanh toán
          </button>
          <button className="btn btn-outline-secondary" onClick={handlePrint}>
            🖨️ In hóa đơn
          </button>
          <button
            style={{ ...buttonStyle, background: 'transparent', color: '#FFD700', border: '2px solid #FFD700', boxShadow: 'none', ...(isBackHovered ? { filter: 'brightness(1.15)', transform: 'scale(1.05)' } : {}) }}
            onClick={() => navigate('/cashier')}
            onMouseEnter={() => setIsBackHovered(true)}
            onMouseLeave={() => setIsBackHovered(false)}
          >
            🔙 Quay lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
