import { useState } from 'react';
import api from '../../api'; // make sure this handles token automatically or add it manually
import { useAuth } from '../../contexts/AuthContext';

export default function CreateStudentForm({ onStudentCreated }) {
  const { token } = useAuth(); // you might also access auth headers from context
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    semester: '',
    github: '',
    linkedin: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await api.post('/students', form, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMessage('Student created successfully!');
      setForm({ name: '', email: '', password: '', semester: '', github: '', linkedin: '' });
      if (onStudentCreated) onStudentCreated(res.data.student);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error creating student');
    }
  };

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h3>Create New Student</h3>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required /><br />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required /><br />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required /><br />
        <input name="semester" placeholder="Semester" value={form.semester} onChange={handleChange} required /><br />
        <input name="github" placeholder="GitHub URL" value={form.github} onChange={handleChange} /><br />
        <input name="linkedin" placeholder="LinkedIn URL" value={form.linkedin} onChange={handleChange} /><br />
        <button type="submit">Create Studenttttt</button>
      </form>
    </div>
  );
}
