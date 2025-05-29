import React from 'react';

const TableDetails = ({ selectedTable, updateTableStatus }) => {
    if (!selectedTable) return null;

    return (
        <>
            <h3>
                Bàn số {selectedTable.table_number} - Trạng thái: {selectedTable.status}
            </h3>

            {selectedTable.status === 'trống' && (
                <button
                    style={{
                        marginTop: '8px',
                        padding: '8px 12px',
                        backgroundColor: '#556B2F',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                    onClick={() => updateTableStatus(selectedTable.id, 'đang order')}
                >
                    Bắt đầu order
                </button>
            )}

            {selectedTable.status === 'đang order' && (
                <button
                    style={{
                        marginTop: '8px',
                        marginLeft: '12px',
                        padding: '8px 12px',
                        backgroundColor: '#B71C1C',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                    onClick={() => updateTableStatus(selectedTable.id, 'trống')}
                >
                    Hủy order
                </button>
            )}
        </>
    );
};

export default TableDetails;
