import React from 'react';
import { useSearchParams } from 'react-router-dom';

const Footer = ({ user, onLogout, onShowLogin }) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const handleGoHome = () => {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('table_id'); // Xóa table_id khỏi URL
        setSearchParams(newParams);  // Cập nhật URL, React sẽ tự rerender
    };

    return (
        <div style={footerStyle}>
            <span onClick={handleGoHome} style={linkStyle}>Trang chủ</span>
            <a href="/promotions" style={linkStyle}>Khuyến mãi</a>
            <a href="/notifications" style={linkStyle}>Thông báo</a>
            <div style={accountStyle}>
                {user ? (
                    <span onClick={onLogout} style={logoutStyle}>Đăng xuất</span>
                ) : (
                    <span onClick={onShowLogin} style={logoutStyle}>Đăng nhập</span>
                )}
            </div>
        </div>
    );
};

const footerStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '10px 0',
    background: '#f8f8f8',
    borderTop: '1px solid #ccc',
    position: 'fixed',
    bottom: 0,
    width: '100%',
    zIndex: 999,
    flexWrap: 'wrap',
    gap: '10px',
};

const linkStyle = {
    cursor: 'pointer',
    color: '#007bff',
    fontWeight: 'bold',
    textDecoration: 'none',
};

const accountStyle = {
    cursor: 'pointer',
    color: '#007bff',
    fontWeight: 'bold',
};

const logoutStyle = {
    textDecoration: 'underline',
};

export default Footer;
