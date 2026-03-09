import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';

import {
    FileText, Code, Image as ImageIcon, Video, UserCheck,
    Terminal, FileSearch, RefreshCw, FileCode, Search, Headphones,
    FileCheck, FileJson, Share2, Database, LayoutDashboard,
    Sparkles, Zap, ChevronRight, Github, ExternalLink, Menu, X, ArrowLeft, Send, Loader2,
    Lock, Wand2, Calculator, Settings, Globe, Volume2, Copy, Play, Mail, Cpu, Orbit, Fingerprint, Shield, MessageSquare, Maximize2, Move,
    Mic, MicOff, Bot, Check, CreditCard, Star, History, Save, FilePlus, FolderOpen, Radio, Download,
    Cloud, Sun, Droplets, CloudRain, TrendingUp, MapPin, Clock, Calendar
} from 'lucide-react';
import axios from 'axios';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import Marquee from 'react-fast-marquee';
import NewsPanel from './NewsPanel';
import LaunchCountdown from './components/LaunchCountdown';
import AdminDashboard from './components/AdminDashboard';
import CustomerRequestModal from './components/CustomerRequestModal';
import APIForgeModal from './components/APIForgeModal';
import { Link } from 'react-router-dom';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Secure Axios Config
const nexusAxios = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'X-Nexus-Shield': 'G7-NX-SECURITY-V1-ALPHA' // Cryptographic Origin Token
    }
});

