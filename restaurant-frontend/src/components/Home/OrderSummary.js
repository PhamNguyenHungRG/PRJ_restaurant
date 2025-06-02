// // import React from 'react';
// import axios from 'axios';

// const OrderSummary = ({
//   orderItems,
//   setOrderItems,
//   handleSendOrderToKitchen,
//   toggleServedStatus,
//   selectedTable
// }) => {
//   const totalAmount = orderItems.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0
//   );

//   const canShowCheckbox = ['chờ lên món', 'đã lên hết món'].includes(selectedTable.status);
//   const newItemsToSend = orderItems.filter(item => !item.is_sent);

//   const shouldHideStatusColumn = orderItems.length > 0 && orderItems.every(item => item.is_ready);
//   const shouldHideDeleteColumn = orderItems.length > 0 && orderItems.every(item => item.is_ready);

//   const handleDeleteItem = (item) => {
//     if (!window.confirm(`Bạn có chắc muốn xóa món "${item.name}" không?`)) return;

//     axios.delete(`http://localhost:8000/api/order-details/${item.id}`)
//       .then(() => {
//         setOrderItems(prev => prev.filter(oi => oi.id !== item.id));
//       })
//       .catch(() => {
//         alert('Xóa món thất bại. Vui lòng thử lại.');
//       });
//   };

//   return (
//     <div>
//       <style>{`
//         .order-table {
//           width: 100%;
//           max-width: 900px;
//           margin: 0 auto;
//           border-collapse: collapse;
//           font-family: 'Playfair Display', serif;
//           background-color: #F8F5F0;
//           border: 1px solid #A3B4C4;
//           border-radius: 8px;
//           overflow: hidden;
//         }

//         .order-table th {
//           background-color: #556B2F;
//           color: #fff;
//           padding: 12px;
//           font-size: 16px;
//         }

//         .order-table td {
//           padding: 10px;
//           border-bottom: 1px solid #A3B4C4;
//         }

//         .quantity-cell {
//           width: 150px;
//           text-align: center;
//           font-size: 18px;
//         }

//         .quantity-cell button {
//           width: 32px;
//           height: 32px;
//           font-size: 18px;
//           padding: 0;
//           margin: 0 6px;
//           border-radius: 6px;
//           background-color: #556B2F;
//           color: white;
//           border: none;
//           cursor: pointer;
//           transition: background-color 0.3s ease;
//         }

//         .quantity-cell button:hover:enabled {
//           background-color: #6e8b3d;
//         }

//         .quantity-cell button:disabled {
//           background-color: #a0a0a0;
//           cursor: not-allowed;
//         }

//         .order-table td button {
//           background-color: #556B2F;
//           color: white;
//           border: none;
//           border-radius: 4px;
//           padding: 4px 10px;
//           transition: background-color 0.3s ease;
//         }

//         .order-table td button:hover {
//           background-color: #6e8b3d;
//         }

//         .send-kitchen-button {
//           padding: 12px 24px;
//           background-color: #556B2F;
//           color: white;
//           border: none;
//           border-radius: 8px;
//           font-size: 16px;
//           transition: box-shadow 0.3s ease, background-color 0.3s ease;
//           cursor: pointer;
//         }

//         .send-kitchen-button:hover {
//           background-color: #6e8b3d;
//           box-shadow: 0 4px 6px rgba(0,0,0,0.1);
//         }

//         .checkbox {
//           width: 20px;
//           height: 20px;
//           border: 2px solid #556B2F;
//           border-radius: 50%;
//           appearance: none;
//           cursor: pointer;
//         }

//         .checkbox:checked {
//           background-color: #A3B4C4;
//         }
//       `}</style>

//       <h4>Đơn hàng</h4>

