import requests
import os
from dotenv import load_dotenv

load_dotenv('backend/.env')
key = os.getenv("LEONARDO_API_KEY")

headers = {
    'accept': 'application/json',
    'content-type': 'application/json',
    'authorization': f'Bearer {key}'
}
payload = {
    'height': 512,
    'width': 512,
    'prompt': 'A futuristic flying car over a cyberpunk city',
    'num_images': 1
}

res = requests.post('https://cloud.leonardo.ai/api/rest/v1/generations', json=payload, headers=headers)
print(res.status_code)
print(res.text)
