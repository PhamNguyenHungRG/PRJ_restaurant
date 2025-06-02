import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ImportForm from './ImportForm';

const ingredientApi = {
  getAll: () => axios.get('http://localhost:8000/api/ingredients'),
  create: (data) => axios.post('http://localhost:8000/api/ingredients', data),
  update: (id, data) => axios.put(`http://localhost:8000/api/ingredients/${id}`, data),
  delete: (id) => axios.delete(`http://localhost:8000/api/ingredients/${id}`)
};

const IngredientList = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    unit: '',
    category_id: '',
    stock_quantity: ''
  });

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = () => {
    setLoading(true);
    ingredientApi.getAll()
      .then(res => {
        setIngredients(res.data);
      })
      .catch(() => {
        alert('Lỗi lấy danh sách nguyên liệu');
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa nguyên liệu này?')) return;
    try {
      await ingredientApi.delete(id);
      alert('Xóa thành công');
      fetchIngredients();
    } catch {
      alert('Xóa thất bại');
    }
  };

  const handleEdit = (ingredient) => {
    setFormData({
      id: ingredient.id,
      name: ingredient.name,
      unit: ingredient.unit,
      category_id: ingredient.category_id || '',
      stock_quantity: ingredient.stock_quantity || ''
    });
    setShowForm(true);
  };

  const handleAddNew = () => {
    setFormData({
      id: null,
      name: '',
      unit: '',
      category_id: '',
      stock_quantity: ''
    });
    setShowForm(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const { name, unit, category_id, stock_quantity } = formData;

    if (!name || !unit || !category_id || stock_quantity === '') {
      alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    try {
      if (formData.id) {
        await ingredientApi.update(formData.id, formData);
        alert('Cập nhật thành công');
      } else {
        await ingredientApi.create(formData);
        alert('Thêm mới thành công');
      }
      setShowForm(false);
      fetchIngredients();
    } catch {
      alert('Lỗi khi lưu dữ liệu');
    }
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <>
    <ImportForm/>
    <div className="container mt-4">
      <h2>Quản lý nguyên liệu</h2>
      <button className="btn btn-success mb-3" onClick={handleAddNew}>Thêm nguyên liệu mới</button>

      <table className="table table-bordered align-middle">
        <thead>
          <tr>
            <th>ID</th>
            <th>Category ID</th>
            <th>Tên nguyên liệu</th>
            <th>Đơn vị</th>
            <th>Tồn kho</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {ingredients.length === 0 && (
            <tr><td colSpan={6} className="text-center">Không có dữ liệu</td></tr>
          )}
          {ingredients.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.category_id}</td>
              <td>{item.name}</td>
              <td>{item.unit}</td>
              <td>{item.stock_quantity}</td>
              <td>
                <button className="btn btn-primary btn-sm me-2" onClick={() => handleEdit(item)}>Sửa</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Form */}
      {showForm && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <form onSubmit={handleFormSubmit} className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{formData.id ? 'Sửa nguyên liệu' : 'Thêm nguyên liệu'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowForm(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Tên nguyên liệu</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Đơn vị</label>
                  <input
                    type="text"
                    className="form-control"
                    name="unit"
                    value={formData.unit}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Category ID</label>
                  <input
                    type="number"
                    className="form-control"
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Số lượng tồn kho</label>
                  <input
                    type="number"
                    className="form-control"
                    name="stock_quantity"
                    value={formData.stock_quantity}
                    onChange={handleFormChange}
                    required
                    min="0"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default IngredientList;
