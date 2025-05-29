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
        <div style={{ padding: '20px', display: 'flex', gap: '30px' }}>
            <div style={{flex: 1}}>
                <h2>Trang gọi món cho bàn {tableInfo?.table_number || id}</h2>

                <div style={{
                    marginBottom: '20px',
                    padding: '15px',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    maxWidth: '400px'
                }}>
                    <label>
                        Số người:&nbsp;
                        <input
                            type="number"
                            min="0"
                            max="20"
                            value={people}
                            onChange={handlePeopleChange}
                            style={{width: '60px'}}
                        />
                    </label>
                    <div style={{marginTop: '10px'}}>
                        <button onClick={handleConfirmTable} style={{marginRight: '10px'}}>
                            {confirmed ? 'Cập nhật' : 'Xác nhận bàn'}
                        </button>
                        <button onClick={handleCancelOrder}>Huỷ</button>
                    </div>
                </div>

                <div style={{marginBottom: '20px'}}>
                    <button onClick={() => navigate('/')} style={{background: '#ddd'}}>
                        Quay lại trang đặt bàn
                    </button>
                </div>

            <h3>Menu</h3>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px'}}>
                {menu.map(item => (
                    <div key={item.id} style={{
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        padding: '10px',
                        background: '#f9f9f9'
                    }}>
                        <div><strong>{item.name}</strong></div>
                        <div>{item.price.toLocaleString()} VND</div>
                        <div>{item.category?.name || 'Chưa phân loại'}</div>
                        <div style={{marginTop: '8px', display: 'flex', alignItems: 'center'}}>
                        <button onClick={() => changeQuantity(item.id, -1)}>-</button>
                                <input
                                    type="number"
                                    min="0"
                                    value={quantities[item.id] || 0}
                                    onChange={(e) =>
                                        changeQuantity(item.id, Number(e.target.value) - (quantities[item.id] || 0))
                                    }
                                    style={{ width: '50px', textAlign: 'center', margin: '0 5px' }}
                                />
                                <button onClick={() => changeQuantity(item.id, 1)}>+</button>
                            </div>
                            <button style={{ marginTop: '10px', width: '100%' }} onClick={() => handleOrderFood(item)}>Gọi món</button>
                        </div>
                    ))}
                </div>

                {message && (
                    <div style={{ marginTop: '20px', color: 'green' }}>
                        <strong>{message}</strong>
                    </div>
                )}

            </div>

            <div style={{
                width: '300px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '15px',
                background: '#fff'
            }}>
                <h3>Hóa đơn tạm tính</h3>
                {orderedItems.length === 0 ? (
                    <p>Chưa có món nào được gọi.</p>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {orderedItems.map((item, index) => (
                            <li key={index} style={{ marginBottom: '10px' }}>
                                {item.name} x {item.quantity} = {(item.price * item.quantity).toLocaleString()} VND
                                {item.sent && item.kitchen_status === 'xác nhận làm' && (
                                    <div>
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={item.kitchen_status === 'đã làm xong'}
                                                onChange={() => toggleDone(index)}
                                            />
                                            &nbsp;Đã làm xong
                                        </label>
                                    </div>
                                )}
                                {item.kitchen_status === 'đã làm xong' && (
                                    <div style={{ color: 'green', fontWeight: 'bold' }}>Hoàn tất</div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
                <div style={{ marginTop: '10px' }}>
                    <strong>Tổng tiền:</strong> {calculateTotal().toLocaleString()} VND
                </div>

                {orderedItems.length > 0 && (
                    <>
                        <button onClick={handleSendToKitchen} style={{ marginTop: '15px', width: '100%' }}>
                            Gửi món mới sang bếp
                        </button>
                        <button onClick={handlePaymentComplete} style={{ marginTop: '10px', width: '100%', backgroundColor: 'green', color: 'white' }}>
                            Thanh toán hoàn tất
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default OrderPage;