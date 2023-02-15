
import { Box, Card, CardHeader, Divider, IconButton, CardContent } from "@mui/material"
import { Add } from "@mui/icons-material"
import { HeaderFinances } from "./HeaderFinances"
import { TableFinances } from "./TableFinances"
import { ChartFinances } from "./ChartFinances"
import React from 'react'

export const Finances = () => {
  return (
    <Card style={{ padding: "16px", margin: "64px 16px", position: "relative" }}>
      <CardHeader
        title="Minhas Finanças"
      >
        Filtros
      </CardHeader>
      <Divider variant="middle" style={{ margin: "10px 0" }} />
      <Box
        position={"absolute"}
        top={0}
        right={10}
        onClick={() => {
          // handleCloseModal()
          // setOpenDrawer(true)
        }}
      >
        <IconButton color="primary" component="label">
          <Add /> <small style={{ fontSize: "10px" }}>Registrar entrada/saída</small>
        </IconButton>
      </Box>
      <CardContent style={{}}>
        <HeaderFinances />
        <ChartFinances />

        <TableFinances />

      </CardContent>
    </Card>
  )
}