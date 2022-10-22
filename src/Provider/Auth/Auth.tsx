/* eslint-disable no-debugger */
import React, { useContext, createContext, useState, ReactNode, useCallback, Dispatch } from "react"
import jwt_decode from "jwt-decode"

import { AxiosResponse } from "axios"
import { api } from "../../Services/api"
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
  signOut: () => void
  getUser: () => void
  userData: any
  setData: Dispatch<React.SetStateAction<AuthState>>
  superAdmin: boolean
  adm: boolean
}

interface AuthProviderProps {
  children: ReactNode
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [data, setData] = useState<AuthState>(() => {
    const accessToken = localStorage.getItem("@BandSchedule:accessToken") || ""
    debugger
    const id = localStorage.getItem("@BandSchedule:id") || ""
    const adm = localStorage.getItem("@BandSchedule:adm") || ""
    const superAdmin = localStorage.getItem("@BandSchedule:super_admin") || ""

    if (accessToken && id) {
      return { accessToken, id: JSON.parse(id), adm: Boolean(adm), superAdmin: Boolean(superAdmin) }
    }
    return {} as AuthState
  })
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
      debugger
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
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { useAuth, AuthProvider }
