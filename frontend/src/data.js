export const initialRoles = [
  { id: 1, name: 'Admin', description: 'Full access to all modules and settings.' },
  { id: 2, name: 'Student', description: 'Can view and manage own projects and tasks.' },
  { id: 3, name: 'Faculty', description: 'Can supervise students and manage project assignments.' }
];

export const initialUsers = [
  { id: 1, name: 'Aarav Patel', email: 'admin@spms.com', mobile: '9876543210', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Priya Sharma', email: 'priya.sharma@spms.com', mobile: '9876543211', role: 'Faculty', status: 'Active' },
  { id: 3, name: 'Rohan Mehta', email: 'rohan.mehta@spms.com', mobile: '9876543212', role: 'Student', status: 'Active' },
  { id: 4, name: 'Sneha Desai', email: 'sneha.desai@spms.com', mobile: '9876543213', role: 'Student', status: 'Active' },
  { id: 5, name: 'Vikram Singh', email: 'vikram.singh@spms.com', mobile: '9876543214', role: 'Faculty', status: 'Inactive' },
  { id: 6, name: 'Anita Joshi', email: 'anita.joshi@spms.com', mobile: '9876543215', role: 'Student', status: 'Active' }
];

export const initialProjects = [
  { id: 1, title: 'E-Commerce Platform', description: 'Full-stack e-commerce web app.', status: 'In Progress', startDate: '2024-09-01', endDate: '2025-03-01', facultyName: 'Priya Sharma', assignedStudents: ['Rohan Mehta', 'Sneha Desai'] },
  { id: 2, title: 'Library Management System', description: 'Library system with barcode scanner.', status: 'Completed', startDate: '2024-08-15', endDate: '2025-02-15', facultyName: 'Priya Sharma', assignedStudents: ['Rohan Mehta'] },
  { id: 3, title: 'AI Chatbot', description: 'AI chatbot for student queries.', status: 'In Progress', startDate: '2025-01-01', endDate: '2025-06-30', facultyName: 'Priya Sharma', assignedStudents: ['Anita Joshi'] },
  { id: 4, title: 'IoT Weather Station', description: 'IoT weather monitoring station.', status: 'Not Started', startDate: '2025-03-01', endDate: '2025-09-01', facultyName: 'Vikram Singh', assignedStudents: ['Sneha Desai'] }
];

export const initialTasks = [
  { id: 1, title: 'Design Database Schema', projectTitle: 'E-Commerce Platform', priority: 'High', status: 'Pending', assignedTo: 'Rohan Mehta', dueDate: '2024-09-15', assignedScore: 10, facultyRemarks: 'Include foreign key relationships.' },
  { id: 2, title: 'Setup Project Structure', projectTitle: 'E-Commerce Platform', priority: 'Medium', status: 'Pending', assignedTo: 'Rohan Mehta', dueDate: '2024-09-20', assignedScore: 10, facultyRemarks: 'Use clean architecture.' },
  { id: 3, title: 'Implement User Authentication', projectTitle: 'E-Commerce Platform', priority: 'High', status: 'Completed', assignedTo: 'Rohan Mehta', dueDate: '2024-10-01', assignedScore: 15, facultyRemarks: 'JWT implemented.' },
  { id: 4, title: 'Create Book Catalog Module', projectTitle: 'Library Management System', priority: 'Medium', status: 'Completed', assignedTo: 'Sneha Desai', dueDate: '2024-10-15', assignedScore: 12, facultyRemarks: 'CRUD working.' },
  { id: 5, title: 'Train NLP Model', projectTitle: 'AI Chatbot', priority: 'Critical', status: 'In Progress', assignedTo: 'Anita Joshi', dueDate: '2025-03-01', assignedScore: 20, facultyRemarks: 'Ensure dataset validation.' }
];
