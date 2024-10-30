import React, { useState } from 'react';

function ChatBot() {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = { text: inputText, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputText }),
      });

      const data = await response.json();
      const botMessage = { text: data.reply, sender: 'bot' };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      setInputText('');
    } catch (error) {
      console.error('Error with chatbot:', error);
      const errorMessage = { text: "Sorry, I couldn't process your request.", sender: 'bot' };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  return (
    <div style={styles.chatContainer}>
      <div style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div key={index} style={msg.sender === 'user' ? styles.userMessage : styles.botMessage}>
            <strong>{msg.sender === 'user' ? 'You: ' : 'Bot: '}</strong>
            {msg.text}
          </div>
        ))}
      </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Type your message..."
          style={styles.input}
        />
        <button onClick={handleSendMessage} style={styles.button}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  chatContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '500px',
    margin: '0 auto',
    backgroundColor: '#f1f1f1',
    borderRadius: '8px',
    padding: '10px',
  },
  chatBox: {
    display: 'flex',
    flexDirection: 'column',
    height: '300px',
    overflowY: 'auto',
    padding: '10px',
    marginBottom: '10px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#e0f7fa',
    padding: '8px',
    borderRadius: '8px',
    marginBottom: '4px',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e8eaf6',
    padding: '8px',
    borderRadius: '8px',
    marginBottom: '4px',
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: '8px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '8px 16px',
    marginLeft: '8px',
    fontSize: '16px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
  },
};

export default ChatBot;
