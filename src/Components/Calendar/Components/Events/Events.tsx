import React from "react"
import { Card, CardHeader, Divider } from "@mui/material"
import { EventTable } from "./EventTable"
import { EventFilter } from "./EventFilter"

export const Events = () => {
  return (
    <Card style={{ padding: "16px", margin: "64px 16px", position: "relative" }}>
      <CardHeader title="Shrimp and Chorizo Paella" subheader="September 14, 2016">
        Filtros
      </CardHeader>
      <EventFilter />
      <Divider variant="middle" style={{ marginBottom: "10px" }} />
      <EventTable />
    </Card>
  )
}
