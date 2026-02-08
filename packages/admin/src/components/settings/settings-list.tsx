import React from 'react';

interface Setting {
  id: string;
  key: string;
  value: unknown;
  description: string | null;
  isPublic: boolean;
}

interface SettingsListProps {
  settings: Setting[];
  onEdit: (setting: Setting) => void;
  onDelete: (key: string) => void;
}

export function SettingsList({ settings, onEdit, onDelete }: SettingsListProps) {
  if (settings.length === 0) {
    return <div>설정이 없습니다</div>;
  }

  return (
    <div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>키</th>
            <th>값</th>
            <th>설명</th>
            <th>공개</th>
            <th>액션</th>
          </tr>
        </thead>
        <tbody>
          {settings.map((setting) => (
            <tr key={setting.id}>
              <td>{setting.key}</td>
              <td>{JSON.stringify(setting.value)}</td>
              <td>{setting.description || '-'}</td>
              <td>{setting.isPublic ? '예' : '아니오'}</td>
              <td>
                <button onClick={() => onEdit(setting)}>수정</button>
                <button onClick={() => onDelete(setting.key)} style={{ color: 'red' }}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
