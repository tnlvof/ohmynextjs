import { requireAdmin } from '@/lib/admin/auth';
import { LegalDocForm } from './legal-doc-form';
import { db } from '@/lib/db/client';
import { legalDocuments } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export default async function NewLegalDocPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; from?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const type = params.type === 'privacy' ? 'privacy' : 'terms';

  let initialContent = '';
  let initialTitle = '';

  if (params.from) {
    const [source] = await db
      .select()
      .from(legalDocuments)
      .where(eq(legalDocuments.id, params.from))
      .limit(1);
    if (source) {
      initialContent = source.content;
      initialTitle = source.title;
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {type === 'terms' ? '이용약관' : '개인정보처리방침'} 새 버전 작성
      </h1>
      <LegalDocForm type={type} initialTitle={initialTitle} initialContent={initialContent} />
    </div>
  );
}
