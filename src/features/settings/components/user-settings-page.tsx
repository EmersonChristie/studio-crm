import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { CleanupButton } from '@/components/ui/cleanup-button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heading } from '@/components/ui/heading';
import {
  AlertCircle,
  BookUserIcon,
  Cog,
  Files,
  Info,
  Shield,
  User
} from 'lucide-react';

export default function UserSettingsPage() {
  return (
    <PageContainer>
      <div className='mb-8'>
        <Heading
          title='Settings'
          description='Manage your account settings and preferences'
        />
        <Separator className='my-6' />
      </div>

      <Tabs defaultValue='account' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='account'>
            <User className='mr-2 h-4 w-4' />
            Account
          </TabsTrigger>
          <TabsTrigger value='appearance'>
            <Cog className='mr-2 h-4 w-4' />
            Appearance
          </TabsTrigger>
          <TabsTrigger value='notifications'>
            <AlertCircle className='mr-2 h-4 w-4' />
            Notifications
          </TabsTrigger>
          <TabsTrigger value='files'>
            <Files className='mr-2 h-4 w-4' />
            Files
          </TabsTrigger>
        </TabsList>

        <TabsContent value='account' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your account details and profile information.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                {/* Profile form would go here */}
                <div className='col-span-2'>
                  <p className='mb-4 text-sm text-muted-foreground'>
                    Profile settings are managed in the profile section.
                  </p>
                  <Button variant='outline'>
                    <BookUserIcon className='mr-2 h-4 w-4' />
                    Go to Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='appearance' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how the application looks and feels.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-muted-foreground'>
                Appearance settings coming soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='notifications' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage how and when you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-muted-foreground'>
                Notification settings coming soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='files' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>File Management</CardTitle>
              <CardDescription>
                Manage your files and storage usage.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='rounded-md bg-blue-50 p-4'>
                <div className='flex'>
                  <div className='flex-shrink-0'>
                    <Info
                      className='h-5 w-5 text-blue-400'
                      aria-hidden='true'
                    />
                  </div>
                  <div className='ml-3'>
                    <h3 className='text-sm font-medium text-blue-800'>
                      Storage cleanup
                    </h3>
                    <div className='mt-2 text-sm text-blue-700'>
                      <p>
                        Sometimes files that you've uploaded but not saved to
                        any artwork can remain on the server. Use the cleanup
                        button below to remove any unused files from your
                        account.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='text-sm font-medium'>Unused Files</h3>
                  <p className='text-sm text-muted-foreground'>
                    Remove files that were uploaded but not linked to any
                    artwork.
                  </p>
                </div>
                <CleanupButton variant='default' />
              </div>

              <Separator />

              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='text-sm font-medium'>Delete Account</h3>
                  <p className='text-sm text-muted-foreground'>
                    Permanently delete your account and all associated data.
                  </p>
                </div>
                <Button variant='destructive'>Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
