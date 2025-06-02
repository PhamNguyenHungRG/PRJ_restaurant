// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const EmployeeManager = () => {
//     const [employees, setEmployees] = useState([]);
//     const [roles, setRoles] = useState([]);
//     const [form, setForm] = useState({ name: '', staff_code: '', role_id: '', password: '' });
//     const [editingId, setEditingId] = useState(null);
//     const navigate = useNavigate();

//     useEffect(() => {
//         fetchRoles();
//         fetchEmployees();
//     }, []);

//     const fetchRoles = async () => {
//         try {
//             const res = await fetch('http://localhost:8000/api/dashboard/dashboard/roles');
//             if (!res.ok) throw new Error('Failed to fetch roles');
//             const data = await res.json();
//             console.log('Dữ liệu roles:', data); // Kiểm tra console
//             setRoles(data);
//         } catch (err) {
//             console.error('Lỗi tải vai trò:', err);
//         }
//     };

//     const fetchEmployees = async () => {
//         try {
//             const res = await fetch('http://localhost:8000/api/dashboard/users');
//             if (!res.ok) throw new Error('Failed to fetch employees');
//             const data = await res.json();
//             setEmployees(data);
//         } catch (err) {
//             console.error('Lỗi tải danh sách nhân viên:', err);
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         const url = editingId
//             ? `http://localhost:8000/api/dashboard/users/${editingId}`
//             : 'http://localhost:8000/api/dashboard/users';

//         const payload = {
//             ...form,
//             ...(editingId && { _method: 'PUT' }),
//         };

//         try {
//             await fetch(url, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(payload),
//             });

//             setForm({ name: '', staff_code: '', role_id: '', password: '' });
//             setEditingId(null);
//             fetchEmployees();
//         } catch (err) {
//             console.error('Lỗi gửi form:', err);
//         }
//     };

//     const handleEdit = (employee) => {
//         setForm({
//             name: employee.name,
//             staff_code: employee.staff_code,
//             role_id: String(employee.role_id), // Đảm bảo là chuỗi
//             password: '',
//         });
//         setEditingId(employee.id);
//     };

//     const handleToggle = async (id) => {
//         try {
//             await fetch(`http://localhost:8000/api/dashboard/users/${id}/toggle`, {
//                 method: 'PATCH',
//             });
//             fetchEmployees();
//         } catch (err) {
//             console.error('Lỗi đổi trạng thái:', err);
//         }
//     };

//     return (
//         <div className="container my-5">
//             <div className="bg-white p-4 p-md-5 rounded shadow border border-light">
//                 <div className="d-flex justify-content-between align-items-center mb-4">
//                     <h2 className="text-primary fw-bold">👨‍🍳 Quản lý nhân viên</h2>
//                     <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
//                         ← Quay lại Dashboard
//                     </button>
//                 </div>

//                 <form onSubmit={handleSubmit} className="row g-3 mb-4">
//                     <div className="col-md-3">
//                         <input
//                             type="text"
//                             placeholder="Tên nhân viên"
//                             value={form.name}
//                             onChange={(e) => setForm({ ...form, name: e.target.value })}
//                             required
//                             className="form-control"
//                         />
//                     </div>
//                     <div className="col-md-3">
//                         <input
//                             type="text"
//                             placeholder="Mã nhân viên (VD: PV01)"
//                             value={form.staff_code}
//                             onChange={(e) => setForm({ ...form, staff_code: e.target.value })}
//                             required
//                             className="form-control"
//                             disabled={!!editingId}
//                         />
//                     </div>
//                     <div className="col-md-3">
//                         <select
//                             className="form-select"
//                             value={form.role_id}
//                             onChange={(e) => setForm({ ...form, role_id: e.target.value })}
//                             required
//                         >
//                             <option value="">-- Chọn vai trò --</option>
//                             {roles.length > 0 ? (
//                                 roles.map((role) => (
//                                     <option key={role.id} value={role.id}>
//                                         {role.role_name}
//                                     </option>
//                                 ))
//                             ) : (
//                                 <option disabled>Không có vai trò</option>
//                             )}
//                         </select>
//                     </div>
//                     <div className="col-md-3">
//                         <input
//                             type="password"
//                             placeholder={editingId ? "Mật khẩu mới (nếu đổi)" : "Mật khẩu"}
//                             value={form.password}
//                             onChange={(e) => setForm({ ...form, password: e.target.value })}
//                             className="form-control"
//                             required={!editingId}
//                         />
//                     </div>
//                     <div className="col-12 text-end">
//                         <button type="submit" className="btn btn-success px-4">
//                             {editingId ? 'Cập nhật' : 'Thêm'}
//                         </button>
//                     </div>
//                 </form>

