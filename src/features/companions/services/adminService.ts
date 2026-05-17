import { api } from '@/lib/api';

export type AdminCompanion = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  description: string;
  language: string;
  promptKey: string;
  systemPrompt: string;
};

export const adminService = {
  listCompanions: () =>
    api.get<AdminCompanion[]>('/api/admin/companions'),

  createCompanion: (data: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
    description?: string;
    language?: string;
    systemPrompt: string;
  }) => api.post<AdminCompanion>('/api/admin/companions', data),

  updateCompanion: (id: string, data: {
    name?: string;
    role?: string;
    avatar?: string;
    description?: string;
    language?: string;
    systemPrompt?: string;
  }) => api.put<AdminCompanion>(`/api/admin/companions/${id}`, data),

  deleteCompanion: (id: string) =>
    api.delete<string>(`/api/admin/companions/${id}`),

  getPrompt: (id: string) =>
    api.get<{ promptKey: string; systemPrompt: string }>(`/api/admin/companions/${id}/prompt`),
};
