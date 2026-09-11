import type { DashboardState } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const fetchDashboardState = async (): Promise<DashboardState> => {
  try {
    const res = await fetch(`${API_BASE}/dashboard`);
    if (!res.ok) throw new Error('API Error');
    return await res.json();
  } catch (err) {
    console.warn('Backend unreachable, using fallback data:', err);
    return {
      villages: [
        { id: 1, name: "Brahma Ridge Upper (Fallback)", risk: 10, river_stage: 1.0, runoff: 0 },
      ],
      active_alerts: [],
      system_health: "OFFLINE (Fallback)",
      physics_status: { status: 'WARNING', details: 'Backend offline, using fallback data' }
    };
  }
};

export const triggerTick = async (factor: number = 1.0) => {
  try {
    const res = await fetch(`${API_BASE}/simulation/tick`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tick_factor: factor })
    });
    return await res.json();
  } catch (err) {
    console.error('Failed to trigger tick', err);
  }
};
