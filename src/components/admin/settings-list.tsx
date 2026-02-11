'use client';

import { useState, useTransition } from 'react';
import { createSetting, updateSetting, deleteSetting } from '@/lib/admin/actions';
import { ConfirmDialog } from './confirm-dialog';
import { useToast } from './toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface Setting {
  id: string;
  key: string;
  value: unknown;
  description: string | null;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface SettingsListProps {
  settings: Setting[];
}

export function SettingsList({ settings }: SettingsListProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string; key: string }>({
    open: false, id: '', key: '',
  });

  // Form state
  const [formKey, setFormKey] = useState('');
  const [formValue, setFormValue] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formPublic, setFormPublic] = useState(false);

  const resetForm = () => {
    setFormKey('');
    setFormValue('');
    setFormDesc('');
    setFormPublic(false);
    setShowForm(false);
    setEditId(null);
  };

  const startEdit = (setting: Setting) => {
    setEditId(setting.id);
    setFormKey(setting.key);
    setFormValue(JSON.stringify(setting.value, null, 2));
    setFormDesc(setting.description ?? '');
    setFormPublic(setting.isPublic);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let parsedValue: unknown;
    try {
      parsedValue = JSON.parse(formValue);
    } catch {
      toast('유효한 JSON 값을 입력해주세요.', 'error');
      return;
    }

    startTransition(async () => {
      const result = editId
        ? await updateSetting(editId, { value: parsedValue, description: formDesc, isPublic: formPublic })
        : await createSetting({ key: formKey, value: parsedValue, description: formDesc, isPublic: formPublic });

      if (result.success) {
        toast(editId ? '설정이 수정되었습니다.' : '설정이 추가되었습니다.');
        resetForm();
      } else {
        toast(result.error, 'error');
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteSetting(id);
      if (result.success) {
        toast('설정이 삭제되었습니다.');
      } else {
        toast(result.error, 'error');
      }
      setDeleteDialog({ open: false, id: '', key: '' });
    });
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">앱 설정</h2>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          추가
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 rounded-lg border border-border p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Key</label>
            <input
              type="text"
              value={formKey}
              onChange={(e) => setFormKey(e.target.value)}
              disabled={!!editId}
              required
              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Value (JSON)</label>
            <textarea
              value={formValue}
              onChange={(e) => setFormValue(e.target.value)}
              required
              rows={3}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">설명</label>
            <input
              type="text"
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPublic"
              checked={formPublic}
              onChange={(e) => setFormPublic(e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="isPublic" className="text-sm">공개 설정</label>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {editId ? '수정' : '추가'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-md border border-border px-4 py-2 text-sm hover:bg-accent"
            >
              취소
            </button>
          </div>
        </form>
      )}

      {/* Settings list */}
      <div className="space-y-2">
        {settings.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">설정이 없습니다.</p>
        )}
        {settings.map((setting) => (
          <div key={setting.id} className="rounded-lg border border-border p-4">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-medium">{setting.key}</span>
                  {setting.isPublic && (
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      공개
                    </span>
                  )}
                </div>
                {setting.description && (
                  <p className="mt-1 text-sm text-muted-foreground">{setting.description}</p>
                )}
                <pre className="mt-2 rounded bg-muted p-2 text-xs overflow-x-auto">
                  {JSON.stringify(setting.value, null, 2)}
                </pre>
              </div>
              <div className="ml-4 flex gap-1">
                <button
                  onClick={() => startEdit(setting)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent"
                  aria-label={`${setting.key} 수정`}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setDeleteDialog({ open: true, id: setting.id, key: setting.key })}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent text-destructive"
                  aria-label={`${setting.key} 삭제`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={deleteDialog.open}
        title="설정 삭제"
        description={`'${deleteDialog.key}' 설정을 삭제하시겠습니까?`}
        confirmLabel="삭제"
        variant="destructive"
        onConfirm={() => handleDelete(deleteDialog.id)}
        onCancel={() => setDeleteDialog({ open: false, id: '', key: '' })}
      />
    </div>
  );
}
