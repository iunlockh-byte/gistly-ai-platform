import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import TermsOfService from './pages/TermsOfService.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import RefundPolicy from './pages/RefundPolicy.jsx'
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react'

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key")
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/refund" element={<RefundPolicy />} />
                </Routes>
            </BrowserRouter>
        </ClerkProvider>
    </React.StrictMode>
)
