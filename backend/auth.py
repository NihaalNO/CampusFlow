import os
from dotenv import load_dotenv

# Load environment variables from .env if present
load_dotenv()
from functools import wraps
from flask import request, jsonify, g

# Try to initialize Firebase Admin if credentials exist
FIREBASE_ENABLED = False
firebase_admin = None
try:
    import firebase_admin
    from firebase_admin import auth as firebase_auth, credentials
    FIREBASE_ENABLED = True
except Exception:
    FIREBASE_ENABLED = False


def init_firebase():
    """Initialize firebase admin SDK using FIREBASE_CREDENTIALS env var.
    FIREBASE_CREDENTIALS can be a path to a JSON file or the JSON string itself.
    """
    if not FIREBASE_ENABLED:
        return False
    try:
        cred_val = os.getenv('FIREBASE_CREDENTIALS')
        if not cred_val:
            return False
        # If it looks like JSON
        if cred_val.strip().startswith('{'):
            import json
            cred_dict = json.loads(cred_val)
            cred = credentials.Certificate(cred_dict)
        else:
            cred = credentials.Certificate(cred_val)
        # Avoid re-initializing
        if not firebase_admin._apps:
            firebase_admin.initialize_app(cred)
        return True
    except Exception:
        return False


# initialize at import time if possible
FIREBASE_AVAILABLE = init_firebase()


def verify_token(id_token: str):
    if not FIREBASE_AVAILABLE:
        return None
    try:
        decoded = firebase_auth.verify_id_token(id_token)
        return decoded
    except Exception:
        return None


def require_auth(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Missing Authorization header'}), 401
        token = auth_header.split(' ', 1)[1].strip()
        claims = verify_token(token)
        if not claims:
            return jsonify({'error': 'Invalid or expired token'}), 401
        # attach claims to flask.g for handlers
        g.user_claims = claims
        g.user_uid = claims.get('uid')
        g.user_email = claims.get('email')
        return f(*args, **kwargs)
    return wrapper


def require_admin(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        # Ensure user is authenticated first
        auth_resp = require_auth(lambda: None)
        # We manually run the token verification logic to populate g
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Missing Authorization header'}), 401
        token = auth_header.split(' ', 1)[1].strip()
        claims = verify_token(token)
        if not claims:
            return jsonify({'error': 'Invalid or expired token'}), 401
        g.user_claims = claims
        g.user_uid = claims.get('uid')
        g.user_email = claims.get('email')
        # If role present in claims and equals admin, allow
        if claims.get('role') == 'admin' or claims.get('admin') is True:
            return f(*args, **kwargs)
        # Otherwise try to check local DB mapping for role
        try:
            from .repositories import get_user_by_auth_uid
            user = get_user_by_auth_uid(g.user_uid)
            if user and getattr(user, 'role', None) == 'admin':
                return f(*args, **kwargs)
        except Exception:
            pass
        return jsonify({'error': 'Forbidden: admin only'}), 403
    return wrapper