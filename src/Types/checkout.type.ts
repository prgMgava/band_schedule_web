export interface ICheckout {
    id: number
    value: number
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