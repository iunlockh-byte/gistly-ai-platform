import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Cpu, Zap, Shield, Key, 
    Copy, Check, ExternalLink, 
    AlertCircle, Terminal, 
    ChevronRight, CreditCard,
    X, Loader2
} from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:8000';

const APIForgeModal = ({ isOpen, onClose, userEmail }) => {
    const [activeTab, setActiveTab] = useState('plans');
    const [keys, setKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const [generatedKey, setGeneratedKey] = useState(null);
    const [copied, setCopied] = useState(false);
    const [plans, setPlans] = useState([]);
    
    // Secure Axios Config
    const nexusAxios = axios.create({
        baseURL: API_BASE_URL,
        headers: {
            'X-Nexus-Shield': 'G7-NX-SECURITY-V1-ALPHA'
        }
    });

    useEffect(() => {
        if (isOpen) {
            fetchPlans();
            if (userEmail) fetchMyKeys();
        }
    }, [isOpen, userEmail]);

    const fetchPlans = async () => {
        try {
            const resp = await nexusAxios.get('/api/marketplace/plans');
            setPlans(resp.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchMyKeys = async () => {
        try {
            const resp = await nexusAxios.get(`/api/keys/me/${userEmail}`);
            setKeys(resp.data);
        } catch (err) {
            console.error(err);
        }
    };

    const generateKey = async (planId) => {
        if (!userEmail) {
            alert("Authorization Required. Please login to forge spectral keys.");
            return;
        }
        setLoading(true);
        try {
            const resp = await nexusAxios.post('/api/keys/generate', {
                user_email: userEmail,
                plan: planId
            });
            setGeneratedKey(resp.data.api_key);
            fetchMyKeys();
            setActiveTab('my-keys');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            
            <motion.div 
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                className="relative w-full max-w-4xl bg-[#0a0a0c] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row h-[85vh] md:h-[600px]"
            >
                {/* Sidebar */}
                <div className="w-full md:w-64 border-r border-white/10 p-6 flex flex-col gap-6 bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
                            <Cpu className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-sm font-black text-white uppercase tracking-tighter italic">API Forge</h2>
                            <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest leading-none">Marketplace Integration</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {[
                            { id: 'plans', label: 'Neural Protocols', icon: Zap },
                            { id: 'my-keys', label: 'Spectral Keys', icon: Key },
                            { id: 'docs', label: 'Dev. Uplink', icon: Terminal },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                    activeTab === tab.id 
                                    ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-sm' 
                                    : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-300'
                                }`}
                            >
                                <tab.icon className="w-3.5 h-3.5" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="mt-auto p-4 bg-white/5 rounded-2xl border border-dashed border-white/10">
                        <p className="text-[9px] text-zinc-500 font-bold uppercase mb-2">System Health</p>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                            <span className="text-[10px] text-white font-mono uppercase">Operational</span>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto p-8 font-sans">
                    <button onClick={onClose} className="absolute top-6 right-6 p-2 text-zinc-500 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>

                    <AnimatePresence mode="wait">
                        {activeTab === 'plans' && (
                            <motion.div 
                                key="plans"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2 italic underline decoration-indigo-500/50 decoration-4 underline-offset-8">Forge Your Intelligence</h3>
                                    <p className="text-sm text-zinc-500 leading-relaxed font-medium">Select a neural protocol to extend our models into your own infrastructure.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {plans.map((plan) => (
                                        <div key={plan.id} className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 flex flex-col group hover:border-indigo-500/30 transition-all hover:bg-indigo-500/[0.02]">
                                            <div className="mb-6">
                                                <h4 className="text-sm font-black text-white uppercase tracking-widest mb-1 group-hover:text-indigo-400 transition-colors">{plan.name}</h4>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-2xl font-black text-white">${plan.price}</span>
                                                    <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mt-2">{plan.price === 0 ? '/ LIFE' : '/ MONTH'}</span>
                                                </div>
                                            </div>

                                            <div className="space-y-3 mb-8 flex-1">
                                                {plan.features.map((feat, i) => (
                                                    <div key={i} className="flex items-start gap-2">
                                                        <Check className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />
                                                        <span className="text-[10px] text-zinc-400 font-bold leading-tight">{feat}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <button 
                                                onClick={() => generateKey(plan.id)}
                                                disabled={loading}
                                                className="w-full py-3 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-indigo-500 hover:text-white transition-all disabled:opacity-50"
                                            >
                                                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto" /> : 'Activate Protocol'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'my-keys' && (
                            <motion.div 
                                key="keys"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2 italic">Active Spectral Keys</h3>
                                    <p className="text-xs text-zinc-500 font-medium">Your decrypted access keys for the Gistly Neural Network.</p>
                                </div>

                                <div className="space-y-4">
                                    {keys.length > 0 ? keys.map((key) => (
                                        <div key={key.id} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 flex justify-between items-center group">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-2 h-2 rounded-full ${key.is_active ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{key.plan} Protocol</span>
                                                </div>
                                                <div className="bg-black/40 border border-white/5 rounded-lg px-4 py-2 flex items-center gap-3">
                                                    <code className="text-[11px] text-white font-mono">{key.api_key}</code>
                                                    <button onClick={() => copyToClipboard(key.api_key)} className="p-1 hover:text-indigo-400 text-zinc-600 transition-colors">
                                                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-black text-indigo-400 font-mono tracking-tighter">{key.balance.toLocaleString()} CREDITS</p>
                                                <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">Neural Balance</p>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="py-20 text-center border border-dashed border-white/5 rounded-3xl">
                                            <Key className="w-10 h-10 text-zinc-800 mx-auto mb-4" />
                                            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">No Spectral Keys Detected</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'docs' && (
                            <motion.div 
                                key="docs"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="space-y-6">
                                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                                        <h4 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <AlertCircle className="w-3.5 h-3.5 text-indigo-400" /> Quick Integration Guide
                                        </h4>
                                        <div className="space-y-4">
                                            <p className="text-[11px] text-zinc-400 font-medium leading-relaxed">To uplink with our models, include your key in the header of your POST requests.</p>
                                            <div className="bg-black/60 rounded-xl p-4 font-mono text-[10px] text-zinc-300 border border-white/5 overflow-x-auto">
                                                <p className="text-emerald-500 mb-1"># Uplink Command</p>
                                                <p>curl -X POST "{API_BASE_URL}/api/ai/analyze" \</p>
                                                <p>  -H "X-API-KEY: YOUR_SPECTRAL_KEY" \</p>
                                                <p>  -H "Content-Type: application/json" \</p>
                                                <p>  -d '{"{"}"content": "Neural Data Package"{"}"}'</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-indigo-500/20 transition-all cursor-pointer group">
                                            <div className="flex justify-between items-center mb-2">
                                                <h5 className="text-[10px] font-black text-white uppercase tracking-widest">Python SDK</h5>
                                                <ExternalLink className="w-3 h-3 text-zinc-600 group-hover:text-white" />
                                            </div>
                                            <p className="text-[9px] text-zinc-500 font-medium">Official uplink library for Python 3.8+</p>
                                        </div>
                                        <div className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-indigo-500/20 transition-all cursor-pointer group">
                                            <div className="flex justify-between items-center mb-2">
                                                <h5 className="text-[10px] font-black text-white uppercase tracking-widest">Neural.js</h5>
                                                <ExternalLink className="w-3 h-3 text-zinc-600 group-hover:text-white" />
                                            </div>
                                            <p className="text-[9px] text-zinc-500 font-medium">Node.js and Web SDK for real-time analysis</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default APIForgeModal;
