import { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../../axios';
import { useAuth } from '../../context/AuthContext';

export default function AdminStudents() {
  const { auth } = useAuth();
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    semester: '',
    github: '',
    linkedin: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [semesterSearch, setSemesterSearch] = useState('');

  const [csvFile, setCsvFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const [uploadError, setUploadError] = useState('');

  const [editingStudent, setEditingStudent] = useState(null);

  const handleEditStudent = (student) => {
  setForm({
    name: student.name,
    email: student.email,
    password: '', // Do not prefill
    semester: student.semester,
    github: student.portfolio?.github || '',
    linkedin: student.portfolio?.linkedin || ''
  });
  setEditingStudent(student);
};

const handleDeleteStudent = async (id) => {
  if (!window.confirm('Are you sure you want to delete this student?')) return;
  try {
    await api.delete(`/students/${id}`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    setStudents(prev => prev.filter(s => s._id !== id));
  } catch (err) {
    console.error('Delete error:', err);
    alert('Failed to delete student');
  }
};

  const handleCsvFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleBulkUpload = async (e) => {
    e.preventDefault();
    if (!csvFile) {
      setUploadError('Please select a CSV file to upload.');
      return;
    }

    setUploadMessage('');
    setUploadError('');

    const formData = new FormData();
    formData.append('file', csvFile);

    try {
      const res = await api.post('/students/bulk-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${auth.token}`,
        },
      });

      setUploadMessage(res.data.message + ` Total uploaded: ${res.data.count}`);
      fetchStudents(); // Refresh student list
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Bulk upload failed.');
    }
  };


  // Fetch students
  useEffect(() => {
    fetchStudents();
  }, [auth]);

  const fetchStudents = async () => {
    try {
      const res = await api.get('/students', {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setStudents(res.data);
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

// Modify handleCreateStudent to update if editing
const handleCreateStudent = async (e) => {
  e.preventDefault();
  setMessage('');
  setError('');
  try {
    if (editingStudent) {
      const res = await api.put(`/students/${editingStudent._id}`, form, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setMessage('Student updated.');
      setStudents(prev =>
        prev.map(s => s._id === editingStudent._id ? res.data.student : s)
      );
      setEditingStudent(null);
    } else {
      const res = await api.post('/students', form, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setMessage('Student created successfully.');
      setStudents(prev => [...prev, res.data.student]);
    }

    setForm({
      name: '',
      email: '',
      password: '',
      semester: '',
      github: '',
      linkedin: ''
    });
  } catch (err) {
    console.error('Error saving student:', err);
    setError(err.response?.data?.message || 'Something went wrong.');
  }
};

  // Filter students based on semesterSearch input
  const filteredStudents = semesterSearch
    ? students.filter(s =>
      s.semester.toLowerCase().includes(semesterSearch.toLowerCase())
    )
    : students;

  return (
    <div>
      <h2>Student Management</h2>

      <form onSubmit={handleCreateStudent} style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc' }}>
        <h3>Create New Student</h3>
        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <input type="text" placeholder="Name" required value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} /> <br />
        <input type="email" placeholder="Email" required value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })} /> <br />
        <input type="password" placeholder="Password" required value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })} /> <br />
        <input type="text" placeholder="Semester" required value={form.semester}
          onChange={(e) => setForm({ ...form, semester: e.target.value })} /> <br />
        <input type="url" placeholder="GitHub URL" value={form.github}
          onChange={(e) => setForm({ ...form, github: e.target.value })} /> <br />
        <input type="url" placeholder="LinkedIn URL" value={form.linkedin}
          onChange={(e) => setForm({ ...form, linkedin: e.target.value })} /> <br />
        <button type="submit">Create Student</button>
      </form>


      <form onSubmit={handleBulkUpload} style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc' }}>
        <h3>Bulk Upload Students (CSV)</h3>
        {uploadMessage && <p style={{ color: 'green' }}>{uploadMessage}</p>}
        {uploadError && <p style={{ color: 'red' }}>{uploadError}</p>}
        <input type="file" accept=".csv" onChange={handleCsvFileChange} />
        <br />
        <button type="submit" style={{ marginTop: '0.5rem' }}>Upload CSV</button>
      </form>



      <div>
        <h2>Student List</h2>

        <label htmlFor="semesterSearch">Search Semester: </label>
        <input
          type="text"
          placeholder="Search semester e.g. 7th"
          value={semesterSearch}
          onChange={(e) => {
            setSemesterSearch(e.target.value);
            console.log('semesterSearch:', e.target.value);
          }}
          style={{ marginBottom: '1rem' }}
        />

      </div>

      <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%', marginTop: '1rem' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Semester</th>
          </tr>
        </thead>
<tbody>
  {filteredStudents.length > 0 ? (
    filteredStudents.map((s) => (
      <tr key={s._id}>
        <td>{s.name}</td>
        <td>{s.email}</td>
        <td>{s.semester}</td>
        <td>
          <button onClick={() => handleEditStudent(s)}>Edit</button>
          <button onClick={() => handleDeleteStudent(s._id)} style={{ marginLeft: '0.5rem' }}>Delete</button>
        </td>
      </tr>
    ))
  ) : (
    <tr><td colSpan="4">No students found</td></tr>
  )}
</tbody>


      </table>
    </div>
  );
}
