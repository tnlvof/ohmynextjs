import { requireAdmin } from '@/lib/admin/auth';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { ToastProvider } from '@/components/admin/toast';

export const metadata = {
  title: '관리자 - OhMyNextJS',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <ToastProvider>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto max-w-screen-xl px-4 py-6 md:px-8">
            {children}
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}
