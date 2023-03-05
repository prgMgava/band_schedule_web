import { Box, CardHeader, Divider, IconButton, CardContent, Button, Drawer } from "@mui/material"
import { Add, ArrowBack, Close, Print } from "@mui/icons-material"
import { HeaderFinances } from "./HeaderFinances"
import { TableFinances } from "./TableFinances"
import { ChartFinances } from "./ChartFinances"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FilterFinances } from "./FilterFinances"
import { FinancesForm } from "../Form/FinancesForm"
import { ICheckout } from "../../../../Types/checkout.type"
import { Stack } from "@mui/system"
import { ReportForm } from "../Form/ReportForm"

export const Finances = () => {
  const navigate = useNavigate()
  const [currentFilter, setCurrentFilter] = useState<Array<string>>(["mês"])
  const [openDrawer, setOpenDrawer] = useState(false)

  const toggleDrawer = () => {
    setOpenDrawer(old => !old)
  }
  const [currentForm, setCurrentForm] = useState("")

  const forms = {
    checkout: <FinancesForm data={{} as ICheckout} toggleDrawer={toggleDrawer} />,
    report: <ReportForm toggleDrawer={toggleDrawer} />,
  }
  return (
    <div style={{ padding: "8px", margin: "8px", position: "relative" }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate("/calendar")}>
        {" "}
        Voltar
      </Button>
      <Stack direction="row">
        <CardHeader title="Minhas Finanças" style={{ padding: "8px 0" }}></CardHeader>
        <Box display={"flex"} alignItems={"center"}>
          <Print
            color="primary"
            style={{ cursor: "pointer", marginLeft: "6px" }}
            onClick={() => {
              setCurrentForm("report")
              setOpenDrawer(true)
            }}
          />
        </Box>
      </Stack>
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
        <IconButton
          color="primary"
          component="label"
          onClick={() => {
            setCurrentForm("checkout")
            setOpenDrawer(true)
          }}
        >
          <Add /> <small style={{ fontSize: "10px" }}>Registrar entrada/saída</small>
        </IconButton>
      </Box>
      <CardContent style={{}}>
        <HeaderFinances />
        <TableFinances />
        <ChartFinances />
      </CardContent>
      <Drawer anchor={"left"} open={openDrawer} onClose={toggleDrawer} style={{ padding: "0 4px 0 4px" }}>
        <IconButton onClick={toggleDrawer} size="medium" style={{ width: "25px", marginLeft: "8px" }}>
          <Close alignmentBaseline="baseline"></Close>
        </IconButton>
        <Divider />
        {forms[currentForm]}
        <Divider />
      </Drawer>
    </div>
  )
}
