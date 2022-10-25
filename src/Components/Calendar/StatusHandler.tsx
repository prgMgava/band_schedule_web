import * as React from "react"

import { Button, Card, Grid, Typography } from "@mui/material"

import { toast } from "react-toastify"
import { useMobile } from "../../Provider/Theme/Mobile"
import { useAppointment } from "../../Provider/Appointment/Appointment"

interface StatusProps {
  toggleDrawer: () => void
}

export const StatusHandler = ({ toggleDrawer }: StatusProps) => {
  const { mobile } = useMobile()
  const { updateAppointmentStatus } = useAppointment()

  const handlingStatus = async () => {
    const response = await updateAppointmentStatus()
    toast[response.success ? "success" : "error"](response.message)
    if (response.success) {
      toggleDrawer()
    }
  }

  return (
    <Grid padding={mobile ? "" : 8}>
      <Card style={{ maxWidth: 300, padding: 32, display: "flex", flexDirection: "column", gap: 16 }}>
        <Typography>
          Esta ação vai atualizar todos os compromissos que ja foram realizados (em relação com a data atual) de
          <b> Agendado</b> para <b>Concluído</b>
        </Typography>
        <Button variant="contained" style={{ margin: "0 auto" }} onClick={handlingStatus}>
          Atualizar
        </Button>
      </Card>
    </Grid>
  )
}
