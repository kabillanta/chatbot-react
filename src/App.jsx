import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import Header from './Header';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await axios.post('http://localhost:5000/chat', { text: input });
      const botMessage = { role: 'bot', content: response.data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { role: 'bot', content: 'Error: Failed to connect to the server.' };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setInput('');
  };

  return (
    <>
    <Header />
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <span>{msg.role === 'user' ? 'You' : 'Bot'}: {msg.content}</span>
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}> Send </button>
      </div>
    </div>
    </>
  );
}

export default App;
