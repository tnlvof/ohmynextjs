import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SettingsList } from '../../src/components/settings/settings-list';

describe('SettingsList', () => {
  const mockSettings = [
    { id: '1', key: 'site_name', value: 'My Site', description: '사이트 이름', isPublic: true },
    { id: '2', key: 'maintenance_mode', value: false, description: '점검 모드', isPublic: false },
  ];

  it('should render settings list', () => {
    render(<SettingsList settings={mockSettings} onEdit={() => {}} onDelete={() => {}} />);
    expect(screen.getByText('site_name')).toBeInTheDocument();
    expect(screen.getByText('maintenance_mode')).toBeInTheDocument();
  });

  it('should show empty state', () => {
    render(<SettingsList settings={[]} onEdit={() => {}} onDelete={() => {}} />);
    expect(screen.getByText('설정이 없습니다')).toBeInTheDocument();
  });
});
