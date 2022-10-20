export interface IAppointments {
  id: number
  title: string
  cellphone: string
  date: Date
  street: string
  district: string
  state: string
  city: string
  place: string
  address_number: string
  address_complement: string
  status: "agendado" | "concluido" | "cancelado" | "reagendado"
  createdAt: Date
  updatedAt: Date
  id_band: number
  startDate: string
  endDate: string
  band: {
    id: number
    name: string
    email: string
    cellphone: string
    status: boolean
    owner: number
  }
}
