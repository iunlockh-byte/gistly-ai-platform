import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';

import {
    FileText, Code, Image as ImageIcon, Video, UserCheck,
    Terminal, FileSearch, RefreshCw, FileCode, Search,
    FileCheck, FileJson, Share2, Database, LayoutDashboard,
    Sparkles, Zap, ChevronRight, Github, ExternalLink, Menu, X, ArrowLeft, Send, Loader2,
    Lock, Wand2, Calculator, Settings, Globe, Volume2, Copy, Play, Mail, Cpu, Orbit, Fingerprint, Shield, MessageSquare, Maximize2, Move,
    Mic, MicOff, Bot, Check, CreditCard, Star, History, Save, FilePlus, FolderOpen
} from 'lucide-react';
import axios from 'axios';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const tools = [
    {
        id: 'summarizer',
        endpoint: '/api/summarize',
        name: 'AI Summarizer',
        description: 'Transform long articles into concise gists.',
        icon: FileText,
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20',
        category: 'Content',
        placeholder: 'Paste your long text here...',
        buttonText: 'Summarize Intelligence'
    },
    {
        id: 'bug-fixer',
        endpoint: '/api/debug',
        name: 'AI Code Debugger',
        description: 'Paste your code and let AI find and fix bugs.',
        icon: Terminal,
        color: 'text-orange-400',
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/20',
        category: 'Development',
        placeholder: '// Paste your buggy code here...',
        buttonText: 'Initiate Debugging'
    },
    {
        id: 'humanizer',
        endpoint: '/api/humanize',
        name: 'Content Humanizer',
        description: 'Make AI text sound authentically human.',
        icon: UserCheck,
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20',
        category: 'Content',
        placeholder: 'Paste AI-generated text here...',
        buttonText: 'Humanize Text'
    },
    {
        id: 'sql-gen',
        endpoint: '/api/sql-generate',
        name: 'Smart SQL Generator',
        description: 'Natural language to optimized SQL queries.',
        icon: Database,
        color: 'text-cyan-400',
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-500/20',
        category: 'Data',
        placeholder: 'Describe the query you need (e.g., "Find top 10 customers by revenue last month")...',
        buttonText: 'Compile SQL'
    },
    {
        id: 'image',
        endpoint: '/api/generate-image',
        name: 'AI Image Gen',
        description: 'Generate stunning AI images from text prompts.',
        icon: ImageIcon,
        color: 'text-pink-400',
        bg: 'bg-pink-500/10',
        border: 'border-pink-500/20',
        category: 'Creative',
        placeholder: 'Describe the image you want to create in vivid detail...',
        buttonText: 'Render Visual',
        isImage: true
    },
    {
        id: 'email-gen',
        endpoint: '/api/email-gen',
        name: 'Email Composer',
        description: 'Draft highly effective professional emails instantly.',
        icon: Send,
        color: 'text-blue-500',
        bg: 'bg-blue-600/10',
        border: 'border-blue-600/20',
        category: 'Business',
        placeholder: 'Who is this email for and what should it say?',
        buttonText: 'Draft Communication'
    },
    {
        id: 'regex-gen',
        endpoint: '/api/regex-gen',
        name: 'Regex Builder',
        description: 'Translate natural language to complex Regex patterns.',
        icon: Code,
        color: 'text-indigo-400',
        bg: 'bg-indigo-500/10',
        border: 'border-indigo-500/20',
        category: 'Development',
        placeholder: 'Describe the pattern (e.g., Match all valid Gmail addresses)...',
        buttonText: 'Synthesize Pattern'
    },
    {
        id: 'cover-letter',
        endpoint: '/api/cover-letter',
        name: 'Cover Letter Pro',
        description: 'Create winning cover letters tailored to your dream job.',
        icon: FileSearch,
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/20',
        category: 'Career',
        placeholder: 'Paste the job description and your key skills here...',
        buttonText: 'Generate Application'
    },
    {
        id: 'grammar-fix',
        endpoint: '/api/grammar-fix',
        name: 'Grammar Coach',
        description: 'Fix typos, grammar, and elevate your writing style.',
        icon: RefreshCw,
        color: 'text-teal-400',
        bg: 'bg-teal-500/10',
        border: 'border-teal-500/20',
        category: 'Content',
        placeholder: 'Paste your draft text here to make it sound professional...',
        buttonText: 'Refine Copy'
    },
    {
        id: 'business-validator',
        endpoint: '/api/business-validator',
        name: 'Idea Validator',
        description: 'Analyze your startup idea with pros, cons & audience.',
        icon: LayoutDashboard,
        color: 'text-rose-400',
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/20',
        category: 'Business',
        placeholder: 'Describe your business or app idea in detail...',
        buttonText: 'Run Analysis'
    },
    {
        id: 'youtube-summarizer',
        endpoint: '/api/youtube-summarizer',
        name: 'YouTube Summarizer',
        description: 'Get instant intelligence and summaries from long YouTube videos.',
        icon: Video,
        color: 'text-red-500',
        bg: 'bg-red-500/10',
        border: 'border-red-500/20',
        category: 'Content',
        placeholder: 'Paste YouTube URL here...',
        buttonText: 'Extract Insights'
    },
    {
        id: 'webpage-summarizer',
        endpoint: '/api/webpage-summarizer',
        name: 'Webpage Summarizer',
        description: 'TL;DR for any article or website link.',
        icon: Globe,
        color: 'text-sky-400',
        bg: 'bg-sky-500/10',
        border: 'border-sky-500/20',
        category: 'Content',
        placeholder: 'Paste Website URL here...',
        buttonText: 'Digest Page'
    },
    {
        id: 'tts-gen',
        endpoint: '/api/tts',
        name: 'AI Voice Generator',
        description: 'Convert any text into natural human speech.',
        icon: Volume2,
        color: 'text-violet-400',
        bg: 'bg-violet-500/10',
        border: 'border-violet-500/20',
        category: 'Creative',
        placeholder: 'Enter text to synthesize into speech...',
        buttonText: 'Synthesize Audio',
        isAudio: true
    },
    {
        id: 'vision-api',
        endpoint: '/api/vision',
        name: 'Vision Analytics',
        description: 'Understand and analyze any image context (Coming Soon).',
        icon: ImageIcon,
        color: 'text-emerald-500',
        bg: 'bg-emerald-600/10',
        border: 'border-emerald-600/20',
        category: 'Creative',
        placeholder: 'Image analysis context or questions...',
        buttonText: 'Analyze Frame',
        isStatic: true
    }
];

