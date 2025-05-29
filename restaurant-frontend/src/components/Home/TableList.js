import React from 'react';

const TableList = ({ tables, onSelect, selectedTable }) => {
    const getBgColor = (table, isSelected) => {
        if (isSelected) return '#D8CAB8';
        switch (table.status) {
            case 'trống': return 'white';
            case 'đang order': return '#FFF9C4';
            case 'chờ lên món': return '#90CAF9';
            case 'đã lên hết món': return '#A5D6A7';
            default: return 'white';
        }
    };

    const statusColors = [
        { label: 'Trống', color: 'white' },
        { label: 'Đang order', color: '#FFF9C4' },
        { label: 'Chờ lên món', color: '#90CAF9' },
        { label: 'Đã lên hết món', color: '#A5D6A7' },
        { label: 'Đang chọn', color: '#D8CAB8' },
    ];

    return (
        <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', fontFamily: "'Poppins', sans-serif" }}>
            {/* Ghi chú trạng thái */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '15px', color: '#333' }}>
                <div style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    color: '#222',
                    marginBottom: '10px'
                }}>
                    📝 Ghi chú trạng thái:
                </div>
                {statusColors.map((status, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
                        <div style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '4px',
                            backgroundColor: status.color,
                            border: '1px solid #aaa'
                        }}></div>
                        <span style={{ fontSize: '16px', fontWeight: 500 }}>{status.label}</span>
                    </div>
                ))}
            </div>

            {/* Danh sách bàn */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 80px)',
                gap: '12px',
                justifyContent: 'center',
                marginLeft: '200px',
            }}>
                {tables.map((table) => {
                    const isSelected = selectedTable?.id === table.id;
                    const bgColor = getBgColor(table, isSelected);
                    return (
                        <div
                            key={table.id}
                            onClick={() => onSelect(table)}
                            style={{
                                width: '70px',
                                height: '70px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: bgColor,
                                color: isSelected ? 'white' : '#333',
                                cursor: 'pointer',
                                fontWeight: 600,
                                fontSize: '16px',
                                fontFamily: "'Poppins', sans-serif",
                                boxShadow: '0 0 5px rgba(0,0,0,0.2)',
                                border: '1px solid #ccc',
                                textAlign: 'center'
                            }}
                        >
                            {table.table_number}
                        </div>
                    );
                })}
            </div>

            {/* Google Fonts */}
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
                `}
            </style>
        </div>
    );
};

export default TableList;
