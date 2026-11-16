import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api, errorMessage } from '../../lib/api';
import type { AiResult } from '../../types';

interface Message {
  id: number;
  question: string;
  result?: AiResult;
  error?: string;
}

export function useDealAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const status = useQuery({
    queryKey: ['status'],
    queryFn: async ({ signal }) =>
      (await api.get<{ data: { ai_configured: boolean } }>('/api/status', { signal })).data.data,
  });
  const mutation = useMutation({
    mutationFn: async ({ question }: { question: string; id: number }) =>
      (await api.post<{ data: AiResult }>('/api/assistant/messages', { question })).data.data,
    onSuccess: (result, variables) =>
      setMessages((previous) =>
        previous.map((message) => (message.id === variables.id ? { ...message, result } : message)),
      ),
    onError: (error, variables) =>
      setMessages((previous) =>
        previous.map((message) =>
          message.id === variables.id ? { ...message, error: errorMessage(error) } : message,
        ),
      ),
  });

  function send(text: string): boolean {
    if (!text.trim() || mutation.isPending) return false;
    const message = { id: Date.now(), question: text.trim() };
    setMessages((previous) => [...previous, message]);
    mutation.mutate(message);
    return true;
  }

  function retry(message: Message) {
    if (mutation.isPending) return;
    setMessages((previous) =>
      previous.map((item) => (item.id === message.id ? { ...item, error: undefined } : item)),
    );
    mutation.mutate({ id: message.id, question: message.question });
  }

  return { messages, status, isPending: mutation.isPending, send, retry };
}
