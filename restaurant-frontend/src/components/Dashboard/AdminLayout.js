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
    { path: '/inventory', label: 'InventoryStats' },
  ];

  // Màu sắc chủ đạo
  const colors = {
    background: '#fff',
    sidebarBg: '#fff9e6', // vàng nhạt nền sidebar
    textPrimary: '#000', // chữ đen sang trọng
    gold: '#d4af37', // vàng ánh kim (gold)
    btnDefault: '#f5f5dc', // màu nhẹ nhàng cho nút
    btnHover: '#d4af37', // vàng ánh kim khi hover
  };

  return (
    <div
      className="d-flex"
      style={{ minHeight: '100vh', backgroundColor: colors.background, fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: '240px',
          backgroundColor: colors.sidebarBg,
          padding: '1rem',
          borderRadius: '0 20px 20px 0',
          boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
        }}
      >
        <h5
          style={{
            fontWeight: '700',
            color: colors.gold,
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: '1.5rem',
          }}
        >
          Admin Restaurant
        </h5>

        <ul className="nav flex-column" style={{ gap: '0.75rem', paddingLeft: 0 }}>
          {navItems.map(({ path, label }) => (
            <li className="nav-item" key={path}>
              <Link
                to={path}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '0.6rem 1rem',
                  borderRadius: '12px',
                  color: isActive(path) ? colors.background : colors.textPrimary,
                  backgroundColor: isActive(path) ? colors.gold : colors.btnDefault,
                  textDecoration: 'none',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  boxShadow: isActive(path) ? '0 0 8px rgba(212, 175, 55, 0.6)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isActive(path)) {
                    e.target.style.backgroundColor = colors.btnHover;
                    e.target.style.color = colors.background;
                    e.target.style.boxShadow = `0 0 8px ${colors.gold}`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(path)) {
                    e.target.style.backgroundColor = colors.btnDefault;
                    e.target.style.color = colors.textPrimary;
                    e.target.style.boxShadow = 'none';
                  }
                }}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <main
        style={{
          flexGrow: 1,
          padding: '2rem',
          color: colors.textPrimary,
          backgroundColor: colors.background,
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
