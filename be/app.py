from flask import Flask, request, jsonify
import uuid
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename

import firebase_admin
from firebase_admin import credentials, storage, firestore, auth as firebase_auth
from openai_service.GPTService import gpt_service as gpt
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

CORS(
    app,
    supports_credentials=True,
    origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_headers="*",
    methods=["GET", "POST", "OPTIONS", "PUT", "DELETE"],
)


GCS_BUCKET = os.environ.get("GCS_BUCKET")

if os.environ.get("GOOGLE_APPLICATION_CREDENTIALS"):
    cred = credentials.Certificate(os.environ.get("GOOGLE_APPLICATION_CREDENTIALS"))
    firebase_admin.initialize_app(
        cred,
        {
            "projectId": os.environ.get("GOOGLE_CLOUD_PROJECT"),
            "storageBucket": GCS_BUCKET,
        },
    )
else:
    firebase_admin.initialize_app()

db = firestore.client()
bucket = storage.bucket()


def generate_unique_ticket_id():
    while True:
        ticket_id = str(uuid.uuid4())
        ticket_ref = db.collection("tickets").document(ticket_id)
        if not ticket_ref.get().exists:
            return ticket_id


@app.route("/api/v1/create_ticket", methods=["POST", "OPTIONS"])
def create_ticket():
    if request.method == "OPTIONS":
        return "", 200

    ticket_id = generate_unique_ticket_id()

    nume = request.form.get("nume")
    prenume = request.form.get("prenume")
    location = request.form.get("location")
    email = request.form.get("email")
    description = request.form.get("description")

    ticket_ref = db.collection("tickets").document(ticket_id)
    ticket_data = {
        "id": ticket_id,
        "nume": nume,
        "prenume": prenume,
        "location": location,
        "email": email,
        "description": description,
    }
    ticket_ref.set(ticket_data)

    photo = request.files.get("photo")
    if photo is not None:
        if photo.filename is not None:
            filename = secure_filename(photo.filename)
            photo.save(f"{filename}")
            blob = bucket.blob(f"{ticket_id}")
            with open(filename, "rb") as f:
                blob.upload_from_file(f)
            os.remove(filename)

    try:
        response = gpt.determine_assignee_ro(location, description)
        for key, value in response.items():
            print(key, value)
    except Exception as e:
        print(e)

    return jsonify({"success": True, "ticket_id": ticket_id}), 201


if __name__ == "__main__":
    app.run(debug=True)
