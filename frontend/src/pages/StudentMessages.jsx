import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import api from '../axios';
import { useAuth } from '../context/AuthContext';
import './StudentMessages.css';

const socket = io(import.meta.env.VITE_SOCKET_API_URL);

export default function StudentMessages() {
  const { auth } = useAuth();
  const [selected, setSelected] = useState('group'); // default to group chat
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const endRef = useRef();
  const ADMIN_ID = import.meta.env.VITE_ADMIN_ID;

  useEffect(() => {
    // join user room on connect
    socket.emit('join', { userId: auth.user._id });
  }, [auth]);

  useEffect(() => {
    // fetch messages based on selected chat (group or private with admin)
    const url = selected === 'group' ? '/messages/group' : `/messages/private/${ADMIN_ID}`;

    api.get(url, {
      headers: { Authorization: `Bearer ${auth.token}` }
    }).then((res) => {
      setMessages(res.data);
    }).catch(err => console.error('Error loading messages:', err));

    // Clear previous listeners
    socket.off('receive_group_message');
    socket.off('receive_private_message');

    // Listen to incoming messages depending on chat type
    if (selected === 'group') {
      socket.on('receive_group_message', (msg) => {
        setMessages((prev) => [...prev, msg]);
      });
    } else {
      socket.on('receive_private_message', (msg) => {
        // Only show messages in private chat with admin
        if ((msg.senderModel === 'Admin' && msg.recipient === auth.user._id) ||
          (msg.senderModel === 'Student' && msg.sender === auth.user._id)) {
          setMessages((prev) => [...prev, msg]);
        }
      });
    }
  }, [selected, auth]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim()) return;

    const isGroup = selected === 'group';

    socket.emit('send_message', {
      senderId: auth.user._id,
      senderModel: 'Student',
      recipientId: isGroup ? null : ADMIN_ID,
      message: text,
      isGroup
    });

    setMessages((prev) => [...prev, {
      message: text,
      senderModel: 'Student',
      sender: auth.user._id,
      recipient: isGroup ? null : ADMIN_ID,
      createdAt: new Date()
    }]);

    setText('');
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-container">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="chat-title">
          <span className="chat-icon">💬</span>
          <h3>Student Chat</h3>
        </div>
        
        <div className="chat-mode-selector">
          <label className="mode-label">Chat Mode:</label>
          <select 
            value={selected} 
            onChange={e => setSelected(e.target.value)}
            className="mode-dropdown"
          >
            <option value="group">🌐 Group Chat</option>
            <option value="private">👤 Chat with Admin</option>
          </select>
        </div>
      </div>

      {/* Messages Area */}
      <div className="messages-container">
        {messages.length > 0 ? (
          messages.map((m, i) => (
            <div 
              key={i} 
              className={`message-wrapper ${m.senderModel === 'Student' ? 'own-message' : 'other-message'}`}
            >
              <div className="message-bubble">
                <div className="message-header">
                  <span className="sender-name">
                    {m.senderModel === 'Student' ? '👤 You' : '👨‍💼 Admin'}
                  </span>
                  <span className="message-time">
                    {formatTime(m.createdAt)}
                  </span>
                </div>
                <div className="message-content">
                  {m.message}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-messages">
            <div className="empty-icon">💭</div>
            <p>No messages yet.</p>
            <span>Start the conversation!</span>
          </div>
        )}
        <div ref={endRef}></div>
      </div>

      {/* Message Input */}
      <div className="message-input-container">
        <div className="input-wrapper">
          <input
            type="text"
            value={text}
            placeholder={`Type your message for ${selected === 'group' ? 'group chat' : 'admin'}...`}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            className="message-input"
          />
          <button 
            onClick={sendMessage}
            className="send-button"
            disabled={!text.trim()}
          >
            <span className="send-icon">📤</span>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}