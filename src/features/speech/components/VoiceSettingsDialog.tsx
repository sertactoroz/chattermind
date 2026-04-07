'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Volume2 } from 'lucide-react';
import type { VoiceOption } from '../types/speech.types';

interface VoiceSettingsDialogProps {
  voices: VoiceOption[];
  config: {
    voiceURI: string;
    pitch: number;
    rate: number;
    volume: number;
  };
  onConfigChange: (config: Partial<{
    voiceURI: string;
    pitch: number;
    rate: number;
    volume: number;
  }>) => void;
  onTestVoice: (text: string) => void;
  isSpeaking?: boolean;
  children: React.ReactNode;
}

export function VoiceSettingsDialog({
  voices,
  config,
  onConfigChange,
  onTestVoice,
  isSpeaking = false,
  children,
}: VoiceSettingsDialogProps) {
  const [pitch, setPitch] = useState(config.pitch);
  const [rate, setRate] = useState(config.rate);
  const [volume, setVolume] = useState(config.volume);

  const handlePitchChange = (value: number) => {
    setPitch(value);
    onConfigChange({ pitch: value });
  };

  const handleRateChange = (value: number) => {
    setRate(value);
    onConfigChange({ rate: value });
  };

  const handleVolumeChange = (value: number) => {
    setVolume(value);
    onConfigChange({ volume: value });
  };

  const handleVoiceChange = (voiceURI: string) => {
    onConfigChange({ voiceURI });
  };

  const handleTestVoice = () => {
    onTestVoice('Hello! This is a test of the voice settings.');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Voice Settings</DialogTitle>
          <DialogDescription>
            Customize the text-to-speech voice and settings for AI responses.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* Voice Selection */}
          <div className="space-y-2">
            <Label htmlFor="voice">Voice</Label>
            <Select value={config.voiceURI} onValueChange={handleVoiceChange}>
              <SelectTrigger id="voice">
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent>
                {voices.map((voice) => (
                  <SelectItem key={voice.voiceURI} value={voice.voiceURI}>
                    {voice.name} ({voice.lang})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Pitch Control */}
          <div className="space-y-2">
            <Label htmlFor="pitch">Pitch: {pitch.toFixed(1)}</Label>
            <input
              id="pitch"
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={pitch}
              onChange={(e) => handlePitchChange(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Rate Control */}
          <div className="space-y-2">
            <Label htmlFor="rate">Speed: {rate.toFixed(1)}x</Label>
            <input
              id="rate"
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={rate}
              onChange={(e) => handleRateChange(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Volume Control */}
          <div className="space-y-2">
            <Label htmlFor="volume">Volume: {Math.round(volume * 100)}%</Label>
            <input
              id="volume"
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Test Button */}
          <Button
            onClick={handleTestVoice}
            disabled={isSpeaking}
            className="w-full"
            variant="outline"
          >
            <Volume2 className="w-4 h-4 mr-2" />
            {isSpeaking ? 'Speaking...' : 'Test Voice'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
