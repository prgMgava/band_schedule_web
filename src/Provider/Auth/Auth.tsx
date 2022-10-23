/* eslint-disable no-debugger */
import React, { useContext, createContext, useState, ReactNode, useCallback, Dispatch } from "react"
import jwt_decode from "jwt-decode"

import { AxiosResponse } from "axios"
import { api } from "../../Services/api"
import { IUser } from "../../Types/user.type"
const AuthContext = createContext<AuthContextData>({} as AuthContextData)

const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthState {
  accessToken: string
  id: () => string
  adm: boolean
  superAdmin: boolean
}

interface SignInCredentials {
  username: string
  password: string
}

interface SignUpCredentials extends SignInCredentials {
  cellphone: string
  email: string
}

export interface IResponse {
  success: boolean
  message: string
}

interface AuthContextData {
  id: () => string
  accessToken: string
  signIn: (credentials: SignInCredentials) => Promise<IResponse>
  signUp: (credentials: SignUpCredentials) => Promise<IResponse>
  createAdm: (credentials: SignUpCredentials) => Promise<IResponse>
  signOut: () => void
  getUser: () => void
  userData: any
  setData: Dispatch<React.SetStateAction<AuthState>>
  superAdmin: boolean
  adm: boolean
  getAdmins: () => Promise<IResponse>
  adminList: IUser[]
  memberList: IUser[]
  deleteAdmin: (id: number) => Promise<IResponse>
  getMembers: () => Promise<IResponse>
}

interface AuthProviderProps {
  children: ReactNode
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [data, setData] = useState<AuthState>(() => {
    const accessToken = localStorage.getItem("@BandSchedule:accessToken") || ""
    const id = localStorage.getItem("@BandSchedule:id") || ""
    const adm = localStorage.getItem("@BandSchedule:adm") || ""
    const superAdmin = localStorage.getItem("@BandSchedule:super_admin") || ""

    if (accessToken && id) {
      return { accessToken, id: JSON.parse(id), adm: adm === "true", superAdmin: superAdmin === "true" }
    }
    return {} as AuthState
  })
  const [adminList, setAdminList] = useState<IUser[]>([])
  const [memberList, setMemberList] = useState<IUser[]>([])

  const [userData, setUserData] = useState({} as any)
  const signIn = useCallback(async ({ username, password }: SignInCredentials) => {
    try {
      const response = await api.post("/login", { username, password })
      const { token: accessToken } = response.data

      const { id, adm, super_admin: superAdmin } = jwt_decode<any>(accessToken)
      localStorage.setItem("@BandSchedule:accessToken", accessToken)
      localStorage.setItem("@BandSchedule:id", JSON.stringify(id))
      localStorage.setItem("@BandSchedule:adm", adm?.toString())
      localStorage.setItem("@BandSchedule:super_admin", superAdmin?.toString())
      setData({ accessToken, id, adm, superAdmin })
      return {
        success: true,
        message: response.data.success,
      }
    } catch (e) {
      console.log(e)
      return {
        success: false,
        message: e.response.data.error,
      }
    }
  }, [])

  const signOut = useCallback(() => {
    localStorage.removeItem("@BandSchedule:accessToken")
    localStorage.removeItem("@BandSchedule:id")
    localStorage.removeItem("@BandSchedule:adm")
    localStorage.removeItem("@BandSchedule:superAdmin")

    setData({} as AuthState)
  }, [])

  const getUser = () => {
    api
      .get(`/users/${data.id}`, {
        headers: { Authorization: `Bearer ${data.accessToken}` },
      })
      .then((response: AxiosResponse<any>) => setUserData(response.data))
      .catch(err => console.log(err))
  }

  const signUp = useCallback(async ({ username, password, cellphone, email }: SignUpCredentials) => {
    try {
      await api.post("/user/member", { username, password, cellphone, email })
      return {
        success: true,
        message: "Usuário criado com sucesso faça seu login",
      }
    } catch (e) {
      console.log(e)
      return {
        success: false,
        message: e.response.data.error,
      }
    }
  }, [])

  const createAdm = useCallback(async ({ username, password, cellphone, email }: SignUpCredentials) => {
    try {
      if (data.superAdmin) {
        await api.post(
          "/user/adm",
          { username, password, cellphone, email },
          { headers: { "x-access-token": data.accessToken } }
        )
      }
      return {
        success: true,
        message: "Adm criado com sucesso faça seu login",
      }
    } catch (e) {
      return {
        success: false,
        message: e.response.data.error,
      }
    }
  }, [])

  const getAdmins = async () => {
    try {
      if (data.superAdmin) {
        const { data: list }: AxiosResponse<IUser[]> = await api.get(`/user/adm`, {
          headers: { "x-access-token": data.accessToken },
        })

        setAdminList(list)
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
  }

  const deleteAdmin = useCallback(async (id: number) => {
    try {
      if (data.superAdmin) {
        await api.delete(`/user/${id}`, {
          headers: { "x-access-token": data.accessToken },
        })
        setAdminList(old => old.filter(user => user.id !== id))
        return {
          success: true,
          message: "Admin deletado com sucesso",
        }
      }
      return {
        success: false,
        message: "Você não tem permissão de deletar um admin",
      }
    } catch (e) {
      console.log(e)
      return {
        success: false,
        message: e.response.data.error,
      }
    }
  }, [])

  const getMembers = async () => {
    try {
      if (data.superAdmin) {
        const { data: list }: AxiosResponse<IUser[]> = await api.get(`/user/member`, {
          headers: { "x-access-token": data.accessToken },
        })

        setMemberList(list)
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
  }

  return (
    <AuthContext.Provider
      value={{
        accessToken: data.accessToken,
        getUser,
        id: data.id,
        setData,
        signIn,
        signOut,
        userData,
        signUp,
        superAdmin: data.superAdmin,
        adm: data.adm,
        createAdm,
        getAdmins,
        adminList,
        deleteAdmin,
        getMembers,
        memberList,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { useAuth, AuthProvider }
