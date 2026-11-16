import { useState } from 'react';
import type { FormEvent } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ArrowUp, ArrowUpRight, CircleDollarSign, Clock3, LoaderCircle, MessageSquare, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { api, errorMessage } from '../lib/api';
import type { AiResult } from '../types';
import { AiContent, PageHeader } from '../components/ui';

const suggestions = [
  { question: 'What are the highest-value open deals?', icon: CircleDollarSign, label: 'Find your next big win' },
  { question: 'Which deals are expected to close this month?', icon: Clock3, label: 'Plan your month' },
  { question: 'Which customers have the most active deals?', icon: Users, label: 'Know your key relationships' },
  { question: 'What is the total value of deals in the Negotiation stage?', icon: MessageSquare, label: 'Understand your pipeline' },
  { question: 'What are the reasons behind the lost deals?', icon: MessageSquare, label: 'Learn from lost opportunities' },
];
interface Message { id: number; question: string; result?: AiResult; error?: string }

export function AssistantPage() {
  const [question, setQuestion] = useState(new URLSearchParams(window.location.search).get('question') || '');
  const [messages, setMessages] = useState<Message[]>([]);
  const status = useQuery({ queryKey: ['status'], queryFn: async () => (await api.get<{ data: { ai_configured: boolean } }>('/api/status')).data.data });
  const mutation = useMutation({
    mutationFn: async ({ question: text }: { question: string; id: number }) => (await api.post<{ data: AiResult }>('/api/assistant/messages', { question: text })).data.data,
    onSuccess: (result, variables) => setMessages(previous => previous.map(message => message.id === variables.id ? { ...message, result } : message)),
    onError: (error, variables) => setMessages(previous => previous.map(message => message.id === variables.id ? { ...message, error: errorMessage(error) } : message)),
  });
  function send(text: string) { if (!text.trim() || mutation.isPending) return; const id = Date.now(); setMessages(previous => [...previous, { id, question: text.trim() }]); setQuestion(''); mutation.mutate({ id, question: text.trim() }); }
  function submit(event: FormEvent) { event.preventDefault(); send(question); }
  return <><PageHeader eyebrow="A FRESH PERSPECTIVE" title="Your deal assistant" description="Ask a question. Find the signal in your sales data." action={<span className="header-tag"><ShieldCheck size={15}/>Read-only access</span>}/><section className="assistant-panel">{status.data && !status.data.ai_configured && <div className="configuration-notice" role="status"><Sparkles size={18}/><div><strong>AI is not configured yet</strong><p>Your CRM is ready. Add a valid AI API key to enable live answers. No simulated answers are shown.</p></div></div>}<div className="conversation" aria-live="polite">{messages.length === 0 ? <div className="assistant-welcome"><div className="assistant-orb"><Sparkles size={33}/></div><span className="eyebrow">MEET YOUR WORKSPACE COPILOT</span><h2>A good question can<br/>open a new opportunity.</h2><p>I can help you explore your deals, understand your pipeline,<br/>and see where to focus next — using your actual CRM data.</p><div className="suggestion-grid">{suggestions.map(({ question: text, icon: Icon, label }) => <button key={text} onClick={() => send(text)}><Icon size={20}/><strong>{label}</strong><span>{text}</span><ArrowUpRight size={16}/></button>)}</div></div> : messages.map(message => <div className="message-pair" key={message.id}><div className="user-message">{message.question}</div><div className="assistant-message"><span className="message-avatar"><Sparkles size={17}/></span><div>{message.result ? <AiContent result={message.result}/> : message.error ? <div className="inline-error" role="alert">{message.error}<button className="text-link" onClick={() => { setMessages(previous => previous.map(item => item.id === message.id ? { ...item, error: undefined } : item)); mutation.mutate({ id: message.id, question: message.question }); }} disabled={mutation.isPending}>Try again</button></div> : <div className="thinking" role="status"><LoaderCircle size={17} className="spin"/>Checking your CRM records…</div>}</div></div></div>)}</div><div className="composer-area"><form onSubmit={submit} className="chat-composer"><label htmlFor="question" className="sr-only">Ask about your deals</label><textarea id="question" maxLength={2000} value={question} onChange={event => setQuestion(event.target.value)} placeholder="Ask about your deals, customers, or pipeline…" rows={2} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); send(question); } }}/><button aria-label="Send question" disabled={!question.trim() || mutation.isPending}>{mutation.isPending ? <LoaderCircle className="spin" size={19}/> : <ArrowUp size={21}/>}</button></form><p><ShieldCheck size={12}/> Only your accessible records are used. Each question is independent. Recommendations may need review.</p></div></section></>;
}
