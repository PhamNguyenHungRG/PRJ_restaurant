import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '' });
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/dashboard/categories');
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error('Lỗi tải danh mục:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId
      ? `http://localhost:8000/api/dashboard/categories/${editingId}`
      : 'http://localhost:8000/api/dashboard/categories';

    const method = editingId ? 'PUT' : 'POST';

    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setForm({ name: '' });
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      console.error('Lỗi gửi form:', err);
    }
  };

  const handleEdit = (category) => {
    setForm({ name: category.name });
    setEditingId(category.id);
  };

  const handleToggle = async (id) => {
    try {
      await fetch(`http://localhost:8000/api/dashboard/categories/${id}/toggle`, {
        method: 'PATCH',
      });
      fetchCategories();
    } catch (err) {
      console.error('Lỗi đổi trạng thái danh mục:', err);
    }
  };

  const colors = {
    background: '#fff',
    containerBg: '#fff9e6', // vàng nhạt nhẹ
    textPrimary: '#000',
    gold: '#d4af37',
    btnDefault: '#f5f5dc',
    btnHover: '#d4af37',
    borderColor: '#d4af37',
  };

  return (
    <div
      className="container my-5"
      style={{
        minHeight: '80vh',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: colors.textPrimary,
      }}
    >
      <div
        className="p-4 rounded shadow"
        style={{
          backgroundColor: colors.containerBg,
          border: `1.5px solid ${colors.borderColor}`,
          borderRadius: '20px',
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2
            className="fw-bold"
            style={{
              color: colors.gold,
              textTransform: 'uppercase',
              letterSpacing: '2px',
              fontSize: '1.8rem',
            }}
          >
            📂 Quản lý danh mục
          </h2>
          <button
            className="btn"
            onClick={() => navigate('/dashboard')}
            style={{
              backgroundColor: colors.btnDefault,
              color: colors.textPrimary,
              borderRadius: '12px',
              border: `1px solid ${colors.gold}`,
              fontWeight: '600',
              padding: '0.4rem 1rem',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = colors.btnHover;
              e.target.style.color = colors.background;
              e.target.style.boxShadow = `0 0 8px ${colors.gold}`;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = colors.btnDefault;
              e.target.style.color = colors.textPrimary;
              e.target.style.boxShadow = 'none';
            }}
          >
            ← Quay lại Dashboard
          </button>
        </div>

        <form onSubmit={handleSubmit} className="row g-3 mb-4">
          <div className="col-md-8">
            <input
              type="text"
              placeholder="Tên danh mục"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="form-control"
              style={{
                borderRadius: '12px',
                borderColor: colors.gold,
                fontWeight: '600',
              }}
            />
          </div>
          <div className="col-md-4 text-end">
            <button
              type="submit"
              className="btn"
              style={{
                backgroundColor: colors.btnDefault,
                color: colors.textPrimary,
                borderRadius: '12px',
                border: `1px solid ${colors.gold}`,
                fontWeight: '600',
                width: '100%',
                padding: '0.5rem 0',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = colors.btnHover;
                e.target.style.color = colors.background;
                e.target.style.boxShadow = `0 0 8px ${colors.gold}`;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = colors.btnDefault;
                e.target.style.color = colors.textPrimary;
                e.target.style.boxShadow = 'none';
              }}
            >
              {editingId ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>

        <table className="table table-hover align-middle" style={{ borderRadius: '20px', overflow: 'hidden' }}>
          <thead
            className="table-light"
            style={{ borderBottom: `3px solid ${colors.gold}`, fontWeight: '700' }}
          >
            <tr className="text-center" style={{ color: colors.gold }}>
              <th>Tên danh mục</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} style={{ borderBottom: `1px solid ${colors.borderColor}55` }}>
                <td>{cat.name}</td>
                <td className="text-center">
                  <span
                    className={`badge`}
                    style={{
                      backgroundColor: cat.active ? colors.gold : '#ccc',
                      color: cat.active ? '#fff' : '#333',
                      fontWeight: '600',
                      padding: '0.4em 0.8em',
                      borderRadius: '12px',
                      userSelect: 'none',
                    }}
                  >
                    {cat.active ? 'Hiển thị' : 'Ẩn'}
                  </span>
                </td>
                <td className="text-center">
                  <button
                    className="btn btn-sm me-2"
                    onClick={() => handleEdit(cat)}
                    style={{
                      borderRadius: '12px',
                      border: `1px solid ${colors.gold}`,
                      backgroundColor: 'transparent',
                      color: colors.gold,
                      fontWeight: '600',
                      padding: '0.25rem 0.6rem',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = colors.gold;
                      e.target.style.color = colors.background;
                      e.target.style.boxShadow = `0 0 8px ${colors.gold}`;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = colors.gold;
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    Sửa
                  </button>
                  <button
                    className="btn btn-sm"
                    onClick={() => handleToggle(cat.id)}
                    style={{
                      borderRadius: '12px',
                      border: `1px solid ${colors.gold}`,
                      backgroundColor: 'transparent',
                      color: colors.gold,
                      fontWeight: '600',
                      padding: '0.25rem 0.6rem',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = colors.gold;
                      e.target.style.color = colors.background;
                      e.target.style.boxShadow = `0 0 8px ${colors.gold}`;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = colors.gold;
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    Đổi trạng thái
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryManager;
