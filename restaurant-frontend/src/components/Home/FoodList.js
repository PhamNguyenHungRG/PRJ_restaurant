import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FoodList = () => {
    const [foods, setFoods] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/foods')
            .then(res => setFoods(res.data))
            .catch(err => console.error('Lỗi khi lấy danh sách món:', err));
    }, []);

    return (
        <div style={{ padding: '16px' }}>
            <h2 style={{ marginBottom: '16px' }}>Danh sách món ăn</h2>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: '16px',
            }}>
                {foods.map(food => (
                    <div key={food.id} style={{
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        padding: '12px',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                        background: '#fff'
                    }}>
                        <h4>{food.name}</h4>
                        <p>Giá: {food.price.toLocaleString()}đ</p>
                        <p>Loại: {food.category}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FoodList;
