import { ToastContainer } from "react-toastify"
import React from "react"
import "react-toastify/dist/ReactToastify.css"
import { Demo } from "./Components/Calendar/Calendar"
import { Box, useMediaQuery, useTheme, CardHeader } from "@mui/material"
import "./App.css"

import { Header } from "./Components/Calendar/Components/Header/Header"
export const App = () => {
  return (
    <Box bg="#0D1F35">
      <Demo />
      <ToastContainer />
    </Box>
  )
}
