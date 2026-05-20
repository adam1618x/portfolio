"use client"

import React, { useState } from 'react';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Send } from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => Promise<void> | void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  onKeyPress,
  placeholder = "Type a message...",
  disabled = false
}: ChatInputProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSend = async () => {
    if (!value.trim()) return;
    setIsSubmitting(true);
    try {
      await onSend();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyPress}
        placeholder={placeholder}
        className="professional-input flex-1 text-base sm:text-lg py-2 sm:py-3 px-4 sm:px-5"
        autoComplete="off"
        disabled={disabled || isSubmitting}
        aria-label="Chat input"
      />
      <Button
        onClick={handleSend}
        disabled={!value.trim() || disabled || isSubmitting}
        className="h-10 w-fit mt-2 sm:mt-0 sm:w-auto professional-button-primary group flex items-center justify-center gap-2 px-4 cursor-pointer"
      >
        <Send
          className={`h-4 w-4 transition-transform ${isSubmitting ? 'animate-spin' : 'group-hover:-translate-y-1'
            }`}
        />
        {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
      </Button>
    </div>
  );
}
