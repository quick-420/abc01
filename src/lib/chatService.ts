
'use server';
import type { ChatMessage, ChatSession, UserChatSession, ChatParticipantInfo } from '@/types/chat';
import { rtdb, db, auth } from './firebase'; // Use authInstance as auth
import { ref, push, set, serverTimestamp, onValue, off, query, orderByChild, get, child, update } from 'firebase/database';
import { doc, getDoc } from 'firebase/firestore';

export const generateChatId = (uid1: string, uid2: string): string => {
  return [uid1, uid2].sort().join('_');
};

export const fetchParticipantInfo = async (userId: string): Promise<ChatParticipantInfo | null> => {
  if (!userId) return null;
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      const data = userDocSnap.data();
      return {
        uid: userId,
        displayName: data.displayName || 'Unknown User',
        role: data.role || 'unknown',
      };
    }
    return { uid: userId, displayName: 'Unknown User', role: 'unknown' };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return { uid: userId, displayName: 'Error Fetching Name', role: 'unknown' };
  }
};

export const sendMessage = async (
  chatId: string,
  senderId: string,
  senderName: string,
  text: string,
  receiverId: string,
  receiverName: string
): Promise<void> => {
  if (!text.trim()) return;

  const messageRef = ref(rtdb, `chatMessages/${chatId}`);
  const newMessageRef = push(messageRef);
  const timestamp = Date.now(); // Using client-side timestamp for simplicity, serverTimestamp() for RTDB

  const messageData: Omit<ChatMessage, 'id'> = {
    chatId,
    senderId,
    senderName,
    text,
    timestamp,
  };

  await set(newMessageRef, messageData);

  // Update chat session metadata
  const sessionRef = ref(rtdb, `chatSessions/${chatId}`);
  const sessionUpdateData = {
    lastMessageText: text,
    lastMessageTimestamp: timestamp,
    lastMessageSenderId: senderId,
    participantIds: [senderId, receiverId].sort(),
    participantNames: {
      [senderId]: senderName,
      [receiverId]: receiverName,
    },
    // Consider adding unread counts logic here or separately
  };
  await update(sessionRef, sessionUpdateData);
  
  // Ensure session metadata is also in users' chat lists
  const user1SessionRef = ref(rtdb, `userChatSessions/${senderId}/${chatId}`);
  const user2SessionRef = ref(rtdb, `userChatSessions/${receiverId}/${chatId}`);

  const userSessionData = {
    id: chatId,
    ...sessionUpdateData,
    otherParticipantId: receiverId, // For sender, other is receiver
    otherParticipantName: receiverName,
  };
  await set(user1SessionRef, userSessionData);
  
  const userSessionDataForReceiver = {
    id: chatId,
    ...sessionUpdateData,
    otherParticipantId: senderId, // For receiver, other is sender
    otherParticipantName: senderName,
  };
  await set(user2SessionRef, userSessionDataForReceiver);

};

export const getMessages = (
  chatId: string,
  callback: (messages: ChatMessage[]) => void
): (() => void) => {
  const messagesRef = query(ref(rtdb, `chatMessages/${chatId}`), orderByChild('timestamp'));
  const listener = onValue(messagesRef, (snapshot) => {
    const messages: ChatMessage[] = [];
    snapshot.forEach((childSnapshot) => {
      messages.push({ id: childSnapshot.key!, ...childSnapshot.val() } as ChatMessage);
    });
    callback(messages);
  });
  return () => off(messagesRef, 'value', listener);
};

export const getUserChatSessions = (
  userId: string,
  callback: (sessions: UserChatSession[]) => void
): (() => void) => {
  const userSessionsRef = query(ref(rtdb, `userChatSessions/${userId}`), orderByChild('lastMessageTimestamp'));
  
  const listener = onValue(userSessionsRef, (snapshot) => {
    const sessions: UserChatSession[] = [];
    snapshot.forEach((childSnapshot) => {
      // Data should already have otherParticipantId and otherParticipantName
      sessions.push({ id: childSnapshot.key!, ...childSnapshot.val() } as UserChatSession);
    });
    // Reverse to show most recent first
    callback(sessions.reverse());
  });

  return () => off(userSessionsRef, 'value', listener);
};
