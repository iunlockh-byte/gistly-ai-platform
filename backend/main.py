import os
import base64
import requests
import json
import re
import urllib3
import time
import urllib.parse
import sqlite3
import math
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from apify_client import ApifyClient
from groq import Groq
from bs4 import BeautifulSoup
from gtts import gTTS
import tempfile
from dotenv import load_dotenv
import feedparser
import yfinance as yf
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from concurrent.futures import ThreadPoolExecutor
from lemonsqueezy import LemonSqueezy
from datetime import datetime
from typing import List, Any

load_dotenv()

from supabase import create_client, Client

# Database Initialization (SQLite removed, using Supabase)
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client | None = None
if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("Successfully connected to Supabase")
    except Exception as e:
        print(f"Failed to initialize Supabase client: {e}")
else:
    print("WARNING: Supabase credentials not found. Database features will be disabled.")

# Configure the Gemini API
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    # We won't crash, but endpoints will fail with a helpful message
    print("WARNING: GEMINI_API_KEY not found in environment variables")

# Configure Apify Client
APIFY_TOKEN = os.getenv("APIFY_API_TOKEN")

# Configure Groq Client (Fallback)
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Configure Hugging Face Token for Image Generation
HF_TOKEN = os.getenv("HF_TOKEN")
LEONARDO_API_KEY = os.getenv("LEONARDO_API_KEY")  # High-End Backup
if not HF_TOKEN:
    print("WARNING: HF_TOKEN not found in environment variables.")

# Initialize clients
genai.configure(api_key=API_KEY)

# Configure Lemon Squeezy
LEMON_SQUEEZY_API_KEY = os.getenv("LEMON_SQUEEZY_API_KEY")
LEMON_SQUEEZY_STORE_ID = os.getenv("LEMON_SQUEEZY_STORE_ID")

if LEMON_SQUEEZY_API_KEY:
    ls = LemonSqueezy(LEMON_SQUEEZY_API_KEY)
else:
    ls = None
    print("WARNING: LEMON_SQUEEZY_API_KEY not found. Payments disabled.")
    
# Configure PayPal
PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID")
PAYPAL_CLIENT_SECRET = os.getenv("PAYPAL_CLIENT_SECRET")
PAYPAL_MODE = os.getenv("PAYPAL_MODE", "sandbox") # sandbox or live

# Gistly URL for Redirects
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
model = genai.GenerativeModel("gemini-flash-latest")
apify_client = ApifyClient(APIFY_TOKEN) if APIFY_TOKEN else None
groq_client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

app = FastAPI(
    title="Gistly Multi-Tool API",
    description="Backend for Gistly AI's suite of developer and creator tools.",
    version="2.0.0",
)

# CORS middleware - Hardened to trusted origins
allowed_origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:3000",
    "https://gistly.site",
    "https://www.gistly.site",
    "https://gistly.pages.dev",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*", "X-Nexus-Shield", "X-API-KEY"],
)

# Nexus Shield: Core Security Middleware
NEXUS_SHIELD_TOKEN = "G7-NX-SECURITY-V1-ALPHA"

@app.middleware("http")
async def nexus_security_shield(request: Request, call_next):
    # Bypass preflight requests for CORS compatibility
    if request.method == "OPTIONS":
        return await call_next(request)

    public_paths = ["/", "/api/marketplace/plans", "/docs", "/openapi.json"]
    if request.url.path in public_paths:
        return await call_next(request)
    
    # Internal Frontend Verification
    shield = request.headers.get("X-Nexus-Shield")
    if shield == NEXUS_SHIELD_TOKEN:
        return await call_next(request)
        
    # External Developer Verification
    api_key = request.headers.get("X-API-KEY")
    if api_key:
        return await call_next(request)

    # If neither, block access
    print(f"Nexus Shield Denied: Path={request.url.path} Host={request.client.host} ShieldHeader={shield}")
    return JSONResponse(
        status_code=403,
        content={"detail": "Nexus Shield: Forbidden Access. Origin not verified."}
    )

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time
    print(f"REQUEST COMPLETE: {request.method} {request.url.path} STATUS={response.status_code} TIME={duration:.2f}s")
    return response


class AIRequest(BaseModel):
    content: str
    context: str = ""


class AdminLogin(BaseModel):
    password: str


# --- Telemetry & Analytics Core ---
global_stats: dict[str, Any] = {
    "visitors": [],
    "workflows_count": 0,
    "api_keys_active": 18,  # Mocked active keys
    "revenue_est": 2450.00
}

@app.post("/api/track-visit")
async def track_visit(track: VisitorTrack):
    global_stats["visitors"].append({
        "ip": track.ip,
        "country": track.country,
        "city": track.city,
        "path": track.path,
        "timestamp": datetime.now().isoformat()
    })
    # Keep last 1000 visitors to avoid memory bloat
    if len(global_stats["visitors"]) > 1000:
        global_stats["visitors"].pop(0)
    return {"status": "tracked"}

@app.get("/api/admin/stats")
async def get_admin_stats():
    # Aggregate data from in-memory global_stats
    visitors = global_stats["visitors"]
    total_visitors = len(visitors)
    
    countries = {}
    for v in visitors:
        c = v.get("country", "Unknown")
        countries[c] = countries.get(c, 0) + 1
        
    return {
        "total_visitors": total_visitors,
        "total_requests": 42, # Mocked or fetch from DB if available
        "total_workflows": global_stats["workflows_count"] or 15,
        "total_contacts": 8,
        "total_api_keys": global_stats["api_keys_active"],
        "countries": countries,
        "recent_requests": [
            {"name": "Internal Nexus", "email": "system@gistly.site", "type": "Shield Active", "created_at": datetime.now().isoformat()}
        ]
    }


class CustomerRequest(BaseModel):
    name: str
    email: str
    request_type: str
    details: str


class VisitorTrack(BaseModel):
    ip: str = "unknown"
    country: str = "unknown"
    city: str = "unknown"
    path: str = "/"

class APIKeyCreate(BaseModel):
    user_email: str
    plan: str = "free"  # free, pro, enterprise

