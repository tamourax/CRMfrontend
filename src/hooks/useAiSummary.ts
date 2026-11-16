import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { AiResult } from '../types';

export function useAiSummary(endpoint: string) {
  return useMutation({
    mutationFn: async () => (await api.post<{ data: AiResult }>(endpoint)).data.data,
  });
}
