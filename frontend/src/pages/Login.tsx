import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [mode, setMode] = useState<'student' | 'admin'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim().endsWith('@college.edu')) {
      navigate('/student');
    } else {
      alert('Please use a valid college email');
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().length >= 6) {
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
      <div className="card" style={{ maxWidth: '32rem', width: '100%', margin: '0 auto' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{
            marginTop: '1rem',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#0f172a'
          }}>
            CampusFlow
          </h2>
          <p style={{ marginTop: '0.25rem', color: '#475569', fontSize: '0.9rem' }}>
            {mode === 'student' ? 'Student Login — Sign in with your college email' : 'Admin Login — Enter your admin recognition code'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', justifyContent: 'center' }}>
          <button
            onClick={() => setMode('student')}
            className={mode === 'student' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '0.35rem 0.75rem', borderRadius: '0.375rem', minWidth: '9rem' }}
          >
            Student
          </button>
          <button
            onClick={() => setMode('admin')}
            className={mode === 'admin' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '0.35rem 0.75rem', borderRadius: '0.375rem', minWidth: '9rem' }}
          >
            Admin
          </button>
        </div>

        {mode === 'student' ? (
          <form onSubmit={handleStudentSubmit} style={{ marginTop: '1.5rem' }}>
            <div style={{ borderRadius: '0.25rem', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)' }}>
              <div>
                <label htmlFor="email-address" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', borderWidth: 0 }}>
                  College Email
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="input-field"
                  style={{ display: 'block', width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #cbd5e1', color: '#0f172a', borderTopLeftRadius: '0.25rem', borderTopRightRadius: '0.25rem', fontSize: '0.875rem' }}
                  placeholder="College Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', borderWidth: 0 }}>
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="input-field"
                  style={{ display: 'block', width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #cbd5e1', color: '#0f172a', borderBottomLeftRadius: '0.25rem', borderBottomRightRadius: '0.25rem', fontSize: '0.875rem' }}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.5rem', fontSize: '0.875rem', borderRadius: '0.375rem' }}>Sign in</button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleAdminSubmit} style={{ marginTop: '1.5rem' }}>
            <div style={{ borderRadius: '0.25rem', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)' }}>
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
                  style={{ display: 'block', width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #cbd5e1', color: '#0f172a', borderRadius: '0.25rem', fontSize: '0.875rem' }}
                  placeholder="Admin Recognition Code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.5rem', fontSize: '0.875rem', borderRadius: '0.375rem' }}>Sign in</button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

export default Login;