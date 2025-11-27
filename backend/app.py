from flask import Flask, request, jsonify, g
from flask_cors import CORS
import os
from services.ai_service import ai_service
from auth import require_auth, require_admin, FIREBASE_AVAILABLE
try:
    from repositories import create_disruption_for_auth, get_disruption_by_disruption_id, list_disruptions_by_student, list_disruptions_by_category, resolve_disruption as repo_resolve_disruption
    HAS_DB = True
except Exception:
    HAS_DB = False

app = Flask(__name__)
CORS(app)  # This will allow all origins for development

# Mock data for demonstration
disruptions = [
    {
        "disruptionId": "DIS-001",
        "studentId": "S123456",
        "studentName": "John Doe",
        "studentEmail": "john.doe@college.edu",
        "category": "infrastructure",
        "priority": "high",
        "description": "Water leak in the main hallway near the library entrance",
        "imageUrls": [],
        "status": "pending",
        "aiToneAnalysis": {
            "tone": "urgent",
            "confidence": 0.95,
            "recommendation": "This disruption appears to be urgent. Consider prioritizing for quick response."
        },
        "createdAt": "2023-05-15T10:30:00Z"
    },
    {
        "disruptionId": "DIS-002",
        "studentId": "S789012",
        "studentName": "Jane Smith",
        "studentEmail": "jane.smith@college.edu",
        "category": "infrastructure",
        "priority": "high",
        "description": "Broken elevator in Building A",
        "imageUrls": [],
        "status": "pending",
        "aiToneAnalysis": {
            "tone": "frustrated",
            "confidence": 0.87,
            "recommendation": "This disruption appears to be frustrated. Consider prioritizing for quick response."
        },
        "createdAt": "2023-05-16T14:15:00Z"
    },
    {
        "disruptionId": "DIS-003",
        "studentId": "S345678",
        "studentName": "Robert Johnson",
        "studentEmail": "robert.johnson@college.edu",
        "category": "it",
        "priority": "low",
        "description": "WiFi connectivity issues in classroom B204",
        "imageUrls": [],
        "status": "in_progress",
        "aiToneAnalysis": {
            "tone": "neutral",
            "confidence": 0.92,
            "recommendation": "This disruption appears to be neutral. Standard handling procedure applies."
        },
        "createdAt": "2023-05-16T14:15:00Z"
    }
]

@app.route('/')
def home():
    return jsonify({"message": "CampusFlow API is running"})

# Disruption Management Endpoints
@app.route('/api/disruptions', methods=['POST'])
@require_auth
def create_disruption():
    data = request.get_json() or {}
    required = ['disruptionId', 'studentName', 'studentEmail', 'category', 'priority', 'description']
    if not all(k in data for k in required):
        return jsonify({"error": "Missing required fields"}), 400

    # Use authenticated user's uid as student identifier
    auth_uid = getattr(g, 'user_uid', None)
    if HAS_DB:
        disruption = create_disruption_for_auth(
            disruption_id=data['disruptionId'],
            student_auth_uid=auth_uid,
            student_name=data['studentName'],
            student_email=data['studentEmail'],
            category=data['category'],
            priority=data['priority'],
            description=data['description']
        )
        try:
            ai_result = ai_service.analyze_tone(data.get('description',''))
        except Exception:
            ai_result = None
        payload = {"message": "Disruption created successfully", "disruptionId": disruption.disruption_id}
        if ai_result:
            payload['aiToneAnalysis'] = ai_result
        return jsonify(payload), 201

    return jsonify({"message": "Disruption created successfully (mock)", "disruptionId": data.get('disruptionId', 'DIS-XXX')}), 201

@app.route('/api/disruptions/<disruption_id>', methods=['GET'])
def get_disruption(disruption_id):
    if HAS_DB:
        disruption = get_disruption_by_disruption_id(disruption_id)
        if not disruption:
            return jsonify({"error": "Disruption not found"}), 404
        res = {
            "disruptionId": disruption.disruption_id,
            "studentId": str(disruption.student_id),
            "studentName": disruption.student_name,
            "studentEmail": disruption.student_email,
            "category": disruption.category,
            "priority": disruption.priority,
            "description": disruption.description,
            "status": disruption.status,
            "createdAt": disruption.created_at.isoformat() if disruption.created_at else None
        }
        return jsonify(res)

    disruption = next((d for d in disruptions if d["disruptionId"] == disruption_id), None)
    if disruption:
        return jsonify(disruption)
    return jsonify({"error": "Disruption not found"}), 404

