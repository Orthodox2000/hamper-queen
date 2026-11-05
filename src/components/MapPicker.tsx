'use client';

/**
 * MapPicker.tsx
 * -----------------------------------------------------------------------------
 * Ola / Uber-style delivery pin picker (Leaflet + OpenStreetMap data, no API key).
 *
 *  - The pin stays fixed at the centre; the customer drags the MAP underneath it.
 *    The pin lifts while the map moves and drops with a small bounce when it settles.
 *  - On settle the centre is reverse-geocoded (Nominatim) into a friendly
 *    "Delivering to …" card with the area name and full address.
 *  - Floating search with suggestions, "use my location" and zoom controls.
 *  - "Confirm location" locks the spot and hands a structured address
 *    (flat / street / landmark / city / pincode) to the checkout form so the
 *    customer only has to add their flat or floor.
 *
 * Reports `{ lat, lng, label }` through onLocationChange exactly like before, so
 * existing callers keep working; onAddressResolved is the new optional hook.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { Check, Crosshair, Loader2, MapPin, Minus, Navigation, Plus, Search, X } from 'lucide-react';

export interface ResolvedAddress {
  flatBuilding: string;
  street: string;
  landmark: string;
  city: string;
  pincode: string;
  /** Short headline, e.g. "Bandra West". */
  title: string;
  /** Full single-line address. */
  display: string;
}

interface MapPickerProps {
  lat: number;
  lng: number;
  label?: string;
  onLocationChange: (lat: number, lng: number, label?: string, accuracy?: number) => void;
  /** Called when the customer confirms the pin (and after locate / search picks). */
  onAddressResolved?: (address: ResolvedAddress) => void;
}

interface Suggestion {
  title: string;
  subtitle: string;
  lat: number;
  lng: number;
}

type Phase = 'moving' | 'resolving' | 'ready';

const NOMINATIM = 'https://nominatim.openstreetmap.org';

/** Turn a Nominatim result into the structured address the checkout form needs. */
function toAddress(data: any): ResolvedAddress | null {
  if (!data) return null;
  const a = data.address || {};
  const road = a.road || a.pedestrian || a.footway || '';
  const area = a.neighbourhood || a.suburb || a.city_district || '';
  const city = a.city || a.town || a.village || a.state_district || a.county || '';
  const flat = [a.house_number, a.building].filter(Boolean).join(', ');
  const title = data.name || area || road || city || 'Pinned location';
  const pincode = String(a.postcode || '').replace(/\D/g, '').slice(0, 6);
  return {
    flatBuilding: flat,
    street: [road, area].filter(Boolean).join(', '),
    landmark: data.name && data.name !== road ? String(data.name) : '',
    city,
    pincode,
    title,
    display: data.display_name || '',
  };
}

const distanceM = (aLat: number, aLng: number, bLat: number, bLng: number) => {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};