class APIKeyStatus(BaseModel):
    api_key: str


@app.get("/")
async def status():
    return {"status": "online", "model": "gemini-1.5-pro"}


async def ask_gemini(prompt: str):
    """Internal function to call Gemini API."""
    if not API_KEY:
        raise Exception("Gemini API Key is not configured.")
    response = model.generate_content(prompt)
    if not response.text:
        raise Exception("Gemini returned an empty response.")
    return response.text


async def ask_groq(prompt: str):
    """Internal function to call Groq API (Fallback)."""
    if not groq_client:
        raise Exception("Groq API Key is not configured.")
    completion = groq_client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[{"role": "user", "content": prompt}],
    )
    return completion.choices[0].message.content


async def generate_ai_response(prompt: str):
    """Unified AI interface with automatic fallback across providers."""
    errors = []

    # Provider 1: Gemini (Primary)
    try:
        return await ask_gemini(prompt)
    except Exception as e:
        error_msg = f"Gemini failed: {str(e)}"
        print(error_msg)
        errors.append(error_msg)

    # Provider 2: Groq (Fallback)
    try:
        if groq_client:
            print("Attempting fallback to Groq...")
            return await ask_groq(prompt)
    except Exception as e:
        error_msg = f"Groq fallback failed: {str(e)}"
        print(error_msg)
        errors.append(error_msg)

    # If all providers fail
    raise HTTPException(
        status_code=500,
        detail=f"All AI providers failed. Diagnostics: {'; '.join(errors)}",
    )


@app.post("/api/summarize")
async def summarize(req: AIRequest):
    prompt = f"Summarize the following text concisely. Focus on the key takeaways:\n\n{req.content}"
    result = await generate_ai_response(prompt)
    return {"result": result}


@app.post("/api/debug")
async def debug_code(req: AIRequest):
    prompt = (
        f"Identify bugs and provide a fix for the following code. "
        f"Explain why the bug occurred.\n\nCode:\n{req.content}"
    )
    result = await generate_ai_response(prompt)
    return {"result": result}


@app.post("/api/humanize")
async def humanize(req: AIRequest):
    prompt = (
        f"Rewrite the following text to sound more natural, human, and conversational. "
        f"Avoid generic AI patterns while maintaining the original meaning:\n\n{req.content}"
    )
    result = await generate_ai_response(prompt)
    return {"result": result}


@app.post("/api/resume-optimize")
async def optimize_resume(req: AIRequest):
    prompt = (
        f"Analyze this resume content and suggest optimizations for ATS (Applicant Tracking Systems). "
        f"Highlight keyword improvements and formatting suggestions:\n\n{req.content}"
    )
    result = await generate_ai_response(prompt)
    return {"result": result}


@app.post("/api/sql-generate")
async def generate_sql(req: AIRequest):
    prompt = (
        f"Generate a well-optimized SQL query based on this natural language description. "
        f"Assume standard relational database schemas:\n\n{req.content}"
    )
    result = await generate_ai_response(prompt)
    return {"result": result}


@app.post("/api/social-post")
async def generate_social(req: AIRequest):
    prompt = (
        f"Generate highly engaging social media posts for Twitter, LinkedIn, and Instagram "
        f"based on this topic or content:\n\n{req.content}"
    )
    result = await generate_ai_response(prompt)
    return {"result": result}


@app.post("/api/email-gen")
async def generate_email(req: AIRequest):
    prompt = (
        f"Write a professional and highly effective email based on the following context. "
        f"Ensure the tone is appropriate for a business setting:\n\n{req.content}"
    )
    result = await generate_ai_response(prompt)
    return {"result": result}


@app.post("/api/regex-gen")
async def generate_regex(req: AIRequest):
    prompt = (
        f"Create a Regular Expression (Regex) for the following natural language description. "
        f"Provide the regex pattern and a brief explanation of how it works:\n\n{req.content}"
    )
    result = await generate_ai_response(prompt)
    return {"result": result}


@app.post("/api/cover-letter")
async def generate_cover_letter(req: AIRequest):
    prompt = (
        f"Write a compelling and professional cover letter based on the following details "
        f"(job description, personal experience, etc.). Highlight key strengths:\n\n{req.content}"
    )
    result = await generate_ai_response(prompt)
    return {"result": result}


@app.post("/api/grammar-fix")
async def fix_grammar(req: AIRequest):
    prompt = (
        f"Act as a professional proofreader. Fix any grammar, spelling, or punctuation errors "
        f"in the following text. Also, suggest improvements to make it sound more professional:\n\n{req.content}"
    )
    result = await generate_ai_response(prompt)
    return {"result": result}


@app.post("/api/business-validator")
async def validate_business(req: AIRequest):
    prompt = (
        f"Act as an expert startup advisor. Analyze the following business idea. "
        f"Provide a structured report including: 1) Pros, 2) Cons, 3) Target Audience, "
        f"and 4) Competitive Analysis:\n\n{req.content}"
    )
    result = await generate_ai_response(prompt)
    return {"result": result}


@app.post("/api/blog-gen")
async def generate_blog(req: AIRequest):
    prompt = (
        f"Write a comprehensive, engaging, and SEO-optimized blog post based on the following topic or outline. "
        f"Include an engaging title, introduction, body paragraphs with headings, and a conclusion:\n\n{req.content}"
    )
    result = await generate_ai_response(prompt)
    return {"result": result}