//                 <div className="table-responsive">
//                     <table className="table table-bordered table-hover">
//                         <thead className="table-light">
//                             <tr className="text-center">
//                                 <th>Tên</th>
//                                 <th>Mã</th>
//                                 <th>Vai trò</th>
//                                 <th>Trạng thái</th>
//                                 <th>Hành động</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {employees.map((emp) => (
//                                 <tr key={emp.id}>
//                                     <td>{emp.name}</td>
//                                     <td>{emp.staff_code}</td>
//                                     <td>{emp.role?.role_name || 'Không rõ'}</td>
//                                     <td className="text-center">
//                                         <span className={`badge bg-${emp.active ? 'success' : 'secondary'}`}>
//                                             {emp.active ? 'Hoạt động' : 'Ẩn'}
//                                         </span>
//                                     </td>
//                                     <td className="text-center">
//                                         <button
//                                             className="btn btn-sm btn-outline-info me-2"
//                                             onClick={() => handleEdit(emp)}
//                                         >
//                                             Sửa
//                                         </button>
//                                         <button
//                                             className="btn btn-sm btn-outline-warning"
//                                             onClick={() => handleToggle(emp.id)}
//                                         >
//                                             Đổi trạng thái
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EmployeeManager;
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const goldColors = {
  light: '#fff9e6',
  border: '#d4af37',
  text: '#bfa335',
  hover: '#f7d358',
  bgHover: '#fff3b0',
  tableHeader: '#f2d27f',
  buttonBg: '#fff9e6',
};

const styles = {
  container: {
    backgroundColor: goldColors.light,
    borderRadius: 20,
    border: `2px solid ${goldColors.border}`,
    padding: '2rem',
  },
  title: {
    color: goldColors.text,
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    fontWeight: 700,
  },
  formRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    marginBottom: '1rem',
  },
  input: {
    flex: '1 1 23%',
    borderRadius: 10,
    border: `2px solid ${goldColors.border}`,
    backgroundColor: goldColors.buttonBg,
    color: '#444',
    padding: '0.375rem 0.75rem',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
  },
  inputFocus: {
    borderColor: goldColors.hover,
    boxShadow: `0 0 8px ${goldColors.hover}`,
    backgroundColor: '#fff',
    outline: 'none',
  },
  buttonSuccess: {
    borderRadius: 10,
    border: `2px solid ${goldColors.border}`,
    backgroundColor: goldColors.buttonBg,
    color: goldColors.text,
    fontWeight: 600,
    padding: '0.375rem 1.5rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  buttonSuccessHover: {
    backgroundColor: goldColors.hover,
    color: '#fff',
    borderColor: goldColors.hover,
    boxShadow: `0 0 10px ${goldColors.hover}`,
  },
  buttonSecondary: {
    borderRadius: 10,
    border: `2px solid ${goldColors.border}`,
    backgroundColor: goldColors.buttonBg,
    color: goldColors.text,
    fontWeight: 600,
    padding: '0.375rem 1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  buttonSecondaryHover: {
    backgroundColor: goldColors.hover,
    color: '#fff',
    borderColor: goldColors.hover,
    boxShadow: `0 0 10px ${goldColors.hover}`,
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: 0,
    borderRadius: 15,
    overflow: 'hidden',
    boxShadow: '0 0 10px #d4af3755',
  },
  thead: {
    backgroundColor: goldColors.tableHeader,
    color: '#5a4a00',
  },
  th: {
    border: `1px solid ${goldColors.border}`,
    padding: '0.75rem',
    textAlign: 'center',
  },
  td: {
    border: `1px solid ${goldColors.border}`,
    padding: '0.75rem',
    textAlign: 'center',
    verticalAlign: 'middle',
  },
  btnOutline: {
    border: `2px solid ${goldColors.border}`,
    color: goldColors.text,
    borderRadius: 10,
    backgroundColor: 'transparent',
    fontWeight: 600,
    padding: '0.25rem 0.75rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginRight: '0.5rem',
  },
  btnOutlineHover: {
    backgroundColor: goldColors.hover,
    color: '#fff',
    borderColor: goldColors.hover,
    boxShadow: `0 0 10px ${goldColors.hover}`,
  },
};

