import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../services/api';

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  DISTRICT_OFFICER = 'DISTRICT_OFFICER',
  HOSPITAL_ADMIN = 'HOSPITAL_ADMIN',
  DOCTOR = 'DOCTOR',
  ANM = 'ANM',
  ASHA_WORKER = 'ASHA_WORKER',
  PATIENT = 'PATIENT'
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  district?: string;
  phone?: string;
  abhaId?: string;
  hospitalId?: string;
}

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('janani_access_token'),
  isAuthenticated: !!localStorage.getItem('janani_access_token'),
  isLoading: false,
  error: null
};

export const fetchCurrentUser = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/auth/me');
    return response.data.user;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.error || 'Session expired');
  }
});

export const loginUser = createAsyncThunk('auth/login', async (credentials: any, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/login', credentials);
    const { user, tokens } = response.data;
    localStorage.setItem('janani_access_token', tokens.accessToken);
    localStorage.setItem('janani_refresh_token', tokens.refreshToken);
    return { user, token: tokens.accessToken };
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || err.response?.data?.error || 'Authentication failed');
  }
});

export const registerUser = createAsyncThunk('auth/register', async (userData: any, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/register', userData);
    const { user, tokens } = response.data;
    localStorage.setItem('janani_access_token', tokens.accessToken);
    localStorage.setItem('janani_refresh_token', tokens.refreshToken);
    return { user, token: tokens.accessToken };
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.error || 'Registration failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('janani_access_token');
      localStorage.removeItem('janani_refresh_token');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearAuthError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  }
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
