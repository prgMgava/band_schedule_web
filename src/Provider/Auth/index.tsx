import { ReactNode } from "react"
import { AuthProvider } from "./Auth"
import React from "react"
import { MobileProvider } from "./Mobile"

interface AppProviderProps {
  children: ReactNode
}

export const AppProvider = ({ children }: AppProviderProps) => (
  <AuthProvider>
    <MobileProvider>{children}</MobileProvider>
  </AuthProvider>
)
