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
        # Simulate router logic
        profile = db.query(Profile).filter(Profile.user_id == user.id).first()
        if profile:
            print("Existing profile id:", profile.id)
            profile.degree = "MTech"
            profile.location_preference = "Delhi"
        else:
            print("Creating new Profile")
            profile = Profile(
                user_id=user.id,
                degree="BTech",
            )
            db.add(profile)
        
        db.commit()
        db.refresh(profile)
        print("Final Profile Degree:", profile.degree)

except Exception as e:
    print("Exception occurred:")
    traceback.print_exc()
finally:
    db.close()
