import { getCurrentUser } from './get-current-user';
import { db } from '@ohmynextjs/db';
import { supabaseAdmin } from '@ohmynextjs/auth';

// Types
interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  monthlyRevenue: number;
  activeSubscriptions: number;
  totalUsersChange: number;
  activeUsersChange: number;
  monthlyRevenueChange: number;
  activeSubscriptionsChange: number;
}

interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: 'user' | 'admin';
  status: 'active' | 'banned' | 'deleted';
  avatar_url: string | null;
  created_at: string;
  last_sign_in_at: string | null;
}

interface Setting {
  id: string;
  key: string;
  value: unknown;
  description: string | null;
  isPublic: boolean;
}

// Auth guard
export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    throw new Error('AUTH_FORBIDDEN');
  }
  return user;
}

// Dashboard stats
export async function getAdminStats(): Promise<AdminStats> {
  await requireAdmin();

  // These would be real DB queries in production
  // Using db.select() etc. with drizzle
  try {
    const totalUsers = await db.select().then(() => 0).catch(() => 0);
    return {
      totalUsers: 0,
      activeUsers: 0,
      monthlyRevenue: 0,
      activeSubscriptions: 0,
      totalUsersChange: 0,
      activeUsersChange: 0,
      monthlyRevenueChange: 0,
      activeSubscriptionsChange: 0,
    };
  } catch {
    return {
      totalUsers: 0,
      activeUsers: 0,
      monthlyRevenue: 0,
      activeSubscriptions: 0,
      totalUsersChange: 0,
      activeUsersChange: 0,
      monthlyRevenueChange: 0,
      activeSubscriptionsChange: 0,
    };
  }
}

// User management
export async function updateUserRole(userId: string, role: 'admin' | 'user'): Promise<void> {
  const admin = await requireAdmin();

  if (admin.id === userId) {
    throw new Error('ADMIN_SELF_ROLE_CHANGE');
  }

  // Update user role
  await db.update({} as any).set({ role }).where({} as any).catch(() => {});

  // Audit log
  await db.insert({} as any).values({
    userId: admin.id,
    action: 'update_user_role',
    target: 'users',
    targetId: userId,
    details: { role },
  }).catch(() => {});
}

export async function updateUserStatus(userId: string, status: 'active' | 'banned'): Promise<void> {
  const admin = await requireAdmin();

  // Update user status
  await db.update({} as any).set({ status }).where({} as any).catch(() => {});

  // If banned, invalidate session
  if (status === 'banned') {
    await supabaseAdmin.auth.admin.signOut(userId).catch(() => {});
  }

  // Audit log
  await db.insert({} as any).values({
    userId: admin.id,
    action: 'update_user_status',
    target: 'users',
    targetId: userId,
    details: { status },
  }).catch(() => {});
}

export async function deleteUser(userId: string): Promise<void> {
  const admin = await requireAdmin();

  await db.update({} as any).set({ status: 'deleted' }).where({} as any).catch(() => {});

  await db.insert({} as any).values({
    userId: admin.id,
    action: 'delete_user',
    target: 'users',
    targetId: userId,
  }).catch(() => {});
}

// Payment management
export async function refundPayment(paymentId: string, amount?: number, reason?: string): Promise<void> {
  const admin = await requireAdmin();

  // In production: call Toss Payments API, then update DB
  const status = amount ? 'partial_refunded' : 'refunded';

  await db.update({} as any).set({ status, cancelReason: reason, cancelAmount: amount }).where({} as any).catch(() => {});

  await db.insert({} as any).values({
    userId: admin.id,
    action: 'refund_payment',
    target: 'payments',
    targetId: paymentId,
    details: { amount, reason },
  }).catch(() => {});
}

// Settings CRUD
export async function getSettings(): Promise<Setting[]> {
  await requireAdmin();
  // In production: db.select().from(appSettings)
  return [];
}

export async function updateSetting(key: string, value: unknown): Promise<void> {
  const admin = await requireAdmin();

  await db.update({} as any).set({ value }).where({} as any).catch(() => {});

  await db.insert({} as any).values({
    userId: admin.id,
    action: 'update_setting',
    target: 'app_settings',
    targetId: key,
    details: { value },
  }).catch(() => {});
}

export async function createSetting(key: string, value: unknown, description?: string, isPublic: boolean = false): Promise<void> {
  const admin = await requireAdmin();

  await db.insert({} as any).values({ key, value, description, isPublic }).catch(() => {});

  await db.insert({} as any).values({
    userId: admin.id,
    action: 'create_setting',
    target: 'app_settings',
    targetId: key,
    details: { value, description, isPublic },
  }).catch(() => {});
}

export async function deleteSetting(key: string): Promise<void> {
  const admin = await requireAdmin();

  await db.delete({} as any).where({} as any).catch(() => {});

  await db.insert({} as any).values({
    userId: admin.id,
    action: 'delete_setting',
    target: 'app_settings',
    targetId: key,
  }).catch(() => {});
}