//       {orderItems.length === 0 ? (
//         <p>Chưa có món nào được chọn</p>
//       ) : (
//         <table className="order-table">
//           <thead>
//             <tr>
//               <th>Món</th>
//               <th className="quantity-cell">Số lượng</th>
//               <th>Giá</th>
//               <th>Tổng</th>
//               {!shouldHideDeleteColumn && <th>Xóa</th>}
//               {!shouldHideStatusColumn && <th>Trạng thái</th>}
//               {canShowCheckbox && <th>Hoàn thành</th>}
//             </tr>
//           </thead>
//           <tbody>
//             {orderItems.map(item => (
//               <tr key={item.id}>
//                 <td>{item.name}</td>
//                 <td className="quantity-cell">
//                   <button
//                     onClick={() =>
//                       setOrderItems(prev =>
//                         prev.map(oi =>
//                           oi.id === item.id
//                             ? { ...oi, quantity: Math.max(1, oi.quantity - 1) }
//                             : oi
//                         )
//                       )
//                     }
//                     disabled={item.is_sent}
//                   >
//                     -
//                   </button>
//                   {item.quantity}
//                   <button
//                     onClick={() =>
//                       setOrderItems(prev =>
//                         prev.map(oi =>
//                           oi.id === item.id
//                             ? { ...oi, quantity: oi.quantity + 1 }
//                             : oi
//                         )
//                       )
//                     }
//                     disabled={item.is_sent}
//                   >
//                     +
//                   </button>
//                 </td>
//                 <td>{item.price?.toLocaleString('vi-VN')}₫</td>
//                 <td>{(item.price * item.quantity).toLocaleString('vi-VN')}₫</td>
//                 {!shouldHideDeleteColumn && (
//                   <td>
//                     <button
//                       onClick={() => handleDeleteItem(item)}
//                       style={{
//                         backgroundColor: 'red',
//                         color: 'white',
//                         border: 'none',
//                         borderRadius: '3px',
//                         cursor: 'pointer',
//                       }}
//                       disabled={item.is_sent && item.kitchen_status !== 'đang chờ'}
//                     >
//                       X
//                     </button>
//                   </td>
//                 )}
//                 {!shouldHideStatusColumn && (
//                   <td>
//                     {!item.is_ready && (
//                       <>
//                         {item.kitchen_status === 'đang chờ' && (
//                           <span style={{ color: '#d97706' }}>🕒 Đang chờ</span>
//                         )}
//                         {['đang làm', 'xác nhận làm'].includes(item.kitchen_status) && (
//                           <span style={{ color: '#2563eb' }}>👨‍🍳 Đang làm</span>
//                         )}
//                         {item.kitchen_status === 'đã làm xong' && (
//                           <span style={{ color: '#16a34a' }}>✅ Đã xong</span>
//                         )}
//                       </>
//                     )}
//                   </td>
//                 )}
//                 {canShowCheckbox && (
//                   <td>
//                     {item.is_sent && item.kitchen_status === 'đã làm xong' ? (
//                       <input
//                         type="checkbox"
//                         checked={item.is_ready}
//                         onChange={() => toggleServedStatus(item.id)}
//                         className="checkbox"
//                       />
//                     ) : (
//                       '-'
//                     )}
//                   </td>
//                 )}
//               </tr>
//             ))}
//             <tr>
//               <td
//                 colSpan={
//                   4 +
//                   (!shouldHideDeleteColumn ? 1 : 0) +
//                   (!shouldHideStatusColumn ? 1 : 0) +
//                   (canShowCheckbox ? 1 : 0)
//                 }
//                 style={{
//                   textAlign: 'right',
//                   fontWeight: 'bold',
//                 }}
//               >
//                 Tổng cộng:
//               </td>
//               <td style={{ fontWeight: 'bold' }}>
//                 {totalAmount.toLocaleString('vi-VN')}₫
//               </td>
//             </tr>
//           </tbody>
//         </table>
//       )}

//       {newItemsToSend.length > 0 && (
//         <div style={{ marginTop: '16px' }}>
//           <button
//             onClick={handleSendOrderToKitchen}
//             className="send-kitchen-button"
//           >
//             Gửi bếp ({newItemsToSend.length} món mới)
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OrderSummary;
import React from 'react';
import axios from 'axios';

