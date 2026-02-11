import { requireAdmin } from '@/lib/admin/auth';
import { getLegalDocs } from '@/lib/admin/legal-actions';
import { LegalPageClient } from './legal-page-client';

export default async function AdminLegalPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const type = params.type === 'privacy' ? 'privacy' : 'terms';
  const docs = await getLegalDocs(type);

  return <LegalPageClient docs={JSON.parse(JSON.stringify(docs))} currentType={type} />;
}