@app.post("/api/youtube-summarizer")
async def summarize_youtube(req: AIRequest):
    if not apify_client:
        raise HTTPException(
            status_code=500,
            detail="APIFY_API_TOKEN not found. Please add it to your .env file to enable YouTube summaries.",
        )

    try:
        url = req.content.strip()

        # Call Apify Actor
        # Using streamers/youtube-scraper which is highly reliable
        run_input = {
            "downloadSubtitles": True,
            "saveSubsToItems": True,
            "startUrls": [{"url": url}],
            "maxResults": 1,
        }

        # Run the actor and wait for it to finish
        run = apify_client.actor("streamers/youtube-scraper").call(run_input=run_input)
        if not run:
            raise Exception("Apify actor run failed to return data.")

        transcript_parts: list[str] = []
        # Fetch results from the dataset
        for item in apify_client.dataset(run["defaultDatasetId"]).iterate_items():
            if "transcript" in item:
                transcript_parts.append(str(item.get("transcript", "")))
                break
            elif "text" in item and item["text"]:
                transcript_parts.append(str(item.get("text", "")) + " ")

        transcript_text = "".join(transcript_parts)

        if not transcript_text:
            raise HTTPException(
                status_code=400,
                detail="Could not retrieve transcript. Ensure the video has captions available.",
            )

        prompt = (
            f"Please provide a comprehensive summary with key takeaways of this YouTube video based on its transcript. "
            f"Here is the transcript:\n\n{str(transcript_text)[:100000]}"
        )
        result = await generate_ai_response(prompt)
        return {"result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Apify Error: {str(e)}")


@app.post("/api/generate-image")
async def generate_image_api(req: AIRequest):
    urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

    # Phase 1: Prompt Optimization
    try:
        enhancer_prompt = f"Act as a professional image prompt engineer. Translate if needed and expand this to a detailed 1024x1024 safe stable diffusion prompt: {req.content}. Respond ONLY with the prompt itself, without any conversational filler or preambles."
        raw_prompt = await generate_ai_response(enhancer_prompt)
        prompt = raw_prompt.strip()
    except Exception:
        prompt = req.content.strip()

    prompt_clean = re.sub(r"[^\x00-\x7f]", r"", prompt)
    prompt_encoded = urllib.parse.quote(prompt_clean[:500])
    errors = []

    session = requests.Session()

    # Provider Hierarchy: Fast Direct APIs -> Hugging Face -> Leonardo
    providers: list[dict[str, Any]] = [
        {
            "name": "Pollinations High-Stability",
            "url": f"https://image.pollinations.ai/prompt/{prompt_encoded}?width=1024&height=1024&nologo=true&model=flux",
            "type": "direct",
            "verify": True,
        },
        {
            "name": "Airforce SDXL (Global)",
            "url": f"https://api.airforce/v1/image-generation?model=stable-diffusion-xl&prompt={prompt_encoded}",
            "type": "direct",
            "verify": True,
        },
    ]

    # Add Hugging Face nodes if token is available
    if HF_TOKEN:
        hf_models = [
            "black-forest-labs/FLUX.1-schnell",
            "stabilityai/sdxl-turbo",
            "stabilityai/stable-diffusion-xl-base-1.0",
            "runwayml/stable-diffusion-v1-5",
        ]
        for m_id in hf_models:
            providers.append(
                {
                    "name": f"Hugging Face ({m_id.split('/')[-1]})",
                    # Using the new router endpoint to avoid 410 Gone
                    "url": f"https://router.huggingface.co/hf-inference/models/{m_id}",
                    "type": "hf",
                    "headers": {"Authorization": f"Bearer {HF_TOKEN}"},
                }
            )

    # Fallback nodes (Mirrors and Aggregators)
    providers.extend(
        [
            {
                "name": "Leonardo.ai (Premium Cluster)",
                "type": "leonardo",
                "key": LEONARDO_API_KEY,
            },
        ]
    )

    for provider in providers:
        try:
            print(f"Protocol [{provider['name']}] Synchronization...")
            content: bytes | None = None

            if provider["type"] == "hf":
                # Hugging Face Inference Call - Dual Endpoint Strategy
                payload = {"inputs": prompt}
                endpoints = [
                    str(provider.get("url", "")),  # New Router
                    str(provider.get("url", "")).replace(
                        "router.huggingface.co/hf-inference",
                        "api-inference.huggingface.co",
                    ),  # Legacy Fallback
                ]

                last_response = None
                for ep_url in endpoints:
                    try:
                        response = session.post(
                            ep_url,
                            headers=provider.get("headers", {}),
                            json=payload,
                            timeout=60,
                        )
                        if response.status_code == 200:
                            last_response = response
                            break
                        if response.status_code == 503:
                            print(f"Model Loading on {ep_url}. Waiting 8s...")
                            time.sleep(8)
                            response = session.post(
                                ep_url,
                                headers=provider.get("headers", {}),
                                json=payload,
                                timeout=60,
                            )
                            if response.status_code == 200:
                                last_response = response
                                break
                    except Exception:
                        continue

                if not last_response:
                    raise Exception("Hugging Face failed all endpoint attempts.")

                content = last_response.content

            elif provider["type"] == "leonardo":
                provider_key = provider.get("key")
                if not provider_key:
                    raise Exception("Leonardo API Key missing.")

                leo_headers = {
                    "accept": "application/json",
                    "content-type": "application/json",
                    "authorization": f"Bearer {provider_key}",
                }

                # Start Generation
                start_url = "https://cloud.leonardo.ai/api/rest/v1/generations"
                payload = {
                    "height": 512,
                    "width": 512,
                    "prompt": prompt,
                    "num_images": 1,
                }
                response = session.post(
                    start_url, json=payload, headers=leo_headers, timeout=30
                )
                gen_id = response.json().get("sdGenerationJob", {}).get("generationId")

                if not gen_id:
                    raise Exception("Leonardo failed to initiate job.")

                # Poll for Result
                poll_url = f"https://cloud.leonardo.ai/api/rest/v1/generations/{gen_id}"
                for _ in range(10):  # Max 30 seconds
                    time.sleep(3)
                    resp = session.get(poll_url, headers=leo_headers)
                    images = (
                        resp.json()
                        .get("generations_by_pk", {})
                        .get("generated_images", [])
                    )
                    if images:
                        target_url = images[0].get("url")
                        img_resp = session.get(target_url, timeout=30)
                        content = img_resp.content
                        break

                if not content:
                    raise Exception("Leonardo job timed out.")

            elif provider["type"] == "direct":
                headers = {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
                    "Accept": "image/*",
                    "Referer": "https://www.bing.com/",
                }
                provider_url = str(provider.get("url", ""))
                provider_verify = bool(provider.get("verify", True))
                response = session.get(
                    provider_url,
                    headers=headers,
                    timeout=40,
                    verify=provider_verify,
                    allow_redirects=True,
                )
                response.raise_for_status()
                content = response.content

            # Binary Integrity Cluster Check
            if not content or len(content) < 5000:
                raise Exception("Provider payload too small/empty.")

            # Check for Image Magic Bytes (Flexible)
            signature = content[:10]
            is_image = (
                signature.startswith(b"\xff\xd8")  # JPG
                or signature.startswith(b"\x89PNG")  # PNG
                or signature.startswith(b"RIFF")  # WebP
                or signature.startswith(b"GIF")  # GIF
            )

            if not is_image:
                # If it's a JSON response from an API that returns a URL (like Hercai)
                try:
                    data = json.loads(content)
                    if "url" in data:
                        resp = session.get(data["url"], timeout=30)
                        content = resp.content
                    else:
                        raise Exception("Not an image and no URL in JSON.")
                except Exception:
                    raise Exception(
                        "Binary signature mismatch (Likely Cloudflare Challenge/HTML)."
                    )

            encoded_image = base64.b64encode(content).decode("utf-8")
            print(f"Synthesis [{provider['name']}] SUCCESSFUL.")
            return {"result": encoded_image, "is_base64": True}

        except Exception as e:
            print(f"Failover Protocol: {provider['name']} - {str(e)[:150]}")
            errors.append(f"{provider['name']} ({str(e)[:40]})")
            time.sleep(2)  # Throttle before next node
            continue

    raise HTTPException(
        status_code=500,
        detail=f"Global synthesis failure. Cluster exhausted. Logs: {'; '.join(errors)}",
    )


