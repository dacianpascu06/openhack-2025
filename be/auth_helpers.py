from firebase_admin import auth

# Do NOT initialize the Admin SDK here. The main application (or a small
# CLI script) should initialize firebase_admin.initialize_app(...) once. This
# module only uses the Admin APIs (auth functions) after initialization.
def create_and_invite_city_hall(email, city_hall_id):
    # create user (you can also create without password then send reset link)
    user = auth.create_user(email=email)
    # set custom claims for role and city_hall_id
    auth.set_custom_user_claims(user.uid, {"role": "city_hall", "city_hall_id": city_hall_id})
    # create a password reset (invite) link and print/send it
    link = auth.generate_password_reset_link(email)
    print("Invite/reset link (send by email):", link)
    return user.uid