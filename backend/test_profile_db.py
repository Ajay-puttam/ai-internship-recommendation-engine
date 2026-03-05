import traceback
from app.database import SessionLocal
from app.models.profile import Profile
from app.models.user import User

try:
    db = SessionLocal()
    user = db.query(User).filter(User.email == "test4@test.com").first()
    
    if not user:
        print("User not found")
    else:
        profile = Profile(
            user_id=user.id,
            degree="BTech",
            branch="CS",
            college="IIT",
            skills=["Python", "JS"],
            interests=["AI"],
            location_preference="Remote",
            internship_mode="remote"
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
        print("Created profile for user:", user.email)
except Exception as e:
    print("Exception occurred:")
    traceback.print_exc()
finally:
    db.close()
