import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const getInitialState = (): AuthState => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('smarthire_user');
    if (stored) {
      try {
        const user = JSON.parse(stored) as User;
        return { user, isAuthenticated: true };
      } catch {
        return { user: null, isAuthenticated: false };
      }
    }
  }
  return { user: null, isAuthenticated: false };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      if (typeof window !== 'undefined') {
        localStorage.setItem('smarthire_user', JSON.stringify(action.payload));
      }
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('smarthire_user');
      }
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