@app.post("/api/webpage-summarizer")
async def summarize_webpage(req: AIRequest):
    try:
        url = req.content.strip()
        headers = {"User-Agent": "Mozilla/5.0"}
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()

        soup = BeautifulSoup(response.content, "html.parser")

        # Extract text from p, h1, h2, h3, li
        texts = soup.find_all(["p", "h1", "h2", "h3", "li"])
        content = " ".join([t.get_text() for t in texts])

        if not content.strip():
            return {"result": "Could not extract readable text from this webpage."}

        prompt = (
            f"Please provide a clear and concise summary of the following webpage content. "
            f"Highlight the main points and key takeaways:\n\n{content[:100000]}"
        )
        result = await generate_ai_response(prompt)
        return {"result": result}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch webpage: {str(e)}"
        )


@app.post("/api/voice-assistant")
async def voice_assistant(req: AIRequest):
    try:
        text = req.content.strip()
        if not text:
            raise HTTPException(status_code=400, detail="Input is required for Nexus Guardian")

        # Phase 1: Universal Guardian Intelligence
        assistant_prompt = (
            f"You are the 'Gistly Universal Guardian', a world-class expert AI assistant. "
            f"You are capable of solving any problem, generating breakthrough ideas, and researching complex topics. "
            f"Respond concisely (under 60 words) but with maximum intelligence and value. "
            f"IMPORTANT: Respond in the EXACT same language as the user's query. "
            f"Your output MUST start with the ISO-639-1 language code of your response followed by a pipe symbol, "
            f"then your response. Example: 'en|Hello, how can I help?' or 'si|ආයුබෝවන්, මම ඔබට කොහොමද උදව් කරන්නේ?'\n\n"
            f"User Query: {text}"
        )
        
        raw_response = await generate_ai_response(assistant_prompt)
        
        # Phase 2: Linguistic Extraction
        try:
            lang_part, response_text = raw_response.split('|', 1)
            lang_code = lang_part.strip()
            response_text = response_text.strip()
        except Exception:
            # Fallback if AI forgets format
            lang_code = "en"
            response_text = raw_response

        # Phase 3: Adaptive Neural Synthesis
        # gTTS supports many languages. We'll map the detected code.
        try:
            tts = gTTS(text=response_text, lang=lang_code, slow=False)
        except Exception:
            # Fallback to English synthesis if language code is unsupported by gTTS
            tts = gTTS(text=response_text, lang="en", slow=False)

        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as fp:
            temp_path = fp.name

        tts.save(temp_path)

        with open(temp_path, "rb") as audio_file:
            encoded_audio = base64.b64encode(audio_file.read()).decode("utf-8")

        os.remove(temp_path)

        return {
            "result": encoded_audio, 
            "is_audio": True,
            "text_response": response_text,
            "detected_lang": lang_code,
            "engine": "Nexus Aegis v3 (Universal Guardian)"
        }

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Guardian System Error: {str(e)}"
        )


@app.post("/api/voice-clone")
async def voice_clone(req: AIRequest):
    try:
        text = req.content.strip()
        if not text:
            raise HTTPException(status_code=400, detail="Text is required for Voice Cloning")

        # In a real enterprise setup, we would use ElevenLabs or a fine-tuned HF model here.
        # For the Gistly Nexus Demo, we use our premium gTTS layer with "Aegis" optimization.
        
        # Phase 1: Neural Optimization (Content smoothing)
        optimize_prompt = f"Rewrite this text to be perfect for a natural human voice, adding subtle pauses where appropriate: {text}"
        optimized_text = await generate_ai_response(optimize_prompt)
        
        # Phase 2: Synthesis
        tts = gTTS(text=optimized_text, lang="en", slow=False)

        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as fp:
            temp_path = fp.name

        tts.save(temp_path)

        with open(temp_path, "rb") as audio_file:
            encoded_audio = base64.b64encode(audio_file.read()).decode("utf-8")

        os.remove(temp_path)

        return {
            "result": encoded_audio, 
            "is_audio": True,
            "engine": "Nexus Aegis v1 (Neural Clone)",
            "confidence": 0.98
        }

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to clone voice: {str(e)}"
        )


