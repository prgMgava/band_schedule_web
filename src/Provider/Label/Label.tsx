/* eslint-disable no-debugger */
import React, { useContext, createContext, useState, ReactNode, useCallback, Dispatch } from "react"

import { AxiosResponse } from "axios"
import { api } from "../../Services/api"
import { ILabel } from "../../Types/label.type"
import { IResponse, useAuth } from "../Auth/Auth"

interface CreateLabelProp {
  title: string
  color: string
}

interface LabelContextProps {
  labels: ILabel[]
  createLabel: ({ title, color }: CreateLabelProp) => Promise<IResponse>
  getLabels: () => Promise<IResponse>
}
const LabelContext = createContext<LabelContextProps>({} as LabelContextProps)

const useLabel = () => {
  const context = useContext(LabelContext)
  if (!context) {
    throw new Error("useLabel must be used within an LabelProvider")
  }
  return context
}

interface LabelProviderProps {
  children: ReactNode
}

const LabelProvider = ({ children }: LabelProviderProps) => {
  const { id, accessToken, adm, superAdmin } = useAuth()
  const [labels, setLabels] = useState<ILabel[]>([])

  const getLabels = useCallback(async () => {
    try {
      const { data }: AxiosResponse<ILabel[]> = await api.get("/label", {
        headers: { "x-access-token": accessToken },
      })

      setLabels(data)
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

  const createLabel = useCallback(async ({ title, color }: CreateLabelProp) => {
    try {
      if (superAdmin) {
        const response: AxiosResponse = await api.post(
          "/label",
          { title, color },
          {
            headers: { "x-access-token": accessToken },
          }
        )
        setLabels(old => [...old, response.data])
        return {
          success: true,
          message: "Label cadastrada com sucesso",
        }
      }
      return {
        success: false,
        message: "Você não tem permissão de criar uma Label",
      }
    } catch (e) {
      return {
        success: false,
        message: e.response.data.error,
      }
    }
  }, [])

  // const deleteLabel = useCallback(async (id: number) => {
  //   try {
  //     if (superAdmin) {
  //       await api.delete(`/Label/${id}`, {
  //         headers: { "x-access-token": accessToken },
  //       })
  //       setLabels(old => old.filter(Label => Label.id !== id))
  //       return {
  //         success: true,
  //         message: "Labela deletada com sucesso",
  //       }
  //     }
  //     return {
  //       success: false,
  //       message: "Você não tem permissão de deletar uma Labela",
  //     }
  //   } catch (e) {
  //     console.log(e)
  //     return {
  //       success: false,
  //       message: e.response.data.error,
  //     }
  //   }
  // }, [])

  // const updateLabel = useCallback(async ({ name, cellphone, email, id }: CreateLabelProp) => {
  //   try {
  //     if (adm) {
  //       const response: AxiosResponse = await api.patch(
  //         `/Label/${id}`,
  //         { name, cellphone, email },
  //         {
  //           headers: { "x-access-token": accessToken },
  //         }
  //       )
  //       setLabels(old => [...old.filter(Label => Label.id !== id), { name, cellphone, id, email } as ILabel])

  //       return {
  //         success: true,
  //         message: "Labela atualizada com sucesso",
  //       }
  //     }
  //     return {
  //       success: false,
  //       message: "Você não tem permissão de criar uma Labela",
  //     }
  //   } catch (e) {
  //     console.log(e)
  //     return {
  //       success: false,
  //       message: e.response.data.error,
  //     }
  //   }
  // }, [])
  return <LabelContext.Provider value={{ labels, createLabel, getLabels }}>{children}</LabelContext.Provider>
}

export { useLabel, LabelProvider }
