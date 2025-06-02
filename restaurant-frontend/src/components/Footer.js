// import React from 'react';
// import { useSearchParams } from 'react-router-dom';
// import { FaHome, FaTags, FaBell, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';

// const Footer = ({ user, onLogout, onShowLogin }) => {
//   const [searchParams, setSearchParams] = useSearchParams();

//   const handleGoHome = () => {
//     const newParams = new URLSearchParams(searchParams);
//     newParams.delete('table_id');
//     setSearchParams(newParams);
//   };

//   return (
//     <footer className="footer-container">
//       <div className="footer-content">
//         {/* Navigation Items */}
//         <div className="footer-nav">
//           <div className="footer-item" role="button" onClick={handleGoHome}>
//             <FaHome size={20} />
//             <div>Trang chủ</div>
//           </div>
//           <a className="footer-item" href="/promotions">
//             <FaTags size={20} />
//             <div>Khuyến mãi</div>
//           </a>
//           <a className="footer-item" href="/notifications">
//             <FaBell size={20} />
//             <div>Thông báo</div>
//           </a>
//         </div>

//         {/* Auth Button */}
//         <div className="footer-auth">
//           <button className="footer-button" onClick={() => {
//             if (onLogout) onLogout(); // gọi hàm logout nếu cần
//             window.location.href = 'http://localhost:3000'; // chuyển hướng
//           }}>
//             <FaSignOutAlt /> <span>Đăng xuất</span>
//           </button>
//         </div>
//       </div>

//       {/* Styles */}
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap');

//         footer {
//           position: fixed;
//           bottom: 0;
//           left: 0;
//           right: 0;
//           height: 80px;
//           background-color: #fff;
//           border-top: 1px solid #ddd;
//           border-radius: 16px 16px 0 0;
//           z-index: 100;
//           font-family: 'Montserrat', sans-serif;
//         }

//         .footer-container {
//           padding: 12px 20px;
//           box-sizing: border-box;
//         }

//         .footer-content {
//           display: flex;
//           justify-content: center; /* căn giữa tổng thể */
//           align-items: center;
//           flex-wrap: nowrap;
//           gap: 40px;
//           width: 100%;
//           max-width: 1200px;
//           margin: 0 auto;
//         }

//         .footer-nav {
//           display: flex;
//           gap: 24px;
//           flex: 1;
//           justify-content: center; /* menu ở giữa */
//         }

//         .footer-item {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           font-weight: 500;
//           color: #556B2F;
//           cursor: pointer;
//           transition: all 0.2s ease;
//           font-size: 0.9rem;
//           text-decoration: none;
//         }

//         .footer-item:hover {
//           color: #92ab67;
//           transform: scale(1.05);
//         }

//         .footer-auth {
//           display: flex;
//           justify-content: flex-end; /* đẩy nút ra bên phải */
//           flex-shrink: 0;
//           min-width: 140px;
//         }

//         .footer-button {
//           background-color: #556B2F;
//           border: none;
//           color: white;
//           padding: 8px 20px;
//           border-radius: 30px;
//           font-weight: 600;
//           font-size: 0.95rem;
//           display: flex;
//           align-items: center;
//           gap: 10px;
//           cursor: pointer;
//           transition: background 0.3s ease;
//         }

//         .footer-button:hover {
//           background-color: #92ab67;
//         }

//         /* Responsive cho điện thoại */
//         @media (max-width: 768px) {
//           .footer-content {
//             flex-direction: column;
//             gap: 10px;
//             align-items: center;
//           }

//           .footer-nav {
//             width: 100%;
//             justify-content: space-around;
//           }

//           .footer-auth {
//             width: 100%;
//             justify-content: center; /* nút căn giữa màn hình nhỏ */
//             min-width: auto;
//           }

//           .footer-button {
//             width: 100%;
//             justify-content: center;
//           }
//         }
//       `}</style>
//     </footer>
//   );
// };

// export default Footer;
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaHome, FaTags, FaBell, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';

const Footer = ({ user, onLogout, onShowLogin }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleGoHome = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('table_id');
    setSearchParams(newParams);
  };

  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* Navigation Items */}
        <div className="footer-nav">
          <div className="footer-item" role="button" onClick={handleGoHome} tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && handleGoHome()}>
            <FaHome size={22} />
            <div>Trang chủ</div>
          </div>
          <a className="footer-item" href="/promotions">
            <FaTags size={22} />
            <div>Khuyến mãi</div>
          </a>
          <a className="footer-item" href="/notifications">
            <FaBell size={22} />
            <div>Thông báo</div>
          </a>
        </div>

        {/* Auth Button */}
        <div className="footer-auth">
          <button
            className="footer-button"
            onClick={() => {
              if (onLogout) onLogout();
              window.location.href = 'http://localhost:3000';
            }}
          >
            <FaSignOutAlt /> <span>Đăng xuất</span>
          </button>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap');

        footer {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 80px;
          background-color: #fff;
          border-top: 2px solid #b38f00; /* vàng ánh kim */
          border-radius: 16px 16px 0 0;
          z-index: 100;
          font-family: 'Montserrat', sans-serif;
          box-shadow: 0 -3px 8px rgba(179, 143, 0, 0.15);
        }

        .footer-container {
          padding: 14px 24px;
          box-sizing: border-box;
        }

        .footer-content {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: nowrap;
          gap: 50px;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }

        .footer-nav {
          display: flex;
          gap: 28px;
          flex: 1;
          justify-content: center;
        }

        .footer-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-weight: 600;
          color: #333; /* đen hơi nhạt */
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1rem;
          text-decoration: none;
          user-select: none;
          border-radius: 10px;
          padding: 8px 14px;
          background-color: #fffbe6; /* vàng nhạt nền nhẹ */
          border: 2px solid transparent;
        }

        .footer-item:hover,
        .footer-item:focus {
          color: #b38f00; /* vàng ánh kim */
          background-color: #fff9c4;
          border-color: #b38f00;
          transform: scale(1.1);
          outline: none;
        }

        .footer-auth {
          display: flex;
          justify-content: flex-end;
          flex-shrink: 0;
          min-width: 160px;
        }

        .footer-button {
          background-color: #b38f00; /* vàng ánh kim */
          border: none;
          color: #fff;
          padding: 10px 26px;
          border-radius: 30px;
          font-weight: 700;
          font-size: 1rem;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          box-shadow: 0 4px 10px rgba(179, 143, 0, 0.5);
          transition: background 0.3s ease, box-shadow 0.3s ease;
        }

        .footer-button:hover {
          background-color: #d1b75a;
          box-shadow: 0 6px 14px rgba(209, 183, 90, 0.7);
        }

        /* Responsive cho điện thoại */
        @media (max-width: 768px) {
          .footer-content {
            flex-direction: column;
            gap: 14px;
            align-items: center;
          }

          .footer-nav {
            width: 100%;
            justify-content: space-around;
          }

          .footer-auth {
            width: 100%;
            justify-content: center;
            min-width: auto;
          }

          .footer-button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
