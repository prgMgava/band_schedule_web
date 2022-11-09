import React, { useState } from "react"
import { Box, Card, CardHeader, Divider, Drawer, IconButton } from "@mui/material"
import { EventTable } from "./EventTable"
import { EventFilter } from "./EventFilter"
import { Add, Close } from "@mui/icons-material"
import { AppointmentForm } from "../Form/AppointmentForm"

interface EventsProp {
  setOpenDrawer: (boolean) => void
  handleCloseModal: () => void
}

export const Events = ({ setOpenDrawer, handleCloseModal }: EventsProp) => {
  const data = {
    appointmentData: {
      endDate: new Date(),
      startDate: new Date(),
    },
  }

  return (
    <Card style={{ padding: "16px", margin: "64px 16px", position: "relative" }}>
      <CardHeader title="Shrimp and Chorizo Paella" subheader="September 14, 2016">
        Filtros
      </CardHeader>
      <EventFilter />
      <Divider variant="middle" style={{ margin: "10px 0" }} />
      <EventTable />
      <Box
        position={"absolute"}
        top={0}
        right={10}
        onClick={() => {
          handleCloseModal()
          setOpenDrawer(true)
        }}
      >
        <IconButton color="primary" component="label">
          <Add /> <small style={{ fontSize: "10px" }}>Adicionar Evento</small>
        </IconButton>
      </Box>
    </Card>
  )
}
