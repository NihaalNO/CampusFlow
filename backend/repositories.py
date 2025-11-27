from sqlalchemy.exc import NoResultFound
from sqlalchemy import select, insert, update
from .db import SessionLocal, init_db
from .models import Disruption, DisruptionImage, Resolution, AIAnalysis, User
import uuid

# Initialize DB when using local dev SQLite fallback
init_db()


def create_disruption(disruption_id: str, student_id, student_name, student_email, category, priority, description):
    session = SessionLocal()
    try:
        disruption = Disruption(
            disruption_id=disruption_id,
            student_id=student_id,
            student_name=student_name,
            student_email=student_email,
            category=category,
            priority=priority,
            description=description
        )
        session.add(disruption)
        session.commit()
        session.refresh(disruption)
        return disruption
    finally:
        session.close()


def get_user_by_auth_uid(auth_uid: str):
    session = SessionLocal()
    try:
        stmt = select(User).where(User.auth_uid == auth_uid)
        return session.execute(stmt).scalars().first()
    finally:
        session.close()


def get_or_create_user(auth_uid: str, email: str = None, name: str = None, role: str = 'student', admin_department: str = None):
    session = SessionLocal()
    try:
        user = None
        if auth_uid:
            stmt = select(User).where(User.auth_uid == auth_uid)
            user = session.execute(stmt).scalars().first()

        if user:
            return user

        # Fallback: try by email
        if email:
            stmt = select(User).where(User.email == email)
            user = session.execute(stmt).scalars().first()

        if user:
            # link auth_uid
            user.auth_uid = auth_uid
            session.add(user)
            session.commit()
            session.refresh(user)
            return user

        # Create new user
        new_user = User(
            auth_uid=auth_uid,
            email=email or f'{auth_uid}@example.invalid',
            role=role,
            admin_department=admin_department,
            name=name
        )
        session.add(new_user)
        session.commit()
        session.refresh(new_user)
        return new_user
    finally:
        session.close()


def create_disruption_for_auth(disruption_id: str, student_auth_uid, student_name, student_email, category, priority, description):
    # Ensure user exists
    user = get_or_create_user(student_auth_uid, email=student_email, name=student_name, role='student')
    return create_disruption(disruption_id, user.id, student_name, student_email, category, priority, description)


def get_disruption_by_disruption_id(disruption_id: str):
    session = SessionLocal()
    try:
        stmt = select(Disruption).where(Disruption.disruption_id == disruption_id)
        res = session.execute(stmt).scalars().first()
        return res
    finally:
        session.close()


def list_disruptions_by_student(student_id):
    session = SessionLocal()
    try:
        stmt = select(Disruption).where(Disruption.student_id == student_id).order_by(Disruption.created_at.desc())
        res = session.execute(stmt).scalars().all()
        return res
    finally:
        session.close()


def list_disruptions_by_category(category):
    session = SessionLocal()
    try:
        stmt = select(Disruption).where(Disruption.category == category).order_by(Disruption.created_at.desc())
        res = session.execute(stmt).scalars().all()
        return res
    finally:
        session.close()


def resolve_disruption(disruption_id: str, resolved_by_user_id, resolution_description, resolution_image_url=None):
    session = SessionLocal()
    try:
        stmt = select(Disruption).where(Disruption.disruption_id == disruption_id)
        disruption = session.execute(stmt).scalars().first()
        if not disruption:
            return None
        disruption.status = 'resolved'
        disruption.resolved_at = func_now()
        disruption.resolved_by = resolved_by_user_id
        # insert resolution record
        res = Resolution(
            disruption_id=disruption.id,
            resolved_by=resolved_by_user_id,
            resolution_description=resolution_description,
            resolution_image_url=resolution_image_url
        )
        session.add(res)
        session.add(disruption)
        session.commit()
        session.refresh(disruption)
        return disruption
    finally:
        session.close()


def func_now():
    # helper to return current timestamp
    from datetime import datetime
    return datetime.utcnow()
