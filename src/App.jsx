import { ToastContainer } from "react-toastify"
import React from "react"
import "react-toastify/dist/ReactToastify.css"
import { Stack } from "@mui/material"
import "./App.css"
import Routes from "./Routes"
export const App = () => {
  return (
    <Stack bg="#0D1F35">
      <Routes />
      <ToastContainer />
    </Stack>
  )
}
