import { useState } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Send, CheckCircle, Clock, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useApp } from '../store';
import { toast } from 'sonner';

const STATUS_META = {
  open:       { label: 'Open',        color: 'text-amber-600 bg-amber-50 border-amber-200' },
  'in-progress': { label: 'In Progress', color: 'text-blue-600 bg-blue-50 border-blue-200' },
  resolved:   { label: 'Resolved',    color: 'text-green-600 bg-green-50 border-green-200' },
};

export function SupportPage() {
  const { currentUser, tickets, raiseTicket } = useApp();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const myTickets = tickets.filter(t => t.userId === currentUser?.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) { toast.error('Please enter a subject.'); return; }
    if (!message.trim()) { toast.error('Please enter your message.'); return; }
    raiseTicket({ subject, message });
    toast.success('Support ticket raised! Our team will get back to you shortly.');
    setSubject(''); setMessage('');
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Customer Support</h1>

      {/* Raise Ticket Form */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-800">Raise a Support Ticket</h2>
            <p className="text-xs text-gray-400">We usually respond within 24 hours.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Subject</label>
            <input
              type="text"
              placeholder="Brief description of your issue"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full h-11 px-4 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Message</label>
            <textarea
              rows={5}
              placeholder="Describe your issue in detail. Include your order ID if relevant."
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
            />
          </div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm font-semibold shadow hover:shadow-lg transition"
          >
            <Send className="w-4 h-4" /> Submit Ticket
          </motion.button>
        </form>
      </motion.div>

      {/* Ticket History */}
      <div>
        <h2 className="text-base font-semibold text-gray-700 mb-4">Your Tickets ({myTickets.length})</h2>
        {myTickets.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-200">
            <MessageSquare className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No tickets yet. Use the form above to get help.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {myTickets.map(ticket => {
              const meta = STATUS_META[ticket.status];
              const isExpanded = expandedId === ticket.id;
              return (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  <div
                    className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 transition"
                    onClick={() => setExpandedId(isExpanded ? null : ticket.id)}
                  >
                    <div className="flex items-center gap-3">
                      {ticket.status === 'resolved' ? <CheckCircle className="w-5 h-5 text-green-500" /> :
                       ticket.status === 'in-progress' ? <Clock className="w-5 h-5 text-blue-500" /> :
                       <AlertCircle className="w-5 h-5 text-amber-500" />}
                      <div>
                        <p className="text-sm font-medium text-gray-800">{ticket.subject}</p>
                        <p className="text-xs text-gray-400">{ticket.id} · {formatDate(ticket.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${meta.color}`}>{meta.label}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-300" /> : <ChevronDown className="w-4 h-4 text-gray-300" />}
                    </div>
                  </div>

                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-5 pb-5 space-y-3 border-t border-gray-50"
                    >
                      <div className="pt-3">
                        <p className="text-xs font-medium text-gray-400 mb-1">Your message</p>
                        <p className="text-sm text-gray-600 bg-gray-50 rounded-xl px-4 py-3">{ticket.message}</p>
                      </div>
                      {ticket.reply && (
                        <div>
                          <p className="text-xs font-medium text-cyan-600 mb-1">💬 Response from NEERIVA Support</p>
                          <p className="text-sm text-gray-700 bg-cyan-50 rounded-xl px-4 py-3 border border-cyan-100">{ticket.reply}</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
