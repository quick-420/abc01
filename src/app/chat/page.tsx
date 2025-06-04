
"use client";

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/firebase'; // Use authInstance as auth
import { onAuthStateChanged, type User } from 'firebase/auth';
import { getUserChatSessions, fetchParticipantInfo } from '@/lib/chatService';
import type { UserChatSession, ChatParticipantInfo } from '@/types/chat';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MessageSquare, Users, Loader2 } from 'lucide-react';
import { formatDistanceToNowStrict } from 'date-fns';

export default function ChatListPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [chatSessions, setChatSessions] = useState<UserChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [participantDetails, setParticipantDetails] = useState<{ [key: string]: ChatParticipantInfo }>({});

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        router.push('/auth/patient-login'); // Or a generic login page
      }
    });
    return () => unsubscribeAuth();
  }, [router]);

  useEffect(() => {
    if (!currentUser) return;

    setIsLoading(true);
    const unsubscribeSessions = getUserChatSessions(currentUser.uid, async (sessions) => {
      setChatSessions(sessions);
      
      // Fetch participant details for display names if not already in session data
      const detailsToFetch = sessions.filter(s => s.otherParticipantId && !participantDetails[s.otherParticipantId] && !s.otherParticipantName);
      if (detailsToFetch.length > 0) {
        const newDetails: { [key: string]: ChatParticipantInfo } = {};
        for (const session of detailsToFetch) {
          if (session.otherParticipantId) {
            const info = await fetchParticipantInfo(session.otherParticipantId);
            if (info) newDetails[session.otherParticipantId] = info;
          }
        }
        setParticipantDetails(prev => ({ ...prev, ...newDetails }));
      }
      setIsLoading(false);
    });

    return () => unsubscribeSessions();
  }, [currentUser, participantDetails]);


  if (isLoading || !currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading your chats...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <MessageSquare className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-2xl font-headline">Your Messages</CardTitle>
              <CardDescription>Continue your conversations.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {chatSessions.length === 0 ? (
            <div className="text-center py-10">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-xl text-muted-foreground">No active chats yet.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Start a conversation with a doctor or patient.
              </p>
              {/* TODO: Add a button to find users to chat with if applicable */}
            </div>
          ) : (
            <ul className="space-y-3">
              {chatSessions.map((session) => {
                const otherParticipantName = session.otherParticipantName || participantDetails[session.otherParticipantId]?.displayName || 'Chat Partner';
                const otherParticipantInitials = otherParticipantName.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
                
                return (
                  <li key={session.id}>
                    <Link href={`/chat/${session.otherParticipantId}`} passHref>
                      <Button variant="ghost" className="w-full h-auto p-3 justify-start text-left hover:bg-secondary transition-colors rounded-lg border">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={`https://placehold.co/100x100.png?text=${otherParticipantInitials}`} alt={otherParticipantName} data-ai-hint="user avatar" />
                          <AvatarFallback>{otherParticipantInitials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-grow">
                          <p className="font-semibold text-base">{otherParticipantName}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[200px] sm:max-w-[300px] md:max-w-full">
                            {session.lastMessageSenderId === currentUser.uid ? "You: " : ""}
                            {session.lastMessageText || "No messages yet."}
                          </p>
                        </div>
                        {session.lastMessageTimestamp && (
                          <p className="text-xs text-muted-foreground ml-auto self-start whitespace-nowrap">
                            {formatDistanceToNowStrict(new Date(session.lastMessageTimestamp), { addSuffix: true })}
                          </p>
                        )}
                      </Button>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
