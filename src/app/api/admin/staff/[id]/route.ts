/**
 * Admin staff updates/deletion (owner-only).
 * PATCH  -> edit name/role/active/password
 * DELETE -> remove a staff account
 * Guards: no self-demote/deactivate/delete, never remove the last active admin,
 *         never demote/delete the last active owner.
 */

import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { requireAdmin, hashPassword } from '../../../../../lib/auth';
import { getAdminUsersCollection } from '../../../../../lib/mongo';

type RouteContext = { params: Promise<{ id: string }> };

interface AdminUserDoc {
  _id: ObjectId;
  username: string;
  name?: string;
  role: 'owner' | 'admin';
  active: boolean;
}

function toStaffView(doc: Record<string, unknown>) {
  const { passwordHash: _p1, passwordSalt: _p2, ...rest } = doc;
  return rest;
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const current = await requireAdmin(request);
  if (!current) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  if (current.role !== 'owner') {
    return NextResponse.json({ error: 'Only the owner account can manage staff.' }, { status: 403 });
  }

  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid account id.' }, { status: 400 });
  }
  const isSelf = current.userId === id;

  let body: { name?: string; role?: string; active?: boolean; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  try {
    const collection = await getAdminUsersCollection();
    const target = (await collection.findOne({ _id: new ObjectId(id) })) as unknown as AdminUserDoc | null;
    if (!target) return NextResponse.json({ error: 'Account not found.' }, { status: 404 });

    const setFields: Record<string, unknown> = { updatedAt: new Date().toISOString() };

    if (typeof body.name === 'string') setFields.name = body.name.trim().slice(0, 60) || undefined;
    if (typeof body.password === 'string') {
      if (body.password.length < 8) {
        return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
      }
      const { salt, hash } = hashPassword(body.password);
      setFields.passwordSalt = salt;
      setFields.passwordHash = hash;
    }

    const nextActive = body.active === undefined ? target.active : !!body.active;
    const nextRole = body.role === 'owner' ? 'owner' : body.role === 'admin' ? 'admin' : target.role;

    if (target.role === 'owner' && nextRole !== 'owner' && isSelf) {
      return NextResponse.json({ error: 'You cannot demote your own account.' }, { status: 400 });
    }
    if (target.role === 'owner' && nextRole !== 'owner') {
      const ownerCount = await collection.countDocuments({ role: 'owner', active: true });
      if (ownerCount <= 1) {
        return NextResponse.json({ error: 'Cannot demote the last active owner.' }, { status: 400 });
      }
    }
    if (nextActive === false) {
      if (isSelf) {
        return NextResponse.json({ error: 'You cannot deactivate your own account.' }, { status: 400 });
      }
      const activeCount = await collection.countDocuments({ active: true });
      if (activeCount <= 1) {
        return NextResponse.json({ error: 'Cannot deactivate the last active admin.' }, { status: 400 });
      }
    }

    if (typeof body.role === 'string') setFields.role = nextRole;
    if (body.active !== undefined) setFields.active = nextActive;

    await collection.updateOne({ _id: new ObjectId(id) }, { $set: setFields });
    const updated = await collection.findOne({ _id: new ObjectId(id) });
    return NextResponse.json({ item: toStaffView(updated as Record<string, unknown>) });
  } catch (err) {
    console.error('update staff failed:', err);
    return NextResponse.json({ error: 'Could not update the account.' }, { status: 503 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const current = await requireAdmin(request);
  if (!current) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  if (current.role !== 'owner') {
    return NextResponse.json({ error: 'Only the owner account can manage staff.' }, { status: 403 });
  }

  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid account id.' }, { status: 400 });
  }
  if (current.userId === id) {
    return NextResponse.json({ error: 'You cannot delete your own account.' }, { status: 400 });
  }

  try {
    const collection = await getAdminUsersCollection();
    const target = (await collection.findOne({ _id: new ObjectId(id) })) as unknown as AdminUserDoc | null;
    if (!target) return NextResponse.json({ error: 'Account not found.' }, { status: 404 });

    if (target.active) {
      const activeCount = await collection.countDocuments({ active: true });
      if (activeCount <= 1) {
        return NextResponse.json({ error: 'Cannot delete the last active admin.' }, { status: 400 });
      }
    }
    if (target.role === 'owner') {
      const ownerCount = await collection.countDocuments({ role: 'owner', active: true });
      if (ownerCount <= 1) {
        return NextResponse.json({ error: 'Cannot delete the last active owner.' }, { status: 400 });
      }
    }

    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return NextResponse.json({ error: 'Account not found.' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('delete staff failed:', err);
    return NextResponse.json({ error: 'Could not delete the account.' }, { status: 503 });
  }
}