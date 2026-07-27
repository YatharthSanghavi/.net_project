import React, { useState } from 'react';

export default function TaskForm({ initialData, projects, users, onSave, onCancel }) {
  const students = users.filter(u => u.role === 'Student');
  const [title, setTitle] = useState(initialData ? initialData.title : '');
  const [desc, setDesc] = useState(initialData ? initialData.description || '' : '');
  const [projectTitle, setProjectTitle] = useState(initialData ? initialData.projectTitle : (projects[0] ? projects[0].title : ''));
  const [priority, setPriority] = useState(initialData ? initialData.priority : 'Medium');
  const [status, setStatus] = useState(initialData ? initialData.status : 'Pending');
  const [assignedTo, setAssignedTo] = useState(initialData ? initialData.assignedTo : (students[0] ? students[0].name : ''));
  const [dueDate, setDueDate] = useState(initialData ? initialData.dueDate || '' : '');
  const [score, setScore] = useState(initialData ? initialData.assignedScore || 10 : 10);
  const [remarks, setRemarks] = useState(initialData ? initialData.facultyRemarks || '' : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      id: initialData ? initialData.id : Date.now(),
      title, description: desc, projectTitle, priority, status, assignedTo, dueDate, assignedScore: Number(score), facultyRemarks: remarks
    });
  };

  return (
    <div className="card" style={{ maxWidth: '600px' }}>
      <h2>{initialData ? 'Edit Task' : 'Add Task'}</h2>
      <form onSubmit={handleSubmit} style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <input className="btn" style={{ background: '#fff', color: '#000' }} placeholder="Task Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea className="btn" style={{ background: '#fff', color: '#000', height: '50px' }} placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)} />
        <label>Project:</label>
        <select className="btn" style={{ background: '#fff', color: '#000' }} value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)}>
          {projects.map(p => <option key={p.id} value={p.title}>{p.title}</option>)}
        </select>
        <label>Assigned Student:</label>
        <select className="btn" style={{ background: '#fff', color: '#000' }} value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
          {students.map(s => <option key={s.id} value={s.name}>{s.name} ({s.email})</option>)}
        </select>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <label>Priority:</label>
            <select className="btn" style={{ width: '100%', background: '#fff', color: '#000' }} value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="Critical">Critical</option><option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label>Status:</label>
            <select className="btn" style={{ width: '100%', background: '#fff', color: '#000' }} value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="Pending">Pending</option><option value="In Progress">In Progress</option><option value="Completed">Completed</option><option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <label>Due Date:</label>
            <input className="btn" style={{ width: '100%', background: '#fff', color: '#000' }} type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Score Points:</label>
            <input className="btn" style={{ width: '100%', background: '#fff', color: '#000' }} type="number" value={score} onChange={(e) => setScore(e.target.value)} />
          </div>
        </div>
        <input className="btn" style={{ background: '#fff', color: '#000' }} placeholder="Faculty Remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button className="btn" type="submit">Save Task</button>
          <button className="btn" style={{ background: '#6b7280' }} type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
