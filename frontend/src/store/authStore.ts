import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin?: boolean;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true,

  setUser: (user: User | null) => {
    set({
      user,
      isAuthenticated: !!user,
    });
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
    });
  },

  setLoading: (loading: boolean) => {
    set({ loading });
  },
}));

export default useAuthStore;
