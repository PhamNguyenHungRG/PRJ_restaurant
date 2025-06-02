// import React from 'react';

// const GroupSelector = ({ groupedTables, selectedGroup, onSelect }) => {
//     return (
//         <div style={{ marginBottom: '24px' }}>
//             {Object.keys(groupedTables).map((group) => (
//                 <button
//                     key={group}
//                     onClick={() => onSelect(group)}
//                     style={{
//                         marginRight: '8px',
//                         padding: '6px 12px',
//                         backgroundColor: selectedGroup === group ? '#556B2F' : '#eee',
//                         color: selectedGroup === group ? 'white' : 'black',
//                         border: 'none',
//                         borderRadius: '6px',
//                         cursor: 'pointer',
//                     }}
//                 >
//                     Khu {group}
//                 </button>
//             ))}
//         </div>
//     );
// };

// export default GroupSelector;
import React from 'react';

const GroupSelector = ({ groupedTables, selectedGroup, onSelect }) => {
  return (
    <div style={{ marginBottom: '24px' }}>
      {Object.keys(groupedTables).map((group) => {
        const isSelected = selectedGroup === group;
        return (
          <button
            key={group}
            onClick={() => onSelect(group)}
            style={{
              marginRight: '12px',
              padding: '10px 18px',
              fontWeight: isSelected ? '600' : '400',
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              fontSize: '1rem',
              backgroundColor: isSelected ? '#fff9e6' : 'white',
              color: isSelected ? '#b38f00' : '#222',
              border: `2px solid ${isSelected ? '#b38f00' : '#ccc'}`,
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
            Khu {group}
          </button>
        );
      })}
    </div>
  );
};

export default GroupSelector;
