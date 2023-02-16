import React, { useContext, createContext, useState, ReactNode, useCallback, Dispatch } from "react"

import { AxiosResponse } from "axios"
import { api } from "../../Services/api"
import { IResponse, useAuth } from "../Auth/Auth"
import { ICheckout } from "../../Types/checkout.type"
import { addDays, subDays } from "date-fns"

interface CheckoutContextProps {
  getCheckouts: (startDate: string, endDate: string, idBand: number) => Promise<IResponse>
  getCheckoutsByBand: (date: Date, idBand: number) => Promise<IResponse>
  checkouts: ICheckout[]
  checkoutsYearly: ICheckout[]
  currentDate: Date
  setCurrentDate: Dispatch<React.SetStateAction<Date>>
  createCheckout: (payload: ICheckout) => Promise<IResponse>
  updateCheckout: (payload: ICheckout, id: number) => Promise<IResponse>
  deleteCheckout: (id: number, idBand: number) => Promise<IResponse>
  updateCheckoutStatus: () => Promise<IResponse>
}
const CheckoutContext = createContext<CheckoutContextProps>({} as CheckoutContextProps)

const useCheckout = () => {
  const context = useContext(CheckoutContext)
  if (!context) {
    throw new Error("useCheckout must be used within an CheckoutProvider")
  }
  return context
}

interface CheckoutProviderProps {
  children: ReactNode
}

const CheckoutProvider = ({ children }: CheckoutProviderProps) => {
  const { accessToken, adm } = useAuth()
  const [checkouts, setCheckouts] = useState<ICheckout[]>([])
  const [checkoutsYearly, setCheckoutsYearly] = useState<ICheckout[]>([])

  const [checkoutsFiltered, setCheckoutsFiltered] = useState<ICheckout[]>([])

  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentBand, setCurrentBand] = useState<number>()

  const getCheckouts = useCallback(async (startDate: string, endDate: string, idBand: number) => {
    try {

      const { data }: AxiosResponse<ICheckout[]> = await api.get(
        `/checkout?startDate=${startDate}&endDate=${endDate}&idBand=${idBand}`,
        {
          headers: { "x-access-token": accessToken },
        }
      )

      setCheckouts(data)
      const firstDayOfYear = new Date(new Date().getFullYear(), 0, 1).toISOString().substring(0, 10)
      const lastDayOfYear = new Date(new Date().getFullYear(), 11, 31).toISOString().substring(0, 10)
      getCheckoutsYearly(firstDayOfYear, lastDayOfYear, idBand)

      return {
        success: true,
        message: data.length ? "Finanças encontradas com sucesso" : "Nenhuma finança encontrada",
      }
    } catch (e) {
      return {
        success: false,
        message: e.response.data.error,
      }
    }
  }, [])

  const getCheckoutsYearly = useCallback(async (startDate: string, endDate: string, idBand: number) => {
    try {

      const { data }: AxiosResponse<ICheckout[]> = await api.get(
        `/checkout?startDate=${startDate}&endDate=${endDate}&idBand=${idBand}`,
        {
          headers: { "x-access-token": accessToken },
        }
      )

      setCheckoutsYearly(data)

      return {
        success: true,
        message: data.length ? "Finanças encontradas com sucesso" : "Nenhuma finança encontrada",
      }
    } catch (e) {
      return {
        success: false,
        message: e.response.data.error,
      }
    }
  }, [])

  const getCheckoutsByBand = useCallback(async (date: Date, idBand = currentBand) => {
    try {
      const startDateAux = subDays(date, 40)
      const endDateAux = addDays(date, 40)
      setCurrentBand(idBand)

      const startDate = new Date(startDateAux).toISOString().substring(0, 10)
      const endDate = new Date(endDateAux).toISOString().substring(0, 10)

      const { data }: AxiosResponse<ICheckout[]> = await api.get(
        `/checkout/band/${idBand}?start_date=${startDate}&end_date=${endDate}`,
        {
          headers: { "x-access-token": accessToken },
        }
      )
      setCheckouts(data)

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

  const createCheckout = useCallback(async (payload: ICheckout) => {
    try {
      if (adm) {
        const response: AxiosResponse = await api.post("/checkout", payload, {
          headers: { "x-access-token": accessToken },
        })
        setCheckouts(old => [response.data, ...old])
        refreshCheckout(payload.id_band)
        return {
          success: true,
          message: "Evento agendado com sucesso",
        }
      }
      return {
        success: false,
        message: "Você não tem permissão de criar um evento",
      }
    } catch (e) {
      return {
        success: false,
        message: e.response.data.error,
      }
    }
  }, [])

  const deleteCheckout = useCallback(async (id: number, idBand: number) => {
    try {
      if (adm) {
        await api.delete(`/checkout/${id}`, {
          headers: { "x-access-token": accessToken },
        })
        console.log(idBand)
        setCheckouts(old => old.filter(Checkout => Checkout.id !== id))
        refreshCheckout(idBand)
        return {
          success: true,
          message: "Finança deletada com sucesso",
        }
      }
      return {
        success: false,
        message: "Você não tem permissão de deletar",
      }
    } catch (e) {
      return {
        success: false,
        message: e.response.data.error,
      }
    }
  }, [])

  const updateCheckout = useCallback(async (payload: ICheckout, id: number) => {
    try {
      if (adm) {
        await api.patch(`/checkout${id}`, payload, {
          headers: { "x-access-token": accessToken },
        })
        setCheckouts(old => [...old.filter(Checkout => Checkout.id !== id), payload])

        return {
          success: true,
          message: "Evento atualizado com sucesso",
        }
      }
      return {
        success: false,
        message: "Você não tem permissão de editar um evento",
      }
    } catch (e) {
      return {
        success: false,
        message: e.response.data.error,
      }
    }
  }, [])

  const updateCheckoutStatus = useCallback(async () => {
    const currentDate = new Date().toISOString().substring(0, 10)
    try {
      if (adm) {
        const { data } = await api.patch(
          `/checkoutcurrent_date=${currentDate}`,
          {},
          {
            headers: { "x-access-token": accessToken },
          }
        )

        return {
          success: true,
          message: data.success,
        }
      }
      return {
        success: false,
        message: "Você não tem permissão de editar um evento",
      }
    } catch (e) {
      return {
        success: false,
        message: e.response.data.error,
      }
    }
  }, [])

  const refreshCheckout = (idBand: number) => {
    const dataInicial = new Date(currentDate.getFullYear(), currentDate.getMonth())
    const dataFinal = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    const dataInicialFormatada = dataInicial.toISOString().substring(0, 10)
    const dataFinalFormatada = dataFinal.toISOString().substring(0, 10)
    getCheckouts(dataInicialFormatada, dataFinalFormatada, idBand)
  }
  return (
    <CheckoutContext.Provider
      value={{
        getCheckouts,
        deleteCheckout,
        checkouts,
        createCheckout,
        updateCheckout,
        updateCheckoutStatus,
        currentDate,
        setCurrentDate,
        getCheckoutsByBand,
        checkoutsYearly
      }}
    >
      {children}
    </CheckoutContext.Provider>
  )
}

export { useCheckout, CheckoutProvider }
