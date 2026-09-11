import numpy as np
from sklearn.ensemble import GradientBoostingRegressor
import os

class PrototypeRiskModel:
    def __init__(self):
        self.flood_model = GradientBoostingRegressor(n_estimators=10, max_depth=3, random_state=42)
        self.landslide_model = GradientBoostingRegressor(n_estimators=10, max_depth=3, random_state=42)
        self.is_trained = False
        self._train_deterministic_models()

    def _train_deterministic_models(self):
        # Synthetic data for prototype: [Rainfall, Slope, Soil Moisture, River Stage]
        # Label: Risk (0-100)
        X = np.array([
            [0, 10, 20, 0],
            [50, 20, 50, 2],
            [100, 30, 80, 5],
            [200, 45, 95, 8],
            [300, 60, 100, 10]
        ])
        # Flood risk primarily driven by rainfall and river stage
        y_flood = np.array([0, 20, 50, 80, 100])
        # Landslide risk primarily driven by slope and soil moisture
        y_landslide = np.array([0, 15, 60, 90, 100])
        
        try:
            self.flood_model.fit(X, y_flood)
            self.landslide_model.fit(X, y_landslide)
            self.is_trained = True
        except Exception as e:
            print(f"Error training ML model, fallback activated: {e}")

    def predict(self, rainfall: float, slope: float, moisture: float, river_stage: float) -> tuple[float, float]:
        '''
        Predicts Flood Risk (0–100) and Landslide Risk (0–100).
        Includes deterministic math fallback if model execution fails.
        Label: "Prototype ML Risk Model"
        '''
        if not self.is_trained:
            # Deterministic fallback
            f_risk = min(100.0, (rainfall * 0.3) + (river_stage * 5))
            l_risk = min(100.0, (moisture * 0.5) + (slope * 0.8))
            return f_risk, l_risk

        X_input = np.array([[rainfall, slope, moisture, river_stage]])
        try:
            f_risk = float(self.flood_model.predict(X_input)[0])
            l_risk = float(self.landslide_model.predict(X_input)[0])
            return max(0.0, min(100.0, f_risk)), max(0.0, min(100.0, l_risk))
        except Exception:
            f_risk = min(100.0, (rainfall * 0.3) + (river_stage * 5))
            l_risk = min(100.0, (moisture * 0.5) + (slope * 0.8))
            return f_risk, l_risk

risk_model = PrototypeRiskModel()
