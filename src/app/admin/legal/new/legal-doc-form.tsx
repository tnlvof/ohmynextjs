'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createLegalDoc } from '@/lib/admin/legal-actions';
import { MarkdownRenderer } from '@/components/admin/markdown-renderer';

interface Props {
  type: 'terms' | 'privacy';
  initialTitle: string;
  initialContent: string;
}

export function LegalDocForm({ type, initialTitle, initialContent }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [effectiveDate, setEffectiveDate] = useState('');
  const [preview, setPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }
    setSubmitting(true);
    try {
      const result = await createLegalDoc({
        type,
        title: title.trim(),
        content: content.trim(),
        effectiveDate: effectiveDate ? new Date(effectiveDate) : null,
      });
      if (result.success) {
        router.push(`/admin/legal?type=${type}`);
      } else {
        alert(result.error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <div>
        <label className="block text-sm font-medium mb-1">제목</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={`${type === 'terms' ? '이용약관' : '개인정보처리방침'} v2`}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">시행일</label>
        <input
          type="date"
          value={effectiveDate}
          onChange={(e) => setEffectiveDate(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm font-medium">내용 (마크다운)</label>
          <button
            type="button"
            onClick={() => setPreview(!preview)}
            className="text-xs text-primary hover:underline"
          >
            {preview ? '편집' : '미리보기'}
          </button>
        </div>
        {preview ? (
          <div className="rounded-md border border-border p-4 min-h-[400px]">
            <MarkdownRenderer content={content} />
          </div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={20}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono"
            placeholder="마크다운으로 약관 내용을 작성하세요..."
            required
          />
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {submitting ? '저장 중...' : '저장'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-accent"
        >
          취소
        </button>
      </div>
    </form>
  );
}
