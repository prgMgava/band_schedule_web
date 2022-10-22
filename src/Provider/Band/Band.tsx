import React, { useContext, createContext, useState, ReactNode, useCallback, Dispatch } from "react"

import { AxiosResponse } from "axios"
import { api } from "../../Services/api"
import { IBand } from "../../Types/band.type"
import { IResponse, useAuth } from "../Auth/Auth"

interface BandContextProps {
  myBands: IBand[]
  getMyBands: (owner: GetMyBandsProps) => Promise<IResponse>
}
const BandContext = createContext<BandContextProps>({} as BandContextProps)

const useBand = () => {
  const context = useContext(BandContext)
  if (!context) {
    throw new Error("useBand must be used within an BandProvider")
  }
  return context
}

interface GetMyBandsProps {
  owner: number
}

interface BandProviderProps {
  children: ReactNode
}

const BandProvider = ({ children }: BandProviderProps) => {
  const { id, accessToken, adm, superAdmin } = useAuth()
  const [myBands, setMyBands] = useState<IBand[]>([])

  const getMyBands = useCallback(async () => {
    try {
      if (adm) {
        console.log(adm, superAdmin)
        const url = superAdmin ? "/band" : `/band/owner/${5}`
        const { data }: AxiosResponse<IBand[]> = await api.get(url, {
          headers: { "x-access-token": accessToken },
        })

        setMyBands(data)
      }
      return {
        success: true,
        message: "OK",
      }
    } catch (e) {
      console.log(e)
      return {
        success: false,
        message: e.response.data.error,
      }
    }
  }, [])
  return <BandContext.Provider value={{ myBands, getMyBands }}>{children}</BandContext.Provider>
}

export { useBand, BandProvider }
