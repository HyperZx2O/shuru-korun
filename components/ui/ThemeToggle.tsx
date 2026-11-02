'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('sk.v1.theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = stored ? stored === 'dark' : prefersDark
    setDark(isDark)
    document.documentElement.classList.toggle('dark', isDark)
  }, [])

  function toggle() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('sk.v1.theme', next ? 'dark' : 'light')
  }

  return (
    <button type="button" onClick={toggle} className="btn btn--small" aria-label="Toggle dark mode">
      {dark ? 'Light' : 'Dark'}
    </button>
  )
}
