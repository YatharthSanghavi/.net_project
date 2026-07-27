import React from 'react';

export default function ScoresRemarks({ tasks }) {
  return (
    <div>
      <h2>Scores & Remarks</h2>
      <div className="card">
        <table className="table">
          <thead>
            <tr><th>#</th><th>Student</th><th>Task</th><th>Score</th><th>Status</th><th>Remarks</th></tr>
          </thead>
          <tbody>
            {tasks.map((t, i) => (
              <tr key={t.id}>
                <td>{i + 1}</td><td><strong>{t.assignedTo}</strong></td><td>{t.title}</td><td>{t.assignedScore || 10} pts</td><td>{t.status}</td><td>{t.facultyRemarks || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
