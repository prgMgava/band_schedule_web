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
  id: number
  adm: boolean
  superAdmin: boolean
  bandVisibility: number
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
  data?: any
}

interface AuthContextData {
  id: number
  accessToken: string
  signIn: (credentials: SignInCredentials) => Promise<IResponse>
  signUp: (credentials: SignUpCredentials, band_visibility: number) => Promise<IResponse>
  createAdm: (credentials: SignUpCredentials) => Promise<IResponse>
  signOut: () => void
  getUser: () => void
  userData: IUser
  setData: Dispatch<React.SetStateAction<AuthState>>
  superAdmin: boolean
  adm: boolean
  getAdmins: () => Promise<IResponse>
  adminList: IUser[]
  memberList: IUser[]
  deleteAdmin: (id: number) => Promise<IResponse>
  getMembers: () => Promise<IResponse>
  updateUser: (payload: IUser, id: number) => Promise<IResponse>
  bandVisibility: number | null
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
    const bandVisibility = localStorage.getItem("@BandSchedule:band_visibility") || ""
    const bandAux = bandVisibility && bandVisibility != "undefined" ? bandVisibility : "null"
    if (accessToken && id) {
      return {
        accessToken,
        id: JSON.parse(id),
        adm: adm === "true",
        superAdmin: superAdmin === "true",
        bandVisibility: JSON.parse(bandAux),
      }
    }
    return {} as AuthState
  })
  const [adminList, setAdminList] = useState<IUser[]>([])
  const [memberList, setMemberList] = useState<IUser[]>([])

  const [userData, setUserData] = useState({} as IUser)
  const signIn = useCallback(async ({ username, password }: SignInCredentials) => {
    try {
      const response = await api.post("/login", { username, password })
      const { token: accessToken } = response.data

      const { id, adm, super_admin: superAdmin, band_visibility: bandVisibility } = jwt_decode<any>(accessToken)
      localStorage.setItem("@BandSchedule:accessToken", accessToken)
      localStorage.setItem("@BandSchedule:id", JSON.stringify(id))
      localStorage.setItem("@BandSchedule:adm", adm?.toString())
      localStorage.setItem("@BandSchedule:super_admin", superAdmin?.toString())
      localStorage.setItem("@BandSchedule:band_visibility", JSON.stringify(bandVisibility))

      setData({ accessToken, id, adm, superAdmin, bandVisibility })

      return {
        success: true,
        message: response.data.success,
      }
    } catch (e) {
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
    localStorage.removeItem("@BandSchedule:super_admin")
    localStorage.removeItem("@BandSchedule:labels")
    localStorage.removeItem("@BandSchedule:first_time")
    localStorage.removeItem("@BandSchedule:band_visibility")

    setData({} as AuthState)
  }, [])

  const getUser = () => {
    api
      .get(`/user/${data.id}`, {
        headers: { "x-access-token": data.accessToken },
      })
      .then((response: AxiosResponse<IUser>) => setUserData(response.data))
      .catch(err => console.log(err))
  }

  const signUp = useCallback(
    async ({ username, password, cellphone, email }: SignUpCredentials, band_visibility: number) => {
      try {
        const member = await api.post("/user/member", { username, password, cellphone, email, band_visibility })
        setMemberList(old => [...old, member.data])
        return {
          success: true,
          message: "Usuário criado com sucesso",
        }
      } catch (e) {
        return {
          success: false,
          message: e.response.data.error,
        }
      }
    },
    []
  )

  const createAdm = useCallback(async ({ username, password, cellphone, email }: SignUpCredentials) => {
    try {
      if (data.superAdmin) {
        const newUser = await api.post(
          "/user/adm",
          { username, password, cellphone, email },
          { headers: { "x-access-token": data.accessToken } }
        )
        setAdminList(old => [...old, newUser.data])
      }

      return {
        success: true,
        message: "Admin criado com sucesso",
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
      if (data.adm) {
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
      return {
        success: false,
        message: e.response.data.error,
      }
    }
  }, [])

  const getMembers = async () => {
    try {
      const { data: list }: AxiosResponse<IUser[]> = await api.get(`/user/member`, {
        headers: { "x-access-token": data.accessToken },
      })

      setMemberList(list)

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

  const updateUser = useCallback(async (payload: IUser, id: number) => {
    try {
      await api.patch(`/user/${id}`, payload, { headers: { "x-access-token": data.accessToken } })
      return {
        success: true,
        message: "Usuário atualizado com sucesso",
      }
    } catch (e) {
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
        createAdm,
        getAdmins,
        adminList,
        deleteAdmin,
        getMembers,
        memberList,
        updateUser,
        bandVisibility: data.bandVisibility,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { useAuth, AuthProvider }
