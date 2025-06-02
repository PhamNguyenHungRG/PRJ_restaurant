import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const OrderPage = () => {
    const { id } = useParams(); // ID bàn
    const navigate = useNavigate();

    const [tableInfo, setTableInfo] = useState(null);
    const [people, setPeople] = useState(0);
    const [confirmed, setConfirmed] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [menu, setMenu] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [orderedItems, setOrderedItems] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!orderId) return;

        const interval = setInterval(() => {
            axios.get(`http://localhost:8000/api/orders/${orderId}`)
                .then(res => {
                    const serverItems = res.data.items || [];

                    const updated = serverItems.map(serverItem => {
                        const localItem = orderedItems.find(item => item.id === serverItem.food_id);
                        return {
                            ...localItem,
                            sent: true,
                            kitchen_status: serverItem.kitchen_status || 'xác nhận làm'
                        };
                    });

                    setOrderedItems(updated);
                    localStorage.setItem(`order_${id}_orderedItems`, JSON.stringify(updated));

                    // Nếu tất cả món đã gửi đều có trạng thái 'đã làm xong' thì cập nhật trạng thái bàn
                    const sentItems = updated.filter(item => item.sent);
                    const allDone = sentItems.length > 0 && sentItems.every(item => item.kitchen_status === 'đã làm xong');

                    const stored = JSON.parse(localStorage.getItem('orderedTables') || '{}');
                    if (allDone) {
                        stored[id] = 'đã lên món'; // xanh lá
                    } else {
                        stored[id] = 'đã gửi bếp'; // xanh dương
                    }
                    localStorage.setItem('orderedTables', JSON.stringify(stored));
                    setTableInfo({ ...tableInfo, status: stored[id] });

                })
                .catch(err => {
                    console.error('Lỗi khi cập nhật trạng thái món:', err);
                });
        }, 5000); // 5s kiểm tra 1 lần

        return () => clearInterval(interval);
    }, [orderId, orderedItems.length]);
    // Tải dữ liệu ban đầu
    useEffect(() => {
        axios.get(`http://localhost:8000/api/tables/${id}`)
            .then(res => setTableInfo(res.data))
            .catch(err => console.error(err));

        axios.get('http://localhost:8000/api/foods')
            .then(res => setMenu(res.data))
            .catch(err => console.error('Lỗi khi tải menu:', err));

        const storedPeople = localStorage.getItem(`order_${id}_people`);
        const storedConfirmed = localStorage.getItem(`order_${id}_confirmed`);
        const storedOrderId = localStorage.getItem(`order_${id}_orderId`);
        const storedOrderedItems = JSON.parse(localStorage.getItem(`order_${id}_orderedItems`) || '[]');

        if (storedPeople) setPeople(Number(storedPeople));
        if (storedConfirmed === 'true') setConfirmed(true);
        if (storedOrderId) setOrderId(Number(storedOrderId));
        if (storedOrderedItems.length > 0) setOrderedItems(storedOrderedItems);
    }, [id]);

    const getKey = () => `order_${id}`;

    const handlePeopleChange = (e) => {
        const value = parseInt(e.target.value);
        if (isNaN(value) || value < 1) return;
        setPeople(value);

        // Lưu vào localStorage
        localStorage.setItem(`order_${id}_people`, value);

        // Cập nhật trạng thái "đang order"
        const stored = JSON.parse(localStorage.getItem('orderedTables') || '{}');
        stored[id] = 'đang order';
        localStorage.setItem('orderedTables', JSON.stringify(stored));
    };

    const handleConfirmTable = () => {
        if (people <= 0) {
            setMessage('Vui lòng nhập số người lớn hơn 0.');
            return;
        }

        if (!confirmed) {
            // Lần đầu xác nhận bàn - gọi API tạo đơn hàng
            axios.post('http://localhost:8000/api/orders', { table_id: id })
                .then(res => {
                    const newOrderId = res.data.id;
                    setConfirmed(true);
                    setOrderId(newOrderId);
                    setMessage(`Đã xác nhận bàn ${tableInfo?.table_number || id} có ${people} người.`);

                    // Lưu dữ liệu vào localStorage
                    localStorage.setItem(`order_${id}_people`, people);
                    localStorage.setItem(`order_${id}_confirmed`, true);
                    localStorage.setItem(`order_${id}_orderId`, newOrderId);

                    // Cập nhật trạng thái bàn
                    const stored = JSON.parse(localStorage.getItem('orderedTables') || '{}');
                    stored[id] = 'đang order';
                    localStorage.setItem('orderedTables', JSON.stringify(stored));
                })
                .catch(err => {
                    console.error(err);
                    setMessage('Lỗi khi xác nhận bàn.');
                });
        } else {
            // Không gọi API nữa, chỉ lưu local
            setMessage(`Đã cập nhật số người cho bàn ${tableInfo?.table_number || id} là ${people}.`);
            localStorage.setItem(`order_${id}_people`, people);
        }
    };


    const handleCancelOrder = () => {
        setPeople(0);
        setConfirmed(false);
        setOrderId(null);
        setOrderedItems([]);
        setQuantities({});

        // Xoá dữ liệu order khỏi localStorage
        localStorage.removeItem(`order_${id}_people`);
        localStorage.removeItem(`order_${id}_confirmed`);
        localStorage.removeItem(`order_${id}_orderId`);
        localStorage.removeItem(`order_${id}_orderedItems`);

        // Xoá trạng thái bàn khỏi orderedTables
        const stored = JSON.parse(localStorage.getItem('orderedTables') || '{}');
        delete stored[id];
        localStorage.setItem('orderedTables', JSON.stringify(stored));

        navigate('/');
    };
    const changeQuantity = (foodId, delta) => {
        const current = quantities[foodId] || 0;
        const newQuantity = Math.max(0, current + delta);
        setQuantities({ ...quantities, [foodId]: newQuantity });
    };

    const handleOrderFood = (item) => {
        const quantity = quantities[item.id];
        if (!orderId || quantity <= 0) {
            setMessage('Vui lòng xác nhận bàn và chọn số lượng hợp lệ.');
            return;
        }

        axios.post(`http://localhost:8000/api/orders/${orderId}/add-food`, {
            food_id: item.id,
            quantity: quantity
        })
            .then(() => {
                const newItem = {
                    ...item,
                    quantity,
                    sent: false,
                    kitchen_status: 'xác nhận làm'
                };
                const updatedList = [...orderedItems, newItem];
                setOrderedItems(updatedList);
                localStorage.setItem(`order_${id}_orderedItems`, JSON.stringify(updatedList));
                setQuantities({ ...quantities, [item.id]: 0 });
                setMessage(`Đã gọi thêm món ${item.name} (${quantity} phần).`);
            })
            .catch(err => {
                console.error(err);
                setMessage('Lỗi khi gọi món.');
            });
    };
    const handlePaymentComplete = () => {
        setPeople(0);
        setConfirmed(false);
        setOrderId(null);
        setOrderedItems([]);
        setQuantities({});

        // Xoá dữ liệu order khỏi localStorage
        localStorage.removeItem(`order_${id}_people`);
        localStorage.removeItem(`order_${id}_confirmed`);
        localStorage.removeItem(`order_${id}_orderId`);
        localStorage.removeItem(`order_${id}_orderedItems`);

        // Xoá trạng thái bàn khỏi orderedTables
        const stored = JSON.parse(localStorage.getItem('orderedTables') || '{}');
        delete stored[id];
        localStorage.setItem('orderedTables', JSON.stringify(stored));

        navigate('/');
    };


    const handleSendToKitchen = () => {
        if (!orderId) {
            setMessage('Không tìm thấy đơn hàng.');
            return;
        }

        const itemsToSend = orderedItems.filter(item => !item.sent);

        if (itemsToSend.length === 0) {
            setMessage('Không có món mới để gửi.');
            return;
        }

        axios.post(`http://localhost:8000/api/orders/${orderId}/send-to-kitchen`, {
            items: itemsToSend.map(item => ({
                food_id: item.id,
                quantity: item.quantity
            }))
        })
            .then(() => {
                const updated = orderedItems.map(item =>
                    item.sent ? item : { ...item, sent: true }
                );
                setOrderedItems(updated);
                localStorage.setItem(`order_${id}_orderedItems`, JSON.stringify(updated));
                setMessage('Đã gửi món mới sang bếp.');

                // Cập nhật trạng thái bàn trong localStorage
                const stored = JSON.parse(localStorage.getItem('orderedTables') || '{}');
                stored[id] = 'đã gửi bếp';
                localStorage.setItem('orderedTables', JSON.stringify(stored));
            })
            .catch(err => {
                console.error(err);
                setMessage('Lỗi khi gửi món.');
            });
    };


    const toggleDone = (index) => {
        const items = [...orderedItems];
        const item = items[index];

        if (item.kitchen_status === 'đã làm xong') {
            item.kitchen_status = 'xác nhận làm';
        } else {
            item.kitchen_status = 'đã làm xong';

            // Gộp vào món cũ nếu đã có cùng id, đã làm xong, sent: true
            const existingIndex = items.findIndex((it, i) =>
                i !== index &&
                it.id === item.id &&
                it.sent &&
                it.kitchen_status === 'đã làm xong'
            );

            if (existingIndex !== -1) {
                items[existingIndex].quantity += item.quantity;
                items.splice(index, 1);
            }
        }

        setOrderedItems(items);
        localStorage.setItem(`order_${id}_orderedItems`, JSON.stringify(items));

        // Kiểm tra các món đã gửi (sent: true)
        const sentItems = items.filter(item => item.sent);
        const allDone = sentItems.length > 0 && sentItems.every(item => item.kitchen_status === 'đã làm xong');

        const stored = JSON.parse(localStorage.getItem('orderedTables') || '{}');

        // Cập nhật trạng thái bàn trong localStorage
        if (allDone) {
            stored[id] = 'đã làm xong';  // Đổi trạng thái bàn sang "đã hoàn thành" (màu xanh lá)
        } else {
            stored[id] = 'đang order';     // Giữ trạng thái bàn là "đang order"
        }

        // Lưu lại trạng thái mới và trigger lại render bằng cách cập nhật lại localStorage
        localStorage.setItem('orderedTables', JSON.stringify(stored));

        // Gọi một phương thức để buộc giao diện cập nhật lại, ví dụ: setState
        // Đảm bảo rằng trạng thái bàn được cập nhật đúng cách
        setTableInfo({ ...tableInfo, status: stored[id] });
    };
    const calculateTotal = () => {
        return orderedItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };


    return (
        <div style={{
            maxWidth: 1200,
            margin: '20px auto',
            padding: 20,
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            color: '#333',
        }}>
            <header style={{ marginBottom: 30, textAlign: 'center' }}>
                <h1 style={{ fontWeight: '700', fontSize: '2rem', color: '#2c3e50' }}>
                    Gọi món cho bàn <span style={{ color: '#e67e22' }}>{tableInfo?.table_number || id}</span>
                </h1>
                <p style={{ fontSize: '1rem', color: '#7f8c8d' }}>
                    Trạng thái bàn:
                    <span style={{
                        fontWeight: '600',
                        marginLeft: 8,
                        color:
                            tableInfo?.status === 'đã làm xong' ? '#27ae60' :
                                tableInfo?.status === 'đã gửi bếp' ? '#2980b9' :
                                    tableInfo?.status === 'đang order' ? '#f39c12' : '#95a5a6'
                    }}>
                        {tableInfo?.status || 'Chưa có trạng thái'}
                    </span>
                </p>
            </header>

            <section style={{
                display: 'flex',
                gap: 40,
                flexWrap: 'wrap',
                justifyContent: 'space-between'
            }}>
                {/* Xác nhận số người */}
                <div style={{
                    flex: '1 1 320px',
                    background: '#fff',
                    padding: 24,
                    borderRadius: 12,
                    boxShadow: '0 4px 12px rgb(0 0 0 / 0.1)'
                }}>
                    <label style={{ display: 'block', marginBottom: 12, fontWeight: 600 }}>
                        Số người
                        <input
                            type="number"
                            min="1"
                            max="20"
                            value={people}
                            onChange={handlePeopleChange}
                            style={{
                                display: 'block',
                                marginTop: 6,
                                padding: '8px 12px',
                                fontSize: 16,
                                borderRadius: 6,
                                border: '1.5px solid #bdc3c7',
                                width: 100
                            }}
                        />
                    </label>

                    <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
                        <button
                            onClick={handleConfirmTable}
                            style={{
                                flex: 1,
                                padding: '10px 0',
                                backgroundColor: confirmed ? '#27ae60' : '#2980b9',
                                border: 'none',
                                borderRadius: 8,
                                color: '#fff',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s'
                            }}
                        >
                            {confirmed ? 'Cập nhật' : 'Xác nhận bàn'}
                        </button>
                        <button
                            onClick={handleCancelOrder}
                            style={{
                                flex: 1,
                                padding: '10px 0',
                                backgroundColor: '#c0392b',
                                border: 'none',
                                borderRadius: 8,
                                color: '#fff',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s'
                            }}
                        >
                            Huỷ
                        </button>
                    </div>

                    <button
                        onClick={() => navigate('/')}
                        style={{
                            marginTop: 24,
                            width: '100%',
                            padding: '10px 0',
                            backgroundColor: '#95a5a6',
                            border: 'none',
                            borderRadius: 8,
                            color: '#fff',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        Quay lại trang đặt bàn
                    </button>

                    {message && (
                        <div style={{
                            marginTop: 16,
                            backgroundColor: '#fdecea',
                            color: '#e74c3c',
                            padding: 12,
                            borderRadius: 6,
                            fontWeight: '600',
                            fontSize: 14
                        }}>
                            {message}
                        </div>
                    )}
                </div>

                {/* Danh sách món */}
                <div style={{
                    flex: '2 1 600px',
                    background: '#fff',
                    padding: 24,
                    borderRadius: 12,
                    boxShadow: '0 4px 12px rgb(0 0 0 / 0.1)',
                    maxHeight: '80vh',
                    overflowY: 'auto'
                }}>
                    <h2 style={{ marginBottom: 20, fontWeight: '700', color: '#34495e' }}>Menu</h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                        gap: 20
                    }}>
                        {menu.map(item => (
                            <div key={item.id} style={{
                                border: '1px solid #ddd',
                                borderRadius: 12,
                                padding: 16,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                backgroundColor: '#fafafa',
                                boxShadow: '0 1px 3px rgb(0 0 0 / 0.1)'
                            }}>
                                <div>
                                    <h3 style={{ margin: '0 0 8px', fontWeight: 600 }}>{item.name}</h3>
                                    <p style={{ margin: '0 0 6px', color: '#7f8c8d' }}>
                                        {item.category?.name || 'Chưa phân loại'}
                                    </p>
                                    <p style={{ margin: 0, fontWeight: '700', color: '#e67e22' }}>
                                        {item.price.toLocaleString()} VND
                                    </p>
                                </div>

                                <div style={{
                                    marginTop: 12,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    justifyContent: 'space-between'
                                }}>
                                    <button
                                        onClick={() => changeQuantity(item.id, -1)}
                                        disabled={!quantities[item.id]}
                                        style={{
                                            border: 'none',
                                            backgroundColor: '#ecf0f1',
                                            padding: '6px 10px',
                                            borderRadius: 6,
                                            fontWeight: '700',
                                            cursor: quantities[item.id] ? 'pointer' : 'not-allowed',
                                        }}
                                    >
                                        –
                                    </button>
                                    <input
                                        type="number"
                                        min="0"
                                        value={quantities[item.id] || 0}
                                        onChange={e => setQuantities({
                                            ...quantities,
                                            [item.id]: Math.max(0, Number(e.target.value))
                                        })}
                                        style={{
                                            width: 50,
                                            textAlign: 'center',
                                            fontSize: 16,
                                            borderRadius: 6,
                                            border: '1px solid #bdc3c7'
                                        }}
                                    />
                                    <button
                                        onClick={() => changeQuantity(item.id, 1)}
                                        style={{
                                            border: 'none',
                                            backgroundColor: '#ecf0f1',
                                            padding: '6px 10px',
                                            borderRadius: 6,
                                            fontWeight: '700',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        +
                                    </button>
                                    <button
                                        onClick={() => handleOrderFood(item)}
                                        disabled={!quantities[item.id] || quantities[item.id] <= 0 || !confirmed}
                                        style={{
                                            backgroundColor: '#2980b9',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: 8,
                                            padding: '8px 14px',
                                            cursor: (!quantities[item.id] || quantities[item.id] <= 0 || !confirmed) ? 'not-allowed' : 'pointer',
                                            fontWeight: '600',
                                            transition: 'background-color 0.3s',
                                        }}
                                    >
                                        Gọi món
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Đơn đã gọi */}
            <section style={{
                marginTop: 40,
                background: '#fff',
                padding: 24,
                borderRadius: 12,
                boxShadow: '0 4px 12px rgb(0 0 0 / 0.1)',
                maxWidth: 920,
                marginLeft: 'auto',
                marginRight: 'auto'
            }}>
                <h2 style={{ marginBottom: 20, fontWeight: '700', color: '#34495e' }}>Danh sách món đã gọi</h2>

                {orderedItems.length === 0 ? (
                    <p style={{ color: '#7f8c8d' }}>Chưa có món nào được gọi.</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #ecf0f1' }}>
                                <th style={{ textAlign: 'left', padding: '10px 0' }}>Tên món</th>
                                <th style={{ textAlign: 'center', padding: '10px 0' }}>Số lượng</th>
                                <th style={{ textAlign: 'right', padding: '10px 0' }}>Tổng tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderedItems.map(item => (
                                <tr key={item.id} style={{ borderBottom: '1px solid #ecf0f1' }}>
                                    <td style={{ padding: '8px 0' }}>{item.name}</td>
                                    <td style={{ textAlign: 'center', padding: '8px 0' }}>{item.quantity}</td>
                                    <td style={{ textAlign: 'right', padding: '8px 0' }}>
                                        {(item.price * item.quantity).toLocaleString()} VND
                                    </td>
                                </tr>
                            ))}
                            <tr style={{ borderTop: '2px solid #bdc3c7', fontWeight: '700' }}>
                                <td colSpan="2" style={{ padding: '10px 0' }}>Tổng cộng</td>
                                <td style={{ textAlign: 'right', padding: '10px 0' }}>
                                    {orderedItems.reduce((sum, i) => sum + i.price * i.quantity, 0).toLocaleString()} VND
                                </td>
                            </tr>
                        </tbody>
                    </table>
                )}
            </section>
        </div>
    );
}
export default OrderPage;