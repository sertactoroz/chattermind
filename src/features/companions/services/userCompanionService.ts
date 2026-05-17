import { api } from '@/lib/api';
import type { Companion } from '@/features/companions/types/companion.types';

export type UserCompanionForm = {
  name: string;
  role: string;
  avatar?: string;
  description?: string;
  language?: string;
  systemPrompt: string;
};

export const userCompanionService = {
  list: () =>
    api.get<Companion[]>('/api/user/companions'),

  create: (data: UserCompanionForm) =>
    api.post<Companion>('/api/user/companions', data),

  update: (id: string, data: Partial<UserCompanionForm>) =>
    api.put<Companion>(`/api/user/companions/${id}`, data),

  delete: (id: string) =>
    api.delete<string>(`/api/user/companions/${id}`),
};
