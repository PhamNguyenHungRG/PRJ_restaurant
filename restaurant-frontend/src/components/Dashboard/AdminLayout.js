import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminLayout = ({ children }) => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: '/dashboard', label: 'Dashboard' },
        { path: '/food', label: 'Food' },
        { path: '/category', label: 'Category' },
        { path: '/user', label: 'User' },
        { path: '/ingredient', label: 'IngredientList' },
        { path: '/inventory', label: 'InventoryStats'},


    ];

    return (
        <div className="d-flex" style={{ minHeight: '100vh' }}>
            {/* Sidebar */}
            <div className="bg-light p-3" style={{ width: '240px' }}>
                <h5 className="fw-bold text-primary"> ADMIN RESTAURANT</h5>
                <ul className="nav flex-column mt-4">
                    {navItems.map(({ path, label }) => (
                        <li className="nav-item" key={path}>
                            <Link
                                className={`btn w-100 text-start ${
                                    isActive(path) ? 'btn-primary text-white' : 'btn-outline-primary'
                                }`}
                                to={path}
                            >
                                {label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Main Content */}
            <div className="flex-grow-1 p-4">{children}</div>
        </div>
    );
};

export default AdminLayout;
