/* eslint-disable no-debugger */
import React, { useContext, createContext, useState, ReactNode, useCallback } from "react"

import { AxiosResponse } from "axios"
import { api } from "../../Services/api"
import { ILabel } from "../../Types/label.type"
import { IResponse, useAuth } from "../Auth/Auth"

interface CreateLabelProp {
  title: string
  color: string
  id?: number
}

interface LabelContextProps {
  labels: ILabel[]
  createLabel: ({ title, color }: CreateLabelProp) => Promise<IResponse>
  updateLabel: ({ title, color, id }: CreateLabelProp) => Promise<IResponse>
  deleteLabel: (id: number) => Promise<IResponse>
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
      localStorage.setItem("test", JSON.stringify(data))
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

  const updateLabel = useCallback(async ({ title, color, id }: CreateLabelProp) => {
    try {
      if (superAdmin) {
        const response: AxiosResponse = await api.patch(
          `/Label/${id}`,
          { title, color },
          {
            headers: { "x-access-token": accessToken },
          }
        )
        setLabels(old => [...old.filter(Label => Label.id !== id), { title, color, id } as ILabel])

        return {
          success: true,
          message: "Label atualizada com sucesso",
        }
      }
      return {
        success: false,
        message: "Você não tem permissão de atualizar uma Label",
      }
    } catch (e) {
      console.log(e)
      return {
        success: false,
        message: e.response.data.error,
      }
    }
  }, [])

  const deleteLabel = useCallback(async (id: number) => {
    try {
      if (superAdmin) {
        await api.delete(`/label/${id}`, {
          headers: { "x-access-token": accessToken },
        })
        setLabels(old => old.filter(Label => Label.id !== id))
        return {
          success: true,
          message: "Label deletada com sucesso",
        }
      }
      return {
        success: false,
        message: "Você não tem permissão de deletar uma Label",
      }
    } catch (e) {
      return {
        success: false,
        message: e.response.data.error,
      }
    }
  }, [])

  return (
    <LabelContext.Provider value={{ labels, createLabel, getLabels, updateLabel, deleteLabel }}>
      {children}
    </LabelContext.Provider>
  )
}

export { useLabel, LabelProvider }
