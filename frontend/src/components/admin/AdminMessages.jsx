import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import api from '../../axios';
import { useAuth } from '../../context/AuthContext';

const socket = io(import.meta.env.VITE_SOCKET_API_URL);

export default function AdminMessages() {
  const { auth } = useAuth();
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const endRef = useRef();

  useEffect(() => {
    socket.emit('join', { userId: auth.user._id });
  }, [auth]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get('/students', {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        setStudents(res.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    if (auth?.token) {
      fetchStudents();
    }
  }, [auth]);

  useEffect(() => {
    if (!selected) return;

    const url = selected === 'group'
      ? '/messages/group'
      : `/messages/private/${selected}`;

    api.get(url, {
      headers: { Authorization: `Bearer ${auth.token}` }
    }).then((res) => setMessages(res.data));

    // clear previous listeners
    socket.off('receive_group_message');
    socket.off('receive_private_message');

    if (selected === 'group') {
      socket.on('receive_group_message', (msg) => {
        setMessages((prev) => [...prev, msg]);
      });
    } else {
      socket.on('receive_private_message', (msg) => {
        if (msg.sender === selected || msg.recipient === selected) {
          setMessages((prev) => [...prev, msg]);
        }
      });
    }
  }, [selected, auth]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!text) return;
    socket.emit('send_message', {
      senderId: auth.user._id,
      senderModel: 'Admin',
      recipientId: selected === 'group' ? null : selected,
      message: text,
      isGroup: selected === 'group'
    });
    setMessages((prev) => [...prev, {
      message: text,
      senderModel: 'Admin',
      sender: auth.user._id,
      recipient: selected === 'group' ? null : selected,
      createdAt: new Date()
    }]);
    setText('');
  };

  const getSelectedName = () => {
    if (selected === 'group') return 'Group Chat';
    const student = students.find(s => s._id === selected);
    return student ? student.name : 'Select a chat';
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
    chatContainer: {
      display: 'grid',
      gridTemplateColumns: '300px 1fr',
      gap: '1.5rem',
      height: 'calc(100vh - 140px)',
      margin: '0 2rem',
    },
    sidebar: {
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      border: '1px solid #e2e8f0',
      overflow: 'hidden',
    },
    sidebarHeader: {
      padding: '1.5rem',
      borderBottom: '1px solid #e2e8f0',
      backgroundColor: '#f8fafc',
    },
    sidebarTitle: {
      fontSize: '1.125rem',
      fontWeight: '600',
      color: '#2d3748',
      margin: '0',
    },
    contactsList: {
      maxHeight: 'calc(100vh - 260px)',
      overflowY: 'auto',
    },
    contactItem: {
      padding: '1rem 1.5rem',
      borderBottom: '1px solid #f3f4f6',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      display: 'flex',
      alignItems: 'center',
    },
    contactItemActive: {
      backgroundColor: '#eff6ff',
      borderRight: '3px solid #3b82f6',
    },
    contactItemHover: {
      backgroundColor: '#f8fafc',
    },
    contactAvatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: '#3b82f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontSize: '0.875rem',
      fontWeight: '600',
      marginRight: '0.75rem',
      flexShrink: 0,
    },
    contactInfo: {
      flex: 1,
      minWidth: 0,
    },
    contactName: {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#2d3748',
      marginBottom: '0.25rem',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    contactType: {
      fontSize: '0.75rem',
      color: '#6b7280',
    },
    chatArea: {
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      border: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    },
    chatHeader: {
      padding: '1rem 1.5rem',
      borderBottom: '1px solid #e2e8f0',
      backgroundColor: '#f8fafc',
    },
    chatTitle: {
      fontSize: '1.125rem',
      fontWeight: '600',
      color: '#2d3748',
      margin: '0',
    },
    messagesContainer: {
      flex: 1,
      padding: '1rem',
      overflowY: 'auto',
      backgroundColor: '#f8fafc',
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f1f5f9' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    },
    messageGroup: {
      marginBottom: '1rem',
    },
    messageAdmin: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginBottom: '0.5rem',
    },
    messageStudent: {
      display: 'flex',
      justifyContent: 'flex-start',
      marginBottom: '0.5rem',
    },
    messageBubble: {
      maxWidth: '70%',
      padding: '0.75rem 1rem',
      borderRadius: '18px',
      fontSize: '0.875rem',
      lineHeight: '1.4',
      position: 'relative',
    },
    messageBubbleAdmin: {
      backgroundColor: '#3b82f6',
      color: '#fff',
      borderBottomRightRadius: '6px',
    },
    messageBubbleStudent: {
      backgroundColor: '#fff',
      color: '#2d3748',
      border: '1px solid #e2e8f0',
      borderBottomLeftRadius: '6px',
    },
    messageTime: {
      fontSize: '0.75rem',
      opacity: 0.7,
      marginTop: '0.25rem',
    },
    messageSender: {
      fontSize: '0.75rem',
      fontWeight: '600',
      marginBottom: '0.25rem',
      opacity: 0.8,
    },
    inputContainer: {
      padding: '1rem 1.5rem',
      borderTop: '1px solid #e2e8f0',
      backgroundColor: '#fff',
      display: 'flex',
      gap: '0.75rem',
      alignItems: 'flex-end',
    },
    messageInput: {
      flex: 1,
      padding: '0.75rem 1rem',
      border: '1px solid #d1d5db',
      borderRadius: '20px',
      fontSize: '0.875rem',
      resize: 'none',
      maxHeight: '100px',
      minHeight: '44px',
      outline: 'none',
      transition: 'border-color 0.2s',
    },
    sendButton: {
      backgroundColor: '#3b82f6',
      color: '#fff',
      padding: '0.75rem 1.5rem',
      border: 'none',
      borderRadius: '20px',
      fontSize: '0.875rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      flexShrink: 0,
    },
    emptyState: {
      flex: 1,
      display: 'flex',
            flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#6b7280',
      fontSize: '1rem',
      padding: '2rem',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Admin Messages</h1>
      </div>
      <div style={styles.chatContainer}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          <div style={styles.sidebarHeader}>
            <h2 style={styles.sidebarTitle}>Students</h2>
          </div>
          <div style={styles.contactItem} onClick={() => setSelected('group')}>
            <div style={styles.contactAvatar}>G</div>
            <div style={styles.contactInfo}>
              <div style={styles.contactName}>Group Chat</div>
              <div style={styles.contactType}>All students</div>
            </div>
          </div>
          <div style={styles.contactsList}>
            {students.map((student) => (
              <div
                key={student._id}
                style={{
                  ...styles.contactItem,
                  ...(selected === student._id ? styles.contactItemActive : {}),
                }}
                onClick={() => setSelected(student._id)}
              >
                <div style={styles.contactAvatar}>
                  {student.name?.charAt(0).toUpperCase()}
                </div>
                <div style={styles.contactInfo}>
                  <div style={styles.contactName}>{student.name}</div>
                  <div style={styles.contactType}>Student</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div style={styles.chatArea}>
          <div style={styles.chatHeader}>
            <h2 style={styles.chatTitle}>{getSelectedName()}</h2>
          </div>
          <div style={styles.messagesContainer}>
            {messages.length === 0 ? (
              <div style={styles.emptyState}>No messages yet.</div>
            ) : (
              messages.map((msg, idx) => {
                const isAdmin = msg.senderModel === 'Admin';
                return (
                  <div
                    key={idx}
                    style={isAdmin ? styles.messageAdmin : styles.messageStudent}
                  >
                    <div
                      style={{
                        ...styles.messageBubble,
                        ...(isAdmin
                          ? styles.messageBubbleAdmin
                          : styles.messageBubbleStudent),
                      }}
                    >
                      {!isAdmin && (
                        <div style={styles.messageSender}>{msg.senderName || 'Student'}</div>
                      )}
                      {msg.message}
                      <div style={styles.messageTime}>
                        {formatTime(msg.createdAt)}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={endRef} />
          </div>
          {/* Input Area */}
          {selected && (
            <div style={styles.inputContainer}>
              <textarea
                style={styles.messageInput}
                rows={1}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message..."
              />
              <button style={styles.sendButton} onClick={sendMessage}>
                Send
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
