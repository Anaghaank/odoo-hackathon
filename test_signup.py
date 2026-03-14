import requests
import json

url = 'http://localhost:8069/api/auth/signup'
payload = {
    'params': {
        'name': 'Python Test',
        'organisation': 'Python Org',
        'email': 'python@test.com',
        'phone': '9876543210'
    }
}
headers = {'Content-Type': 'application/json'}

try:
    print(f"Sending POST request to {url}...")
    response = requests.post(url, data=json.dumps(payload), headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
