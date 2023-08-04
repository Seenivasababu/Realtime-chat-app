import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
const socket = io.connect('http://localhost:3001');

const App = () => {
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [receivedMessage, setReceivedMessage] = useState([]);

  useEffect(() => {
    socket.on('received_message', (data) => {
      setReceivedMessage((last) => [...last, data]);
    });
    return () => {
      socket.off('received_message');
    };
  }, []);

  const joinRoom = () => {
    if (room !== '') {
      socket.emit('join_room', room);
    }
  };

  const sendMessage = () => {
    const data = {
      message,
      room,
      date: new Date(Date.now()).toLocaleTimeString(),
    };
    socket.emit('send_message', data);
    setReceivedMessage((last) => [...last, data]);
  };

  return (
    <div>
      <input value={room} placeholder='Enter room' onChange={(e) => setRoom(e.target.value)}></input>
      <button onClick={joinRoom}>Join Room</button>
      <input value={message} placeholder='Enter message' onChange={(e) => setMessage(e.target.value)}></input>
      <button onClick={sendMessage}>Send message</button>
      <h1>Received Message </h1>

      <Data receivedMessage={receivedMessage} />
    </div>
  );
};

const Data = ({ receivedMessage }) => {
  return (
    <div>
      {receivedMessage.map((msg, index) => {
        return <p key={index}>{msg.message} <span>{msg.date}</span></p>;
      })}
    </div>
  );
};

export default App;