const categories = ['All', 'Content', 'Development', 'Creative', 'Data', 'Business'];

// Galaxy / Starfield effect moving towards camera
const MovingStars = () => {
    const pointsRef = useRef();

    // Generate random stars
    const [starPositions] = useState(() => {
        const positions = new Float32Array(5000 * 3);
        for (let i = 0; i < 5000; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 100;     // x
            positions[i * 3 + 1] = (Math.random() - 0.5) * 100; // y
            positions[i * 3 + 2] = (Math.random() - 0.5) * 100; // z
        }
        return positions;
    });

    useFrame((state, delta) => {
        if (pointsRef.current) {
            // Move stars towards camera (z increases)
            const positions = pointsRef.current.geometry.attributes.position.array;
            for (let i = 0; i < 5000; i++) {
                positions[i * 3 + 2] += delta * 20; // Speed of ship
                if (positions[i * 3 + 2] > 10) {
                    // Reset far back with random depth to prevent flat walls of stars
                    positions[i * 3 + 2] = -90 - Math.random() * 50;
                    // Optional: also randomize X and Y slightly when resetting to prevent visible trails over time
                    positions[i * 3] = (Math.random() - 0.5) * 100;
                    positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
                }
            }
            pointsRef.current.geometry.attributes.position.needsUpdate = true;

            // Add slight global rotation for a dynamic steering effect
            pointsRef.current.rotation.z -= delta * 0.02;
            pointsRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
            pointsRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.15) * 0.05;
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={starPositions.length / 3}
                    array={starPositions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.12}
                color="#e0e7ff"
                transparent
                opacity={0.6}
                sizeAttenuation
                depthWrite={false}
                blending={2} // AdditiveBlending
            />
        </points>
    );
};

// Floating Holographic Texts in the Galaxy
import { Text } from '@react-three/drei';

const FloatingTexts = () => {
    const textGroupRef = useRef();

    // Generate random positions for the texts
    const [texts] = useState(() => {
        const items = [];
        for (let i = 0; i < 15; i++) {
            items.push({
                x: (Math.random() - 0.5) * 40,
                y: (Math.random() - 0.5) * 40,
                z: -50 - Math.random() * 100, // Starts far back
                scale: 1 + Math.random() * 2 // slightly different sizes
            });
        }
        return items;
    });

    useFrame((state, delta) => {
        if (textGroupRef.current) {
            // Move texts towards camera same as stars
            textGroupRef.current.children.forEach(child => {
                child.position.z += delta * 20;
                // Fade out/in based on distance
                if (child.position.z > 5) {
                    child.position.z = -150 - Math.random() * 50;
                    child.position.x = (Math.random() - 0.5) * 40;
                    child.position.y = (Math.random() - 0.5) * 40;
                }
            });
            // Steer effect to match stars
            textGroupRef.current.rotation.z -= delta * 0.02;
            textGroupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
            textGroupRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.15) * 0.05;
        }
    });

    return (
        <group ref={textGroupRef}>
            {texts.map((props, i) => (
                <Text
                    key={i}
                    position={[props.x, props.y, props.z]}
                    scale={[props.scale, props.scale, props.scale]}
                    fontSize={0.6}
                    color="#4f46e5"
                    fillOpacity={0.15} // very subtle holographic feel
                    anchorX="center"
                    anchorY="middle"
                    font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZJhjp-Ek-_EeA.woff" // Optional proper font
                    fontWeight={900}
                >
                    Gistly.ai
                </Text>
            ))}
        </group>
    );
};

// The Interactive 3D AI Core (Siri/Bixby Style)
const BrainCore = () => {
    const groupRef = useRef();

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
            groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
            groupRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2;
        }
    });

    return (
        <group ref={groupRef} scale={2.4}>
            {/* Inner Core - Deep Red / Ruby (Glassy) */}
            <Sphere args={[1.0, 64, 64]}>
                <MeshDistortMaterial
                    color="#991b1b"
                    emissive="#7f1d1d"
                    emissiveIntensity={1.5}
                    distort={0.3}
                    speed={3}
                    roughness={0}
                    metalness={1}
                />
            </Sphere>

            {/* Middle Layer - Deep Purple / Indigo (Glassy) */}
            <Sphere args={[1.2, 64, 64]}>
                <MeshDistortMaterial
                    color="#4c1d95"
                    emissive="#581c87"
                    emissiveIntensity={1}
                    distort={0.4}
                    speed={4}
                    transparent
                    opacity={0.6}
                    roughness={0}
                    metalness={1}
                    blending={2} // AdditiveBlending
                />
            </Sphere>

            {/* Outer Layer - Deep Electric Blue / Navy (Glassy) */}
            <Sphere args={[1.4, 64, 64]}>
                <MeshDistortMaterial
                    color="#1e3a8a"
                    emissive="#1e40af"
                    emissiveIntensity={0.8}
                    distort={0.6}
                    speed={2}
                    transparent
                    opacity={0.4}
                    roughness={0}
                    metalness={1}
                    blending={2} // AdditiveBlending
                />
            </Sphere>
        </group>
    );
};

