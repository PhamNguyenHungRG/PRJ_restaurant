import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import TableOrderPage from './components/Home/TableOrderPage';
import KitchenView from './components/Kitchen/KitchenView';
import Dashboard from './components/Dashboard/Dashboard';
import FoodManager from './components/Dashboard/FoodManager';
import CategoryManager from './components/Dashboard/CategoryManager';
import EmployeeManager from './components/Dashboard/EmployeeManager';
import LoginForm from './components/LoginForm';

function App() {
    // Quản lý trạng thái user đăng nhập
    const [user, setUser] = useState(null);

    // Nếu chưa đăng nhập, chỉ cho phép vào /login
    // Nếu đã đăng nhập và user có staff_code bắt đầu PV => redirect /order
    // Có thể bổ sung các role khác điều hướng tương ứng

    return (
        <Routes>
            {/* {!user ? (
                <>
                    <Route path="/login" element={<LoginForm onLogin={setUser} />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </>
            ) : (
                <> */}
                    {/* Nếu staff_code không bắt đầu bằng PV, không cho vào /order */}
                    {/* {user.staff_code.startsWith('PV') ? (
                        <> */}
                            <Route path="/order" element={<TableOrderPage />} />
                            <Route path="/kitchen" element={<KitchenView />} />
                            {/* Các route khác mà user có thể truy cập */}
                            <Route path="*" element={<Navigate to="/order" replace />} />
                        {/* </>
                    ) : (
                        <> */}
                            {/* Nếu user không có quyền, ví dụ redirect về login hoặc trang khác */}
                            <Route path="*" element={<Navigate to="/login" replace />} />
                        {/* </>
                    )} */}

                    {/* Dashboard và các trang quản lý có thể phân quyền riêng nếu cần */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/food" element={<FoodManager />} />
                    {/* <Route path="/category" element={<CategoryManager />} />
                    <Route path="/user" element={<EmployeeManager />} /> */}
                {/* </>
            )} */}
        </Routes>
    );
}

export default App;