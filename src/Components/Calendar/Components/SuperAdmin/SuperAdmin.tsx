import { Box, Button, Divider } from "@mui/material"
import React, { useState } from "react"
import { useAuth } from "../../../../Provider/Auth/Auth"
import { AdminForm } from "../Form/AdminForm"
import { SuperAdminForm } from "../Form/SuperAdminForm"

interface SuperAdminFormProps {
  toggleDrawer: () => void
}

export const SuperAdmin = ({ toggleDrawer }: SuperAdminFormProps) => {
  const { superAdmin } = useAuth()
  const [openForm, setOpenForm] = useState(false)

  const handleForm = () => {
    setOpenForm(old => !old)
  }
  return (
    <Box>
      {superAdmin && (
        <>
          <Button onClick={handleForm}>{openForm ? "voltar" : "Atualizar meus dados"}</Button>
          <Divider />
        </>
      )}
      {!openForm && superAdmin ? (
        <SuperAdminForm toggleDrawer={toggleDrawer} />
      ) : (
        <AdminForm toggleDrawer={toggleDrawer} isUpdating></AdminForm>
      )}
    </Box>
  )
}
