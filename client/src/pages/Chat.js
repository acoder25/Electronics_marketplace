import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchConversations, fetchMessages, setCurrentChat, addMessage } from '../store/slices/chatSlice';
import { FaPaperPlane, FaUser, FaImage } from 'react-icons/fa';
import './Chat.css';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [ws, setWs] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const dispatch = useDispatch();
  const { conversations, messages, currentChat, loading } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      const wsUrl = `ws://localhost:5000?userId=${user.id}`;
      const websocket = new WebSocket(wsUrl);

      websocket.onopen = () => {
        setIsConnected(true);
        console.log('WebSocket connected');
      };

      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'message') {
          dispatch(addMessage(data));
        }
      };

      websocket.onclose = () => {
        setIsConnected(false);
        console.log('WebSocket disconnected');
      };

      websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };

      setWs(websocket);

      return () => {
        websocket.close();
      };
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (currentChat) {
      dispatch(fetchMessages(currentChat.other_user_id));
    }
  }, [currentChat, dispatch]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleConversationClick = (conversation) => {
    console.log('Clicked conversation:', conversation);
    dispatch(setCurrentChat(conversation));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !currentChat || !ws) return;

    const messageData = {
      sender_id: user.id,
      receiver_id: currentChat.other_user_id,
      message: message.trim(),
      product_id: null,
      created_at: new Date().toISOString(),
    };

    ws.send(JSON.stringify({
      receiverId: currentChat.other_user_id,
      message: message.trim(),
      productId: null
    }));
    dispatch(addMessage(messageData)); // Optimistically add message for sender
    setMessage('');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      // Handle image upload logic here
      console.log('Image selected:', file);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCurrentChatMessages = () => {
    if (!currentChat) return [];
    const chatKey = [user.id, currentChat.other_user_id].sort().join('-');
    console.log('Chat window key:', chatKey, 'Messages:', messages[chatKey]);
    return messages[chatKey] || [];
  };

  const currentMessages = getCurrentChatMessages();

  return (
    <div className="chat-page">
      <div className="container">
        <div className="chat-header">
          <h1>Messages</h1>
          <div className="connection-status">
            <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}></span>
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>

        <div className="chat-container">
          {/* Conversations List */}
          <div className="conversations-list">
            <div className="conversations-header">
              <h3>Conversations</h3>
              <span className="conversation-count">{conversations.length}</span>
            </div>
            
            {loading ? (
              <div className="loading-conversations">
                <div className="loading-spinner"></div>
                <p>Loading conversations...</p>
              </div>
            ) : conversations.length > 0 ? (
              conversations
                .filter(conversation => conversation.other_user_id !== user.id)
                .map((conversation) => (
                  <div
                    key={conversation.other_user_id}
                    className={`conversation-item ${currentChat?.other_user_id === conversation.other_user_id ? 'active' : ''}`}
                    onClick={() => handleConversationClick(conversation)}
                  >
                    <div className="conversation-avatar">
                      <FaUser />
                    </div>
                    <div className="conversation-content">
                      <div className="conversation-header">
                        <span className="conversation-name">{conversation.other_username}</span>
                        <span className="conversation-time">
                          {formatTime(conversation.last_message_time)}
                        </span>
                      </div>
                      <div className="conversation-preview">
                        {conversation.last_message || 'Start a conversation'}
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="no-conversations">
                <p>No conversations yet</p>
                <p>Start chatting with sellers or buyers!</p>
              </div>
            )}
          </div>

          {/* Chat Messages */}
          <div className="chat-messages">
            {currentChat ? (
              <>
                <div className="messages-header">
                  <div className="chat-user-info">
                    <div className="chat-user-avatar">
                      <FaUser />
                    </div>
                    <div>
                      <h3>{currentChat.other_username}</h3>
                      <span className="chat-status">Online</span>
                    </div>
                  </div>
                </div>

                <div className="messages-list">
                  {currentMessages.length > 0 ? (
                    currentMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`message ${msg.sender_id === user.id ? 'sent' : 'received'}`}
                      >
                        <div className="message-bubble">
                          {msg.message}
                        </div>
                        <div className="message-time">
                          {formatTime(msg.created_at)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-messages">
                      <p>No messages yet</p>
                      <p>Start the conversation!</p>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="message-input-container">
                  <div className="message-input-form">
                    <input
                      type="text"
                      className="message-input"
                      placeholder="Type your message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      disabled={!isConnected}
                    />
                    <button
                      type="button"
                      className="btn btn-outline attachment-btn"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={!isConnected}
                    >
                      <FaImage />
                    </button>
                    <button
                      type="submit"
                      className="send-button"
                      disabled={!message.trim() || !isConnected}
                    >
                      <FaPaperPlane />
                    </button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                </form>
              </>
            ) : (
              <div className="no-chat-selected">
                <div className="no-chat-content">
                  <FaUser className="no-chat-icon" />
                  <h3>Select a conversation</h3>
                  <p>Choose a conversation from the list to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;