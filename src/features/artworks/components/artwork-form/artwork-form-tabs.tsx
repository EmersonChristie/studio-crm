'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { GeneralTab } from './tabs/general-tab';
import { UseFormReturn } from 'react-hook-form';
import { ArtworkFormValues } from '../../schemas/artwork-schema';

interface ArtworkFormTabsProps {
  form: UseFormReturn<ArtworkFormValues>;
}

export function ArtworkFormTabs({ form }: ArtworkFormTabsProps) {
  return (
    <Tabs defaultValue='general' className='w-full'>
      <TabsList className='grid w-full grid-cols-4'>
        <TabsTrigger value='general'>General</TabsTrigger>
        <TabsTrigger value='financial'>Financial</TabsTrigger>
        <TabsTrigger value='provenance'>Provenance</TabsTrigger>
        <TabsTrigger value='images'>Images</TabsTrigger>
      </TabsList>

      <TabsContent value='general'>
        <GeneralTab form={form} />
      </TabsContent>

      {/* We'll implement these tabs next */}
      <TabsContent value='financial'>
        {/* <FinancialTab form={form} /> */}
      </TabsContent>
      <TabsContent value='provenance'>
        {/* <ProvenanceTab form={form} /> */}
      </TabsContent>
      <TabsContent value='images'>
        {/* <ImagesTab form={form} /> */}
      </TabsContent>
    </Tabs>
  );
}
