from flask import Flask, render_template
from flask import request, jsonify

import hashlib
import os

from encryption import encrypt_data, decrypt_data
from firebase_config import db, bucket

from risk_engine import calculate_risk
from governance_engine import evaluate_access
from audit_engine import create_audit_log

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("landing.html")

@app.route("/login")
def login():
    return render_template("login.html")

@app.route("/register")
def register():
    return render_template("register.html")

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")

@app.route("/superadmin")
def superadmin():
    return render_template("superadmin.html")

@app.route("/users")
def users():
    return render_template("users.html")

@app.route("/vault")
def vault():
    return render_template("vault.html")

@app.route("/governance")
def governance():

    return render_template(
        "governance.html"
    )

@app.route(
"/create-policy",
methods=["POST"]
)
def create_policy():

    data = request.json

    db.collection(
    "policies"
    ).add({

        "role":
        data["role"],

        "classification":
        data["classification"],

        "action":
        data["action"]

    })

    create_audit_log(
        "Policy Created"
    )

    return {

        "success":True
    }

@app.route(
"/list-policies"
)
def list_policies():

    docs = db.collection(
    "policies"
    ).stream()

    results=[]

    for doc in docs:

        results.append(
        doc.to_dict()
        )

    return results
@app.route("/upload-file", methods=["POST"])
def upload_file():

    uploaded_file = request.files["file"]

    classification = request.form["classification"]

    role = request.form.get("role","User")

    policies = db.collection(
        "policies" ).stream()
    
    policies = []

    for doc in policies_docs:
        policies.append(
            doc.to_dict()
        )

    file_bytes = uploaded_file.read()

    allowed = evaluate_access(
        role,
        classification,
        policies
    )

    if not allowed:
        create_audit_log(
            f"Policy violation: {uploaded_file.filename}"
        )
        return{
            "success":False,
            "message": "Governance Policy Denied Access"
        }

    encrypted_bytes = encrypt_data(file_bytes)

    risk_score = calculate_risk(
        classification
    )

    hash_value = hashlib.sha256(
        file_bytes
    ).hexdigest()

    encrypted_name = (
        str(hash_value[:10]) +
        "_" +
        uploaded_file.filename +
        ".enc"
    )

    save_path = os.path.join(
        "uploads",
        encrypted_name
    )

    with open(save_path, "wb") as f:

        f.write(encrypted_bytes)

    blob = bucket.blob("encrypted_files/" + encrypted_name)
    blob.upload_from_filename(save_path)
    blob.make_public()
    storage_url = blob.public_url

    db.collection("files").add({

        "fileName":
        uploaded_file.filename,

        "encryptedFile":
        encrypted_name,

        "classification":
        classification,

        "riskScore":
        risk_score,

        "hash":
        hash_value,

        "encryption":
        "AES-256",

        "storageUrl":
        storage_url,

        "status":
        "secured"

        

    })

    create_audit_log(
        f"Uploaded {uploaded_file.filename}"
    )

    return jsonify({

        "success": True,

        "hash": hash_value,

        "riskScore": risk_score

    })


@app.route("/list-files")
def list_files():

    docs = db.collection(
        "files"
    ).stream()

    results = []

    for doc in docs:

        data = doc.to_dict()

        data["id"] = doc.id

        results.append(data)

    return results

from flask import send_file

@app.route("/decrypt/<filename>")
def decrypt_file(filename):

    encrypted_path = os.path.join(
        "uploads",
        filename
    )

    with open(
        encrypted_path,
        "rb"
    ) as f:

        encrypted_data = f.read()

    decrypted_data =decrypt_data(
        encrypted_data
    )

    original_name =filename.replace(".enc","")

    output_path = os.path.join(
        "downloads",
        original_name
    )

    with open(
        output_path,
        "wb"
    ) as f:

        f.write(
            decrypted_data
        )

    create_audit_log(
        f"Decrypted {filename}"
    )

    return send_file(
        output_path,
        as_attachment=True
    )

@app.route("/audit")
def audit():

    return render_template(
        "audit.html"
    )

@app.route("/audit-data")
def audit_data():

    docs = db.collection(
        "audit_logs"
    ).stream()

    result=[]

    for doc in docs:

        result.append(
            doc.to_dict()
        )

    return result

@app.route("/risk")
def risk():

    return render_template(
        "risk.html"
    )

