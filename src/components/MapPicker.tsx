'use client';

/**
 * MapPicker.tsx
 * -----------------------------------------------------------------------------
 * Leaflet + OpenStreetMap location picker (no API key) for exact-drop delivery
 * coordinates — click the map, drag the pin, search an address (Nominatim), or
 * auto-detect. Reports `{ lat, lng, label }` via onLocationChange.
 */

import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { Compass, MapPin, Navigation, Search, X, Loader2 } from 'lucide-react';

interface MapPickerProps {
  lat: number;
  lng: number;
  label?: string;
  onLocationChange: (lat: number, lng: number, label?: string, accuracy?: number) => void;
}

const PIN_HTML = `<div class="hq-leaflet-pin"><div class="hq-leaflet-pin__head"></div></div>`;

let reverseGeocodeToken = 0;

export const MapPicker: React.FC<MapPickerProps> = ({ lat, lng, label, onLocationChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<{ map: any; marker: any } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Array<{ display_name: string; lat: string; lon: string }>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [status, setStatus] = useState(
    label || 'Search an address or click / drag the gold pin to set the exact delivery spot.'
  );

  // Bootstrap the map once (client-only dynamic import keeps SSR safe).
  useEffect(() => {
    let cancelled = false;
    let map: any;
    let marker: any;

    (async () => {
      const L = await import('leaflet');
      if (cancelled || !containerRef.current) return;

      map = L.map(containerRef.current, { zoomControl: true }).setView([lat, lng], 14);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      marker = L.marker([lat, lng], {
        draggable: true,
        icon: L.divIcon({
          className: 'hq-leaflet-pin-wrap',
          html: PIN_HTML,
          iconSize: [38, 48],
          iconAnchor: [19, 46],
        }),
      }).addTo(map);

      const updateLocation = (newLat: number, newLng: number) => {
        if (map) map.setView([newLat, newLng], Math.max(map.getZoom(), 15));
        if (marker) marker.setLatLng([newLat, newLng]);
        onLocationChange(newLat, newLng, undefined);
        reverseGeocode(newLat, newLng);
      };

      const reverseGeocode = (newLat: number, newLng: number) => {
        const token = ++reverseGeocodeToken;
        setStatus('Resolving address for your pin…');
        fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${newLat}&lon=${newLng}`)
          .then((r) => r.json())
          .then((data) => {
            if (token !== reverseGeocodeToken) return;
            const resolved = data?.display_name;
            setStatus(resolved ? `📍 Pinned: ${resolved}` : `📍 Pin Locked: ${newLat.toFixed(5)}, ${newLng.toFixed(5)}`);
            onLocationChange(newLat, newLng, resolved);
          })
          .catch(() => {
            if (token !== reverseGeocodeToken) return;
            setStatus(`📍 Pin Locked: ${newLat.toFixed(5)}, ${newLng.toFixed(5)}`);
            onLocationChange(newLat, newLng, undefined);
          });
      };

      map.on('click', (e: any) => updateLocation(e.latlng.lat, e.latlng.lng));
      marker.on('dragend', (e: any) => {
        const p = e.target.getLatLng();
        updateLocation(p.lat, p.lng);
      });

      mapRef.current = { map, marker };
    })();

    return () => {
      cancelled = true;
      map?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const m = mapRef.current;
    if (!m) return;
    m.marker.setLatLng([lat, lng]);
    m.map.setView([lat, lng], Math.max(m.map.getZoom(), 14));
  }, [lat, lng]);

  const handleDetect = () => {
    if (!navigator.geolocation) {
      setStatus('Geolocation not supported. Please search or click on the map.');
      return;
    }
    setIsLocating(true);
    setStatus('Detecting your exact GPS position…');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const newLat = parseFloat(pos.coords.latitude.toFixed(6));
        const newLng = parseFloat(pos.coords.longitude.toFixed(6));
        const m = mapRef.current;
        if (m) {
          m.marker.setLatLng([newLat, newLng]);
          m.map.setView([newLat, newLng], 17);
        }
        onLocationChange(newLat, newLng, undefined, pos.coords.accuracy);
        setStatus(`GPS locked at ${newLat.toFixed(5)}, ${newLng.toFixed(5)}${Math.round(pos.coords.accuracy) ? ` (accuracy ~${Math.round(pos.coords.accuracy)}m)` : ''}`);
        reverseGeocodeToken += Number.MAX_SAFE_INTEGER; // silence older callbacks
      },
      () => {
        setIsLocating(false);
        setStatus('Location access denied. Please search an address or click on the map.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSearch = async (value: string) => {
    setQuery(value);
    const trimmed = value.trim();
    if (trimmed.length < 3) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=6&q=${encodeURIComponent(trimmed)}`
      );
      const data = await res.json();
      if (Array.isArray(data)) {
        setSuggestions(
          data.map((d) => ({ display_name: d.display_name as string, lat: String(d.lat), lon: String(d.lon) }))
        );
      } else {
        setSuggestions([]);
      }
    } catch {
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePickSuggestion = (item: { display_name: string; lat: string; lon: string }) => {
    const newLat = parseFloat(item.lat);
    const newLng = parseFloat(item.lon);
    const m = mapRef.current;
    if (m) {
      m.marker.setLatLng([newLat, newLng]);
      m.map.setView([newLat, newLng], 17);
    }
    onLocationChange(newLat, newLng, item.display_name);
    setSuggestions([]);
    setQuery('');
    setStatus(`📍 Pinned: ${item.display_name}`);
  };

  return (
    <div className="space-y-2">
      {/* Address search (Zomato/Swiggy style) */}
      <div className="relative">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C6821]" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search building, area, landmark, city…"
              className="w-full pl-10 pr-10 py-3 rounded-xl bg-white border border-[#E5E0D6] text-xs focus:outline-hidden focus:border-[#B8860B] shadow-2xs"
            />
            {isSearching ? (
              <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C6821] animate-spin" />
            ) : (
              query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setSuggestions([]);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4 text-[#8C6821]" />
                </button>
              )
            )}
          </div>

          <button
            type="button"
            onClick={handleDetect}
            disabled={isLocating}
            className="inline-flex items-center gap-2 px-3.5 py-3 rounded-xl bg-[#141414] text-[#DFBA54] text-xs font-cinzel font-bold border border-[#D4AF37] hover:bg-[#282828] transition-all shadow-xs cursor-pointer shrink-0 disabled:opacity-60"
          >
            <Compass className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isLocating ? 'Locating…' : 'Detect My Location'}</span>
          </button>
        </div>

        {suggestions.length > 0 && (
          <div className="absolute z-20 top-full mt-1 w-full rounded-xl bg-white border border-[#D4AF37]/60 shadow-xl overflow-hidden">
            {suggestions.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePickSuggestion(item)}
                className="w-full text-left px-3.5 py-2.5 text-[11px] text-[#524B40] border-b border-[#F0ECE1] last:border-0 hover:bg-[#FAF5E8] cursor-pointer flex items-start gap-2"
              >
                <MapPin className="w-3.5 h-3.5 text-[#B8860B] shrink-0 mt-0.5" />
                <span className="line-clamp-2">{item.display_name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Live map */}
      <div className="rounded-2xl overflow-hidden border-2 border-[#D4AF37]/70 shadow-sm relative">
        <div ref={containerRef} className="w-full h-72 sm:h-80 relative z-0" />
        <div className="absolute bottom-3 left-3 right-3 z-10 p-2.5 rounded-xl bg-white/95 backdrop-blur-md border border-[#D4AF37]/50 flex items-center justify-between gap-2 text-[11px] text-[#524B40] shadow-xs">
          <span className="truncate flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-[#B8860B] shrink-0" />
            {status}
          </span>
          <a
            href={`https://maps.google.com/?q=${lat},${lng}`}
            target="_blank"
            rel="noreferrer"
            className="text-[#8C6821] font-bold hover:underline shrink-0 inline-flex items-center gap-1"
          >
            Open in Google Maps
          </a>
        </div>
      </div>

      <style jsx>{`
        .hq-leaflet-pin-wrap {
          background: transparent;
          border: none;
        }
        .hq-leaflet-pin {
          position: relative;
          width: 38px;
          height: 46px;
        }
        .hq-leaflet-pin__head {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 26px;
          height: 26px;
          border-radius: 50% 50% 50% 0;
          transform: translateX(-50%) rotate(-45deg);
          background: linear-gradient(135deg, #f3e5ab, #d4af37);
          border: 2px solid #141414;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.35);
        }
        .hq-leaflet-pin__head::after {
          content: '';
          position: absolute;
          top: 8px;
          left: 8px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #141414;
        }
      `}</style>
    </div>
  );
};