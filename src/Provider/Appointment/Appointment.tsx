/* eslint-disable no-debugger */
import React, { useContext, createContext, useState, ReactNode, useCallback, Dispatch } from "react"

import { AxiosResponse } from "axios"
import { api } from "../../Services/api"
import { IResponse, useAuth } from "../Auth/Auth"
import { IAppointments } from "../../Types/appointments.type"
import { addDays, subDays } from "date-fns"

interface AppointmentContextProps {
  getAppointments: (date: Date) => Promise<IResponse>
  appointments: IAppointments[]
}
const AppointmentContext = createContext<AppointmentContextProps>({} as AppointmentContextProps)

const useAppointment = () => {
  const context = useContext(AppointmentContext)
  if (!context) {
    throw new Error("useAppointment must be used within an AppointmentProvider")
  }
  return context
}

interface GetMyAppointmentsProps {
  owner: number
}

interface CreateAppointmentProp {
  title: string
  cellphone: string
  street: string
  district: string
  state: string
  city: string
  place: string
  address_number: string
  address_complement: string
  status: "agendado" | "concluido" | "cancelado" | "reagendado"
  id_band: number
  startDate: string
  endDate: string
  address: boolean
}

interface AppointmentProviderProps {
  children: ReactNode
}

const AppointmentProvider = ({ children }: AppointmentProviderProps) => {
  const { id, accessToken, adm, superAdmin } = useAuth()
  const [appointments, setAppointments] = useState<IAppointments[]>([])

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
      debugger
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

  //   const createAppointment = useCallback(async ({ name, cellphone, email }: CreateAppointmentProp) => {
  //     try {
  //       if (adm) {
  //         const response: AxiosResponse = await api.post(
  //           "/Appointment",
  //           { name, cellphone, email },
  //           {
  //             headers: { "x-access-token": accessToken },
  //           }
  //         )
  //         setMyAppointments(old => [...old, response.data])
  //         return {
  //           success: true,
  //           message: "Appointmenta cadastrada com sucesso",
  //         }
  //       }
  //       return {
  //         success: false,
  //         message: "Você não tem permissão de criar uma Appointmenta",
  //       }
  //     } catch (e) {
  //       console.log(e)
  //       return {
  //         success: false,
  //         message: e.response.data.error,
  //       }
  //     }
  //   }, [])

  //   const deleteAppointment = useCallback(async (id: number) => {
  //     try {
  //       if (superAdmin) {
  //         await api.delete(`/Appointment/${id}`, {
  //           headers: { "x-access-token": accessToken },
  //         })
  //         setMyAppointments(old => old.filter(Appointment => Appointment.id !== id))
  //         return {
  //           success: true,
  //           message: "Appointmenta deletada com sucesso",
  //         }
  //       }
  //       return {
  //         success: false,
  //         message: "Você não tem permissão de deletar uma Appointmenta",
  //       }
  //     } catch (e) {
  //       console.log(e)
  //       return {
  //         success: false,
  //         message: e.response.data.error,
  //       }
  //     }
  //   }, [])

  //   const updateAppointment = useCallback(async ({ name, cellphone, email, id }: CreateAppointmentProp) => {
  //     try {
  //       if (adm) {
  //         const response: AxiosResponse = await api.patch(
  //           `/Appointment/${id}`,
  //           { name, cellphone, email },
  //           {
  //             headers: { "x-access-token": accessToken },
  //           }
  //         )
  //         setMyAppointments(old => [...old.filter(Appointment => Appointment.id !== id), { name, cellphone, id, email } as ])

  //         return {
  //           success: true,
  //           message: "Appointmenta atualizada com sucesso",
  //         }
  //       }
  //       return {
  //         success: false,
  //         message: "Você não tem permissão de criar uma Appointmenta",
  //       }
  //     } catch (e) {
  //       console.log(e)
  //       return {
  //         success: false,
  //         message: e.response.data.error,
  //       }
  //     }
  //   }, [])
  return <AppointmentContext.Provider value={{ getAppointments, appointments }}>{children}</AppointmentContext.Provider>
}

export { useAppointment, AppointmentProvider }
