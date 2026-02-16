import firebase_admin
from firebase_admin import credentials, firestore
from app.core.config import settings

# Initialize Firebase Admin SDK once at startup (singleton)
_cred = credentials.Certificate({
    "type": "service_account",
    "project_id": settings.FIREBASE_PROJECT_ID,
    "private_key": settings.FIREBASE_PRIVATE_KEY.replace("\\n", "\n"),
    "client_email": settings.FIREBASE_CLIENT_EMAIL,
    "token_uri": "https://oauth2.googleapis.com/token",
})

firebase_app = firebase_admin.initialize_app(_cred)
db = firestore.client()