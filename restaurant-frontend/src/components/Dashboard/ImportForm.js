import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ImportForm = () => {
  const [ingredients, setIngredients] = useState([]);
  const [details, setDetails] = useState([
    { ingredient_id: '', quantity: '', unit_price: '', unit: '' },
  ]);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8000/api/ingredients')
      .then(res => {
        setIngredients(res.data);
        setLoading(false);
      })
      .catch(() => {
        alert('Lỗi tải nguyên liệu');
        setLoading(false);
      });
  }, []);

  const handleDetailChange = (index, field, value) => {
    const newDetails = [...details];
    newDetails[index][field] = value;

    if (field === 'ingredient_id') {
      const ing = ingredients.find(i => i.id === parseInt(value));
      newDetails[index].unit = ing ? ing.unit : '';
    }

    setDetails(newDetails);
  };

  const addDetailRow = () => {
    setDetails([...details, { ingredient_id: '', quantity: '', unit_price: '', unit: '' }]);
  };

  const removeDetailRow = (index) => {
    const newDetails = details.filter((_, i) => i !== index);
    setDetails(newDetails);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!details.length || details.some(d => !d.ingredient_id || !d.quantity || !d.unit_price)) {
      alert('Vui lòng điền đầy đủ thông tin nguyên liệu');
      return;
    }

    try {
      await axios.post('http://localhost:8000/api/inventory-receipts', {
        users_id: 1, // Thay bằng ID thực nếu có hệ thống đăng nhập
        receipt_date: new Date().toISOString().slice(0, 10),
        note,
        details,
      });

      alert('Nhập kho thành công!');
      setNote('');
      setDetails([{ ingredient_id: '', quantity: '', unit_price: '', unit: '' }]);
    } catch (error) {
      console.error(error);
      alert('Lỗi khi nhập kho');
    }
  };

  if (loading) return <p>Đang tải nguyên liệu...</p>;

  return (
    <div className="container my-4">
      <h2 className="mb-4 text-primary">Nhập kho nguyên liệu</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Ghi chú</label>
          <input
            type="text"
            className="form-control"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Ghi chú thêm"
          />
        </div>

        <table className="table table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th>Nguyên liệu</th>
              <th>Số lượng</th>
              <th>Đơn giá</th>
              <th>Đơn vị</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {details.map((detail, idx) => (
              <tr key={idx}>
                <td>
                  <select
                    className="form-select"
                    value={detail.ingredient_id}
                    onChange={(e) => handleDetailChange(idx, 'ingredient_id', e.target.value)}
                  >
                    <option value="">-- Chọn nguyên liệu --</option>
                    {ingredients.map((ing) => (
                      <option key={ing.id} value={ing.id}>
                        {ing.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    value={detail.quantity}
                    onChange={(e) => handleDetailChange(idx, 'quantity', e.target.value)}
                    min="0"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    value={detail.unit_price}
                    onChange={(e) => handleDetailChange(idx, 'unit_price', e.target.value)}
                    min="0"
                  />
                </td>
                <td>{detail.unit}</td>
                <td>
                  {details.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => removeDetailRow(idx)}
                    >
                      Xóa
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          type="button"
          className="btn btn-secondary mb-3"
          onClick={addDetailRow}
        >
          ➕ Thêm nguyên liệu
        </button>
        <br />
        <button type="submit" className="btn btn-primary">📥 Nhập kho</button>
      </form>
    </div>
  );
};

export default ImportForm;