@app.route("/risk-data")
def risk_data():

    docs = db.collection(
        "files"
    ).stream()

    low = 0
    medium = 0
    high = 0
    critical = 0

    for doc in docs:

        file = doc.to_dict()

        score = file.get(
            "riskScore",
            0
        )

        if score <= 25:

            low += 1

        elif score <= 50:

            medium += 1

        elif score <= 75:

            high += 1

        else:

            critical += 1

    return {

        "low":low,

        "medium":medium,

        "high":high,

        "critical":critical

    }

@app.route("/compliance")
def compliance():

    return render_template(
        "compliance.html"
    )


@app.route(
"/request-access",
methods=["POST"]
)
def request_access():

    data = request.json

    db.collection(
    "access_requests"
    ).add({

        "fileName":
        data["fileName"],

        "riskScore":
        data["riskScore"],

        "user":
        data["user"],

        "status":
        "Pending"

    })

    create_audit_log(
        f"Access Requested: "
        f"{data['fileName']}"
    )

    return {

        "success":True
    }

@app.route("/access")
def access():

    return render_template(
        "access_requests.html"
    )

@app.route("/access-data")
def access_data():

    docs = db.collection(
        "access_requests"
    ).stream()

    result=[]

    for doc in docs:

        data = doc.to_dict()

        data["id"] = doc.id

        result.append(data)

    return result

@app.route(
"/approve-request/<request_id>",
methods=["POST"]
)
def approve_request(
request_id
):

    db.collection(
    "access_requests"
    ).document(
    request_id
    ).update({

        "status":
        "Approved"

    })

    create_audit_log(
        f"Access Approved"
    )

    return {

        "success":True
    }

@app.route(
"/reject-request/<request_id>",
methods=["POST"]
)
def reject_request(
request_id
):

    db.collection(
    "access_requests"
    ).document(
    request_id
    ).update({

        "status":
        "Rejected"

    })

    create_audit_log(
        f"Access Rejected"
    )

    return {

        "success":True
    }


@app.route("/dashboard-stats")
def dashboard_stats():

    users = len(
        list(
            db.collection(
                "users"
            ).stream()
        )
    )

    files = len(
        list(
            db.collection(
                "files"
            ).stream()
        )
    )

    policies = len(
        list(
            db.collection(
                "policies"
            ).stream()
        )
    )

    requests = len(
        list(
            db.collection(
                "access_requests"
            ).stream()
        )
    )

    return {

        "users":users,

        "files":files,

        "policies":policies,

        "requests":requests

    }

@app.route("/recent-activities")
def recent_activities():

    docs = db.collection(
        "audit_logs"
    ).stream()

    activities = []

    for doc in docs:

        activities.append(
            doc.to_dict()
        )

    activities.reverse()

    return activities[:10]

@app.route("/executive-dashboard")
def executive_dashboard():

    files = list(
        db.collection(
            "files"
        ).stream()
    )

    requests = list(
        db.collection(
            "access_requests"
        ).stream()
    )

    low = 0
    medium = 0
    high = 0
    critical = 0

    for doc in files:

        data = doc.to_dict()

        score = data.get(
            "riskScore",
            0
        )

        if score <= 25:

            low += 1

        elif score <= 50:

            medium += 1

        elif score <= 75:

            high += 1

        else:

            critical += 1

    return {

        "low": low,

        "medium": medium,

        "high": high,

        "critical": critical,

        "pendingRequests":
        len([
            r for r in requests
            if r.to_dict().get(
                "status"
            ) == "Pending"
        ]),

        "approvedRequests":
        len([
            r for r in requests
            if r.to_dict().get(
                "status"
            ) == "Approved"
        ]),

        "rejectedRequests":
        len([
            r for r in requests
            if r.to_dict().get(
                "status"
            ) == "Rejected"
        ])

    }


@app.route("/preview")
def preview():

    return render_template(
        "preview.html"
    )

@app.route("/file-metadata")
def file_metadata():

    file_name = request.args.get(
        "file"
    )

    docs = db.collection(
        "files"
    ).where(
        "fileName",
        "==",
        file_name
    ).stream()

    for doc in docs:

        return doc.to_dict()

    return {}

@app.route("/architecture")
def architecture():

    return render_template(
        "architecture.html"
    )

@app.route("/threat")
def threat():

    return render_template(
        "threat.html"
    )

if __name__ == "__main__":
    app.run(debug=True)