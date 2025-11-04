import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, logout, updateTheme } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleThemeToggle = async () => {
    if (user) {
      const newTheme = user.theme === 'light' ? 'dark' : 'light';
      try {
        await updateTheme(newTheme);
      } catch (error) {
        console.error('Failed to update theme:', error);
      }
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`dashboard ${user.theme}`}>
      <header className="dashboard-header">
        <h1>Cloud Storage</h1>
        <div className="header-actions">
          <button onClick={handleThemeToggle} className="btn-theme">
            {user.theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="profile-card">
          <h2>Welcome, {user.username}!</h2>
          <div className="profile-info">
            <div className="info-item">
              <span className="label">Email:</span>
              <span className="value">{user.email}</span>
            </div>
            <div className="info-item">
              <span className="label">User ID:</span>
              <span className="value">{user.id}</span>
            </div>
            <div className="info-item">
              <span className="label">Theme:</span>
              <span className="value">{user.theme}</span>
            </div>
            <div className="info-item">
              <span className="label">Member since:</span>
              <span className="value">
                {new Date(user.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="files-section">
          <h2>My Files</h2>
          <p className="placeholder-text">
            File management features coming soon...
          </p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
