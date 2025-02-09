import KBar from '@/components/kbar';
import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Next Shadcn Dashboard Starter',
  description: 'Basic dashboard with Next.js and Shadcn'
};

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Persisting the sidebar state in the cookie.
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true';
  return (
    <KBar>
      <SidebarProvider defaultOpen={defaultOpen}>
        <div className='flex h-screen w-full overflow-hidden'>
          <AppSidebar />
          <div className='flex-1 overflow-x-hidden'>
            <SidebarInset>
              <Header />
              <main className='w-full overflow-x-hidden'>{children}</main>
            </SidebarInset>
          </div>
        </div>
      </SidebarProvider>
    </KBar>
  );
}
