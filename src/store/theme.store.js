import { create } from "zustand"
import { persist } from "zustand/middleware"
import { useEffect } from "react"

const useThemeStore = create(
  persist(
    (set) => ({
      theme: "system",
      setTheme: (theme) => {
        set({ theme })
        applyTheme(theme)
      },
    }),
    {
      name: "ss-theme",
      storage: localStorage,
    }
  )
)

const applyTheme = (theme) => {
  const root = window.document.documentElement

  root.classList.remove("light", "dark")

  if (theme === "system") {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
    root.classList.add(systemTheme)
    return
  }

  root.classList.add(theme)
}

export const useTheme = () => {
  const { theme, setTheme } = useThemeStore()

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  return { theme, setTheme }
}

export default useThemeStore
