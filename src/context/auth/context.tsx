import type { User } from '@/api/types'

import { createContext } from 'react'

export interface AuthContextType {
  hasToken: boolean | null
  setHasToken: (_value: boolean) => void
  isFirstLaunch: boolean
  user?: User
  isLoading: boolean
  isInitialized: boolean
  isAuthenticated: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
