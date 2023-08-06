import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Container, Typography, Box, TextField, Button, Divider } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const socket = io.connect('http://localhost:3001');

const App = () => {
  const [room, setRoom] = useState('');
  const [isShow, setIsShow] = useState(true);
  const [username, setUsername] = useState('');
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
      setIsShow(false)
    }
  };

  const sendMessage = () => {
    const data = {
      username,
      message,
      room,
      date: new Date(Date.now()).toLocaleTimeString(),
    };
    socket.emit('send_message', data);
    setReceivedMessage((last) => [...last, data]);
    setMessage('');
  };

  return (
    <Container maxWidth="sm">
      <Box mt={2} textAlign="center">
        <Typography variant="h4">Welcome to Live Chat App</Typography>
      </Box>
      {isShow && <><Box mt={2} display="flex" justifyContent="center">
        <TextField
          value={username} size='small'
          label="Username"
          variant="outlined"
          onChange={(e) => setUsername(e.target.value)}
        />
      </Box>
      <Box mt={2} display="flex" justifyContent="center">
        <TextField
          value={room} size='small'
          label="Room"
          variant="outlined"
          onChange={(e) => setRoom(e.target.value)}
        />
      </Box>
      <Box mt={2} display="flex" justifyContent="center">
        <Button variant="contained" color="primary" onClick={joinRoom}>
          Join Room
        </Button>
      </Box></> }
      <Box mt={4}>
        <Divider variant="middle" />
        <Box mt={2}>
          <div className="chat-messages">
            <Data receivedMessage={receivedMessage} />
          </div>
        </Box>
      </Box>
      <Box mt={2} display="flex" alignItems="center">
        <TextField
          value={message}
          label="Type a message..."
          variant="outlined"
          onChange={(e) => setMessage(e.target.value)}
          fullWidth size='small'
        />
        <Button style={{marginLeft:20}} variant="contained" color="primary" onClick={sendMessage}>
          <SendIcon />
        </Button>
      </Box>
    </Container>
  );
};

const Data = ({ receivedMessage }) => {
  return (
    <div>
      {receivedMessage.map((msg, index) => {
        return (
          <p key={index} className={`message ${msg.username === 'You' ? 'sent' : 'received'}`}>
            <span className="username">{msg.username}</span>
            <span className="message-text">{msg.message}</span>
            <span className="date">{msg.date}</span>
          </p>
        );
      })}
    </div>
  );
};

export default App;
