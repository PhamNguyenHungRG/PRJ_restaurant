import React from 'react';

const AreaSelector = ({ selectedArea, onSelect }) => {
    return (
        <div style={{ marginBottom: '24px' }}>
            <button
                onClick={() => onSelect('phòng thường')}
                style={{
                    marginRight: '12px',
                    padding: '8px 16px',
                    fontWeight: selectedArea === 'phòng thường' ? '700' : '400',
                    backgroundColor: selectedArea === 'phòng thường' ? '#556B2F' : '#eee',
                    color: selectedArea === 'phòng thường' ? 'white' : 'black',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                }}
            >
                Phòng thường
            </button>

            <button
                onClick={() => onSelect('phòng riêng')}
                style={{
                    padding: '8px 16px',
                    fontWeight: selectedArea === 'phòng riêng' ? '700' : '400',
                    backgroundColor: selectedArea === 'phòng riêng' ? '#556B2F' : '#eee',
                    color: selectedArea === 'phòng riêng' ? 'white' : 'black',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                }}
            >
                Phòng VIP
            </button>
        </div>
    );
};

export default AreaSelector;
