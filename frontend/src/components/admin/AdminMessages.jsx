import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import api from '../../axios';

import { useAuth } from '../../context/AuthContext';

const socket = io('http://localhost:4000'); // replace with your backend host if different

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

  return (
    <div>
      <h2>Admin Chat</h2>

      <label>Select Recipient: </label>
      <select onChange={(e) => setSelected(e.target.value)} value={selected || ''}>
        <option value="">Select...</option>
        <option value="group">Group Chat</option>
        {Array.isArray(students) && students.length > 0 ? (
          students.map((s) => (
            <option key={s._id} value={s._id}>{s.name}</option>
          ))
        ) : (
          <option disabled>No students available</option>
        )}

      </select>

      <div style={{ border: '1px solid #ccc', padding: '1rem', marginTop: '1rem', height: '300px', overflowY: 'scroll' }}>
        {Array.isArray(messages) && messages.length > 0 ? (
          messages.map((m, i) => (
            <div key={i} style={{ textAlign: m.senderModel === 'Admin' ? 'right' : 'left' }}>
              <p><strong>{m.senderModel}</strong>: {m.message}</p>
            </div>
          ))
        ) : (
          <p>No messages yet.</p>
        )}

        <div ref={endRef}></div>
      </div>

      <input
        type="text"
        value={text}
        placeholder="Enter message"
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        style={{ width: '80%', marginTop: '1rem' }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