@app.route('/api/disruptions/student/<student_id>', methods=['GET'])
@require_auth
def get_student_disruptions(student_id):
    # Ensure student only accesses own disruptions unless admin
    auth_uid = getattr(g, 'user_uid', None)
    # If DB available, map auth_uid to local user id and verify
    if HAS_DB:
        from repositories import get_user_by_auth_uid
        user = get_user_by_auth_uid(auth_uid)
        # Allow if requesting own records or user is admin
        if not user:
            return jsonify({'error': 'User not found'}), 404
        if user.role != 'admin' and str(user.id) != student_id and user.auth_uid != student_id:
            return jsonify({'error': 'Forbidden'}), 403
        # If admin and asking for specific student, interpret student_id as auth_uid or local id
        target_uid = student_id
        # try local UUID match first
        rows = []
        try:
            rows = list_disruptions_by_student(student_id)
        except Exception:
            # if that fails, attempt by mapping auth_uid to local user
            pass
        if not rows:
            # try to map student_id as auth_uid
            try:
                from repositories import get_user_by_auth_uid
                target_user = get_user_by_auth_uid(student_id)
                if target_user:
                    rows = list_disruptions_by_student(target_user.id)
            except Exception:
                rows = []
        out = []
        for d in rows:
            out.append({
                "disruptionId": d.disruption_id,
                "category": d.category,
                "priority": d.priority,
                "status": d.status,
                "createdAt": d.created_at.isoformat() if d.created_at else None
            })
        return jsonify(out)

    # fallback: only allow if auth matches requested id
    if auth_uid != student_id:
        return jsonify({'error': 'Forbidden'}), 403
    student_disruptions = [d for d in disruptions if d["studentId"] == student_id]
    return jsonify(student_disruptions)

@app.route('/api/disruptions/admin/<category>', methods=['GET'])
@require_admin
def get_category_disruptions(category):
    if HAS_DB:
        rows = list_disruptions_by_category(category)
        out = []
        for d in rows:
            out.append({
                "disruptionId": d.disruption_id,
                "studentName": d.student_name,
                "priority": d.priority,
                "status": d.status,
                "createdAt": d.created_at.isoformat() if d.created_at else None
            })
        return jsonify(out)
    category_disruptions = [d for d in disruptions if d["category"] == category]
    return jsonify(category_disruptions)

@app.route('/api/disruptions/<disruption_id>/resolve', methods=['PATCH'])
@require_admin
def resolve_disruption(disruption_id):
    data = request.get_json() or {}
    resolution_description = data.get('resolutionDescription')
    resolution_image = data.get('resolutionImage')

    # require admin
    # note: decorator require_admin will run and populate g.user_uid
    auth_uid = getattr(g, 'user_uid', None)

    if HAS_DB:
        # map auth_uid to local user id
        from repositories import get_user_by_auth_uid
        user = get_user_by_auth_uid(auth_uid)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        disruption = repo_resolve_disruption(disruption_id, user.id, resolution_description, resolution_image)
        if not disruption:
            return jsonify({"error": "Disruption not found"}), 404
        return jsonify({"message": "Resolved", "disruptionId": disruption.disruption_id})

    disruption = next((d for d in disruptions if d["disruptionId"] == disruption_id), None)
    if disruption:
        disruption["status"] = "resolved"
        disruption["resolvedAt"] = "2023-05-17T16:30:00Z"
        disruption["resolvedBy"] = "admin"
        disruption["resolutionImage"] = "https://example.com/resolution.jpg"
        disruption["resolutionDescription"] = "Issue has been fixed"
        return jsonify(disruption)
    return jsonify({"error": "Disruption not found"}), 404

# AI Analysis Endpoint
@app.route('/api/analyze-tone', methods=['POST'])
def analyze_tone():
    data = request.get_json()
    description = data.get('description', '')
    
    # Use the AI service to analyze the tone
    tone_analysis = ai_service.analyze_tone(description)
    
    return jsonify(tone_analysis)

# File Upload Endpoints
@app.route('/api/upload/disruption-image', methods=['POST'])
def upload_disruption_image():
    # In a real application, you would handle file upload here
    return jsonify({"message": "Image uploaded successfully", "url": "https://example.com/image.jpg"})

@app.route('/api/upload/resolution-image', methods=['POST'])
def upload_resolution_image():
    # In a real application, you would handle file upload here
    return jsonify({"message": "Resolution image uploaded successfully", "url": "https://example.com/resolution.jpg"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)