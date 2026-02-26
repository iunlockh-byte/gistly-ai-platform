import os
import base64
import requests
import json
import re
import urllib3
import time
import urllib.parse
import sqlite3
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from apify_client import ApifyClient
from groq import Groq
from bs4 import BeautifulSoup
from gtts import gTTS
import tempfile
from dotenv import load_dotenv
from typing import Any, List

# Load environment variables
load_dotenv()

# Database Initialization
DB_PATH = "gistly_core.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS workflows (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            name TEXT,
            data TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

init_db()

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
model = genai.GenerativeModel("gemini-flash-latest")
apify_client = ApifyClient(APIFY_TOKEN) if APIFY_TOKEN else None
groq_client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

app = FastAPI(
    title="Gistly Multi-Tool API",
    description="Backend for Gistly AI's suite of developer and creator tools.",
    version="2.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AIRequest(BaseModel):
    content: str
    context: str = ""


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

    # Provider Hierarchy: Hugging Face (New Router) -> Airforce/Mirror (Failover)
    providers: list[dict[str, Any]] = []

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
            {
                "name": "Airforce SDXL (Global)",
                "url": f"https://api.airforce/v1/image-generation?model=stable-diffusion-xl&prompt={prompt_encoded}",
                "type": "direct",
                "verify": True,
            },
            {
                "name": "Pollinations High-Stability",
                "url": f"https://image.pollinations.ai/prompt/{prompt_encoded}?width=1024&height=1024&nologo=true&model=flux",
                "type": "direct",
                "verify": True,
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
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Check if exists
        cursor.execute("SELECT id FROM workflows WHERE id = ?", (req.id,))
        exists = cursor.fetchone()
        
        data_json = json.dumps(req.nodes)
        
        if exists:
            cursor.execute(
                "UPDATE workflows SET data = ?, name = ? WHERE id = ?",
                (data_json, req.name, req.id)
            )
        else:
            cursor.execute(
                "INSERT INTO workflows (id, user_id, name, data) VALUES (?, ?, ?, ?)",
                (req.id, req.user_id, req.name, data_json)
            )
            
        conn.commit()
        conn.close()
        return {"status": "success", "message": "Workflow saved successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@app.get("/api/workflows/{user_id}")
async def list_workflows(user_id: str):
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT id, name, created_at FROM workflows WHERE user_id = ? ORDER BY created_at DESC", (user_id,))
        rows = cursor.fetchall()
        conn.close()
        
        workflows = [{"id": r[0], "name": r[1], "created_at": r[2]} for r in rows]
        return {"workflows": workflows}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@app.get("/api/workflow-data/{workflow_id}")
async def load_workflow(workflow_id: str):
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT data, name FROM workflows WHERE id = ?", (workflow_id,))
        row = cursor.fetchone()
        conn.close()
        
        if not row:
            raise HTTPException(status_code=404, detail="Workflow not found.")
            
        return {"nodes": json.loads(row[0]), "name": row[1]}
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


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
