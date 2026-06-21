import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, RefreshCw } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Message, InvestmentGoal } from '../types';
import { chatAPI } from '../services/api';
import { getOrCreateSessionId } from '../utils/helpers';
import MessageBubble from '../components/chat/MessageBubble';
import TypingIndicator from '../components/chat/TypingIndicator';
import ChatInput from '../components/chat/ChatInput';
import QuickReplies from '../components/chat/QuickReplies';
import LeadCaptureForm from '../components/chat/LeadCaptureForm';

const QUICK_REPLIES = [
  'What is SIP?',
  'Types of mutual funds',
  'Documents for Demat',
  'Difference: Term vs Health Insurance',
  'What is compounding?',
  'How to start investing?',
];

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content: `Hello! 👋 Welcome to **Prognosis Financial AI Assistant**.

I can help you with:
- SIP (Systematic Investment Plans)
- Mutual Fund education
- Demat Account guidance
- Health & Term Insurance
- Goal-Based Investing concepts

What would you like to know today?`,
  timestamp: new Date(),
};

const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [sessionId] = useState(() => getOrCreateSessionId());
  const [messageCount, setMessageCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  // Show lead form after 2nd user message
  useEffect(() => {
    if (messageCount === 2 && !leadCaptured) {
      setShowLeadForm(true);
    }
  }, [messageCount, leadCaptured]);

  // Handle initial query from landing page
  useEffect(() => {
    const initialQuery = sessionStorage.getItem('pf_initial_query');
    if (initialQuery) {
      sessionStorage.removeItem('pf_initial_query');
      setTimeout(() => sendMessage(initialQuery), 800);
    }
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setMessageCount((c) => c + 1);

    try {
      const res = await chatAPI.sendMessage(content, sessionId);
      const { response, intent, escalated, ticket } = res.data.data;

      const botMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: response,
        intent,
        escalated,
        timestamp: new Date(),
        ticket,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, isLoading]);

  const handleLeadComplete = (data: { name: string; phone: string; email: string; investmentGoal: InvestmentGoal }) => {
    setShowLeadForm(false);
    setLeadCaptured(true);

    const confirmMsg: Message = {
      id: uuidv4(),
      role: 'assistant',
      content: `Thank you, ${data.name}! 🙏\n\nYour details have been saved. Our team may reach out to you based on your interest in ${data.investmentGoal.replace(/_/g, ' ')}.\n\nFeel free to continue asking questions!`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, confirmMsg]);
  };

  const handleReset = () => {
    setMessages([WELCOME_MESSAGE]);
    setMessageCount(0);
    setShowLeadForm(false);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 max-w-2xl mx-auto">
      {/* Chat Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-navy-800 shadow-md">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-navy-200 hover:text-white transition-colors duration-150"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">AI Assistant</p>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-300 text-xs">Online</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="text-navy-300 hover:text-white transition-colors duration-150"
          aria-label="Reset conversation"
          title="New conversation"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </header>

      {/* Messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-3 py-4"
        role="log"
        aria-live="polite"
        aria-label="Conversation messages"
      >
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {isLoading && <TypingIndicator />}

        {/* Lead capture form inline */}
        {showLeadForm && !leadCaptured && (
          <div className="my-3">
            <LeadCaptureForm
              sessionId={sessionId}
              onComplete={handleLeadComplete}
              onSkip={() => { setShowLeadForm(false); setLeadCaptured(true); }}
            />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick replies */}
      {messages.length <= 2 && !isLoading && (
        <QuickReplies
          suggestions={QUICK_REPLIES}
          onSelect={sendMessage}
          disabled={isLoading}
        />
      )}

      {/* Input */}
      <ChatInput
        onSend={sendMessage}
        disabled={isLoading || showLeadForm}
        placeholder={showLeadForm ? 'Please fill in your details first...' : 'Ask about SIPs, Mutual Funds, Insurance...'}
      />

      {/* Disclaimer */}
      <div className="bg-amber-50 border-t border-amber-100 px-4 py-2 text-center">
        <p className="text-amber-700 text-xs">
          ⚠️ AI responses are educational only. Not personalized financial advice.
        </p>
      </div>
    </div>
  );
};

export default ChatPage;
