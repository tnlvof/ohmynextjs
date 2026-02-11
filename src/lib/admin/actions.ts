'use server';

import { db } from '@/lib/db/client';
import { users, appSettings, auditLogs } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from './auth';

export type ActionResult = { success: true } | { success: false; error: string };

// User actions
export async function updateUserRole(userId: string, role: 'user' | 'admin'): Promise<ActionResult> {
  try {
    const admin = await requireAdmin();

    if (admin.userId === userId) {
      return { success: false, error: '자기 자신의 역할은 변경할 수 없습니다.' };
    }

    const [target] = await db.select({ role: users.role }).from(users).where(eq(users.id, userId)).limit(1);
    if (!target) return { success: false, error: '유저를 찾을 수 없습니다.' };

    const oldRole = target.role;
    await db.update(users).set({ role, updatedAt: new Date() }).where(eq(users.id, userId));

    await db.insert(auditLogs).values({
      userId: admin.userId,
      action: 'user.role.update',
      target: 'users',
      targetId: userId,
      details: { from: oldRole, to: role },
    });

    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    return { success: false, error: '역할 변경에 실패했습니다.' };
  }
}

export async function updateUserStatus(userId: string, status: 'active' | 'banned'): Promise<ActionResult> {
  try {
    const admin = await requireAdmin();

    if (admin.userId === userId) {
      return { success: false, error: '자기 자신의 상태는 변경할 수 없습니다.' };
    }

    const [target] = await db.select({ status: users.status }).from(users).where(eq(users.id, userId)).limit(1);
    if (!target) return { success: false, error: '유저를 찾을 수 없습니다.' };

    const oldStatus = target.status;
    await db.update(users).set({ status, updatedAt: new Date() }).where(eq(users.id, userId));

    await db.insert(auditLogs).values({
      userId: admin.userId,
      action: 'user.status.update',
      target: 'users',
      targetId: userId,
      details: { from: oldStatus, to: status },
    });

    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    return { success: false, error: '상태 변경에 실패했습니다.' };
  }
}

// Settings actions
export async function createSetting(data: {
  key: string;
  value: unknown;
  description?: string;
  isPublic?: boolean;
}): Promise<ActionResult> {
  try {
    const admin = await requireAdmin();

    const [inserted] = await db.insert(appSettings).values({
      key: data.key,
      value: data.value,
      description: data.description ?? null,
      isPublic: data.isPublic ?? false,
    }).returning({ id: appSettings.id });

    await db.insert(auditLogs).values({
      userId: admin.userId,
      action: 'setting.create',
      target: 'app_settings',
      targetId: inserted.id,
      details: { key: data.key, value: data.value },
    });

    revalidatePath('/admin/settings');
    return { success: true };
  } catch (error) {
    return { success: false, error: '설정 추가에 실패했습니다.' };
  }
}

export async function updateSetting(id: string, data: {
  value?: unknown;
  description?: string;
  isPublic?: boolean;
}): Promise<ActionResult> {
  try {
    const admin = await requireAdmin();

    const [existing] = await db.select().from(appSettings).where(eq(appSettings.id, id)).limit(1);
    if (!existing) return { success: false, error: '설정을 찾을 수 없습니다.' };

    await db.update(appSettings).set({
      ...(data.value !== undefined && { value: data.value }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.isPublic !== undefined && { isPublic: data.isPublic }),
      updatedAt: new Date(),
    }).where(eq(appSettings.id, id));

    await db.insert(auditLogs).values({
      userId: admin.userId,
      action: 'setting.update',
      target: 'app_settings',
      targetId: id,
      details: { key: existing.key, changes: data },
    });

    revalidatePath('/admin/settings');
    return { success: true };
  } catch (error) {
    return { success: false, error: '설정 수정에 실패했습니다.' };
  }
}

export async function deleteSetting(id: string): Promise<ActionResult> {
  try {
    const admin = await requireAdmin();

    const [existing] = await db.select({ key: appSettings.key }).from(appSettings).where(eq(appSettings.id, id)).limit(1);
    if (!existing) return { success: false, error: '설정을 찾을 수 없습니다.' };

    await db.delete(appSettings).where(eq(appSettings.id, id));

    await db.insert(auditLogs).values({
      userId: admin.userId,
      action: 'setting.delete',
      target: 'app_settings',
      targetId: id,
      details: { key: existing.key },
    });

    revalidatePath('/admin/settings');
    return { success: true };
  } catch (error) {
    return { success: false, error: '설정 삭제에 실패했습니다.' };
  }
}
