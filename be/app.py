from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import time
from werkzeug.utils import secure_filename
from functools import wraps

import firebase_admin
from firebase_admin import credentials, firestore, auth as firebase_auth


app = Flask(__name__)

CORS(
    app,
    supports_credentials=True,
    origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_headers="*",
    methods=["GET", "POST", "OPTIONS", "PUT", "DELETE"],
)


# Initialize Firebase Admin SDK using a service account JSON (set GOOGLE_APPLICATION_CREDENTIALS)
# In Cloud Run / GCP this can use Application Default Credentials instead.
if os.environ.get("GOOGLE_APPLICATION_CREDENTIALS"):
    cred = credentials.Certificate(os.environ.get("GOOGLE_APPLICATION_CREDENTIALS"))
    firebase_admin.initialize_app(
        cred, {"projectId": os.environ.get("GOOGLE_CLOUD_PROJECT")}
    )
else:
    # uses ADC in production environments (Cloud Run)
    firebase_admin.initialize_app()

# Firestore client
db = firestore.client()

# Configuration: storage bucket name must be set in environment for signed-URL generation
GCS_BUCKET = os.environ.get("GCS_BUCKET")


@app.route("/api/v1/create_ticket", methods=["POST", "OPTIONS"])
def create_ticket():
    print("hello world")
    if request.method == "OPTIONS":
        # Preflight request response
        return "", 200

    nume = request.form.get("nume")
    prenume = request.form.get("prenume")
    location = request.form.get("location")
    email = request.form.get("email")
    description = request.form.get("description")
    print(nume, prenume, location, email, description)

    photo = request.files.get("photo")
    if photo is not None:
        if photo.filename is not None:
            filename = secure_filename(photo.filename)
            photo.save(f"{filename}")  # Save locally
            print(f"Saved file: {filename}")

    return jsonify({"message": "Ok"}), 200


if __name__ == "__main__":
    # for local dev keep debug=True, in Cloud Run set FLASK_ENV/production and run with gunicorn
    app.run(debug=True)
