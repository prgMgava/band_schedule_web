import React, { useContext, createContext, ReactNode } from "react"

import { useMediaQuery, useTheme } from "@mui/material"
interface MobileContextProps {
  mobile: boolean
}
const MobileContext = createContext<MobileContextProps>({} as MobileContextProps)

const useMobile = () => {
  const context = useContext(MobileContext)
  if (!context) {
    throw new Error("useMobile must be used within an MobileProvider")
  }
  return context
}

interface MobileProviderProps {
  children: ReactNode
}

const MobileProvider = ({ children }: MobileProviderProps) => {
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down("sm"))
  return <MobileContext.Provider value={{ mobile: mobile }}>{children}</MobileContext.Provider>
}

export { useMobile, MobileProvider }
