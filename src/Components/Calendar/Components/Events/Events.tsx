import React, { useState } from "react"
import { Box, Card, CardHeader, Divider, Drawer, IconButton } from "@mui/material"
import { EventTable } from "./EventTable"
import { EventFilter } from "./EventFilter"
import { Add } from "@mui/icons-material"

interface EventsProp {
  setOpenDrawer: (boolean) => void
  handleCloseModal: () => void
}

export const Events = ({ setOpenDrawer, handleCloseModal }: EventsProp) => {
  const [currentFilter, setCurrentFilter] = useState<Array<string>>([])

  return (
    <Card style={{ padding: "16px", margin: "64px 16px", position: "relative" }}>
      <CardHeader
        title="Meus eventos"
        subheader={`Filtrado por: ${currentFilter.length ? currentFilter.join(", ") : ""}`}
      >
        Filtros
      </CardHeader>
      <EventFilter setCurrentFilter={setCurrentFilter} />
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
