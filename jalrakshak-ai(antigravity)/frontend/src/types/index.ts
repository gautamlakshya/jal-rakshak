export interface VillageStatus {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  risk_score: number;
  population: number;
  elevation: number;
}

export interface SensorStatus {
  id: number;
  village_id: number;
  sensor_type: string;
  value: number;
  battery_level: number;
  is_online: boolean;
  last_updated: string;
}

export interface CAPAlert {
  identifier: string;
  sender: string;
  sent: string;
  status: string;
  msgType: string;
  scope: string;
  info: any;
}

export interface PhysicsConstraintResult {
  status: 'PASS' | 'WARNING' | 'VIOLATION';
  details: string;
}

export interface DashboardState {
  villages: {
    id: number;
    name: string;
    risk: number;
    river_stage: number;
    runoff: number;
  }[];
  active_alerts: CAPAlert[];
  system_health: string;
  physics_status: PhysicsConstraintResult;
}
