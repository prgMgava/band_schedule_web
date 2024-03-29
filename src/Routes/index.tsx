import { Routes as Switch, Route, Navigate } from "react-router-dom"
import { Demo } from "../Components/Calendar/Calendar"
import React, { lazy, Suspense } from "react"
import { useAuth } from "../Provider/Auth/Auth"
import { Loader } from "../Components/Loader/Loader"
const Login = lazy(() => import("../Pages/Login"))
const Signup = lazy(() => import("../Pages/Signup"))
const LandingPage = lazy(() => import("../Pages/LandingPage"))
const FinancesPage = lazy(() => import("../Pages/FinancesPage"))

export const Routes = () => {
  const { accessToken, adm } = useAuth()
  return (
    <Suspense fallback={<Loader />}>
      <Switch>
        <Route path="/" element={<Navigate to={"/tanamedida"} />} />
        <Route path="/agenda" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/calendar" element={accessToken ? <Demo /> : <Navigate to={"/agenda"}></Navigate>} />
        <Route path="/tanamedida" element={<LandingPage />} />
        <Route path="/calendar/financas" element={<FinancesPage />} />
      </Switch>
    </Suspense>
  )
}

export default Routes
