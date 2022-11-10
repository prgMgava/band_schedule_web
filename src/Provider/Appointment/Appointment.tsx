/* eslint-disable no-debugger */
import React, { useContext, createContext, useState, ReactNode, useCallback, Dispatch } from "react"

import { AxiosResponse } from "axios"
import { api } from "../../Services/api"
import { IResponse, useAuth } from "../Auth/Auth"
import { IAppointments } from "../../Types/appointments.type"
import { addDays, subDays } from "date-fns"

export interface IParams {
  data_inicial: Date
  data_final: Date
  categoria?: number
  artista?: number
  estado?: string
}
interface AppointmentContextProps {
  getAppointments: (date: Date) => Promise<IResponse>
  getAppointmentsByBand: (date: Date, idBand?: number) => Promise<IResponse>
  getMyAppointments: (date: Date, owner: number) => Promise<IResponse>
  appointments: IAppointments[]
  appointmentsFiltered: IAppointments[]
  currentDate: Date
  setCurrentDate: Dispatch<React.SetStateAction<Date>>
  createAppointment: (payload: IAppointments) => Promise<IResponse>
  updateAppointment: (payload: IAppointments, id: number) => Promise<IResponse>
  deleteAppointment: (id: number) => Promise<IResponse>
  updateAppointmentStatus: () => Promise<IResponse>
  getMyAppointmentsAdvanced: (payload: IParams, owner: number) => Promise<IResponse>
}
const AppointmentContext = createContext<AppointmentContextProps>({} as AppointmentContextProps)

const useAppointment = () => {
  const context = useContext(AppointmentContext)
  if (!context) {
    throw new Error("useAppointment must be used within an AppointmentProvider")
  }
  return context
}

interface AppointmentProviderProps {
  children: ReactNode
}

const AppointmentProvider = ({ children }: AppointmentProviderProps) => {
  const { accessToken, adm } = useAuth()
  const [appointments, setAppointments] = useState<IAppointments[]>([])
  const [appointmentsFiltered, setAppointmentsFiltered] = useState<IAppointments[]>([])

  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentBand, setCurrentBand] = useState<number>()

  const getAppointments = useCallback(async (date: Date) => {
    try {
      const startDateAux = subDays(date, 40)
      const endDateAux = addDays(date, 40)

      const startDate = new Date(startDateAux).toISOString().substring(0, 10)
      const endDate = new Date(endDateAux).toISOString().substring(0, 10)

      const { data }: AxiosResponse<IAppointments[]> = await api.get(
        `/appointment?start_date=${startDate}&end_date=${endDate}`,
        {
          headers: { "x-access-token": accessToken },
        }
      )

      setAppointments(data)

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

  const getMyAppointments = useCallback(async (date: Date, owner: number) => {
    try {
      const startDateAux = subDays(date, 40)
      const endDateAux = addDays(date, 40)

      const startDate = new Date(startDateAux).toISOString().substring(0, 10)
      const endDate = new Date(endDateAux).toISOString().substring(0, 10)

      const { data }: AxiosResponse<IAppointments[]> = await api.get(
        `/appointment/owner/${owner}?start_date=${startDate}&end_date=${endDate}`,
        {
          headers: { "x-access-token": accessToken },
        }
      )

      setAppointments(data)

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

  const getMyAppointmentsAdvanced = useCallback(async (payload, owner) => {
    try {
      const query = `data_inicial=${payload.data_inicial}&data_final=${payload.data_final}&categoria=${payload.categoria}&estado=${payload.estado}&artista=${payload.artista}`

      const { data }: AxiosResponse<IAppointments[]> = await api.get(`/appointment/${owner}/advanced?${query}`, {
        headers: { "x-access-token": accessToken },
      })

      setAppointmentsFiltered(data)

      return {
        success: true,
        message: "Lista de compromissos buscadas com sucesso",
      }
    } catch (e) {
      return {
        success: false,
        message: e.response.data.error,
      }
    }
  }, [])

  const getAppointmentsByBand = useCallback(async (date: Date, idBand = currentBand) => {
    try {
      const startDateAux = subDays(date, 40)
      const endDateAux = addDays(date, 40)
      setCurrentBand(idBand)

      const startDate = new Date(startDateAux).toISOString().substring(0, 10)
      const endDate = new Date(endDateAux).toISOString().substring(0, 10)

      const { data }: AxiosResponse<IAppointments[]> = await api.get(
        `/appointment/band/${idBand}?start_date=${startDate}&end_date=${endDate}`,
        {
          headers: { "x-access-token": accessToken },
        }
      )
      setAppointments(data)

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

  const createAppointment = useCallback(async (payload: IAppointments) => {
    try {
      if (adm) {
        const response: AxiosResponse = await api.post("/appointment", payload, {
          headers: { "x-access-token": accessToken },
        })
        setAppointments(old => [...old, response.data])
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

  const deleteAppointment = useCallback(async (id: number) => {
    try {
      if (adm) {
        await api.delete(`/appointment/${id}`, {
          headers: { "x-access-token": accessToken },
        })
        setAppointments(old => old.filter(Appointment => Appointment.id !== id))
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

  const updateAppointment = useCallback(async (payload: IAppointments, id: number) => {
    try {
      if (adm) {
        await api.patch(`/appointment/${id}`, payload, {
          headers: { "x-access-token": accessToken },
        })
        setAppointments(old => [...old.filter(Appointment => Appointment.id !== id), payload])

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

  const updateAppointmentStatus = useCallback(async () => {
    const currentDate = new Date().toISOString().substring(0, 10)
    try {
      if (adm) {
        const { data } = await api.patch(
          `/appointment?current_date=${currentDate}`,
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
    <AppointmentContext.Provider
      value={{
        getAppointments,
        deleteAppointment,
        appointments,
        createAppointment,
        updateAppointment,
        updateAppointmentStatus,
        currentDate,
        setCurrentDate,
        getAppointmentsByBand,
        getMyAppointments,
        getMyAppointmentsAdvanced,
        appointmentsFiltered,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  )
}

export { useAppointment, AppointmentProvider }
