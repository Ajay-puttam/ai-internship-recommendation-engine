from app.database import engine, Base
from sqlalchemy import inspect

try:
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    print("Database tables:", tables)
except Exception as e:
    print("DB Error:", e)
