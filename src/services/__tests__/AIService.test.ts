import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockFetch = vi.fn();
global.fetch = mockFetch;

vi.stubEnv('GROQ_API_KEY', 'test-key');
vi.stubEnv('NEXT_PUBLIC_GROQ_BASE', 'https://api.groq.com/openai/v1');

import { AIService } from '@/services/ai/AIService';

describe('AIService', () => {
  let service: AIService;

  beforeEach(() => {
    vi.resetModules();
    mockFetch.mockReset();
    service = new AIService();
  });

  describe('chat', () => {
    it('sends messages and returns content', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [{ message: { content: 'Hello from AI!' } }],
        }),
      });

      const result = await service.chat([
        { role: 'system', content: 'You are helpful.' },
        { role: 'user', content: 'Hi' },
      ]);

      expect(result.content).toBe('Hello from AI!');
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.groq.com/openai/v1/chat/completions',
        expect.objectContaining({ method: 'POST' })
      );
    });

    it('throws ExternalServiceError on API failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        text: async () => 'Rate limited',
      });

      await expect(
        service.chat([{ role: 'user', content: 'Hi' }])
      ).rejects.toThrow('External service error');
    });

    it('throws ExternalServiceError on empty response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ choices: [{}] }),
      });

      await expect(
        service.chat([{ role: 'user', content: 'Hi' }])
      ).rejects.toThrow('External service error');
    });
  });

  describe('generateResponse', () => {
    it('builds messages with system prompt and history', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [{ message: { content: 'Sure!' } }],
        }),
      });

      const result = await service.generateResponse(
        'You are a teacher.',
        [{ role: 'user', content: 'Hello' }],
        'How are you?'
      );

      expect(result).toBe('Sure!');

      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(callBody.messages).toHaveLength(3);
      expect(callBody.messages[0].role).toBe('system');
      expect(callBody.messages[2].content).toBe('How are you?');
    });
  });

  describe('config setters', () => {
    it('setTemperature changes temperature', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [{ message: { content: 'ok' } }],
        }),
      });

      service.setTemperature(0.5);
      await service.chat([{ role: 'user', content: 'Hi' }]);

      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(callBody.temperature).toBe(0.5);
    });
  });
});
