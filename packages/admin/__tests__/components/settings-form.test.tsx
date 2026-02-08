import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SettingsForm } from '../../src/components/settings/settings-form';

describe('SettingsForm', () => {
  it('should render form fields', () => {
    render(<SettingsForm onSubmit={() => {}} onCancel={() => {}} />);
    expect(screen.getByLabelText('키')).toBeInTheDocument();
    expect(screen.getByLabelText('값')).toBeInTheDocument();
    expect(screen.getByLabelText('설명')).toBeInTheDocument();
  });

  it('should call onSubmit with form data', () => {
    const onSubmit = vi.fn();
    render(<SettingsForm onSubmit={onSubmit} onCancel={() => {}} />);
    fireEvent.change(screen.getByLabelText('키'), { target: { value: 'test_key' } });
    fireEvent.change(screen.getByLabelText('값'), { target: { value: 'test_value' } });
    fireEvent.change(screen.getByLabelText('설명'), { target: { value: 'desc' } });
    fireEvent.click(screen.getByText('저장'));
    expect(onSubmit).toHaveBeenCalledWith({
      key: 'test_key',
      value: 'test_value',
      description: 'desc',
      isPublic: false,
    });
  });

  it('should populate fields when editing', () => {
    const setting = { key: 'site_name', value: 'My Site', description: '사이트 이름', isPublic: true };
    render(<SettingsForm initialData={setting} onSubmit={() => {}} onCancel={() => {}} />);
    expect(screen.getByDisplayValue('site_name')).toBeInTheDocument();
    expect(screen.getByDisplayValue('My Site')).toBeInTheDocument();
  });
});
