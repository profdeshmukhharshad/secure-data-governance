import os
import firebase_admin

from firebase_admin import credentials
from firebase_admin import firestore
from firebase_admin import storage

firebase_credentials = {

    "type": "service_account",

    "project_id":
    os.environ.get(
        "FIREBASE_PROJECT_ID"
    ),

    "private_key":
    os.environ.get(
        "FIREBASE_PRIVATE_KEY"
    ).replace("\\n", "\n"),

    "client_email":
    os.environ.get(
        "FIREBASE_CLIENT_EMAIL"
    ),

    "token_uri":
    "https://oauth2.googleapis.com/token"

}

cred = credentials.Certificate(
    firebase_credentials
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