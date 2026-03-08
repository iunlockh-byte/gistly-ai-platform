import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, AlertTriangle, Mail, X, Sparkles, Timer } from 'lucide-react';

const LaunchCountdown = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    const targetDate = new Date('2026-03-20T00:00:00').getTime();

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference < 0) {
                clearInterval(timer);
            } else {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((difference % (1000 * 60)) / 1000)
                });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const CountdownUnit = ({ value, label }) => (
        <div className="flex flex-col items-center px-3 py-2 bg-white/5 rounded-xl border border-white/10 min-w-[60px]">
            <span className="text-xl md:text-2xl font-black text-white font-mono leading-none">{value.toString().padStart(2, '0')}</span>
            <span className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest mt-1">{label}</span>
        </div>
    );

    return (
        <>
            {/* Initial Big Modal Popup */}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            className="max-w-xl w-full bg-[#0c0c0e] border border-white/10 rounded-[32px] p-8 md:p-12 relative overflow-hidden shadow-[0_0_100px_rgba(99,102,241,0.1)] group"
                        >
                            {/* Decorative background gradients */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-indigo-500 to-cyan-500"></div>
                            <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-[80px]"></div>
                            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-red-500/10 rounded-full blur-[80px]"></div>

                            <button 
                                onClick={() => setIsVisible(false)}
                                className="absolute top-6 right-6 p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-full transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex flex-col items-center text-center relative z-10">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-[1px] mb-8 shadow-2xl shadow-indigo-500/20">
                                    <div className="w-full h-full rounded-2xl bg-[#0c0c0e] flex items-center justify-center">
                                        <Timer className="w-8 h-8 text-indigo-400" />
                                    </div>
                                </div>

                                <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tighter">Gistly AI <span className="text-indigo-400">Launch</span></h2>
                                
                                <div className="flex gap-3 mb-8">
                                    <CountdownUnit value={timeLeft.days} label="Days" />
                                    <CountdownUnit value={timeLeft.hours} label="Hrs" />
                                    <CountdownUnit value={timeLeft.minutes} label="Min" />
                                    <CountdownUnit value={timeLeft.seconds} label="Sec" />
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 px-6 py-4 rounded-2xl">
                                        <AlertTriangle className="w-6 h-6 text-red-500 shrink-0" />
                                        <p className="text-sm text-red-200 font-bold text-left leading-tight">
                                            PLATFORM UNDER DEVELOPMENT: Please do NOT attempt any live payments at this moment.
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-4 rounded-2xl">
                                        <Mail className="w-5 h-5 text-indigo-400 shrink-0" />
                                        <p className="text-sm text-zinc-300 text-left">
                                            Interested or need support? Contact us at: <span className="text-white font-bold select-all">contact@gistly.site</span>
                                        </p>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => setIsVisible(false)}
                                    className="w-full py-4 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-zinc-200 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
                                >
                                    Enter Alpha Access
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Small Floating Footer Banner (After closing popup) */}
            <AnimatePresence>
                {!isVisible && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="fixed top-24 left-4 md:top-auto md:bottom-14 md:left-1/2 md:-translate-x-1/2 z-[900] w-fit max-w-[90%] md:max-w-xl"
                    >
                        <div className="bg-[#0c0c0e]/80 backdrop-blur-2xl border border-white/10 rounded-xl md:rounded-2xl p-2 md:p-4 flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4 shadow-2xl">
                            <div className="flex items-center gap-2 md:gap-3">
                                <div className="p-1.5 md:p-2 bg-red-500/10 rounded-lg">
                                    <AlertTriangle className="w-3.5 h-3.5 md:w-4 md:h-4 text-red-500" />
                                </div>
                                <div className="text-left">
                                    <p className="text-[8px] md:text-[10px] font-black text-white uppercase tracking-widest mb-0.5">Development Alpha</p>
                                    <p className="text-[7px] md:text-[9px] text-zinc-500 font-bold">Payments disabled | contact@gistly.site</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pr-2 border-t md:border-t-0 md:border-l border-white/10 pt-2 md:pt-0 md:pl-4">
                                <span className="text-[8px] md:text-[10px] font-black text-indigo-400 uppercase tracking-widest">Launch In</span>
                                <div className="flex gap-1.5 font-mono font-bold text-[10px] md:text-xs text-white">
                                    <span>{timeLeft.days}d</span>
                                    <span>:</span>
                                    <span>{timeLeft.hours}h</span>
                                    <span>:</span>
                                    <span>{timeLeft.minutes}m</span>
                                    <span>:</span>
                                    <span>{timeLeft.seconds}s</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default LaunchCountdown;
