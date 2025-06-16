// components/project/chat/GroupChat.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { Button } from '../../ui/button';
import { useChatMessages } from '../../../supa_database/hooks/useChatMessages';

interface Persona {
  id: string;
  name: string;
  role: string;
  company?: string;
  description: string;
}

interface GroupChatProps {
  projectId: string;
  projectName: string;
  personas: Persona[];
}

export const GroupChat: React.FC<GroupChatProps> = ({ projectId, projectName, personas }) => {
  const { messages, loading, sendMessage } = useChatMessages(projectId);
  const [newMessage, setNewMessage] = useState('');
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    // Send message through the hook
    await sendMessage(newMessage, selectedPersona?.id || null, 'user', 'You');
    setNewMessage('');
    setSelectedPersona(null);
  };

  if (loading) {
    return <div className="p-4">Loading chat...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-lg">Group Chat</h3>
      </div>

      {/* Persona selection */}
      <div className="flex gap-3 p-4 border-b overflow-x-auto">
        {personas.map((persona) => (
          <button
            key={persona.id}
            onClick={() => setSelectedPersona(persona)}
            className={`flex-shrink-0 p-2 rounded-lg transition-colors ${
              selectedPersona?.id === persona.id ? 'bg-indigo-100' : 'hover:bg-gray-100'
            }`}
          >
            <div className="w-12 h-12 bg-gray-200 rounded-full mb-1 flex items-center justify-center">
              <span className="text-xl font-semibold text-gray-600">
                {persona.name.charAt(0)}
              </span>
            </div>
            <span className="text-xs">{persona.name}</span>
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="h-80 overflow-y-auto p-4">
        {messages.map((message) => {
          const isUser = message.sender_type === 'user';
          const persona = personas.find(p => p.id === message.persona_id);

          return (
            <div key={message.id} className={`mb-4 ${isUser ? 'text-right' : ''}`}>
              <div className={`inline-block rounded-lg p-3 max-w-[80%] ${
                isUser ? 'bg-indigo-600 text-white' : 'bg-gray-100'
              }`}>
                <p className="text-sm">{message.content}</p>
              </div>
              <div className="mt-1 text-xs text-gray-500">
                <span>{isUser ? 'You' : persona?.name || 'AI'}</span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t flex items-center">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder={selectedPersona ? `Ask ${selectedPersona.name}...` : "Type a message..."}
          className="flex-1 p-2 border border-gray-300 rounded-md"
        />
        <Button
          onClick={handleSendMessage}
          className="ml-2"
          disabled={!newMessage.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default GroupChat;
