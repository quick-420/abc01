
"use client";

import { useEffect, useState, useRef, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { sendMessage, getMessages, generateChatId, fetchParticipantInfo } from '@/lib/chatService';
import type { ChatMessage, ChatParticipantInfo } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Loader2, ArrowLeft } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';

export default function ChatPage() {
  const router = useRouter();
  const params = useParams();
  const contactId = params.contactId as string;

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentUserInfo, setCurrentUserInfo] = useState<ChatParticipantInfo | null>(null);
  const [contactInfo, setContactInfo] = useState<ChatParticipantInfo | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatId, setChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const uInfo = await fetchParticipantInfo(user.uid);
        setCurrentUserInfo(uInfo);
      } else {
        router.push('/auth/patient-login'); // Or a generic login page
      }
    });
    return () => unsubscribeAuth();
  }, [router]);

  useEffect(() => {
    if (currentUser && contactId) {
      const currentChatId = generateChatId(currentUser.uid, contactId);
      setChatId(currentChatId);

      const fetchContactDetails = async () => {
        setIsLoading(true);
        const cInfo = await fetchParticipantInfo(contactId);
        setContactInfo(cInfo);
        setIsLoading(false);
      };
      fetchContactDetails();
      
      const unsubscribeMessages = getMessages(currentChatId, setMessages);
      return () => unsubscribeMessages();
    }
  }, [currentUser, contactId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId || !currentUser || !currentUserInfo || !contactInfo) return;

    try {
      await sendMessage(
        chatId,
        currentUser.uid,
        currentUserInfo.displayName,
        newMessage,
        contactId,
        contactInfo.displayName
      );
      setNewMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
      // Optionally show a toast to the user
    }
  };
  
  if (isLoading || !currentUserInfo || !contactInfo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading chat...</p>
      </div>
    );
  }

  const getAvatarInitials = (name?: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
  }

  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-height,80px)-var(--footer-height,60px))] md:h-[calc(100vh-var(--header-height,64px)-var(--footer-height,52px))] items-center justify-center p-2 md:p-4 bg-secondary">
      <Card className="w-full max-w-2xl h-full flex flex-col shadow-xl">
        <CardHeader className="border-b p-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" onClick={() => router.push('/chat')} className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Avatar>
              <AvatarImage src={`https://placehold.co/40x40.png?text=${getAvatarInitials(contactInfo.displayName)}`} alt={contactInfo.displayName} data-ai-hint="user avatar"/>
              <AvatarFallback>{getAvatarInitials(contactInfo.displayName)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold font-headline">{contactInfo.displayName}</h2>
              <p className="text-xs text-muted-foreground">
                {contactInfo.role === 'doctor' ? 'Doctor' : 'Patient'}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden p-0">
          <ScrollArea className="h-full p-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-end space-x-2 ${
                    msg.senderId === currentUser?.uid ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.senderId !== currentUser?.uid && (
                    <Avatar className="h-8 w-8 self-start">
                       <AvatarImage src={`https://placehold.co/40x40.png?text=${getAvatarInitials(msg.senderName)}`} alt={msg.senderName} data-ai-hint="user avatar"/>
                      <AvatarFallback>{getAvatarInitials(msg.senderName)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[70%] p-3 rounded-lg shadow ${
                      msg.senderId === currentUser?.uid
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-card text-card-foreground border rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.senderId === currentUser?.uid ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground/70 text-left'}`}>
                        {format(new Date(msg.timestamp), 'p')}
                    </p>
                  </div>
                  {msg.senderId === currentUser?.uid && (
                     <Avatar className="h-8 w-8 self-start">
                       <AvatarImage src={`https://placehold.co/40x40.png?text=${getAvatarInitials(currentUserInfo.displayName)}`} alt={currentUserInfo.displayName} data-ai-hint="user avatar"/>
                       <AvatarFallback>{getAvatarInitials(currentUserInfo.displayName)}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="p-4 border-t">
          <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
            <Input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-grow"
              autoComplete="off"
            />
            <Button type="submit" size="icon" disabled={!newMessage.trim()}>
              <Send className="h-5 w-5" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
