
import React, { useEffect, useState } from 'react';
import axios from 'axios';


const KitchenView = () => {
    const [ordersByBill, setOrdersByBill] = useState([]);
    const [warningOrders, setWarningOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 30000); // cập nhật mỗi 30s
        return () => clearInterval(interval);
    }, []);


    const fetchOrders = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/orders/pending');
            const now = new Date();

            // 1. Lọc ra những món cần cảnh báo (chờ hơn 15 phút)
            const warningList = res.data.filter(order => {
                const orderTime = new Date(order.created_at);
                return (now - orderTime) / 60000 > 15;
            });
            setWarningOrders(warningList);

            // 2. Gom nhóm từng đơn theo order_id
            const grouped = res.data.reduce((acc, order) => {
                if (!acc[order.order_id]) acc[order.order_id] = [];
                acc[order.order_id].push(order);
                return acc;
            }, {});

            // 3. Chuyển thành mảng và loại bỏ các đơn mà tất cả món đã làm xong
            const filteredGroups = Object.values(grouped).filter(group => {
                // Chỉ giữ lại những group có ít nhất 1 món chưa xong
                return group.some(item => item.kitchen_status !== 'đã làm xong');
            });

            // 4. Sắp xếp các hóa đơn theo thời gian order (món đầu tiên của mỗi hóa đơn)
            const sortedGroups = filteredGroups.sort((a, b) => {
                return new Date(a[0].created_at) - new Date(b[0].created_at);
            });

            // setOrdersByBill(sortedGroups);
            setOrdersByBill(res.data);

        } catch (error) {
            console.error("Lỗi khi tải đơn hàng:", error.response?.data || error.message);
        }
    };


    const markAsDone = async (id) => {
        try {
            await axios.post(`http://localhost:8000/api/orders/complete/${id}`);
            fetchOrders();
        } catch (error) {
            console.error("Lỗi khi đánh dấu hoàn tất:", error.response?.data || error.message);
        }
    };

    const startCooking = async (id) => {
        try {
            await axios.post(`http://localhost:8000/api/orders/startcooking/${id}`);
            fetchOrders(); // Cập nhật lại danh sách sau khi thay đổi
        } catch (error) {
            console.error("Lỗi khi xác nhận nấu:", error.response?.data || error.message);
        }
    };


  const styles = {
        container: {
            backgroundColor: '#1a1a2e',
            color: '#f5f5f5',
            minHeight: '100vh',
            padding: '30px',
            fontFamily: "'Segoe UI', sans-serif"
        },
        card: {
            backgroundColor: '#16213e',
            border: '1px solid #0f3460',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
        },
        table: {
            backgroundColor: '#0f3460',
            color: '#f5f5f5',
            borderRadius: '10px',
            overflow: 'hidden'
        },
        header: {
            borderBottom: '1px solid #e0e0e0',
            marginBottom: '10px'
        },
        warningAlert: {
            backgroundColor: '#ffc107',
            color: '#212529',
            border: 'none',
            borderRadius: '10px'
        },
        infoAlert: {
            backgroundColor: '#0f3460',
            color: '#ffffff',
            textAlign: 'center',
            borderRadius: '10px',
            padding: '15px'
        }
    };

    return (
        <div style={styles.container}>
            <h2 className="mb-4 text-center">👨‍🍳 <span style={{ color: '#f8f9fa' }}>Món Ăn Cần Chuẩn Bị</span></h2>

            {warningOrders.length > 0 && (
                <div className="alert" style={styles.warningAlert}>
                    <strong>⚠️ Cảnh báo:</strong> Có {warningOrders.length} món chờ quá 15 phút!
                </div>
            )}

            {ordersByBill.length === 0 ? (
                <div style={styles.infoAlert}>
                    Không có món đang chờ.
                </div>
            ) : (
                ordersByBill.map((orderGroup, index) => (
                    <div key={index} style={styles.card}>
                        <div style={styles.header}>
                            <h5>
                                🧾 Hóa đơn #{orderGroup[0].order_id} | Bàn: {orderGroup[0].table_number} | {new Date(orderGroup[0].created_at).toLocaleTimeString()}
                            </h5>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-striped table-hover" style={styles.table}>
                                <thead className="table-dark">
                                    <tr>
                                        <th>Món ăn</th>
                                        <th>Số lượng</th>
                                        <th>Giờ đặt</th>
                                        <th>Trạng thái</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderGroup.map(item => (
                                        <tr
                                            key={item.detail_id}
                                            className={warningOrders.some(w => w.detail_id === item.detail_id) ? 'table-warning' : ''}
                                        >
                                            <td>{item.food_name}</td>
                                            <td>{item.quantity}</td>
                                            <td>{new Date(item.created_at).toLocaleTimeString()}</td>
                                            <td>{item.kitchen_status}</td>
                                            <td>
                                                {item.kitchen_status === 'đang chờ' && (
                                                    <button className="btn btn-outline-warning btn-sm me-2" onClick={() => startCooking(item.detail_id)}>
                                                        👨‍🍳 Bắt đầu nấu
                                                    </button>
                                                )}
                                                {item.kitchen_status === 'xác nhận làm' && (
                                                    <button className="btn btn-outline-success btn-sm" onClick={() => markAsDone(item.detail_id)}>
                                                        ✅ Hoàn tất
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default KitchenView;