import requests
import uuid

# 1. Register a new user
email = f"test_{uuid.uuid4().hex[:6]}@test.com"
register_res = requests.post(
    "http://localhost:8001/api/auth/register",
    json={"name": "New User", "email": email, "password": "password"}
)
print("Registration Status:", register_res.status_code)
token = register_res.json().get("access_token")

# 2. Save Profile multiple times to trigger upsert
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
print("Saving Profile (1st time)...")
profile_res1 = requests.post(
    "http://localhost:8001/api/profile",
    json=profile_payload,
    headers=headers
)
print("Profile 1 Status:", profile_res1.status_code)

print("Saving Profile (2nd time)...")
profile_res2 = requests.post(
    "http://localhost:8001/api/profile",
    json=profile_payload,
    headers=headers
)
print("Profile 2 Status:", profile_res2.status_code)
if profile_res2.status_code != 200 and profile_res2.status_code != 201:
    print("Profile 2 Error:", profile_res2.text)
