import React, { useState } from 'react';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RolesList from './pages/Roles/RolesList';
import UsersList from './pages/Users/UsersList';
import ProjectsList from './pages/Projects/ProjectsList';
import TasksList from './pages/Tasks/TasksList';
import ScoresRemarks from './pages/ScoresRemarks';
import { initialRoles, initialUsers, initialProjects, initialTasks } from './data';

export default function App() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [screen, setScreen] = useState('dashboard');
  const [users] = useState(initialUsers);
  const [projects] = useState(initialProjects);
  const [tasks] = useState(initialTasks);

  if (!isLoggedIn) return <Login onLogin={(u) => { setUser(u); setIsLoggedIn(true); setScreen('dashboard'); }} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header user={user} onLogout={() => setIsLoggedIn(false)} onNavigate={setScreen} />
      <Navbar activeScreen={screen} onNavigate={setScreen} />
      <main style={{ flex: 1, padding: '20px' }}>
        {screen === 'dashboard' && <Dashboard users={users} projects={projects} tasks={tasks} onNavigate={setScreen} />}
        {screen === 'roles' && <RolesList />}
        {(screen === 'users' || screen === 'students' || screen === 'faculty') && <UsersList users={users} roles={initialRoles} />}
        {screen === 'projects' && <ProjectsList projects={projects} />}
        {screen === 'tasks' && <TasksList tasks={tasks} />}
        {screen === 'scores' && <ScoresRemarks tasks={tasks} />}
      </main>
      <Footer />
    </div>
  );
}