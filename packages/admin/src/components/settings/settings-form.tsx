import React, { useState } from 'react';

interface SettingData {
  key: string;
  value: string;
  description: string;
  isPublic: boolean;
}

interface SettingsFormProps {
  initialData?: { key: string; value: unknown; description: string | null; isPublic: boolean };
  onSubmit: (data: SettingData) => void;
  onCancel: () => void;
}

export function SettingsForm({ initialData, onSubmit, onCancel }: SettingsFormProps) {
  const [key, setKey] = useState(initialData?.key || '');
  const [value, setValue] = useState(initialData ? String(initialData.value) : '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [isPublic, setIsPublic] = useState(initialData?.isPublic || false);

  const handleSubmit = () => {
    onSubmit({ key, value, description, isPublic });
  };

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="setting-key">키</label>
        <input
          id="setting-key"
          aria-label="키"
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          disabled={!!initialData}
          style={{ display: 'block', width: '100%', marginTop: '4px' }}
        />
      </div>
      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="setting-value">값</label>
        <input
          id="setting-value"
          aria-label="값"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={{ display: 'block', width: '100%', marginTop: '4px' }}
        />
      </div>
      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="setting-description">설명</label>
        <input
          id="setting-description"
          aria-label="설명"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ display: 'block', width: '100%', marginTop: '4px' }}
        />
      </div>
      <div style={{ marginBottom: '16px' }}>
        <label>
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
          공개 설정
        </label>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={onCancel}>취소</button>
        <button onClick={handleSubmit}>저장</button>
      </div>
    </div>
  );
}
