import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DisruptionForm from '../components/DisruptionForm';
import DisruptionTracker from '../components/DisruptionTracker';

const StudentPortal = () => {
  const [activeTab, setActiveTab] = useState<'report' | 'track'>('report');
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', width: '100%' }}>
      {/* Header */}
      <header style={{ backgroundColor: 'white', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' }}>
        <div style={{ maxWidth: '80rem', width: '100%', margin: '0 auto', padding: '1.5rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1E40AF' }}>CampusFlow</h1>
          <button
            onClick={handleLogout}
            className="btn-secondary"
          >
            Logout
          </button>
        </div>
      </header>

      <main style={{ maxWidth: '80rem', width: '100%', margin: '0 auto', padding: '1.5rem 1rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <nav style={{ display: 'flex', gap: '2rem' }}>
            <button
              onClick={() => setActiveTab('report')}
              style={{
                padding: '0.5rem 0.25rem',
                borderBottom: activeTab === 'report' ? '2px solid #1E40AF' : '2px solid transparent',
                fontWeight: 'medium',
                fontSize: '0.875rem',
                color: activeTab === 'report' ? '#1E40AF' : '#64748b'
              }}
            >
              Report Disruption
            </button>
            <button
              onClick={() => setActiveTab('track')}
              style={{
                padding: '0.5rem 0.25rem',
                borderBottom: activeTab === 'track' ? '2px solid #1E40AF' : '2px solid transparent',
                fontWeight: 'medium',
                fontSize: '0.875rem',
                color: activeTab === 'track' ? '#1E40AF' : '#64748b'
              }}
            >
              Track Disruptions
            </button>
          </nav>
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          {activeTab === 'report' ? <DisruptionForm /> : <DisruptionTracker />}
        </div>
      </main>
    </div>
  );
};

export default StudentPortal;