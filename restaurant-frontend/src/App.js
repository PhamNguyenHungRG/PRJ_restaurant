import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import TableOrderPage from './components/Home/TableOrderPage';
import KitchenView from './components/Kitchen/KitchenView';
import Dashboard from './components/Dashboard/Dashboard';
import FoodManager from './components/Dashboard/FoodManager';
import CategoryManager from './components/Dashboard/CategoryManager';
import EmployeeManager from './components/Dashboard/EmployeeManager';
// import LoginForm from './components/LoginForm';
import PaymentPage from './components/Cashier/PaymentPage';
import OrdersList from './components/Cashier/OrdersList';
import InventoryStats from "./components/Dashboard/InventoryStats";
import ImportForm from "./components/Dashboard/ImportForm";
import IngredientList from "./components/Dashboard/IngredientList";
import LoginPage from './components/LoginPage';
import PageTitle from './components/PageTitle';


function App() {
    // Quản lý trạng thái user đăng nhập
    const [user, setUser] = useState(null);
    // Hàm xử lý khi chọn order, sẽ điều hướng sang trang thanh toán
    const navigate = useNavigate();
    const handleSelectOrder = (orderId) => {
        navigate(`/cashier/payment/${orderId}`);
    };

    const [reloadOrderDetail, setReloadOrderDetail] = useState(0);
    // Nếu chưa đăng nhập, chỉ cho phép vào /login
    // Nếu đã đăng nhập và user có staff_code bắt đầu PV => redirect /order
    // Có thể bổ sung các role khác điều hướng tương ứng

    return (
        <><PageTitle />
        
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
            {/* <Route path="/order" element={<TableOrderPage />} /> */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/order" element={<TableOrderPage reloadKey={reloadOrderDetail} />} />
            {/* <Route path="/kitchen" element={<KitchenView />} /> */}
            <Route path="/kitchen" element={<KitchenView triggerReload={() => setReloadOrderDetail(prev => prev + 1)} />} />
            {/* Các route khác mà user có thể truy cập */}
            {/* <Route path="*" element={<Navigate to="/order" replace />} /> */}
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
            <Route path="/cashier" element={<OrdersList onSelectOrder={handleSelectOrder} />} />

            {/* Trang chi tiết và thanh toán hóa đơn */}
            <Route path="/cashier/payment/:orderId" element={<PaymentPage />} />
              <Route path="/order" element={<TableOrderPage />} />
            <Route path="/kitchen" element={<KitchenView />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inventory" element={<InventoryStats />} />
            <Route path="/ingredient" element={<IngredientList />} />
            <Route path="/importform" element={<ImportForm />} />
            <Route path="/food" element={<FoodManager />} />
            <Route path="/category" element={<CategoryManager />} />
            <Route path="/user" element={<EmployeeManager />} />
        </Routes>
        </>
    );
}

export default App;


