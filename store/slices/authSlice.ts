import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  email: string;
  username: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setCredentials, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;

// Async actions for auth operations
export const loginUser = (email: string, password: string) => async (dispatch: any) => {
  try {
    // TODO: Replace with actual API call
    // const response = await axios.post('YOUR_API_URL/login', { email, password });
    
    // Mock response
    const mockResponse = {
      user: {
        id: '1',
        email,
        username: email.split('@')[0],
        name: 'Fitness User',
      },
      token: 'mock-jwt-token-' + Date.now(),
    };

    // Store token securely
    await AsyncStorage.setItem('authToken', mockResponse.token);
    await AsyncStorage.setItem('user', JSON.stringify(mockResponse.user));

    dispatch(setCredentials(mockResponse));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const registerUser = (
  email: string,
  password: string,
  name: string,
  username: string
) => async (dispatch: any) => {
  try {
    // TODO: Replace with actual API call
    // const response = await axios.post('YOUR_API_URL/register', { email, password, name, username });
    
    // Mock response
    const mockResponse = {
      user: {
        id: Date.now().toString(),
        email,
        username,
        name,
      },
      token: 'mock-jwt-token-' + Date.now(),
    };

    // Store token securely
    await AsyncStorage.setItem('authToken', mockResponse.token);
    await AsyncStorage.setItem('user', JSON.stringify(mockResponse.user));

    dispatch(setCredentials(mockResponse));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const logoutUser = () => async (dispatch: any) => {
  try {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('user');
    dispatch(logout());
  } catch (error) {
    console.error('Logout error:', error);
  }
};

export const checkAuthStatus = () => async (dispatch: any) => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    const userString = await AsyncStorage.getItem('user');

    if (token && userString) {
      const user = JSON.parse(userString);
      dispatch(setCredentials({ user, token }));
    } else {
      dispatch(setLoading(false));
    }
  } catch (error) {
    console.error('Auth check error:', error);
    dispatch(setLoading(false));
  }
};
