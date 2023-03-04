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
    id_creditor: number
    id_appointment: number
    band: {
        id: number
        name: string
        email: string
        cellphone: string
        status: boolean
        owner: number
    },
    is_deleted: boolean
}

export interface ICheckoutFields extends ICheckout {
    appointment_title: string
    appointment_date: string
}
