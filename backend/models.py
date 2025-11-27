from sqlalchemy import Column, String, DateTime, Boolean, Text, ForeignKey, Numeric
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from .db import Base


def generate_uuid():
    return str(uuid.uuid4())


class Department(Base):
    __tablename__ = 'departments'
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)


class User(Base):
    __tablename__ = 'users'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    auth_uid = Column(String, unique=True, nullable=True)
    email = Column(String, unique=True, nullable=False)
    role = Column(String, nullable=False)  # 'student' or 'admin'
    admin_department = Column(String, ForeignKey('departments.id'))
    name = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_login = Column(DateTime(timezone=True))
    is_active = Column(Boolean, default=True)


class Disruption(Base):
    __tablename__ = 'disruptions'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    disruption_id = Column(String, unique=True, nullable=False)
    student_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    student_name = Column(String)
    student_email = Column(String)
    category = Column(String, ForeignKey('departments.id'), nullable=False)
    priority = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String, nullable=False, default='pending')
    ai_tone = Column(String)
    ai_confidence = Column(Numeric(4,3))
    ai_recommendation = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    resolved_at = Column(DateTime(timezone=True))
    resolved_by = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    is_deleted = Column(Boolean, default=False)


class DisruptionImage(Base):
    __tablename__ = 'disruption_images'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    disruption_id = Column(UUID(as_uuid=True), ForeignKey('disruptions.id', ondelete='CASCADE'))
    url = Column(String, nullable=False)
    filename = Column(String)
    filesize = Column(String)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())


class Resolution(Base):
    __tablename__ = 'resolutions'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    disruption_id = Column(UUID(as_uuid=True), ForeignKey('disruptions.id', ondelete='CASCADE'))
    resolved_by = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    resolution_description = Column(Text, nullable=False)
    resolution_image_url = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class AIAnalysis(Base):
    __tablename__ = 'ai_analysis'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    disruption_id = Column(UUID(as_uuid=True), ForeignKey('disruptions.id', ondelete='CASCADE'))
    tone = Column(String)
    confidence = Column(Numeric(4,3))
    recommendation = Column(Text)
    model_version = Column(String)
    analyzed_at = Column(DateTime(timezone=True), server_default=func.now())


class Notification(Base):
    __tablename__ = 'notifications'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    disruption_id = Column(UUID(as_uuid=True), ForeignKey('disruptions.id'))
    channel = Column(String)
    payload = Column(Text)
    sent_at = Column(DateTime(timezone=True))
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class AdminCode(Base):
    __tablename__ = 'admin_codes'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    department_id = Column(String, ForeignKey('departments.id'))
    code = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True))
    is_active = Column(Boolean, default=True)


class AuditLog(Base):
    __tablename__ = 'audit_logs'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    actor_id = Column(UUID(as_uuid=True))
    action = Column(String, nullable=False)
    target_table = Column(String)
    target_id = Column(UUID(as_uuid=True))
    meta = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
