import { ReactLenis, useLenis } from 'lenis/react'
import { useEffect } from 'react'
import 'lenis/dist/lenis.css'

function ScrollToTop({ view }) {
  const lenis = useLenis()

  useEffect(() => {
    lenis?.scrollTo(0, { duration: 0.85 })
  }, [view, lenis])

  return null
}

export default function SmoothScroll({ view, children }) {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.15,
        smoothWheel: true,
        wheelMultiplier: 0.88,
        touchMultiplier: 1.05,
        autoRaf: true,
      }}
    >
      <ScrollToTop view={view} />
      {children}
    </ReactLenis>
  )
}
