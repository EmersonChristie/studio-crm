'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { ArtworkFormValues } from '../../../schemas/artwork-schema';

interface GeneralTabProps {
  form: UseFormReturn<ArtworkFormValues>;
}

export function GeneralTab({ form }: GeneralTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Information</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          <div className='col-span-1 md:col-span-2'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='col-span-1 md:col-span-1'>
            <FormField
              control={form.control}
              name='year'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className='grid grid-cols-3 gap-4'>
          <FormField
            control={form.control}
            name='height'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Height (in)</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    step='0.1'
                    {...field}
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='width'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Width (in)</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    step='0.1'
                    {...field}
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='depth'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Depth (in)</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    step='0.1'
                    {...field}
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name='medium'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Medium</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
