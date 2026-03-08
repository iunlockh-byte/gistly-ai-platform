import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LayoutDashboard, Users, CreditCard, MessageSquare, 
    Globe, BarChart3, ShieldCheck, LogOut, Loader2, 
    TrendingUp, Activity, Inbox, UserCircle, Map,
    ChevronRight, ExternalLink, Calendar, X,
    Search, BarChart, PieChart, Radar, Info
} from 'lucide-react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar as RechartsRadar,
    BarChart as RechartsBarChart, Bar, Legend
} from 'recharts';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:8000';

const AdminDashboard = ({ isOpen, onClose }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState(null);
    const [error, setError] = useState('');
    const [activeSection, setActiveSection] = useState('overview');
    
    // Secure Axios Config
    const nexusAxios = axios.create({
        baseURL: API_BASE_URL,
        headers: {
            'X-Nexus-Shield': 'G7-NX-SECURITY-V1-ALPHA'
        }
    });

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const resp = await nexusAxios.post('/api/admin/login', { password });
            if (resp.data.status === 'success') {
                setIsAuthenticated(true);
                fetchStats();
            }
        } catch (err) {
            setError('Access Denied. Incorrect Credential.');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        setLoading(true);
        try {
            const resp = await nexusAxios.get('/api/admin/stats');
            setStats(resp.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // --- Intelligence Analytics Components ---
    const SEOAnalytics = () => {
        const data = [
            { name: 'Mon', organic: 400, social: 240, direct: 240 },
            { name: 'Tue', organic: 300, social: 139, direct: 221 },
            { name: 'Wed', organic: 200, social: 980, direct: 229 },
            { name: 'Thu', organic: 278, social: 390, direct: 200 },
            { name: 'Fri', organic: 189, social: 480, direct: 218 },
            { name: 'Sat', organic: 239, social: 380, direct: 250 },
            { name: 'Sun', organic: 349, social: 430, direct: 210 },
        ];

        const radarData = [
            { subject: 'Indexing', A: 120, B: 110, fullMark: 150 },
            { subject: 'Keywords', A: 98, B: 130, fullMark: 150 },
            { subject: 'Speed', A: 86, B: 130, fullMark: 150 },
            { subject: 'Backlinks', A: 99, B: 100, fullMark: 150 },
            { subject: 'Authority', A: 85, B: 90, fullMark: 150 },
            { subject: 'Reach', A: 65, B: 85, fullMark: 150 },
        ];

        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[#0c0c0e] border border-white/5 rounded-3xl p-6">
                    <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-6">Organic SEO Growth (Last 7 Days)</h4>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorOrganic" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#374151" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px', fontSize: '10px' }} />
                                <Area type="monotone" dataKey="organic" stroke="#6366f1" fillOpacity={1} fill="url(#colorOrganic)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-[#0c0c0e] border border-white/5 rounded-3xl p-6 flex flex-col items-center">
                    <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-6">SEO Health Radar</h4>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                <PolarGrid stroke="#333" />
                                <PolarAngleAxis dataKey="subject" stroke="#666" fontSize={8} />
                                <RechartsRadar name="Current" dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.6} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        );
    };

    const LiveIntelligenceMap = () => (
        <div className="relative bg-[#0c0c0e] border border-white/5 rounded-3xl p-8 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-cyan-500/5 opacity-50"></div>
            <div className="flex justify-between items-center mb-8 relative z-10">
                <h4 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <Globe className="w-4 h-4 text-cyan-400 animate-pulse" /> Live Intelligence Map
                </h4>
                <div className="flex gap-2">
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[8px] font-bold text-emerald-400 uppercase tracking-widest">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div> Live Signals
                    </span>
                </div>
            </div>
            
            {/* Minimalist World Map Simulation */}
            <div className="h-80 w-full relative flex items-center justify-center">
                <svg viewBox="0 0 800 400" className="w-full h-full opacity-20 stroke-white/20 fill-none stroke-[0.5]">
                    {/* Simulated Continents */}
                    <path d="M150 150 Q200 100 250 150 T350 150 T450 100 T550 150" />
                    <path d="M100 250 Q200 300 300 250 T500 250 T700 300" />
                    <circle cx="200" cy="180" r="2" fill="white" className="animate-pulse" />
                    <circle cx="450" cy="120" r="2" fill="white" className="animate-pulse" style={{ animationDelay: '1s' }} />
                    <circle cx="600" cy="220" r="2" fill="white" className="animate-pulse" style={{ animationDelay: '2s' }} />
                </svg>
                
                {/* Floating Signal Indicators */}
                {Object.entries(stats?.countries || {}).map(([country, count], i) => (
                    <motion.div 
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute flex flex-col items-center"
                        style={{ 
                            left: `${20 + (i * 15)}%`, 
                            top: `${30 + (i * 10)}%` 
                        }}
                    >
                        <div className="w-3 h-3 bg-indigo-500 rounded-full animate-ping absolute"></div>
                        <div className="w-2 h-2 bg-indigo-400 rounded-full border border-white/50 relative"></div>
                        <div className="bg-black/80 backdrop-blur-md border border-white/10 px-2 py-1 rounded mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-[8px] font-black text-white uppercase">{country}: {count}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );

    if (!isOpen) return null;

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[2000] bg-[#050505] overflow-y-auto"
        >
            {!isAuthenticated ? (
                /* Login Screen */
                <div className="min-h-screen flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-full max-w-md bg-[#0c0c0e] border border-white/10 rounded-[32px] p-8 text-center"
                    >
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10">
                            <ShieldCheck className="w-8 h-8 text-indigo-400" />
                        </div>
                        <h1 className="text-2xl font-black text-white mb-2 tracking-tighter uppercase">Nexus Terminal</h1>
                        <p className="text-[10px] text-zinc-500 font-bold tracking-[0.3em] uppercase mb-8">Admin Authorization Required</p>
                        
                        <form onSubmit={handleLogin} className="space-y-4">
                            <input 
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="ACCESS KEY"
                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-6 py-4 text-white text-center font-mono tracking-widest outline-none focus:border-indigo-500/50 transition-all shadow-inner"
                                autoFocus
                            />
                            {error && <p className="text-red-500 text-[10px] font-bold uppercase tracking-tight">{error}</p>}
                            <button 
                                disabled={loading}
                                className="w-full py-4 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Decrypt & Enter'}
                            </button>
                        </form>
                        <button onClick={onClose} className="mt-6 text-zinc-500 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors">Abort Mission</button>
                    </motion.div>
                </div>
            ) : (
                /* Main Dashboard View */
                <div className="flex flex-col min-h-screen">
                    {/* Header */}
                    <header className="border-b border-white/5 bg-black/40 backdrop-blur-xl px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-20">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                                <Activity className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-white tracking-widest uppercase italic">Gistly Admin Nexus</h2>
                                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Global Operations Telemetry</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button onClick={fetchStats} className="p-2 text-zinc-400 hover:text-white transition-colors">
                                <TrendingUp className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                            <button onClick={() => setIsAuthenticated(false)} className="px-4 py-2 bg-white/5 hover:bg-red-500/10 hover:text-red-400 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2">
                                <LogOut className="w-3.5 h-3.5" /> Logout
                            </button>
                            <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white bg-white/5 rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </header>

                    <div className="flex-1 flex flex-col md:flex-row">
                        {/* Sidebar */}
                        <aside className="w-full md:w-64 border-r border-white/5 p-4 flex flex-col gap-2 bg-black/20">
                            {[
                                { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                                { id: 'api_forge', label: 'API Forge', icon: CreditCard },
                                { id: 'requests', label: 'Neural Requests', icon: MessageSquare },
                                { id: 'customers', label: 'Users & Contacts', icon: Users },
                                { id: 'analytics', label: 'Global Traffic', icon: Globe },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveSection(item.id)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                                        activeSection === item.id 
                                        ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                                        : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-300'
                                    }`}
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.label}
                                </button>
                            ))}
                        </aside>

                        {/* Content Area */}
                        <main className="flex-1 p-4 md:p-8">
                            <AnimatePresence mode="wait">
                                {activeSection === 'overview' && (
                                    <motion.div 
                                        key="overview"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="space-y-8"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            {[
                                                { label: 'Neural Visitors', val: stats?.total_visitors || 0, icon: Globe, color: 'text-blue-400' },
                                                { label: 'Customer Requests', val: stats?.total_requests || 0, icon: MessageSquare, color: 'text-cyan-400' },
                                                { label: 'Deployed Flows', val: stats?.total_workflows || 0, icon: Inbox, color: 'text-purple-400' },
                                                { label: 'Direct Messages', val: stats?.total_contacts || 0, icon: Inbox, color: 'text-emerald-400' },
                                            ].map((stat, i) => (
                                                <div key={i} className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 shadow-sm hover:border-white/20 transition-all">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                                                            <stat.icon className="w-5 h-5" />
                                                        </div>
                                                        <span className="text-[10px] font-mono text-zinc-600"> telemetry-active </span>
                                                    </div>
                                                    <h3 className="text-3xl font-black text-white mb-1 font-mono">
                                                        {i === 3 ? stats?.total_api_keys || 0 : stat.val}
                                                    </h3>
                                                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</p>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                            {/* Recent Signal Captures */}
                                            <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6">
                                                <h4 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                                                    <Activity className="w-4 h-4 text-cyan-400" /> Recent Neural Requests
                                                </h4>
                                                <div className="space-y-4">
                                                    {stats?.recent_requests?.map((req, i) => (
                                                        <div key={i} className="bg-black/40 border border-white/5 p-4 rounded-xl flex justify-between items-center group hover:border-cyan-500/30 transition-all">
                                                            <div>
                                                                <p className="text-xs font-bold text-white mb-1">{req.name}</p>
                                                                <p className="text-[10px] text-zinc-500 font-mono italic">{req.type}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-[10px] text-zinc-400 mb-1">{req.email}</p>
                                                                <ChevronRight className="w-4 h-4 text-zinc-800 group-hover:text-cyan-400 ml-auto transition-all" />
                                                            </div>
                                                        </div>
                                                    )) || <p className="text-[10px] text-zinc-700 font-mono">WAITING FOR RECEPTION...</p>}
                                                </div>
                                            </div>

                                            {/* SEO & Traffic Heatmap (Simplified) */}
                                            <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6">
                                                <h4 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                                                    <Map className="w-4 h-4 text-orange-400" /> Geospatial Distribution
                                                </h4>
                                                <div className="space-y-3">
                                                    {Object.entries(stats?.countries || {}).slice(0, 6).map(([country, count], i) => (
                                                        <div key={i} className="space-y-1">
                                                            <div className="flex justify-between text-[10px] font-bold">
                                                                <span className="text-zinc-400 uppercase">{country}</span>
                                                                <span className="text-white">{count}</span>
                                                            </div>
                                                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                                                <div 
                                                                    className="h-full bg-indigo-500 rounded-full" 
                                                                    style={{ width: `${Math.min(100, (count / (stats?.total_visitors || 1)) * 100)}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeSection === 'requests' && (
                                    <motion.div key="requests" className="space-y-4">
                                        <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-6">Inbound Neural Signals</h3>
                                        <div className="bg-white/[0.01] border border-white/5 rounded-3xl overflow-hidden">
                                            <table className="w-full text-left font-sans">
                                                <thead className="bg-white/5 border-b border-white/5">
                                                    <tr>
                                                        <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Requester</th>
                                                        <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">System Protocol</th>
                                                        <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Details</th>
                                                        <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Signal Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-xs">
                                                    {stats?.recent_requests?.map((req, i) => (
                                                        <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                                                            <td className="px-6 py-4">
                                                                <p className="font-bold text-white">{req.name}</p>
                                                                <p className="text-[10px] text-zinc-500 italic">{req.email}</p>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className="bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/20 text-[9px] font-bold uppercase">{req.type}</span>
                                                            </td>
                                                            <td className="px-6 py-4 text-zinc-400 max-w-md truncate">
                                                                {req.details}
                                                            </td>
                                                            <td className="px-6 py-4 text-zinc-600 font-mono text-[9px]">
                                                                {new Date(req.created_at).toLocaleString()}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </motion.div>
                                )}

                                {activeSection === 'customers' && (
                                    <motion.div key="customers" className="space-y-4">
                                        <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-6">User Profiles Registry</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                            <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-xl">
                                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Active Subscribers</p>
                                                <p className="text-2xl font-black text-emerald-400">Captured: {stats?.total_requests || 0}</p>
                                            </div>
                                            <div className="bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-xl">
                                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Neural Contacts</p>
                                                <p className="text-2xl font-black text-indigo-400">Captured: {stats?.total_contacts || 0}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-white/[0.01] border border-white/5 rounded-3xl overflow-hidden">
                                            <table className="w-full text-left font-sans">
                                                <thead className="bg-white/5 border-b border-white/5">
                                                    <tr>
                                                        <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Profile</th>
                                                        <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Contact Signal</th>
                                                        <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-xs">
                                                    {stats?.recent_requests?.map((req, i) => (
                                                        <tr key={i} className="hover:bg-white/[0.02]">
                                                            <td className="px-6 py-4 flex items-center gap-3">
                                                                <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center text-[10px] font-bold text-zinc-400 border border-white/5">
                                                                    {req.name[0]}
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-white">{req.name}</p>
                                                                    <p className="text-[10px] text-zinc-600">ID: USER_{req.id?.slice(0, 8)}</p>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 text-zinc-400">{req.email}</td>
                                                            <td className="px-6 py-4">
                                                                <span className="text-emerald-400 text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                                                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> Active Lead
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </motion.div>
                                )}

                                {activeSection === 'analytics' && (
                                    <motion.div key="analytics" className="space-y-8">
                                        <div className="flex justify-between items-end mb-6">
                                            <div>
                                                <h3 className="text-xl font-black text-white uppercase tracking-tighter">Global Intelligence Telemetry</h3>
                                                <p className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase mt-1">Real-time Visitor Distribution & SEO Health</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-3xl font-black text-indigo-400 leading-none">{stats?.total_visitors || 0}</p>
                                                <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1 tracking-widest">Global Sessions</p>
                                            </div>
                                        </div>

                                        <LiveIntelligenceMap />

                                        <SEOAnalytics />

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="bg-[#0c0c0e] border border-white/5 rounded-3xl p-6">
                                                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-6">Traffic Vector breakdown</p>
                                                <div className="space-y-5">
                                                    {[
                                                        { label: 'Neural Organic (SEO)', val: '42%', color: 'text-indigo-400' },
                                                        { label: 'Direct Transmission', val: '38%', color: 'text-white' },
                                                        { label: 'Social Echoes', val: '20%', color: 'text-emerald-400' },
                                                    ].map((item, i) => (
                                                        <div key={i} className="flex justify-between items-center border-b border-white/5 pb-3">
                                                            <span className="text-[10px] font-bold text-zinc-500 uppercase">{item.label}</span>
                                                            <span className={cn("text-xs font-black font-mono", item.color)}>{item.val}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="md:col-span-2 bg-[#0c0c0e] border border-white/5 rounded-3xl p-6">
                                                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-6">Geographic Node Capture</p>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                                    {Object.entries(stats?.countries || {}).map(([c, count], i) => (
                                                        <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all">
                                                            <p className="text-2xl font-black text-white mb-1">{count}</p>
                                                            <p className="text-[8px] text-zinc-500 font-black uppercase truncate tracking-tighter">{c}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeSection === 'api_forge' && (
                                    <motion.div key="api_forge" className="space-y-8">
                                        <div className="flex justify-between items-center mb-8">
                                            <div>
                                                <h3 className="text-xl font-black text-white uppercase tracking-tighter">API Forge Telemetry</h3>
                                                <p className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase mt-1">Marketplace & Revenue Metrics</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-xl text-center">
                                                    <p className="text-sm font-black text-indigo-400 font-mono tracking-tighter">$2,450.00</p>
                                                    <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest">Est. Revenue</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                            <div className="lg:col-span-2 bg-white/[0.01] border border-white/5 rounded-3xl overflow-hidden font-sans">
                                                <table className="w-full text-left">
                                                    <thead className="bg-white/5 border-b border-white/5">
                                                        <tr>
                                                            <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Client Path</th>
                                                            <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Plan Node</th>
                                                            <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Neural Balance</th>
                                                            <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="text-xs text-zinc-400">
                                                        <tr className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                                                            <td className="px-6 py-4">
                                                                <p className="font-bold text-white uppercase tracking-tighter">dev.nexus.ai</p>
                                                                <p className="text-[9px] text-zinc-500">keys: gst_4f21...9a01</p>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded text-[9px] font-black uppercase">Enterprise</span>
                                                            </td>
                                                            <td className="px-6 py-4 font-mono text-zinc-300">45,102</td>
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase text-[9px]">
                                                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> Active
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
                                                    <h4 className="text-[11px] font-black text-white uppercase tracking-widest mb-4">Neural Distribution</h4>
                                                    <div className="space-y-4">
                                                        {[
                                                            { label: 'Starter', val: 12, color: 'bg-zinc-500' },
                                                            { label: 'PRO Architect', val: 4, color: 'bg-indigo-500' },
                                                            { label: 'Enterprise', val: 2, color: 'bg-cyan-500' },
                                                        ].map((item, i) => (
                                                            <div key={i} className="space-y-1.5">
                                                                <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest">
                                                                    <span className="text-zinc-500">{item.label}</span>
                                                                    <span className="text-white">{item.val} keys</span>
                                                                </div>
                                                                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                                                    <div className={`h-full ${item.color}`} style={{ width: `${(item.val / 18) * 100}%` }}></div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </main>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default AdminDashboard;
