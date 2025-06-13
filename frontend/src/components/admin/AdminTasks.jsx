import { useState, useEffect } from 'react';
import api from '../../axios';
import { useAuth } from '../../context/AuthContext';

export default function AdminTasks() {
  const { auth } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', assignedToSemester: '', deadline: '' });
  const [submissions, setSubmissions] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);

  const startEditTask = (task) => {
    setForm({
      title: task.title,
      description: task.description,
      assignedToSemester: task.assignedToSemester,
      deadline: task.deadline.slice(0, 10),
    });
    setEditTaskId(task._id);
    setIsEditing(true);
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      alert('Task deleted');
      fetchTasks();
    } catch (err) {
      alert('Error deleting task: ' + (err.response?.data?.message || err.message));
    }
  };

  const fetchTasks = async () => {
    const res = await api.get('/tasks', {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    setTasks(res.data);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/tasks/${editTaskId}`, form, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        alert('Task updated');
      } else {
        await api.post('/tasks', form, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        alert('Task created');
      }
      setForm({ title: '', description: '', assignedToSemester: '', deadline: '' });
      setIsEditing(false);
      setEditTaskId(null);
      fetchTasks();
    } catch (err) {
      alert('Error saving task: ' + (err.response?.data?.message || err.message));
    }
  };

  const viewSubmissions = async (taskId) => {
    const res = await api.get('/submissions', {
      headers: { Authorization: `Bearer ${auth.token}` },
      params: { taskId }
    });
    setSubmissions(res.data);
    setSelectedTask(taskId);
  };

  // New: State to track edits per submission
  const [editStates, setEditStates] = useState({});

  // Handle input changes for reviewStatus and feedback
  const handleEditChange = (submissionId, field, value) => {
    setEditStates(prev => ({
      ...prev,
      [submissionId]: {
        ...prev[submissionId],
        [field]: value,
      }
    }));
  };

  // Save review update for one submission
  const saveReview = async (submissionId) => {
    const edit = editStates[submissionId];
    if (!edit) return alert('No changes to save');
    try {
      await api.put(`/submissions/${submissionId}/review`, {
        reviewStatus: edit.reviewStatus,
        feedback: edit.feedback,
      }, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      alert('Review saved!');
      setSubmissions(prev => prev.map(sub => {
        if (sub._id === submissionId) {
          return { ...sub, reviewStatus: edit.reviewStatus, feedback: edit.feedback };
        }
        return sub;
      }));
      setEditStates(prev => {
        const newState = { ...prev };
        delete newState[submissionId];
        return newState;
      });
    } catch (err) {
      alert('Error saving review: ' + (err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

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
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '2rem',
      padding: '0 2rem',
      marginBottom: '2rem',
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
      marginBottom: '1.5rem',
      paddingBottom: '0.75rem',
      borderBottom: '2px solid #e2e8f0',
    },
    formGroup: {
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
    textarea: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '0.875rem',
      minHeight: '100px',
      resize: 'vertical',
      boxSizing: 'border-box',
    },
    buttonGroup: {
      display: 'flex',
      gap: '0.75rem',
      marginTop: '1rem',
    },
    primaryButton: {
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
    secondaryButton: {
      backgroundColor: '#6b7280',
      color: '#fff',
      padding: '0.75rem 1.5rem',
      border: 'none',
      borderRadius: '8px',
      fontSize: '0.875rem',
      fontWeight: '500',
      cursor: 'pointer',
    },
    taskList: {
      listStyle: 'none',
      padding: '0',
      margin: '0',
    },
    taskItem: {
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '1rem',
      marginBottom: '0.75rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    taskInfo: {
      flex: '1',
    },
    taskTitle: {
      fontSize: '1rem',
      fontWeight: '600',
      color: '#2d3748',
      marginBottom: '0.25rem',
    },
    taskMeta: {
      fontSize: '0.75rem',
      color: '#6b7280',
    },
    taskActions: {
      display: 'flex',
      gap: '0.5rem',
    },
    actionButton: {
      padding: '0.5rem 1rem',
      border: 'none',
      borderRadius: '6px',
      fontSize: '0.75rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    viewButton: {
      backgroundColor: '#3b82f6',
      color: '#fff',
    },
    editButton: {
      backgroundColor: '#f59e0b',
      color: '#fff',
    },
    deleteButton: {
      backgroundColor: '#dc2626',
      color: '#fff',
    },
    submissionsContainer: {
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      margin: '0 2rem',
      overflow: 'hidden',
      border: '1px solid #e2e8f0',
    },
    submissionsHeader: {
      padding: '1.5rem',
      borderBottom: '1px solid #e2e8f0',
      backgroundColor: '#f8fafc',
    },
    submissionsTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#2d3748',
      margin: '0',
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
    select: {
      padding: '0.5rem',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '0.75rem',
      width: '100%',
    },
    textareaSmall: {
      width: '100%',
      padding: '0.5rem',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '0.75rem',
      resize: 'vertical',
      minHeight: '60px',
    },
    saveButton: {
      backgroundColor: '#10b981',
      color: '#fff',
      padding: '0.5rem 1rem',
      border: 'none',
      borderRadius: '6px',
      fontSize: '0.75rem',
      fontWeight: '500',
      cursor: 'pointer',
    },
    link: {
      color: '#3b82f6',
      textDecoration: 'none',
      fontWeight: '500',
    },
    noData: {
      textAlign: 'center',
      padding: '3rem',
      color: '#6b7280',
      fontSize: '0.875rem',
    },
    statusBadge: {
      padding: '0.25rem 0.75rem',
      borderRadius: '12px',
      fontSize: '0.75rem',
      fontWeight: '500',
    },
    statusPending: {
      backgroundColor: '#fef3c7',
      color: '#92400e',
    },
    statusSatisfied: {
      backgroundColor: '#d1fae5',
      color: '#065f46',
    },
    statusUnsatisfied: {
      backgroundColor: '#fee2e2',
      color: '#991b1b',
    },
    statusTryAgain: {
      backgroundColor: '#fef3c7',
      color: '#92400e',
    },
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Satisfied':
        return { ...styles.statusBadge, ...styles.statusSatisfied };
      case 'Unsatisfied':
        return { ...styles.statusBadge, ...styles.statusUnsatisfied };
      case 'Try Again':
        return { ...styles.statusBadge, ...styles.statusTryAgain };
      default:
        return { ...styles.statusBadge, ...styles.statusPending };
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Task Management</h1>
      </div>

      <div style={styles.grid}>
        {/* Create/Edit Task Form */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>
            {isEditing ? 'Edit Task' : 'Create New Task'}
          </h3>
          
          <form onSubmit={handleCreate}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Task Title</label>
              <input
                type="text"
                placeholder="Enter task title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Description</label>
              <textarea
                placeholder="Enter task description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
                style={styles.textarea}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Assigned To Semester</label>
              <input
                type="text"
                placeholder="e.g., 7th"
                value={form.assignedToSemester}
                onChange={(e) => setForm({ ...form, assignedToSemester: e.target.value })}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Deadline</label>
              <input
                type="date"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.buttonGroup}>
              <button type="submit" style={styles.primaryButton}>
                {isEditing ? 'Update Task' : 'Create Task'}
              </button>

              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditTaskId(null);
                    setForm({
                      title: '',
                      description: '',
                      assignedToSemester: '',
                      deadline: '',
                    });
                  }}
                  style={styles.secondaryButton}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Tasks List */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>All Tasks ({tasks.length})</h3>
          
          <ul style={styles.taskList}>
            {Array.isArray(tasks) && tasks.length > 0 ? (
              tasks.map((task) => (
                <li key={task._id} style={styles.taskItem}>
                  <div style={styles.taskInfo}>
                    <div style={styles.taskTitle}>{task.title}</div>
                    <div style={styles.taskMeta}>
                      {task.assignedToSemester} • Due: {task.deadline.slice(0, 10)}
                    </div>
                  </div>
                  <div style={styles.taskActions}>
                    <button
                      onClick={() => viewSubmissions(task._id)}
                      style={{...styles.actionButton, ...styles.viewButton}}
                    >
                      View Submissions
                    </button>
                    <button
                      onClick={() => startEditTask(task)}
                      style={{...styles.actionButton, ...styles.editButton}}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTask(task._id)}
                      style={{...styles.actionButton, ...styles.deleteButton}}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <li style={styles.noData}>No tasks found</li>
            )}
          </ul>
        </div>
      </div>

      {/* Submissions Table */}
      {selectedTask && (
        <div style={styles.submissionsContainer}>
          <div style={styles.submissionsHeader}>
            <h4 style={styles.submissionsTitle}>Task Submissions</h4>
          </div>
          
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Student</th>
                <th style={styles.th}>GitHub Link</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Feedback</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(submissions) && submissions.length > 0 ? (
                submissions.map((sub) => {
                  const edit = editStates[sub._id] || {};
                  return (
                    <tr key={sub._id}>
                      <td style={styles.td}>
                        <strong>{sub.student?.name}</strong>
                      </td>
                      <td style={styles.td}>
                        <a
                          href={sub.githubLink}
                          target="_blank"
                          rel="noreferrer"
                          style={styles.link}
                        >
                          View Repository
                        </a>
                      </td>
                      <td style={styles.td}>
                        <select
                          value={edit.reviewStatus ?? sub.reviewStatus}
                          onChange={(e) => handleEditChange(sub._id, 'reviewStatus', e.target.value)}
                          style={styles.select}
                        >
                          {['Pending', 'Satisfied', 'Unsatisfied', 'Try Again'].map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </td>
                      <td style={styles.td}>
                        <textarea
                          value={edit.feedback ?? sub.feedback ?? ''}
                          onChange={(e) => handleEditChange(sub._id, 'feedback', e.target.value)}
                          placeholder="Add feedback"
                          style={styles.textareaSmall}
                        />
                      </td>
                      <td style={styles.td}>
                        <button
                          onClick={() => saveReview(sub._id)}
                          style={styles.saveButton}
                        >
                          Save Review
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" style={styles.noData}>
                    No submissions found for this task
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}