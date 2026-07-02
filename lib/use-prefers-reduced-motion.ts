import { useEffect, useState } from "react"

// Reactively tracks the user's `prefers-reduced-motion` setting. Returns false
// in environments without matchMedia (SSR / older test runners), so motion is
// preserved by default and only suppressed when the user explicitly requests it.
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return
    }
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReduced(mql.matches)
    update()
    mql.addEventListener("change", update)
    return () => mql.removeEventListener("change", update)
  }, [])

  return reduced
}