const OrderSummary = ({
  orderItems,
  setOrderItems,
  handleSendOrderToKitchen,
  toggleServedStatus,
  selectedTable
}) => {
  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const canShowCheckbox = ['chờ lên món', 'đã lên hết món'].includes(selectedTable.status);
  const newItemsToSend = orderItems.filter(item => !item.is_sent);

  const shouldHideStatusColumn = orderItems.length > 0 && orderItems.every(item => item.is_ready);
  const shouldHideDeleteColumn = orderItems.length > 0 && orderItems.every(item => item.is_ready);

  const handleDeleteItem = (item) => {
    if (!window.confirm(`Bạn có chắc muốn xóa món "${item.name}" không?`)) return;

    axios.delete(`http://localhost:8000/api/order-details/${item.id}`)
      .then(() => {
        setOrderItems(prev => prev.filter(oi => oi.id !== item.id));
      })
      .catch(() => {
        alert('Xóa món thất bại. Vui lòng thử lại.');
      });
  };

  return (
    <div>
      <style>{`
        .order-table {
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
          border-collapse: separate;
          border-spacing: 0;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          background-color: #FBF9F0;
          border: 1px solid #A3B4C4;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 10px rgba(85,107,47,0.15);
        }

        .order-table th {
          background-color: #556B2F;
          color: #fff;
          padding: 14px 16px;
          font-size: 16px;
          font-weight: 700;
          text-align: left;
          user-select: none;
        }

        .order-table td {
          padding: 12px 16px;
          border-bottom: 1px solid #D9E2D1;
          color: #2E3A21;
          font-size: 15px;
        }

        .order-table tr:last-child td {
          border-bottom: none;
        }

        .quantity-cell {
          width: 160px;
          text-align: center;
          font-size: 18px;
          font-weight: 600;
        }

        .quantity-cell button {
          width: 36px;
          height: 36px;
          font-size: 20px;
          padding: 0;
          margin: 0 8px;
          border-radius: 8px;
          background-color: #556B2F;
          color: white;
          border: none;
          cursor: pointer;
          transition: background-color 0.25s ease;
          user-select: none;
        }

        .quantity-cell button:hover:enabled {
          background-color: #738E3F;
        }

        .quantity-cell button:disabled {
          background-color: #A0A080;
          cursor: not-allowed;
        }

        .order-table td button {
          background-color: #556B2F;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 6px 14px;
          font-weight: 600;
          font-size: 14px;
          transition: background-color 0.25s ease;
          cursor: pointer;
          user-select: none;
        }

        .order-table td button:hover {
          background-color: #738E3F;
        }

        .order-table td button:disabled {
          background-color: #A0A080;
          cursor: not-allowed;
        }

        .send-kitchen-button {
          margin: 24px auto 0;
          display: block;
          padding: 14px 28px;
          background-color: #556B2F;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 18px;
          font-weight: 700;
          box-shadow: 0 6px 12px rgba(85,107,47,0.25);
          transition: background-color 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
          user-select: none;
        }

        .send-kitchen-button:hover {
          background-color: #738E3F;
          box-shadow: 0 8px 18px rgba(85,107,47,0.35);
        }

        .checkbox {
          width: 22px;
          height: 22px;
          border: 2.5px solid #556B2F;
          border-radius: 50%;
          appearance: none;
          cursor: pointer;
          transition: background-color 0.25s ease, border-color 0.25s ease;
          vertical-align: middle;
        }

        .checkbox:checked {
          background-color: #A3B4C4;
          border-color: #40513B;
        }

        /* Scroll horizontal on small screens */
        @media (max-width: 720px) {
          .order-table {
            display: block;
            overflow-x: auto;
            white-space: nowrap;
          }
        }
      `}</style>

      <h4 style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", color: '#556B2F' }}>Đơn hàng</h4>

      {orderItems.length === 0 ? (
        <p style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", color: '#556B2F' }}>Chưa có món nào được chọn</p>
      ) : (
        <table className="order-table" cellSpacing="0" cellPadding="0">
          <thead>
            <tr>
              <th>Món</th>
              <th className="quantity-cell">Số lượng</th>
              <th>Giá</th>
              <th>Tổng</th>
              {!shouldHideDeleteColumn && <th>Xóa</th>}
              {!shouldHideStatusColumn && <th>Trạng thái</th>}
              {canShowCheckbox && <th>Hoàn thành</th>}
            </tr>
          </thead>
          <tbody>
            {orderItems.map(item => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td className="quantity-cell">
                  <button
                    onClick={() =>
                      setOrderItems(prev =>
                        prev.map(oi =>
                          oi.id === item.id
                            ? { ...oi, quantity: Math.max(1, oi.quantity - 1) }
                            : oi
                        )
                      )
                    }
                    disabled={item.is_sent}
                    aria-label={`Giảm số lượng món ${item.name}`}
                  >
                    −
                  </button>
                  {item.quantity}
                  <button
                    onClick={() =>
                      setOrderItems(prev =>
                        prev.map(oi =>
                          oi.id === item.id
                            ? { ...oi, quantity: oi.quantity + 1 }
                            : oi
                        )
                      )
                    }
                    disabled={item.is_sent}
                    aria-label={`Tăng số lượng món ${item.name}`}
                  >
                    +
                  </button>
                </td>
                <td>{item.price?.toLocaleString('vi-VN')}₫</td>
                <td>{(item.price * item.quantity).toLocaleString('vi-VN')}₫</td>
                {!shouldHideDeleteColumn && (
                  <td>
                    <button
                      onClick={() => handleDeleteItem(item)}
                      style={{
                        backgroundColor: '#B71C1C',
                        color: 'white',
                        borderRadius: '6px',
                        fontWeight: '700',
                      }}
                      disabled={item.is_sent && item.kitchen_status !== 'đang chờ'}
                      aria-label={`Xóa món ${item.name}`}
                    >
                      X
                    </button>
                  </td>
                )}
                {!shouldHideStatusColumn && (
                  <td style={{ fontWeight: '600' }}>
                    {!item.is_ready && (
                      <>
                        {item.kitchen_status === 'đang chờ' && (
                          <span style={{ color: '#d97706' }}>🕒 Đang chờ</span>
                        )}
                        {['đang làm', 'xác nhận làm'].includes(item.kitchen_status) && (
                          <span style={{ color: '#2563eb' }}>👨‍🍳 Đang làm</span>
                        )}
                        {item.kitchen_status === 'đã làm xong' && (
                          <span style={{ color: '#16a34a' }}>✅ Đã xong</span>
                        )}
                      </>
                    )}
                  </td>
                )}
                {canShowCheckbox && (
                  <td>
                    {item.is_sent && item.kitchen_status === 'đã làm xong' ? (
                      <input
                        type="checkbox"
                        checked={item.is_ready}
                        onChange={() => toggleServedStatus(item.id)}
                        className="checkbox"
                        aria-label={`Đánh dấu món ${item.name} đã hoàn thành`}
                      />
                    ) : (
                      '-'
                    )}
                  </td>
                )}
              </tr>
            ))}
            <tr>
              <td
                colSpan="3" style={{ textAlign: 'right', fontWeight: 'bold' }}>Tổng cộng:</td>
              <td style={{ fontWeight: 'bold' }}>{totalAmount.toLocaleString('vi-VN')}₫</td>
            </tr>
          </tbody>
        </table>
      )}
      {canShowCheckbox && newItemsToSend.length > 0 && (
        <button className="send-kitchen-button" onClick={handleSendOrderToKitchen}>
          Gửi món mới đến bếp
        </button>
      )}
      {newItemsToSend.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <button
            onClick={handleSendOrderToKitchen}
            className="send-kitchen-button"
          >
            Gửi bếp ({newItemsToSend.length} món mới)
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;