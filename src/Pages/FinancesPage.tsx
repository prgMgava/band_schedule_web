import { Stack } from "@mui/material"
import React, { useEffect } from "react"

import { useAuth } from "../Provider/Auth/Auth"
import { useNavigate } from "react-router-dom"
import { Finances } from '../Components/Calendar/Components/Finances/Finances'
import { Header } from "../Components/Calendar/Components/Header/Header"



const FinancesPage = () => {
  const { accessToken } = useAuth()
  const navigate = useNavigate()

  return (
    <div>
      <Header hiddenFilter />
      <Finances />
    </div>
  )
}

export default FinancesPage
