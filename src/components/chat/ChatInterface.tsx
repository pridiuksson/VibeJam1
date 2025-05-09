'use client';

import type { Character, ChatMessage } from '@/lib/types';
import { useEffect, useRef, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, User, SendHorizonal, Loader2, MessageSquareWarning } from 'lucide-react';
import { getAiResponse } from '@/lib/actions';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

interface ChatInterfaceProps {
  character: Character;
}

const chatFormSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty').max(500, 'Message too long'),
});
type ChatFormValues = z.infer<typeof chatFormSchema>;

export default function ChatInterface({ character }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [storySoFar, setStorySoFar] = useState<string>(character.initialStoryContext);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isPending, startTransition] = useTransition();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ChatFormValues>({
    resolver: zodResolver(chatFormSchema),
  });

  useEffect(() => {
    setMessages([
      {
        id: 'initial-greeting',
        sender: 'system',
        text: character.initialGreeting,
        timestamp: new Date(),
      },
    ]);
    setStorySoFar(character.initialStoryContext);
  }, [character]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);
  
  useEffect(() => {
    if (errors.message) {
      toast({
        title: "Validation Error",
        description: errors.message.message,
        variant: "destructive",
      });
    }
  }, [errors.message, toast]);

  const onSubmit: SubmitHandler<ChatFormValues> = (data) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: data.message,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    reset();
    setIsAiTyping(true);

    startTransition(async () => {
      const response = await getAiResponse({
        characterName: character.name,
        userChatInput: data.message,
        storySoFar: storySoFar,
      });

      setIsAiTyping(false);

      if (response.success && response.data) {
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: response.data.aiResponse,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
        setStorySoFar(response.data.updatedStorySoFar);
      } else {
        toast({
          title: 'Error',
          description: response.error || 'An unexpected error occurred with the AI.',
          variant: 'destructive',
        });
         const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'system',
          text: "I'm having a bit of trouble responding right now. Please try again in a moment.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-3xl mx-auto bg-card rounded-xl shadow-2xl overflow-hidden border">
      <header className="p-4 border-b flex items-center gap-4 bg-primary-foreground">
        <Avatar className="h-12 w-12 border-2 border-primary">
          <AvatarImage src={character.imageUrl} alt={character.name} data-ai-hint={character.imageHint || 'character portrait'} />
          <AvatarFallback>{character.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-semibold text-primary">{character.name}</h2>
          <p className="text-xs text-muted-foreground line-clamp-1">{character.description}</p>
        </div>
      </header>

      <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'flex items-end gap-2',
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {msg.sender === 'ai' && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={character.imageUrl} alt={character.name} />
                  <AvatarFallback><Bot size={18}/></AvatarFallback>
                </Avatar>
              )}
               {msg.sender === 'system' && (
                 <Avatar className="h-8 w-8 bg-accent text-accent-foreground">
                  <AvatarFallback><MessageSquareWarning size={18}/></AvatarFallback>
                </Avatar>
               )}
              <div
                className={cn(
                  'max-w-[70%] p-3 rounded-2xl shadow-md',
                  msg.sender === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : msg.sender === 'ai' 
                      ? 'bg-secondary text-secondary-foreground rounded-bl-none'
                      : 'bg-muted text-muted-foreground text-sm italic w-full text-center rounded-none shadow-none'
                )}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                {msg.sender !== 'system' && <p className="text-xs opacity-70 mt-1 text-right">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>}
              </div>
              {msg.sender === 'user' && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback><User size={18}/></AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isAiTyping && (
            <div className="flex items-end gap-2 justify-start">
              <Avatar className="h-8 w-8">
                 <AvatarImage src={character.imageUrl} alt={character.name} />
                 <AvatarFallback><Bot size={18}/></AvatarFallback>
              </Avatar>
              <div className="max-w-[70%] p-3 rounded-2xl shadow-md bg-secondary text-secondary-foreground rounded-bl-none">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit(onSubmit)} className="p-4 border-t bg-primary-foreground">
        <div className="flex items-center gap-2">
          <Input
            {...register('message')}
            placeholder="Tell your story..."
            autoComplete="off"
            className="flex-grow rounded-full focus-visible:ring-accent"
            disabled={isPending || isAiTyping}
          />
          <Button type="submit" size="icon" className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isPending || isAiTyping}>
            {isPending || isAiTyping ? <Loader2 className="h-5 w-5 animate-spin" /> : <SendHorizonal className="h-5 w-5" />}
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
