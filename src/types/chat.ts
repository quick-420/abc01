
export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
}

export interface ChatSession {
  id: string; // Composite key: uid1_uid2 (sorted alphabetically)
  participantIds: string[];
  participantNames: { [key: string]: string }; // { uid: name }
  lastMessageText?: string;
  lastMessageTimestamp?: number;
  lastMessageSenderId?: string;
  unreadCounts?: { [key: string]: number }; // { recipientId: count }
}

// For user's list of chats, might be a simplified version
export interface UserChatSession extends ChatSession {
  // any additional fields specific to how it's stored under userChatSessions/{userId}
  otherParticipantId: string;
  otherParticipantName: string;
}

// Basic user data fetched from Firestore for chat display
export interface ChatParticipantInfo {
  uid: string;
  displayName: string;
  role: 'patient' | 'doctor' | string; // Allow for other roles or be more specific
}
