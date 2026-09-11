from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class VillageStatus(BaseModel):
    id: int
    name: str
    latitude: float
    longitude: float
    risk_score: float
    population: int
    elevation: float
    
class SensorStatus(BaseModel):
    id: int
    village_id: int
    sensor_type: str
    value: float
    battery_level: float
    is_online: bool
    last_updated: datetime

class Alert(BaseModel):
    id: int
    village_id: int
    alert_type: str
    severity: str
    message: str
    timestamp: datetime

class HydrologyInput(BaseModel):
    rainfall_mm: float
    curve_number: float
    slope_degrees: float
    soil_moisture: float

class HydrologyOutput(BaseModel):
    runoff_mm: float
    ia_mm: float

class SimulationTickRequest(BaseModel):
    tick_factor: float = 1.0 # Multiplier for intensity

class CAPAlert(BaseModel):
    identifier: str
    sender: str
    sent: str
    status: str
    msgType: str
    scope: str
    info: dict

class PhysicsConstraintResult(BaseModel):
    status: str # PASS, WARNING, VIOLATION
    details: str
