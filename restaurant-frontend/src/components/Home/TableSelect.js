import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

const TableSelect = ({
    setNewTableId,
    newTableId,
    setSelectedTable,
    setOrderItems,
    orderItems,
    setShowChangeTableModal,
    selectedTable,
    fetchTables
}) => {
    const [availableTables, setAvailableTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        axios.get('http://localhost:8000/api/tables/available')
            .then(response => {
                setAvailableTables(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Lỗi khi lấy danh sách bàn:', error);
                setError('Không thể lấy danh sách bàn. Vui lòng thử lại.');
                setLoading(false);
            });
    }, []);

    const handleChangeTable = async () => {
        if (!newTableId) {
            alert('Vui lòng chọn bàn mới!');
            return;
        }

        if (selectedTable.id === newTableId) {
            alert('Bàn mới phải khác bàn hiện tại!');
            return;
        }

        const payload = {
            table_id: newTableId,
            old_table_id: selectedTable.id,
            order_items: orderItems.map(item => ({
                id: item.id,
                order_id: item.order_id,
                table_id: newTableId
            }))
        };

        try {
            await axios.put('http://localhost:8000/api/orders/change-table', payload);

            // Cập nhật lại thông tin bàn mới
            const resTable = await axios.get(`http://localhost:8000/api/tables/${newTableId}`);
            setSelectedTable(resTable.data);

            // Lấy lại đơn hàng theo bàn mới
            const resOrders = await axios.get(`http://localhost:8000/api/orders/by-table?table_id=${newTableId}`);
            setOrderItems(resOrders.data);

            // Cập nhật màu sắc bàn
            fetchTables();

            // Cập nhật URL
            const newParams = new URLSearchParams(searchParams);
            newParams.set('table_id', newTableId);
            setSearchParams(newParams);

            alert('Đơn hàng đã được chuyển sang bàn mới');
            setNewTableId('');
            setShowChangeTableModal(false);
        } catch (err) {
            console.error('Lỗi khi chuyển bàn:', err.response?.data || err);
            const errorMessage = err.response?.data?.message || err.message || 'Có lỗi xảy ra khi chuyển bàn';
            alert(errorMessage);
        }
    };

    return (
        <div>
            <h4>Chọn bàn mới</h4>
            {loading ? (
                <p>Đang tải danh sách bàn...</p>
            ) : error ? (
                <p className="text-danger">{error}</p>
            ) : availableTables.length === 0 ? (
                <p>Hiện tại không có bàn trống nào.</p>
            ) : (
                <div className="d-flex align-items-center mt-3">
                    <select
                        onChange={e => setNewTableId(e.target.value)}
                        value={newTableId}
                        className="form-select me-2"
                        style={{ width: '160px' }}
                    >
                        <option value="">-- Chọn bàn --</option>
                        {availableTables.map(table => (
                            <option key={table.id} value={table.id}>
                                Bàn {table.table_number}
                            </option>
                        ))}
                    </select>

                    <button className="btn btn-success" onClick={handleChangeTable}>
                        Xác nhận chuyển bàn
                    </button>
                    <button
                        className="btn btn-danger ms-2"
                        onClick={() => setShowChangeTableModal(false)}
                    >
                        Hủy
                    </button>
                </div>
            )}
        </div>
    );
};

export default TableSelect;
