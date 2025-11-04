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
    return <div>Загрузка...</div>;
  }

  return (
    <div className={`dashboard ${user.theme}`}>
      <header className="dashboard-header">
        <h1>Облачное хранилище</h1>
        <div className="header-actions">
          <button onClick={handleThemeToggle} className="btn-theme">
            {user.theme === 'light' ? '🌙 Тёмная тема' : '☀️ Светлая тема'}
          </button>
          <button onClick={handleLogout} className="btn-logout">
            Выйти
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="profile-card">
          <h2>Добро пожаловать, {user.username}!</h2>
          <div className="profile-info">
            <div className="info-item">
              <span className="label">Электронная почта:</span>
              <span className="value">{user.email}</span>
            </div>
            <div className="info-item">
              <span className="label">ID пользователя:</span>
              <span className="value">{user.id}</span>
            </div>
            
            <div className="info-item">
              <span className="label">Дата регистрации:</span>
              <span className="value">
                {new Date(user.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="files-section">
          <h2>Мои файлы</h2>
          <p className="placeholder-text">
            Функции управления файлами будут доступны позже...
          </p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
