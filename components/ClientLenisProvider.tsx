'use client'

import { ReactNode } from 'react'
import LenisProvider from './LenisProvider'

interface ClientLenisProviderProps {
  children: ReactNode
}

export default function ClientLenisProvider({ children }: ClientLenisProviderProps) {
  // Direct import - both are client components
  // Dynamic import is handled in layout.tsx to fix module concatenation issues
  return <LenisProvider>{children}</LenisProvider>
}