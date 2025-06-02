import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginPage() {
  const [staffCode, setStaffCode] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // <-- thêm dòng này
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/login', {
        staff_code: staffCode,
        password: password
      });

      const { redirect } = response.data;
      navigate(redirect);
    } catch (error) {
      alert('Login failed!');
      console.error(error);
    }
  };

  return (
    <div className="login-bg d-flex align-items-center justify-content-center vh-100">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=Open+Sans&display=swap');

        .login-bg {
          background-color: #fdfcf9;
        }

        .login-card {
          background-color: #fff;
          border: 1px solid rgba(212, 175, 55, 0.2);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          max-width: 400px;
          width: 100%;
          padding: 2rem;
          border-radius: 1rem;
        }

        .login-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          color: #1a1f36;
        }

        .login-card .form-label {
          font-family: 'Open Sans', sans-serif;
          font-size: 0.9rem;
          color: #1a1f36;
        }

        .login-card .form-control {
          border: 1px solid rgba(26, 31, 54, 0.2);
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
        }

        .login-btn {
          background-color: #d4af37;
          color: #fff;
          font-family: 'Open Sans', sans-serif;
          font-weight: 600;
          border: none;
          padding: 0.75rem;
          border-radius: 0.5rem;
          transition: all 0.3s ease;
        }

        .login-btn:hover {
          background-color: #bfa133;
        }

        .login-card input:focus,
        .login-card button:focus {
          box-shadow: 0 0 0 0.2rem rgba(212, 175, 55, 0.25);
          outline: none;
        }

        .form-check-label {
          font-size: 0.85rem;
          color: #555;
        }
      `}</style>

      <div className="login-card">
        <h2 className="text-center mb-4 fw-bold login-title">
          <i className="bi bi-box-arrow-in-right me-2"></i>Welcome Back
        </h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Staff Code</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your staff code"
              value={staffCode}
              onChange={(e) => setStaffCode(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="form-check mt-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="showPasswordCheck"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <label className="form-check-label" htmlFor="showPasswordCheck">
                Show Password
              </label>
            </div>
          </div>

          <button type="submit" className="btn login-btn w-100">
            <i className="bi bi-lock-fill me-2"></i>Log In
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
