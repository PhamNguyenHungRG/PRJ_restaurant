// import React from 'react';

// const AreaSelector = ({ selectedArea, onSelect }) => {
//     return (
//         <div style={{ marginBottom: '24px' }}>
//             <button
//                 onClick={() => onSelect('phòng thường')}
//                 style={{
//                     marginRight: '12px',
//                     padding: '8px 16px',
//                     fontWeight: selectedArea === 'phòng thường' ? '700' : '400',
//                     backgroundColor: selectedArea === 'phòng thường' ? '#556B2F' : '#eee',
//                     color: selectedArea === 'phòng thường' ? 'white' : 'black',
//                     border: 'none',
//                     borderRadius: '6px',
//                     cursor: 'pointer',
//                 }}
//             >
//                 Phòng thường
//             </button>

//             <button
//                 onClick={() => onSelect('phòng riêng')}
//                 style={{
//                     padding: '8px 16px',
//                     fontWeight: selectedArea === 'phòng riêng' ? '700' : '400',
//                     backgroundColor: selectedArea === 'phòng riêng' ? '#556B2F' : '#eee',
//                     color: selectedArea === 'phòng riêng' ? 'white' : 'black',
//                     border: 'none',
//                     borderRadius: '6px',
//                     cursor: 'pointer',
//                 }}
//             >
//                 Phòng VIP
//             </button>
//         </div>
//     );
// };

// export default AreaSelector;
import React from 'react';

const AreaSelector = ({ selectedArea, onSelect }) => {
  const areas = [
    { key: 'phòng thường', label: 'Phòng thường' },
    { key: 'phòng riêng', label: 'Phòng VIP' },
  ];

  return (
    <div style={{ marginBottom: '24px' }}>
      {areas.map(({ key, label }) => {
        const isSelected = selectedArea === key;
        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            style={{
              marginRight: key === areas[areas.length - 1].key ? 0 : '12px',
              padding: '10px 20px',
              fontWeight: isSelected ? '600' : '400',
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              fontSize: '1rem',
              backgroundColor: isSelected ? '#fff9e6' : 'white',  // vàng nhạt khi chọn, trắng khi chưa chọn
              color: isSelected ? '#b38f00' : '#222',            // đen nhạt khi chưa chọn, vàng đậm khi chọn
              border: `2px solid ${isSelected ? '#b38f00' : '#ccc'}`,  // viền vàng khi chọn, xám nhẹ khi chưa
              borderRadius: '12px',
              cursor: 'pointer',
              boxShadow: isSelected
                ? '0 4px 8px rgba(179, 143, 0, 0.3)'
                : '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#fff9e6';
              e.currentTarget.style.color = '#b38f00';
              e.currentTarget.style.borderColor = '#b38f00';
              e.currentTarget.style.boxShadow = '0 6px 12px rgba(179, 143, 0, 0.4)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = isSelected ? '#fff9e6' : 'white';
              e.currentTarget.style.color = isSelected ? '#b38f00' : '#222';
              e.currentTarget.style.borderColor = isSelected ? '#b38f00' : '#ccc';
              e.currentTarget.style.boxShadow = isSelected
                ? '0 4px 8px rgba(179, 143, 0, 0.3)'
                : '0 2px 4px rgba(0,0,0,0.1)';
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default AreaSelector;
