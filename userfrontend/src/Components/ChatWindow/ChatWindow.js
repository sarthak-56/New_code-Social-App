import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode to decode the token
import styles from './ChatWindow.module.css'; // Import the CSS module

const socket = io('http://127.0.0.1:8001'); // Adjust the URL as necessary

const ChatWindow = () => {
  const { friendId } = useParams();
  const location = useLocation();
  const [friendName, setFriendName] = useState('');
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const name = params.get('name');
    if (name) {
      setFriendName(name);
    }
  }, [location.search]);

  useEffect(() => {

    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setCurrentUser({
        id: decodedToken.user_id || decodedToken.id || decodedToken.sub,
        username: decodedToken.username || decodedToken.name
      });
    }

    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/chat/chatrooms/${friendId}/messages/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    socket.emit('joinRoom', { room: friendId });

    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.emit('leaveRoom', { room: friendId });
    };
  }, [friendId]);

  const sendMessage = async () => {
    if (message.trim()) {
      socket.emit('chatMessage', { room: friendId, content: message });

      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`http://127.0.0.1:8000/api/chat/chatrooms/${friendId}/messages/`, {
          content: message,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMessages((prevMessages) => [...prevMessages, response.data]);
        setMessage('');
      } catch (error) {
        console.error('Error saving message to database:', error);
      }
    }
  };

  return (
    <div className={styles.chatWindow}>
      <h2>Chat with {friendName}</h2>
      <div className={styles.messages}>
        {messages.map((msg) => {
          const isCurrentUser = msg.sender_id === currentUser.id;
          console.log(msg.sender_id)

          return (
            <div
              key={msg.id}
              className={`${styles.messageContainer} ${isCurrentUser ? styles.myMessage : styles.otherMessage}`}
            >
              <div className={styles.message}>
                <strong>{msg.sender}:</strong> {msg.content}
              </div>
            </div>
          );
        })}

      </div>
      <div className={styles.sendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
