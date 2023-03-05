import { IAppointments } from "./appointments.type"
import { IBand } from "./band.type"
import { ICreditor } from "./creditor.type"

export interface ICheckout {
    id: number
    value: string | number
    type: number
    date: Date | string
    createdAt: Date
    updatedAt: Date
    id_band: number
    owner: string
    description: string
    creditor: ICreditor
    id_appointment: number
    band: IBand
    appointment: IAppointments
    is_deleted: boolean
}

export interface ICheckoutFields extends ICheckout {
    appointment_title: string
    appointment_date: string
    id_creditor: number
}
