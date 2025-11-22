import Constants from 'expo-constants';

export const API_CONFIG = {
  BASE_URL: 'https://api.api-ninjas.com/v1',
  API_KEY: Constants.expoConfig?.extra?.apiNinjasKey || '',
};
