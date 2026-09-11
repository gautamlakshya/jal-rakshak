import { MapContainer, TileLayer, Marker, Popup, Polyline, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { DashboardState } from '../types';
import L from 'leaflet';

// Create basic colored icons
const getIcon = (risk: number) => {
  const color = risk > 75 ? 'red' : risk > 50 ? 'orange' : risk > 25 ? 'yellow' : 'green';
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white;"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
};

const VILLAGE_COORDS = [
  { id: 1, lat: 27.7333, lon: 88.5500 }, // Lachen
  { id: 2, lat: 27.6033, lon: 88.6467 }, // Chungthang
  { id: 3, lat: 27.4983, lon: 88.5283 }, // Mangan
  { id: 4, lat: 27.2333, lon: 88.4983 }, // Singtam
  { id: 5, lat: 27.0667, lon: 88.4283 }, // Teesta Bazaar
];

// Singtam Mock Inundation Polygon
const SINGTAM_POLYGON: [number, number][] = [
  [27.25, 88.48], [27.25, 88.52], [27.21, 88.51], [27.21, 88.47]
];

export const RiskMap = ({ state }: { state: DashboardState | null }) => {
  if (!state) return <div className="h-full bg-slate-800 animate-pulse rounded-lg"></div>;

  const positions = VILLAGE_COORDS.map(c => [c.lat, c.lon] as [number, number]);
  const maxStage = Math.max(...state.villages.map(v => v.river_stage));
  const capacityPct = (maxStage / 8.5) * 100;
  const riverColor = capacityPct >= 100 ? '#ef4444' : capacityPct >= 70 ? '#eab308' : '#22c55e';
  const singtamVillage = state.villages.find(v => v.id === 4);
  const isSingtamFlooded = singtamVillage && singtamVillage.river_stage >= 8.5;

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-slate-700 relative">
      <div className="absolute top-2 left-2 z-[400] bg-slate-900/80 px-3 py-1 rounded backdrop-blur text-sm border border-slate-700 shadow">
        Teesta River Basin (Sikkim) — Risk Map
      </div>
      <MapContainer center={[27.4, 88.5]} zoom={9} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <Polyline positions={positions} color={riverColor} weight={5} opacity={0.8} />
        {isSingtamFlooded && (
          <Polygon positions={SINGTAM_POLYGON} color="#ef4444" fillColor="#ef4444" fillOpacity={0.4} />
        )}
        {state.villages.map(v => {
          const coords = VILLAGE_COORDS.find(c => c.id === v.id);
          if (!coords) return null;
          return (
            <Marker key={v.id} position={[coords.lat, coords.lon]} icon={getIcon(v.risk)}>
              <Popup>
                <div className="text-slate-900 font-bold">{v.name}</div>
                <div>Risk: {v.risk.toFixed(1)}%</div>
                <div>River Stage: {v.river_stage.toFixed(2)}m ({( (v.river_stage / 8.5) * 100 ).toFixed(1)}%)</div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
