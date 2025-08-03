import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, X, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const UniversalChat = () => {
  const { user, isAuthenticated } = useAuth();
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [selectedChatUser, setSelectedChatUser] = useState(null);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock available users for chat
  useEffect(() => {
    const mockUsers = [
      { id: 1, name: 'Dr. Sarah Johnson', field: 'Biology', institution: 'Stanford University' },
      { id: 2, name: 'Prof. Michael Chen', field: 'Computer Science', institution: 'MIT' },
      { id: 3, name: 'Dr. Emily Rodriguez', field: 'Chemistry', institution: 'UC Berkeley' },
      { id: 4, name: 'Prof. David Kim', field: 'Physics', institution: 'Harvard University' },
      { id: 5, name: 'Dr. Lisa Wang', field: 'Medicine', institution: 'Johns Hopkins' },
      { id: 6, name: 'Prof. James Wilson', field: 'Engineering', institution: 'Caltech' }
    ];
    setAvailableUsers(mockUsers);
  }, []);

  const handleSendMessage = () => {
    if (chatMessage.trim() && selectedChatUser) {
      const newMessage = {
        id: Date.now(),
        text: chatMessage,
        sender: user?.id,
        timestamp: new Date().toLocaleTimeString(),
        senderName: user?.email?.split('@')[0] || 'You'
      };
      setChatMessages(prev => [...prev, newMessage]);
      setChatMessage('');
      // TODO: Send message to Supabase real-time
    }
  };

  const filteredUsers = availableUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.field.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.institution.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAuthenticated) return null;

  return (
    <>
      {/* Universal Chat Button */}
      <button
        onClick={() => setShowChat(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] mx-4 flex flex-col">
            {/* Chat Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Academic Chat</h3>
              <button
                onClick={() => setShowChat(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-1">
              {/* User List */}
              <div className="w-1/3 border-r border-gray-200 p-4">
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => setSelectedChatUser(user)}
                      className={`w-full text-left p-3 rounded-lg hover:bg-gray-50 ${
                        selectedChatUser?.id === user.id ? 'bg-blue-50 border border-blue-200' : ''
                      }`}
                    >
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-600">{user.field} • {user.institution}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 flex flex-col">
                {selectedChatUser ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b border-gray-200">
                      <div className="font-medium text-gray-900">{selectedChatUser.name}</div>
                      <div className="text-sm text-gray-600">{selectedChatUser.field} • {selectedChatUser.institution}</div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                      {chatMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === user?.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs px-4 py-2 rounded-lg ${
                              message.sender === user?.id
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-900'
                            }`}
                          >
                            <div className="text-sm">{message.text}</div>
                            <div className={`text-xs mt-1 ${
                              message.sender === user?.id ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {message.timestamp}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Message Input */}
                    <div className="p-4 border-t border-gray-200">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={chatMessage}
                          onChange={(e) => setChatMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder="Type your message..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                        />
                        <button
                          onClick={handleSendMessage}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    Select a user to start chatting
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UniversalChat; 