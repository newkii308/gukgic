import React from 'react';
import { ChatWindow } from '@/components/chat/chat-window';

interface ChatPageProps {
  params: { id: string };
}

export default function ChatPage({ params }: ChatPageProps) {
  return (
    <div className="max-w-3xl mx-auto">
      <ChatWindow conversationId={params.id} />
    </div>
  );
}
