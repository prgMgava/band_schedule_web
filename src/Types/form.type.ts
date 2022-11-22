export interface IAppointmentFields {
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

export interface IBandFields {
  name: string
  cellphone: string
  email: string
  owner: number
}

export interface IAdminFields {
  username: string
  cellphone: string
  email: string
  password: string
  id_band?: number
  is_musician?: boolean
}

export interface ILoginFields {
  username: string
  password: string
}