// The Gistly Voice Assistant (J.A.R.V.I.S Style)
const GistlyVoiceAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);

    const speak = (msg) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel(); // stop any current speech
        const utterance = new SpeechSynthesisUtterance(msg);
        utterance.rate = 1.1; // JARVIS-like speed
        utterance.pitch = 0.95; // Slightly lower pitch for a sophisticated feel

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    };

    const toggleAssistant = () => {
        if (!isOpen) {
            setIsOpen(true);
            setTimeout(() => {
                speak("Hi, I'm Gistly. How can I help you today?");
            }, 500);
        } else {
            setIsOpen(false);
            setIsListening(false);
            window.speechSynthesis?.cancel();
        }
    };

    const handleListen = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Your browser does not support Speech Recognition.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            setIsListening(true);
            setTranscript("Listening...");
        };

        recognition.onresult = (event) => {
            const current = event.resultIndex;
            const text = event.results[current][0].transcript;
            setTranscript(text);
            setIsListening(false);

            // Basic logic: if user speaks, AI responds (simplified demo)
            setTimeout(() => {
                speak(`I understood you said: ${text}. I'm processing that on my neural neural core.`);
            }, 800);
        };

        recognition.onerror = () => {
            setIsListening(false);
            setTranscript("Error occurred.");
        };

        recognition.start();
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5, y: 20 }}
                        className="bg-black/60 backdrop-blur-2xl border border-indigo-500/20 rounded-3xl p-6 mb-6 w-72 shadow-[0_0_50px_rgba(79,70,229,0.15)] relative overflow-hidden"
                    >
                        {/* JARVIS Glow background */}
                        <div className="absolute inset-0 bg-radial-gradient from-indigo-500/10 to-transparent pointer-events-none" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className={cn(
                                    "p-2 rounded-full border border-indigo-500/30",
                                    isSpeaking ? "bg-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.5)]" : "bg-black/40"
                                )}>
                                    <Bot className="w-5 h-5 text-indigo-400" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-sm tracking-wide">GISTLY ASSISTANT</h4>
                                    <p className="text-[10px] text-indigo-400 font-mono tracking-widest uppercase opacity-70">Core 2.0</p>
                                </div>
                            </div>

                            <div className="bg-white/5 rounded-2xl p-4 mb-4 min-h-[80px] flex items-center justify-center text-center">
                                <p className="text-zinc-400 text-xs italic leading-relaxed">
                                    {transcript || "Click the mic to speak with Gistly"}
                                </p>
                            </div>

                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={handleListen}
                                    disabled={isListening || isSpeaking}
                                    className={cn(
                                        "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500",
                                        isListening ? "bg-red-500/20 border-red-500/50 scale-110" : "bg-indigo-500/10 border border-indigo-500/30 hover:bg-indigo-500/30"
                                    )}
                                >
                                    {isListening ? (
                                        <div className="relative">
                                            <div className="absolute -inset-2 bg-red-500/20 animate-ping rounded-full" />
                                            <Mic className="w-5 h-5 text-red-400" />
                                        </div>
                                    ) : <Mic className="w-5 h-5 text-indigo-400" />}
                                </button>

                                {isSpeaking && (
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4].map(i => (
                                            <motion.div
                                                key={i}
                                                animate={{ height: [8, 20, 8] }}
                                                transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                                                className="w-1 bg-indigo-500/50 rounded-full"
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleAssistant}
                className={cn(
                    "relative group w-16 h-16 rounded-full bg-[#0a0a0c] border border-white/5 flex items-center justify-center shadow-2xl overflow-hidden",
                    isOpen ? "ring-2 ring-indigo-500/50" : ""
                )}
            >
                {/* Spinner outer ring */}
                <div className="absolute inset-0 border-2 border-transparent border-t-indigo-500/40 rounded-full animate-spin duration-3000" />

                {/* Animated aura */}
                <div className={cn(
                    "absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                    isSpeaking ? "opacity-100 bg-red-500/10" : ""
                )} />

                <div className="relative">
                    {isOpen ? (
                        <X className="w-6 h-6 text-white" />
                    ) : (
                        <div className="relative">
                            <div className="absolute -inset-4 bg-indigo-500/10 animate-pulse rounded-full" />
                            <Cpu className="w-7 h-7 text-indigo-500 group-hover:text-indigo-400 transition-colors" />
                        </div>
                    )}
                </div>

                {/* Status indicator */}
                <div className={cn(
                    "absolute bottom-0 right-0 w-3 h-3 border-2 border-[#0a0a0c] rounded-full",
                    isListening ? "bg-red-500" : "bg-emerald-500"
                )} />
            </motion.button>
        </div>
    );
};

