import React, { useState } from 'react';

const TableDetails = ({ selectedTable, updateTableStatus }) => {
  const [hoverBtn, setHoverBtn] = useState(null);

  if (!selectedTable) return null;

  const baseButtonStyle = {
    marginTop: '8px',
    padding: '10px 16px',
    borderRadius: '8px',
    border: 'none',
    fontWeight: '600',
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, color 0.3s ease',
    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
  };

  const startOrderStyle = {
    backgroundColor: hoverBtn === 'start' ? '#f7e843' : '#fff8c4', // vàng nhạt - vàng đậm hover
    color: '#4a3e00',
  };

  const cancelOrderStyle = {
    marginLeft: '12px',
    backgroundColor: hoverBtn === 'cancel' ? '#333333' : '#1a1a1a', // đen sang trọng - đen nhạt hover
    color: '#fffbea',
  };

  const containerStyle = {
    backgroundColor: '#fffbea',
    padding: '20px',
    borderRadius: '12px',
    maxWidth: '400px',
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    color: '#1a1a1a',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  };

  const headingStyle = {
    marginBottom: '16px',
    fontWeight: '600',
    fontSize: '1.4rem',
  };

  return (
    <div style={containerStyle}>
      <h3 style={headingStyle}>
        Bàn số {selectedTable.table_number} - Trạng thái: {selectedTable.status}
      </h3>

      {selectedTable.status === 'trống' && (
        <button
          style={{ ...baseButtonStyle, ...startOrderStyle }}
          onMouseEnter={() => setHoverBtn('start')}
          onMouseLeave={() => setHoverBtn(null)}
          onClick={() => updateTableStatus(selectedTable.id, 'đang order')}
        >
          Bắt đầu order
        </button>
      )}

      {selectedTable.status === 'đang order' && (
        <button
          style={{ ...baseButtonStyle, ...cancelOrderStyle }}
          onMouseEnter={() => setHoverBtn('cancel')}
          onMouseLeave={() => setHoverBtn(null)}
          onClick={() => updateTableStatus(selectedTable.id, 'trống')}
        >
          Hủy order
        </button>
      )}
    </div>
  );
};

export default TableDetails;
