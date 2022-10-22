/* eslint-disable no-debugger */
import React, { useContext, createContext, useState, ReactNode, useCallback, Dispatch } from "react"
import jwt_decode from "jwt-decode"

import { AxiosResponse } from "axios"
import { api } from "../../services/api"
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

interface AuthContextData {
  id: () => string
  accessToken: string
  signIn: (credentials: SignInCredentials) => Promise<void>
  signUp: (credentials: SignUpCredentials) => Promise<void>
  signOut: () => void
  getUser: () => void
  userData: any
  setData: Dispatch<React.SetStateAction<AuthState>>
}

interface AuthProviderProps {
  children: ReactNode
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [data, setData] = useState<AuthState>(() => {
    const accessToken = localStorage.getItem("@BandSchedule:accessToken") || ""
    const id = localStorage.getItem("@BandSchedule:id") || ""
    const adm = localStorage.getItem("@BandSchedule:adm") || ""
    const superAdmin = localStorage.getItem("@BandSchedule:superAdmin") || ""

    if (accessToken && id) {
      return { accessToken, id: JSON.parse(id), adm: Boolean(adm), superAdmin: Boolean(superAdmin) }
    }
    return {} as AuthState
  })
  const [userData, setUserData] = useState({} as any)
  const signIn = useCallback(async ({ username, password }: SignInCredentials) => {
    //const response = await api.post("/login", { username, password })
    const response = {
      data: {
        accessToken:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiYWRtIjp0cnVlLCJzdXBlckFkbWluIjpmYWxzZSwiaWF0IjoxNjY1OTUxNDExfQ.cK3AEl8qDinXlLdC8u0CdjOrq-2_k7XTonHpJaDeLOM",
      },
    }
    const { accessToken } = response.data

    const { id, adm, superAdmin } = jwt_decode<any>(accessToken)
    localStorage.setItem("@BandSchedule:accessToken", accessToken)
    localStorage.setItem("@BandSchedule:id", JSON.stringify(id))
    localStorage.setItem("@BandSchedule:adm", adm?.toString())
    localStorage.setItem("@BandSchedule:superAdmin", superAdmin?.toString())
    setData({ accessToken, id, adm, superAdmin })
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
    // api
    //   .post("/register", {
    //     email,
    //     password,
    //     username,
    //     cellphone,
    //   })
    //   .then(() => {
    //     signIn({ password, username })
    //   })
    //   .catch(() => {
    //     alert("deu ruim")
    //   })
    signIn({ password, username })
  }, [])

  return (
    <AuthContext.Provider
      value={{ accessToken: data.accessToken, getUser, id: data.id, setData, signIn, signOut, userData, signUp }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { useAuth, AuthProvider }
