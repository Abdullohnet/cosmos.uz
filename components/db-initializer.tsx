'use client'

import { useEffect, useRef } from 'react'

export function DbInitializer() {
  const ran = useRef(false)
  useEffect(() => {
    if (ran.current) return
    ran.current = true
    fetch('/api/db-init', { method: 'GET' }).catch(() => {})
  }, [])
  return null
}
