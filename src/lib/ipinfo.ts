/**
 * ipinfo.ts
 * -----------------------------------------------------------------------------
 * Collect the client IP strictly from server-side request headers (never from
 * the client) and enrich it with a free IP-details checker (ip-api.com, no key)
 * so orders carry country/city/ISP info for the admin panel.
 */

import type { NextRequest } from 'next/server';
import type { OrderMeta } from '../types/order';

/** Pull the real client IP from proxy/edge headers. */
export function clientIpFromRequest(request: NextRequest): string {
  const fwd = request.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return (
    request.headers.get('x-real-ip') ??
    request.headers.get('cf-connecting-ip') ??
    request.headers.get('x-vercel-forwarded-for') ??
    '127.0.0.1'
  );
}

function isPrivateIp(ip: string): boolean {
  const cleaned = ip.replace(/^::ffff:/, '');
  if (cleaned === '127.0.0.1' || cleaned === '::1' || cleaned === 'localhost') return true;
  if (cleaned.startsWith('10.') || cleaned.startsWith('192.168.') || cleaned.startsWith('172.')) return true;
  return false;
}

/**
 * Enrich an IP via ip-api.com (free, ~45 req/min). Returns null when the IP is
 * private, the lookup fails, or the service is unreachable — callers treat that
 * as "no extra info", never as an error.
 */
export async function lookupIpInfo(ip: string): Promise<NonNullable<OrderMeta['ipInfo']> | null> {
  if (!ip || isPrivateIp(ip)) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3500);

  try {
    const fields = 'status,country,countryCode,regionName,city,zip,lat,lon,timezone,isp,org,as,query';
    const res = await fetch(`https://ip-api.com/json/${encodeURIComponent(ip)}?fields=${fields}`, {
      signal: controller.signal,
      headers: { 'user-agent': 'hamper-queen/1.0 (order tracking)' },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      status: string;
      country?: string;
      countryCode?: string;
      regionName?: string;
      city?: string;
      zip?: string;
      lat?: number;
      lon?: number;
      timezone?: string;
      isp?: string;
      org?: string;
      as?: string;
    };
    if (data.status !== 'success') return null;
    return {
      country: data.country,
      countryCode: data.countryCode,
      regionName: data.regionName,
      city: data.city,
      zip: data.zip,
      lat: data.lat,
      lon: data.lon,
      timezone: data.timezone,
      isp: data.isp,
      org: data.org,
      as: data.as,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** Capture order meta from a request: IP + headers, enriched IP info. */
export async function buildOrderMeta(request: NextRequest): Promise<OrderMeta> {
  const ip = clientIpFromRequest(request);
  const ipInfo = await lookupIpInfo(ip);
  return {
    ip,
    ipInfo,
    userAgent: request.headers.get('user-agent') ?? undefined,
    referer: request.headers.get('referer') ?? undefined,
  };
}