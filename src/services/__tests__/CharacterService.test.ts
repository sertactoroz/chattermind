import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.stubEnv('GROQ_API_KEY', 'test-key');
vi.stubEnv('NEXT_PUBLIC_GROQ_BASE', 'https://api.groq.com');
vi.stubEnv('HERR_BECHLER_PROMPT', 'You are a German teacher named Herr Bechler.');
vi.stubEnv('BAY_ERDOGAN_PROMPT', 'You are a Turkish teacher named Bay Erdogan.');

import { CharacterService } from '@/services/ai/CharacterService';

describe('CharacterService', () => {
  let service: CharacterService;

  beforeEach(() => {
    service = new CharacterService();
  });

  describe('getCompanionById', () => {
    it('finds existing companion', () => {
      const comp = service.getCompanionById('herr_bechler');
      expect(comp).toBeDefined();
      expect(comp?.id).toBe('herr_bechler');
    });

    it('returns undefined for non-existent companion', () => {
      expect(service.getCompanionById('nonexistent')).toBeUndefined();
    });
  });

  describe('getCompanionPrompt', () => {
    it('returns env prompt for known companion', () => {
      const prompt = service.getCompanionPrompt('herr_bechler');
      expect(prompt).toBe('You are a German teacher named Herr Bechler.');
    });

    it('returns default prompt for unknown companion', () => {
      const prompt = service.getCompanionPrompt('nonexistent');
      expect(prompt).toContain('helpful AI assistant');
    });
  });

  describe('buildSystemPrompt', () => {
    it('includes brevity instruction', () => {
      const prompt = service.buildSystemPrompt('herr_bechler');
      expect(prompt).toContain('maximum two short sentences');
    });

    it('includes initial message instruction when flag is true', () => {
      const prompt = service.buildSystemPrompt('herr_bechler', true);
      expect(prompt).toContain('initiate the conversation');
    });

    it('does not include initial message instruction by default', () => {
      const prompt = service.buildSystemPrompt('herr_bechler', false);
      expect(prompt).not.toContain('initiate the conversation');
    });

    it('appends language rule for companions with language', () => {
      const prompt = service.buildSystemPrompt('herr_bechler');
      expect(prompt).toContain('German');
      expect(prompt).toContain('FINAL LANGUAGE RULE');
    });

    it('works without companionId', () => {
      const prompt = service.buildSystemPrompt(null);
      expect(prompt).toContain('helpful AI assistant');
    });
  });

  describe('isInitialPrompt', () => {
    it('returns true for initial prompt signal', () => {
      expect(
        service.isInitialPrompt(
          "Generate companion's opening message to start the conversation."
        )
      ).toBe(true);
    });

    it('returns false for normal message', () => {
      expect(service.isInitialPrompt('Hello, how are you?')).toBe(false);
    });
  });

  describe('getAllCompanions', () => {
    it('returns all companions', () => {
      const comps = service.getAllCompanions();
      expect(comps.length).toBeGreaterThan(0);
    });
  });
});
