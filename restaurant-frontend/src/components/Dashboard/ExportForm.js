import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ExportForm = () => {
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState(null); // { type: 'success' | 'danger', text: string }

  useEffect(() => {
    axios.get('/ingredients')
      .then(res => setIngredients(res.data))
      .catch(err => {
        console.error(err);
        setMessage({ type: 'danger', text: 'Không thể tải danh sách nguyên liệu' });
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedIngredient || !quantity || parseFloat(quantity) <= 0) {
      setMessage({ type: 'danger', text: 'Vui lòng chọn nguyên liệu và nhập số lượng hợp lệ' });
      return;
    }

    try {
      await axios.post('/inventory-waste', {
        ingredient_id: selectedIngredient,
        quantity: parseFloat(quantity),
        reason,
      });

      setMessage({ type: 'success', text: '✅ Xuất kho thành công!' });
      setSelectedIngredient('');
      setQuantity('');
      setReason('');
    } catch (error) {
      console.error(error);
      setMessage({ type: 'danger', text: '❌ Có lỗi xảy ra khi xuất kho' });
    }
  };

  return (
    <div className="container my-5">
      <div className="card shadow-sm p-4">
        <h2 className="text-danger mb-4">Xuất kho (Bỏ nguyên liệu)</h2>

        {message && (
          <div className={`alert alert-${message.type}`} role="alert">
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="ingredientSelect" className="form-label">Nguyên liệu</label>
            <select
              id="ingredientSelect"
              className="form-select"
              value={selectedIngredient}
              onChange={(e) => setSelectedIngredient(e.target.value)}
              required
            >
              <option value="">-- Chọn nguyên liệu --</option>
              {ingredients.map(item => (
                <option key={item.id} value={item.id}>
                  {item.name} (Tồn: {item.stock_quantity} {item.unit})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="quantityInput" className="form-label">Số lượng</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="form-control"
              id="quantityInput"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="reasonInput" className="form-label">Lý do (tuỳ chọn)</label>
            <textarea
              id="reasonInput"
              className="form-control"
              rows="2"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Lý do hư hỏng, hết hạn, v.v..."
            ></textarea>
          </div>

          <button type="submit" className="btn btn-danger">🧾 Xuất kho</button>
        </form>
      </div>
    </div>
  );
};

export default ExportForm;
