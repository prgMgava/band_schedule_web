export interface ICheckout {
    id: number
    value: string
    type: number
    date: string
    createdAt: Date
    updatedAt: Date
    id_band: number
    owner: string
    description: string
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

export interface ICheckoutFields {
    value: number
    type: number
    description: string
    date: string
    owner: string
    id_band: number
}