const LANGUAGES = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'si', label: 'සිංහල', flag: '🇱🇰' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'pt', label: 'Português', flag: '🇧🇷' },
    { code: 'it', label: 'Italiano', flag: '🇮🇹' },
    { code: 'nl', label: 'Nederlands', flag: '🇳🇱' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'uk', label: 'Українська', flag: '🇺🇦' },
    { code: 'zh', label: '中文', flag: '🇨🇳' },
    { code: 'ja', label: '日本語', flag: '🇯🇵' },
    { code: 'ko', label: '한국어', flag: '🇰🇷' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
    { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
    { code: 'ta', label: 'தமிழ்', flag: '🇮🇳' },
    { code: 'bn', label: 'বাংলা', flag: '🇧🇩' },
    { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
    { code: 'ms', label: 'Bahasa Melayu', flag: '🇲🇾' },
    { code: 'th', label: 'ภาษาไทย', flag: '🇹🇭' },
    { code: 'pl', label: 'Polski', flag: '🇵🇱' },
    { code: 'sv', label: 'Svenska', flag: '🇸🇪' },
];

const translations = {
    en: { toolHub: "Tool Hub", nodeDeployment: "NODE DEPLOYMENT CORE", searchNodes: "Search nodes...", all: "ALL", text: "TEXT", image: "IMAGE", templates: "TEMPLATES", guide: "Guide", pricing: "Pricing", about: "About Us", contact: "Contact", share: "Share", canvasMode: "Canvas Mode", coreOnline: "Core Online", history: "History", news: "News", signIn: "Sign In", tools: "Tools", newCanvas: "New Canvas", saveWorkflow: "Save", architectureName: "Architecture Name...", apiForge: "API Forge", monetize: "Monetize Intelligence", requestFeature: "Request Feature", buildTogether: "Build Together", terms: "Terms", privacy: "Privacy", refund: "Refund", liveNews: "Live News", temporalSync: "Temporal Sync", marketIntelligence: "Market Intelligence", regionalPriority: "Regional Priority", positioning: "Positioning...", synchronizing: "Synchronizing Assets..." },
    si: { toolHub: "මෙවලම් මධ්‍යස්ථානය", nodeDeployment: "පද්ධති ඒකකය", searchNodes: "සොයන්න...", all: "සියල්ල", text: "පෙළ", image: "ඡායාරූප", templates: "ආකෘති", guide: "මඟපෙන්වීම", pricing: "මිල", about: "අප ගැන", contact: "සම්බන්ධ", share: "බෙදාගන්න", canvasMode: "කැන්වස්", coreOnline: "සක්‍රීයයි", history: "ඉතිහාසය", news: "පුවත්", signIn: "ඇතුළු වන්න", tools: "මෙවලම්", newCanvas: "නව", saveWorkflow: "සුරකින්න", architectureName: "නම...", apiForge: "API වෙළඳපොළ", monetize: "අලෙවි කරන්න", requestFeature: "ඉල්ලීම", buildTogether: "එක්ව ගොඩනගමු", terms: "කොන්දේසි", privacy: "පෞද්ගලිකත්වය", refund: "මුදල් ආපසු", liveNews: "සජීවී පුවත්", temporalSync: "කාලසටහන", marketIntelligence: "වෙළඳපොළ තත්ත්වය", regionalPriority: "ප්‍රාදේශීය පුවත්", positioning: "ස්ථානය සොයමින්...", synchronizing: "දත්ත යාවත්කාලීන කරමින්..." },
    es: { toolHub: "Centro de Herramientas", nodeDeployment: "NÚCLEO DE DESPLIEGUE", searchNodes: "Buscar nodos...", all: "TODO", text: "TEXTO", image: "IMAGEN", templates: "PLANTILLAS", guide: "Guía", pricing: "Precios", about: "Nosotros", contact: "Contacto", share: "Compartir", canvasMode: "Modo Canvas", coreOnline: "Núcleo Online", history: "Historial", news: "Noticias", signIn: "Iniciar Sesión", tools: "Herramientas", newCanvas: "Nuevo", saveWorkflow: "Guardar", architectureName: "Nombre...", apiForge: "API Forge", monetize: "Monetizar", requestFeature: "Solicitar", buildTogether: "Construir Juntos", terms: "Términos", privacy: "Privacidad", refund: "Reembolso", liveNews: "Noticias en Vivo" },
    fr: { toolHub: "Centre d'Outils", nodeDeployment: "CŒUR DE DÉPLOIEMENT", searchNodes: "Rechercher...", all: "TOUT", text: "TEXTE", image: "IMAGE", templates: "MODÈLES", guide: "Guide", pricing: "Tarifs", about: "À Propos", contact: "Contact", share: "Partager", canvasMode: "Mode Canvas", coreOnline: "Noyau En Ligne", history: "Historique", news: "Actualités", signIn: "Connexion", tools: "Outils", newCanvas: "Nouveau", saveWorkflow: "Sauver", architectureName: "Nom...", apiForge: "API Forge", monetize: "Monétiser", requestFeature: "Demander", buildTogether: "Construire Ensemble", terms: "Conditions", privacy: "Confidentialité", refund: "Remboursement", liveNews: "Actualités Live" },
    de: { toolHub: "Werkzeug-Hub", nodeDeployment: "KERN-BEREITSTELLUNG", searchNodes: "Suchen...", all: "ALLE", text: "TEXT", image: "BILD", templates: "VORLAGEN", guide: "Anleitung", pricing: "Preise", about: "Über Uns", contact: "Kontakt", share: "Teilen", canvasMode: "Canvas-Modus", coreOnline: "Kern Online", history: "Verlauf", news: "Nachrichten", signIn: "Anmelden", tools: "Werkzeuge", newCanvas: "Neu", saveWorkflow: "Speichern", architectureName: "Name...", apiForge: "API Forge", monetize: "Monetarisieren", requestFeature: "Anfragen", buildTogether: "Gemeinsam Bauen", terms: "Bedingungen", privacy: "Datenschutz", refund: "Erstattung", liveNews: "Live-Nachrichten" },
    pt: { toolHub: "Hub de Ferramentas", nodeDeployment: "NÚCLEO DE IMPLANTAÇÃO", searchNodes: "Buscar...", all: "TODOS", text: "TEXTO", image: "IMAGEM", templates: "MODELOS", guide: "Guia", pricing: "Preços", about: "Sobre Nós", contact: "Contato", share: "Compartilhar", canvasMode: "Modo Canvas", coreOnline: "Núcleo Online", history: "Histórico", news: "Notícias", signIn: "Entrar", tools: "Ferramentas", newCanvas: "Novo", saveWorkflow: "Salvar", architectureName: "Nome...", apiForge: "API Forge", monetize: "Monetizar", requestFeature: "Solicitar", buildTogether: "Construir Juntos", terms: "Termos", privacy: "Privacidade", refund: "Reembolso", liveNews: "Notícias ao Vivo" },
    it: { toolHub: "Hub degli Strumenti", nodeDeployment: "NUCLEO DI DEPLOYMENT", searchNodes: "Cerca...", all: "TUTTI", text: "TESTO", image: "IMMAGINE", templates: "MODELLI", guide: "Guida", pricing: "Prezzi", about: "Chi Siamo", contact: "Contatto", share: "Condividi", canvasMode: "Modalità Canvas", coreOnline: "Core Online", history: "Cronologia", news: "Notizie", signIn: "Accedi", tools: "Strumenti", newCanvas: "Nuovo", saveWorkflow: "Salva", architectureName: "Nome...", apiForge: "API Forge", monetize: "Monetizzare", requestFeature: "Richiedi", buildTogether: "Costruire Insieme", terms: "Termini", privacy: "Privacy", refund: "Rimborso", liveNews: "Notizie Live" },
    nl: { toolHub: "Tool Hub", nodeDeployment: "KERN-IMPLEMENTATIE", searchNodes: "Zoeken...", all: "ALLE", text: "TEKST", image: "AFBEELDING", templates: "SJABLONEN", guide: "Gids", pricing: "Prijzen", about: "Over Ons", contact: "Contact", share: "Delen", canvasMode: "Canvas Modus", coreOnline: "Kern Online", history: "Geschiedenis", news: "Nieuws", signIn: "Aanmelden", tools: "Gereedschappen", newCanvas: "Nieuw", saveWorkflow: "Opslaan", architectureName: "Naam...", apiForge: "API Forge", monetize: "Monetariseren", requestFeature: "Aanvragen", buildTogether: "Samen Bouwen", terms: "Voorwaarden", privacy: "Privacy", refund: "Terugbetaling", liveNews: "Live Nieuws" },
    ru: { toolHub: "Центр инструментов", nodeDeployment: "ЯДРО РАЗВЕРТЫВАНИЯ", searchNodes: "Поиск...", all: "ВСЕ", text: "ТЕКСТ", image: "ИЗОБРАЖЕНИЕ", templates: "ШАБЛОНЫ", guide: "Руководство", pricing: "Цены", about: "О нас", contact: "Контакт", share: "Поделиться", canvasMode: "Режим холста", coreOnline: "Ядро онлайн", history: "История", news: "Новости", signIn: "Войти", tools: "Инструменты", newCanvas: "Новый", saveWorkflow: "Сохранить", architectureName: "Название...", apiForge: "API Forge", monetize: "Монетизировать", requestFeature: "Запросить", buildTogether: "Строить вместе", terms: "Условия", privacy: "Конфиденциальность", refund: "Возврат", liveNews: "Прямые новости" },
    uk: { toolHub: "Центр інструментів", nodeDeployment: "ЯДРО РОЗГОРТАННЯ", searchNodes: "Пошук...", all: "ВСІ", text: "ТЕКСТ", image: "ЗОБРАЖЕННЯ", templates: "ШАБЛОНИ", guide: "Посібник", pricing: "Ціни", about: "Про нас", contact: "Контакт", share: "Поділитися", canvasMode: "Режим полотна", coreOnline: "Ядро онлайн", history: "Історія", news: "Новини", signIn: "Увійти", tools: "Інструменти", newCanvas: "Новий", saveWorkflow: "Зберегти", architectureName: "Назва...", apiForge: "API Forge", monetize: "Монетизувати", requestFeature: "Запит", buildTogether: "Будувати разом", terms: "Умови", privacy: "Конфіденційність", refund: "Повернення", liveNews: "Прямі новини" },
    zh: { toolHub: "工具中心", nodeDeployment: "核心部署", searchNodes: "搜索节点...", all: "全部", text: "文本", image: "图像", templates: "模板", guide: "指南", pricing: "价格", about: "关于我们", contact: "联系", share: "分享", canvasMode: "画布模式", coreOnline: "核心在线", history: "历史", news: "新闻", signIn: "登录", tools: "工具", newCanvas: "新建", saveWorkflow: "保存", architectureName: "名称...", apiForge: "API 市场", monetize: "变现", requestFeature: "请求功能", buildTogether: "共同构建", terms: "条款", privacy: "隐私", refund: "退款", liveNews: "实时新闻" },
    ja: { toolHub: "ツールハブ", nodeDeployment: "コアデプロイメント", searchNodes: "検索...", all: "すべて", text: "テキスト", image: "画像", templates: "テンプレート", guide: "ガイド", pricing: "料金", about: "私たちについて", contact: "お問い合わせ", share: "共有", canvasMode: "キャンバスモード", coreOnline: "コアオンライン", history: "履歴", news: "ニュース", signIn: "サインイン", tools: "ツール", newCanvas: "新規", saveWorkflow: "保存", architectureName: "名前...", apiForge: "APIマーケット", monetize: "収益化", requestFeature: "リクエスト", buildTogether: "共に作る", terms: "規約", privacy: "プライバシー", refund: "返金", liveNews: "ライブニュース" },
    ko: { toolHub: "도구 허브", nodeDeployment: "핵심 배포", searchNodes: "검색...", all: "전체", text: "텍스트", image: "이미지", templates: "템플릿", guide: "가이드", pricing: "가격", about: "소개", contact: "연락처", share: "공유", canvasMode: "캔버스 모드", coreOnline: "코어 온라인", history: "기록", news: "뉴스", signIn: "로그인", tools: "도구", newCanvas: "새로 만들기", saveWorkflow: "저장", architectureName: "이름...", apiForge: "API 마켓", monetize: "수익화", requestFeature: "요청", buildTogether: "함께 만들기", terms: "약관", privacy: "개인정보", refund: "환불", liveNews: "실시간 뉴스" },
    ar: { toolHub: "مركز الأدوات", nodeDeployment: "نواة النشر", searchNodes: "بحث...", all: "الكل", text: "نص", image: "صورة", templates: "قوالب", guide: "دليل", pricing: "الأسعار", about: "من نحن", contact: "اتصل", share: "مشاركة", canvasMode: "وضع اللوحة", coreOnline: "النواة متصلة", history: "التاريخ", news: "أخبار", signIn: "تسجيل الدخول", tools: "الأدوات", newCanvas: "جديد", saveWorkflow: "حفظ", architectureName: "الاسم...", apiForge: "سوق API", monetize: "تحقيق الربح", requestFeature: "طلب", buildTogether: "بناء معاً", terms: "الشروط", privacy: "الخصوصية", refund: "استرداد", liveNews: "أخبار مباشرة" },
    hi: { toolHub: "टूल हब", nodeDeployment: "कोर तैनाती", searchNodes: "खोजें...", all: "सभी", text: "टेक्स्ट", image: "इमेज", templates: "टेम्पलेट", guide: "गाइड", pricing: "मूल्य निर्धारण", about: "हमारे बारे में", contact: "संपर्क", share: "शेयर करें", canvasMode: "कैनवास मोड", coreOnline: "कोर ऑनलाइन", history: "इतिहास", news: "समाचार", signIn: "साइन इन", tools: "उपकरण", newCanvas: "नया", saveWorkflow: "सहेजें", architectureName: "नाम...", apiForge: "API बाजार", monetize: "मुद्रीकृत करें", requestFeature: "अनुरोध", buildTogether: "साथ बनाएं", terms: "शर्तें", privacy: "गोपनीयता", refund: "वापसी", liveNews: "लाइव समाचार" },
    ta: { toolHub: "கருவி மையம்", nodeDeployment: "முக்கிய பயன்படுத்தல்", searchNodes: "தேடு...", all: "அனைத்தும்", text: "உரை", image: "படம்", templates: "வார்ப்புருக்கள்", guide: "வழிகாட்டி", pricing: "விலை", about: "எங்களைப் பற்றி", contact: "தொடர்பு", share: "பகிர்", canvasMode: "கேன்வாஸ் பயன்முறை", coreOnline: "மையம் இயங்குகிறது", history: "வரலாறு", news: "செய்திகள்", signIn: "உள்நுழை", tools: "கருவிகள்", newCanvas: "புதியது", saveWorkflow: "சேமி", architectureName: "பெயர்...", apiForge: "API சந்தை", monetize: "வருவாய் ஈட்டு", requestFeature: "கோரிக்கை", buildTogether: "சேர்ந்து கட்டு", terms: "விதிமுறைகள்", privacy: "தனியுரிமை", refund: "பணம் திரும்ப", liveNews: "நேரடி செய்திகள்" },
    bn: { toolHub: "টুল হাব", nodeDeployment: "কোর ডিপ্লয়মেন্ট", searchNodes: "অনুসন্ধান...", all: "সব", text: "টেক্সট", image: "ছবি", templates: "টেমপ্লেট", guide: "গাইড", pricing: "মূল্য", about: "আমাদের সম্পর্কে", contact: "যোগাযোগ", share: "শেয়ার", canvasMode: "ক্যানভাস মোড", coreOnline: "কোর অনলাইন", history: "ইতিহাস", news: "সংবাদ", signIn: "সাইন ইন", tools: "সরঞ্জাম", newCanvas: "নতুন", saveWorkflow: "সংরক্ষণ", architectureName: "নাম...", apiForge: "API বাজার", monetize: "মুদ্রীকরণ", requestFeature: "অনুরোধ", buildTogether: "একসাথে তৈরি", terms: "শর্তাবলী", privacy: "গোপনীয়তা", refund: "ফেরত", liveNews: "লাইভ সংবাদ" },
    tr: { toolHub: "Araç Merkezi", nodeDeployment: "ÇEKİRDEK DAĞITIM", searchNodes: "Ara...", all: "TÜMÜ", text: "METİN", image: "GÖRSEL", templates: "ŞABLONLAR", guide: "Kılavuz", pricing: "Fiyatlar", about: "Hakkımızda", contact: "İletişim", share: "Paylaş", canvasMode: "Kanvas Modu", coreOnline: "Çekirdek Çevrimiçi", history: "Geçmiş", news: "Haberler", signIn: "Giriş Yap", tools: "Araçlar", newCanvas: "Yeni", saveWorkflow: "Kaydet", architectureName: "İsim...", apiForge: "API Pazarı", monetize: "Monetize Et", requestFeature: "İstek", buildTogether: "Birlikte İnşa Et", terms: "Şartlar", privacy: "Gizlilik", refund: "İade", liveNews: "Canlı Haberler" },
    ms: { toolHub: "Pusat Alat", nodeDeployment: "TERAS PENEMPATAN", searchNodes: "Cari...", all: "SEMUA", text: "TEKS", image: "GAMBAR", templates: "TEMPLAT", guide: "Panduan", pricing: "Harga", about: "Tentang Kami", contact: "Hubungi", share: "Kongsi", canvasMode: "Mod Kanvas", coreOnline: "Teras Dalam Talian", history: "Sejarah", news: "Berita", signIn: "Log Masuk", tools: "Alat", newCanvas: "Baru", saveWorkflow: "Simpan", architectureName: "Nama...", apiForge: "Pasaran API", monetize: "Jana Pendapatan", requestFeature: "Permintaan", buildTogether: "Bina Bersama", terms: "Terma", privacy: "Privasi", refund: "Bayaran Balik", liveNews: "Berita Langsung" },
    th: { toolHub: "ศูนย์เครื่องมือ", nodeDeployment: "แกนกลางการปรับใช้", searchNodes: "ค้นหา...", all: "ทั้งหมด", text: "ข้อความ", image: "รูปภาพ", templates: "เทมเพลต", guide: "คู่มือ", pricing: "ราคา", about: "เกี่ยวกับเรา", contact: "ติดต่อ", share: "แชร์", canvasMode: "โหมดแคนวาส", coreOnline: "แกนกลางออนไลน์", history: "ประวัติ", news: "ข่าว", signIn: "เข้าสู่ระบบ", tools: "เครื่องมือ", newCanvas: "ใหม่", saveWorkflow: "บันทึก", architectureName: "ชื่อ...", apiForge: "ตลาด API", monetize: "สร้างรายได้", requestFeature: "ขอฟีเจอร์", buildTogether: "สร้างร่วมกัน", terms: "ข้อกำหนด", privacy: "ความเป็นส่วนตัว", refund: "คืนเงิน", liveNews: "ข่าวสด" },
    pl: { toolHub: "Centrum Narzędzi", nodeDeployment: "RDZEŃ WDROŻENIA", searchNodes: "Szukaj...", all: "WSZYSTKIE", text: "TEKST", image: "OBRAZ", templates: "SZABLONY", guide: "Przewodnik", pricing: "Cennik", about: "O Nas", contact: "Kontakt", share: "Udostępnij", canvasMode: "Tryb Płótna", coreOnline: "Rdzeń Online", history: "Historia", news: "Wiadomości", signIn: "Zaloguj się", tools: "Narzędzia", newCanvas: "Nowy", saveWorkflow: "Zapisz", architectureName: "Nazwa...", apiForge: "Rynek API", monetize: "Monetyzacja", requestFeature: "Prośba", buildTogether: "Budujmy Razem", terms: "Warunki", privacy: "Prywatność", refund: "Zwrot", liveNews: "Wiadomości na żywo" },
    sv: { toolHub: "Verktygshub", nodeDeployment: "KÄRNDISTRIBUTION", searchNodes: "Sök...", all: "ALLA", text: "TEXT", image: "BILD", templates: "MALLAR", guide: "Guide", pricing: "Priser", about: "Om Oss", contact: "Kontakt", share: "Dela", canvasMode: "Canvasläge", coreOnline: "Kärna Online", history: "Historik", news: "Nyheter", signIn: "Logga in", tools: "Verktyg", newCanvas: "Ny", saveWorkflow: "Spara", architectureName: "Namn...", apiForge: "API Marknad", monetize: "Monetarisera", requestFeature: "Begäran", buildTogether: "Bygga Tillsammans", terms: "Villkor", privacy: "Integritet", refund: "Återbetalning", liveNews: "Live Nyheter" },
};

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
        id: 'voice-clone',
        endpoint: '/api/voice-clone',
        name: 'Neural Voice Clone',
        description: 'Generate hyper-realistic voice clones from text (Nexus Aegis Powered).',
        icon: Mic,
        color: 'text-rose-400',
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/20',
        category: 'Creative',
        placeholder: 'Enter text to clone into premium neural voice...',
        buttonText: 'Initialize Cloning',
        isAudio: true
    },
    {
        id: 'voice-assistant',
        endpoint: '/api/voice-assistant',
        name: 'Nexus Voice Assistant',
        description: 'Conversational AI that speaks and listens in real-time.',
        icon: Headphones,
        color: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/20',
        category: 'Creative',
        placeholder: 'Ask the Nexus Assistant anything via text or voice...',
        buttonText: 'Initiate Interaction',
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

const categories = ['All', 'Content', 'Development', 'Creative', 'Data', 'Business', 'Career'];

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
    const [selectedLang, setSelectedLang] = useState('en-US');

    const speak = (msg, base64Audio = null) => {
        if (base64Audio) {
            const audioData = `data:audio/mp3;base64,${base64Audio}`;
            const audio = new Audio(audioData);
            audio.onplay = () => setIsSpeaking(true);
            audio.onended = () => setIsSpeaking(false);
            audio.play().catch(e => console.error("Audio Playback Error:", e));
            return;
        }

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
        recognition.lang = selectedLang;
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            setIsListening(true);
            setTranscript("Listening...");
        };

        recognition.onresult = async (event) => {
            const current = event.resultIndex;
            const text = event.results[current][0].transcript;
            setTranscript(text);
            setIsListening(false);

            // Gistly Neural Core Integration
            try {
                setTranscript("Processing...");
                const response = await nexusAxios.post('/api/voice-assistant', {
                    content: text
                });
                
                const { result, text_response } = response.data;
                setTranscript(text_response);
                speak(text_response, result);
            } catch (error) {
                console.error("Neural Core Error:", error);
                speak("I'm sorry, I'm having trouble connecting to my neural core right now.");
                setTranscript("Connection Lost.");
            }
        };

        recognition.onerror = () => {
            setIsListening(false);
            setTranscript("Error occurred.");
        };

        recognition.start();
    };

    return (
        <div className="fixed bottom-28 md:bottom-8 right-6 md:right-8 z-[100] flex flex-col items-end">
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
                            <div className="flex justify-center gap-2 mt-4 pt-4 border-t border-white/5">
                                <button
                                    onClick={() => setSelectedLang('en-US')}
                                    className={cn(
                                        "text-[9px] font-black tracking-widest px-3 py-1 rounded-full transition-all",
                                        selectedLang === 'en-US' ? "bg-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.5)]" : "bg-white/5 text-zinc-500 hover:text-zinc-300"
                                    )}
                                >
                                    EN-US
                                </button>
                                <button
                                    onClick={() => setSelectedLang('si-LK')}
                                    className={cn(
                                        "text-[9px] font-black tracking-widest px-3 py-1 rounded-full transition-all",
                                        selectedLang === 'si-LK' ? "bg-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.5)]" : "bg-white/5 text-zinc-500 hover:text-zinc-300"
                                    )}
                                >
                                    SI-LK
                                </button>
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
            price_id: "1367798", // Pro Architect Lemon Squeezy Variant ID
            desc: "The professional standard",
            features: ["Unlimited Neural Ops", "Priority GPU Access", "Gistly Voice AI", "Advanced Debugger", "Early Beta Access"],
            button: "Upgrade to Pro",
            popular: true,
            color: "border-indigo-500/40 bg-indigo-500/10 shadow-[0_0_40px_rgba(99,102,241,0.1)]",
            textColor: "text-white"
        },
        {
            name: "Nexus Aegis Security",
            price: "$149",
            period: "/mo",
            price_id: "sec_aegis_001",
            desc: "Security as a Service",
            features: ["Anti-Debugging Core", "Request Origin Verification", "Neural Encryption Layer", "Traffic Telemetry", "24/7 Threat Monitoring"],
            button: "Deploy Shield",
            color: "border-cyan-500/30 bg-cyan-500/5",
            textColor: "text-white"
        }
    ];

    const [isLoading, setIsLoading] = useState(null);

    const handleCheckout = async (priceId, provider, planName, planPrice) => {
        setIsLoading(planName);
        try {
            if (provider === 'lemonsqueezy') {
                const response = await nexusAxios.post('/api/create-checkout-session', {
                    variant_id: priceId
                });
                if (response.data.url) {
                    window.location.href = response.data.url;
                }
            } else if (provider === 'paypal') {
                const response = await nexusAxios.post('/api/paypal/create-order', {
                    plan_name: planName,
                    price: planPrice
                });
                if (response.data.url) {
                    window.location.href = response.data.url;
                }
            }
        } catch (error) {
            console.error("Checkout Error:", error);
            alert("Failed to initialize payment gateway. Please make sure payment credentials are setup in the backend.");
        } finally {
            setIsLoading(null);
        }
    };

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
                        className="bg-[#09090b] border border-white/10 rounded-[32px] p-6 md:p-10 max-w-4xl w-full relative shadow-3xl max-h-[90vh] overflow-y-auto"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors z-[210]"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="text-center mb-8">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">Expand Your Intelligence</h2>
                            <p className="text-zinc-500 max-w-lg mx-auto text-sm leading-relaxed">
                                Choose the neural bandwidth that fits your evolution. No limits, just pure execution.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {plans.map((plan, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -5 }}
                                    className={cn(
                                        "relative border p-6 rounded-3xl flex flex-col transition-all",
                                        plan.color
                                    )}
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                                            Most Popular
                                        </div>
                                    )}

                                    <div className="mb-6">
                                        <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-black text-white">{plan.price}</span>
                                            {plan.period && <span className="text-zinc-500 font-medium text-xs">{plan.period}</span>}
                                        </div>
                                        <p className="text-zinc-500 text-xs mt-2">{plan.desc}</p>
                                    </div>

                                    <div className="space-y-3 mb-6 flex-1">
                                        {plan.features.map((feat, j) => (
                                            <div key={j} className="flex items-start gap-2 text-xs">
                                                <div className="mt-0.5 flex-shrink-0 w-3.5 h-3.5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                                    <Check className="w-2 h-2 text-emerald-400" />
                                                </div>
                                                <span className="text-zinc-400 font-medium">{feat}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-auto">
                                        {plan.price !== "$0" && plan.price !== "$99" ? (
                                            <div className="flex flex-col gap-3 w-full">
                                                <button
                                                    disabled={isLoading === plan.name}
                                                    onClick={() => handleCheckout(plan.price_id, 'lemonsqueezy', plan.name, plan.price)}
                                                    className={cn(
                                                        "w-full py-2.5 rounded-xl font-bold text-xs transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2",
                                                        plan.popular
                                                            ? "bg-indigo-500 text-white hover:bg-indigo-400 shadow-indigo-500/25"
                                                            : "bg-white/5 text-zinc-300 hover:bg-white/10"
                                                    )}
                                                >
                                                    {isLoading === plan.name ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                                    {isLoading === plan.name ? "Connecting..." : "Pay via Card"}
                                                </button>
                                                <button
                                                    disabled={isLoading === plan.name}
                                                    onClick={() => handleCheckout(plan.price_id, 'paypal', plan.name, plan.price)}
                                                    className={cn(
                                                        "w-full py-2.5 rounded-xl font-bold text-xs transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 border",
                                                        plan.popular
                                                            ? "bg-[#0070ba] hover:bg-[#005ea6] text-white border-[#0070ba]"
                                                            : "bg-transparent border-[#0070ba] text-[#0070ba] hover:bg-[#0070ba]/10"
                                                    )}
                                                >
                                                    {isLoading === plan.name ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                                    {isLoading === plan.name ? "Connecting..." : "Pay via PayPal"}
                                                </button>
                                            </div>
                                        ) : (
                                                <button
                                                    disabled={isLoading === plan.name}
                                                    onClick={() => {
                                                        if (plan.price === "$0") {
                                                            onClose();
                                                        } else if (plan.price === "$99" || plan.price === "$149") {
                                                            alert("Premium contact initiated. Check Neural Uplink.");
                                                        }
                                                    }}
                                                    className={cn(
                                                        "w-full py-3 rounded-xl font-bold text-xs transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2",
                                                        plan.popular
                                                            ? "bg-indigo-500 text-white hover:bg-indigo-400 shadow-indigo-500/25"
                                                            : "bg-white/5 text-zinc-300 hover:bg-white/10"
                                                    )}
                                                >
                                                    {isLoading === plan.name ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                                    {isLoading === plan.name ? "Connecting..." : plan.button}
                                                </button>
                                        )}
                                    </div>
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
const DraggableNode = ({ data, removeNode, updateNodePosition, exportNodeData }) => {
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

    const [isListening, setIsListening] = useState(false);

    const startListening = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert("Speech recognition is not supported in this browser.");
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInputText(prev => prev ? `${prev} ${transcript}` : transcript);
        };
        recognition.onerror = (event) => {
            console.error("Speech Recognition Error:", event.error);
            setIsListening(false);
        };

        recognition.start();
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
            const response = await nexusAxios.post(tool.endpoint, {
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
            className={`absolute w-[calc(100vw-32px)] md:w-[450px] pointer-events-auto bg-[#111113]/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col z-20 group`}
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
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => exportNodeData(data, tool.name, result)}
                        disabled={!result}
                        className="text-zinc-500 hover:text-emerald-400 transition-colors p-1 disabled:opacity-30"
                        title="Export Node Data"
                    >
                        <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={() => removeNode(data.id)}
                        className="text-zinc-500 hover:text-red-400 transition-colors p-1 relative z-50 pointer-events-auto cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-0 flex flex-col cursor-auto">
                <div className="relative">
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder={tool.placeholder}
                        className="w-full h-[120px] bg-transparent p-4 text-zinc-300 focus:ring-0 outline-none resize-none font-mono text-xs leading-relaxed placeholder:text-zinc-700 border-b border-white/5"
                        spellCheck={false}
                    />
                    <button 
                        onClick={startListening}
                        className={cn(
                            "absolute bottom-4 right-4 p-2 rounded-full transition-all border",
                            isListening 
                                ? "bg-red-500/20 border-red-500/50 text-red-500 animate-pulse scale-110 shadow-[0_0_15px_rgba(239,68,68,0.3)]" 
                                : "bg-white/5 border-white/10 text-zinc-500 hover:text-white hover:bg-white/10"
                        )}
                        title="Voice Input"
                    >
                        <Mic className="w-3.5 h-3.5" />
                    </button>
                </div>

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
                                    <div className="py-6 space-y-4">
                                        <div className="flex items-center justify-center gap-1.5 h-12">
                                            {[...Array(20)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    animate={{ 
                                                        height: [8, Math.random() * 40 + 10, 8] 
                                                    }}
                                                    transition={{ 
                                                        repeat: Infinity, 
                                                        duration: 0.5 + Math.random(),
                                                        ease: "easeInOut"
                                                    }}
                                                    className="w-1 bg-gradient-to-t from-indigo-500 to-cyan-400 rounded-full opacity-60"
                                                />
                                            ))}
                                        </div>
                                        <audio controls className="w-full accent-indigo-500 scale-90 rounded-none h-8" autoPlay>
                                            <source src={`data:audio/mp3;base64,${result}`} type="audio/mp3" />
                                        </audio>
                                        <div className="flex justify-between items-center px-2">
                                            <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em]">Neural Synthesis Active</span>
                                            <span className="text-[8px] font-mono text-indigo-400 opacity-50">AEGIS_STREAM_v4</span>
                                        </div>
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

// Smart Info Widget Component
const SmartInfoWidget = ({ t }) => {
    const [time, setTime] = useState(new Date());
    const [weather, setWeather] = useState(null);
    const [location, setLocation] = useState(null);
    const [markets, setMarkets] = useState([]);
    const [localNews, setLocalNews] = useState(null);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        
        const fetchSmartData = async () => {
            try {
                // Fetch Geo & Weather
                const geoResp = await axios.get('https://ipapi.co/json/').catch(() => ({ data: {} }));
                const geo = geoResp.data;
                setLocation(geo);

                if (geo.city) {
                    // Using wttr.in for weather
                    const weatherResp = await axios.get(`https://wttr.in/${geo.city}?format=j1`).catch(() => null);
                    if (weatherResp && weatherResp.data && weatherResp.data.current_condition) {
                        setWeather(weatherResp.data.current_condition[0]);
                    }
                }

                // Fetch Markets (Bitcoin, Gold, Silver from our API)
                const marketResp = await nexusAxios.get('/api/markets/trending').catch(() => ({ data: { markets: [] } }));
                const allMarkets = marketResp.data.markets || [];
                // Filter for requested ones: BTC, Gold, SI (Silver symbol from backend)
                const filtered = allMarkets.filter(m => 
                    ['BTC', 'Gold', 'Silver', 'SI', 'GC'].includes(m.symbol) || 
                    ['Gold', 'Silver', 'Bitcoin'].includes(m.name)
                );
                // Limit to 3 for compact view
                setMarkets(filtered.slice(0, 3));

                // Fetch Local News Snippet
                const newsResp = await nexusAxios.get('/api/news').catch(() => ({ data: { articles: [] } }));
                const articles = newsResp.data.articles || [];
                const query = (geo.country_name || geo.city || '').toLowerCase();
                const local = articles.find(a => 
                    (a.title + a.description).toLowerCase().includes(query)
                );
                if (local) setLocalNews(local);
            } catch (err) {
                console.warn("Smart Widget fetch failed", err);
            }
        };

        fetchSmartData();
        const dataInterval = setInterval(fetchSmartData, 300000); // 5 min sync

        return () => {
            clearInterval(timer);
            clearInterval(dataInterval);
        };
    }, []);

    return (
        <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed right-6 top-24 z-40 hidden xl:flex flex-col gap-4 w-72"
        >
            {/* Clock & Regional Identity */}
            <div className="bg-[#111113]/40 backdrop-blur-3xl border border-white/10 rounded-3xl p-5 shadow-2xl overflow-hidden relative group hover:border-indigo-500/30 transition-all duration-500">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all duration-700"></div>
                
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 group-hover:scale-110 transition-transform">
                        <Clock className="w-5 h-5 text-indigo-400 animate-pulse" />
                    </div>
                    <div>
                        <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-0.5">{t.temporalSync || 'Temporal Sync'}</h4>
                        <div className="text-2xl font-bold text-white tracking-tighter tabular-nums drop-shadow-sm">
                            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-1.5 border-t border-white/5 pt-4">
                    <div className="flex items-center gap-2 text-zinc-400">
                        <Calendar className="w-3.5 h-3.5 text-zinc-600" />
                        <span className="text-[11px] font-medium tracking-wide">{time.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500">
                        <MapPin className="w-3.5 h-3.5 text-zinc-700" />
                        <span className="text-[10px] font-mono tracking-tighter uppercase">{location?.city || 'Detecting...'}, {location?.country_code || 'Global'}</span>
                    </div>
                </div>
            </div>

            {/* Atmosphere Intelligence */}
            <div className="bg-[#111113]/40 backdrop-blur-3xl border border-white/10 rounded-3xl p-5 shadow-2xl relative group overflow-hidden hover:border-emerald-500/30 transition-all duration-500">
                <div className="absolute -left-6 -bottom-6 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all duration-700"></div>
                
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 group-hover:rotate-12 transition-all">
                        {weather?.weatherDesc[0].value.toLowerCase().includes('sun') || weather?.weatherDesc[0].value.toLowerCase().includes('clear') 
                            ? <Sun className="w-6 h-6 text-yellow-400 group-hover:animate-spin-slow" /> 
                            : <CloudRain className="w-6 h-6 text-cyan-400" />}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-black text-white">{weather ? weather.temp_C : '--'}</span>
                            <span className="text-emerald-400 font-bold text-lg">°C</span>
                        </div>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{weather?.weatherDesc[0].value || t.positioning}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div>
                        <div className="flex flex-col">
                            <span className="text-[8px] text-zinc-600 font-black uppercase">Humidity</span>
                            <span className="text-[11px] text-zinc-300 font-bold">{weather?.humidity || '0'}%</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                        <div className="flex flex-col">
                            <span className="text-[8px] text-zinc-600 font-black uppercase">Wind Speed</span>
                            <span className="text-[11px] text-zinc-300 font-bold">{weather?.windspeedKmph || '0'} <span className="text-[8px] text-zinc-500">Km/h</span></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Asset Intelligence */}
            <div className="bg-[#111113]/40 backdrop-blur-3xl border border-white/10 rounded-3xl p-5 shadow-2xl relative overflow-hidden group hover:border-white/20 transition-all duration-500">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{t.marketIntelligence || 'Markets'}</span>
                    </div>
                    <div className="px-2 py-0.5 bg-emerald-500/10 rounded-md border border-emerald-500/20">
                        <span className="text-[8px] font-black text-emerald-400">LIVE</span>
                    </div>
                </div>
                
                <div className="space-y-2.5">
                    {markets.length > 0 ? markets.map(m => (
                        <div key={m.symbol} className="flex items-center justify-between bg-white/[0.02] border border-white/[0.02] hover:border-white/10 hover:bg-white/[0.05] rounded-2xl px-4 py-3 group/item transition-all cursor-crosshair">
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "p-1.5 rounded-lg flex items-center justify-center border",
                                    m.change >= 0 ? "bg-emerald-500/10 border-emerald-500/20" : "bg-red-500/10 border-red-500/20"
                                )}>
                                    <span className={cn(
                                        "text-[10px] font-black",
                                        m.change >= 0 ? "text-emerald-400" : "text-red-400"
                                    )}>{m.symbol.slice(0, 3)}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[11px] font-bold text-white group-hover/item:text-indigo-300 transition-colors">{m.name}</span>
                                    <span className="text-[8px] text-zinc-600 font-mono tracking-tighter uppercase">{m.symbol} Node</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs font-black text-white tracking-tight">${m.price.toLocaleString()}</div>
                                <div className={cn(
                                    "text-[9px] font-bold flex items-center justify-end gap-1",
                                    m.change >= 0 ? "text-emerald-400" : "text-red-400"
                                )}>
                                    {m.change >= 0 ? '▲' : '▼'} {Math.abs(m.change)}%
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="flex flex-col items-center justify-center py-6 gap-3">
                            <Loader2 className="w-5 h-5 animate-spin text-zinc-700" />
                            <span className="text-[10px] text-zinc-700 font-mono uppercase tracking-widest">{t.synchronizing || 'Syncing...'}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Regional News Alert */}
            {localNews && (
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-indigo-500/5 hover:bg-indigo-500/10 backdrop-blur-3xl border border-indigo-500/20 rounded-3xl p-5 shadow-2xl relative group cursor-pointer overflow-hidden transition-all duration-300"
                    onClick={() => window.open(localNews.link, '_blank')}
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                        <Radio className="w-12 h-12 text-indigo-400 animate-pulse" />
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{t.regionalPriority || 'Priority Alert'}</span>
                    </div>
                    <p className="text-xs text-zinc-200 font-semibold leading-relaxed line-clamp-2 group-hover:text-white transition-colors">
                        {localNews.title}
                    </p>
                    <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-tighter">{localNews.source}</span>
                        <div className="flex items-center gap-1.5 text-indigo-400">
                            <span className="text-[9px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Read more</span>
                            <ExternalLink className="w-3 h-3" />
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default function App() {
    const { user, isSignedIn } = useUser();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [nodes, setNodes] = useState([]); // Active nodes on canvas
    const [workflowId, setWorkflowId] = useState(`flow_${Math.random().toString(36).substr(2, 9)}`);
    const [workflowName, setWorkflowName] = useState("My Neural Workflow");
    const [history, setHistory] = useState([]);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [lang, setLang] = useState('en');
    const t = translations[lang];

    // Modal states
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false);

    // Contact Form State
    const [contactName, setContactName] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contactMessage, setContactMessage] = useState('');
    const [isSendingContact, setIsSendingContact] = useState(false);
    const [contactStatus, setContactStatus] = useState(null);

    // Admin & Request States
    const [isRequestOpen, setIsRequestOpen] = useState(false);
    const [isAdminOpen, setIsAdminOpen] = useState(false);
    const [isApiForgeOpen, setIsApiForgeOpen] = useState(false);

    // Nexus Aegis Stealth Protocol
    useEffect(() => {
        const handleContextMenu = (e) => e.preventDefault();
        const handleKeydown = (e) => {
            if (
                e.keyCode === 123 || 
                (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) || 
                (e.ctrlKey && e.keyCode === 85)
            ) {
                e.preventDefault();
            }
        };

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeydown);

        const cleaner = setInterval(() => {
            console.clear();
            console.log("%c NEXUS AEGIS • SECURE PERIMETER ", "color: #22d3ee; font-weight: bold; font-size: 20px; background: #000; padding: 10px; border: 2px solid #22d3ee;");
            console.log("%c Protected by Gistly Neural Security. Unauthorized access is impossible. ", "color: #94a3b8;");
        }, 3000);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeydown);
            clearInterval(cleaner);
        };
    }, []);



    const trackVisit = async () => {
        try {
            const path = window.location.pathname;
            const geoResp = await axios.get('https://ipapi.co/json/').catch(() => ({ data: {} }));
            const geo = geoResp.data;
            
            await nexusAxios.post('/api/track-visit', {
                ip: geo.ip || 'unknown',
                country: geo.country_name || 'unknown',
                city: geo.city || 'unknown',
                path: path
            });
        } catch (err) {
            console.warn("Tracking silent failure.");
        }
    };
    
    useEffect(() => {
        trackVisit();
        
        // Load shared workspace from URL if exists
        const params = new URLSearchParams(window.location.search);
        const shareData = params.get('share');
        if (shareData) {
            try {
                const decoded = JSON.parse(atob(shareData));
                if (decoded.nodes) {
                    setNodes(decoded.nodes);
                    if (decoded.name) setWorkflowName(decoded.name);
                    // Silent clear for clean UX
                    window.history.replaceState({}, document.title, window.location.pathname);
                }
            } catch (e) {
                console.warn("Nexus Aegis: Invalid Share Token.");
            }
        }
    }, []);

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        setIsSendingContact(true);
        setContactStatus(null);
        try {
            await nexusAxios.post('/api/contact', {
                name: contactName,
                email: contactEmail,
                message: contactMessage
            });
            setContactStatus({ type: 'success', text: 'Transmission Successful.' });
            setContactName('');
            setContactEmail('');
            setContactMessage('');
            setTimeout(() => setContactStatus(null), 5000);
        } catch (error) {
            console.error("Contact Form Error:", error);
            setContactStatus({ type: 'error', text: 'Transmission Failed. Try again.' });
        } finally {
            setIsSendingContact(false);
        }
    };

    const [isAboutOpen, setIsAboutOpen] = useState(false);
    const [isPricingOpen, setIsPricingOpen] = useState(false);
    const [isNewsOpen, setIsNewsOpen] = useState(false);

    // Mobile exclusive states
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

    const filteredTools = tools.filter(tool => {
        const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
        const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tool.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const saveWorkflow = async () => {
        if (!isSignedIn) {
            alert("Please sign in to save your workflow.");
            return;
        }
        setIsSaving(true);
        try {
            await nexusAxios.post('/api/workflows/save', {
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
            const resp = await nexusAxios.get(`/api/workflows/${user.id}`);
            setHistory(resp.data.workflows);
            setIsHistoryOpen(true);
        } catch (err) {
            console.error(err);
        }
    };

    const loadWorkflow = async (id) => {
        try {
            const resp = await nexusAxios.get(`/api/workflow-data/${id}`);
            setNodes(resp.data.nodes);
            setWorkflowId(id);
            setWorkflowName(resp.data.name);
            setIsHistoryOpen(false);
        } catch (err) {
            console.error(err);
        }
    };

    // --- Workflow Templates & Export Logic ---
    const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
    
    const templates = [
        {
            name: "SEO Intelligence Core",
            desc: "Complete SEO research & content optimization pipeline.",
            nodes: [
                { id: `node-${Date.now()}-1`, toolId: 'seo-analyzer', x: 400, y: 150 },
                { id: `node-${Date.now()}-2`, toolId: 'keyword-extractor', x: 400, y: 450 },
                { id: `node-${Date.now()}-3`, toolId: 'content-improver', x: 900, y: 300 }
            ]
        },
        {
            name: "Social Media Engine",
            desc: "Visuals and captions for multi-platform deployment.",
            nodes: [
                { id: `node-${Date.now()}-1`, toolId: 'flux-lightning', x: 400, y: 150 },
                { id: `node-${Date.now()}-2`, toolId: 'marketing-copy', x: 900, y: 150 }
            ]
        },
        {
            name: "Cinematic Voice Production",
            desc: "Premium neural pipeline for professional voiceovers and clones.",
            nodes: [
                { id: `node-${Date.now()}-1`, toolId: 'grammar-fix', x: 200, y: 100 },
                { id: `node-${Date.now()}-2`, toolId: 'voice-clone', x: 700, y: 200 }
            ]
        }
    ];

    const applyTemplate = (template) => {
        setNodes(template.nodes);
        setWorkflowName(template.name);
        setIsTemplatesOpen(false);
    };

    const shareWorkspace = () => {
        const data = btoa(JSON.stringify({ nodes, name: workflowName }));
        const url = `${window.location.origin}?share=${data}`;
        navigator.clipboard.writeText(url);
        alert("Encrypted Workspace Link copied to clipboard!");
    };

    const exportNodeData = (nodeData, toolName, result) => {
        const content = `--- GISTLY AI NODE EXPORT ---\nTool: ${toolName}\nResult:\n${result}`;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gistly-export-${Date.now()}.txt`;
        a.click();
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
            // Spawn systematically around center, adjusting for mobile width
            x: window.innerWidth < 768 ? 16 : (window.innerWidth / 2 - 225 + offset - 100),
            y: window.innerWidth < 768 ? 150 + offset : (window.innerHeight / 2 - 200 + offset),
        };
        if (window.innerWidth < 768) {
            setIsMobileMenuOpen(false); // Close mobile menu after selecting a tool
        }
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
        <>
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

                <LaunchCountdown />

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
                <style>{`
                @keyframes dash { to { stroke-dashoffset: -1000; } }
            `}</style>

                {/* Top Navigation Bar */}
                <nav className="fixed top-0 w-full z-50 bg-[#09090b]/40 backdrop-blur-2xl border-b border-white/[0.05]">
                    <div className="max-w-[1800px] mx-auto px-6 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-3 cursor-pointer group">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/20 transition-all shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                                <Sparkles className="text-indigo-400 w-4 h-4" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-white font-display">Gistly<span className="text-indigo-400">.ai</span> <span className="hidden md:inline-block text-[10px] text-zinc-500 uppercase tracking-widest ml-2 bg-white/5 py-1 px-2 rounded-full border border-white/5">{t.canvasMode}</span></span>
                        </div>

                        {/* Mobile Menu Toggle Button */}
                        <div className="md:hidden flex items-center gap-4">
                            <div className="flex items-center gap-2 text-indigo-400/90 bg-indigo-400/10 px-2 py-1 rounded-full border border-indigo-400/20 cursor-default select-none">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></div>
                                <span className="text-[10px] font-bold uppercase tracking-wider">Online</span>
                            </div>
                            <button onClick={() => setIsMobileNavOpen(!isMobileNavOpen)} className="text-zinc-400 hover:text-white transition-colors">
                                {isMobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>

                        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
                            <button onClick={() => setIsNewsOpen(true)} className="text-red-400 hover:text-red-300 font-bold tracking-widest uppercase text-xs flex items-center gap-2 border border-red-500/20 bg-red-500/10 px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                                <Radio className="w-3.5 h-3.5 animate-pulse" /> {t.liveNews}
                            </button>
                            <button onClick={() => setIsGuideOpen(true)} className="text-zinc-400 hover:text-white transition-colors">{t.guide}</button>
                            <button onClick={() => setIsPricingOpen(true)} className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors flex items-center gap-2">
                                <Star className="w-4 h-4 fill-indigo-400/20" /> {t.pricing}
                            </button>
                            <button onClick={() => setIsAboutOpen(true)} className="text-zinc-400 hover:text-white transition-colors">{t.about}</button>
                            <button onClick={() => setIsContactOpen(true)} className="text-zinc-400 hover:text-white transition-colors">{t.contact}</button>
                            <button 
                                onClick={shareWorkspace}
                                className="px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(99,102,241,0.1)]"
                            >
                                <Share2 className="w-3.5 h-3.5" /> {t.share}
                            </button>
                            <div className="flex items-center gap-2 text-indigo-400/90 bg-indigo-400/10 px-3 py-1.5 rounded-full border border-indigo-400/20 cursor-default select-none pointer-events-none">
                                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div>
                                <span className="text-xs font-semibold tracking-wide uppercase">{t.coreOnline}</span>
                            </div>
                            <SignedOut>
                                <SignInButton mode="modal">
                                    <button className="bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-zinc-200 transition-all text-xs">{t.signIn}</button>
                                </SignInButton>
                            </SignedOut>
                            <SignedIn>
                                <UserButton appearance={{ elements: { userButtonAvatarBox: "w-8 h-8" } }} />
                            </SignedIn>
                        </div>
                        <div className="flex items-center gap-2 ml-3 relative">
                            <div className="relative">
                                <button
                                    id="lang-toggle"
                                    onClick={() => document.getElementById('lang-dropdown').classList.toggle('hidden')}
                                    className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold text-[11px] px-3 py-1.5 rounded-full hover:bg-indigo-500/20 transition-all shadow-[0_0_10px_rgba(99,102,241,0.15)]"
                                >
                                    <Globe className="w-3.5 h-3.5" />
                                    <span>{LANGUAGES.find(l => l.code === lang)?.flag} {LANGUAGES.find(l => l.code === lang)?.label}</span>
                                    <ChevronRight className="w-3 h-3 rotate-90" />
                                </button>
                                <div
                                    id="lang-dropdown"
                                    className="hidden absolute right-0 mt-2 w-48 bg-[#111113]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] z-[500] overflow-hidden"
                                    style={{ maxHeight: '300px', overflowY: 'auto' }}
                                >
                                    {LANGUAGES.map(l => (
                                        <button
                                            key={l.code}
                                            onClick={() => { setLang(l.code); document.getElementById('lang-dropdown').classList.add('hidden'); }}
                                            className={cn(
                                                "w-full flex items-center gap-3 px-4 py-2.5 text-xs text-left transition-all hover:bg-indigo-500/10",
                                                lang === l.code ? "text-indigo-400 bg-indigo-500/10 font-bold" : "text-zinc-400"
                                            )}
                                        >
                                            <span className="text-base">{l.flag}</span>
                                            <span>{l.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Mobile Dropdown Nav Menu */}
                <AnimatePresence>
                    {isMobileNavOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="md:hidden fixed top-16 left-0 right-0 z-40 bg-[#09090b]/95 backdrop-blur-2xl border-b border-white/10 px-6 py-6 flex flex-col gap-4 shadow-2xl"
                        >
                            <div className="flex flex-col gap-2 border-b border-white/5 pb-4">
                                <button onClick={() => { setIsGuideOpen(true); setIsMobileNavOpen(false); }} className="text-left text-zinc-300 font-semibold py-2 hover:text-white">{t.guide}</button>
                                <button onClick={() => { setIsPricingOpen(true); setIsMobileNavOpen(false); }} className="text-left text-indigo-400 font-semibold py-2 hover:text-indigo-300 flex items-center gap-2">
                                    <Star className="w-4 h-4 fill-indigo-400/20" /> {t.pricing}
                                </button>
                                <button onClick={() => { setIsAboutOpen(true); setIsMobileNavOpen(false); }} className="text-left text-zinc-300 font-semibold py-2 hover:text-white">{t.about}</button>
                                <button onClick={() => { setIsContactOpen(true); setIsMobileNavOpen(false); }} className="text-left text-zinc-300 font-semibold py-2 hover:text-white">{t.contact}</button>
                            </div>

                            <div className="flex justify-between items-center mt-2">
                                <div className="flex gap-4">
                                    <Link to="/terms" onClick={() => setIsMobileNavOpen(false)} className="text-[10px] text-zinc-500 uppercase tracking-widest hover:text-indigo-400 font-mono">{t.terms}</Link>
                                    <Link to="/privacy" onClick={() => setIsMobileNavOpen(false)} className="text-[10px] text-zinc-500 uppercase tracking-widest hover:text-emerald-400 font-mono">{t.privacy}</Link>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Floating Left Side Dashboard / Tool Dock (Desktop & Mobile Sheet) */}
                <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className={cn(
                        "fixed z-40 bg-[#111113]/60 backdrop-blur-3xl border border-white/10 flex flex-col shadow-2xl transition-all duration-300",
                        isMobileMenuOpen
                            ? "inset-x-0 bottom-20 top-20 rounded-t-3xl p-5 md:left-6 md:top-24 md:bottom-6 md:w-72 md:rounded-3xl"
                            : "hidden md:flex left-6 top-24 bottom-6 w-72 rounded-3xl p-5"
                    )}
                >
                    <div className="mb-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-1 flex items-center gap-2"><LayoutDashboard className="w-4 h-4 text-indigo-400" /> {t.toolHub}</h2>
                                <p className="text-[10px] text-zinc-500 font-mono tracking-tighter">{t.nodeDeployment}</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={clearCanvas} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-zinc-500 hover:text-white transition-colors border border-white/5" title="New Canvas"><FilePlus className="w-4 h-4" /></button>
                                <button onClick={fetchHistory} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-zinc-500 hover:text-indigo-400 transition-colors border border-white/5" title="Neural History"><History className="w-4 h-4" /></button>
                                <button onClick={shareWorkspace} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-zinc-500 hover:text-emerald-400 transition-colors border border-white/5" title="Share Architecture"><Share2 className="w-4 h-4" /></button>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 bg-black/40 border border-white/5 rounded-xl p-2 pl-3">
                            <input
                                value={workflowName}
                                onChange={(e) => setWorkflowName(e.target.value)}
                                className="bg-transparent text-[11px] text-zinc-300 outline-none w-full"
                                placeholder={t.architectureName}
                            />
                            <button
                                onClick={saveWorkflow}
                                disabled={isSaving || nodes.length === 0}
                                className="p-1.5 bg-indigo-500 hover:bg-indigo-400 disabled:bg-zinc-800 disabled:text-zinc-600 rounded-lg transition-all"
                            >
                                {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin text-white" /> : <Save className="w-3.5 h-3.5 text-white" />}
                            </button>
                        </div>

                        <div className="relative group/search">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within/search:text-indigo-400 transition-colors">
                                <Search className="w-3.5 h-3.5" />
                            </div>
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-black/40 border border-white/5 focus:border-indigo-500/50 rounded-xl py-2 pl-9 pr-4 text-[11px] text-zinc-300 outline-none transition-all placeholder:text-zinc-700"
                                placeholder={t.searchNodes}
                            />
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-2 mb-6 border-b border-white/5 pb-4">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => {
                                    setSelectedCategory(cat);
                                    setIsTemplatesOpen(false);
                                }}
                                className={cn(
                                    "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all",
                                    selectedCategory === cat && !isTemplatesOpen
                                        ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                                        : "bg-white/5 text-zinc-500 hover:bg-white/10 hover:text-white border border-transparent"
                                )}
                            >
                                {cat === 'All' ? t.all : cat}
                            </button>
                        ))}
                        <button
                            onClick={() => setIsTemplatesOpen(true)}
                            className={cn(
                                "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all",
                                isTemplatesOpen
                                    ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                                    : "bg-white/5 text-zinc-500 hover:bg-white/10 hover:text-white border border-transparent"
                            )}
                        >
                            {t.templates}
                        </button>
                    </div>

                    {/* Tool/Template List */}
                    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent pr-2 flex flex-col gap-3">
                        {isTemplatesOpen ? (
                            templates.map((temp, i) => (
                                <div
                                    key={i}
                                    onClick={() => applyTemplate(temp)}
                                    className="group bg-indigo-500/5 border border-indigo-500/20 hover:border-indigo-500/50 p-4 rounded-xl transition-all cursor-pointer flex flex-col gap-2"
                                >
                                    <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-widest">{temp.name}</h3>
                                    <p className="text-[10px] text-zinc-500 italic">{temp.desc}</p>
                                    <div className="flex items-center gap-1 text-[8px] text-indigo-400 font-bold mt-1 uppercase">
                                        <Zap className="w-2.5 h-2.5" /> Initialize Architecture
                                    </div>
                                </div>
                            ))
                        ) : (
                            filteredTools.map((tool) => (
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
                            ))
                        )}

                        {/* Request Button Inside Scroll to save space */}
                        <div className="flex flex-col gap-2 mt-6 mb-4">
                            <button
                                onClick={() => setIsApiForgeOpen(true)}
                                className="p-4 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-2xl transition-all flex flex-col items-center gap-2 group shrink-0"
                            >
                                <Cpu className="w-5 h-5 group-hover:scale-110 transition-transform text-indigo-300" />
                                <div className="text-center">
                                    <p className="text-[10px] font-black uppercase tracking-widest">{t.apiForge}</p>
                                    <p className="text-[8px] text-zinc-600 font-bold uppercase mt-1 tracking-tighter">{t.monetize}</p>
                                </div>
                            </button>

                            <button
                                onClick={() => setIsRequestOpen(true)}
                                className="p-4 bg-white/5 hover:bg-white/10 text-zinc-400 border border-white/10 border-dashed rounded-2xl transition-all flex flex-col items-center gap-2 group shrink-0"
                            >
                                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform text-zinc-500" />
                                <div className="text-center">
                                    <p className="text-[10px] font-black uppercase tracking-widest">{t.requestFeature}</p>
                                    <p className="text-[8px] text-zinc-700 font-bold uppercase mt-1 tracking-tighter">{t.buildTogether}</p>
                                </div>
                            </button>
                        </div>
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
                                className="absolute top-1/2 left-1/2 md:left-[calc(50%+144px)] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center pointer-events-none px-4"
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
                            exportNodeData={exportNodeData}
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
                                className="bg-[#111113]/70 backdrop-blur-2xl border border-white/10 rounded-3xl max-w-xl w-full shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] relative overflow-hidden group flex flex-col max-h-[90vh]"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                                <button
                                    onClick={() => setIsGuideOpen(false)}
                                    className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors z-[100]"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="p-8 relative z-10 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 w-full">
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
                                className="bg-[#0c0c0e]/90 border border-indigo-500/20 p-0 rounded-3xl max-w-2xl w-full shadow-[0_0_50px_rgba(99,102,241,0.1)] relative overflow-hidden flex flex-col max-h-[90vh]"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 z-50"></div>

                                <button
                                    onClick={() => setIsContactOpen(false)}
                                    className="absolute top-6 right-6 text-zinc-500 hover:text-indigo-400 transition-colors z-[100] bg-black/50 p-2 rounded-full backdrop-blur-md"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="p-8 md:p-10 relative z-10 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 w-full">
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
                                                <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-1">Direct Email (Manual)</p>
                                                <a href="mailto:contact@gistly.site" className="text-xl font-mono text-white hover:text-indigo-400 transition-colors font-bold tracking-tighter">
                                                    contact<span className="text-indigo-400">@</span>gistly.site
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <form onSubmit={handleContactSubmit} className="mb-8 space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-2 block">Agent Name</label>
                                                <input required value={contactName} onChange={(e) => setContactName(e.target.value)} type="text" placeholder="John Doe" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-2 block">Return Address</label>
                                                <input required value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} type="email" placeholder="john@example.com" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-2 block">Encrypted Payload</label>
                                            <textarea required value={contactMessage} onChange={(e) => setContactMessage(e.target.value)} rows={3} placeholder="How can we assist you?" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-sans resize-none"></textarea>
                                        </div>

                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex-1">
                                                {contactStatus && (
                                                    <div className={cn("text-xs font-mono py-1.5 px-3 rounded-lg inline-block border", contactStatus.type === 'success' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-500 border-red-500/20")}>
                                                        {contactStatus.text}
                                                    </div>
                                                )}
                                            </div>
                                            <button disabled={isSendingContact} type="submit" className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)] disabled:opacity-50 flex items-center gap-2">
                                                {isSendingContact ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                                {isSendingContact ? 'Transmitting...' : 'Send Message'}
                                            </button>
                                        </div>
                                    </form>

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
                                            className="px-6 py-2.5 bg-zinc-800 text-zinc-300 border border-white/5 text-sm font-bold uppercase tracking-widest rounded-xl hover:bg-zinc-700 hover:text-white transition-all shadow-[0_0_15px_rgba(0,0,0,0.2)]"
                                        >
                                            Close Uplink
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
                                className="bg-[#09090b] border border-cyan-500/20 p-0 rounded-3xl max-w-3xl w-full shadow-[0_0_80px_rgba(34,211,238,0.05)] relative overflow-hidden flex flex-col max-h-[90vh]"
                            >
                                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                                <button
                                    onClick={() => setIsAboutOpen(false)}
                                    className="absolute top-6 right-6 text-zinc-500 hover:text-cyan-400 transition-colors z-[100] bg-black/50 p-2 rounded-full backdrop-blur-md"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="grid grid-cols-1 md:grid-cols-2 relative z-10 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-500/20 w-full flex-1">
                                    <div className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-white/5 bg-white/[0.02] flex flex-col justify-center">
                                        <div>
                                            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl overflow-hidden bg-cyan-500/10 border border-cyan-500/30 mb-6 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                                                <img src="/ceo.png" alt="K.A.S. Hashen Fernando" className="w-full h-full object-cover object-top grayscale hover:grayscale-0 transition-all duration-500" />
                                            </div>
                                            <h3 className="text-3xl font-black text-white tracking-tighter font-display leading-tight mb-2">
                                                K.A.S. Hashen Fernando
                                            </h3>
                                            <p className="text-cyan-400 font-bold uppercase tracking-widest text-xs mb-6">
                                                CEO, Owner & Solo Founder
                                            </p>
                                            <p className="text-zinc-400 text-sm leading-relaxed mb-6 border-l-2 border-cyan-500/30 pl-4 py-1 italic">
                                                "I engineered Gistly.ai entirely from the ground up as a solo developer. It's not just another AI tool; it's the ultimate unified multitasking workspace I envisioned for the modern world."
                                            </p>
                                        </div>

                                        <div className="mt-4 space-y-3">
                                            <h4 className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold flex items-center gap-2 mb-2">
                                                <Mail className="w-3 h-3 text-cyan-500" /> Direct Neural Uplink
                                            </h4>
                                            <a href="mailto:ceo@gistly.site" className="flex items-center gap-3 text-sm text-zinc-300 hover:text-cyan-400 transition-colors bg-black/40 p-3 rounded-xl border border-white/5 hover:border-cyan-500/30">
                                                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                                                    <UserCheck className="w-4 h-4 text-cyan-500" />
                                                </div>
                                                ceo@gistly.site
                                            </a>
                                            <a href="mailto:support@gistly.site" className="flex items-center gap-3 text-sm text-zinc-300 hover:text-cyan-400 transition-colors bg-black/40 p-3 rounded-xl border border-white/5 hover:border-cyan-500/30">
                                                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                                                    <Shield className="w-4 h-4 text-cyan-500" />
                                                </div>
                                                support@gistly.site
                                            </a>
                                        </div>
                                    </div>

                                    <div className="p-8 md:p-10 flex flex-col justify-center">
                                        <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-2">
                                            <Orbit className="w-4 h-4 text-indigo-400" /> The Gistly Ecosystem
                                        </h4>

                                        <div className="space-y-6 text-sm text-zinc-300 leading-relaxed">
                                            <p>
                                                <strong className="text-white">Gistly.site</strong> merges the distinct powers of the world's most capable AI networks into a single, seamless infinite canvas.
                                            </p>

                                            <div className="grid grid-cols-2 gap-4 mt-6">
                                                <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl hover:border-purple-500/30 transition-all col-span-2 shadow-[0_0_15px_rgba(168,85,247,0.05)]">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                                                            <Terminal className="w-4 h-4 text-purple-400" />
                                                        </div>
                                                        <h5 className="text-xs font-bold text-white uppercase tracking-wider">Antigravity Intelligence</h5>
                                                    </div>
                                                    <p className="text-[10px] text-zinc-400 mt-2">The core agentic AI software engineer. Assisted the solo founder in generating the platform infrastructure and algorithms autonomously.</p>
                                                </div>
                                                <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl hover:border-cyan-500/30 transition-all">
                                                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center mb-3">
                                                        <Sparkles className="w-4 h-4 text-blue-400" />
                                                    </div>
                                                    <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Deep Logic</h5>
                                                    <p className="text-[10px] text-zinc-500">Powered by Gemini for advanced reasoning.</p>
                                                </div>
                                                <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl hover:border-pink-500/30 transition-all">
                                                    <div className="w-8 h-8 rounded-full bg-pink-500/10 flex items-center justify-center mb-3">
                                                        <ImageIcon className="w-4 h-4 text-pink-400" />
                                                    </div>
                                                    <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Visual Arts</h5>
                                                    <p className="text-[10px] text-zinc-500">Leonardo engine for hyper-real generation.</p>
                                                </div>
                                                <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl hover:border-emerald-500/30 transition-all">
                                                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3">
                                                        <Globe className="w-4 h-4 text-emerald-400" />
                                                    </div>
                                                    <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Live Web Intel</h5>
                                                    <p className="text-[10px] text-zinc-500">Real-time data scraping driven by Apify.</p>
                                                </div>
                                                <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl hover:border-orange-500/30 transition-all">
                                                    <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center mb-3">
                                                        <Zap className="w-4 h-4 text-orange-400" />
                                                    </div>
                                                    <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Instant Speed</h5>
                                                    <p className="text-[10px] text-zinc-500">Groq LPUs for zero-latency communication.</p>
                                                </div>
                                            </div>

                                            <p className="text-xs text-zinc-500 mt-6 border-l-2 border-indigo-500/30 pl-3">
                                                Why switch between 5 tabs when you can architect the future from one terminal? Welcome to the Nexus.
                                            </p>
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
                                className="bg-[#111113]/70 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl max-w-md w-full shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
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

                {/* Mobile Bottom Navigation App Bar */}
                <div className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-[#09090b]/80 backdrop-blur-2xl border-t border-white/10 z-[100] pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                    <div className="flex items-center justify-around h-full px-2">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className={cn("flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors", isMobileMenuOpen ? "text-indigo-400" : "text-zinc-500 hover:text-zinc-300")}
                        >
                            <LayoutDashboard className="w-6 h-6" />
                            <span className="text-[10px] font-bold tracking-wider">{t.tools}</span>
                        </button>

                        <button onClick={fetchHistory} className="flex flex-col items-center justify-center w-16 h-full gap-1 text-zinc-500 hover:text-indigo-400 transition-colors">
                            <History className="w-6 h-6" />
                            <span className="text-[10px] font-bold tracking-wider">{t.history}</span>
                        </button>

                        {/* Floating FAB - Center Clear Canvas Action */}
                        <div className="relative -top-6 flex flex-col items-center">
                            <button
                                onClick={clearCanvas}
                                style={{ WebkitTapHighlightColor: 'transparent' }}
                                className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-cyan-500 rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(99,102,241,0.5)] border-2 border-[#09090b] text-white active:scale-95 transition-all outline-none"
                            >
                                <FilePlus className="w-6 h-6 drop-shadow-md" />
                            </button>
                        </div>

                        <button onClick={() => setIsNewsOpen(true)} className="flex flex-col items-center justify-center w-16 h-full gap-1 text-zinc-500 hover:text-red-400 transition-colors">
                            <Radio className="w-6 h-6 animate-pulse text-red-500" />
                            <span className="text-[10px] font-bold tracking-wider">{t.news}</span>
                        </button>

                        <button onClick={() => setLang(lang === 'en' ? 'si' : 'en')} className="flex flex-col items-center justify-center w-16 h-full gap-1 text-zinc-500 hover:text-indigo-400 transition-colors">
                            <Globe className="w-6 h-6" />
                            <span className="text-[10px] font-bold tracking-wider">{lang === 'en' ? 'සිංහල' : 'EN'}</span>
                        </button>
                    </div>
                </div>

                {/* Desktop Footer Links */}
                <div className="hidden md:flex fixed bottom-2 right-6 z-50 items-center gap-4 text-[10px] text-zinc-500 font-mono tracking-widest uppercase bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/5">
                    <button onClick={() => setIsAdminOpen(true)} className="hover:text-amber-400 transition-colors opacity-50 hover:opacity-100 uppercase">Nexus</button>
                    <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                    <Link to="/terms" className="hover:text-indigo-400 transition-colors">{t.terms}</Link>
                    <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                    <Link to="/privacy" className="hover:text-emerald-400 transition-colors">{t.privacy}</Link>
                    <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                    <Link to="/refund" className="hover:text-rose-400 transition-colors">{t.refund}</Link>
                    <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                    <div className="flex items-center gap-2 text-cyan-400 font-black italic">
                        <Shield className="w-3 h-3" />
                        <span className="tracking-tighter uppercase">Nexus Aegis Protected</span>
                    </div>
                </div>

                <SmartInfoWidget t={t} />
            </div>

            <NewsPanel isOpen={isNewsOpen} onClose={() => setIsNewsOpen(false)} />
            <CustomerRequestModal isOpen={isRequestOpen} onClose={() => setIsRequestOpen(false)} />
            <AdminDashboard isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
            <APIForgeModal 
                isOpen={isApiForgeOpen} 
                onClose={() => setIsApiForgeOpen(false)} 
                userEmail={user?.primaryEmailAddress?.emailAddress || ""} 
            />
        </>
    );
}
