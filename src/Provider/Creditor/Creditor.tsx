import React, { useContext, createContext, useState, ReactNode, useCallback, Dispatch } from "react"

import { AxiosResponse } from "axios"
import { api } from "../../Services/api"
import { ICreditor } from "../../Types/creditor.type"
import { IResponse, useAuth } from "../Auth/Auth"

interface CreateCreditorProp {
  name: string
  is_supplier: boolean
  id?: number
}

interface CreditorContextProps {
  creditors: ICreditor[]
  createCreditor: ({ name, is_supplier }: CreateCreditorProp) => Promise<IResponse>
  getCreditors: () => Promise<IResponse>
  getCreditorById: (id: number) => Promise<IResponse>
  updateCreditor: ({ name, is_supplier, id }: CreateCreditorProp) => Promise<IResponse>
  deleteCreditor: (id: number) => Promise<IResponse>
}
const CreditorContext = createContext<CreditorContextProps>({} as CreditorContextProps)

const useCreditor = () => {
  const context = useContext(CreditorContext)
  if (!context) {
    throw new Error("useCreditor must be used within an CreditorProvider")
  }
  return context
}

interface CreditorProviderProps {
  children: ReactNode
}

const CreditorProvider = ({ children }: CreditorProviderProps) => {
  const { accessToken, superAdmin } = useAuth()
  const [creditors, setCreditors] = useState<ICreditor[]>([])

  const getCreditors = useCallback(async () => {
    try {
      const { data }: AxiosResponse<ICreditor[]> = await api.get("/creditor", {
        headers: { "x-access-token": accessToken },
      })

      setCreditors(data)
      const newData = data.map(item => {
        return {
          ...item,
          text: item.name,
        }
      })
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

  const getCreditorById = useCallback(async (id: number) => {
    try {
      const { data }: AxiosResponse<ICreditor[]> = await api.get(`/creditor/${id}`, {
        headers: { "x-access-token": accessToken },
      })

      setCreditors(data)
      const newData = data.map(item => {
        return {
          ...item,
          text: item.name,
        }
      })
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

  const createCreditor = useCallback(async ({ name, is_supplier }: CreateCreditorProp) => {
    try {
      if (superAdmin) {
        const response: AxiosResponse = await api.post(
          "/creditor",
          { name, is_supplier },
          {
            headers: { "x-access-token": accessToken },
          }
        )
        setCreditors(old => [...old, response.data])
        return {
          success: true,
          message: "Credor cadastrado com sucesso",
        }
      }
      return {
        success: false,
        message: "Você não tem permissão de criar um credor",
      }
    } catch (e) {
      return {
        success: false,
        message: e.response.data.error,
      }
    }
  }, [])

  const updateCreditor = useCallback(async ({ name, is_supplier, id }: CreateCreditorProp) => {
    try {
      if (superAdmin) {
        await api.patch(
          `/creditor/${id}`,
          { is_supplier, name },
          {
            headers: { "x-access-token": accessToken },
          }
        )
        setCreditors(old => [...old.filter(creditor => creditor.id !== id), { name, is_supplier, id } as ICreditor])

        return {
          success: true,
          message: "Creditor atualizada com sucesso",
        }
      }
      return {
        success: false,
        message: "Você não tem permissão de atualizar uma creditor",
      }
    } catch (e) {
      return {
        success: false,
        message: e.response.data.error,
      }
    }
  }, [])

  const deleteCreditor = useCallback(async (id: number) => {
    try {
      if (superAdmin) {
        await api.delete(`/creditor/${id}`, {
          headers: { "x-access-token": accessToken },
        })
        setCreditors(old => old.filter(Creditor => Creditor.id !== id))
        return {
          success: true,
          message: "Credor deletado com sucesso",
        }
      }
      return {
        success: false,
        message: "Você não tem permissão de deletar um credor",
      }
    } catch (e) {
      return {
        success: false,
        message: e.response.data.error,
      }
    }
  }, [])

  return (
    <CreditorContext.Provider
      value={{
        creditors,
        createCreditor,
        getCreditors,
        updateCreditor,
        deleteCreditor,
        getCreditorById,
      }}
    >
      {children}
    </CreditorContext.Provider>
  )
}

export { useCreditor, CreditorProvider }
