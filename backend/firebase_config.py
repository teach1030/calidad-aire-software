import firebase_admin
from firebase_admin import credentials, auth
import os
import json
from dotenv import load_dotenv

load_dotenv()

def initialize_firebase():
    # 1. Intentar cargar desde variable de entorno con el JSON completo (Ideal para Render/Vercel)
    firebase_json = os.getenv("FIREBASE_CONFIG_JSON")
    
    if firebase_json:
        try:
            # Parsear el string JSON a un diccionario
            cred_dict = json.loads(firebase_json)
            cred = credentials.Certificate(cred_dict)
            app = firebase_admin.initialize_app(cred)
            print("Firebase Admin SDK inicializado desde variable de entorno.")
            return app
        except Exception as e:
            print(f"Error al inicializar Firebase desde JSON string: {e}")

    # 2. Fallback: Intentar cargar desde el archivo físico (Ideal para local)
    cred_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH")
    if cred_path and os.path.exists(cred_path):
        try:
            cred = credentials.Certificate(cred_path)
            app = firebase_admin.initialize_app(cred)
            print("Firebase Admin SDK inicializado desde archivo físico.")
            return app
        except Exception as e:
            print(f"Error al inicializar Firebase desde archivo: {e}")
            
    print("Error: No se encontró configuración de Firebase (Variable FIREBASE_CONFIG_JSON o archivo físico).")
    return None
