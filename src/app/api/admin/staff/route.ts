/**
 * Admin staff management.
 * GET  -> list admin accounts (owner and staff)
 * POST -> owner-only: create a staff account (username + password)
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, hashPassword, AdminRole } from '../../../../lib/auth';
import { getAdminUsersCollection } from '../../../../lib/mongo';

function cleanString(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function toStaffView(doc: Record<string, unknown>) {
  const { passwordHash: _p1, passwordSalt: _p2, ...rest } = doc;
  return rest;
}

export async function GET(request: NextRequest) {
  const current = await requireAdmin(request);
  if (!current) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  try {
    const collection = await getAdminUsersCollection();
    const items = await collection.find({}).sort({ role: 1, username: 1 }).toArray();
    return NextResponse.json({ items: items.map((d) => toStaffView(d as Record<string, unknown>)) });
  } catch (err) {
    console.error('list staff failed:', err);
    return NextResponse.json({ error: 'Could not load staff accounts.' }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  const current = await requireAdmin(request);
  if (!current) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  if (current.role !== 'owner') {
    return NextResponse.json({ error: 'Only the owner account can manage staff.' }, { status: 403 });
  }

  let body: { username?: string; name?: string; password?: string; role?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const username = cleanString(body.username, 40).toLowerCase();
  const name = cleanString(body.name, 60);
  const password = typeof body.password === 'string' ? body.password : '';
  const role = body.role === 'owner' ? 'owner' : 'admin';

  if (!/^[a-z0-9_.-]{3,40}$/.test(username)) {
    return NextResponse.json({ error: 'Username must be 3-40 chars using a-z, 0-9, dot, underscore or dash.' }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
  }

  try {
    const collection = await getAdminUsersCollection();
    const existing = await collection.findOne({ username });
    if (existing) {
      return NextResponse.json({ error: 'That username already exists.' }, { status: 409 });
    }
    const { salt, hash } = hashPassword(password);
    const now = new Date().toISOString();
    const result = await collection.insertOne({
      username,
      name: name || undefined,
      passwordHash: hash,
      passwordSalt: salt,
      role,
      active: true,
      createdAt: now,
      updatedAt: now,
      createdBy: current.userId,
    });
    return NextResponse.json({ id: String(result.insertedId), username, role }, { status: 201 });
  } catch (err) {
    console.error('create staff failed:', err);
    return NextResponse.json({ error: 'Could not create the staff account.' }, { status: 503 });
  }
}