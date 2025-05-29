import React from 'react';

const GroupSelector = ({ groupedTables, selectedGroup, onSelect }) => {
    return (
        <div style={{ marginBottom: '24px' }}>
            {Object.keys(groupedTables).map((group) => (
                <button
                    key={group}
                    onClick={() => onSelect(group)}
                    style={{
                        marginRight: '8px',
                        padding: '6px 12px',
                        backgroundColor: selectedGroup === group ? '#556B2F' : '#eee',
                        color: selectedGroup === group ? 'white' : 'black',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                    }}
                >
                    Khu {group}
                </button>
            ))}
        </div>
    );
};

export default GroupSelector;
