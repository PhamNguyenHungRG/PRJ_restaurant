import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EmployeeManager = () => {
    const [employees, setEmployees] = useState([]);
    const [roles, setRoles] = useState([]);
    const [form, setForm] = useState({ name: '', staff_code: '', role_id: '', password: '' });
    const [editingId, setEditingId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRoles();
        fetchEmployees();
    }, []);

    const fetchRoles = async () => {
        try {
            const res = await fetch('http://localhost:8000/api/dashboard/dashboard/roles');
            if (!res.ok) throw new Error('Failed to fetch roles');
            const data = await res.json();
            console.log('Dữ liệu roles:', data); // Kiểm tra console
            setRoles(data);
        } catch (err) {
            console.error('Lỗi tải vai trò:', err);
        }
    };

    const fetchEmployees = async () => {
        try {
            const res = await fetch('http://localhost:8000/api/dashboard/users');
            if (!res.ok) throw new Error('Failed to fetch employees');
            const data = await res.json();
            setEmployees(data);
        } catch (err) {
            console.error('Lỗi tải danh sách nhân viên:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const url = editingId
            ? `http://localhost:8000/api/dashboard/users/${editingId}`
            : 'http://localhost:8000/api/dashboard/users';

        const payload = {
            ...form,
            ...(editingId && { _method: 'PUT' }),
        };

        try {
            await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            setForm({ name: '', staff_code: '', role_id: '', password: '' });
            setEditingId(null);
            fetchEmployees();
        } catch (err) {
            console.error('Lỗi gửi form:', err);
        }
    };

    const handleEdit = (employee) => {
        setForm({
            name: employee.name,
            staff_code: employee.staff_code,
            role_id: String(employee.role_id), // Đảm bảo là chuỗi
            password: '',
        });
        setEditingId(employee.id);
    };

    const handleToggle = async (id) => {
        try {
            await fetch(`http://localhost:8000/api/dashboard/users/${id}/toggle`, {
                method: 'PATCH',
            });
            fetchEmployees();
        } catch (err) {
            console.error('Lỗi đổi trạng thái:', err);
        }
    };

    return (
        <div className="container my-5">
            <div className="bg-white p-4 p-md-5 rounded shadow border border-light">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="text-primary fw-bold">👨‍🍳 Quản lý nhân viên</h2>
                    <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
                        ← Quay lại Dashboard
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="row g-3 mb-4">
                    <div className="col-md-3">
                        <input
                            type="text"
                            placeholder="Tên nhân viên"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                            className="form-control"
                        />
                    </div>
                    <div className="col-md-3">
                        <input
                            type="text"
                            placeholder="Mã nhân viên (VD: PV01)"
                            value={form.staff_code}
                            onChange={(e) => setForm({ ...form, staff_code: e.target.value })}
                            required
                            className="form-control"
                            disabled={!!editingId}
                        />
                    </div>
                    <div className="col-md-3">
                        <select
                            className="form-select"
                            value={form.role_id}
                            onChange={(e) => setForm({ ...form, role_id: e.target.value })}
                            required
                        >
                            <option value="">-- Chọn vai trò --</option>
                            {roles.length > 0 ? (
                                roles.map((role) => (
                                    <option key={role.id} value={role.id}>
                                        {role.role_name}
                                    </option>
                                ))
                            ) : (
                                <option disabled>Không có vai trò</option>
                            )}
                        </select>
                    </div>
                    <div className="col-md-3">
                        <input
                            type="password"
                            placeholder={editingId ? "Mật khẩu mới (nếu đổi)" : "Mật khẩu"}
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className="form-control"
                            required={!editingId}
                        />
                    </div>
                    <div className="col-12 text-end">
                        <button type="submit" className="btn btn-success px-4">
                            {editingId ? 'Cập nhật' : 'Thêm'}
                        </button>
                    </div>
                </form>

                <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                        <thead className="table-light">
                            <tr className="text-center">
                                <th>Tên</th>
                                <th>Mã</th>
                                <th>Vai trò</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((emp) => (
                                <tr key={emp.id}>
                                    <td>{emp.name}</td>
                                    <td>{emp.staff_code}</td>
                                    <td>{emp.role?.role_name || 'Không rõ'}</td>
                                    <td className="text-center">
                                        <span className={`badge bg-${emp.active ? 'success' : 'secondary'}`}>
                                            {emp.active ? 'Hoạt động' : 'Ẩn'}
                                        </span>
                                    </td>
                                    <td className="text-center">
                                        <button
                                            className="btn btn-sm btn-outline-info me-2"
                                            onClick={() => handleEdit(emp)}
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-warning"
                                            onClick={() => handleToggle(emp.id)}
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
        </div>
    );
};

export default EmployeeManager;
