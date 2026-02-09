'use client';

import { useState, useEffect } from 'react';
import { SettingsList, SettingsForm } from '@ohmynextjs/admin/src/components/settings';

interface Setting {
  id: string;
  key: string;
  value: unknown;
  description: string | null;
  isPublic: boolean;
}

const mockSettings: Setting[] = [
  { id: 's1', key: 'site_name', value: 'OhMyNextJS', description: '사이트 이름', isPublic: true },
  { id: 's2', key: 'maintenance_mode', value: false, description: '점검 모드 활성화', isPublic: false },
  { id: 's3', key: 'max_upload_size', value: 10485760, description: '최대 업로드 크기 (bytes)', isPublic: false },
  { id: 's4', key: 'default_plan', value: 'basic', description: '기본 가입 플랜', isPublic: true },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSetting, setEditingSetting] = useState<Setting | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // In production: fetch from /api/admin/settings
    setTimeout(() => {
      setSettings(mockSettings);
      setIsLoading(false);
    }, 300);
  }, []);

  const handleEdit = (setting: Setting) => {
    setEditingSetting(setting);
    setShowForm(true);
  };

  const handleDelete = (key: string) => {
    setSettings(prev => prev.filter(s => s.key !== key));
  };

  const handleSubmit = (data: { key: string; value: string; description: string; isPublic: boolean }) => {
    if (editingSetting) {
      setSettings(prev => prev.map(s => s.key === data.key ? { ...s, value: data.value, description: data.description, isPublic: data.isPublic } : s));
    } else {
      setSettings(prev => [...prev, { id: `s${Date.now()}`, key: data.key, value: data.value, description: data.description, isPublic: data.isPublic }]);
    }
    setShowForm(false);
    setEditingSetting(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSetting(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">설정 관리</h1>
          <p className="text-muted-foreground">시스템 설정을 관리합니다.</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            새 설정 추가
          </button>
        )}
      </div>

      {showForm && (
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">
            {editingSetting ? '설정 수정' : '새 설정'}
          </h2>
          <SettingsForm
            initialData={editingSetting ?? undefined}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      )}

      <div className="rounded-lg border bg-card p-6 shadow-sm">
        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">로딩 중...</div>
        ) : (
          <SettingsList
            settings={settings}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
