from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
from ..schemas.dtos import (
    SimulationTickRequest, HydrologyInput, HydrologyOutput, 
    PhysicsConstraintResult, CAPAlert
)
from ..simulation.engine import engine, VILLAGES
from ..hydrology.scs_cn import calculate_runoff
from ..physics.constraints import check_physics_constraints
from ..ml.risk_model import risk_model

router = APIRouter()

@router.get("/dashboard")
async def get_dashboard():
    '''Complete system state, active alerts, villages, and physics guardrail status.'''
    state = engine.get_dashboard_state()
    # Mocking physics guardrail status based on highest runoff
    max_runoff = max((v["runoff"] for v in state["villages"]), default=0.0)
    physics_res = check_physics_constraints(engine.base_rainfall, max_runoff, 50.0, 100.0)
    
    state["physics_status"] = physics_res.dict()
    return state

@router.post("/simulation/tick")
async def simulation_tick(req: SimulationTickRequest):
    '''Updates rainfall, river stage, soil saturation, and recalculates the entire basin state.'''
    # Simulating a rainfall event that scales with tick_factor
    base_rain = 25.0 * req.tick_factor
    new_alerts = engine.tick(rainfall_mm=base_rain, intensity=req.tick_factor)
    return {"message": "Tick completed", "alerts_generated": [a.dict() for a in new_alerts]}

@router.post("/hydrology/calculate", response_model=HydrologyOutput)
async def calc_hydrology(data: HydrologyInput):
    '''Standalone SCS-CN runoff calculator.'''
    runoff, ia = calculate_runoff(data.rainfall_mm, data.curve_number, data.slope_degrees)
    return HydrologyOutput(runoff_mm=runoff, ia_mm=ia)

@router.get("/sensors")
async def get_sensors():
    '''Sensor array statuses.'''
    return {"sensors": engine.state["sensors"]}

@router.get("/system/status")
async def system_status():
    '''Health of simulated IMD, INSAT-3DR, Sentinel-1, and ground IoT sources.'''
    return {
        "imd_api": "ONLINE",
        "insat_3dr": "ONLINE",
        "sentinel_1": "DELAYED",
        "iot_mesh": "ONLINE (95% coverage)"
    }
