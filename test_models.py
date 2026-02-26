import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv('backend/.env')
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))

# Updated models list based on the models_list.txt
models_to_test = [
    'gemini-2.0-flash', 
    'gemini-1.5-flash', 
    'gemini-pro', 
    'gemini-flash-latest', 
    'gemini-1.5-flash-8b'
]

print("Testing models for availability and quota...")
for m_name in models_to_test:
    try:
        print(f"Testing {m_name}...", end=" ", flush=True)
        model = genai.GenerativeModel(m_name)
        response = model.generate_content("hi")
        print("SUCCESS")
        print(f"\nFOUND WORKING MODEL: {m_name}")
        exit(0)
    except Exception as e:
        print(f"FAILED - {str(e)[:100]}...")

print("\nNo working model found with current quota.")
exit(1)
