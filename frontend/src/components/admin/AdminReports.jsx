import { useEffect, useState } from 'react';
import api from '../../axios';
import { useAuth } from '../../context/AuthContext';

export default function AdminReports() {
  const { auth } = useAuth();
  const [students, setStudents] = useState([]);
  const [reports, setReports] = useState([]);
  const [form, setForm] = useState({ studentId: '', course: '', remarks: '' });
  const backendBaseUrl = import.meta.env.VITE_API_URL;

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

  const fetchReports = async () => {
    const res = await api.get('/reports', {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    setReports(res.data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;

    try {
      await api.delete(`/reports/${id}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      fetchReports();
    } catch (err) {
      alert('Failed to delete report');
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    await api.post('/reports', form, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    setForm({ studentId: '', course: '', remarks: '' });
    fetchReports();
  };

  useEffect(() => {
    fetchStudents();
    fetchReports();
  }, []);

  const styles = {
    container: {
      padding: '2rem',
      fontFamily: 'sans-serif',
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
    },
    heading: {
      fontSize: '2rem',
      marginBottom: '1rem',
      color: '#1e293b',
    },
    card: {
      backgroundColor: '#ffffff',
      padding: '1.5rem',
      borderRadius: '12px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
      marginBottom: '2rem',
    },
    label: {
      display: 'block',
      fontWeight: '500',
      marginBottom: '0.5rem',
      marginTop: '1rem',
      color: '#374151',
    },
    select: {
      width: '100%',
      padding: '0.5rem',
      borderRadius: '8px',
      border: '1px solid #cbd5e1',
    },
    input: {
      width: '100%',
      padding: '0.5rem',
      borderRadius: '8px',
      border: '1px solid #cbd5e1',
    },
    textarea: {
      width: '100%',
      padding: '0.5rem',
      borderRadius: '8px',
      border: '1px solid #cbd5e1',
      minHeight: '80px',
    },
    button: {
      marginTop: '1rem',
      backgroundColor: '#3b82f6',
      color: '#fff',
      border: 'none',
      padding: '0.75rem 1.5rem',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '500',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      backgroundColor: '#fff',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
    },
    th: {
      backgroundColor: '#f1f5f9',
      textAlign: 'left',
      padding: '1rem',
      color: '#1e293b',
    },
    td: {
      padding: '1rem',
      borderTop: '1px solid #e2e8f0',
    },
    deleteBtn: {
      backgroundColor: '#ef4444',
      color: '#fff',
      padding: '0.5rem 1rem',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
    },
    link: {
      color: '#2563eb',
      textDecoration: 'underline',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Performance Reports & Certificates</h2>

      <div style={styles.card}>
        <h3 style={{ marginBottom: '1rem' }}>Generate Report</h3>
        <form onSubmit={handleGenerate}>
          <label style={styles.label}>Student</label>
          <select
            required
            style={styles.select}
            value={form.studentId}
            onChange={(e) => setForm({ ...form, studentId: e.target.value })}
          >
            <option value="">Select Student</option>
            {Array.isArray(students) && students.length > 0 ? (
              students.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} ({s.email})
                </option>
              ))
            ) : (
              <option disabled>No students available</option>
            )}
          </select>

          <label style={styles.label}>Course Title</label>
          <input
            type="text"
            placeholder="Course Title"
            required
            style={styles.input}
            value={form.course}
            onChange={(e) => setForm({ ...form, course: e.target.value })}
          />

          <label style={styles.label}>Remarks</label>
          <textarea
            placeholder="Remarks"
            style={styles.textarea}
            value={form.remarks}
            onChange={(e) => setForm({ ...form, remarks: e.target.value })}
          />

          <button type="submit" style={styles.button}>Generate Report</button>
        </form>
      </div>

      <div style={styles.card}>
        <h3 style={{ marginBottom: '1rem' }}>All Reports</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Student</th>
              <th style={styles.th}>Course</th>
              <th style={styles.th}>Grade</th>
              <th style={styles.th}>Download</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(reports) && reports.length > 0 ? (
              reports.map((r) => (
                <tr key={r._id}>
                  <td style={styles.td}>{r.student?.name}</td>
                  <td style={styles.td}>{r.course}</td>
                  <td style={styles.td}>{r.grade}</td>
                  <td style={styles.td}>
                    <a
                      href={`${backendBaseUrl}${r.certificateUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      style={styles.link}
                    >
                      Download
                    </a>
                  </td>
                  <td style={styles.td}>
                    <button
                      onClick={() => handleDelete(r._id)}
                      style={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ ...styles.td, textAlign: 'center' }}>
                  No reports found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
