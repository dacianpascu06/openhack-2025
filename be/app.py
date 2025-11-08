from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import time
from werkzeug.utils import secure_filename
from functools import wraps

import firebase_admin
from firebase_admin import credentials, firestore, auth as firebase_auth

# local helpers
from db_helpers import create_city_hall, add_report
from storage_helpers import generate_v4_upload_url

app = Flask(__name__)
# Enable CORS for your React frontend; tighten to specific origins in production
CORS(app)

# Initialize Firebase Admin SDK using a service account JSON (set GOOGLE_APPLICATION_CREDENTIALS)
# In Cloud Run / GCP this can use Application Default Credentials instead.
if os.environ.get("GOOGLE_APPLICATION_CREDENTIALS"):
    cred = credentials.Certificate(os.environ.get("GOOGLE_APPLICATION_CREDENTIALS"))
    firebase_admin.initialize_app(cred, {"projectId": os.environ.get("GOOGLE_CLOUD_PROJECT")})
else:
    # uses ADC in production environments (Cloud Run)
    firebase_admin.initialize_app()

# Firestore client
db = firestore.client()

# Configuration: storage bucket name must be set in environment for signed-URL generation
GCS_BUCKET = os.environ.get("GCS_BUCKET")


@app.route('/')
def home():
    return "Flask + Firestore is ready!"


# -------------------------
# Authentication helpers
# -------------------------

def verify_token_from_header(check_revoked=True):
    """Verify Firebase ID token from Authorization header.

    Returns (decoded_token, None) on success or (None, (message, status_code)) on failure.
    """
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return None, ("Missing or invalid Authorization header", 401)
    id_token = auth_header.split(" ", 1)[1].strip()
    try:
        decoded = firebase_auth.verify_id_token(id_token, check_revoked=check_revoked)
        return decoded, None
    except firebase_auth.RevokedIdTokenError:
        return None, ("Token revoked, sign in again", 401)
    except Exception as e:
        return None, (f"Invalid token: {e}", 401)


def requires_city_hall(f):
    """Decorator to require the caller is authenticated and has custom claim role == 'city_hall'.

    Attaches decoded token to request.firebase_claims on success.
    """
    @wraps(f)
    def wrapped(*args, **kwargs):
        decoded, err = verify_token_from_header()
        if err:
            msg, code = err
            return jsonify({"error": msg}), code
        if decoded.get("role") != "city_hall":
            return jsonify({"error": "forbidden: not a city_hall account"}), 403
        request.firebase_claims = decoded
        return f(*args, **kwargs)

    return wrapped


# -------------------------
# App endpoints
# -------------------------

# create a city hall document (admin-only in production)
@app.route('/create-city-hall', methods=['POST'])
def http_create_city_hall():
    data = request.json or {}
    required = ('city_hall_id', 'name', 'contact_email')
    if not all(k in data for k in required):
        return jsonify({"error": f"required fields: {required}"}), 400
    create_city_hall(data['city_hall_id'], data['name'], data['contact_email'])
    return jsonify({"id": data['city_hall_id']}), 201


# Add a report (called by citizens or frontend)
@app.route('/add-report', methods=['POST'])
def http_add_report():
    data = request.json or {}
    if 'city_hall_id' not in data:
        return jsonify({"error": "missing city_hall_id"}), 400

    try:
        doc_id = add_report(data)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    print(f"Received data: {data}. Added document with ID: {doc_id}")
    return jsonify({"id": doc_id}), 201


@app.route('/generate-upload-url', methods=['POST'])
@requires_city_hall
def generate_upload_url():
    """Generate a short-lived signed PUT URL so the client can upload a photo directly to GCS.

    Expected JSON body: { "filename": "photo.jpg", "content_type": "image/jpeg" }
    Returns: { upload_url, https_url, gs_path }

    This endpoint is protected: only authenticated city_hall users (custom claim) can request URLs.
    Adjust permissions if citizens should be allowed to upload directly.
    """
    data = request.json or {}
    filename = data.get('filename')
    content_type = data.get('content_type', 'application/octet-stream')
    if not filename:
        return jsonify({"error": "missing filename"}), 400
    if not GCS_BUCKET:
        return jsonify({"error": "server misconfigured: GCS_BUCKET missing"}), 500

    # scope uploads by city_hall id and include a timestamp to avoid collisions
    city_hall_id = request.firebase_claims.get('city_hall_id')
    safe_name = secure_filename(filename)
    blob_name = f"reports/{city_hall_id}/{int(time.time())}_{safe_name}"

    result = generate_v4_upload_url(GCS_BUCKET, blob_name, content_type=content_type)
    return jsonify(result), 200


if __name__ == '__main__':
    # for local dev keep debug=True, in Cloud Run set FLASK_ENV/production and run with gunicorn
    app.run(debug=True)
