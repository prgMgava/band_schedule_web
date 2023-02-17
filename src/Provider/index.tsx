import { AuthProvider } from "./Auth/Auth"
import React from "react"
import { MobileProvider } from "./Theme/Mobile"
import { BandProvider } from "./Band/Band"
import { AppointmentProvider } from "./Appointment/Appointment"
import { ReactNode } from "react"
import { LabelProvider } from "./Label/Label"
import { CheckoutProvider } from "./Checkout/Checkout"

interface AppProviderProps {
  children: ReactNode
}

export const AppProvider = ({ children }: AppProviderProps) => (
  <AuthProvider>
    <BandProvider>
      <AppointmentProvider>
        <LabelProvider>
          <CheckoutProvider>
            <MobileProvider>{children}</MobileProvider>
          </CheckoutProvider>
        </LabelProvider>
      </AppointmentProvider>
    </BandProvider>
  </AuthProvider>
)
