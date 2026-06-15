import firebase_admin

from firebase_admin import credentials
from firebase_admin import firestore
from firebase_admin import storage

cred = credentials.Certificate(
    "serviceAccountKey.json"
)

if not firebase_admin._apps:

    firebase_admin.initialize_app(
        cred,
        {
            "storageBucket":
            "data-governance-940cf.firebasestorage.app"
        }
    )

db = firestore.client()

bucket = storage.bucket()