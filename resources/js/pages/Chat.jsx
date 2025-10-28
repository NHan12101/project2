import React, { useState } from 'react';
import axios from 'axios';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('/api/chat', { messages: newMessages });
      const reply = res.data.content;
      setMessages([...newMessages, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">🤖 AI Chat</h1>
      <div className="border p-4 h-96 overflow-y-auto rounded-lg bg-gray-50" style={{overflow: 'auto'}}>
        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 ${msg.role === 'user' ? 'text-blue-600' : 'text-green-700'}`}>
            <strong>{msg.role === 'user' ? 'You:' : 'AI:'}</strong> {msg.content}
          </div>
        ))}
        {loading && <div className="text-gray-400 italic">Thinking...</div>}
      </div>

      <form onSubmit={sendMessage} className="mt-4 flex">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded-l px-3 py-2"
          placeholder="Type your message..."
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
        >
          Send
        </button>
      </form>
    </div>
  );
}
