import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-[#09090b] text-white selection:bg-emerald-500/30 font-sans">
            <nav className="fixed top-0 w-full z-50 bg-[#09090b]/40 backdrop-blur-2xl border-b border-white/[0.05]">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/20 transition-all">
                            <ArrowLeft className="text-emerald-400 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        </div>
                        <span className="text-sm font-bold tracking-tight text-zinc-400 group-hover:text-white transition-colors">Back to <span className="text-emerald-400">Gistly</span></span>
                    </Link>
                </div>
            </nav>

            <main className="pt-32 pb-24 px-6 relative max-w-4xl mx-auto flex gap-12">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="flex-1 space-y-12 relative z-10 w-full">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6">
                            <Shield className="w-3.5 h-3.5" /> Data Security
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight font-display mb-6">Privacy Policy</h1>
                        <p className="text-zinc-400 text-lg leading-relaxed">
                            Last updated: {new Date().toLocaleDateString()}
                        </p>
                    </div>

                    <div className="space-y-8 text-zinc-300 leading-relaxed max-w-none text-sm sm:text-base">
                        <section className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] transition-all hover:bg-white/[0.03]">
                            <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">1. Information We Collect</h2>
                            <p className="mb-4 text-zinc-400">
                                When you use Gistly, we collect only the necessary information to provide an optimal artificial intelligence experience.
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-zinc-400">
                                <li><strong>Account Information:</strong> Name, email address, connected SSO identities (via Clerk).</li>
                                <li><strong>Usage Data:</strong> Anonymized interaction metadata to improve node routing algorithms.</li>
                                <li><strong>Input Content:</strong> Data voluntarily given to active neural nodes (images, prompts) for generation purposes.</li>
                                <li><strong>Payment Information:</strong> Processed fully and securely by Lemon Squeezy (we don't store your full credit card number).</li>
                            </ul>
                        </section>

                        <section className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] transition-all hover:bg-white/[0.03]">
                            <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">2. How We Use Information</h2>
                            <p className="mb-4 text-zinc-400">
                                Your information is utilized strictly to:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-zinc-400">
                                <li>Provide and maintain the Gistly service (authentication, saved workflows).</li>
                                <li>Communicate regarding product updates, security alerts, and support requests.</li>
                                <li>Process billing and subscription activation via our partner, Lemon Squeezy.</li>
                            </ul>
                        </section>

                        <section className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] transition-all hover:bg-white/[0.03]">
                            <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">3. Data Security and Zero-Retention Protocol</h2>
                            <p className="mb-4 text-zinc-400">
                                We employ industry-standard encryption algorithms to protect data during transmission. Your workflow history is securely stored on Supabase using Row Level Security (RLS), meaning no one but authenticated accounts can access the respective logs.
                            </p>
                            <p className="text-zinc-400">
                                Furthermore, inputs to our visual generation engines immediately evaporate post-processing unless explicitly saved.
                            </p>
                        </section>

                        <section className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] transition-all hover:bg-white/[0.03]">
                            <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">4. Third Parties</h2>
                            <p className="mb-4 text-zinc-400">
                                We may share minimal required data with select third-party services like Clerk (authentication), Supabase (database), and Lemon Squeezy (billing) strictly to facilitate operations. We do not sell your data to any data brokers or advertisers.
                            </p>
                        </section>

                        <section className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] transition-all hover:bg-white/[0.03]">
                            <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">5. Your Rights</h2>
                            <p className="text-zinc-400">
                                You hold the right to obtain a copy of your personal data, request corrections, and mandate full account deletion from our systems. Contact us to execute a complete data erasure.
                            </p>
                        </section>
                    </div>

                    <div className="pt-8 border-t border-white/10 text-center">
                        <p className="text-zinc-500 text-sm">Have an inquiry regarding zero-retention policies? <br /> Contact our team at contact@gistly.site.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
