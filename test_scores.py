import requests

url = "http://127.0.0.1:8000/api/scores/live"
headers = {
    "X-Nexus-Shield": "G7-NX-SECURITY-V1-ALPHA"
}

try:
    print(f"Connecting to {url}...")
    response = requests.get(url, headers=headers, timeout=5)
    print(f"Status: {response.status_code}")
    print(response.json())
except Exception as e:
    print(f"Error: {e}")
