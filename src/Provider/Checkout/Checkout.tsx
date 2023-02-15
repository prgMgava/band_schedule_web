import React, { useContext, createContext, useState, ReactNode, useCallback, Dispatch } from "react"

import { AxiosResponse } from "axios"
import { api } from "../../Services/api"
import { IResponse, useAuth } from "../Auth/Auth"
import { ICheckout } from "../../Types/checkout.type"
import { addDays, subDays } from "date-fns"

interface CheckoutContextProps {
  getCheckouts: (isMonthly: boolean) => Promise<IResponse>
  getCheckoutsByBand: (date: Date, idBand: number) => Promise<IResponse>
  checkouts: ICheckout[]
  currentDate: Date
  setCurrentDate: Dispatch<React.SetStateAction<Date>>
  createCheckout: (payload: ICheckout) => Promise<IResponse>
  updateCheckout: (payload: ICheckout, id: number) => Promise<IResponse>
  deleteCheckout: (id: number) => Promise<IResponse>
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
  const [checkoutsFiltered, setCheckoutsFiltered] = useState<ICheckout[]>([])

  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentBand, setCurrentBand] = useState<number>()

  const getCheckouts = useCallback(async (isMonthly: boolean) => {
    try {
      const startDateAux = isMonthly ? new Date(new Date().getFullYear(), new Date().getMonth(), 1) : new Date(new Date().getFullYear(), 0, 1)
      const endDateAux = isMonthly ? new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0) : new Date(new Date().getFullYear() + 1, 0, 1)

      const startDate = new Date(startDateAux).toISOString().substring(0, 10)
      const endDate = new Date(endDateAux).toISOString().substring(0, 10)

      const { data }: AxiosResponse<ICheckout[]> = await api.get(
        `/checkout?startDate=${startDate}&endDate=${endDate}`,
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
        setCheckouts(old => [...old, response.data])
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

  const deleteCheckout = useCallback(async (id: number) => {
    try {
      if (adm) {
        await api.delete(`/checkout${id}`, {
          headers: { "x-access-token": accessToken },
        })
        setCheckouts(old => old.filter(Checkout => Checkout.id !== id))
        return {
          success: true,
          message: "Evento deletado com sucesso",
        }
      }
      return {
        success: false,
        message: "Você não tem permissão de deletar um evento",
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
        getCheckoutsByBand

      }}
    >
      {children}
    </CheckoutContext.Provider>
  )
}

export { useCheckout, CheckoutProvider }
