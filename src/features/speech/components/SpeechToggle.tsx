'use client';

import React from 'react';
import { Volume2, VolumeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SpeechToggleProps {
  isPlaying: boolean;
  isSupported: boolean;
  onToggle: () => void;
  onCancel?: () => void;
}

export function SpeechToggle({
  isPlaying,
  isSupported,
  onToggle,
  onCancel,
}: SpeechToggleProps) {
  if (!isSupported) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={isPlaying ? onCancel || onToggle : onToggle}
            className={`h-8 w-8 ${isPlaying ? 'text-primary' : 'text-muted-foreground'}`}
          >
            {isPlaying ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeOff className="w-4 h-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isPlaying ? 'Stop speaking' : 'Enable speech'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
