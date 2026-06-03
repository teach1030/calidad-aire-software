import firebase_admin
from firebase_admin import credentials, auth
import os
from dotenv import load_dotenv

load_dotenv()

def initialize_firebase():
    # Buscamos el path de la credencial en las variables de entorno
    cred_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH")
    
    if not cred_path:
        print("Advertencia: FIREBASE_SERVICE_ACCOUNT_PATH no definida. Firebase no inicializado.")
        return None

    try:
        cred = credentials.Certificate(cred_path)
        app = firebase_admin.initialize_app(cred)
        print("Firebase Admin SDK inicializado correctamente.")
        return app
    except Exception as e:
        print(f"Error al inicializar Firebase: {e}")
        return None
