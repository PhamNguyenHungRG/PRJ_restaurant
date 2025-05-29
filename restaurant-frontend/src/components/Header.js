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
//                         gap: 8px;
//                     }
//                     .clock {
//                         text-align: center !important;
//                         margin-top: 8px;
//                     }
//                 }
//             `}</style>

//             <div className="header-container" style={headerStyle}>
//                 {/* Cột trái trống để đẩy logo vào giữa */}
//                 <div style={{ flex: 1 }}></div>

//                 {/* Logo ở giữa */}
//                 <div style={logoStyle}>
//                     <img
//                         src="/image/logo.jpg"
//                         alt="Logo"
//                         style={logoImageStyle}
//                     />
//                 </div>

//                 {/* Đồng hồ ở bên phải */}
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
//     padding: '10px 20px',
//     flexWrap: 'wrap',
// };

// const logoStyle = {
//     flex: 1,
//     display: 'flex',
//     justifyContent: 'center',
// };

// const logoImageStyle = {
//     height: '100px',
//     width: '100px',
//     borderRadius: '50%',
// };

// const clockStyle = {
//     flex: 1,
//     fontWeight: 'bold',
//     fontSize: '22px',
//     textAlign: 'right',
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
                @media (max-width: 1024px) {
                    .header-container {
                        flex-direction: column;
                        align-items: center;
                        padding: 16px;
                    }
                    .clock {
                        text-align: center !important;
                        margin-top: 10px;
                        font-size: 18px !important;
                    }
                }
            `}</style>

            <div className="header-container" style={headerStyle}>
                <div style={{ flex: 1 }}></div>

                <div style={logoStyle}>
                    <img
                        src="/image/logo.jpg"
                        alt="Logo"
                        style={logoImageStyle}
                    />
                </div>

                <div className="clock" style={clockStyle}>
                    🕒 {formatTime(currentTime)}
                </div>
            </div>
        </>
    );
};

// Styles
const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 24px',
    background: 'linear-gradient(to right, #d1e7dd, #f8f9fa)',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    borderBottom: '2px solid #ced4da',
    flexWrap: 'wrap',
    position: 'sticky',
    top: 0,
    zIndex: 999,
};

const logoStyle = {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
};

const logoImageStyle = {
    height: '90px',
    width: '90px',
    borderRadius: '50%',
    border: '3px solid white',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    objectFit: 'cover',
};

const clockStyle = {
    flex: 1,
    fontWeight: '600',
    fontSize: '20px',
    textAlign: 'right',
    color: '#495057',
};

export default Header;
