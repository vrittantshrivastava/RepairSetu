import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  X, 
  ShieldCheck, 
  Camera, 
  Clock, 
  Sparkles, 
  Phone, 
  CheckCheck, 
  Image as ImageIcon,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { ActiveRepairJob, ChatMessage } from '../types';

interface RepairChatDrawerProps {
  job: ActiveRepairJob;
  isOpen: boolean;
  onClose: () => void;
  onSendMessage: (text: string, sender: 'customer' | 'repairer') => void;
  currentRole?: 'customer' | 'repairer';
}

export const RepairChatDrawer: React.FC<RepairChatDrawerProps> = ({
  job,
  isOpen,
  onClose,
  onSendMessage,
  currentRole = 'customer',
}) => {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const repairerName = job.selectedQuotation.repairer.name;
  const technicianName = 'Rohit Sharma';
  const customerName = job.request.customerName || 'Aman Saxena';

  const quickPrompts = currentRole === 'customer' 
    ? [
        'When will my device be ready for delivery?',
        'Will my stored photos and data remain safe?',
        'Can you send a photo of the new display part?',
        'Does the 90-day warranty cover touch dead-zones?',
      ]
    : [
        'Display heat seal curing in progress; ready in 45 minutes.',
        '18-point hardware test passed with 100% touch calibration.',
        'Please review the +₹300 frame alignment request in your tracker.',
      ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, job.messages, isTyping]);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    onSendMessage(text, currentRole);
    if (!textToSend) setInputText('');

    // If customer sent a message, simulate a realistic technician response after a brief pause
    if (currentRole === 'customer') {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const lower = text.toLowerCase();
        let reply = "Thank you for checking in, Aman ji! We are on Diagnostic Bench #2 with your Galaxy S24. I am closely monitoring the installation.";

        if (lower.includes('when') || lower.includes('ready') || lower.includes('time') || lower.includes('delivery') || lower.includes('pick')) {
          reply = "We're currently letting the waterproof display adhesive cure under uniform clamp pressure (approx 35 mins). After that, we perform the 18-point hardware test. It will be ready for delivery by 5:30 PM today!";
        } else if (lower.includes('data') || lower.includes('photo') || lower.includes('privacy') || lower.includes('safe') || lower.includes('pin') || lower.includes('passcode')) {
          reply = "Your data is completely untouched and secure. We use hardware test codes (*#0*#) to verify OLED digitizer sensitivity, so we never access your personal storage or require your lock PIN.";
        } else if (lower.includes('warranty') || lower.includes('guarantee') || lower.includes('90') || lower.includes('screen')) {
          reply = "Yes! The 90-day comprehensive screen warranty covers any touch latency, backlight flicker, or dead pixels. Your cryptographic digital certificate will be activated right after final delivery.";
        } else if (lower.includes('cost') || lower.includes('300') || lower.includes('frame') || lower.includes('price')) {
          reply = "The +₹300 adjustment covers precision micro-milling of the corner aluminum rim where it took the drop impact. Without this, the glass would have pressure hotspots. You can approve or decline right in the tracker.";
        } else if (lower.includes('part') || lower.includes('photo') || lower.includes('pic') || lower.includes('look')) {
          reply = "We are using OEM Grade Dynamic AMOLED with the original Samsung color profile calibration. I will upload a component inspection snapshot to this chat as well.";
        }

        onSendMessage(reply, 'repairer');
      }, 1400);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const messages = job.messages || [];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end sm:p-4 bg-slate-950/40 backdrop-blur-xs pointer-events-auto">
      <div 
        className={`w-full bg-white rounded-t-2xl sm:rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden transition-all duration-200 ${
          isExpanded 
            ? 'sm:w-[680px] h-[92vh] sm:h-[88vh]' 
            : 'sm:w-[460px] h-[85vh] sm:h-[680px]'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-teal-500 text-slate-950 font-bold flex items-center justify-center text-sm shadow-xs">
                {currentRole === 'customer' ? 'RS' : 'AS'}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900"></span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-white">
                  {currentRole === 'customer' ? technicianName : customerName}
                </span>
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-teal-300 bg-teal-950/80 border border-teal-800 px-1.5 py-0.2 rounded">
                  <ShieldCheck className="w-3 h-3 text-teal-400" />
                  Verified Partner
                </span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <span>{currentRole === 'customer' ? `${repairerName} (MP Nagar)` : 'Device Owner'}</span>
                <span>·</span>
                <span className="text-emerald-400 font-medium">Active on Bench #2</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <a
              href="tel:+919826012345"
              onClick={(e) => {
                e.preventDefault();
                alert('Direct telephone link to TechCare workshop: +91 98260 12345.');
              }}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              title="Call technician directly"
            >
              <Phone className="w-4 h-4" />
            </a>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="hidden sm:block p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              title={isExpanded ? 'Collapse size' : 'Expand window'}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              title="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Job Context Strip */}
        <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 text-xs flex items-center justify-between text-slate-600 font-mono">
          <div className="flex items-center gap-1.5 truncate">
            <span className="font-bold text-slate-900">{job.repairId}</span>
            <span className="text-slate-300">·</span>
            <span className="truncate">{job.request.brand} {job.request.model}</span>
          </div>
          <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded shrink-0">
            {job.status.replace(/_/g, ' ')}
          </span>
        </div>

        {/* Message Thread Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8FAFC]">
          {/* Security & Zero-Spam Banner */}
          <div className="mx-auto max-w-sm rounded-xl bg-indigo-50/70 border border-indigo-100 p-2.5 text-center text-[11px] text-indigo-900">
            <span className="font-bold block">Direct Verified Workshop Line</span>
            Messages are linked to Job #{job.repairId} with official warranty protection.
          </div>

          {messages.map((msg) => {
            if (msg.sender === 'system') {
              return (
                <div key={msg.id} className="text-center my-2">
                  <span className="inline-block px-3 py-1 bg-slate-100 rounded-full text-[10px] text-slate-500 font-mono border border-slate-200">
                    {msg.text} · {msg.timestamp}
                  </span>
                </div>
              );
            }

            const isMe = 
              (currentRole === 'customer' && msg.sender === 'customer') ||
              (currentRole === 'repairer' && msg.sender === 'repairer');

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
              >
                {/* Sender Tag */}
                <div className="text-[10px] text-slate-400 px-1 font-mono flex items-center gap-1">
                  <span>{msg.senderName}</span>
                  {msg.senderRole && <span>({msg.senderRole})</span>}
                  <span>·</span>
                  <span>{msg.timestamp}</span>
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-xs ${
                    isMe
                      ? 'bg-indigo-600 text-white rounded-br-xs'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Attachment image if present */}
                  {msg.attachmentUrl && (
                    <div className="mt-2 rounded-xl overflow-hidden border border-slate-200/40 max-w-xs">
                      <img
                        src={msg.attachmentUrl}
                        alt="Bench inspection attachment"
                        className="w-full h-32 object-cover"
                        referrerPolicy="no-referrer"
                      />
                      {msg.isDiagnosticPhoto && (
                        <div className="bg-slate-900/80 text-[10px] text-slate-200 px-2 py-1 flex items-center justify-between">
                          <span>Bench Inspection Snapshot</span>
                          <span className="font-mono text-emerald-400">Verified</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-500 pl-2">
              <div className="w-6 h-6 rounded-lg bg-teal-100 text-slate-800 font-bold text-[10px] flex items-center justify-center">
                TC
              </div>
              <div className="bg-white border border-slate-200 rounded-full px-3 py-1 flex items-center gap-1 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-[10px] text-slate-400 font-mono ml-1">Rohit is typing...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Question Prompts */}
        <div className="p-2.5 bg-white border-t border-slate-200 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 border border-slate-200 transition font-medium cursor-pointer shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Bottom Input Area */}
        <div className="p-3 bg-white border-t border-slate-200">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                alert('Demo: Photos can be captured and uploaded directly to the workshop inspection log.');
              }}
              className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition"
              title="Attach photo"
            >
              <Camera className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                currentRole === 'customer'
                  ? 'Ask Rohit about your repair, parts, or pickup time...'
                  : 'Reply to customer inquiry...'
              }
              className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
            />

            <button
              type="button"
              onClick={() => handleSend()}
              disabled={!inputText.trim()}
              className={`p-2 rounded-xl transition ${
                inputText.trim()
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer shadow-xs'
                  : 'bg-slate-100 text-slate-300 cursor-not-allowed'
              }`}
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="text-[10px] text-slate-400 mt-1.5 flex items-center justify-between px-1">
            <span>Direct channel to TechCare Electronics MP Nagar</span>
            <span className="font-mono">Avg reply: ~3 mins</span>
          </div>
        </div>
      </div>
    </div>
  );
};
