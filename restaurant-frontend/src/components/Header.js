// // import React, { useEffect, useState } from 'react';

// // const Header = () => {
// //     const [currentTime, setCurrentTime] = useState(new Date());

// //     useEffect(() => {
// //         const timer = setInterval(() => setCurrentTime(new Date()), 1000);
// //         return () => clearInterval(timer);
// //     }, []);

// //     const formatTime = (date) =>
// //         date.toLocaleTimeString('vi-VN', { hour12: false });

// //     return (
// //         <>
// //             <style>{`
// //                 @media (max-width: 1024px) {
// //                     .header-container {
// //                         flex-direction: column;
// //                         align-items: center;
// //                         gap: 8px;
// //                     }
// //                     .clock {
// //                         text-align: center !important;
// //                         margin-top: 8px;
// //                     }
// //                 }
// //             `}</style>

// //             <div className="header-container" style={headerStyle}>
// //                 {/* Cột trái trống để đẩy logo vào giữa */}
// //                 <div style={{ flex: 1 }}></div>

// //                 {/* Logo ở giữa */}
// //                 <div style={logoStyle}>
// //                     <img
// //                         src="/image/logo.jpg"
// //                         alt="Logo"
// //                         style={logoImageStyle}
// //                     />
// //                 </div>

// //                 {/* Đồng hồ ở bên phải */}
// //                 <div className="clock" style={clockStyle}>
// //                     🕒 {formatTime(currentTime)}
// //                 </div>
// //             </div>
// //         </>
// //     );
// // };

// // // Styles
// // const headerStyle = {
// //     display: 'flex',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     padding: '10px 20px',
// //     flexWrap: 'wrap',
// // };

// // const logoStyle = {
// //     flex: 1,
// //     display: 'flex',
// //     justifyContent: 'center',
// // };

// // const logoImageStyle = {
// //     height: '100px',
// //     width: '100px',
// //     borderRadius: '50%',
// // };

// // const clockStyle = {
// //     flex: 1,
// //     fontWeight: 'bold',
// //     fontSize: '22px',
// //     textAlign: 'right',
// // };

// // export default Header;
// import React, { useEffect, useState } from 'react';

// const Header = () => {
//     const [currentTime, setCurrentTime] = useState(new Date());

//     useEffect(() => {
//         const timer = setInterval(() => setCurrentTime(new Date()), 1000);
//         return () => clearInterval(timer);
//     }, []);

//     const formatTime = (date) =>
//         date.toLocaleTimeString('vi-VN', { hour12: false });

//     return (
//         <>
//             <style>{`
//                 @media (max-width: 1024px) {
//                     .header-container {
//                         flex-direction: column;
//                         align-items: center;
//                         padding: 16px;
//                     }
//                     .clock {
//                         text-align: center !important;
//                         margin-top: 10px;
//                         font-size: 18px !important;
//                     }
//                 }
//             `}</style>

//             <div className="header-container" style={headerStyle}>
//                 <div style={{ flex: 1 }}></div>

//                 <div style={logoStyle}>
//                     <img
//                         src="/image/logo.jpg"
//                         alt="Logo"
//                         style={logoImageStyle}
//                     />
//                 </div>

//                 <div className="clock" style={clockStyle}>
//                     🕒 {formatTime(currentTime)}
//                 </div>
//             </div>
//         </>
//     );
// };

// // Styles
// const headerStyle = {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: '12px 24px',
//     background: 'linear-gradient(to right, #d1e7dd, #f8f9fa)',
//     boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
//     borderBottom: '2px solid #ced4da',
//     flexWrap: 'wrap',
//     position: 'sticky',
//     top: 0,
//     zIndex: 999,
// };

// const logoStyle = {
//     flex: 1,
//     display: 'flex',
//     justifyContent: 'center',
// };

// const logoImageStyle = {
//     height: '90px',
//     width: '90px',
//     borderRadius: '50%',
//     border: '3px solid white',
//     boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
//     objectFit: 'cover',
// };

// const clockStyle = {
//     flex: 1,
//     fontWeight: '600',
//     fontSize: '20px',
//     textAlign: 'right',
//     color: '#495057',
// };

// export default Header;
import React, { useEffect, useState } from 'react';

const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) =>
    date.toLocaleTimeString('vi-VN', { hour12: false });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap');

        .header-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 32px;
          background: #fffbea; /* trắng vàng nhạt */
          border-radius: 14px;
          box-shadow: 0 6px 12px rgba(0,0,0,0.1);
          font-family: 'Playfair Display', serif;
          color: #222;
          flex-wrap: wrap;
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .logo {
          flex: 1;
          display: flex;
          justify-content: center;
        }

        .logo img {
          height: 90px;
          width: 90px;
          border-radius: 16px;
          border: 2.5px solid #f2d88b; /* vàng ánh kim */
          box-shadow: 0 0 10px #f2d88b88;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        .logo img:hover {
          transform: scale(1.05);
          box-shadow: 0 0 15px #f2d88bcc;
        }

        .clock {
          flex: 1;
          font-weight: 600;
          font-size: 22px;
          text-align: right;
          color: #333;
          font-style: italic;
          user-select: none;
        }

        /* Nút hành động */
        .action-button {
          background-color: #f9f1d1;
          color: #222;
          border: 1.8px solid #d8c17f;
          padding: 10px 26px;
          border-radius: 12px;
          font-weight: 600;
          font-family: 'Playfair Display', serif;
          cursor: pointer;
          transition: background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
          margin-left: 24px;
          user-select: none;
        }
        .action-button:hover {
          background-color: #d8c17f;
          color: #fff;
          box-shadow: 0 0 12px #f2d88b;
        }

        /* Cảnh báo vàng ánh kim */
        .alert-warning {
          background: linear-gradient(45deg, #f2d88b, #f9f1d1);
          color: #5a4200;
          font-weight: 700;
          padding: 10px 20px;
          border-radius: 12px;
          box-shadow: 0 0 12px #f2d88baa;
          margin-top: 16px;
          text-align: center;
          font-family: 'Playfair Display', serif;
          flex-basis: 100%;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .header-container {
            flex-direction: column;
            align-items: center;
            padding: 20px;
          }
          .clock {
            text-align: center !important;
            margin-top: 14px;
            font-size: 18px !important;
          }
          .action-button {
            margin-left: 0;
            margin-top: 14px;
            width: 100%;
            max-width: 240px;
          }
          .alert-warning {
            margin-top: 20px;
            width: 90%;
          }
        }
      `}</style>

      <header className="header-container">
        <div style={{ flex: 1 }}></div>

        <div className="logo">
          <img src="/image/logo.jpg" alt="Logo nhà hàng cao cấp" />
        </div>

        <div className="clock">🕒 {formatTime(currentTime)}</div>

        {/* Ví dụ nút hành động */}
        <button className="action-button" onClick={() => alert('Đặt bàn thành công!')}>
          Đặt bàn ngay
        </button>

        {/* Ví dụ cảnh báo
        <div className="alert-warning">
          ⚠️ Vui lòng đặt bàn trước ít nhất 2 giờ để đảm bảo chỗ
        </div> */}
      </header>
    </>
  );
};

export default Header;
