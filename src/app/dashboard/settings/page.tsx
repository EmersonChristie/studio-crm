import { SearchParams } from 'nuqs/server';
import { Metadata } from 'next';
import UserSettingsPage from '@/features/settings/components/user-settings-page';

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export const metadata: Metadata = {
  title: 'Dashboard : Settings'
};

export default async function SettingsPage({ searchParams }: PageProps) {
  return <UserSettingsPage />;
}
