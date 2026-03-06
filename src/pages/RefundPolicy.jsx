import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RefreshCcw } from 'lucide-react';

export default function RefundPolicy() {
    return (
        <div className="min-h-screen bg-[#09090b] text-white selection:bg-rose-500/30 font-sans">
            <nav className="fixed top-0 w-full z-50 bg-[#09090b]/40 backdrop-blur-2xl border-b border-white/[0.05]">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center group-hover:bg-rose-500/20 transition-all">
                            <ArrowLeft className="text-rose-400 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        </div>
                        <span className="text-sm font-bold tracking-tight text-zinc-400 group-hover:text-white transition-colors">Back to <span className="text-rose-400">Gistly</span></span>
                    </Link>
                </div>
            </nav>

            <main className="pt-32 pb-24 px-6 relative max-w-4xl mx-auto flex gap-12">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-500/5 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="flex-1 space-y-12 relative z-10 w-full">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-widest mb-6">
                            <RefreshCcw className="w-3.5 h-3.5" /> Billing & Returns
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight font-display mb-6">Refund Policy</h1>
                        <p className="text-zinc-400 text-lg leading-relaxed">
                            Last updated: {new Date().toLocaleDateString()}
                        </p>
                    </div>

                    <div className="space-y-8 text-zinc-300 leading-relaxed max-w-none text-sm sm:text-base">
                        <section className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] transition-all hover:bg-white/[0.03]">
                            <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">1. Standard Refund Window</h2>
                            <p className="mb-4 text-zinc-400">
                                At Gistly, we stand behind our advanced generative intelligence. If you are not completely satisfied with your premium cluster access, we offer a <strong className="text-rose-400 shadow-sm border-b border-rose-500/50">14-day zero-questions refund policy</strong> for your initial subscription payment.
                            </p>
                            <p className="text-zinc-400">
                                This applies specifically to the first billing cycle of new accounts.
                            </p>
                        </section>

                        <section className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] transition-all hover:bg-white/[0.03]">
                            <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">2. Execution of Subscriptions</h2>
                            <p className="mb-4 text-zinc-400">
                                Because Gistly rapidly processes intensive cloud workloads via large language models (LLMs) and advanced visual engines immediately upon utilization, we generally cannot accept refund requests beyond the 14-day window. Unused subscription time is non-refundable.
                            </p>
                        </section>

                        <section className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] transition-all hover:bg-white/[0.03]">
                            <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">3. Cancellation Policies</h2>
                            <p className="mb-4 text-zinc-400">
                                Subscriptions auto-renew through Lemon Squeezy to maintain uninterrupted access to our services. You can cancel your subscription at any point prior to the next billing date. Your core access will simply revert to limitations of the standard free tier at the end of the current billing cycle.
                            </p>
                        </section>

                        <section className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] transition-all hover:bg-white/[0.03]">
                            <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">4. Process a Refund</h2>
                            <p className="mb-2 text-zinc-400">
                                If your charge meets the conditions mentioned above (i.e. within 14 days of a new purchase), process an inquiry by initiating contact via our support channel:
                            </p>
                            <a href="mailto:contact@gistly.site" className="text-xl font-mono block mt-4 px-6 py-4 rounded-xl bg-black/40 border border-white/10 text-white hover:text-rose-400 transition-colors font-bold tracking-tighter">
                                contact<span className="text-rose-400">@</span>gistly.site
                            </a>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
