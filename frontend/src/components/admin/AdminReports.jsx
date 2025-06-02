import { useEffect, useState } from 'react';
import axios from 'axios';
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

  return (
    <div>
      <h2>Performance Reports & Certificates</h2>

      <form onSubmit={handleGenerate} style={{ marginBottom: '2rem' }}>
        <h3>Generate Report</h3>
        <select required value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })}>
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
        <br />
        <input
          type="text"
          placeholder="Course Title"
          required
          value={form.course}
          onChange={(e) => setForm({ ...form, course: e.target.value })}
        />
        <br />
        <textarea
          placeholder="Remarks"
          value={form.remarks}
          onChange={(e) => setForm({ ...form, remarks: e.target.value })}
        />
        <br />
        <button type="submit">Generate Report</button>
      </form>

      <h3>All Reports</h3>
      <table border="1" cellPadding="8" cellSpacing="0">
        <thead>
          <tr>
            <th>Student</th>
            <th>Course</th>
            <th>Grade</th>
            <th>Download</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(reports) && reports.length > 0 ? (
            reports.map((r) => (
              <tr key={r._id}>
                <td>{r.student?.name}</td>
                <td>{r.course}</td>
                <td>{r.grade}</td>
                <td>
                  <a href={`${backendBaseUrl}${r.certificateUrl}`} target="_blank" rel="noreferrer">
  Download
</a>
                </td>
                <td>
                  <button onClick={() => handleDelete(r._id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>No reports found</td>
            </tr>
          )}
        </tbody>
      </table>

    </div>
  );
}
