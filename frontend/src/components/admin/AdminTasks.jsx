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
  // Example: { submissionId1: { reviewStatus: 'Satisfied', feedback: 'Good job' }, ... }

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
      // Update the submissions state locally after saving
      setSubmissions(prev => prev.map(sub => {
        if (sub._id === submissionId) {
          return { ...sub, reviewStatus: edit.reviewStatus, feedback: edit.feedback };
        }
        return sub;
      }));
      // Optionally clear the edit state for this submission
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

  return (
    <div>
      <h2>Task Management</h2>

<form
  onSubmit={handleCreate}
  style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    maxWidth: '400px',
    margin: 'auto',
  }}
>
  <input
    type="text"
    placeholder="Title"
    value={form.title}
    onChange={(e) => setForm({ ...form, title: e.target.value })}
    required
  />

  <textarea
    placeholder="Description"
    value={form.description}
    onChange={(e) => setForm({ ...form, description: e.target.value })}
    required
  />

  <input
    type="text"
    placeholder="Assigned To Semester"
    value={form.assignedToSemester}
    onChange={(e) => setForm({ ...form, assignedToSemester: e.target.value })}
    required
  />

  <input
    type="date"
    value={form.deadline}
    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
    required
  />

  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
    <button type="submit">
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
        style={{
          backgroundColor: 'lightgray',
        }}
      >
        Cancel
      </button>
    )}
  </div>
</form>



      <h3>All Tasks</h3>
      <ul>
        {Array.isArray(tasks) && tasks.length > 0 ? (
          tasks.map((task) => (
            <li key={task._id}>
              <strong>{task.title}</strong> — {task.assignedToSemester} — due {task.deadline.slice(0, 10)}
              <button onClick={() => viewSubmissions(task._id)} style={{ marginLeft: '1rem' }}>View Submissions</button>
              <button onClick={() => startEditTask(task)} style={{ marginLeft: '0.5rem' }}>Edit</button>
              <button onClick={() => deleteTask(task._id)} style={{ marginLeft: '0.5rem', color: 'red' }}>Delete</button>
            </li>
          ))
        ) : (
          <li>No tasks found</li>
        )}
      </ul>

      {selectedTask && (
        <>
          <h4>Submissions for selected task</h4>
          <table border="1" cellPadding="8" cellSpacing="0">
            <thead>
              <tr>
                <th>Student</th>
                <th>GitHub Link</th>
                <th>Status</th>
                <th>Feedback</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(submissions) && submissions.length > 0 ? (
                submissions.map((sub) => {
                  const edit = editStates[sub._id] || {};
                  return (
                    <tr key={sub._id}>
                      <td>{sub.student?.name}</td>
                      <td><a href={sub.githubLink} target="_blank" rel="noreferrer">View</a></td>
                      <td>
                        <select
                          value={edit.reviewStatus ?? sub.reviewStatus}
                          onChange={(e) => handleEditChange(sub._id, 'reviewStatus', e.target.value)}
                        >
                          {['Pending', 'Satisfied', 'Unsatisfied', 'Try Again'].map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <textarea
                          rows={2}
                          value={edit.feedback ?? sub.feedback ?? ''}
                          onChange={(e) => handleEditChange(sub._id, 'feedback', e.target.value)}
                          placeholder="Add feedback"
                        />
                      </td>
                      <td>
                        <button onClick={() => saveReview(sub._id)}>Save</button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>No submissions found</td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}




// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import api from '../../axios';

// import { useAuth } from '../../context/AuthContext';

// export default function AdminTasks() {
//   const { auth } = useAuth();
//   const [tasks, setTasks] = useState([]);
//   const [form, setForm] = useState({ title: '', description: '', assignedToSemester: '', deadline: '' });
//   const [submissions, setSubmissions] = useState([]);
//   const [selectedTask, setSelectedTask] = useState(null);

//   const fetchTasks = async () => {
// const res = await api.get('/tasks', {
//   headers: { Authorization: `Bearer ${auth.token}` },
// });

//     setTasks(res.data);
//   };

//   const handleCreate = async (e) => {
//     e.preventDefault();
// await api.post('/tasks', form, {
//   headers: { Authorization: `Bearer ${auth.token}` },
// });

//     setForm({ title: '', description: '', assignedToSemester: '', deadline: '' });
//     fetchTasks();
//   };

// const viewSubmissions = async (taskId) => {
//   const res = await api.get('/submissions', {
//     headers: { Authorization: `Bearer ${auth.token}` },
//     params: { taskId }
//   });
//   setSubmissions(res.data);
//   setSelectedTask(taskId);
// };



//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   return (
//     <div>
//       <h2>Task Management</h2>

//       <form onSubmit={handleCreate} style={{ marginBottom: '2rem' }}>
//         <h3>Create New Task</h3>
//         <input type="text" placeholder="Title" required
//           value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
//         />
//         <br />
//         <textarea placeholder="Description"
//           value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
//         />
//         <br />
//         <input type="text" placeholder="Semester (e.g. Fall 2025)" required
//           value={form.assignedToSemester} onChange={(e) => setForm({ ...form, assignedToSemester: e.target.value })}
//         />
//         <br />
//         <input type="date" required
//           value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })}
//         />
//         <br />
//         <button type="submit">Create Task</button>
//       </form>

//       <h3>All Tasks</h3>
//       <ul>
// {Array.isArray(tasks) && tasks.length > 0 ? (
//   tasks.map((task) => (
//     <li key={task._id}>
//       <strong>{task.title}</strong> — {task.assignedToSemester} — due {task.deadline.slice(0, 10)}
//       <button onClick={() => viewSubmissions(task._id)} style={{ marginLeft: '1rem' }}>
//         View Submissions
//       </button>
//     </li>
//   ))
// ) : (
//   <li>No tasks found</li>
// )}

//       </ul>

//       {selectedTask && (
//         <>
//           <h4>Submissions for selected task</h4>
//           <table border="1" cellPadding="8" cellSpacing="0">
//             <thead>
//               <tr>
//                 <th>Student</th>
//                 <th>GitHub Link</th>
//                 <th>Status</th>
//                 <th>Feedback</th>
//               </tr>
//             </thead>
//             <tbody>
// {Array.isArray(submissions) && submissions.length > 0 ? (
//   submissions.map((sub) => (
//     <tr key={sub._id}>
//       <td>{sub.student?.name}</td>
//       <td><a href={sub.githubLink} target="_blank" rel="noreferrer">View</a></td>
//       <td>{sub.reviewStatus}</td>
//       <td>{sub.feedback || '—'}</td>
//     </tr>
//   ))
// ) : (
//   <tr>
//     <td colSpan="4" style={{ textAlign: 'center' }}>No submissions found</td>
//   </tr>
// )}

//             </tbody>
//           </table>
//         </>
//       )}
//     </div>
//   );
// }
