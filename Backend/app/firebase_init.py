import os
from pathlib import Path

import firebase_admin
from firebase_admin import credentials

if os.getenv("DISABLE_FIREBASE") == "1":
    pass
elif not firebase_admin._apps:
    cert_path = os.getenv("FIREBASE_CREDENTIALS_PATH")
    if cert_path:
        cert_file = Path(cert_path).expanduser()
    else:
        cert_file = Path(__file__).resolve().parent / "data-1e66c-firebase-adminsdk-fbsvc-802167c552.json"

    cred = credentials.Certificate(
        str(cert_file)
    )
    firebase_admin.initialize_app(cred, {
        "databaseURL": "https://data-1e66c-default-rtdb.asia-southeast1.firebasedatabase.app/"
    })
