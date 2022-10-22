import { Card, Box, Stack } from "@mui/material"
import React from "react"
import { AdminForm } from "../Components/Calendar/Components/Form/AdminForm"

export const Login = () => {
  return (
    <Stack justifyContent={"center"} height={"100vh"} alignItems="center">
      <Card style={{ maxWidth: "500px" }}>
        <AdminForm isSignup />
      </Card>
    </Stack>
  )
}
