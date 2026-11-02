'use client'

import { useEffect, useRef, useState } from 'react'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const lg = (window as unknown as { liquidGlass?: (el: HTMLElement, opts?: object) => { destroy: () => void } }).liquidGlass
    if (!lg) return
    const instance = lg(el, { scale: -60, chroma: 4, blur: 12, saturate: 1.2, radius: 16, fallbackBlur: 12 })
    return () => instance?.destroy?.()
  }, [visible])

  if (!visible) return null

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="glass-fab fixed bottom-4 left-4 z-50"
      aria-label="Back to top"
    >
      ↑
    </button>
  )
}
