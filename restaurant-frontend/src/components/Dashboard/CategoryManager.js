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
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
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

    return (
        <div className="container my-5">
            <div className="bg-white p-4 p-md-5 rounded shadow border border-light">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="text-primary fw-bold">📂 Quản lý danh mục</h2>
                    <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
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
                        />
                    </div>
                    <div className="col-md-4 text-end">
                        <button type="submit" className="btn btn-success w-100">
                            {editingId ? 'Cập nhật' : 'Thêm mới'}
                        </button>
                    </div>
                </form>

                <table className="table table-bordered table-hover align-middle">
                    <thead className="table-light">
                    <tr className="text-center">
                        <th>Tên danh mục</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                    </thead>
                    <tbody>
                    {categories.map(cat => (
                        <tr key={cat.id}>
                            <td>{cat.name}</td>
                            <td className="text-center">
                                <span className={`badge bg-${cat.active ? 'success' : 'secondary'}`}>
                                    {cat.active ? 'Hiển thị' : 'Ẩn'}
                                </span>
                            </td>
                            <td className="text-center">
                                <button className="btn btn-sm btn-outline-info me-2" onClick={() => handleEdit(cat)}>
                                    Sửa
                                </button>
                                <button className="btn btn-sm btn-outline-warning" onClick={() => handleToggle(cat.id)}>
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
