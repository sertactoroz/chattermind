'use client';

import React, { useState } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * SpeechDemo Component - Simplified example
 */
export default function SpeechDemo() {
  const speechRecognition = useSpeechRecognition({
    language: 'en-US',
    continuous: false,
    interimResults: true,
  });

  const speechSynthesis = useSpeechSynthesis({
    pitch: 1,
    rate: 1,
    volume: 1,
  });

  const [text, setText] = useState('');
  const [_showSettings, _setShowSettings] = useState(false);

  React.useEffect(() => {
    if (speechRecognition.transcript && !speechRecognition.isListening) {
      setText(prev => {
        const newText = prev + ' ' + speechRecognition.transcript;
        return newText.trim();
      });
      speechRecognition.resetTranscript();
    }
  }, [speechRecognition.transcript, speechRecognition.isListening, speechRecognition.resetTranscript]);

  const handleMicClick = () => {
    if (speechRecognition.isListening) {
      speechRecognition.stopListening();
    } else {
      speechRecognition.startListening();
    }
  };

  const handleSpeak = () => {
    if (text.trim()) {
      speechSynthesis.speak(text);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Speech Demo</h1>
        <p className="text-muted-foreground">Try speech recognition and synthesis</p>
      </div>

      <div className="space-y-3">
        <label htmlFor="speech-demo-text" className="text-sm font-medium">Text</label>
        <textarea
          id="speech-demo-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={speechRecognition.isListening ? 'Listening...' : 'Type or speak...'}
          className="w-full min-h-[120px] p-3 border rounded-lg resize-none"
        />
        {speechRecognition.interimTranscript && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>Transcribing: "{speechRecognition.interimTranscript}"</span>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <Button
          onClick={handleMicClick}
          disabled={!speechRecognition.isSupported}
          variant={speechRecognition.isListening ? 'destructive' : 'default'}
        >
          {speechRecognition.isListening ? <><MicOff className="w-4 h-4 mr-2" /> Stop</> : <><Mic className="w-4 h-4 mr-2" /> Record</>}
        </Button>

        <Button
          onClick={handleSpeak}
          disabled={!speechSynthesis.isSupported || !text.trim() || speechSynthesis.isSpeaking}
          variant="outline"
        >
          {speechSynthesis.isSpeaking ? <><Volume2 className="w-4 h-4 mr-2" /> Speaking...</> : <><Volume2 className="w-4 h-4 mr-2" /> Speak</>}
        </Button>
      </div>
    </div>
  );
}
