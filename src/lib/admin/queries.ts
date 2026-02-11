'use server';

import { db } from '@/lib/db/client';
import { users, payments, appSettings } from '@/lib/db/schema';
import { eq, ne, sql, ilike, or, desc, count, sum } from 'drizzle-orm';

// Types
export interface AdminStats {
  totalUsers: number;
  todaySignups: number;
  totalRevenue: number;
  monthlyRevenue: number;
}

export interface UsersResponse {
  users: Array<{
    id: string;
    email: string;
    name: string | null;
    role: 'user' | 'admin';
    status: 'active' | 'banned' | 'deleted';
    provider: string | null;
    createdAt: Date;
    lastSignInAt: Date | null;
  }>;
  total: number;
  page: number;
  totalPages: number;
}

export interface PaymentWithUser {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed' | 'cancelled' | 'refunded' | 'partial_refunded';
  method: 'card' | 'virtual_account' | 'transfer' | 'mobile' | null;
  paidAt: Date | null;
  createdAt: Date;
  user: { email: string; name: string | null } | null;
}

export interface PaymentsResponse {
  payments: PaymentWithUser[];
  total: number;
  page: number;
  totalPages: number;
}

// Dashboard
export async function getAdminStats(): Promise<AdminStats> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const [[userStats], [revenueStats], [monthlyStats], [todayStats]] = await Promise.all([
    db.select({ count: count() }).from(users).where(ne(users.status, 'deleted')),
    db.select({ total: sum(payments.amount) }).from(payments).where(eq(payments.status, 'paid')),
    db.select({ total: sum(payments.amount) }).from(payments)
      .where(sql`${payments.status} = 'paid' AND ${payments.paidAt} >= ${monthStart}`),
    db.select({ count: count() }).from(users)
      .where(sql`${users.createdAt} >= ${today} AND ${users.status} != 'deleted'`),
  ]);

  return {
    totalUsers: userStats?.count ?? 0,
    todaySignups: todayStats?.count ?? 0,
    totalRevenue: Number(revenueStats?.total ?? 0),
    monthlyRevenue: Number(monthlyStats?.total ?? 0),
  };
}

export async function getRecentUsers(limit = 5) {
  return db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(ne(users.status, 'deleted'))
    .orderBy(desc(users.createdAt))
    .limit(limit);
}

export async function getRecentPayments(limit = 5) {
  return db
    .select({
      id: payments.id,
      orderId: payments.orderId,
      amount: payments.amount,
      currency: payments.currency,
      status: payments.status,
      paidAt: payments.paidAt,
      createdAt: payments.createdAt,
      userName: users.name,
      userEmail: users.email,
    })
    .from(payments)
    .leftJoin(users, eq(payments.userId, users.id))
    .orderBy(desc(payments.createdAt))
    .limit(limit);
}

// Users
export async function getUsers(params: {
  query?: string;
  page?: number;
  perPage?: number;
}): Promise<UsersResponse> {
  const { query, page = 1, perPage = 20 } = params;
  const offset = (page - 1) * perPage;

  const conditions = [ne(users.status, 'deleted')];

  let whereClause = ne(users.status, 'deleted');
  if (query) {
    whereClause = sql`${users.status} != 'deleted' AND (${ilike(users.name, `%${query}%`)} OR ${ilike(users.email, `%${query}%`)})` as any;
  }

  const [data, [{ total }]] = await Promise.all([
    db.select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      status: users.status,
      provider: users.provider,
      createdAt: users.createdAt,
      lastSignInAt: users.lastSignInAt,
    })
      .from(users)
      .where(whereClause)
      .orderBy(desc(users.createdAt))
      .limit(perPage)
      .offset(offset),
    db.select({ total: count() }).from(users).where(whereClause),
  ]);

  return {
    users: data as UsersResponse['users'],
    total,
    page,
    totalPages: Math.ceil(total / perPage),
  };
}

// Payments
export async function getPayments(params: {
  status?: string;
  page?: number;
  perPage?: number;
}): Promise<PaymentsResponse> {
  const { status, page = 1, perPage = 20 } = params;
  const offset = (page - 1) * perPage;

  const whereClause = status
    ? sql`${payments.status} = ${status}`
    : undefined;

  const [data, [{ total }]] = await Promise.all([
    db.select({
      id: payments.id,
      orderId: payments.orderId,
      amount: payments.amount,
      currency: payments.currency,
      status: payments.status,
      method: payments.method,
      paidAt: payments.paidAt,
      createdAt: payments.createdAt,
      userName: users.name,
      userEmail: users.email,
    })
      .from(payments)
      .leftJoin(users, eq(payments.userId, users.id))
      .where(whereClause as any)
      .orderBy(desc(payments.createdAt))
      .limit(perPage)
      .offset(offset),
    db.select({ total: count() }).from(payments).where(whereClause as any),
  ]);

  return {
    payments: data.map((p) => ({
      id: p.id,
      orderId: p.orderId,
      amount: p.amount,
      currency: p.currency,
      status: p.status,
      method: p.method,
      paidAt: p.paidAt,
      createdAt: p.createdAt,
      user: p.userEmail ? { email: p.userEmail, name: p.userName } : null,
    })),
    total,
    page,
    totalPages: Math.ceil(total / perPage),
  };
}

// Settings
export async function getSettings() {
  return db
    .select()
    .from(appSettings)
    .orderBy(desc(appSettings.createdAt));
}
