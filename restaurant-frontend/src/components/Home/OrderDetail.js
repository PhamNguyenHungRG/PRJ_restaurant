import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrderDetail = ({ table }) => {
    const [order, setOrder] = useState(null);

    useEffect(() => {
        // Gọi API để lấy đơn hàng hiện tại theo table_id
        axios.get(`/api/orders/by-table/${table.id}`)
            .then(res => setOrder(res.data))
            .catch(() => setOrder(null));
    }, [table.id]);

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Bàn {table.table_number} - {table.status}</h2>
            {order ? (
                <div>
                    <p><strong>Số khách:</strong> {order.people}</p>
                    <ul className="mt-4 space-y-2">
                        {order.order_details.map(item => (
                            <li key={item.id} className="border p-2 rounded">
                                🍽 {item.food.name} × {item.quantity} – Trạng thái: {item.kitchen_status}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p className="text-gray-500">Chưa có đơn hàng nào cho bàn này.</p>
            )}
        </div>
    );
};

export default OrderDetail;
