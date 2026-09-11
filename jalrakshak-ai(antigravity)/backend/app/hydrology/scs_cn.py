import math

def calculate_runoff(rainfall: float, cn: float, slope_degrees: float) -> tuple[float, float]:
    '''
    Prototype Slope-Adjusted Runoff Estimation
    Using SCS-CN model with slope adjustment.
    
    S = (25400/CN) - 254
    Ia = 0.2S
    Q = (P - Ia)^2 / (P - Ia + S) when P > Ia
    '''
    if cn <= 0:
        return 0.0, 0.0

    # Prototype Slope Adjustment factor: 1.0 + 0.45 * sin(slope)
    slope_rad = math.radians(slope_degrees)
    slope_factor = 1.0 + 0.45 * math.sin(slope_rad)
    
    # Adjust CN (simplified for prototype)
    adjusted_cn = min(99.0, cn * slope_factor)
    
    s = (25400.0 / adjusted_cn) - 254.0
    ia = 0.2 * s
    
    if rainfall > ia:
        runoff = ((rainfall - ia) ** 2) / (rainfall - ia + s)
    else:
        runoff = 0.0
        
    return runoff, ia
