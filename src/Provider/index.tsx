import { ReactNode } from "react"
import { AuthProvider } from "./Auth/Auth"
import React from "react"
import { MobileProvider } from "./Theme/Mobile"
import { BandProvider } from "./Band/Band"

interface AppProviderProps {
  children: ReactNode
}

export const AppProvider = ({ children }: AppProviderProps) => (
  <AuthProvider>
    <BandProvider>
      <MobileProvider>{children}</MobileProvider>
    </BandProvider>
  </AuthProvider>
)
