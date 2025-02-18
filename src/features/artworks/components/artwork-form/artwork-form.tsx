'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArtworkFormValues,
  artworkFormSchema
} from '../../schemas/artwork-schema';
import { GeneralTab } from './tabs/general-tab';
import { ImagesTab } from './tabs/images-tab';
import { PricingTab } from './tabs/pricing-tab';
import { DetailsTab } from './tabs/details-tab';
import { ProvenanceTab } from './tabs/provenance-tab';
import { MaterialsTab } from './tabs/materials-tab';

interface ArtworkFormProps {
  artwork?: Partial<ArtworkFormValues>;
  onSubmit: (data: ArtworkFormValues) => Promise<void>;
}

export function ArtworkForm({ artwork, onSubmit }: ArtworkFormProps) {
  const form = useForm<ArtworkFormValues>({
    resolver: zodResolver(artworkFormSchema),
    defaultValues: artwork || {
      status: 'available'
      // Add other default values here
    }
  });

  const handleSubmit = async (data: ArtworkFormValues) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <Tabs defaultValue='general' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='general'>General</TabsTrigger>
          <TabsTrigger value='images'>Images</TabsTrigger>
          <TabsTrigger value='pricing'>Pricing</TabsTrigger>
          <TabsTrigger value='details'>Details</TabsTrigger>
          <TabsTrigger value='provenance'>Provenance</TabsTrigger>
          <TabsTrigger value='materials'>Materials</TabsTrigger>
        </TabsList>

        <TabsContent value='general'>
          <GeneralTab form={form} />
        </TabsContent>

        <TabsContent value='images'>
          <ImagesTab form={form} />
        </TabsContent>

        <TabsContent value='pricing'>
          <PricingTab form={form} />
        </TabsContent>

        <TabsContent value='details'>
          <DetailsTab form={form} />
        </TabsContent>

        <TabsContent value='provenance'>
          <ProvenanceTab form={form} />
        </TabsContent>

        <TabsContent value='materials'>
          <MaterialsTab form={form} />
        </TabsContent>
      </Tabs>
    </form>
  );
}
