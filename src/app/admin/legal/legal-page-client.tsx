'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { activateLegalDoc } from '@/lib/admin/legal-actions';

interface LegalDoc {
  id: string;
  type: string;
  version: number;
  title: string;
  isActive: boolean;
  effectiveDate: string | null;
  createdAt: string;
}

export function LegalPageClient({ docs, currentType }: { docs: LegalDoc[]; currentType: string }) {
  const router = useRouter();
  const [activating, setActivating] = useState<string | null>(null);

  const handleActivate = async (id: string) => {
    if (!confirm('이 버전을 활성화하시겠습니까? 기존 활성 버전은 비활성화됩니다.')) return;
    setActivating(id);
    try {
      const result = await activateLegalDoc(id);
      if (!result.success) {
        alert(result.error);
      }
      router.refresh();
    } finally {
      setActivating(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">약관 관리</h1>
        <Link
          href={`/admin/legal/new?type=${currentType}`}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          새 버전 작성
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <Link
          href="/admin/legal?type=terms"
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            currentType === 'terms'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          이용약관
        </Link>
        <Link
          href="/admin/legal?type=privacy"
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            currentType === 'privacy'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          개인정보처리방침
        </Link>
      </div>

      {/* Table */}
      {docs.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">등록된 문서가 없습니다.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-4 py-3 font-medium">버전</th>
                <th className="px-4 py-3 font-medium">제목</th>
                <th className="px-4 py-3 font-medium">시행일</th>
                <th className="px-4 py-3 font-medium">상태</th>
                <th className="px-4 py-3 font-medium">작성일</th>
                <th className="px-4 py-3 font-medium">액션</th>
              </tr>
            </thead>
            <tbody>
              {docs.map((doc) => (
                <tr key={doc.id} className="border-b border-border">
                  <td className="px-4 py-3">v{doc.version}</td>
                  <td className="px-4 py-3">{doc.title}</td>
                  <td className="px-4 py-3">
                    {doc.effectiveDate ? new Date(doc.effectiveDate).toLocaleDateString('ko-KR') : '-'}
                  </td>
                  <td className="px-4 py-3">
                    {doc.isActive ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        활성
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                        비활성
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(doc.createdAt).toLocaleDateString('ko-KR')}
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    {!doc.isActive && (
                      <button
                        onClick={() => handleActivate(doc.id)}
                        disabled={activating === doc.id}
                        className="text-xs text-primary hover:underline disabled:opacity-50"
                      >
                        {activating === doc.id ? '처리중...' : '활성화'}
                      </button>
                    )}
                    <Link
                      href={`/admin/legal/new?type=${doc.type}&from=${doc.id}`}
                      className="text-xs text-muted-foreground hover:underline"
                    >
                      복제
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
