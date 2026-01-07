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
      getUser: () => {
        return useAuthStore.getState().user
      }
    }),
    {
      name: "ss-auth",
    }
  )
)

export const useAuth = () => {
  const { isAuthenticated, token, setAuth, clearAuth, getUser } = useAuthStore()
  return { isAuthenticated, token, setAuth, clearAuth, getUser }
}

export default useAuthStore;