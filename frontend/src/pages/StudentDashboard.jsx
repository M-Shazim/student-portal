import { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../axios';
import StudentMessages from './StudentMessages';



import { useAuth } from '../context/AuthContext';

export default function StudentDashboard() {
  const { auth } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [cert, setCert] = useState(null);
  const [linkMap, setLinkMap] = useState({});

  const [activeTab, setActiveTab] = useState('tasks');

  useEffect(() => {
    const semester = auth.user.semester;

    api.get(`/tasks/by-semester?semester=${semester}`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    })
      .then(res => {
        // If response is { tasks: [...] }, extract the array
        const fetchedTasks = Array.isArray(res.data)
          ? res.data
          : res.data.tasks;

        setTasks(fetchedTasks || []); // fallback to [] if undefined
      })
      .catch(err => {
        console.error('Error fetching tasks:', err);
        setTasks([]); // fallback to empty array on error
      });


    api.get('/submissions', {
      headers: { Authorization: `Bearer ${auth.token}` },
    })
      .then(res => {
        const submissions = Array.isArray(res.data)
          ? res.data
          : res.data.submissions || [];

        setSubmissions(submissions);

        // Safely generate the map
        const map = {};
        submissions.forEach(sub => {
          if (sub?.task?._id) {
            map[sub.task._id] = sub;
          }
        });
        setLinkMap(map);
      })
      .catch(err => {
        console.error('Error fetching submissions:', err);
        setSubmissions([]);
        setLinkMap({});
      });


    api.get('/reports', {
      headers: { Authorization: `Bearer ${auth.token}` },
    }).then(res => {
      const my = res.data.find(r => r.student._id === auth.user._id);
      if (my) setCert(my.certificateUrl);
    });
  }, [auth]);

const handleSubmit = async (taskId) => {
  const link = prompt('Enter your GitHub link');
  if (!link) return;

  try {
    await api.post('/submissions', {
      taskId,
      githubLink: link,
    }, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    window.location.reload();
  } catch (error) {
    console.error('Failed to submit:', error);
    alert('Submission failed, please try again.');
  }
};


  return (
      <div>
      <h2>Welcome, {auth.user.name}</h2>

      {/* Tabs */}
      <nav style={{ marginBottom: '1rem' }}>
        <button onClick={() => setActiveTab('tasks')} disabled={activeTab === 'tasks'}>
          Tasks & Certificates
        </button>
        <button onClick={() => setActiveTab('chat')} disabled={activeTab === 'chat'}>
          Chat with Admin
        </button>
      </nav>

      {/* Conditional rendering */}
      {activeTab === 'tasks' && (
        <>
          <h3>My Assigned Tasks</h3>
          <ul>
            {Array.isArray(tasks) && tasks.length > 0 ? (
              tasks.map(task => (
                <li key={task._id}>
                  <strong>{task.title}</strong> — due {task.deadline.slice(0, 10)}
                  <br />
                  {linkMap[task._id]
                    ? <>
                        ✅ Submitted:
                        <a href={linkMap[task._id].githubLink} target="_blank" rel="noreferrer"> GitHub Link</a>
                        <br />
                        Status: {linkMap[task._id].reviewStatus} <br />
                        Feedback: {linkMap[task._id].feedback || '—'}
                      </>
                    : <button onClick={() => handleSubmit(task._id)}>Submit Task</button>
                  }
                </li>
              ))
            ) : (
              <li>No tasks assigned.</li>
            )}
          </ul>

          <h3>My Certificate</h3>
          {cert
            ? <a href={cert} target="_blank" rel="noreferrer">Download Certificate</a>
            : <p>No certificate issued yet.</p>
          }
        </>
      )}

      {activeTab === 'chat' && (
        <StudentMessages />
      )}
    </div>



    // <div>
    //   <h2>Welcome, {auth.user.name}</h2>

    //         {/* Tabs */}
    //   <nav style={{ marginBottom: '1rem' }}>
    //     <button onClick={() => setActiveTab('tasks')} disabled={activeTab === 'tasks'}>
    //       Tasks & Certificates
    //     </button>
    //     <button onClick={() => setActiveTab('chat')} disabled={activeTab === 'chat'}>
    //       Chat with Admin
    //     </button>
    //   </nav>

    //   <h3>My Assigned Tasks</h3>
    //   <ul>
    //     {Array.isArray(tasks) && tasks.length > 0 ? (
    //       tasks.map(task => (
    //         <li key={task._id}>
    //           <strong>{task.title}</strong> — due {task.deadline.slice(0, 10)}
    //           <br />
    //           {linkMap[task._id]
    //             ? <>
    //               ✅ Submitted:
    //               <a href={linkMap[task._id].githubLink} target="_blank" rel="noreferrer"> GitHub Link</a>
    //               <br />
    //               Status: {linkMap[task._id].reviewStatus} <br />
    //               Feedback: {linkMap[task._id].feedback || '—'}
    //             </>
    //             : <button onClick={() => handleSubmit(task._id)}>Submit Task</button>
    //           }
    //         </li>
    //       ))
    //     ) : (
    //       <li>No tasks assigned.</li>
    //     )}

    //   </ul>

    //   <h3>My Certificate</h3>
    //   {cert
    //     ? <a href={cert} target="_blank" rel="noreferrer">Download Certificate</a>
    //     : <p>No certificate issued yet.</p>
    //   }
    // </div>
  );
}
