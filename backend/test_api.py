import requests

try:
    response = requests.post(
        "http://localhost:8000/api/auth/register",
        json={"name": "Test", "email": "test2@test.com", "password": "password123"}
    )
    print("Status:", response.status_code)
    print("Response:", response.text)
except Exception as e:
    print("Error:", e)
