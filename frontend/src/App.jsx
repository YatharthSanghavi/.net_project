import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Week1Doc from './pages/Week1Doc';
import RolesList from './pages/Roles/RolesList';
import RoleForm from './pages/Roles/RoleForm';
import UsersList from './pages/Users/UsersList';
import UserForm from './pages/Users/UserForm';
import ProjectsList from './pages/Projects/ProjectsList';
import ProjectForm from './pages/Projects/ProjectForm';
import TasksList from './pages/Tasks/TasksList';
import TaskForm from './pages/Tasks/TaskForm';
import ScoresRemarks from './pages/ScoresRemarks';
import { initialRoles, initialUsers, initialProjects, initialTasks } from './data';

export default function App() {
  const [user, setUser] = useState({ name: 'Aarav Patel', role: 'Admin' });
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [screen, setScreen] = useState('dashboard');
  const [roles, setRoles] = useState(initialRoles);
  const [users, setUsers] = useState(initialUsers);
  const [projects, setProjects] = useState(initialProjects);
  const [tasks, setTasks] = useState(initialTasks);
  const [editItem, setEditItem] = useState(null);

  if (!isLoggedIn) return <Login onLogin={(u) => { setUser(u); setIsLoggedIn(true); setScreen('dashboard'); }} />;

  const saveRole = (r) => { setRoles(roles.some(x => x.id === r.id) ? roles.map(x => x.id === r.id ? r : x) : [...roles, r]); setEditItem(null); setScreen('roles'); };
  const saveUser = (u) => { setUsers(users.some(x => x.id === u.id) ? users.map(x => x.id === u.id ? u : x) : [...users, u]); setEditItem(null); setScreen('users'); };
  const saveProject = (p) => { setProjects(projects.some(x => x.id === p.id) ? projects.map(x => x.id === p.id ? p : x) : [...projects, p]); setEditItem(null); setScreen('projects'); };
  const saveTask = (t) => { setTasks(tasks.some(x => x.id === t.id) ? tasks.map(x => x.id === t.id ? t : x) : [...tasks, t]); setEditItem(null); setScreen('tasks'); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header user={user} onLogout={() => setIsLoggedIn(false)} onNavigate={setScreen} />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar activeScreen={screen} onNavigate={setScreen} />
        <main style={{ flex: 1, padding: '15px' }}>
          {screen === 'dashboard' && <Dashboard users={users} projects={projects} tasks={tasks} onNavigate={setScreen} />}
          {screen === 'week1-3' && <Week1Doc />}
          {screen === 'roles' && <RolesList roles={roles} onDelete={(id) => setRoles(roles.filter(r => r.id !== id))} onEdit={(r) => { setEditItem(r); setScreen('role-form'); }} onAdd={() => { setEditItem(null); setScreen('role-form'); }} />}
          {screen === 'role-form' && <RoleForm initialData={editItem} onSave={saveRole} onCancel={() => { setEditItem(null); setScreen('roles'); }} />}
          {(screen === 'users' || screen === 'students' || screen === 'faculty') && <UsersList users={users} roles={roles} onDelete={(id) => setUsers(users.filter(u => u.id !== id))} onEdit={(u) => { setEditItem(u); setScreen('user-form'); }} onAdd={() => { setEditItem(null); setScreen('user-form'); }} />}
          {screen === 'user-form' && <UserForm initialData={editItem} roles={roles} onSave={saveUser} onCancel={() => { setEditItem(null); setScreen('users'); }} />}
          {screen === 'projects' && <ProjectsList projects={projects} onDelete={(id) => setProjects(projects.filter(p => p.id !== id))} onEdit={(p) => { setEditItem(p); setScreen('project-form'); }} onAdd={() => { setEditItem(null); setScreen('project-form'); }} />}
          {screen === 'project-form' && <ProjectForm initialData={editItem} users={users} onSave={saveProject} onCancel={() => { setEditItem(null); setScreen('projects'); }} />}
          {screen === 'tasks' && <TasksList tasks={tasks} onDelete={(id) => setTasks(tasks.filter(t => t.id !== id))} onEdit={(t) => { setEditItem(t); setScreen('task-form'); }} onAdd={() => { setEditItem(null); setScreen('task-form'); }} onUpdateStatus={(id, st) => setTasks(tasks.map(t => t.id === id ? { ...t, status: st } : t))} />}
          {screen === 'task-form' && <TaskForm initialData={editItem} projects={projects} users={users} onSave={saveTask} onCancel={() => { setEditItem(null); setScreen('tasks'); }} />}
          {screen === 'scores' && <ScoresRemarks tasks={tasks} />}
        </main>
      </div>
      <Footer />
    </div>
  );
}
