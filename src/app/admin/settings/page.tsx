import { getSettings } from '@/lib/admin/queries';
import { SettingsList } from '@/components/admin/settings-list';

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">앱 설정</h1>
      <SettingsList settings={settings} />
    </div>
  );
}
