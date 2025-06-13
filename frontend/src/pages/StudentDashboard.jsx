import { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../axios';
import StudentMessages from './StudentMessages';
import { useAuth } from '../context/AuthContext';
import './StudentDashboard.css';

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
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="user-info">
            <div className="user-avatar">
              {auth.user.name.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <h1>Welcome back, {auth.user.name}</h1>
              <p>Semester {auth.user.semester}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-main">
        {/* Navigation Tabs */}
        <div className="tabs-container">
          <nav className="tabs-nav">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`tab-button ${activeTab === 'tasks' ? 'active' : ''}`}
            >
              <span className="tab-icon">📋</span>
              Tasks & Certificates
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`tab-button ${activeTab === 'chat' ? 'active' : ''}`}
            >
              <span className="tab-icon">💬</span>
              Chat with Admin
            </button>
          </nav>
        </div>

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="tab-content">
            {/* Tasks Section */}
            <div className="section">
              <div className="section-header">
                <h2>My Assigned Tasks</h2>
                <span className="task-counter">{tasks.length} Tasks</span>
              </div>
              
              {Array.isArray(tasks) && tasks.length > 0 ? (
                <div className="tasks-grid">
                  {tasks.map(task => {
                    const submission = linkMap[task._id];
                    const isSubmitted = !!submission;
                    const deadline = new Date(task.deadline);
                    const isOverdue = deadline < new Date() && !isSubmitted;
                    
                    return (
                      <div key={task._id} className={`task-card ${isOverdue ? 'overdue' : ''}`}>
                        <div className="task-header">
                          <h3 className="task-title">{task.title}</h3>
                          {isOverdue && (
                            <span className="overdue-badge">Overdue</span>
                          )}
                        </div>
                        
                        <div className="task-deadline">
                          <span className="deadline-icon">📅</span>
                          Due: {task.deadline.slice(0, 10)}
                        </div>

                        {isSubmitted ? (
                          <div className="submission-info">
                            <div className="submission-header">
                              <span className="submitted-badge">✅ Submitted</span>
                              <a
                                href={submission.githubLink}
                                target="_blank"
                                rel="noreferrer"
                                className="github-link"
                              >
                                View Code 🔗
                              </a>
                            </div>
                            
                            <div className={`status-badge status-${submission.reviewStatus}`}>
                              Status: {submission.reviewStatus}
                            </div>
                            
                            {submission.feedback && (
                              <div className="feedback-container">
                                <strong>Feedback:</strong> {submission.feedback}
                              </div>
                            )}
                          </div>
                        ) : (
                          <button
                            onClick={() => handleSubmit(task._id)}
                            className="submit-button"
                          >
                            Submit Task
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📝</div>
                  <h3>No tasks assigned</h3>
                  <p>You don't have any tasks assigned yet. Check back later!</p>
                </div>
              )}
            </div>

            {/* Certificate Section */}
            <div className="section">
              <h2>My Certificate</h2>
              <div className="certificate-card">
                {cert ? (
                  <div className="certificate-available">
                    <div className="certificate-info">
                      <div className="certificate-icon">🏆</div>
                      <div>
                        <h3>Certificate Available</h3>
                        <p>Congratulations! Your certificate is ready for download.</p>
                      </div>
                    </div>
                    <a
                      href={cert}
                      target="_blank"
                      rel="noreferrer"
                      className="download-button"
                    >
                      📥 Download Certificate
                    </a>
                  </div>
                ) : (
                  <div className="certificate-unavailable">
                    <div className="certificate-icon">📜</div>
                    <h3>Certificate Not Available</h3>
                    <p>Complete all your tasks to receive your certificate.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="tab-content">
            <div className="chat-container">
              <div className="chat-header">
                <h2>Chat with Admin</h2>
                <p>Get help and communicate with your administrator</p>
              </div>
              <div className="chat-content">
                <StudentMessages />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}