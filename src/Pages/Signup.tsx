import { Card, Stack } from "@mui/material"
import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AdminForm } from "../Components/Calendar/Components/Form/AdminForm"
import { useAuth } from "../Provider/Auth/Auth"

const Signup = () => {
  const { accessToken } = useAuth()
  const navigate = useNavigate()
  useEffect(() => {
    if (accessToken) {
      navigate("/calendar")
    }
  }, [accessToken])
  return (
    <Stack justifyContent={"center"} height={"100vh"} alignItems="center">
      <Card style={{ maxWidth: "500px" }}>
        <AdminForm isSignup />
      </Card>
    </Stack>
  )
}

export default Signup
