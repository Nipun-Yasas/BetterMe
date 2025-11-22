import { API_CONFIG } from '@/config/api';

export interface Exercise {
  name: string;
  type: string;
  muscle: string;
  equipment: string;
  difficulty: string;
  instructions: string;
}

export interface FetchExercisesParams {
  name?: string;
  muscle?: string;
  difficulty?: string;
}

export const exerciseService = {
  async fetchExercises(params?: FetchExercisesParams): Promise<Exercise[]> {
    const queryParams = new URLSearchParams();
    
    if (params?.name) queryParams.append('name', params.name);
    if (params?.muscle) queryParams.append('muscle', params.muscle);
    if (params?.difficulty) queryParams.append('difficulty', params.difficulty);

    const url = `${API_CONFIG.BASE_URL}/exercises${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Api-Key': API_CONFIG.API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },
};