// Premium Pricing Modal Component
const PricingModal = ({ isOpen, onClose }) => {
    const plans = [
        {
            name: "Free Explorer",
            price: "$0",
            desc: "For curiosity and testing",
            features: ["5 Daily Generations", "Standard Speed", "Community Support", "Basic Neural Wires"],
            button: "Current Plan",
            color: "border-zinc-800 bg-zinc-900/50",
            textColor: "text-zinc-400"
        },
        {
            name: "Pro Architect",
            price: "$19",
            period: "/mo",
            desc: "The professional standard",
            features: ["Unlimited Neural Ops", "Priority GPU Access", "Gistly Voice AI", "Advanced Debugger", "Early Beta Access"],
            button: "Upgrade to Pro",
            popular: true,
            color: "border-indigo-500/40 bg-indigo-500/10 shadow-[0_0_40px_rgba(99,102,241,0.1)]",
            textColor: "text-white"
        },
        {
            name: "Neural Agency",
            price: "$99",
            period: "/mo",
            desc: "Scale your intelligence",
            features: ["Everything in Pro", "API Developer Key", "Custom Model Tuning", "Dedicated Data Line", "SLA Guarantee"],
            button: "Contact Sales",
            color: "border-emerald-500/30 bg-emerald-500/5",
            textColor: "text-white"
        }
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 overflow-y-auto"
                >
                    <motion.div
                        initial={{ scale: 0.95, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 20 }}
                        className="bg-[#09090b] border border-white/10 rounded-[40px] p-8 md:p-12 max-w-6xl w-full relative shadow-3xl"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-8 right-8 text-zinc-500 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="text-center mb-12">
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Expand Your Intelligence</h2>
                            <p className="text-zinc-500 max-w-xl mx-auto text-lg leading-relaxed">
                                Choose the neural bandwidth that fits your evolution. No limits, just pure execution.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {plans.map((plan, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -10 }}
                                    className={cn(
                                        "relative border p-8 rounded-[32px] flex flex-col transition-all",
                                        plan.color
                                    )}
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                                            Most Popular
                                        </div>
                                    )}

                                    <div className="mb-8">
                                        <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl font-black text-white">{plan.price}</span>
                                            {plan.period && <span className="text-zinc-500 font-medium text-sm">{plan.period}</span>}
                                        </div>
                                        <p className="text-zinc-500 text-sm mt-3">{plan.desc}</p>
                                    </div>

                                    <div className="space-y-4 mb-10 flex-1">
                                        {plan.features.map((feat, j) => (
                                            <div key={j} className="flex items-start gap-3 text-sm">
                                                <div className="mt-1 flex-shrink-0 w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                                    <Check className="w-2.5 h-2.5 text-emerald-400" />
                                                </div>
                                                <span className="text-zinc-400 font-medium">{feat}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => {
                                            if (plan.price === "$0") {
                                                onClose();
                                            } else {
                                                alert("Stripe Integration Initializing... Redirecting to Secure Gateway.");
                                            }
                                        }}
                                        className={cn(
                                            "w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-95",
                                            plan.popular
                                                ? "bg-indigo-500 text-white hover:bg-indigo-400 shadow-indigo-500/25"
                                                : "bg-white/5 text-zinc-300 hover:bg-white/10"
                                        )}
                                    >
                                        {plan.button}
                                    </button>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-12 text-center text-xs text-zinc-600 font-mono uppercase tracking-[0.2em] opacity-50">
                            Secure Encrypted Transactions • Global Intelligence Access
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// Represents a single floating tool execution node on the canvas
const DraggableNode = ({ data, removeNode, updateNodePosition }) => {
    const [inputText, setInputText] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [generationTime, setGenerationTime] = useState(0);

    const tool = tools.find(t => t.id === data.toolId);

    useEffect(() => {
        let interval;
        let timeout;
        if (imageLoading) {
            interval = setInterval(() => {
                setGenerationTime(prev => prev + 1);
            }, 1000);
            timeout = setTimeout(() => {
                if (imageLoading) {
                    setImageLoading(false);
                    setImageError(true);
                }
            }, 35000);
        } else {
            setGenerationTime(0);
        }
        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [imageLoading]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleRunTool = async () => {
        if (tool.isStatic) {
            setResult("System Notice: Module architecture for Vision API is currently being initialized.");
            return;
        }

        setLoading(true);
        setResult('');

        if (tool.isImage) {
            setImageLoading(true);
            setImageError(false);
        }

        try {
            const response = await axios.post(`${API_BASE_URL}${tool.endpoint}`, {
                content: inputText
            });
            setResult(response.data.result);
        } catch (error) {
            setResult(`Error: ${error.response?.data?.detail || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const dragControls = useDragControls();

    return (
        <motion.div
            drag
            dragListener={false}
            dragControls={dragControls}
            dragMomentum={false}
            onDragEnd={(e, info) => updateNodePosition(data.id, info.point.x, info.point.y)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`absolute w-[450px] pointer-events-auto bg-[#111113]/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col z-20 group`}
            style={{ x: data.x, y: data.y }}
            whileDrag={{ scale: 1.02, zIndex: 50, boxShadow: '0 30px 60px rgba(99,102,241,0.2)' }}
        >
            {/* Header (Drag Handle) */}
            <div
                className={`p-4 border-b border-white/10 flex items-center justify-between bg-black/40 hover:bg-white/[0.02]`}
            >
                <div className="flex items-center gap-3">
                    <div
                        className="cursor-grab active:cursor-grabbing p-1.5 -ml-1.5 hover:bg-white/5 rounded-md transition-colors"
                        onPointerDown={(e) => {
                            e.preventDefault();
                            dragControls.start(e);
                        }}
                    >
                        <Move className="w-4 h-4 text-zinc-500 hover:text-zinc-300" />
                    </div>
                    <div className={cn("p-1.5 rounded-md border", tool.bg, tool.border)}>
                        <tool.icon className={cn("w-4 h-4", tool.color)} />
                    </div>
                    <h3 className="font-bold text-white text-sm tracking-tight">{tool.name}</h3>
                </div>
                <button
                    onClick={() => removeNode(data.id)}
                    className="text-zinc-500 hover:text-red-400 transition-colors p-1 relative z-50 pointer-events-auto cursor-pointer"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Content Area */}
            <div className="p-0 flex flex-col cursor-auto">
                <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={tool.placeholder}
                    className="w-full h-[120px] bg-transparent p-4 text-zinc-300 focus:ring-0 outline-none resize-none font-mono text-xs leading-relaxed placeholder:text-zinc-700 border-b border-white/5"
                    spellCheck={false}
                />

                <div className="p-3 bg-black/20 flex justify-end shrink-0">
                    <button
                        disabled={loading || !inputText}
                        onClick={handleRunTool}
                        className="px-5 py-2 bg-indigo-500 text-white disabled:bg-zinc-800 disabled:text-zinc-600 text-xs font-bold uppercase tracking-widest rounded-lg transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] disabled:shadow-none"
                    >
                        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                        Execute Node
                    </button>
                </div>

                {/* Output Area */}
                {(result || loading) && (
                    <div className="p-4 bg-black/40 border-t border-white/5 max-h-[250px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        {loading && !result && (
                            <div className="flex flex-col items-center justify-center py-6 text-indigo-400">
                                <Sparkles className="w-6 h-6 animate-pulse mb-3 opacity-50" />
                                <span className="text-[10px] font-mono uppercase tracking-[0.2em] animate-pulse">Processing Core Logic...</span>
                            </div>
                        )}

                        {result && (
                            <div className="animate-fade-in relative text-sm">
                                {tool.isImage ? (
                                    <div className="rounded-xl overflow-hidden border border-white/10 relative bg-black aspect-square">
                                        {imageLoading && (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                                                <div className="text-xl font-mono text-white mb-2">{formatTime(generationTime)}</div>
                                                <span className="text-[8px] uppercase tracking-widest text-indigo-400">Rendering...</span>
                                            </div>
                                        )}
                                        {imageError && (
                                            <div className="absolute inset-0 flex items-center justify-center z-10 text-red-400 text-xs text-center px-4">
                                                Task Timeout/Failed. Try again.
                                            </div>
                                        )}
                                        <img
                                            src={`data:image/png;base64,${result}`}
                                            className={cn("w-full h-full object-cover transition-all duration-1000", (imageLoading || imageError || !result) ? "opacity-0 grayscale" : "opacity-100")}
                                            alt="Render"
                                            onLoad={() => { setImageLoading(false); setImageError(false); }}
                                            onError={() => { if (result) { setImageLoading(false); setImageError(true); } }}
                                        />
                                    </div>
                                ) : tool.isAudio ? (
                                    <div className="py-4">
                                        <audio controls className="w-full accent-violet-500 scale-90" autoPlay>
                                            <source src={`data:audio/mp3;base64,${result}`} type="audio/mp3" />
                                        </audio>
                                    </div>
                                ) : (
                                    <div className="text-zinc-300 font-sans text-xs leading-loose whitespace-pre-wrap">
                                        {result}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </motion.div >
    );
};

export default function App() {
    const { user, isSignedIn } = useUser();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [nodes, setNodes] = useState([]); // Active nodes on canvas
    const [workflowId, setWorkflowId] = useState(`flow_${Math.random().toString(36).substr(2, 9)}`);
    const [workflowName, setWorkflowName] = useState("My Neural Workflow");
    const [history, setHistory] = useState([]);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Modal states
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [isAboutOpen, setIsAboutOpen] = useState(false);
    const [isPricingOpen, setIsPricingOpen] = useState(false);

    const filteredTools = tools.filter(tool => selectedCategory === 'All' || tool.category === selectedCategory);

    const saveWorkflow = async () => {
        if (!isSignedIn) {
            alert("Please sign in to save your workflow.");
            return;
        }
        setIsSaving(true);
        try {
            await axios.post(`${API_BASE_URL}/api/workflows/save`, {
                id: workflowId,
                user_id: user.id,
                name: workflowName,
                nodes: nodes
            });
            // show subtle toast or message
            alert("Architecture Protocol Saved Successfully.");
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    const fetchHistory = async () => {
        if (!isSignedIn) return;
        try {
            const resp = await axios.get(`${API_BASE_URL}/api/workflows/${user.id}`);
            setHistory(resp.data.workflows);
            setIsHistoryOpen(true);
        } catch (err) {
            console.error(err);
        }
    };

    const loadWorkflow = async (id) => {
        try {
            const resp = await axios.get(`${API_BASE_URL}/api/workflow-data/${id}`);
            setNodes(resp.data.nodes);
            setWorkflowId(id);
            setWorkflowName(resp.data.name);
            setIsHistoryOpen(false);
        } catch (err) {
            console.error(err);
        }
    };

    const clearCanvas = () => {
        if (window.confirm("Initialize clean architecture? All current nodes will be cleared.")) {
            setNodes([]);
            setWorkflowId(`flow_${Math.random().toString(36).substr(2, 9)}`);
            setWorkflowName("New Neural Workflow");
        }
    };

    const addNode = (toolId) => {
        const offset = (nodes.length * 30) % 150;
        const newNode = {
            id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            toolId,
            // Spawn systematically around center
            x: window.innerWidth / 2 - 225 + offset - 100,
            y: window.innerHeight / 2 - 200 + offset,
        };
        setNodes(curr => [...curr, newNode]);
    };

    const removeNode = (id) => {
        setNodes(curr => curr.filter(n => n.id !== id));
    };

    const updateNodePosition = (id, x, y) => {
        // Keeps tracks of node coords for lines connecting to center (optional visual feature)
        setNodes(curr => curr.map(n => n.id === id ? { ...n, x, y } : n));
    };

    // Calculate dynamic SVG wires from the core (center) to each node
    const centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
    const centerY = typeof window !== 'undefined' ? window.innerHeight / 2 : 0;

    return (
        <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-indigo-500/30 overflow-hidden relative">

            {/* 3D Background & Neural Architecture */}
            <div className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center">
                <Canvas camera={{ position: [0, 0, 8] }} className="absolute inset-0">
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={1.5} color="#6366f1" />
                    <pointLight position={[-10, -10, -5]} color="#22d3ee" intensity={2} />
                    <pointLight position={[5, -5, 5]} color="#a855f7" intensity={1} />

                    {/* Add the moving galaxy/stars effect */}
                    <MovingStars />
                    <FloatingTexts />

                    <BrainCore />
                </Canvas>

                {/* Visual grid overlay for canvas feel */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none" />

                {/* Optional radial fade so edges are darker */}
                <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#050505]/40 to-[#050505] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, transparent 0%, #050505 70%)' }}></div>
            </div>

            {/* SVG Wires Layer */}
            <svg className="fixed inset-0 w-full h-full pointer-events-none z-10" style={{ filter: 'drop-shadow(0 0 8px rgba(99,102,241,0.5))' }}>
                <AnimatePresence>
                    {nodes.map(node => {
                        const targetX = node.x + 225; // center of node approx
                        const targetY = node.y + 100; // middle of node approx
                        const controlX = centerX + (targetX - centerX) / 2;
                        return (
                            <motion.path
                                key={`wire-${node.id}`}
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 0.3 }}
                                exit={{ pathLength: 0, opacity: 0 }}
                                transition={{ duration: 1, ease: "easeInOut" }}
                                d={`M ${centerX} ${centerY} Q ${controlX} ${centerY} ${targetX} ${targetY}`}
                                fill="none"
                                stroke="url(#wireGradient)"
                                strokeWidth="2"
                                strokeDasharray="5,5"
                                className="animate-[dash_30s_linear_infinite]"
                            />
                        );
                    })}
                </AnimatePresence>
                <defs>
                    <linearGradient id="wireGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#22d3ee" />
                        <stop offset="50%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                </defs>
            </svg>
            <style jsx>{`
                @keyframes dash { to { stroke-dashoffset: -1000; } }
            `}</style>

            {/* Top Navigation Bar */}
            <nav className="fixed top-0 w-full z-50 bg-[#09090b]/40 backdrop-blur-2xl border-b border-white/[0.05]">
                <div className="max-w-[1800px] mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/20 transition-all shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                            <Sparkles className="text-indigo-400 w-4 h-4" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white font-display">Gistly<span className="text-indigo-400">.ai</span> <span className="text-[10px] text-zinc-500 uppercase tracking-widest ml-2 bg-white/5 py-1 px-2 rounded-full border border-white/5">Canvas Mode</span></span>
                    </div>

                    <div className="hidden md:flex items-center gap-6 text-sm font-medium">
                        <button onClick={() => setIsGuideOpen(true)} className="text-zinc-400 hover:text-white transition-colors">Guide</button>
                        <button onClick={() => setIsPricingOpen(true)} className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors flex items-center gap-2">
                            <Star className="w-4 h-4 fill-indigo-400/20" /> Pricing
                        </button>
                        <button onClick={() => setIsAboutOpen(true)} className="text-zinc-400 hover:text-white transition-colors">About Us</button>
                        <button onClick={() => setIsContactOpen(true)} className="text-zinc-400 hover:text-white transition-colors">Contact</button>
                        <div className="flex items-center gap-2 text-indigo-400/90 bg-indigo-400/10 px-3 py-1.5 rounded-full border border-indigo-400/20 cursor-default select-none pointer-events-none">
                            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div>
                            <span className="text-xs font-semibold tracking-wide uppercase">Core Online</span>
                        </div>
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-zinc-200 transition-all text-xs">Sign In</button>
                            </SignInButton>
                        </SignedOut>
                        <SignedIn>
                            <UserButton appearance={{ elements: { userButtonAvatarBox: "w-8 h-8" } }} />
                        </SignedIn>
                    </div>
                </div>
            </nav>

            {/* Floating Left Side Dashboard / Tool Dock */}
            <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="fixed left-6 top-24 bottom-6 w-72 bg-[#111113]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-5 flex flex-col z-40 shadow-2xl"
            >
                <div className="mb-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-1 flex items-center gap-2"><LayoutDashboard className="w-4 h-4 text-indigo-400" /> Tool Hub</h2>
                            <p className="text-[10px] text-zinc-500 font-mono tracking-tighter">NODE DEPLOYMENT CORE</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={clearCanvas} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-zinc-500 hover:text-white transition-colors border border-white/5" title="New Canvas"><FilePlus className="w-4 h-4" /></button>
                            <button onClick={fetchHistory} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-zinc-500 hover:text-indigo-400 transition-colors border border-white/5" title="Neural History"><History className="w-4 h-4" /></button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 bg-black/40 border border-white/5 rounded-xl p-2 pl-3">
                        <input
                            value={workflowName}
                            onChange={(e) => setWorkflowName(e.target.value)}
                            className="bg-transparent text-[11px] text-zinc-300 outline-none w-full"
                            placeholder="Architecture Name..."
                        />
                        <button
                            onClick={saveWorkflow}
                            disabled={isSaving || nodes.length === 0}
                            className="p-2 bg-indigo-500 hover:bg-indigo-400 disabled:bg-zinc-800 disabled:text-zinc-600 rounded-lg transition-all"
                        >
                            {isSaving ? <Loader2 className="w-3 h-3 animate-spin text-white" /> : <Save className="w-3 h-3 text-white" />}
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 mb-6 border-b border-white/5 pb-4">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={cn(
                                "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all",
                                selectedCategory === cat
                                    ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                                    : "bg-white/5 text-zinc-500 hover:bg-white/10 hover:text-white border border-transparent"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Tool List */}
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent pr-2 flex flex-col gap-3">
                    {filteredTools.map((tool) => (
                        <div
                            key={tool.id}
                            onClick={() => addNode(tool.id)}
                            className="group bg-black/40 border border-white/5 hover:border-indigo-500/30 p-3 rounded-xl transition-all cursor-pointer flex items-center gap-3 hover:bg-white/[0.02]"
                        >
                            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border", tool.bg, tool.border)}>
                                <tool.icon className={cn("w-5 h-5", tool.color)} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-zinc-200 group-hover:text-indigo-400 transition-colors">{tool.name}</h3>
                                <p className="text-[10px] text-zinc-600 line-clamp-1">{tool.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 pt-4 border-t border-white/5 text-[9px] text-center text-zinc-600 font-mono">
                    System Architecture Ready
                </div>
            </motion.div>

            {/* The Infinite Canvas Content */}
            <div className="absolute inset-0 z-20 pointer-events-none">
                <AnimatePresence>
                    {nodes.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute top-1/2 left-[calc(50%+144px)] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center pointer-events-none"
                        >
                            <div className="w-24 h-24 rounded-full border border-indigo-500/30 flex items-center justify-center p-3 animate-[pulse_4s_ease-in-out_infinite] mb-6 relative">
                                <div className="absolute inset-0 border border-cyan-400/20 rounded-full animate-ping pointer-events-none" style={{ animationDuration: '3s' }}></div>
                                <Sparkles className="w-8 h-8 text-indigo-400 opacity-50" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2 font-display tracking-tight">Infinite Architecture</h2>
                            <p className="text-sm text-zinc-500 max-w-sm">
                                Create an unstructured intelligence pipeline. Select nodes from the Hub on your left to deploy microservices into the workspace.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {nodes.map(node => (
                    <DraggableNode
                        key={node.id}
                        data={node}
                        removeNode={removeNode}
                        updateNodePosition={updateNodePosition}
                    />
                ))}
            </div>

            {/* Guide Modal */}
            <AnimatePresence>
                {isGuideOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="bg-[#111113] border border-white/10 p-8 rounded-3xl max-w-xl w-full shadow-2xl relative"
                        >
                            <button
                                onClick={() => setIsGuideOpen(false)}
                                className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <h3 className="text-2xl font-bold text-white mb-2 tracking-tight font-display">Infinite Canvas Guide</h3>
                            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                                Welcome to the most advanced AI workstation.
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold mt-0.5 border border-indigo-500/30 shrink-0">1</div>
                                    <div>
                                        <h4 className="text-zinc-200 font-semibold text-sm">Deploy Nodes</h4>
                                        <p className="text-zinc-500 text-xs mt-1 leading-relaxed">Click any tool on the left dashboard to spawn a floating neural node into your workspace.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold mt-0.5 border border-indigo-500/30 shrink-0">2</div>
                                    <div>
                                        <h4 className="text-zinc-200 font-semibold text-sm">Arrange & Build</h4>
                                        <p className="text-zinc-500 text-xs mt-1 leading-relaxed">Drag nodes anywhere on the screen. The central AI core will draw neural links to active processes automatically.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold mt-0.5 border border-indigo-500/30 shrink-0">3</div>
                                    <div>
                                        <h4 className="text-zinc-200 font-semibold text-sm">Execute in Parallel</h4>
                                        <p className="text-zinc-500 text-xs mt-1 leading-relaxed">Run multiple tools at the exact same time. The core handles concurrent processing flawlessly.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
                                <button
                                    onClick={() => setIsGuideOpen(false)}
                                    className="px-5 py-2 bg-white text-black text-sm font-bold rounded-xl hover:bg-zinc-200 transition-all active:scale-[0.98]"
                                >
                                    Initialize System
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Neural Uplink (Contact) Modal */}
            <AnimatePresence>
                {isContactOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4"
                    >
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="bg-[#0c0c0e]/90 border border-indigo-500/20 p-0 rounded-3xl max-w-2xl w-full shadow-[0_0_50px_rgba(99,102,241,0.1)] relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500"></div>

                            <button
                                onClick={() => setIsContactOpen(false)}
                                className="absolute top-6 right-6 text-zinc-500 hover:text-indigo-400 transition-colors z-10"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="p-8 md:p-10 relative z-10">
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                                        <Orbit className="w-6 h-6 text-indigo-400 animate-[spin_10s_linear_infinite]" />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-bold text-white tracking-tight font-display flex items-center gap-2">
                                            Neural <span className="text-indigo-400">Uplink</span>
                                        </h3>
                                        <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest mt-1">Direct Secure Transmission</p>
                                    </div>
                                </div>

                                <p className="text-zinc-400 text-sm mt-6 mb-8 leading-relaxed">
                                    Initialize a secure channel to our engineering core. Whether you seek custom integrations, encountered an anomaly, or wish to forge an alliance, our nodes are receptive.
                                </p>

                                <div className="bg-black/50 border border-indigo-500/20 rounded-2xl p-6 mb-8 relative group overflow-hidden">
                                    <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className="bg-indigo-500/20 p-3 rounded-full border border-indigo-500/30">
                                            <Mail className="w-6 h-6 text-indigo-300" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-1">Primary Transmission Endpoint</p>
                                            <a href="mailto:contact@gistly.site" className="text-xl font-mono text-white hover:text-indigo-400 transition-colors font-bold tracking-tighter">
                                                contact<span className="text-indigo-400">@</span>gistly.site
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-widest flex items-center gap-2">
                                    <Database className="w-4 h-4 text-indigo-400" /> Frequently Queried Sectors (FAQ)
                                </h4>

                                <div className="space-y-3">
                                    <div className="bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 transition-colors">
                                        <h5 className="font-bold text-zinc-200 text-sm flex items-center gap-2 mb-2">
                                            <Terminal className="w-4 h-4 text-cyan-400" /> What is the API rate limit?
                                        </h5>
                                        <p className="text-zinc-500 text-xs leading-relaxed">Standard nodes guarantee up to 100 requests per minute. Enterprise compute clusters available upon negotiation.</p>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 transition-colors">
                                        <h5 className="font-bold text-zinc-200 text-sm flex items-center gap-2 mb-2">
                                            <Shield className="w-4 h-4 text-emerald-400" /> Is my data retained?
                                        </h5>
                                        <p className="text-zinc-500 text-xs leading-relaxed">Negative. All transmission protocols are end-to-end encrypted. We employ a strict zero-retention policy natively; data evaporates post-processing.</p>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 transition-colors">
                                        <h5 className="font-bold text-zinc-200 text-sm flex items-center gap-2 mb-2">
                                            <Cpu className="w-4 h-4 text-purple-400" /> Custom AI Model Training?
                                        </h5>
                                        <p className="text-zinc-500 text-xs leading-relaxed">We can partition dedicated architectures for your unique datasets. Reach out to the email above to initialize discussions.</p>
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-end">
                                    <button
                                        onClick={() => setIsContactOpen(false)}
                                        className="px-6 py-2.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/50 text-sm font-bold uppercase tracking-widest rounded-xl hover:bg-indigo-500 hover:text-white transition-all shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                                    >
                                        End Transmission
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* About The Nexus (About Us) Modal */}
            <AnimatePresence>
                {isAboutOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-[#09090b] border border-cyan-500/20 p-0 rounded-3xl max-w-3xl w-full shadow-[0_0_80px_rgba(34,211,238,0.05)] relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                            <button
                                onClick={() => setIsAboutOpen(false)}
                                className="absolute top-6 right-6 text-zinc-500 hover:text-cyan-400 transition-colors z-50 bg-black/50 p-2 rounded-full backdrop-blur-md"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-2 relative z-10">
                                <div className="p-8 md:p-10 border-r border-white/5 bg-white/[0.02] flex flex-col justify-between">
                                    <div>
                                        <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-6">
                                            <Fingerprint className="w-6 h-6 text-cyan-400" />
                                        </div>
                                        <h3 className="text-4xl font-black text-white tracking-tighter font-display leading-none mb-4">
                                            The <br />Architecture <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Of Mind.</span>
                                        </h3>
                                        <p className="text-zinc-400 text-sm leading-relaxed mb-6 border-l-2 border-cyan-500/30 pl-4 py-1 italic">
                                            "We do not just build software. We construct digital cognition tailored to elevate human potential."
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                                            <div className="text-2xl font-bold text-white mb-1">99.9%</div>
                                            <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Uptime Synergy</div>
                                        </div>
                                        <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                                            <div className="text-2xl font-bold text-white mb-1">&lt;15ms</div>
                                            <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Neural Latency</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 md:p-10">
                                    <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-widest flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-cyan-400" /> Genesis Protocol
                                    </h4>

                                    <div className="space-y-6 text-sm text-zinc-300 leading-relaxed">
                                        <p>
                                            <strong className="text-white">Gistly.ai</strong> was forged from a singular directive: to make enterprise-grade artificial intelligence accessible, rapid, and flawlessly integrated into daily workflows.
                                        </p>
                                        <p>
                                            We operate on the bleeding edge of the <span className="text-cyan-400 font-mono">Large Language Frontier</span>. Rather than simple text inputs, we built the world's first true intelligence workstation pipeline.
                                        </p>

                                        <div className="pt-4 mt-4 border-t border-white/10">
                                            <h5 className="font-bold text-zinc-100 mb-3 text-xs uppercase tracking-widest opacity-60">Our Core Directives</h5>
                                            <ul className="space-y-3">
                                                <li className="flex items-start gap-3">
                                                    <div className="w-1.5 h-1.5 mt-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
                                                    <span className="text-zinc-400"><strong className="text-zinc-200">Velocity:</strong> Idea to execution in milliseconds.</span>
                                                </li>
                                                <li className="flex items-start gap-3">
                                                    <div className="w-1.5 h-1.5 mt-2 rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>
                                                    <span className="text-zinc-400"><strong className="text-zinc-200">Integrity:</strong> Uncompromising data privacy and ethical model constraints.</span>
                                                </li>
                                                <li className="flex items-start gap-3">
                                                    <div className="w-1.5 h-1.5 mt-2 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.8)]"></div>
                                                    <span className="text-zinc-400"><strong className="text-zinc-200">Elegance:</strong> Interfaces that feel like extensions of thought.</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />

            {/* Workflow History Modal */}
            <AnimatePresence>
                {isHistoryOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 10 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 10 }}
                            className="bg-[#111113] border border-white/10 p-8 rounded-3xl max-w-md w-full shadow-2xl relative"
                        >
                            <button
                                onClick={() => setIsHistoryOpen(false)}
                                className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <h3 className="text-2xl font-bold text-white mb-2 tracking-tight flex items-center gap-3">
                                <History className="w-6 h-6 text-indigo-400" /> Workflow History
                            </h3>
                            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                                Load previously deployed neural architectures.
                            </p>

                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                {history.length === 0 ? (
                                    <div className="text-center py-10 text-zinc-600 font-mono text-xs">
                                        NO ARCHIVES FOUND
                                    </div>
                                ) : (
                                    history.map((flow) => (
                                        <div
                                            key={flow.id}
                                            onClick={() => loadWorkflow(flow.id)}
                                            className="group bg-white/[0.03] border border-white/5 p-4 rounded-2xl hover:border-indigo-500/30 transition-all cursor-pointer flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover:bg-indigo-500/20">
                                                    <FolderOpen className="w-5 h-5 text-indigo-400" />
                                                </div>
                                                <div>
                                                    <h4 className="text-zinc-200 font-bold text-sm group-hover:text-white transition-colors">{flow.name}</h4>
                                                    <p className="text-[10px] text-zinc-600 font-mono">{new Date(flow.created_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <GistlyVoiceAssistant />
        </div>
    );
}
