// src/Join.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Join() {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const navigate = useNavigate();

  const joinChat = () => {
    if (name && room) {
      navigate(`/chat?name=${name}&room=${room}`);
    }
  };

  return (
    <div className="join-container">
      <h2>Join Chat Room</h2>
      <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
      <input placeholder="Room" onChange={(e) => setRoom(e.target.value)} />
      <button onClick={joinChat}>Join</button>
    </div>
  );
}

export default Join;
