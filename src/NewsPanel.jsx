import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Share2, Sparkles, Loader2, RefreshCw, Radio, Image as ImageIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function NewsPanel({ isOpen, onClose }) {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeArticle, setActiveArticle] = useState(null);
    const [summaryResult, setSummaryResult] = useState('');
    const [summaryLoading, setSummaryLoading] = useState(false);

    // Fetch News 
    const fetchNews = async () => {
        setLoading(true);
        setError('');
        try {
            const resp = await axios.get(`${API_BASE_URL}/api/news`);
            setNews(resp.data.articles || []);
        } catch (err) {
            console.error(err);
            setError('Failed to gather the latest intelligence streams.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && news.length === 0) {
            fetchNews();
        }
    }, [isOpen]);

    const handleSummarize = async (article) => {
        setActiveArticle(article);
        setSummaryLoading(true);
        setSummaryResult('');
        try {
            const resp = await axios.post(`${API_BASE_URL}/api/news/summarize`, {
                content: article.link,
                context: article.title
            });
            setSummaryResult(resp.data.result);
        } catch (err) {
            setSummaryResult("Failed to decrypt and summarize this article. The source might be blocking our AI.");
        } finally {
            setSummaryLoading(false);
        }
    };

    const handleShare = (platform) => {
        if (!summaryResult) return;
        const encodedText = encodeURIComponent(summaryResult + "\n\nShared from https://gistly.site");
        const encodedUrl = encodeURIComponent(activeArticle?.link || "https://gistly.site");

        let shareUrl = "";
        switch (platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
                break;
            case 'whatsapp':
                shareUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
                break;
            default:
                break;
        }
        if (shareUrl) window.open(shareUrl, '_blank');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ x: '100%', opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: '100%', opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed right-0 top-0 bottom-0 w-full md:w-[450px] bg-[#09090b]/95 backdrop-blur-3xl border-l border-white/10 z-[150] shadow-[-20px_0_50px_rgba(0,0,0,0.5)] flex flex-col"
                >
                    <div className="flex items-center justify-between p-5 border-b border-white/10 bg-black/20">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                                <Radio className="w-5 h-5 text-red-400 animate-pulse" />
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-white tracking-widest uppercase">Global Feed</h2>
                                <p className="text-[10px] text-zinc-500 font-mono">LIVE INTELLIGENCE STREAM</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={fetchNews} className="p-2 text-zinc-400 hover:text-white transition-colors">
                                <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
                            </button>
                            <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white transition-colors bg-white/5 rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent p-4 relative">
                        {loading && news.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-zinc-500 gap-4">
                                <Loader2 className="w-8 h-8 animate-spin text-red-400" />
                                <span className="text-xs uppercase tracking-[0.2em] font-mono">Intercepting Signals...</span>
                            </div>
                        ) : error ? (
                            <div className="text-center text-red-400 text-xs p-5 bg-red-500/10 rounded-xl border border-red-500/20">
                                {error}
                            </div>
                        ) : (
                            <div className="space-y-4 pb-24">
                                {news.map((item, idx) => (
                                    <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 hover:border-red-500/30 transition-all group">
                                        <div className="text-[10px] text-red-400 font-bold tracking-widest uppercase mb-2 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                                            {item.source}
                                        </div>
                                        <h3 className="text-sm font-semibold text-white leading-relaxed mb-3 group-hover:text-red-300 transition-colors">
                                            {item.title}
                                        </h3>
                                        <div className="flex items-center justify-between mt-4 text-xs">
                                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white flex items-center gap-1 transition-colors">
                                                <ExternalLink className="w-3.5 h-3.5" /> Source
                                            </a>
                                            <button
                                                onClick={() => handleSummarize(item)}
                                                className="bg-indigo-500/10 hover:bg-indigo-500 hover:text-white text-indigo-400 border border-indigo-500/20 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all shadow-[0_0_10px_rgba(99,102,241,0.1)] hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] flex items-center gap-1.5"
                                            >
                                                <Sparkles className="w-3.5 h-3.5" /> Gistify
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            )}

            {/* AI Summary & Share Modal (Overlays everything) */}
            <AnimatePresence>
                {activeArticle && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="w-full max-w-lg bg-[#0c0c0e] border border-indigo-500/20 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(99,102,241,0.1)] relative"
                        >
                            <div className="p-4 bg-indigo-500/10 border-b border-indigo-500/20 flex items-center justify-between">
                                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" /> AI News Generator
                                </h3>
                                <button onClick={() => setActiveArticle(null)} className="text-zinc-400 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6">
                                <p className="text-xs text-zinc-500 mb-4 border-l-2 border-indigo-500/30 pl-3">
                                    {activeArticle.title}
                                </p>

                                <div className="bg-black/40 border border-white/5 rounded-xl p-4 min-h-[150px] relative">
                                    {summaryLoading ? (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-indigo-400">
                                            <Loader2 className="w-6 h-6 animate-spin mb-2" />
                                            <span className="text-[10px] uppercase font-mono tracking-widest">Generating Post...</span>
                                        </div>
                                    ) : (
                                        <div className="text-sm text-zinc-200 whitespace-pre-wrap leading-relaxed font-sans">
                                            {summaryResult || "Click generate to create social post..."}
                                        </div>
                                    )}
                                </div>

                                {!summaryLoading && summaryResult && (
                                    <div className="mt-6">
                                        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Broadcast to Network</h4>
                                        <div className="grid grid-cols-3 gap-3">
                                            <button onClick={() => handleShare('twitter')} className="bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] border border-[#1DA1F2]/20 py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-colors">
                                                Twitter
                                            </button>
                                            <button onClick={() => handleShare('facebook')} className="bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] border border-[#1877F2]/20 py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-colors">
                                                Facebook
                                            </button>
                                            <button onClick={() => handleShare('whatsapp')} className="bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/20 py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-colors">
                                                WhatsApp
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </AnimatePresence>
    );
}
