import { Routes as Switch, Route, Navigate } from "react-router-dom"
import { Demo } from "../Components/Calendar/Calendar"
import React from "react"
import { useAuth } from "../Provider/Auth/Auth"
import { Login } from "../Pages/Login"
import { Signup } from "../Pages/Signup"
import { LandingPage } from "../Pages/LandingPage"

export const Routes = () => {
  const { accessToken } = useAuth()
  return (
    <Switch>
      <Route path="/agenda" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/calendar" element={accessToken ? <Demo /> : <Navigate to={"/agenda"}></Navigate>} />
      <Route path="/tanamedida" element={<LandingPage />} />
    </Switch>
  )
}

export default Routes
