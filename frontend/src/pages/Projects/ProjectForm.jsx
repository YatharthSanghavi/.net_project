import React, { useState } from 'react';

export default function ProjectForm({ initialData, users, onSave, onCancel }) {
  const facultyList = users.filter(u => u.role === 'Faculty');
  const studentList = users.filter(u => u.role === 'Student');

  const [title, setTitle] = useState(initialData ? initialData.title : '');
  const [desc, setDesc] = useState(initialData ? initialData.description || '' : '');
  const [status, setStatus] = useState(initialData ? initialData.status : 'In Progress');
  const [facultyName, setFacultyName] = useState(initialData ? initialData.facultyName : (facultyList[0] ? facultyList[0].name : ''));
  const [startDate, setStartDate] = useState(initialData ? initialData.startDate || '' : '');
  const [endDate, setEndDate] = useState(initialData ? initialData.endDate || '' : '');
  const [assignedStudents, setAssignedStudents] = useState(initialData ? initialData.assignedStudents || [] : []);

  const toggleStudent = (sName) => {
    if (assignedStudents.includes(sName)) setAssignedStudents(assignedStudents.filter(s => s !== sName));
    else setAssignedStudents([...assignedStudents, sName]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ id: initialData ? initialData.id : Date.now(), title, description: desc, status, facultyName, startDate, endDate, assignedStudents });
  };

  return (
    <div className="card" style={{ maxWidth: '600px' }}>
      <h2>{initialData ? 'Edit Project' : 'Add Project'}</h2>
      <form onSubmit={handleSubmit} style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <input className="btn" style={{ background: '#fff', color: '#000' }} placeholder="Project Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea className="btn" style={{ background: '#fff', color: '#000', height: '50px' }} placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)} />
        <label>Supervising Faculty:</label>
        <select className="btn" style={{ background: '#fff', color: '#000' }} value={facultyName} onChange={(e) => setFacultyName(e.target.value)}>
          {facultyList.map(f => <option key={f.id} value={f.name}>{f.name} ({f.email})</option>)}
        </select>
        <label>Status:</label>
        <select className="btn" style={{ background: '#fff', color: '#000' }} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Not Started">Not Started</option><option value="In Progress">In Progress</option><option value="Completed">Completed</option>
        </select>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}><label>Start Date:</label><input className="btn" style={{ width: '100%', background: '#fff', color: '#000' }} type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></div>
          <div style={{ flex: 1 }}><label>End Date:</label><input className="btn" style={{ width: '100%', background: '#fff', color: '#000' }} type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} /></div>
        </div>
        <label>Assign Students:</label>
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
          {studentList.map(s => (
            <button key={s.id} type="button" className="btn" style={{ background: assignedStudents.includes(s.name) ? '#4f46e5' : '#e5e7eb', color: assignedStudents.includes(s.name) ? '#fff' : '#000' }} onClick={() => toggleStudent(s.name)}>
              {assignedStudents.includes(s.name) ? '✓ ' : '+ '}{s.name}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button className="btn" type="submit">Save Project</button>
          <button className="btn" style={{ background: '#6b7280' }} type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
