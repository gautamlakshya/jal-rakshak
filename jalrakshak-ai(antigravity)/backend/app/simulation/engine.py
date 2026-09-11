import uuid
from datetime import datetime, timezone
from typing import Dict, List, Any
from ..schemas.dtos import CAPAlert, VillageStatus, SensorStatus
from ..ml.risk_model import risk_model
from ..hydrology.scs_cn import calculate_runoff

# 5 Teesta Basin nodes
VILLAGES = [
    {"id": 1, "name": "Lachen (Upper Catchment)", "lat": 27.7333, "lon": 88.5500, "elev": 2750, "pop": 2000, "slope": 45, "next": 2},
    {"id": 2, "name": "Chungthang Confluence", "lat": 27.6033, "lon": 88.6467, "elev": 1630, "pop": 5000, "slope": 35, "next": 3},
    {"id": 3, "name": "Mangan", "lat": 27.4983, "lon": 88.5283, "elev": 956, "pop": 8000, "slope": 25, "next": 4},
    {"id": 4, "name": "Singtam (Vulnerable Settlement)", "lat": 27.2333, "lon": 88.4983, "elev": 300, "pop": 15000, "slope": 15, "next": 5},
    {"id": 5, "name": "Teesta Bazaar / Rangpo (Downstream)", "lat": 27.0667, "lon": 88.4283, "elev": 150, "pop": 30000, "slope": 5, "next": None},
]

class SimulationEngine:
    def __init__(self):
        self.state = {
            "villages": {v["id"]: {"risk": 0.0, "runoff": 0.0, "moisture": 30.0, "river_stage": 2.5} for v in VILLAGES},
            "sensors": [
                {"id": i, "village_id": i, "type": "water_level", "val": 1.0, "batt": 99.0, "online": True}
                for i in range(1, 6)
            ],
            "alerts": []
        }
        self.base_rainfall = 0.0

    def tick(self, rainfall_mm: float, intensity: float = 1.0):
        self.base_rainfall = rainfall_mm * intensity
        alerts_generated = []
        
        # Reset downstream accumulation
        accumulated_flow = 0.0
        
        for v in VILLAGES:
            vid = v["id"]
            # Base variables
            moisture = min(100.0, self.state["villages"][vid]["moisture"] + (self.base_rainfall * 0.1))
            self.state["villages"][vid]["moisture"] = moisture
            
            # Hydrology SCS-CN
            runoff, _ = calculate_runoff(self.base_rainfall, cn=75.0, slope_degrees=v["slope"])
            
            # Graph propagation (upstream flow adds to current river stage)
            accumulated_flow += runoff
            
            # Cap the river stage between 2.5m (baseline) and 14.2m (extreme flood)
            river_stage_raw = 2.5 + (accumulated_flow * 0.1)
            river_stage = min(14.2, max(2.5, river_stage_raw))
            self.state["villages"][vid]["river_stage"] = river_stage
            
            # ML Risk Model
            f_risk, l_risk = risk_model.predict(
                rainfall=self.base_rainfall,
                slope=v["slope"],
                moisture=moisture,
                river_stage=river_stage
            )
            
            max_risk = max(f_risk, l_risk)
            self.state["villages"][vid]["risk"] = max_risk
            self.state["villages"][vid]["runoff"] = runoff
            
            # Sensor update
            sensor = next(s for s in self.state["sensors"] if s["village_id"] == vid)
            sensor["val"] = river_stage
            sensor["batt"] = max(0.0, sensor["batt"] - 0.1)
            
            # CAP v1.2 Alert generation if risk > 75%
            if max_risk > 75.0:
                alert = self._generate_cap_alert(v, max_risk, "Flood" if f_risk > l_risk else "Landslide")
                alerts_generated.append(alert)
                self.state["alerts"].append(alert)
                
        return alerts_generated

    def _generate_cap_alert(self, village: dict, risk: float, alert_type: str) -> CAPAlert:
        return CAPAlert(
            identifier=str(uuid.uuid4()),
            sender="JalRakshak AI Gateway",
            sent=datetime.now(timezone.utc).isoformat(),
            status="Actual",
            msgType="Alert",
            scope="Public",
            info={
                "category": "Met",
                "event": f"Critical {alert_type} Warning",
                "urgency": "Immediate",
                "severity": "Extreme",
                "certainty": "Observed",
                "headline": f"{alert_type} Risk at {village['name']} ({risk:.1f}%)",
                "description": f"High risk of {alert_type.lower()} detected. Evacuation protocols recommended.",
                "area": {"areaDesc": village["name"]}
            }
        )

    def get_dashboard_state(self):
        return {
            "villages": [
                {
                    "id": v["id"],
                    "name": v["name"],
                    "risk": self.state["villages"][v["id"]]["risk"],
                    "river_stage": self.state["villages"][v["id"]]["river_stage"],
                    "runoff": self.state["villages"][v["id"]]["runoff"]
                }
                for v in VILLAGES
            ],
            "active_alerts": [a.dict() for a in self.state["alerts"][-5:]], # Last 5
            "system_health": "ONLINE"
        }

engine = SimulationEngine()
