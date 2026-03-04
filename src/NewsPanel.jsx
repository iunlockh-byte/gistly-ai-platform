import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Share2, Sparkles, Loader2, RefreshCw, Radio, Image as ImageIcon, Trophy, Activity, Globe2, Target, Zap } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function NewsPanel({ isOpen, onClose }) {
    const [activeTab, setActiveTab] = useState('global'); // 'global', 'sports', 'scores', 'markets'
    const [news, setNews] = useState([]);
    const [sportsNews, setSportsNews] = useState([]);
    const [scores, setScores] = useState([]);
    const [markets, setMarkets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // AI Summarizer & Predictor States
    const [activeArticle, setActiveArticle] = useState(null);
    const [summaryResult, setSummaryResult] = useState('');
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [activeMatch, setActiveMatch] = useState(null);
    const [activeMarket, setActiveMarket] = useState(null);
    const [predictionResult, setPredictionResult] = useState('');
    const [predictionLoading, setPredictionLoading] = useState(false);

    const fetchData = async (force = false) => {
        setLoading(true);
        setError('');
        try {
            if (activeTab === 'global' && (news.length === 0 || force)) {
                const resp = await axios.get(`${API_BASE_URL}/api/news`);
                setNews(resp.data.articles || []);
            } else if (activeTab === 'sports' && (sportsNews.length === 0 || force)) {
                const resp = await axios.get(`${API_BASE_URL}/api/news/sports`);
                setSportsNews(resp.data.articles || []);
            } else if (activeTab === 'scores' && (scores.length === 0 || force)) {
                const resp = await axios.get(`${API_BASE_URL}/api/scores/live`);
                setScores(resp.data.matches || []);
            } else if (activeTab === 'markets' && (markets.length === 0 || force)) {
                const resp = await axios.get(`${API_BASE_URL}/api/markets/trending`);
                setMarkets(resp.data.markets || []);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to gather the latest streams. Backend API might be updating or unreachable.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchData();
        }
    }, [isOpen, activeTab]);

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

    const handlePredictMatch = async (match) => {
        setActiveMatch(match);
        setPredictionLoading(true);
        setPredictionResult('');
        try {
            const resp = await axios.post(`${API_BASE_URL}/api/scores/predict`, {
                content: `Match: ${match.team1} vs ${match.team2}. Tournament: ${match.tournament}. Score: ${match.team1} (${match.score1}) - ${match.team2} (${match.score2}). Live Context: ${match.context}. Target Status: ${match.status}.`
            });
            setPredictionResult(resp.data.result);
        } catch (err) {
            setPredictionResult("Failed to calculate AI prediction. Probability engine is currently offline.");
        } finally {
            setPredictionLoading(false);
        }
    };

    const handleAnalyzeMarket = async (market) => {
        setActiveMarket(market);
        setPredictionLoading(true);
        setPredictionResult('');
        try {
            const resp = await axios.post(`${API_BASE_URL}/api/markets/analyze`, {
                content: market.symbol
            });
            setPredictionResult(resp.data.result);
        } catch (err) {
            setPredictionResult("Failed to gather AI Financial Analysis. Try again later.");
        } finally {
            setPredictionLoading(false);
        }
    };

    const handleShare = (platform, textToShare, urlToShare) => {
        if (!textToShare) return;
        const encodedText = encodeURIComponent(textToShare + "\n\nShared via https://gistly.site");
        const encodedUrl = encodeURIComponent(urlToShare || "https://gistly.site");

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

    const renderNewsList = (dataList) => {
        if (loading && dataList.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-zinc-500 gap-4 mt-20">
                    <Loader2 className="w-8 h-8 animate-spin text-red-400" />
                    <span className="text-xs uppercase tracking-[0.2em] font-mono">Intercepting Signals...</span>
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center text-red-400 text-xs p-5 bg-red-500/10 rounded-xl border border-red-500/20 mt-10">
                    {error}
                </div>
            );
        }

        return (
            <div className="space-y-4 pb-24">
                {dataList.map((item, idx) => (
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
        );
    };

    const renderScoresList = () => {
        if (loading && scores.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-zinc-500 gap-4 mt-20">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
                    <span className="text-xs uppercase tracking-[0.2em] font-mono">Syncing Scoreboards...</span>
                </div>
            );
        }

        return (
            <div className="space-y-4 pb-24">
                {scores.map((match, idx) => (
                    <div key={idx} className="bg-gradient-to-b from-zinc-900 to-black border border-white/10 rounded-2xl p-5 hover:border-emerald-500/50 transition-all group relative overflow-hidden">
                        {/* Glow effect internally */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2">
                                <Trophy className="w-4 h-4 text-emerald-400" />
                                <span className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase">{match.tournament}</span>
                            </div>
                            {match.live && (
                                <div className="px-2 py-0.5 bg-red-500/20 border border-red-500/50 rounded flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                                    <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest">Live</span>
                                </div>
                            )}
                        </div>

                        {/* Teams & Scores */}
                        <div className="space-y-3 mt-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-bold text-white tracking-wide">{match.team1}</span>
                                <span className="text-sm font-mono text-emerald-300 font-bold bg-emerald-500/10 px-2 rounded">{match.score1}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-bold text-zinc-300 tracking-wide">{match.team2}</span>
                                <span className="text-sm font-mono text-emerald-300/70 font-bold">{match.score2}</span>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-3">
                            <div className="text-xs text-zinc-400 font-medium leading-relaxed border-l-2 border-emerald-500/30 pl-2">
                                {match.status}
                            </div>

                            <button
                                onClick={() => handlePredictMatch(match)}
                                className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2"
                            >
                                <Zap className="w-4 h-4" /> AI Win Probability Predictor
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderMarketsList = () => {
        if (loading && markets.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-zinc-500 gap-4 mt-20">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
                    <span className="text-xs uppercase tracking-[0.2em] font-mono">Loading Tickers...</span>
                </div>
            );
        }

        return (
            <div className="space-y-4 pb-24">
                <div className="mb-4 text-xs font-mono text-zinc-500 bg-black/40 p-3 rounded-xl border border-white/5">
                    🚀 <span className="text-white font-bold">LIVE INTELLIGENCE:</span> Top performing Global Stocks and Crypto Assets.
                </div>
                {markets.map((market, idx) => (
                    <div key={idx} className="bg-gradient-to-br from-zinc-900 via-black to-[#0c0c14] border border-white/10 rounded-2xl p-4 hover:border-purple-500/30 transition-all group overflow-hidden relative">
                        <div className="absolute -right-10 -top-10 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all"></div>

                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-sm font-black text-white flex items-center gap-2">
                                    {market.symbol}
                                    {market.isCrypto && <span className="bg-orange-500/20 text-orange-400 text-[9px] px-1.5 py-0.5 rounded border border-orange-500/20">CRYPTO</span>}
                                </h3>
                                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{market.name}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-zinc-200">${market.price}</p>
                                <p className={cn("text-xs font-bold font-mono tracking-wider", market.change >= 0 ? "text-emerald-400" : "text-red-400")}>
                                    {market.change >= 0 ? "+" : ""}{market.change}%
                                </p>
                            </div>
                        </div>

                        <div className="pt-3 border-t border-white/5">
                            <button
                                onClick={() => handleAnalyzeMarket(market)}
                                className="w-full bg-purple-500/10 hover:bg-purple-500 hover:text-white text-purple-400 border border-purple-500/20 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-[0_0_10px_rgba(168,85,247,0.1)] hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center justify-center gap-1.5"
                            >
                                <Sparkles className="w-3.5 h-3.5" /> AI Market Intel
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ x: '100%', opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: '100%', opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed right-0 top-0 bottom-0 w-full md:w-[480px] bg-[#09090b]/95 backdrop-blur-3xl border-l border-white/10 z-[150] shadow-[-30px_0_60px_rgba(0,0,0,0.6)] flex flex-col"
                >
                    <div className="p-5 border-b border-white/10 bg-black/40">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                                    <Activity className="w-5 h-5 text-red-400 animate-pulse" />
                                </div>
                                <div>
                                    <h2 className="text-base font-black text-white tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-indigo-400">Stream Hub</h2>
                                    <p className="text-[10px] text-zinc-500 font-mono tracking-widest">LIVE DATA CENTER</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => fetchData(true)} className="p-2 text-zinc-400 hover:text-white transition-colors">
                                    <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
                                </button>
                                <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white transition-colors bg-white/5 rounded-full hover:bg-white/10">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Custom Tabs */}
                        <div className="flex bg-black/50 p-1 rounded-xl border border-white/5 relative z-10">
                            <button
                                onClick={() => setActiveTab('global')}
                                className={cn("flex-1 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg flex flex-col items-center justify-center gap-1 transition-all", activeTab === 'global' ? "bg-white/10 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300")}
                            >
                                <Globe2 className="w-3.5 h-3.5" /> News
                            </button>
                            <button
                                onClick={() => setActiveTab('sports')}
                                className={cn("flex-1 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg flex flex-col items-center justify-center gap-1 transition-all", activeTab === 'sports' ? "bg-red-500/20 text-red-400 border border-red-500/20 shadow-sm" : "text-zinc-500 hover:text-zinc-300")}
                            >
                                <Target className="w-3.5 h-3.5" /> Sports
                            </button>
                            <button
                                onClick={() => setActiveTab('scores')}
                                className={cn("flex-1 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg flex flex-col items-center justify-center gap-1 transition-all", activeTab === 'scores' ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 shadow-sm" : "text-zinc-500 hover:text-zinc-300")}
                            >
                                <Trophy className="w-3.5 h-3.5" /> Scores
                            </button>
                            <button
                                onClick={() => setActiveTab('markets')}
                                className={cn("flex-1 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg flex flex-col items-center justify-center gap-1 transition-all", activeTab === 'markets' ? "bg-purple-500/20 text-purple-400 border border-purple-500/20 shadow-sm" : "text-zinc-500 hover:text-zinc-300")}
                            >
                                <Activity className="w-3.5 h-3.5" /> Markets
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent p-4 relative bg-gradient-to-b from-transparent to-black/50">
                        {activeTab === 'global' && renderNewsList(news)}
                        {activeTab === 'sports' && renderNewsList(sportsNews)}
                        {activeTab === 'scores' && renderScoresList()}
                        {activeTab === 'markets' && renderMarketsList()}
                    </div>
                </motion.div>
            )}

            {/* AI Summary Modal (News) */}
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
                                            <button onClick={() => handleShare('twitter', summaryResult, activeArticle?.link)} className="bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] border border-[#1DA1F2]/20 py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-colors">
                                                Twitter
                                            </button>
                                            <button onClick={() => handleShare('facebook', summaryResult, activeArticle?.link)} className="bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] border border-[#1877F2]/20 py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-colors">
                                                Facebook
                                            </button>
                                            <button onClick={() => handleShare('whatsapp', summaryResult, activeArticle?.link)} className="bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/20 py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-colors">
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

            {/* AI Prediction Modal (Scores) */}
            <AnimatePresence>
                {activeMatch && (
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
                            className="w-full max-w-lg bg-[#0c0c0e] border border-emerald-500/20 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.1)] relative"
                        >
                            <div className="p-4 bg-emerald-500/10 border-b border-emerald-500/20 flex items-center justify-between">
                                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                                    <Zap className="w-4 h-4" /> AI Match Predictor (Beta)
                                </h3>
                                <button onClick={() => setActiveMatch(null)} className="text-zinc-400 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="text-center w-[40%]">
                                        <p className="text-lg font-black text-white">{activeMatch.team1}</p>
                                        <p className="text-xs font-mono text-emerald-400 mt-1">{activeMatch.score1}</p>
                                    </div>
                                    <div className="text-xs font-bold text-zinc-600 uppercase">VS</div>
                                    <div className="text-center w-[40%]">
                                        <p className="text-lg font-black text-white">{activeMatch.team2}</p>
                                        <p className="text-xs font-mono text-emerald-400 mt-1">{activeMatch.score2}</p>
                                    </div>
                                </div>

                                <div className="bg-black/40 border border-white/5 rounded-xl p-5 min-h-[150px] relative">
                                    {predictionLoading ? (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-emerald-400">
                                            <Loader2 className="w-6 h-6 animate-spin mb-3" />
                                            <span className="text-[10px] uppercase font-mono tracking-widest">Running Probability Engine...</span>
                                            <span className="text-[9px] text-zinc-500 mt-2">Analyzing player stats, pitch context & momentum</span>
                                        </div>
                                    ) : (
                                        <div className="text-sm text-zinc-200 whitespace-pre-wrap leading-relaxed font-sans">
                                            {predictionResult || "Prediction failed to load."}
                                        </div>
                                    )}
                                </div>

                                {!predictionLoading && predictionResult && (
                                    <div className="mt-6">
                                        <button onClick={() => handleShare('whatsapp', `[Live AI Prediction] ${activeMatch.team1} vs ${activeMatch.team2}\n\n${predictionResult}`, null)} className="w-full bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/20 py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-colors">
                                            Share Prediction via WhatsApp
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* AI Market Analysis Modal */}
            <AnimatePresence>
                {activeMarket && (
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
                            className="w-full max-w-lg bg-[#0c0c0e] border border-purple-500/20 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.1)] relative"
                        >
                            <div className="p-4 bg-purple-500/10 border-b border-purple-500/20 flex items-center justify-between">
                                <h3 className="text-xs font-bold text-purple-400 uppercase tracking-widest flex items-center gap-2">
                                    <Activity className="w-4 h-4" /> AI Investment Analyst
                                </h3>
                                <button onClick={() => setActiveMarket(null)} className="text-zinc-400 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                                    <div>
                                        <p className="text-xl font-black text-white">{activeMarket.symbol}</p>
                                        <p className="text-xs font-mono text-zinc-500 mt-1">{activeMarket.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-black text-white">${activeMarket.price}</p>
                                        <p className={cn("text-xs font-bold font-mono tracking-wider", activeMarket.change >= 0 ? "text-emerald-400" : "text-red-400")}>
                                            {activeMarket.change >= 0 ? "+" : ""}{activeMarket.change}%
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-black/40 border border-white/5 rounded-xl p-5 min-h-[150px] relative">
                                    {predictionLoading ? (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-purple-400">
                                            <Loader2 className="w-6 h-6 animate-spin mb-3" />
                                            <span className="text-[10px] uppercase font-mono tracking-widest">Compiling Market Data...</span>
                                            <span className="text-[9px] text-zinc-500 mt-2">Checking sentiment, chart trends & volume</span>
                                        </div>
                                    ) : (
                                        <div className="text-sm text-zinc-200 whitespace-pre-wrap leading-relaxed font-sans">
                                            {predictionResult || "Analysis failed to load."}
                                        </div>
                                    )}
                                </div>

                                {!predictionLoading && predictionResult && (
                                    <div className="mt-6 flex gap-3">
                                        <button onClick={() => handleShare('whatsapp', `[Gistly.site AI Market Intel] ${activeMarket.symbol}\n\n${predictionResult}`, null)} className="flex-1 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/20 py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-colors">
                                            WhatsApp
                                        </button>
                                        <button onClick={() => handleShare('twitter', `[Gistly AI Analysis] ${activeMarket.symbol} outlook 📈\n\n${predictionResult.substring(0, 200)}...`, null)} className="flex-1 bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] border border-[#1DA1F2]/20 py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-colors">
                                            X (Twitter)
                                        </button>
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
