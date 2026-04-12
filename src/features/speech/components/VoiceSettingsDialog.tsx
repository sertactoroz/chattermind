'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Play, Square, ChevronDown, ChevronUp } from 'lucide-react';
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
  onPlayPreview: (voiceURI: string) => void;
  isSpeaking: boolean;
  children: React.ReactNode;
  lang?: string;
}

export function VoiceSettingsDialog({
  voices,
  config,
  onConfigChange,
  onPlayPreview,
  isSpeaking,
  children,
  lang,
}: VoiceSettingsDialogProps) {
  const [selectedLang, setSelectedLang] = useState<string>(lang?.split('-')[0] || 'tr');
  const [showSettings, setShowSettings] = useState(false);

  const voiceCharacters = useMemo(() => {
    const langVoices = voices.filter(v => v.lang.startsWith(selectedLang));
    
    const filtered = langVoices.filter(v => {
      const n = v.name.toLowerCase();
      if (/novelty/i.test(n) && !/google/i.test(n)) return false;
      return true;
    });

    filtered.sort((a, b) => {
      const aGoogle = a.name.toLowerCase().includes('google');
      const bGoogle = b.name.toLowerCase().includes('google');
      if (aGoogle && !bGoogle) return -1;
      if (bGoogle && !aGoogle) return 1;
      return a.name.localeCompare(b.name);
    });

    const charNames = {
      tr: ['Can', 'Zeynep', 'Emre', 'Elif'],
      de: ['Alexander', 'Sophie', 'Lukas', 'Lena'],
      en: ['Alex', 'Emma', 'Oliver', 'Charlotte']
    };

    const names = charNames[selectedLang as keyof typeof charNames] || charNames.en;

    return filtered.slice(0, Math.min(4, filtered.length)).map((voice, index) => ({
      ...voice,
      displayName: names[index % names.length]
    }));
  }, [voices, selectedLang]);

  const handleSelectAndPreview = useCallback((uri: string) => {
    onConfigChange({ voiceURI: uri });
    onPlayPreview(uri);
  }, [onConfigChange, onPlayPreview]);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">Voice Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="flex items-center gap-2">
            {(['tr', 'de', 'en'] as const).map(l => (
              <button
                key={l}
                type="button"
                onClick={() => setSelectedLang(l)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
                  selectedLang === l
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted/60 text-muted-foreground hover:bg-muted'
                }`}
              >
                {l === 'tr' ? 'Türkçe' : l === 'de' ? 'Deutsch' : 'English'}
              </button>
            ))}
          </div>

          <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1">
            {voiceCharacters.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6">No voices found</p>
            )}
            {voiceCharacters.map((voice) => {
              const isSelected = config.voiceURI === voice.voiceURI;
              const isThisVoiceSpeaking = isSpeaking;

              return (
                <button
                  key={voice.voiceURI}
                  type="button"
                  onClick={() => handleSelectAndPreview(voice.voiceURI)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left group ${
                    isSelected
                      ? 'bg-primary/10 border border-primary/30'
                      : 'hover:bg-muted/50 border border-transparent'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                    isThisVoiceSpeaking
                      ? 'bg-primary text-primary-foreground animate-pulse'
                      : isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary'
                  }`}>
                    {isThisVoiceSpeaking ? (
                      <Square className="w-3 h-3" />
                    ) : (
                      <Play className="w-3 h-3 ml-0.5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate ${isSelected ? 'font-medium text-primary' : 'text-foreground'}`}>
                      {voice.displayName}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center justify-between w-full py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>Advanced Settings</span>
            {showSettings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showSettings && (
            <div className="space-y-5 pl-1">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Pitch</span>
                  <span className="text-xs text-muted-foreground tabular-nums">{config.pitch.toFixed(1)}</span>
                </div>
                <Slider
                  value={[config.pitch]}
                  onValueChange={([v]: number[]) => onConfigChange({ pitch: v })}
                  min={0.5}
                  max={2}
                  step={0.1}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Speed</span>
                  <span className="text-xs text-muted-foreground tabular-nums">{config.rate.toFixed(1)}x</span>
                </div>
                <Slider
                  value={[config.rate]}
                  onValueChange={([v]: number[]) => onConfigChange({ rate: v })}
                  min={0.5}
                  max={2}
                  step={0.1}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Volume</span>
                  <span className="text-xs text-muted-foreground tabular-nums">{Math.round(config.volume * 100)}%</span>
                </div>
                <Slider
                  value={[config.volume]}
                  onValueChange={([v]: number[]) => onConfigChange({ volume: v })}
                  min={0}
                  max={1}
                  step={0.05}
                />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
