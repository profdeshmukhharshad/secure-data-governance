from datetime import datetime

from firebase_config import db

def create_audit_log(action):

    db.collection(
        "audit_logs"
    ).add({

        "action": action,

        "timestamp":
        datetime.now()
        .strftime(
            "%d-%m-%Y %H:%M:%S"
        )

    })

    print(
        f"[AUDIT] {action}"
    )