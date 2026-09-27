import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProjectsList from './pages/Projects/ProjectsList';
import TasksList from './pages/Tasks/TasksList';
import UsersList from './pages/Users/UsersList';
import RolesList from './pages/Roles/RolesList';
import StatusPriorityList from './pages/StatusPriority/StatusPriorityList';
import ScoresRemarks from './pages/ScoresRemarks';
import apiService from './services/apiService';

export default function App() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [screen, setScreen] = useState('dashboard');
  const [toast, setToast] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  }, []);

  // Restore authenticated session on application load
  useEffect(() => {
    const verifySession = async () => {
      const token = apiService.getToken();
      const savedUserStr = localStorage.getItem('spms_user');

      if (token) {
        try {
          const userData = await apiService.auth.me();
          const restoredUser = {
            userId: userData.userId,
            name: userData.fullName,
            email: userData.email,
            role: userData.role || userData.roles?.[0] || 'Student',
            roles: userData.roles || ['Student'],
            mobileNumber: userData.mobileNumber,
            profilePicturePath: userData.profilePicturePath,
          };
          setUser(restoredUser);
          setIsLoggedIn(true);
        } catch (err) {
          console.warn('Session verification failed:', err);
          // If saved user offline demo exists, keep it
          if (savedUserStr) {
            try {
              const u = JSON.parse(savedUserStr);
              setUser(u);
              setIsLoggedIn(true);
            } catch {
              apiService.setToken(null);
              localStorage.removeItem('spms_user');
            }
          } else {
            apiService.setToken(null);
          }
        }
      } else if (savedUserStr) {
        try {
          const u = JSON.parse(savedUserStr);
          setUser(u);
          setIsLoggedIn(true);
        } catch {
          localStorage.removeItem('spms_user');
        }
      }
      setLoadingSession(false);
    };

    verifySession();

    // Listen for unauthorized 401 events
    const handleUnauthorized = () => {
      apiService.setToken(null);
      localStorage.removeItem('spms_user');
      setIsLoggedIn((wasLoggedIn) => {
        if (wasLoggedIn) {
          showToast('Session expired. Please sign in again.', 'warning');
        }
        return false;
      });
      setUser(null);
      setScreen('dashboard');
    };
    window.addEventListener('spms:unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('spms:unauthorized', handleUnauthorized);
    };
  }, [showToast]);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    setIsLoggedIn(true);
    localStorage.setItem('spms_user', JSON.stringify(loggedInUser));
    setScreen('dashboard');
    showToast(`Welcome back, ${loggedInUser.name}!`, 'success');
  };

  const handleLogout = () => {
    apiService.auth.logout();
    localStorage.removeItem('spms_user');
    setIsLoggedIn(false);
    setUser(null);
    setScreen('dashboard');
  };

  if (loadingSession) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-base)' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎓</div>
        <h3 style={{ margin: 0, fontWeight: '700' }}>SPMS Portal</h3>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Initializing application session...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <>
        <Toast toast={toast} onClose={() => setToast(null)} />
        <Login onLogin={handleLogin} />
      </>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Toast toast={toast} onClose={() => setToast(null)} />

      <Header user={user} onLogout={handleLogout} onNavigate={setScreen} showToast={showToast} />
      <Navbar activeScreen={screen} onNavigate={setScreen} userRole={user?.role} />

      <main style={{ flex: 1, padding: '24px 20px' }}>
        {screen === 'dashboard' && (
          <Dashboard user={user} onNavigate={setScreen} />
        )}

        {screen === 'projects' && (
          <ProjectsList userRole={user?.role} currentUser={user} showToast={showToast} />
        )}

        {screen === 'tasks' && (
          <TasksList userRole={user?.role} currentUser={user} showToast={showToast} />
        )}

        {screen === 'scores' && (
          <ScoresRemarks userRole={user?.role} currentUser={user} showToast={showToast} />
        )}

        {screen === 'users' && (
          <UsersList userRole={user?.role} currentUser={user} showToast={showToast} />
        )}

        {screen === 'roles' && (
          <RolesList userRole={user?.role} showToast={showToast} />
        )}

        {screen === 'config' && (
          <StatusPriorityList userRole={user?.role} showToast={showToast} />
        )}
      </main>

      <Footer />
    </div>
  );
}