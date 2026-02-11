'use server';

import { db } from '@/lib/db/client';
import { legalDocuments, auditLogs } from '@/lib/db/schema';
import { eq, and, desc, max } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from './auth';

export type ActionResult = { success: true } | { success: false; error: string };

export type LegalDocType = 'terms' | 'privacy';

export async function getActiveLegalDoc(type: LegalDocType) {
  const [doc] = await db
    .select()
    .from(legalDocuments)
    .where(and(eq(legalDocuments.type, type), eq(legalDocuments.isActive, true)))
    .limit(1);

  return doc ?? null;
}

export async function getLegalDocs(type: LegalDocType) {
  const docs = await db
    .select()
    .from(legalDocuments)
    .where(eq(legalDocuments.type, type))
    .orderBy(desc(legalDocuments.version));

  return docs;
}

export async function getNextVersion(type: LegalDocType): Promise<number> {
  const [result] = await db
    .select({ maxVersion: max(legalDocuments.version) })
    .from(legalDocuments)
    .where(eq(legalDocuments.type, type))
    .limit(1);

  return (result?.maxVersion ?? 0) + 1;
}

export async function createLegalDoc(data: {
  type: LegalDocType;
  title: string;
  content: string;
  effectiveDate?: Date | null;
}): Promise<ActionResult> {
  try {
    const admin = await requireAdmin();
    const version = await getNextVersion(data.type);

    const [inserted] = await db.insert(legalDocuments).values({
      type: data.type,
      version,
      title: data.title,
      content: data.content,
      effectiveDate: data.effectiveDate ?? null,
      createdBy: admin.userId,
    }).returning({ id: legalDocuments.id });

    await db.insert(auditLogs).values({
      userId: admin.userId,
      action: 'legal.create',
      target: 'legal_documents',
      targetId: inserted.id,
      details: { type: data.type, version, title: data.title },
    });

    revalidatePath('/admin/legal');
    revalidatePath(`/${data.type === 'terms' ? 'terms' : 'privacy'}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: '약관 생성에 실패했습니다.' };
  }
}

export async function activateLegalDoc(id: string): Promise<ActionResult> {
  try {
    const admin = await requireAdmin();

    const [doc] = await db
      .select()
      .from(legalDocuments)
      .where(eq(legalDocuments.id, id))
      .limit(1);

    if (!doc) {
      return { success: false, error: '문서를 찾을 수 없습니다.' };
    }

    // Deactivate all docs of the same type
    await db
      .update(legalDocuments)
      .set({ isActive: false, updatedAt: new Date() })
      .where(and(eq(legalDocuments.type, doc.type), eq(legalDocuments.isActive, true)));

    // Activate this doc
    await db
      .update(legalDocuments)
      .set({ isActive: true, updatedAt: new Date() })
      .where(eq(legalDocuments.id, id));

    await db.insert(auditLogs).values({
      userId: admin.userId,
      action: 'legal.activate',
      target: 'legal_documents',
      targetId: id,
      details: { type: doc.type, version: doc.version },
    });

    revalidatePath('/admin/legal');
    revalidatePath(`/${doc.type === 'terms' ? 'terms' : 'privacy'}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: '활성화에 실패했습니다.' };
  }
}
