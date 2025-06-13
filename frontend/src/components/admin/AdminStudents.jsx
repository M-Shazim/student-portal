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

  const styles = {
    container: {
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      padding: '0',
    },
    header: {
      backgroundColor: '#fff',
      borderBottom: '1px solid #e2e8f0',
      padding: '1.5rem 2rem',
      marginBottom: '2rem',
    },
    title: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#1a202c',
      margin: '0',
    },
    cardGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem',
      padding: '0 2rem',
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      padding: '1.5rem',
      border: '1px solid #e2e8f0',
    },
    cardTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#2d3748',
      marginBottom: '1rem',
      paddingBottom: '0.5rem',
      borderBottom: '2px solid #e2e8f0',
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1rem',
      marginBottom: '1rem',
    },
    inputGroup: {
      marginBottom: '1rem',
    },
    label: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '0.5rem',
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '0.875rem',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      boxSizing: 'border-box',
    },
    inputFocus: {
      outline: 'none',
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
    },
    button: {
      backgroundColor: '#3b82f6',
      color: '#fff',
      padding: '0.75rem 1.5rem',
      border: 'none',
      borderRadius: '8px',
      fontSize: '0.875rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    buttonHover: {
      backgroundColor: '#2563eb',
    },
    secondaryButton: {
      backgroundColor: '#6b7280',
      color: '#fff',
      padding: '0.5rem 1rem',
      border: 'none',
      borderRadius: '6px',
      fontSize: '0.75rem',
      fontWeight: '500',
      cursor: 'pointer',
      marginRight: '0.5rem',
    },
    dangerButton: {
      backgroundColor: '#dc2626',
      color: '#fff',
      padding: '0.5rem 1rem',
      border: 'none',
      borderRadius: '6px',
      fontSize: '0.75rem',
      fontWeight: '500',
      cursor: 'pointer',
    },
    fileInput: {
      padding: '0.5rem',
      border: '2px dashed #d1d5db',
      borderRadius: '8px',
      backgroundColor: '#f9fafb',
      cursor: 'pointer',
      transition: 'border-color 0.2s',
    },
    alert: {
      padding: '0.75rem 1rem',
      borderRadius: '8px',
      fontSize: '0.875rem',
      marginBottom: '1rem',
    },
    alertSuccess: {
      backgroundColor: '#d1fae5',
      color: '#065f46',
      border: '1px solid #a7f3d0',
    },
    alertError: {
      backgroundColor: '#fee2e2',
      color: '#991b1b',
      border: '1px solid #fca5a5',
    },
    tableContainer: {
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      margin: '0 2rem',
      overflow: 'hidden',
      border: '1px solid #e2e8f0',
    },
    tableHeader: {
      padding: '1.5rem',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#f8fafc',
    },
    tableTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#2d3748',
    },
    searchInput: {
      padding: '0.5rem 1rem',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '0.875rem',
      width: '250px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      backgroundColor: '#f8fafc',
      padding: '1rem',
      textAlign: 'left',
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#374151',
      borderBottom: '1px solid #e2e8f0',
    },
    td: {
      padding: '1rem',
      borderBottom: '1px solid #f3f4f6',
      fontSize: '0.875rem',
      color: '#374151',
    },
    actionButtons: {
      display: 'flex',
      gap: '0.5rem',
    },
    noData: {
      textAlign: 'center',
      padding: '3rem',
      color: '#6b7280',
      fontSize: '0.875rem',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Student Management</h1>
      </div>

      <div style={styles.cardGrid}>
        {/* Create/Edit Student Form */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>
            {editingStudent ? 'Edit Student' : 'Create New Student'}
          </h3>
          
          {message && (
            <div style={{...styles.alert, ...styles.alertSuccess}}>
              {message}
            </div>
          )}
          {error && (
            <div style={{...styles.alert, ...styles.alertError}}>
              {error}
            </div>
          )}

          <form onSubmit={handleCreateStudent}>
            <div style={styles.formGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Full Name</label>
                <input
                  type="text"
                  placeholder="Enter student name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={styles.input}
                />
              </div>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>Email Address</label>
                <input
                  type="email"
                  placeholder="student@example.com"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.formGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Password</label>
                <input
                  type="password"
                  placeholder="Enter password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  style={styles.input}
                />
              </div>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>Semester</label>
                <input
                  type="text"
                  placeholder="e.g., 7th"
                  required
                  value={form.semester}
                  onChange={(e) => setForm({ ...form, semester: e.target.value })}
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.formGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>GitHub URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://github.com/username"
                  value={form.github}
                  onChange={(e) => setForm({ ...form, github: e.target.value })}
                  style={styles.input}
                />
              </div>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>LinkedIn URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  value={form.linkedin}
                  onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                  style={styles.input}
                />
              </div>
            </div>

            <button type="submit" style={styles.button}>
              {editingStudent ? 'Update Student' : 'Create Student'}
            </button>
            
            {editingStudent && (
              <button
                type="button"
                onClick={() => {
                  setEditingStudent(null);
                  setForm({
                    name: '',
                    email: '',
                    password: '',
                    semester: '',
                    github: '',
                    linkedin: ''
                  });
                }}
                style={{...styles.secondaryButton, marginLeft: '0.5rem'}}
              >
                Cancel
              </button>
            )}
          </form>
        </div>

        {/* Bulk Upload */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Bulk Upload Students</h3>
          
          {uploadMessage && (
            <div style={{...styles.alert, ...styles.alertSuccess}}>
              {uploadMessage}
            </div>
          )}
          {uploadError && (
            <div style={{...styles.alert, ...styles.alertError}}>
              {uploadError}
            </div>
          )}

          <form onSubmit={handleBulkUpload}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>CSV File</label>
              <input
                type="file"
                accept=".csv"
                onChange={handleCsvFileChange}
                style={styles.fileInput}
              />
              <small style={{color: '#6b7280', fontSize: '0.75rem', display: 'block', marginTop: '0.5rem'}}>
                Upload a CSV file with student data
              </small>
            </div>
            
            <button type="submit" style={styles.button}>
              Upload CSV
            </button>
          </form>
        </div>
      </div>

      {/* Students Table */}
      <div style={styles.tableContainer}>
        <div style={styles.tableHeader}>
          <h2 style={styles.tableTitle}>
            Student List ({filteredStudents.length} students)
          </h2>
          <input
            type="text"
            placeholder="Search by semester..."
            value={semesterSearch}
            onChange={(e) => setSemesterSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Semester</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((s) => (
                <tr key={s._id}>
                  <td style={styles.td}>{s.name}</td>
                  <td style={styles.td}>{s.email}</td>
                  <td style={styles.td}>{s.semester}</td>
                  <td style={styles.td}>
                    <div style={styles.actionButtons}>
                      <button
                        onClick={() => handleEditStudent(s)}
                        style={styles.secondaryButton}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(s._id)}
                        style={styles.dangerButton}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={styles.noData}>
                  {semesterSearch ? 'No students found for this semester' : 'No students found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}