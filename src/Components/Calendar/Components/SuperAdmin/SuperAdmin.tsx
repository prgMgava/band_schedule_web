import { Close } from "@mui/icons-material"
import { Box, Divider, Drawer, IconButton } from "@mui/material"
import React, { useState } from "react"
import { SuperAdminForm } from "../Form/SuperAdminForm"
export const SuperAdmin = () => {
  return (
    <Box>
      <Box>Meus dados</Box>
      <Divider />
      <SuperAdminForm />
    </Box>
  )
}
