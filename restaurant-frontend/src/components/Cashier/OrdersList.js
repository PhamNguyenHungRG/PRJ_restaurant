// OrdersList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const OrdersList = ({ onSelectOrder }) => {
  const [orders, setOrders] = useState([]);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [hoverBtnIndex, setHoverBtnIndex] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/cashier/orders')
      .then(res => setOrders(res.data))
      .catch(err => console.error(err));
  }, []);

  const styles = {
    container: {
      fontFamily: "'Montserrat', sans-serif",
      backgroundColor: '#fff',
      minHeight: '100vh',
      padding: '2.5rem 1rem',
      color: '#eee',
    },
    title: {
      fontWeight: '700',
      fontSize: '2.5rem',
      color: '#111',
      marginBottom: '0.3rem',
      textAlign: 'center',
      letterSpacing: '0.06em',
    },
    subtitle: {
      color: '#555',
      fontWeight: '500',
      marginBottom: '3rem',
      textAlign: 'center',
      fontSize: '1.1rem',
    },
    card: {
      backgroundColor: '#121212',
      borderRadius: '12px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      cursor: 'pointer',
      border: '2px solid transparent',
      padding: '1.8rem',
      minHeight: '190px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    cardHover: {
      transform: 'translateY(-8px)',
      boxShadow: '0 20px 40px rgba(249, 215, 95, 0.6)',
      borderColor: 'rgba(249, 215, 95, 0.9)',
    },
    cardTitle: {
      fontWeight: '700',
      fontSize: '1.4rem',
      marginBottom: '0.8rem',
      color: '#fff',
    },
    cardText: {
      color: '#ccc',
      fontWeight: '500',
      fontSize: '1rem',
      marginBottom: '1.8rem',
      minHeight: '38px',
    },
    btnEnabled: {
      width: '100%',
      padding: '0.75rem 0',
      background: 'linear-gradient(45deg, #f9d976, #f39c12)',
      color: '#121212',
      border: 'none',
      borderRadius: '12px',
      fontWeight: '700',
      fontSize: '1.15rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '0.6rem',
      boxShadow: '0 4px 10px rgba(249, 215, 95, 0.6)',
      transition: 'filter 0.3s ease',
    },
    btnEnabledHover: {
      filter: 'brightness(1.15)',
    },
    btnDisabled: {
      width: '100%',
      padding: '0.75rem 0',
      backgroundColor: '#3a3a3a',
      color: '#777',
      border: 'none',
      borderRadius: '12px',
      fontWeight: '700',
      fontSize: '1.15rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '0.6rem',
      cursor: 'not-allowed',
    },
    noOrders: {
      textAlign: 'center',
      marginTop: '5rem',
      color: '#888',
      fontSize: '1.3rem',
      fontWeight: '600',
    }
  };

  return (
    <div style={styles.container} className="container">
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap"
        rel="stylesheet"
      />
      <h2 style={styles.title}>Hóa Đơn Chưa Thanh Toán</h2>
      <p style={styles.subtitle}>Vui lòng chọn bàn để tiếp tục thanh toán</p>

      <div className="row justify-content-start">
        {orders.length === 0 ? (
          <p style={styles.noOrders}>Không có hóa đơn chưa thanh toán</p>
        ) : (
          orders.map((order, idx) => (
            <div key={order.id} className="col-md-6 col-lg-4 mb-4">
              <div
                style={{
                  ...styles.card,
                  ...(hoverIndex === idx ? styles.cardHover : {})
                }}
                onMouseEnter={() => setHoverIndex(idx)}
                onMouseLeave={() => setHoverIndex(null)}
              >
                <div>
                  <h5 style={styles.cardTitle}>
                    Bàn số: {order.table.table_number}
                  </h5>
                  <p style={styles.cardText}>
                    Trạng thái: <strong>{order.table.status}</strong>
                  </p>
                </div>

                {order.table.status === 'đã lên hết món' ? (
                  <button
                    style={{
                      ...styles.btnEnabled,
                      ...(hoverBtnIndex === idx ? styles.btnEnabledHover : {})
                    }}
                    onMouseEnter={() => setHoverBtnIndex(idx)}
                    onMouseLeave={() => setHoverBtnIndex(null)}
                    onClick={() => onSelectOrder(order.id)}
                  >
                    <FaCheckCircle />
                    Thanh toán ngay
                  </button>
                ) : (
                  <button
                    style={styles.btnDisabled}
                    disabled
                  >
                    <FaTimesCircle />
                    Chưa thể thanh toán
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrdersList;
