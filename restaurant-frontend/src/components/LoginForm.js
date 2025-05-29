import React, { useState } from 'react';
import axios from 'axios';

const LoginForm = ({ onLogin }) => {
    const [staffCode, setStaffCode] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        try {
            const res = await axios.post('http://localhost:8000/api/login', {
                staff_code: staffCode,
                password: password,
            });

            setSuccessMessage(res.data.message || 'Đăng nhập thành công!');

            // Hiển thị thông báo thành công 1 giây trước khi gọi onLogin
            setTimeout(() => {
                onLogin(res.data.user);
            }, 1000);

        } catch (err) {
            if (err.response) {
                if (err.response.status === 403) {
                    setError(err.response.data.message || 'Bạn không có quyền truy cập');
                } else if (err.response.status === 400) {
                    const errors = err.response.data;
                    // Hiển thị lỗi validation đầu vào
                    setError(Object.values(errors).flat().join(' '));
                } else {
                    setError('Lỗi không xác định, vui lòng thử lại');
                }
            } else {
                setError('Lỗi kết nối đến server');
            }
        }
    };

    return (
        <form onSubmit={handleLogin} style={formStyle}>
            <h2>Đăng nhập</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

            <input
                type="text"
                placeholder="Mã nhân viên"
                value={staffCode}
                onChange={(e) => setStaffCode(e.target.value)}
                required
                style={inputStyle}
            />
            <input
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={inputStyle}
            />
            <button type="submit" style={buttonStyle}>Đăng nhập</button>
        </form>
    );
};

const formStyle = {
    maxWidth: '300px',
    margin: '50px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    backgroundColor: '#f9f9f9',
};

const inputStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
};

const buttonStyle = {
    width: '100%',
    padding: '10px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontWeight: 'bold',
};

export default LoginForm;