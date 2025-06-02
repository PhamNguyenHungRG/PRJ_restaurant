import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const goldenColor = '#D4AF37'; // Vàng ánh kim
const lightYellowBg = '#FFF9E3'; // Vàng nhạt nhẹ nhàng
const borderRadius = '20px';
const fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";

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
        <div
            className="container my-5"
            style={{
                backgroundColor: lightYellowBg,
                borderRadius: borderRadius,
                border: `2px solid ${goldenColor}`,
                padding: '2rem',
                fontFamily: fontFamily,
            }}
        >
            <ToastContainer />
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2
                    style={{
                        color: goldenColor,
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em',
                        fontWeight: 'bold',
                    }}
                >
                    📋 Quản lý món ăn
                </h2>
                <button
                    className="btn"
                    onClick={() => navigate('/dashboard')}
                    style={{
                        borderRadius: borderRadius,
                        border: `2px solid ${goldenColor}`,
                        backgroundColor: 'transparent',
                        color: goldenColor,
                        padding: '0.4rem 1rem',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = goldenColor;
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.boxShadow = `0 0 8px ${goldenColor}`;
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = goldenColor;
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                >
                    ⬅️ Quay về Dashboard
                </button>
            </div>

            <div
                className="card shadow-sm p-4 mb-5"
                style={{
                    borderRadius: borderRadius,
                    border: `2px solid ${goldenColor}`,
                    backgroundColor: '#fff',
                }}
            >
                <form onSubmit={handleSubmit} className="row g-3">
                    <div className="col-md-6">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Tên món"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                            style={{
                                borderRadius: borderRadius,
                                border: `2px solid ${goldenColor}`,
                                backgroundColor: lightYellowBg,
                                color: '#333',
                                fontWeight: '500',
                                transition: 'border-color 0.3s ease',
                            }}
                            onFocus={e => (e.target.style.borderColor = goldenColor)}
                            onBlur={e => (e.target.style.borderColor = `2px solid ${goldenColor}`)}
                            onMouseEnter={e => (e.target.style.borderColor = goldenColor)}
                            onMouseLeave={e => (e.target.style.borderColor = `2px solid ${goldenColor}`)}
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
                            style={{
                                borderRadius: borderRadius,
                                border: `2px solid ${goldenColor}`,
                                backgroundColor: lightYellowBg,
                                color: '#333',
                                fontWeight: '500',
                                transition: 'border-color 0.3s ease',
                            }}
                            onFocus={e => (e.target.style.borderColor = goldenColor)}
                            onBlur={e => (e.target.style.borderColor = `2px solid ${goldenColor}`)}
                            onMouseEnter={e => (e.target.style.borderColor = goldenColor)}
                            onMouseLeave={e => (e.target.style.borderColor = `2px solid ${goldenColor}`)}
                        />
                    </div>
                    <div className="col-md-6">
                        <select
                            className="form-select"
                            value={form.category_id}
                            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                            required
                            style={{
                                borderRadius: borderRadius,
                                border: `2px solid ${goldenColor}`,
                                backgroundColor: lightYellowBg,
                                color: '#333',
                                fontWeight: '500',
                                transition: 'border-color 0.3s ease',
                            }}
                            onFocus={e => (e.target.style.borderColor = goldenColor)}
                            onBlur={e => (e.target.style.borderColor = `2px solid ${goldenColor}`)}
                            onMouseEnter={e => (e.target.style.borderColor = goldenColor)}
                            onMouseLeave={e => (e.target.style.borderColor = `2px solid ${goldenColor}`)}
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
                            style={{
                                borderRadius: borderRadius,
                                border: `2px solid ${goldenColor}`,
                                backgroundColor: lightYellowBg,
                                color: '#333',
                                fontWeight: '500',
                                transition: 'border-color 0.3s ease',
                            }}
                            onFocus={e => (e.target.style.borderColor = goldenColor)}
                            onBlur={e => (e.target.style.borderColor = `2px solid ${goldenColor}`)}
                            onMouseEnter={e => (e.target.style.borderColor = goldenColor)}
                            onMouseLeave={e => (e.target.style.borderColor = `2px solid ${goldenColor}`)}
                        />
                    </div>

                    {editingId && form.oldImage && (
                        <div className="col-12">
                            <label className="form-label" style={{ fontWeight: '600', color: goldenColor }}>
                                Ảnh hiện tại:
                            </label><br />
                            <img
                                src={`http://localhost:8000/${form.oldImage}`}
                                alt="Ảnh cũ"
                                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: borderRadius, border: `2px solid ${goldenColor}` }}
                                className="img-thumbnail"
                            />
                        </div>
                    )}

                    <div className="col-12">
                        <button
                            type="submit"
                            className="btn w-100"
                            style={{
                                borderRadius: borderRadius,
                                border: `2px solid ${goldenColor}`,
                                backgroundColor: lightYellowBg,
                                color: goldenColor,
                                fontWeight: '700',
                                padding: '0.6rem',
                                transition: 'all 0.3s ease',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.backgroundColor = goldenColor;
                                e.currentTarget.style.color = 'white';
                                e.currentTarget.style.boxShadow = `0 0 10px ${goldenColor}`;
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.backgroundColor = lightYellowBg;
                                e.currentTarget.style.color = goldenColor;
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            {editingId ? 'Cập nhật món' : 'Thêm món'}
                        </button>
                    </div>
                </form>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <div
                        className="spinner-border"
                        role="status"
                        style={{ borderColor: goldenColor, borderTopColor: 'transparent' }}
                    />
                    <p className="mt-2" style={{ color: goldenColor, fontWeight: '600' }}>
                        Đang tải dữ liệu...
                    </p>
                </div>
            ) : (
                <>
                    <div className="table-responsive">
                        <table
                            className="table table-bordered table-striped table-sm table-hover align-middle text-center"
                            style={{
                                borderRadius: borderRadius,
                                border: `1px solid ${goldenColor}`,
                                overflow: 'hidden',
                                fontFamily: fontFamily,
                            }}
                        >
                            <thead
                                style={{
                                    backgroundColor: goldenColor,
                                    color: '#fff',
                                    borderRadius: borderRadius,
                                }}
                            >
                                <tr>
                                    {['Tên món', 'Giá', 'Danh mục', 'Ảnh', 'Trạng thái', 'Hành động'].map((th, idx) => (
                                        <th
                                            key={idx}
                                            style={{ fontWeight: '700', userSelect: 'none' }}
                                        >
                                            {th}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {currentFoods.map(food => (
                                    <tr
                                        key={food.id}
                                        style={{
                                            backgroundColor: '#fff',
                                            transition: 'background-color 0.3s ease',
                                        }}
                                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = lightYellowBg)}
                                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#fff')}
                                    >
                                        <td style={{ verticalAlign: 'middle' }}>{food.name}</td>
                                        <td style={{ verticalAlign: 'middle' }}>
                                            {Number(food.price).toLocaleString()} ₫
                                        </td>
                                        <td style={{ verticalAlign: 'middle' }}>{food.category?.name || 'Không xác định'}</td>
                                        <td>
                                            <img
                                                src={`http://localhost:8000/${food.image}`}
                                                alt={food.name}
                                                style={{
                                                    width: '100px',
                                                    height: '100px',
                                                    objectFit: 'cover',
                                                    borderRadius: borderRadius,
                                                    border: `1.5px solid ${goldenColor}`,
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <span
                                                onClick={() => handleToggle(food.id)}
                                                style={{
                                                    cursor: 'pointer',
                                                    padding: '0.3rem 0.7rem',
                                                    borderRadius: borderRadius,
                                                    backgroundColor: food.status ? '#4CAF50' : '#B22222',
                                                    color: 'white',
                                                    fontWeight: '600',
                                                    userSelect: 'none',
                                                    boxShadow: '0 0 8px rgba(0,0,0,0.2)',
                                                    transition: 'background-color 0.3s ease',
                                                }}
                                                title="Click để thay đổi trạng thái"
                                            >
                                                {food.status ? 'Hoạt động' : 'Tạm dừng'}
                                            </span>
                                        </td>
                                        <td style={{ verticalAlign: 'middle' }}>
                                            <button
                                                className="btn btn-sm"
                                                onClick={() => handleEdit(food)}
                                                style={{
                                                    backgroundColor: goldenColor,
                                                    color: 'white',
                                                    borderRadius: borderRadius,
                                                    fontWeight: '600',
                                                    padding: '0.25rem 0.6rem',
                                                    marginRight: '0.3rem',
                                                    boxShadow: `0 0 6px ${goldenColor}`,
                                                    transition: 'background-color 0.3s ease',
                                                }}
                                                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#b38f19')}
                                                onMouseLeave={e => (e.currentTarget.style.backgroundColor = goldenColor)}
                                            >
                                                Sửa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <nav className="d-flex justify-content-center mt-4">
                        <ul className="pagination pagination-sm">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                    style={{ borderRadius: borderRadius }}
                                >
                                    &laquo;
                                </button>
                            </li>
                            {[...Array(totalPages)].map((_, idx) => (
                                <li
                                    key={idx}
                                    className={`page-item ${currentPage === idx + 1 ? 'active' : ''}`}
                                >
                                    <button
                                        className="page-link"
                                        onClick={() => setCurrentPage(idx + 1)}
                                        style={{ borderRadius: borderRadius }}
                                    >
                                        {idx + 1}
                                    </button>
                                </li>
                            ))}
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                                    style={{ borderRadius: borderRadius }}
                                >
                                    &raquo;
                                </button>
                            </li>
                        </ul>
                    </nav>
                </>
            )}
        </div>
    );
};

export default FoodManager;
