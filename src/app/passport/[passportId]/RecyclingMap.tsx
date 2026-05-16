'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';

export type MapLocation = {
  id: string;
  name: string;
  address: string;
  type: 'buyback' | 'repair' | 'authorised' | 'recycle';
  lat: number;
  lng: number;
  distance: string;
  hours: string;
};

const LOCATION_COLORS: Record<MapLocation['type'], string> = {
  buyback: '#166534',
  repair: '#ca8a04',
  authorised: '#0c4a6e',
  recycle: '#1e40af',
};

const LOCATION_LABELS: Record<MapLocation['type'], string> = {
  buyback: 'Buy-back',
  repair: 'Repair',
  authorised: 'Authorised',
  recycle: 'Recycle',
};

// Fly to selected location when selectedId changes
function FlyTo({ locations, selectedId }: { locations: MapLocation[]; selectedId: string }) {
  const map = useMap();
  useEffect(() => {
    const loc = locations.find((l) => l.id === selectedId);
    if (loc) map.flyTo([loc.lat, loc.lng], 14, { duration: 0.8 });
  }, [map, locations, selectedId]);
  return null;
}

export default function RecyclingMap({
  locations,
  selectedId,
  onSelect,
}: {
  locations: MapLocation[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  // Dynamic import of L to avoid SSR issues with icon paths
  useEffect(() => {
    // Fix default marker icons broken by webpack
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const L = require('leaflet');
    delete (L.Icon.Default.prototype as Record<string, unknown>)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }, []);

  const center: LatLngExpression = [48.2082, 16.3738]; // Vienna

  return (
    <MapContainer
      center={center}
      zoom={12}
      style={{ height: 260, borderRadius: 12, zIndex: 0 }}
      scrollWheelZoom={false}
      className="border border-slate-200"
    >
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyTo locations={locations} selectedId={selectedId} />
      {locations.map((loc) => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const L = typeof window !== 'undefined' ? require('leaflet') : null;
        const icon = L
          ? L.divIcon({
              className: '',
              html: `<div style="
                width:28px;height:28px;border-radius:50% 50% 50% 0;
                background:${LOCATION_COLORS[loc.type]};
                border:2px solid white;
                box-shadow:0 2px 6px rgba(0,0,0,0.3);
                transform:rotate(-45deg);
                cursor:pointer;
              "></div>`,
              iconSize: [28, 28],
              iconAnchor: [14, 28],
              popupAnchor: [0, -30],
            })
          : undefined;

        return (
          <Marker
            key={loc.id}
            position={[loc.lat, loc.lng]}
            icon={icon}
            eventHandlers={{ click: () => onSelect(loc.id) }}
          >
            <Popup>
              <div style={{ minWidth: 160 }}>
                <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: LOCATION_COLORS[loc.type], marginBottom: 2 }}>
                  {LOCATION_LABELS[loc.type]}
                </p>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', margin: '0 0 2px' }}>{loc.name}</p>
                <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 4px' }}>{loc.address}</p>
                <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>{loc.distance} · {loc.hours}</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
