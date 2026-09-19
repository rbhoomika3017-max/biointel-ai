// Simple in-memory conversation storage

const conversations = new Map();

// Create or get a conversation
function getConversation(conversationId) {
  if (!conversations.has(conversationId)) {
    conversations.set(conversationId, {
      messages: []
    });
  }

  return conversations.get(conversationId);
}

// Add a message to a conversation
function addMessage(conversationId, role, content) {
  const conversation = getConversation(conversationId);

  conversation.messages.push({
    role,
    content,
    timestamp: new Date().toISOString()
  });

  // Keep only the latest 10 messages
  if (conversation.messages.length > 10) {
    conversation.messages =
      conversation.messages.slice(-10);
  }

  return conversation;
}

// Get previous messages
function getMessages(conversationId) {
  const conversation = getConversation(conversationId);

  return conversation.messages;
}

// Clear a conversation
function clearConversation(conversationId) {
  conversations.delete(conversationId);
}

module.exports = {
  getConversation,
  addMessage,
  getMessages,
  clearConversation
};