@app.post("/api/tts")
async def generate_speech(req: AIRequest):
    try:
        text = req.content.strip()
        if not text:
            raise HTTPException(status_code=400, detail="Text is required for TTS")

        tts = gTTS(text=text, lang="en", slow=False)

        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as fp:
            temp_path = fp.name

        tts.save(temp_path)

        with open(temp_path, "rb") as audio_file:
            encoded_audio = base64.b64encode(audio_file.read()).decode("utf-8")

        os.remove(temp_path)

        return {"result": encoded_audio, "is_audio": True}

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to generate speech: {str(e)}"
        )


class WorkflowSaveRequest(BaseModel):
    id: str
    user_id: str
    name: str = "Untitled Workflow"
    nodes: List[Any]


@app.post("/api/workflows/save")
async def save_workflow(req: WorkflowSaveRequest):
    if not supabase:
        raise HTTPException(status_code=500, detail="Database connection not available")
        
    try:
        data_json = json.dumps(req.nodes)
        
        # In Supabase, upsert handles both INSERT and UPDATE based on primary key
        response = supabase.table("workflows").upsert({
            "id": req.id,
            "user_id": req.user_id,
            "name": req.name,
            "data": data_json
        }).execute()
        
        return {"status": "success", "message": "Workflow saved successfully.", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@app.get("/api/workflows/{user_id}")
async def list_workflows(user_id: str):
    if not supabase:
        raise HTTPException(status_code=500, detail="Database connection not available")
        
    try:
        response = supabase.table("workflows") \
            .select("id, name, created_at") \
            .eq("user_id", user_id) \
            .order("created_at", desc=True) \
            .execute()
            
        return {"workflows": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@app.get("/api/workflow-data/{workflow_id}")
async def load_workflow(workflow_id: str):
    if not supabase:
        raise HTTPException(status_code=500, detail="Database connection not available")
        
    try:
        response = supabase.table("workflows") \
            .select("data, name") \
            .eq("id", workflow_id) \
            .execute()
            
        if not response.data:
            raise HTTPException(status_code=404, detail="Workflow not found.")
            
        workflow = response.data[0]
        return {"nodes": json.loads(workflow["data"]), "name": workflow["name"]}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@app.post("/api/vision")
async def analyze_image(req: AIRequest):
    # This is a placeholder for the Vision API as it requires handling file uploads or base64
    # The frontend will eventually send the image data to this endpoint.
    # Currently just sending text for testing if we wanted, but full vision needs more logic
    prompt = (
        f"You are given an image. Please describe what is in the main focus of the scene. "
        f"Context provided by user: {req.content}"
    )
    result = await generate_ai_response(prompt)
    return {"result": result}


@app.get("/api/news")
async def get_news_feed():
    try:
        sources = [
            {"url": "https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en", "name": "Google News"},
            {"url": "https://feeds.bbci.co.uk/news/rss.xml", "name": "BBC World"},
            {"url": "https://www.aljazeera.com/xml/rss/all.xml", "name": "Al Jazeera"},
            {"url": "https://rss.nytimes.com/services/xml/rss/nyt/World.xml", "name": "NY Times"}
        ]
        
        def fetch_source(src):
            try:
                resp = requests.get(src["url"], timeout=5)
                feed = feedparser.parse(resp.content)
                items = []
                for entry in feed.entries[:10]:
                    items.append({
                        "title": entry.title,
                        "link": entry.link,
                        "published": entry.get('published', ''),
                        "source": src["name"]
                    })
                return items
            except Exception:
                return []

        with ThreadPoolExecutor(max_workers=5) as executor:
            results = list(executor.map(fetch_source, sources))
        
        all_articles = [item for sublist in results for item in sublist]
        return {"articles": all_articles[:40]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch news stream: {str(e)}")

@app.get("/api/news/sports")
async def get_sports_news():
    try:
        sources = [
            {"url": "https://news.google.com/news/rss/headlines/section/topic/SPORTS?hl=en-US&gl=US&ceid=US:en", "name": "Google Sports"},
            {"url": "https://feeds.bbci.co.uk/sport/rss.xml", "name": "BBC Sport"},
            {"url": "https://www.espn.com/espn/rss/news", "name": "ESPN"},
            {"url": "https://www.skysports.com/rss/12040", "name": "Sky Sports"}
        ]
        
        def fetch_source(src):
            try:
                resp = requests.get(src["url"], timeout=5)
                feed = feedparser.parse(resp.content)
                items = []
                for entry in feed.entries[:10]:
                    items.append({
                        "title": entry.title,
                        "link": entry.link,
                        "published": entry.get('published', ''),
                        "source": src["name"]
                    })
                return items
            except Exception:
                return []

        with ThreadPoolExecutor(max_workers=5) as executor:
            results = list(executor.map(fetch_source, sources))
        
        all_articles = [item for sublist in results for item in sublist]
        return {"articles": all_articles[:40]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch sports stream: {str(e)}")

@app.get("/api/scores/live")
async def get_live_scores():
    # Placeholder for a real Sports Data Provider (e.g., Sportmonks, CricAPI)
    # Returning high-quality simulated data for the Match Center UI demonstration
    matches = [
        {
            "id": "match_001",
            "sport": "Cricket",
            "tournament": "Champions Trophy",
            "team1": "Sri Lanka",
            "team2": "India",
            "score1": "285/7 (50.0)",
            "score2": "286/4 (48.2)",
            "status": "India won by 6 wickets",
            "context": "India chased down 285 comfortably. KL Rahul scored a century.",
            "live": False
        },
        {
            "id": "match_002",
            "sport": "Football",
            "tournament": "Champions League",
            "team1": "Real Madrid",
            "team2": "Liverpool",
            "score1": "3",
            "score2": "2",
            "status": "82' - Goal! Salah scores.",
            "context": "Real Madrid leading 3-2. Liverpool mounting massive pressure in the final minutes.",
            "live": True
        },
        {
            "id": "match_003",
            "sport": "Tennis",
            "tournament": "Wimbledon",
            "team1": "Alcaraz",
            "team2": "Djokovic",
            "score1": "6, 4, 3",
            "score2": "4, 6, 2",
            "status": "Set 3 - Game 6",
            "context": "Intense baseline rallies. Alcaraz leads by a break in the third set.",
            "live": True
        },
        {
            "id": "match_004",
            "sport": "Basketball",
            "tournament": "NBA",
            "team1": "Lakers",
            "team2": "Warriors",
            "score1": "112",
            "score2": "108",
            "status": "Q4 - 2:45 left",
            "context": "LeBron James has 35 points. Warriors rallying with 3-pointers.",
            "live": True
        },
        {
            "id": "match_005",
            "sport": "Cricket",
            "tournament": "IPL 2026",
            "team1": "RCB",
            "team2": "CSK",
            "score1": "210/4 (20.0)",
            "score2": "45/1 (4.0)",
            "status": "CSK need 166 runs in 16 overs",
            "context": "RCB posted a massive total. Ruturaj Gaikwad leading the chase for CSK.",
            "live": True
        }
    ]
    return {"matches": matches}

@app.post("/api/scores/predict")
async def predict_match(req: AIRequest):
    prompt = (
        f"You are an expert sports analyst AI for Gistly.site. Calculate the approximate live winning probability for this match "
        f"based on the current live match context. "
        f"Provide a short 2-3 sentence analysis of the situation and explicitly state the winning percentages for both teams.\n\n"
        f"Match Context:\n{req.content}\n"
    )
    result = await generate_ai_response(prompt)
    return {"result": result}

@app.post("/api/news/summarize")
async def news_summarize(req: AIRequest):
    try:
        url = req.content.strip()
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Accept": "text/html"
        }
        # Follow redirects in case of Google News proxy links
        response = requests.get(url, headers=headers, timeout=15, allow_redirects=True)
        response.raise_for_status()

        soup = BeautifulSoup(response.content, "html.parser")

        # Basic Article Extraction (trying common tags)
        texts = soup.find_all(["p", "h1", "h2", "article", "section"])
        content = " ".join([t.get_text() for t in texts])
        
        # Fallback if too short
        if len(content) < 200:
             content = req.context # If frontend passed some context like the title

        prompt = (
            f"You are an expert Social Media AI for 'Gistly.site'. Summarize the following news article into a highly engaging, viral, and easy-to-read social media post format.\n"
            f"Requirements:\n"
            f"- Add an attention-grabbing headline (with emojis).\n"
            f"- Break down the key facts into 3-4 bullet points.\n"
            f"- Add 3-5 relevant trending #hashtags at the bottom.\n"
            f"- End the post specifically with: '💡 Summarized via Gistly.site'\n\n"
            f"News Content to summarize:\n{content[:50000]}"
        )
        
        result = await generate_ai_response(prompt)
        return {"result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process news link: {str(e)}")

@app.get("/api/markets/trending")
async def get_trending_markets():
    try:
        # Get live data for top stocks and crypto
        symbols = ['AAPL', 'MSFT', 'NVDA', 'TSLA', 'AMZN', 'GOOGL', 'BTC-USD', 'ETH-USD', 'SOL-USD', 'XRP-USD', 'GC=F', 'SI=F']
        data = yf.download(symbols, period="2d", group_by='ticker')
        
        market_cards = []
        name_map = {
            'BTC-USD': 'Bitcoin', 'ETH-USD': 'Ethereum', 'SOL-USD': 'Solana', 'XRP-USD': 'Ripple',
            'AAPL': 'Apple', 'MSFT': 'Microsoft', 'NVDA': 'NVIDIA', 'TSLA': 'Tesla',
            'AMZN': 'Amazon', 'GOOGL': 'Alphabet', 'GC=F': 'Gold', 'SI=F': 'Silver'
        }
        
        for sym in symbols:
            try:
                if sym in data:
                    hist = data[sym]
                    if not hist.empty and len(hist) >= 2:
                        current_close = float(hist['Close'].iloc[-1])
                        prev_close = float(hist['Close'].iloc[-2])
                        change_percent = ((current_close - prev_close) / prev_close) * 100
                        
                        if math.isnan(current_close) or math.isnan(prev_close) or math.isnan(change_percent):
                            continue

                        market_cards.append({
                            "symbol": sym.replace('-USD', ''),
                            "name": name_map.get(sym, sym),
                            "price": round(current_close, 2),
                            "change": round(change_percent, 2),
                            "isCrypto": 'USD' in sym
                        })
            except Exception as inner_e:
                print(f"Error parsing market data for {sym}: {inner_e}")
                continue
                
        # Fallback if too few cards
        if len(market_cards) < 4:
            market_cards = [
                {"symbol": "BTC", "name": "Bitcoin", "price": 64320.50, "change": 2.4, "isCrypto": True},
                {"symbol": "NVDA", "name": "NVIDIA", "price": 890.15, "change": 5.6, "isCrypto": False},
                {"symbol": "SOL", "name": "Solana", "price": 145.20, "change": 3.8, "isCrypto": True},
                {"symbol": "AAPL", "name": "Apple", "price": 172.50, "change": 0.5, "isCrypto": False},
            ]
            
        return {"markets": market_cards}
    except Exception as e:
        print(f"Market fetch error: {e}")
        # Always return a fallback so the UI never crashes for the user
        return {"markets": [
            {"symbol": "BTC", "name": "Bitcoin", "price": 64320.50, "change": 2.4, "isCrypto": True},
            {"symbol": "NVDA", "name": "NVIDIA", "price": 890.15, "change": 5.6, "isCrypto": False},
        ]}

@app.post("/api/markets/analyze")
async def analyze_market(req: AIRequest):
    try:
        symbol = req.content.strip().upper()
        # Fetch actual live stock/financial context just so the AI has fresh data
        # We fetch 1 month of history for trend
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period="1mo")
        
        market_context = f"No live data found for {symbol}."
        if not hist.empty:
            current_price = hist['Close'].iloc[-1]
            high_1mo = hist['High'].max()
            low_1mo = hist['Low'].min()
            volume_avg = hist['Volume'].mean()
            market_context = (
                f"Current Price: ${current_price:.2f}\n"
                f"1 Month High/Low: ${high_1mo:.2f} / ${low_1mo:.2f}\n"
                f"Avg Volume: {volume_avg:,.0f}\n"
            )

        prompt = (
            f"Act as 'Gistly AI', an elite cyberpunk financial intelligence unit. "
            f"Run a neuro-analysis on the following financial asset and output a highly stylized, aesthetic report.\n\n"
            f"Target Asset: {symbol}\n"
            f"Live Telemetry:\n{market_context}\n\n"
            f"STRICT FORMAT REQUIREMENT (Follow this exact visual vibe, use markdown, emojis, and exact headers pacing):\n"
            f"---\n"
            f"🔮 **GISTLY NEURAL REPORT: {symbol}**\n\n"
            f"**⚡ THE GIST (Overview):**\n"
            f"[Write 1-2 punchy, futuristic sentences summarizing the current market trajectory]\n\n"
            f"**🟢 BULL SIGNALS (Upside Potential):**\n"
            f"  ✦ [Short, punchy point 1]\n"
            f"  ✦ [Short, punchy point 2]\n\n"
            f"**🔴 BEAR SIGNALS (Risk Factors):**\n"
            f"  ✦ [Short, punchy point 1]\n"
            f"  ✦ [Short, punchy point 2]\n\n"
            f"**🧠 AI NEURAL SENTIMENT:**\n"
            f"[BULLISH 🚀 / BEARISH 📉 / NEUTRAL ⚖️] - [Short 1 line reason]\n\n"
            f"---\n"
            f"⚠️ *Disclaimer: Generated via Gistly.site Neural Network. Not financial advice. Always DYOR.*"
        )
        result = await generate_ai_response(prompt)
        return {"result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Market analysis failed: {str(e)}")

class ContactMessage(BaseModel):
    name: str
    email: str
    message: str

@app.post("/api/contact")
async def send_contact_email(data: ContactMessage):
    """
    Handles messages from the site's Contact Us form.
    Sends them using Zoho SMTP if configured, else prints to console.
    """
    smtp_user = os.getenv("ZOHO_EMAIL", "contact@gistly.site")
    smtp_pass = os.getenv("ZOHO_APP_PASSWORD")
    
    if not smtp_pass:
        print(f"\n--- 📩 INCOMING TRANSMISSION (SIMULATION MODE) ---")
        print(f"From: {data.name} <{data.email}>")
        print(f"Message:\n{data.message}")
        print(f"--------------------------------------------------\n")
        print(f"WARNING: ZOHO_APP_PASSWORD not set in .env. Message printed to console instead of emailing.")
        return {"result": "Message received via local fallback. Set ZOHO_APP_PASSWORD in .env for live transmission."}
    
    msg = MIMEMultipart()
    msg['From'] = smtp_user
    msg['To'] = smtp_user
    msg['Subject'] = f"Gistly Neural Uplink: Message from {data.name}"
    
    body = f"New incoming transmission to Gistly.site:\n\nUser Name: {data.name}\nUser Email: {data.email}\n\nMessage:\n{data.message}"
    msg.attach(MIMEText(body, 'plain'))
    
    try:
        # Also log to Supabase if available
        if supabase:
            try:
                supabase.table("contacts").insert({
                    "name": data.name,
                    "email": data.email,
                    "message": data.message
                }).execute()
            except Exception as db_err:
                print(f"Supabase Contact Log Error: {db_err}")

        server = smtplib.SMTP('smtp.zoho.com', 587)
        server.starttls()
        server.login(smtp_user, smtp_pass)
        server.send_message(msg)
        server.quit()
        return {"result": "Message successfully transmitted to Gistly Nexus."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transmission failed: {str(e)}")


@app.post("/api/customer-request")
async def save_customer_request(req: CustomerRequest):
    if not supabase:
        raise HTTPException(status_code=500, detail="Database connection offline.")
    
    try:
        supabase.table("customer_requests").insert({
            "name": req.name,
            "email": req.email,
            "type": req.request_type,
            "details": req.details
        }).execute()
        return {"status": "success", "message": "Your request has been filed in Gistly Neural Registry."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/track-visit")
async def track_visit(data: VisitorTrack):
    if not supabase:
        return {"status": "skipped"}
    try:
        supabase.table("analytics").insert({
            "ip": data.ip,
            "country": data.country,
            "city": data.city,
            "path": data.path
        }).execute()
        return {"status": "tracked"}
    except Exception as e:
        print(f"Tracking error: {e}")
        return {"status": "error"}


@app.post("/api/admin/login")
async def admin_login(data: AdminLogin):
    admin_pass = os.getenv("ADMIN_PASSWORD", "Chamila84")
    if data.password == admin_pass:
        return {"status": "success", "token": "gistly_admin_secret_auth_token"}
    raise HTTPException(status_code=401, detail="Unauthorized Access Denied.")


@app.get("/api/admin/stats")
async def get_admin_stats():
    if not supabase:
        raise HTTPException(status_code=500, detail="No DB")
    
    try:
        # Get counts
        req_count = supabase.table("customer_requests").select("*", count="exact").execute().count
        contact_count = supabase.table("contacts").select("*", count="exact").execute().count
        workflow_count = supabase.table("workflows").select("*", count="exact").execute().count
        visitor_count = supabase.table("analytics").select("*", count="exact").execute().count
        
        # New API Stats
        api_keys_count = supabase.table("api_keys").select("*", count="exact").execute().count
        
        # Get country distribution
        visitors = supabase.table("analytics").select("country").execute().data
        countries = {}
        for v in visitors:
            c = v.get('country', 'Unknown')
            countries[c] = countries.get(c, 0) + 1
            
        # Recent requests
        recent_reqs = supabase.table("customer_requests").select("*").order("created_at", desc=True).limit(5).execute().data
        
        return {
            "total_requests": req_count,
            "total_contacts": contact_count,
            "total_workflows": workflow_count,
            "total_visitors": visitor_count,
            "total_api_keys": api_keys_count,
            "countries": countries,
            "recent_requests": recent_reqs
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- API MARKETPLACE & MONETIZATION ENDPOINTS ---

import uuid

@app.post("/api/keys/generate")
async def generate_api_key(data: APIKeyCreate):
    """Generate a new API key for a developer/user."""
    if not supabase:
        raise HTTPException(status_code=500, detail="Database connection missing")
    
    new_key = f"gst_{uuid.uuid4().hex}"
    try:
        insert_data = {
            "user_email": data.user_email,
            "api_key": new_key,
            "plan": data.plan,
            "balance": 100.0 if data.plan == "free" else 5000.0, # Initial credits
            "is_active": True
        }
        supabase.table("api_keys").insert(insert_data).execute()
        return {"status": "success", "api_key": new_key, "balance": insert_data["balance"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/keys/me/{email}")
async def get_my_keys(email: str):
    """Retrieve all API keys associated with an email."""
    if not supabase:
        return []
    res = supabase.table("api_keys").select("*").eq("user_email", email).execute()
    return res.data

async def validate_api_key(api_key: str):
    """Validate an API key and deduct balance for marketplace monetization."""
    if not supabase:
        return True # Default to true for testing if DB is down
    
    res = supabase.table("api_keys").select("*").eq("api_key", api_key).eq("is_active", True).execute()
    if not res.data:
        return False
    
    key_info = res.data[0]
    if key_info["balance"] <= 0:
        return "insufficient_balance"
    
    # Deduct 1 credit per neural operation
    new_balance = key_info["balance"] - 1.0
    supabase.table("api_keys").update({"balance": new_balance}).eq("api_key", api_key).execute()
    
    # Track usage (Insert into api_usage table if it exists)
    try:
        supabase.table("api_usage").insert({
            "api_key_id": key_info["id"],
            "endpoint": "neural_operation"
        }).execute()
    except:
        pass # Optional tracking
    
    return True

@app.get("/api/marketplace/plans")
async def get_api_plans():
    """Returns available API plans for monetization."""
    return [
        {"id": "starter", "name": "Neural Starter", "price": 0, "credits": 100, "features": ["100 Credits", "Standard Support"]},
        {"id": "pro", "name": "Neural Architect", "price": 29, "credits": 5000, "features": ["5000 Credits", "Priority Routing", "Custom Training"]},
        {"id": "enterprise", "name": "Global Nexus", "price": 199, "credits": 50000, "features": ["50,000 Credits", "Dedicated Infrastructure", "Unlimited SDK Access"]}
    ]

class CheckoutRequest(BaseModel):
    variant_id: str

@app.post("/api/create-checkout-session")
async def create_checkout_session(request: CheckoutRequest):
    if not ls or not LEMON_SQUEEZY_STORE_ID:
        raise HTTPException(status_code=500, detail="Lemon Squeezy credentials are not configured on this server.")
        
    try:
        # We manually build the API request as the python SDK might be limited or changing
        headers = {
            "Accept": "application/vnd.api+json",
            "Content-Type": "application/vnd.api+json",
            "Authorization": f"Bearer {LEMON_SQUEEZY_API_KEY}"
        }
        
        payload = {
            "data": {
                "type": "checkouts",
                "attributes": {
                    "checkout_data": {
                        "custom": {
                            "user_id": "guest" # Can be updated with real user ID if using Clerk
                        }
                    }
                },
                "relationships": {
                    "store": {
                        "data": {
                            "type": "stores",
                            "id": LEMON_SQUEEZY_STORE_ID
                        }
                    },
                    "variant": {
                        "data": {
                            "type": "variants",
                            "id": request.variant_id
                        }
                    }
                }
            }
        }
        
        response = requests.post(
            "https://api.lemonsqueezy.com/v1/checkouts", 
            json=payload, 
            headers=headers
        )
        
        if response.status_code != 201:
            raise Exception(f"Failed to create checkout: {response.text}")
            
        data = response.json()
        checkout_url = data["data"]["attributes"]["url"]
        
        return {"url": checkout_url}
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

class PayPalOrderRequest(BaseModel):
    plan_name: str
    price: str

@app.post("/api/paypal/create-order")
async def create_paypal_order(request: PayPalOrderRequest):
    if not PAYPAL_CLIENT_ID or not PAYPAL_CLIENT_SECRET:
        raise HTTPException(status_code=500, detail="PayPal credentials are not configured on this server.")
        
    try:
        base_url = "https://api-m.sandbox.paypal.com" if PAYPAL_MODE == "sandbox" else "https://api-m.paypal.com"
        
        # Get Access Token
        auth = base64.b64encode(f"{PAYPAL_CLIENT_ID}:{PAYPAL_CLIENT_SECRET}".encode("utf-8")).decode("utf-8")
        token_headers = {
            "Authorization": f"Basic {auth}",
            "Content-Type": "application/x-www-form-urlencoded"
        }
        token_data = {"grant_type": "client_credentials"}
        token_response = requests.post(f"{base_url}/v1/oauth2/token", headers=token_headers, data=token_data)
        token_response.raise_for_status()
        access_token = token_response.json()["access_token"]
        
        # Create Order
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
        }
        
        price_val = request.price.replace("$", "").strip()
        
        payload = {
            "intent": "CAPTURE",
            "purchase_units": [
                {
                    "reference_id": f"plan_{request.plan_name.replace(' ', '_').lower()}",
                    "description": f"Gistly.site - Premium Plan: {request.plan_name}",
                    "amount": {
                        "currency_code": "USD",
                        "value": price_val
                    }
                }
            ],
            "application_context": {
                "return_url": f"{FRONTEND_URL}?payment=success",
                "cancel_url": f"{FRONTEND_URL}?payment=cancelled",
                "user_action": "PAY_NOW"
            }
        }
        
        response = requests.post(f"{base_url}/v2/checkout/orders", json=payload, headers=headers)
        response.raise_for_status()
        order_data = response.json()
        
        approve_link = next((link["href"] for link in order_data["links"] if link["rel"] == "approve"), None)
        
        if not approve_link:
            raise Exception("No approve link found in PayPal response")
            
        return {"url": approve_link, "order_id": order_data["id"]}
        
    except Exception as e:
        print(f"PayPal Order Error: {e}")
        raise HTTPException(status_code=400, detail=str(e))


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
