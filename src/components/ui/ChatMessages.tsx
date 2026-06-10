import React, { forwardRef } from 'react';
import { MessageComponent } from '@/src/components/ui/Message';
import { TypingIndicator } from '@/src/components/ui/TypingIndicator';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatMessagesProps {
  messages: Message[];
  isTyping: boolean;
}

export const ChatMessages = forwardRef<HTMLDivElement, ChatMessagesProps>(
  ({ messages, isTyping }, ref) => {
    return (
      <div className="space-y-3 sm:space-y-4 min-h-full flex flex-col p-3 sm:p-4">
        {messages.map((message) => (
          <MessageComponent key={message.id} message={message} />
        ))}
        {isTyping && <TypingIndicator />}
        <div />
      </div>
    );
  }
);

ChatMessages.displayName = 'ChatMessages';
