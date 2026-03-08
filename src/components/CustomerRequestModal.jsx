import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageSquare, Sparkles, CheckCircle2, Loader2, Rocket, Code2, Bug } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const CustomerRequestModal = ({ isOpen, onClose }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [requestType, setRequestType] = useState('Custom Deployment');
    const [details, setDetails] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSending(true);
        setError('');
        try {
            await axios.post(`${API_BASE_URL}/api/customer-request`, {
                name,
                email,
                request_type: requestType,
                details
            });
            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
                onClose();
                setName('');
                setEmail('');
                setDetails('');
            }, 3000);
        } catch (err) {
            setError('Neural uplink failed. Please try again.');
        } finally {
            setIsSending(false);
        }
    };

    const requestTypes = [
        { id: 'Custom Deployment', icon: Rocket, label: 'Custom Build' },
        { id: 'New AI Node', icon: Sparkles, label: 'New Node' },
        { id: 'Bug Report', icon: Bug, label: 'Bug' },
        { id: 'Feature Request', icon: Code2, label: 'Feature' }
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="w-full max-w-xl bg-[#0c0c0e] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl relative"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-600"></div>
                        
                        <div className="p-6 md:p-8">
                            <div className="flex justify-between items-center mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                                        <MessageSquare className="w-5 h-5 text-cyan-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-white tracking-tight">Request Architecture</h2>
                                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Gistly Neural Uplink</p>
                                    </div>
                                </div>
                                <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {isSuccess ? (
                                <div className="py-12 flex flex-col items-center text-center">
                                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20">
                                        <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">Request Filed Successfully</h3>
                                    <p className="text-zinc-400 text-sm">Our architects will review your signal shortly.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Identity</label>
                                            <input 
                                                required
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Your Name"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-600 outline-none focus:border-cyan-500/50 transition-all text-sm"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Uplink Email</label>
                                            <input 
                                                required
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="email@example.com"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-600 outline-none focus:border-cyan-500/50 transition-all text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Signal Type</label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                            {requestTypes.map((type) => (
                                                <button
                                                    key={type.id}
                                                    type="button"
                                                    onClick={() => setRequestType(type.id)}
                                                    className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all group ${
                                                        requestType === type.id 
                                                        ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400' 
                                                        : 'bg-white/5 border-white/10 text-zinc-500 hover:border-white/20'
                                                    }`}
                                                >
                                                    <type.icon className={`w-4 h-4 ${requestType === type.id ? 'text-cyan-400' : 'text-zinc-500 group-hover:text-zinc-400'}`} />
                                                    <span className="text-[9px] font-bold uppercase tracking-wider">{type.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Specifications</label>
                                        <textarea 
                                            required
                                            value={details}
                                            onChange={(e) => setDetails(e.target.value)}
                                            placeholder="What kind of deployment or feature do you need?"
                                            rows={4}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-600 outline-none focus:border-cyan-500/50 transition-all text-sm resize-none"
                                        />
                                    </div>

                                    {error && <p className="text-red-400 text-[10px] font-bold uppercase">{error}</p>}

                                    <button 
                                        disabled={isSending}
                                        type="submit"
                                        className="w-full py-4 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isSending ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" /> Transmitting...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" /> Initialize Deployment Request
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CustomerRequestModal;
