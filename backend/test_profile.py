import requests

# 1. Login to get token First
login_res = requests.post(
    "http://localhost:8000/api/auth/login",
    json={"email": "test4@test.com", "password": "password"}
)
print("Login Status:", login_res.status_code)
token = login_res.json().get("access_token")

# 2. Save Profile
profile_payload = {
    "degree": "BTech",
    "branch": "CS",
    "college": "IIT",
    "skills": ["Python", "JS"],
    "interests": ["AI"],
    "location_preference": "Remote",
    "internship_mode": "remote"
}

headers = {"Authorization": f"Bearer {token}"}
print("Saving Profile...")
profile_res = requests.post(
    "http://localhost:8000/api/profile",
    json=profile_payload,
    headers=headers
)
print("Profile Status:", profile_res.status_code)
print("Profile Response:", profile_res.text)
