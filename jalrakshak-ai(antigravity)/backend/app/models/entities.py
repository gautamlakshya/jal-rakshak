from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime, timezone

Base = declarative_base()

class VillageRecord(Base):
    __tablename__ = "villages"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    latitude = Column(Float)
    longitude = Column(Float)
    elevation = Column(Float)
    population = Column(Integer)
    risk_score = Column(Float, default=0.0)
    
    sensors = relationship("SensorRecord", back_populates="village")
    alerts = relationship("AlertLog", back_populates="village")

class SensorRecord(Base):
    __tablename__ = "sensors"
    id = Column(Integer, primary_key=True, index=True)
    village_id = Column(Integer, ForeignKey("villages.id"))
    sensor_type = Column(String) # 'water_level', 'soil_moisture', 'rain_gauge'
    value = Column(Float)
    battery_level = Column(Float)
    is_online = Column(Boolean, default=True)
    last_updated = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    village = relationship("VillageRecord", back_populates="sensors")

class AlertLog(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True, index=True)
    village_id = Column(Integer, ForeignKey("villages.id"))
    alert_type = Column(String) # 'flood', 'landslide'
    severity = Column(String) # 'WARNING', 'CRITICAL'
    message = Column(String)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    village = relationship("VillageRecord", back_populates="alerts")
