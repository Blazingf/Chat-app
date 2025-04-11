import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import queryString from 'query-string';
import { useLocation } from 'react-router-dom';

const ENDPOINT = 'http://localhost:5000';
let socket;

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);
    socket = io(ENDPOINT, {
      transports: ['websocket'], // important!
    });

    socket.emit('join', { name, room });

    return () => {
      socket.disconnect();
      socket.off();
    };
  }, [location.search]);

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((msgs) => [...msgs, message]);
    });
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  };

  return (
    <div>
      <div>
        {messages.map((msg, i) => (
          <div key={i}>
            <b>{msg.user}</b>: {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
