import { ToastContainer } from "react-toastify"
import React from "react"
import "react-toastify/dist/ReactToastify.css"
import { Demo } from "./Components/Calendar/Calendar"
import { Box, useMediaQuery, useTheme, CardHeader, Stack } from "@mui/material"
import "./App.css"

import { Header } from "./Components/Calendar/Components/Header/Header"
import Routes from "./Routes"
export const App = () => {
  return (
    <Stack bg="#0D1F35">
      <Routes />
      <ToastContainer />
    </Stack>
  )
}
