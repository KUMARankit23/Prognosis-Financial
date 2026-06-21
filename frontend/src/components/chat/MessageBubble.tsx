import React from 'react';
import { Bot, User, AlertTriangle, Ticket } from 'lucide-react';
import { Message } from '../../types';
import { formatTime } from '../../utils/helpers';

interface Props {
  message: Message;
}

const MessageBubble: React.FC<Props> = ({ message }) => {
  const isUser = message.role === 'user';
  const isEscalated = message.escalated;

  // Render inline bold: **text** → <strong>
  const renderInline = (text: string): React.ReactNode => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  // Format markdown-like content — handles -, *, • bullets and **bold**
  const formatContent = (text: string): React.ReactNode => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let listItems: React.ReactNode[] = [];

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`ul-${elements.length}`} className="ml-2 mt-1.5 mb-1.5 space-y-1">
            {listItems}
          </ul>
        );
        listItems = [];
      }
    };

    lines.forEach((line, idx) => {
      const trimmed = line.trim();

      // Bullet: starts with - , * , or •  (but not ** bold)
      const isBullet = /^[-•]\s/.test(trimmed) || (/^\*\s/.test(trimmed) && !trimmed.startsWith('**'));

      if (isBullet) {
        const content = trimmed.replace(/^[-•*]\s+/, '');
        listItems.push(
          <li key={idx} className="flex gap-2 text-gray-800">
            <span className="text-navy-500 mt-0.5 flex-shrink-0">•</span>
            <span>{renderInline(content)}</span>
          </li>
        );
      } else {
        flushList();
        if (trimmed === '') {
          elements.push(<div key={idx} className="h-1.5" />);
        } else {
          elements.push(
            <p key={idx} className="leading-relaxed text-gray-800">
              {renderInline(trimmed)}
            </p>
          );
        }
      }
    });

    flushList();
    return <div className="space-y-1">{elements}</div>;
  };

  if (isUser) {
    return (
      <div className="flex justify-end mb-3 animate-fade-in">
        <div className="flex items-end gap-2 max-w-[75%]">
          <div>
            <div className="bg-navy-500 text-white px-4 py-2.5 rounded-2xl rounded-br-sm shadow-sm">
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
            <p className="text-gray-400 text-xs text-right mt-1 pr-1">{formatTime(message.timestamp)}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-navy-500 flex items-center justify-center flex-shrink-0 mb-5">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-3 animate-fade-in">
      <div className="flex items-end gap-2 max-w-[80%]">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-navy-500 to-navy-700 flex items-center justify-center flex-shrink-0 mb-5 shadow-md">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div>
          {/* Escalation indicator */}
          {isEscalated && (
            <div className="flex items-center gap-1.5 mb-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
              <span className="text-amber-700 text-xs font-medium">Escalated to Advisor</span>
            </div>
          )}

          <div className={`px-4 py-2.5 rounded-2xl rounded-bl-sm shadow-sm border ${
            isEscalated
              ? 'bg-amber-50 border-amber-200'
              : 'bg-white border-gray-100'
          }`}>
            <div className="text-sm leading-relaxed text-gray-800">
              {formatContent(message.content)}
            </div>
          </div>

          {/* Ticket badge */}
          {message.ticket && (
            <div className="flex items-center gap-1.5 mt-1.5 px-3 py-1.5 bg-navy-50 border border-navy-100 rounded-xl">
              <Ticket className="w-3.5 h-3.5 text-navy-500" />
              <span className="text-navy-600 text-xs">Ticket: {message.ticket.ticketId}</span>
            </div>
          )}

          <p className="text-gray-400 text-xs mt-1 pl-1">{formatTime(message.timestamp)}</p>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
