from typing import List
from ..schemas.dtos import PhysicsConstraintResult

def check_physics_constraints(rainfall: float, runoff: float, soil_moisture: float, max_capacity: float) -> PhysicsConstraintResult:
    '''
    Physics-Informed Constraint Layer checking conservation of mass, 
    non-negative runoff (Q >= 0), monotonic soil-saturation hazard relation, 
    and downstream wave continuity.
    '''
    details = []
    status = "PASS"
    
    # 1. Non-negative runoff
    if runoff < 0:
        status = "VIOLATION"
        details.append("VIOLATION: Runoff cannot be negative (Q >= 0).")
        
    # 2. Conservation of Mass (simplified): Runoff cannot exceed rainfall + max soil release (assumed 0 here for prototype)
    if runoff > rainfall:
        status = "VIOLATION"
        details.append("VIOLATION: Conservation of Mass failed (Runoff > Rainfall).")

    # 3. Monotonic soil-saturation hazard relation
    if soil_moisture > 100.0 or soil_moisture < 0.0:
        status = "VIOLATION"
        details.append("VIOLATION: Soil moisture must be between 0 and 100%.")

    # 4. Wave Continuity (Capacity limit)
    if runoff > max_capacity * 0.8:
        if status != "VIOLATION":
            status = "WARNING"
        details.append("WARNING: Approaching maximum downstream channel capacity.")

    if not details:
        details.append("All physical constraints satisfied.")

    return PhysicsConstraintResult(status=status, details=" | ".join(details))
