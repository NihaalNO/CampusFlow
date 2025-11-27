import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation for admin code
    if (code.length >= 6) {
      navigate('/admin/dashboard');
    } else {
      alert('Please enter a valid admin code');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8fafc',
      padding: '3rem 1rem',
      width: '100%'
    }}>
      <div className="card" style={{ maxWidth: '28rem', width: '100%', margin: '0 auto' }}>
        <div>
          <h2 style={{
            marginTop: '1.5rem',
            textAlign: 'center',
            fontSize: '1.875rem',
            fontWeight: 'bold',
            color: '#0f172a'
          }}>
            CampusFlow Admin Login
          </h2>
          <p style={{
            marginTop: '0.5rem',
            textAlign: 'center',
            fontSize: '0.875rem',
            color: '#475569'
          }}>
            Enter your admin recognition code
          </p>
        </div>
        <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
          <div style={{ borderRadius: '0.25rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' }}>
            <div>
              <label htmlFor="admin-code" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', borderWidth: 0 }}>
                Admin Recognition Code
              </label>
              <input
                id="admin-code"
                name="code"
                type="password"
                required
                className="input-field"
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #cbd5e1',
                  color: '#0f172a',
                  borderRadius: '0.25rem',
                  fontSize: '0.875rem'
                }}
                placeholder="Admin Recognition Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <button
              type="submit"
              className="btn-primary"
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                padding: '0.5rem 1rem',
                border: '1px solid transparent',
                fontSize: '0.875rem',
                fontWeight: 'medium',
                borderRadius: '0.375rem',
                color: 'white'
              }}
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;