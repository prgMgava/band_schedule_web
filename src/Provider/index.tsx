import { ReactNode } from "react"
import { AuthProvider } from "./Auth/Auth"
import React from "react"
import { MobileProvider } from "./Theme/Mobile"
import { BandProvider } from "./Band/Band"
import { AppointmentProvider } from "./Appointment/Appointment"

interface AppProviderProps {
  children: ReactNode
}

export const AppProvider = ({ children }: AppProviderProps) => (
  <AuthProvider>
    <BandProvider>
      <AppointmentProvider>
        <MobileProvider>{children}</MobileProvider>
      </AppointmentProvider>
    </BandProvider>
  </AuthProvider>
)
