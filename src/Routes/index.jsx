import { Routes as Switch, Route, Navigate } from "react-router-dom"
import { Demo } from "../Components/Calendar/Calendar"
import React from "react"
import { useAuth } from "../Provider/Auth/Auth"
import { Login } from "../Pages/Login"

export const Routes = () => {
  const { accessToken } = useAuth()
  return (
    <Switch>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<div>Signup</div>} />
      <Route path="/calendar" element={accessToken ? <Demo /> : <Navigate to={"/"}></Navigate>} />
    </Switch>
  )
}

export default Routes