export const MapPicker: React.FC<MapPickerProps> = ({ lat, lng, label, onLocationChange, onAddressResolved }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  // Latest callbacks/props without re-creating the map.
  const onChangeRef = useRef(onLocationChange);
  const onResolvedRef = useRef(onAddressResolved);
  onChangeRef.current = onLocationChange;
  onResolvedRef.current = onAddressResolved;

  const reqId = useRef(0);
  const abortRef = useRef<AbortController | null>(null);
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autofillNext = useRef(false);
  const lastSent = useRef({ lat, lng });

  const [phase, setPhase] = useState<Phase>('resolving');
  const [address, setAddress] = useState<ResolvedAddress | null>(null);
  const [coords, setCoords] = useState({ lat, lng });
  const [confirmed, setConfirmed] = useState(false);
  const [notice, setNotice] = useState('');

  const [isLocating, setIsLocating] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchAbort = useRef<AbortController | null>(null);

  /** Reverse-geocode the settled centre. */
  const resolve = useCallback(async (cLat: number, cLng: number) => {
    const id = ++reqId.current;
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setPhase('resolving');
    try {
      const res = await fetch(
        `${NOMINATIM}/reverse?format=jsonv2&addressdetails=1&zoom=18&accept-language=en&lat=${cLat}&lon=${cLng}`,
        { signal: ctrl.signal }
      );
      const data = await res.json();
      if (id !== reqId.current) return;
      const addr = toAddress(data);
      setAddress(addr);
      setPhase('ready');
      onChangeRef.current(cLat, cLng, addr?.display || undefined);
      if (autofillNext.current && addr) {
        autofillNext.current = false;
        onResolvedRef.current?.(addr);
        setConfirmed(true);
        setNotice('Address filled in below — just add your flat or floor.');
      }
    } catch (err: any) {
      if (err?.name === 'AbortError' || id !== reqId.current) return;
      setAddress(null);
      setPhase('ready');
      onChangeRef.current(cLat, cLng, undefined);
    }
  }, []);

  // ---- Map bootstrap (client only) ----------------------------------------
  useEffect(() => {
    let cancelled = false;
    let map: any;

    (async () => {
      const L = await import('leaflet');
      if (cancelled || !containerRef.current) return;

      map = L.map(containerRef.current, { zoomControl: false, attributionControl: true }).setView([lat, lng], 16);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      }).addTo(map);

      map.on('movestart', () => {
        pinRef.current?.classList.remove('is-dropping');
        pinRef.current?.classList.add('is-lifted');
        if (settleTimer.current) clearTimeout(settleTimer.current);
        setPhase('moving');
        setConfirmed(false);
        setNotice('');
      });

      map.on('moveend', () => {
        const c = map.getCenter();
        const el = pinRef.current;
        if (el) {
          el.classList.remove('is-lifted');
          void el.offsetWidth; // restart the drop animation
          el.classList.add('is-dropping');
        }
        const cLat = parseFloat(c.lat.toFixed(6));
        const cLng = parseFloat(c.lng.toFixed(6));
        setCoords({ lat: cLat, lng: cLng });
        lastSent.current = { lat: cLat, lng: cLng };
        onChangeRef.current(cLat, cLng, undefined);
        if (settleTimer.current) clearTimeout(settleTimer.current);
        settleTimer.current = setTimeout(() => resolve(cLat, cLng), 280);
      });

      mapRef.current = map;
      // Make sure the first paint is correct inside a modal that just animated in.
      setTimeout(() => map && map.invalidateSize(), 350);
      resolve(lat, lng);
    })();

    return () => {
      cancelled = true;
      if (settleTimer.current) clearTimeout(settleTimer.current);
      if (searchTimer.current) clearTimeout(searchTimer.current);
      abortRef.current?.abort();
      searchAbort.current?.abort();
      map?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Parent moved the location (e.g. restored state) -> follow, but ignore our own echoes.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (distanceM(lat, lng, lastSent.current.lat, lastSent.current.lng) < 5) return;
    map.setView([lat, lng], Math.max(map.getZoom(), 16));
  }, [lat, lng]);

  // ---- Actions -------------------------------------------------------------
  const flyTo = (cLat: number, cLng: number, zoom = 17) => {
    const map = mapRef.current;
    if (!map) return;
    autofillNext.current = true;
    map.flyTo([cLat, cLng], zoom, { duration: 0.9 });
  };

  const handleLocate = () => {
    if (!navigator.geolocation) {
      setNotice('Location is not supported on this device — search or move the map instead.');
      return;
    }
    setIsLocating(true);
    setNotice('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        flyTo(pos.coords.latitude, pos.coords.longitude, 17);
        onChangeRef.current(pos.coords.latitude, pos.coords.longitude, undefined, pos.coords.accuracy);
      },
      () => {
        setIsLocating(false);
        setNotice('Location access was blocked — search your area or move the map to your door.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSearch = (value: string) => {
    setQuery(value);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (value.trim().length < 3) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    searchTimer.current = setTimeout(async () => {
      searchAbort.current?.abort();
      const ctrl = new AbortController();
      searchAbort.current = ctrl;
      try {
        const res = await fetch(
          `${NOMINATIM}/search?format=jsonv2&addressdetails=1&limit=5&countrycodes=in&accept-language=en&q=${encodeURIComponent(value.trim())}`,
          { signal: ctrl.signal }
        );
        const data = await res.json();
        setSuggestions(
          Array.isArray(data)
            ? data.map((d: any) => {
                const parts = String(d.display_name).split(',');
                return {
                  title: d.name || parts[0],
                  subtitle: parts.slice(1, 4).join(',').trim(),
                  lat: parseFloat(d.lat),
                  lng: parseFloat(d.lon),
                };
              })
            : []
        );
      } catch (err: any) {
        if (err?.name !== 'AbortError') setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 350);
  };

  const pickSuggestion = (s: Suggestion) => {
    setSuggestions([]);
    setQuery('');
    flyTo(s.lat, s.lng, 17);
  };

  const handleConfirm = () => {
    if (address) onResolvedRef.current?.(address);
    setConfirmed(true);
    setNotice(address ? 'Address filled in below — just add your flat or floor.' : 'Pin saved. Please type your address below.');
  };

  const busy = phase !== 'ready';
  const headline = address?.title || (busy ? 'Finding this spot…' : 'Pinned location');
  const subline = address?.display || `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`;

  return (
    <div className="space-y-2">
      <div className="relative isolate overflow-hidden rounded-3xl bg-cream-200 shadow-lift ring-1 ring-line-strong">
        {/* Map */}
        <div ref={containerRef} className="h-[460px] w-full sm:h-[480px]" aria-label="Delivery map. Drag the map to move the pin." />

        {/* Floating search */}
        <div className="absolute inset-x-3 top-3 z-[1000]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-700" aria-hidden="true" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search building, area or landmark"
              aria-label="Search delivery address"
              className="h-12 w-full rounded-full bg-white pl-11 pr-11 text-sm text-ink shadow-float ring-1 ring-line outline-none transition-shadow placeholder:text-mist focus:ring-2 focus:ring-gold-600"
            />
            {isSearching ? (
              <Loader2 className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-gold-700" />
            ) : (
              query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setSuggestions([]);
                  }}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-stone hover:bg-cream-100"
                >
                  <X className="h-4 w-4" />
                </button>
              )
            )}
          </div>

          {suggestions.length > 0 && (
            <ul className="mt-2 max-h-60 overflow-y-auto rounded-2xl bg-white p-1 shadow-float ring-1 ring-line animate-fade-up">
              {suggestions.map((s, i) => (
                <li key={`${s.lat}-${s.lng}-${i}`}>
                  <button
                    type="button"
                    onClick={() => pickSuggestion(s)}
                    className="flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-gold-50"
                  >
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream-100 text-gold-700">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-ink">{s.title}</span>
                      <span className="block truncate text-xs text-stone">{s.subtitle}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Zoom + locate */}
        <div className="absolute right-3 top-[76px] z-[900] flex flex-col gap-2">
          <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-float ring-1 ring-line">
            <button type="button" aria-label="Zoom in" onClick={() => mapRef.current?.zoomIn()} className="flex h-10 w-10 items-center justify-center text-ink transition-colors hover:bg-gold-50">
              <Plus className="h-4 w-4" />
            </button>
            <span className="h-px bg-line" />
            <button type="button" aria-label="Zoom out" onClick={() => mapRef.current?.zoomOut()} className="flex h-10 w-10 items-center justify-center text-ink transition-colors hover:bg-gold-50">
              <Minus className="h-4 w-4" />
            </button>
          </div>
          <button
            type="button"
            onClick={handleLocate}
            disabled={isLocating}
            aria-label="Use my current location"
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-gold-700 shadow-float ring-1 ring-line transition-all hover:bg-gold-50 active:scale-95"
          >
            {isLocating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Crosshair className="h-5 w-5" />}
          </button>
        </div>

        {/* Fixed centre pin: its tip sits exactly on the map centre */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-[800] h-0 w-0" aria-hidden="true">
          <span className={`hq-pin-shadow ${busy && phase === 'moving' ? 'is-lifted' : ''}`} />
          <div ref={pinRef} className="hq-pin">
            <div className="hq-pin__bubble">{phase === 'moving' ? 'Release to drop pin' : busy ? 'Locating…' : 'Deliver here'}</div>
            <div className="hq-pin__head">
              <span className="hq-pin__dot" />
            </div>
            <div className="hq-pin__stem" />
          </div>
        </div>

        {/* Delivering-to sheet */}
        <div className="absolute inset-x-3 bottom-3 z-[1000] rounded-3xl bg-white/95 p-4 shadow-float ring-1 ring-line backdrop-blur-md">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gold-50 text-gold-700 ring-1 ring-gold-200">
              <Navigation className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-stone">Delivering to</p>
              <p className="truncate font-seasons text-base font-bold leading-tight text-ink" aria-live="polite">{headline}</p>
              <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-stone">{subline}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={busy}
            className={`btn mt-3 w-full ${confirmed ? 'bg-emerald-700 text-white shadow-soft' : 'btn-primary'}`}
          >
            {busy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{phase === 'moving' ? 'Move the map to your door' : 'Finding address…'}</span>
              </>
            ) : confirmed ? (
              <>
                <Check className="h-4 w-4" />
                <span>Location confirmed</span>
              </>
            ) : (
              <span>Confirm location</span>
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-stone" aria-live="polite">
        <span className={notice ? 'font-medium text-emerald-700' : ''}>
          {notice || label || 'Drag the map so the pin sits on your doorstep.'}
        </span>
        <a
          href={`https://maps.google.com/?q=${coords.lat},${coords.lng}`}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-gold-700 underline-offset-4 hover:underline"
        >
          Open in Google Maps
        </a>
      </div>
    </div>
  );
};
