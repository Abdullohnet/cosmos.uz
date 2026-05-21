'use client'

import { useEffect, useRef } from 'react'
import { useUserStore } from '@/lib/store'
import { apiGetMe } from '@/lib/api'

export function AuthInitializer() {
  const { login, isAuthenticated } = useUserStore()
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true
    // Only try to restore session if not already authenticated from persisted store
    apiGetMe().then((user) => {
      if (user) {
        login(user)
      }
    }).catch(() => {})
  }, [login])

  return null
}
