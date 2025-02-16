'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Settings2 } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface PreferencesProps {
  preferences: {
    tone: string;
    length: string;
    additionalContext?: string;
  };
  onPreferencesChange: (prefs: any) => void;
}

export function AIToolbarPreferences({
  preferences,
  onPreferencesChange
}: PreferencesProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='ghost' size='sm' className='gap-2'>
          <Settings2 className='h-4 w-4' />
          <span>Preferences</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Writing Preferences</DialogTitle>
        </DialogHeader>
        <div className='space-y-4 py-4'>
          <div className='space-y-2'>
            <Label>Tone</Label>
            <Select
              value={preferences.tone}
              onValueChange={(value) =>
                onPreferencesChange({ ...preferences, tone: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='academic'>Academic</SelectItem>
                <SelectItem value='poetic'>Poetic</SelectItem>
                <SelectItem value='conversational'>Conversational</SelectItem>
                <SelectItem value='formal'>Formal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-2'>
            <Label>Length</Label>
            <Select
              value={preferences.length}
              onValueChange={(value) =>
                onPreferencesChange({ ...preferences, length: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='brief'>Brief (50-100 words)</SelectItem>
                <SelectItem value='standard'>
                  Standard (150-200 words)
                </SelectItem>
                <SelectItem value='detailed'>
                  Detailed (300-400 words)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-2'>
            <Label>Additional Context (Optional)</Label>
            <Textarea
              value={preferences.additionalContext}
              onChange={(e) =>
                onPreferencesChange({
                  ...preferences,
                  additionalContext: e.target.value
                })
              }
              placeholder='Add any specific context or requirements...'
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
