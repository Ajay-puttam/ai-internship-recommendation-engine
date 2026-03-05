import traceback
from app.database import SessionLocal
from app.models.user import User
from app.core.security import hash_password

try:
    db = SessionLocal()
    email = "test4@test.com"
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        print("Already exists")
    else:
        user = User(
            name="Test",
            email=email,
            password_hash=hash_password("password")
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        print("Created user:", getattr(user, "id", "No ID"))
except Exception as e:
    print("Exception occurred:")
    traceback.print_exc()
finally:
    db.close()
