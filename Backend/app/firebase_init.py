import firebase_admin
from firebase_admin import credentials

if not firebase_admin._apps:
    cred = credentials.Certificate(
        "data-1e66c-firebase-adminsdk-fbsvc-802167c552.json"
    )
    firebase_admin.initialize_app(cred, {
        "databaseURL": "https://data-1e66c-default-rtdb.asia-southeast1.firebasedatabase.app/"
    })
