import React, { useContext, createContext, useState, ReactNode, useCallback, Dispatch } from "react"

import { AxiosResponse } from "axios"
import { api } from "../../Services/api"
import { IBand } from "../../Types/band.type"
import { IResponse, useAuth } from "../Auth/Auth"

interface BandContextProps {
  myBands: IBand[]
  bands: IBand[]
  getBands: () => Promise<IResponse>
  currentBand: string
  getMyBands: () => Promise<IResponse>
  createBand: ({ name, cellphone, email }: CreateBandProp) => Promise<IResponse>
  deleteBand: (id: number) => Promise<IResponse>
  updateBand: ({ name, cellphone, email, id }: CreateBandProp) => Promise<IResponse>
  setCurrentBand: Dispatch<React.SetStateAction<string>>
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

interface CreateBandProp {
  name: string
  email: string
  cellphone: string
  id?: number
}

interface BandProviderProps {
  children: ReactNode
}

const BandProvider = ({ children }: BandProviderProps) => {
  const { id, accessToken, adm, superAdmin } = useAuth()
  const [myBands, setMyBands] = useState<IBand[]>([])
  const [bands, setBands] = useState<IBand[]>([])
  const [currentBand, setCurrentBand] = useState("")

  const getBands = useCallback(async () => {
    try {
      const { data }: AxiosResponse<IBand[]> = await api.get("/band", {
        headers: { "x-access-token": accessToken },
      })

      setBands(data)
      return {
        success: true,
        message: "OK",
      }
    } catch (e) {
      return {
        success: false,
        message: e.response.data.error,
      }
    }
  }, [])

  const getMyBands = useCallback(async () => {
    try {
      if (adm) {
        const url = superAdmin ? "/band" : `/band/owner/${id}`
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
      return {
        success: false,
        message: e.response.data.error,
      }
    }
  }, [])

  const createBand = useCallback(async ({ name, cellphone, email }: CreateBandProp) => {
    try {
      if (adm) {
        const response: AxiosResponse = await api.post(
          "/band",
          { name, cellphone, email },
          {
            headers: { "x-access-token": accessToken },
          }
        )
        setMyBands(old => [...old, response.data])
        return {
          success: true,
          message: "Banda cadastrada com sucesso",
        }
      }
      return {
        success: false,
        message: "Você não tem permissão de criar uma banda",
      }
    } catch (e) {
      return {
        success: false,
        message: e.response.data.error,
      }
    }
  }, [])

  const deleteBand = useCallback(async (id: number) => {
    try {
      if (superAdmin) {
        await api.delete(`/band/${id}`, {
          headers: { "x-access-token": accessToken },
        })
        setMyBands(old => old.filter(band => band.id !== id))
        return {
          success: true,
          message: "Banda deletada com sucesso",
        }
      }
      return {
        success: false,
        message: "Você não tem permissão de deletar uma banda",
      }
    } catch (e) {
      return {
        success: false,
        message: e.response.data.error,
      }
    }
  }, [])

  const updateBand = useCallback(async ({ name, cellphone, email, id }: CreateBandProp) => {
    try {
      if (adm) {
        await api.patch(
          `/band/${id}`,
          { name, cellphone, email },
          {
            headers: { "x-access-token": accessToken },
          }
        )
        setMyBands(old => [...old.filter(band => band.id !== id), { name, cellphone, id, email } as IBand])

        return {
          success: true,
          message: "Banda atualizada com sucesso",
        }
      }
      return {
        success: false,
        message: "Você não tem permissão de criar uma banda",
      }
    } catch (e) {
      return {
        success: false,
        message: e.response.data.error,
      }
    }
  }, [])
  return (
    <BandContext.Provider
      value={{ getBands, bands, myBands, getMyBands, createBand, deleteBand, updateBand, currentBand, setCurrentBand }}
    >
      {children}
    </BandContext.Provider>
  )
}

export { useBand, BandProvider }
