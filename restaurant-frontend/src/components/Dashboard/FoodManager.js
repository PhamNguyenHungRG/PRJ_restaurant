import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const FoodManager = () => {
    const [foods, setFoods] = useState([]);
    const [form, setForm] = useState({ name: '', price: '', category_id: '', image: null, oldImage: '' });
    const [categories, setCategories] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const itemsPerPage = 20;
    const navigate = useNavigate();

    useEffect(() => {
        fetchFoods();
        fetchCategories();
    }, []);

    const fetchFoods = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:8000/api/dashboard/foods');
            setFoods(res.data);
        } catch (err) {
            console.error('Lỗi tải món ăn:', err);
            toast.error('Lỗi tải danh sách món ăn');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/dashboard/categories');
            setCategories(res.data.filter(c => c.status));
        } catch (err) {
            console.error('Lỗi tải danh mục:', err);
            toast.error('Lỗi tải danh mục');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('price', form.price);
        formData.append('category_id', form.category_id);

        if (form.image) {
            formData.append('image', form.image);
        }

        const url = editingId
            ? `http://localhost:8000/api/dashboard/foods/${editingId}`
            : 'http://localhost:8000/api/dashboard/foods';

        try {
            const response = await axios.post(url, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                ...(editingId && { params: { _method: 'PUT' } })
            });

            toast.success(editingId ? '✅ Cập nhật món thành công' : '✅ Đã thêm món mới');
            setForm({ name: '', price: '', category_id: '', image: null, oldImage: '' });
            setEditingId(null);
            fetchFoods();
        } catch (err) {
            console.error('Lỗi gửi form:', err);
            toast.error('❌ Cập nhật thất bại');
        }
    };

    const handleEdit = (food) => {
        setForm({
            name: food.name,
            price: food.price,
            category_id: food.category_id,
            image: null,
            oldImage: food.image,
        });
        setEditingId(food.id);
    };

    const handleToggle = async (id) => {
        const confirm = window.confirm('Bạn có chắc muốn thay đổi trạng thái món này?');
        if (!confirm) return;

        try {
            await axios.patch(`http://localhost:8000/api/dashboard/foods/${id}/toggle`);
            toast.success('Đã cập nhật trạng thái món');
            fetchFoods();
        } catch (err) {
            console.error('Lỗi đổi trạng thái:', err);
            toast.error('Không thể cập nhật trạng thái');
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentFoods = foods.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(foods.length / itemsPerPage);

    return (
        <div className="container my-5">
            <ToastContainer />
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-primary fw-bold mb-0">📋 Quản lý món ăn</h2>
                <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
                    ⬅️ Quay về Dashboard
                </button>
            </div>

            <div className="card shadow-sm p-4 mb-5">
                <form onSubmit={handleSubmit} className="row g-3">
                    <div className="col-md-6">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Tên món"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <input
                            type="number"
                            min="0"
                            className="form-control"
                            placeholder="Giá"
                            value={form.price}
                            onChange={(e) => setForm({ ...form, price: e.target.value })}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <select
                            className="form-select"
                            value={form.category_id}
                            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                            required
                        >
                            <option value="">-- Chọn danh mục --</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-6">
                        <input
                            type="file"
                            className="form-control"
                            accept="image/*"
                            onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
                        />
                    </div>

                    {editingId && form.oldImage && (
                        <div className="col-12">
                            <label className="form-label">Ảnh hiện tại:</label><br />
                            <img
                                src={`http://localhost:8000/${form.oldImage}`}
                                alt="Ảnh cũ"
                                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                className="img-thumbnail"
                            />
                        </div>
                    )}

                    <div className="col-12">
                        <button type="submit" className="btn btn-primary w-100">
                            {editingId ? 'Cập nhật món' : 'Thêm món'}
                        </button>
                    </div>
                </form>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status" />
                    <p className="mt-2">Đang tải dữ liệu...</p>
                </div>
            ) : (
                <>
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped table-sm table-hover align-middle text-center">
                            <thead className="table-light">
                            <tr>
                                <th>Tên món</th>
                                <th>Giá</th>
                                <th>Danh mục</th>
                                <th>Ảnh</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentFoods.map(food => (
                                <tr key={food.id}>
                                    <td>{food.name}</td>
                                    <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(food.price)}</td>
                                    <td>{food.category?.name}</td>
                                    <td>
                                        {food.image ? (
                                            <img
                                                src={`http://localhost:8000/${food.image}`}
                                                alt={food.name}
                                                className="img-thumbnail"
                                                style={{ width: '64px', height: '64px', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <span className="text-muted">Không có ảnh</span>
                                        )}
                                    </td>
                                    <td>
                                            <span className={`badge ${food.active ? 'bg-success' : 'bg-secondary'}`}>
                                                {food.active ? 'Hiện' : 'Ẩn'}
                                            </span>
                                    </td>
                                    <td>
                                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(food)}>Sửa</button>
                                        <button
                                            className={`btn btn-sm ${food.active ? 'btn-outline-danger' : 'btn-outline-success'}`}
                                            onClick={() => handleToggle(food.id)}
                                        >
                                            {food.active ? 'Ẩn' : 'Hiện'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {foods.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-muted py-3">Không có món nào.</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <nav className="mt-4">
                            <ul className="pagination justify-content-center">
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                        <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                                            {i + 1}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    )}
                </>
            )}
        </div>
    );
};

export default FoodManager;
