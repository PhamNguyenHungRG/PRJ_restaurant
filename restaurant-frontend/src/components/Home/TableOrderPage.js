import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { Pagination } from '@mui/material';
import Header from '../Header';
import Footer from '../Footer';

import TableSelect from './TableSelect';
import TableList from './TableList';
import AreaSelector from './AreaSelector';
import GroupSelector from './GroupSelector';
import MenuSection from './MenuSection';
import OrderSummary from './OrderSummary';
import TableDetails from './TableDetails';


const TableOrderPage = () => {
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [orderItems, setOrderItems] = useState([]);
    const [notifiedIds, setNotifiedIds] = useState(new Set());
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('Món chính');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const [newTableId, setNewTableId] = useState('');
    const [showChangeTableModal, setShowChangeTableModal] = useState(false);


    const selectedArea = searchParams.get('area');
    const selectedGroup = searchParams.get('group');
    const currentPage = parseInt(searchParams.get('page')) || 1;
    const pageSize = 20;

    const fetchTables = () => {
        axios.get('http://localhost:8000/api/tables')
            .then((res) => setTables(res.data))
            .catch((err) => console.error('Lỗi khi lấy danh sách bàn:', err));
    };
    useEffect(() => {
        const tableId = searchParams.get('table_id');
        if (!tableId) {
            setSelectedTable(null);
            setOrderItems([]);
            setMenuItems([]);
        }
    }, [searchParams]);

    useEffect(() => {
        const tableId = searchParams.get('table_id');
        if (tableId && !selectedTable) {
            axios.get(`http://localhost:8000/api/tables/${tableId}`)
                .then((res) => {
                    const table = res.data;
                    setSelectedTable(table);
                    if (!searchParams.get('area') && table.area?.status) {
                        const newParams = new URLSearchParams(searchParams);
                        newParams.set('area', table.area.status);
                        setSearchParams(newParams);
                    }
                })
                .catch((err) => console.error('Không tìm thấy bàn từ URL:', err));
        }
    }, []);

    useEffect(() => {
        fetchTables();
        axios.get('http://localhost:8000/api/categories')
            .then(res => setCategories(res.data))
            .catch(err => console.error('Lỗi khi lấy categories:', err));
    }, []);

    useEffect(() => {
        if (!selectedTable) return;
        const validStatuses = ['đang order', 'chờ lên món', 'đã lên hết món'];
        if (validStatuses.includes(selectedTable.status)) {
            fetchAllOrderItemsByTable(selectedTable.id);
            fetchMenuItems();
        } else {
            setOrderItems([]);
            setMenuItems([]);
        }
    }, [selectedTable]);

    const fetchMenuItems = () => {
        axios.get('http://localhost:8000/api/foods')
            .then((res) => {
                console.log('Dữ liệu món ăn:', res.data);
                // Nếu là Laravel kiểu `{ data: [...] }` thì phải truy cập vào .data.data
                setMenuItems(Array.isArray(res.data) ? res.data : res.data.data || []);
            })
            .catch((err) => console.error('Lỗi khi lấy món:', err));
    };


    const fetchAllOrderItemsByTable = (tableId) => {
        axios.get(`http://localhost:8000/api/orders/by-table?table_id=${tableId}`)
            .then((res) => {
                console.log('🧪 orderItems:', res.data); // 👈 Thêm dòng này
                setOrderItems(res.data);
            })
            .catch((err) => console.error('Lỗi lấy danh sách món:', err));
    };



    const updateTableStatus = (tableId, newStatus) => {
        axios.put(`http://localhost:8000/api/tables/${tableId}`, { status: newStatus })
            .then(() => {
                setTables(prev => prev.map(t => (t.id === tableId ? { ...t, status: newStatus } : t)));
                if (selectedTable?.id === tableId) {
                    setSelectedTable(prev => ({ ...prev, status: newStatus }));
                }
                if (newStatus === 'đang order') {
                    fetchMenuItems();
                } else {
                    setMenuItems([]);
                }
            })
            .catch((err) => {
                console.error('Lỗi cập nhật trạng thái bàn:', err);
                alert('Cập nhật trạng thái bàn thất bại');
            });
    };

    const handleSendOrderToKitchen = () => {
        if (!selectedTable || orderItems.length === 0) {
            alert('Vui lòng chọn bàn và món ăn trước');
            return;
        }

        const newItems = orderItems.filter(item => !item.is_sent && item.food_id && item.quantity > 0);
        if (newItems.length === 0) {
            alert('Không có món hợp lệ để gửi');
            return;
        }

        const payload = {
            table_id: selectedTable.id,
            items: newItems.map(item => ({
                food_id: item.food_id,
                quantity: item.quantity,
            }))
        };

        axios.post('http://localhost:8000/api/orders', payload)
            .then(() => {
                alert('Gửi bếp thành công!');
                updateTableStatus(selectedTable.id, 'chờ lên món');
                fetchAllOrderItemsByTable(selectedTable.id);
            })
            .catch(err => {
                console.error('Lỗi gửi đơn hàng:', JSON.stringify(err.response?.data || err.message));
                alert('Gửi đơn hàng thất bại!');
            });
    };

    const toggleServedStatus = (orderDetailId) => {
        axios.patch(`http://localhost:8000/api/order-details/${orderDetailId}/toggle-served`)
            .then(() => {
                const updatedOrderItems = orderItems.map(item =>
                    item.id === orderDetailId ? { ...item, is_ready: !item.is_ready } : item
                );
                setOrderItems(updatedOrderItems);

                const allReady = updatedOrderItems
                    .filter(item => item.is_sent)
                    .every(item => item.is_ready);

                if (allReady && selectedTable?.status !== 'đã lên hết món') {
                    updateTableStatus(selectedTable.id, 'đã lên hết món');
                }

                fetchTables();
            })
            .catch(err => {
                console.error('Lỗi cập nhật trạng thái món:', err);
                alert('Cập nhật thất bại');
            });
    };


    const handleSelectArea = (area) => {
        setSearchParams({ area, group: '', page: 1 });
        setSelectedTable(null);
        setMenuItems([]);
        setOrderItems([]);
    };

    const handleSelectGroup = (group) => {
        setSearchParams((prev) => {
            const newParams = new URLSearchParams(prev);
            newParams.set('group', group);
            newParams.set('page', 1);
            return newParams;
        });
        setSelectedTable(null);
        setMenuItems([]);
        setOrderItems([]);
    };

    const filteredTables = selectedArea
        ? tables.filter((table) => table.area?.status === selectedArea)
        : [];

    const groupedTables =
        selectedArea === 'phòng thường'
            ? filteredTables.reduce((groups, table) => {
                const groupKey = table.table_number[0].toUpperCase();
                if (!groups[groupKey]) groups[groupKey] = [];
                groups[groupKey].push(table);
                return groups;
            }, {})
            : { '': filteredTables };

    const tablesToShow =
        selectedArea === 'phòng thường' && selectedGroup
            ? groupedTables[selectedGroup] || []
            : selectedArea === 'phòng riêng'
                ? filteredTables
                : [];

    const totalPages = Math.ceil(tablesToShow.length / pageSize);

    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        setSearchParams((prev) => {
            const newParams = new URLSearchParams(prev);
            newParams.set('page', page);
            return newParams;
        });
    };

    const paginatedTables = tablesToShow.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const isActive = (val) => val === true || val === 1 || val === '1' || val === 'true';

    const activeCategories = categories.filter(c => isActive(c.active));

    const activeMenuItems = menuItems.filter(item => {
        const category = categories.find(c => c.id === item.category_id);
        return isActive(item.active) && category && isActive(category.active);
    });


    // Nhóm món ăn theo danh mục
    const menuGroupedByCategory = activeCategories.reduce((acc, category) => {
        const itemsInCategory = activeMenuItems.filter(item => item.category_id === category.id);
        if (itemsInCategory.length > 0) {
            acc[category.name] = itemsInCategory;
        }
        return acc;
    }, {});

    const startCooking = (orderDetailId) => {
        axios.patch(`http://localhost:8000/api/order-details/${orderDetailId}/start-cooking`)
            .then(() => fetchAllOrderItemsByTable(selectedTable.id))
            .catch(err => {
                console.error('Lỗi cập nhật trạng thái đang làm:', err);
                alert('Không thể chuyển sang đang làm');
            });
    };
    const fetchAllPendingDishes = () => {
        axios.get('http://localhost:8000/api/order-details/pending-ready')
            .then(res => {
                const newItems = res.data.filter(item =>
                    item.kitchen_status === 'đã làm xong' &&
                    !item.is_ready &&
                    !notifiedIds.has(item.id)
                );

                if (newItems.length > 0) {
                    // Gom món theo bàn
                    const grouped = newItems.reduce((acc, item) => {
                        if (!acc[item.table_number]) acc[item.table_number] = [];
                        acc[item.table_number].push(item.name);
                        return acc;
                    }, {});

                    // Tạo thông báo theo từng bàn
                    const messages = Object.entries(grouped).map(([table, items]) =>
                        `Bàn ${table}: ${items.join(', ')}`
                    );

                    alert(`🛎 Món đã xong:\n${messages.join('\n')}`);
                    setNotifiedIds(prev => new Set([...prev, ...newItems.map(i => i.id)]));
                }
            })
            .catch(err => console.error('Lỗi khi kiểm tra món đã xong:', err));
    };
    useEffect(() => {
        const interval = setInterval(fetchAllPendingDishes, 10000); // mỗi 10 giây
        return () => clearInterval(interval); // dọn sạch khi component bị unmount
    }, []);


    return (

        <div style={{ padding: '16px' }}>
            {!selectedTable && (
                <>
                    <Header />
                    <AreaSelector selectedArea={selectedArea} onSelect={handleSelectArea} />

                    {selectedArea === 'phòng thường' && (
                        <GroupSelector
                            groupedTables={groupedTables}
                            selectedGroup={selectedGroup}
                            onSelect={handleSelectGroup}
                        />
                    )}
                </>
            )}

            {!selectedTable ? (
                selectedArea ? (
                    <>
                        <TableList
                            tables={paginatedTables}
                            onSelect={(table) => {
                                const newParams = new URLSearchParams(searchParams);
                                newParams.set('table_id', table.id);
                                if (table.area?.status) newParams.set('area', table.area.status);
                                setSearchParams(newParams);
                                setSelectedTable(table);
                                setOrderItems([]);
                                if (table.status === 'đang order') fetchMenuItems();
                                else setMenuItems([]);
                            }}
                            selectedTable={selectedTable}
                            page={currentPage}
                            pageSize={pageSize}
                        />

                        {totalPages > 1 && (
                            <div className="pagination-container">
                                <Pagination
                                    count={totalPages}
                                    page={currentPage}
                                    onChange={(event, value) => goToPage(value)}
                                    color="primary"
                                    shape="rounded"
                                />
                            </div>

                        )}
                        <Footer />

                    </>
                ) : (
                    <p>Vui lòng chọn khu vực bàn</p>
                )
            ) : (

                <>
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
    <button
        onClick={() => {
            const newParams = new URLSearchParams(searchParams);
            newParams.delete('table_id');
            setSearchParams(newParams);
            setSelectedTable(null);
            setOrderItems([]);
            setMenuItems([]);
        }}
        style={{
            padding: '10px 20px',
            borderRadius: '8px',
            fontSize: '16px',
            fontFamily: 'Segoe UI, sans-serif',
            backgroundColor: '#fff8e1',          // vàng nhạt
            color: '#000',
            border: '1px solid #e0c97f',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
            transition: 'background-color 0.3s, color 0.3s',
        }}
        onMouseEnter={e => {
            e.target.style.backgroundColor = '#f7e6ab';
        }}
        onMouseLeave={e => {
            e.target.style.backgroundColor = '#fff8e1';
        }}
    >
        ← Quay lại danh sách bàn
    </button>

    <button
        onClick={() => setShowChangeTableModal(true)}
        style={{
            padding: '10px 20px',
            borderRadius: '8px',
            fontSize: '16px',
            fontFamily: 'Segoe UI, sans-serif',
            backgroundColor: '#1a1a1a',           // đen sang
            color: '#fbeeca',                     // vàng nhạt
            border: '1px solid #c9aa5f',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
            transition: 'background-color 0.3s, color 0.3s',
        }}
        onMouseEnter={e => {
            e.target.style.backgroundColor = '#333';
        }}
        onMouseLeave={e => {
            e.target.style.backgroundColor = '#1a1a1a';
        }}
    >
        Chuyển bàn
    </button>
</div>



                    {/* Table Select Modal */}
                    {showChangeTableModal && (
                        <TableSelect
                            newTableId={newTableId}
                            setNewTableId={setNewTableId}
                            selectedTable={selectedTable}
                            setSelectedTable={setSelectedTable}
                            orderItems={orderItems}
                            setOrderItems={setOrderItems}
                            setShowChangeTableModal={setShowChangeTableModal}
                            fetchTables={fetchTables}
                        />

                    )}

                    <div className="order-container">
                        {/* Cột trái: Menu */}
                        <div className="menu-column">
                            {['đang order', 'chờ lên món', 'đã lên hết món'].includes(selectedTable.status) && (
                                <MenuSection
                                    categories={categories}
                                    selectedCategory={selectedCategory}
                                    setSelectedCategory={setSelectedCategory}
                                    searchKeyword={searchKeyword}
                                    setSearchKeyword={setSearchKeyword}
                                    menuGroupedByCategory={menuGroupedByCategory}
                                    orderItems={orderItems}
                                    setOrderItems={setOrderItems}
                                />
                            )}
                        </div>

                        {/* Cột phải: Order Summary + Table Info */}
                        <div className="order-column">
                            <TableDetails
                                selectedTable={selectedTable}
                                updateTableStatus={updateTableStatus}
                            />

                            {orderItems.length > 0 && (
                                <OrderSummary
                                    orderItems={orderItems}
                                    setOrderItems={setOrderItems}
                                    handleSendOrderToKitchen={handleSendOrderToKitchen}
                                    toggleServedStatus={toggleServedStatus}
                                    selectedTable={selectedTable}
                                    startCooking={startCooking} // 👈 quan trọng
                                />

                            )}
                        </div>
                        <Footer />

                    </div>


                </>
            )}

            {/* CSS */}
            <style>
                {`
:root {
    --primary-bg: #f4f1ee;
    --accent-green: #4b6b2f;
    --accent-blue: #7c98ab;
    --text-dark: #2f2f2f;
    --card-bg: #ffffff;
    --border-color: #d6cdbd;
    --shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    --radius: 10px;
    --font-sans: Arial, Helvetica, sans-serif;
}

/* Tổng thể giao diện */
body {
  padding-bottom: 80px; /* Bằng đúng chiều cao footer */
  margin: 0;
  font-family: var(--font-sans);
  background-color: var(--primary-bg);
  color: var(--text-dark);
}


/* Khối chứa menu và order */
.order-container {
    display: flex;
    gap: 28px;
    align-items: flex-start;
    max-height: 100vh;
    overflow-y: auto;
    background-color: var(--primary-bg);
    padding: 24px;
    border-radius: var(--radius);
    box-shadow: var(--shadow);
}

/* Cột menu (danh sách món ăn) */
.menu-column {
    width: 60%;
    overflow-y: auto;
    border-right: 2px dashed var(--border-color);
    padding-right: 20px;
}

.menu-column::-webkit-scrollbar {
    width: 6px;
}
.menu-column::-webkit-scrollbar-thumb {
    background-color: var(--accent-green);
    border-radius: 4px;
}

/* Cột order (đơn hàng) */
.order-column {
    width: 40%;
    overflow-y: auto;
    background-color: var(--card-bg);
    padding: 20px;
    border-radius: var(--radius);
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.05);
    border: 1px solid var(--border-color);
}

/* Bảng đơn hàng */
.order-column table {
    width: 100%;
    border-collapse: collapse;
}

.order-column th, .order-column td {
    padding: 12px 8px;
    text-align: center;
    border-bottom: 1px solid var(--border-color);
}

.order-column th {
    background-color: var(--accent-green);
    color: white;
    font-weight: bold;
}

.order-column tr:hover {
    background-color: #f9f9f9;
}

/* Số lượng và nút (+)(-) nằm ngang */
.quantity-control {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
}

/* Nút số lượng nhỏ hơn */
.quantity-control button {
    padding: 6px 10px;
    font-size: 14px;
    border-radius: 4px;
    background-color: var(--accent-green);
    color: #fff;
    border: none;
    cursor: pointer;
    box-shadow: var(--shadow);
    transition: all 0.2s ease;
}

.quantity-control button:hover {
    background-color: #3d4f1c;
}

.quantity-control input {
    width: 40px;
    text-align: center;
    font-size: 14px;
    padding: 4px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
}

/* Nút Cập nhật, Xóa */
.order-column .action-buttons {
    display: flex;
    gap: 6px;
    justify-content: center;
}

.order-column .action-buttons button {
    padding: 6px 12px;
    font-size: 14px;
    border-radius: 4px;
    background-color: var(--accent-blue);
    color: #fff;
    border: none;
    cursor: pointer;
    box-shadow: var(--shadow);
    transition: all 0.2s ease;
}

.order-column .action-buttons button:hover {
    background-color: #5a7689;
}

/* Nút phân trang */
.pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: center;
}

.pagination-container button {
    background-color: var(--accent-green);
    color: #fff;
    border: none;
    padding: 10px 18px;
    border-radius: 6px;
    margin: 0 5px;
    transition: all 0.3s ease;
    font-family: var(--font-sans);
    font-size: 15px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.pagination-container button:hover {
    background-color: #3d4f1c;
    transform: scale(1.05);
}

/* Nút toàn cục (thêm món, đặt hàng) */
button {
    background-color: var(--accent-green);
    color: #fff;
    border: none;
    padding: 12px 18px;
    border-radius: 6px;
    font-family: var(--font-sans);
    font-size: 15px;
    transition: all 0.3s ease;
    cursor: pointer;
    box-shadow: var(--shadow);
}

button:hover {
    background-color: #3d4f1c;
    transform: translateY(-2px) scale(1.02);
}

/* Hiệu ứng card món ăn */
.menu-item {
    background-color: var(--card-bg);
    padding: 16px;
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    margin-bottom: 14px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    border-left: 4px solid var(--accent-green);
}

.menu-item:hover {
    transform: scale(1.02);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

/* Tablet responsive */
@media (min-width: 600px) and (max-width: 1024px) {
    .order-container {
        flex-direction: column;
        padding: 20px;
    }

    .menu-column, .order-column {
        width: 100%;
        border-right: none;
        padding-right: 0;
    }

    .pagination-container {
        margin: 16px auto 0;
        width: 100%;
        justify-content: center;
    }
}

/* Mobile responsive */
@media (max-width: 599px) {
    .order-container {
        flex-direction: column;
        gap: 16px;
        padding: 12px;
    }

    .menu-column, .order-column {
        width: 100%;
        border-right: none;
        padding: 0;
    }

    .pagination-container {
        margin: 16px auto 0;
        justify-content: center;
    }

    button {
        font-size: 14px;
        padding: 10px 16px;
    }
        
}
`}
            </style>
        </div>
    );
    return (
        <div className="main-container">
            <AreaSelector selectedArea={selectedArea} onSelect={handleSelectArea} />

            {selectedArea === 'phòng thường' && (
                <GroupSelector
                    groupedTables={groupedTables}
                    selectedGroup={selectedGroup}
                    onSelect={handleSelectGroup}
                />
            )}

            <div className="order-layout">
                <div className="menu-column">
                    <div style={{ width: '100%' }}>
                        {!selectedTable ? (
                            selectedArea ? (
                                <>
                                    <TableList
                                        tables={paginatedTables}
                                        onSelect={(table) => {
                                            const newParams = new URLSearchParams(searchParams);
                                            newParams.set('table_id', table.id);
                                            if (table.area?.status) newParams.set('area', table.area.status);
                                            setSearchParams(newParams);
                                            setSelectedTable(table);
                                            setOrderItems([]);
                                            if (table.status === 'đang order') fetchMenuItems();
                                            else setMenuItems([]);
                                        }}
                                        selectedTable={selectedTable}
                                        page={currentPage}
                                        pageSize={pageSize}
                                    />

                                    {totalPages > 1 && (
                                        <div className="pagination-container">
                                            <Pagination
                                                count={totalPages}
                                                page={currentPage}
                                                onChange={(event, value) => goToPage(value)}
                                                color="primary"
                                                shape="rounded"
                                            />
                                        </div>
                                    )}
                                </>
                            ) : (
                                <p>Vui lòng chọn khu vực bàn</p>
                            )
                        ) : (
                            <button
                                onClick={() => {
                                    const newParams = new URLSearchParams(searchParams);
                                    newParams.delete('table_id');
                                    setSearchParams(newParams);
                                    setSelectedTable(null);
                                    setOrderItems([]);
                                    setMenuItems([]);
                                }}
                            >
                                ← Quay lại danh sách bàn
                            </button>
                        )}
                    </div>
                </div>

                <div className="order-column">
                    {selectedTable && (
                        <>
                            <TableDetails selectedTable={selectedTable} updateTableStatus={updateTableStatus} />

                            {['đang order', 'chờ lên món', 'đã lên hết món'].includes(selectedTable.status) && (
                                <>
                                    <MenuSection
                                        categories={categories}
                                        selectedCategory={selectedCategory}
                                        setSelectedCategory={setSelectedCategory}
                                        searchKeyword={searchKeyword}
                                        setSearchKeyword={setSearchKeyword}
                                        menuGroupedByCategory={menuGroupedByCategory}
                                        orderItems={orderItems}
                                        setOrderItems={setOrderItems}
                                    />

                                    {orderItems.length > 0 && (
                                        <OrderSummary
                                            orderItems={orderItems}
                                            setOrderItems={setOrderItems}
                                            handleSendOrderToKitchen={handleSendOrderToKitchen}
                                            toggleServedStatus={toggleServedStatus}
                                            selectedTable={selectedTable}
                                            startCooking={startCooking}
                                        />
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );

};

export default TableOrderPage;
