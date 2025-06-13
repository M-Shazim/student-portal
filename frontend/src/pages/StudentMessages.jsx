import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import api from '../axios';
import { useAuth } from '../context/AuthContext';
const socket = io(import.meta.env.VITE_SOCKET_API_URL);
  // replace with your server IP or domain
// your backend socket.io url

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


  return (
    <div>
      <h2>Student Chat</h2>

      <label>Chat Mode: </label>
      <select value={selected} onChange={e => setSelected(e.target.value)}>
        <option value="group">Group Chat</option>
        <option value="private">Chat with Admin</option>
      </select>

      <div style={{ border: '1px solid #ccc', padding: '1rem', marginTop: '1rem', height: '300px', overflowY: 'scroll' }}>
        {messages.length > 0 ? messages.map((m, i) => (
          <div key={i} style={{ textAlign: m.senderModel === 'Student' ? 'right' : 'left' }}>
            <p><strong>{m.senderModel}</strong>: {m.message}</p>
          </div>
        )) : (
          <p>No messages yet.</p>
        )}
        <div ref={endRef}></div>
      </div>

      <input
        type="text"
        value={text}
        placeholder="Enter message"
        onChange={e => setText(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && sendMessage()}
        style={{ width: '80%', marginTop: '1rem' }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
