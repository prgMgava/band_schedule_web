
import { Box, Card, CardHeader, Divider, IconButton, CardContent, Button } from "@mui/material"
import { Add, ArrowBack } from "@mui/icons-material"
import { HeaderFinances } from "./HeaderFinances"
import { TableFinances } from "./TableFinances"
import { ChartFinances } from "./ChartFinances"
import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"
import { FilterFinances } from "./FilterFinances"


export const Finances = () => {
  const navigate = useNavigate()
  const [currentFilter, setCurrentFilter] = useState<Array<string>>(["mês"])

  return (
    <div style={{ padding: "8px", margin: "8px", position: "relative" }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/calendar')}> Voltar</Button>
      <CardHeader
        title="Minhas Finanças"
        style={{ padding: "8px 0" }}
      >
      </CardHeader>
      <FilterFinances setCurrentFilter={setCurrentFilter} />
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
        {/* <ChartFinances /> */}

        <TableFinances />

      </CardContent>
    </div>
  )
}