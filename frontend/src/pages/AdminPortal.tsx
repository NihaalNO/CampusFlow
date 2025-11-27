import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from '../components/AdminDashboard';

const AdminPortal = () => {
  const [department, setDepartment] = useState('infrastructure');
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/admin');
  };

  const departments = [
    { id: 'infrastructure', name: 'Infrastructure' },
    { id: 'it', name: 'IT Department' },
    { id: 'library', name: 'Library' },
    { id: 'classroom', name: 'Classroom/Staff-room' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', width: '100%' }}>
      {/* Header */}
      <header style={{ backgroundColor: 'white', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' }}>
        <div style={{ maxWidth: '80rem', width: '100%', margin: '0 auto', padding: '1.5rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1E40AF' }}>CampusFlow</h1>
            <div style={{ marginLeft: '1.5rem' }}>
              <label htmlFor="department-select" style={{ marginRight: '0.5rem', fontSize: '0.875rem', fontWeight: 'medium', color: '#334155' }}>
                Department:
              </label>
              <select
                id="department-select"
                className="input-field"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                style={{
                  border: '1px solid #cbd5e1',
                  borderRadius: '0.375rem',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.875rem'
                }}
              >
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn-secondary"
          >
            Logout
          </button>
        </div>
      </header>

      <main style={{ maxWidth: '80rem', width: '100%', margin: '0 auto', padding: '1.5rem 1rem' }}>
        <AdminDashboard department={department} />
      </main>
    </div>
  );
};

export default AdminPortal;