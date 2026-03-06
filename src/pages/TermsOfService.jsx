import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, ScrollText } from 'lucide-react';

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-[#09090b] text-white selection:bg-indigo-500/30 font-sans">
            <nav className="fixed top-0 w-full z-50 bg-[#09090b]/40 backdrop-blur-2xl border-b border-white/[0.05]">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/20 transition-all">
                            <ArrowLeft className="text-indigo-400 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        </div>
                        <span className="text-sm font-bold tracking-tight text-zinc-400 group-hover:text-white transition-colors">Back to <span className="text-indigo-400">Gistly</span></span>
                    </Link>
                </div>
            </nav>

            <main className="pt-32 pb-24 px-6 relative max-w-4xl mx-auto flex gap-12">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="flex-1 space-y-12 relative z-10 w-full">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6">
                            <ScrollText className="w-3.5 h-3.5" /> Legal Document
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight font-display mb-6">Terms of Service</h1>
                        <p className="text-zinc-400 text-lg leading-relaxed">
                            Last updated: {new Date().toLocaleDateString()}
                        </p>
                    </div>

                    <div className="space-y-8 text-zinc-300 leading-relaxed max-w-none text-sm sm:text-base">
                        <section className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] transition-all hover:bg-white/[0.03]">
                            <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">1. Acceptance of Terms</h2>
                            <p className="mb-4 text-zinc-400">
                                By accessing or using the Gistly (gistly.site) artificial intelligence platform and its associated services, you agree to comply with and be bound by these Terms of Service. If you do not agree, please refrain from using our platform.
                            </p>
                        </section>

                        <section className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] transition-all hover:bg-white/[0.03]">
                            <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">2. Use of Service</h2>
                            <ul className="list-disc pl-5 space-y-2 text-zinc-400">
                                <li>You must be at least 18 years old to use this service.</li>
                                <li>You are responsible for safeguarding your account access credentials.</li>
                                <li>You must not use our platform to generate illegal, harmful, or abusive content. We reserve the right to terminate accounts that violate these terms.</li>
                            </ul>
                        </section>

                        <section className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] transition-all hover:bg-white/[0.03]">
                            <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">3. Intellectual Property Rights</h2>
                            <p className="mb-4 text-zinc-400">
                                The content you generate using Gistly remains your intellectual property, provided it complies with applicable laws. You grant Gistly a non-exclusive license to process and display this requested content for the operation of the service.
                            </p>
                            <p className="text-zinc-400">
                                The platform, its design system, and core code are the exclusive property of Gistly.
                            </p>
                        </section>

                        <section className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] transition-all hover:bg-white/[0.03]">
                            <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">4. Payment and Subscriptions</h2>
                            <p className="mb-4 text-zinc-400">
                                Gistly uses Lemon Squeezy to process payments and subscriptions securely. By completing a subscription, you agree to their payment processing conditions. We are not responsible for unauthorized charges resulting from a compromised user account.
                            </p>
                        </section>

                        <section className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] transition-all hover:bg-white/[0.03]">
                            <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">5. Limitation of Liability</h2>
                            <p className="text-zinc-400">
                                Gistly is provided "as is" without warranty. We shall not be liable for any indirect, incidental, or consequential damages related to your use of this service or downtime. AI model outputs are probabilistic, and we make no guarantees of total accuracy.
                            </p>
                        </section>
                    </div>

                    <div className="pt-8 border-t border-white/10 text-center">
                        <p className="text-zinc-500 text-sm">Have questions? Reach us via the <Link to="/" className="text-indigo-400 hover:text-indigo-300">Infinite Canvas Neural Uplink</Link> or email contact@gistly.site.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
