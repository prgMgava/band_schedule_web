import { Routes as Switch, Route, Navigate } from "react-router-dom"
import { Demo } from "../Components/Calendar/Calendar"
import React, { lazy, Suspense } from "react"
import { useAuth } from "../Provider/Auth/Auth"
import { Loader } from "../Components/Loader/Loader"
import FinancesPage from "../Pages/FinancesPage"
const Login = lazy(() => import("../Pages/Login"))
const Signup = lazy(() => import("../Pages/Signup"))
const LandingPage = lazy(() => import("../Pages/LandingPage"))

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
        <Route path="/calendar/financas" element={adm ? <FinancesPage /> : <Navigate to={"/agenda"}></Navigate>} />
      </Switch>
    </Suspense>
  )
}

export default Routes
