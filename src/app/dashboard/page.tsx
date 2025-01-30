import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/');
  }

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold'>Dashboard</h1>
      <p>Welcome {session.user.email}</p>
    </div>
  );
}
