import { Color } from "@mui/material"

export interface IResource {
  id: number
  fieldName: string
  color: string
  instances: any[]
  title: string
  text?: string
}
