from firebase_admin import firestore
from datetime import datetime



def create_city_hall(city_hall_id, name, contact_email):
    db = firestore.client()
    doc_ref = db.collection("city_halls").document(city_hall_id)
    doc_ref.set({
        "name": name,
        "contactEmail": contact_email,
        "created_at": datetime.utcnow()
    })
    return doc_ref.id

def add_report(data):
    if "city_hall_id" not in data:
        raise ValueError("report must include city_hall_id")
    data.setdefault("status", "new")
    data["created_at"] = datetime.utcnow()
    db = firestore.client()
    doc_ref, _ = db.collection("reports").add(data)
    return doc_ref.id