const EmployeeManager = () => {
  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({ name: '', staff_code: '', role_id: '', password: '' });
  const [editingId, setEditingId] = useState(null);
  const [hoveredButtonId, setHoveredButtonId] = useState(null);
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
      setRoles(data);
    } catch (err) {
      console.error('Error loading roles:', err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/dashboard/users');
      if (!res.ok) throw new Error('Failed to fetch employees');
      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      console.error('Error loading employees:', err);
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
      console.error('Error submitting form:', err);
    }
  };

  const handleEdit = (employee) => {
    setForm({
      name: employee.name,
      staff_code: employee.staff_code,
      role_id: String(employee.role_id),
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
      console.error('Error toggling status:', err);
    }
  };

  // To handle hover style for buttons with inline styles
  const [btnHoverId, setBtnHoverId] = useState(null);
  const [btnHoverType, setBtnHoverType] = useState(null);

  return (
    <div style={styles.container}>
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: 20, boxShadow: '0 0 15px #d4af3755', border: `1px solid ${goldColors.border}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={styles.title}>👨‍🍳 Quản lý nhân viên</h2>
          <button
            style={{ ...styles.buttonSecondary }}
            onClick={() => navigate('/dashboard')}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = goldColors.hover, e.currentTarget.style.color = '#fff', e.currentTarget.style.borderColor = goldColors.hover, e.currentTarget.style.boxShadow = `0 0 10px ${goldColors.hover}`)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = goldColors.buttonBg, e.currentTarget.style.color = goldColors.text, e.currentTarget.style.borderColor = goldColors.border, e.currentTarget.style.boxShadow = 'none')}
          >
            ← Quay lại Dashboard
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.formRow} noValidate>
          <input
            type="text"
            placeholder="Tên nhân viên"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            style={styles.input}
            onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
            onBlur={(e) => Object.assign(e.target.style, styles.input)}
          />
          <input
            type="text"
            placeholder="Mã nhân viên (VD: PV01)"
            value={form.staff_code}
            onChange={(e) => setForm({ ...form, staff_code: e.target.value })}
            required
            style={{ ...styles.input, ...(editingId ? { backgroundColor: '#eee', cursor: 'not-allowed' } : {}) }}
            disabled={!!editingId}
            onFocus={(e) => !editingId && Object.assign(e.target.style, styles.inputFocus)}
            onBlur={(e) => !editingId && Object.assign(e.target.style, styles.input)}
          />
          <select
            value={form.role_id}
            onChange={(e) => setForm({ ...form, role_id: e.target.value })}
            required
            style={styles.input}
            onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
            onBlur={(e) => Object.assign(e.target.style, styles.input)}
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
          <input
            type="password"
            placeholder={editingId ? 'Mật khẩu mới (nếu đổi)' : 'Mật khẩu'}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={styles.input}
            required={!editingId}
            onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
            onBlur={(e) => Object.assign(e.target.style, styles.input)}
          />
          <div style={{ flex: '1 1 100%', textAlign: 'right' }}>
            <button
              type="submit"
              style={styles.buttonSuccess}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.buttonSuccessHover)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.buttonSuccess)}
            >
              {editingId ? 'Cập nhật' : 'Thêm'}
            </button>
          </div>
        </form>

        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead style={styles.thead}>
              <tr>
                <th style={styles.th}>Tên</th>
                <th style={styles.th}>Mã</th>
                <th style={styles.th}>Vai trò</th>
                <th style={styles.th}>Trạng thái</th>
                <th style={styles.th}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {employees.length > 0 ? (
                employees.map((emp) => (
                  <tr key={emp.id}>
                    <td style={styles.td}>{emp.name}</td>
                    <td style={styles.td}>{emp.staff_code}</td>
                    <td style={styles.td}>{emp.role_name}</td>
                    <td style={styles.td}>{emp.status === 1 ? 'Hoạt động' : 'Khóa'}</td>
                    <td style={styles.td}>
                      <button
                        style={styles.btnOutline}
                        onClick={() => handleEdit(emp)}
                        onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.btnOutlineHover)}
                        onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.btnOutline)}
                      >
                        Sửa
                      </button>
                      <button
                        style={{ ...styles.btnOutline }}
                        onClick={() => handleToggle(emp.id)}
                        onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.btnOutlineHover)}
                        onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.btnOutline)}
                      >
                        {emp.status === 1 ? 'Khóa' : 'Mở'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td style={styles.td} colSpan="5">
                    Không có nhân viên
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeManager;
