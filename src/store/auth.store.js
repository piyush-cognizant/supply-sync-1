import { create } from "zustand"
import { persist } from "zustand/middleware"

const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      token: null,
      user: null,
      setAuth: (isAuthenticated, token, user) => {
        set({ isAuthenticated, token, user })
      },
      clearAuth: () => {
        set({ isAuthenticated: false, token: null, user: null })
      },
    }),
    {
      name: "ss-auth",
      storage: localStorage,
    }
  )
)

export const useAuth = () => {
  const { isAuthenticated, token, setAuth, clearAuth } = useAuthStore()
  return { isAuthenticated, token, setAuth, clearAuth }
}

export default useAuthStore;