import { Close } from "@mui/icons-material"
import { Box, Button, Divider, Drawer, IconButton } from "@mui/material"
import React, { useState } from "react"
import { useAuth } from "../../../../Provider/Auth/Auth"
import { AdminForm } from "../Form/AdminForm"
import { SuperAdminForm } from "../Form/SuperAdminForm"
export const SuperAdmin = ({ toggleDrawer }: any) => {
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
        <AdminForm setOpenForm={setOpenForm} isUpdating></AdminForm>
      )}
    </Box>
  )
}
