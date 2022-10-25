import { Close, ColorLens, EventAvailable, Logout, MusicNote, PersonAddAlt } from "@mui/icons-material"
import {
  Box,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  ListItemIcon,
  Tooltip,
  IconButton,
  Typography,
  Drawer,
} from "@mui/material"
import { Stack } from "@mui/system"
import React, { useState } from "react"
import MenuIcon from "@mui/icons-material/Menu"
import { AppointmentForm } from "../Form/AppointmentForm"
import { BandForm } from "../Form/BandForm"
import { AdminForm } from "../Form/AdminForm"
import { SuperAdmin } from "../SuperAdmin/SuperAdmin"
import { useMobile } from "../../../../Provider/Theme/Mobile"
import { useAuth } from "../../../../Provider/Auth/Auth"
import { LabelForm } from "../Form/LabelForm"
import { Filter } from "../Filter/Filter"

interface HeaderProps {
  setCurrentPriority: React.Dispatch<React.SetStateAction<number>>
}

export const Header = ({ setCurrentPriority }: HeaderProps) => {
  const { signOut, adm, superAdmin, adminList, memberList, id } = useAuth()
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [currentForm, setCurrentForm] = useState("")
  const allUsers = [...adminList, ...memberList]
  const open = Boolean(anchorEl)
  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const [openDrawer, setOpenDrawer] = useState(false)

  const toggleDrawer = () => {
    setOpenDrawer(old => !old)
  }

  const data = {
    appointmentData: {
      endDate: new Date(),
      startDate: new Date(),
    },
  }

  const forms = {
    appointment: <AppointmentForm data={data} fromMenu={true} />,
    band: <BandForm toggleDrawer={toggleDrawer}></BandForm>,
    admin: <AdminForm toggleDrawer={toggleDrawer} />,
    superAdmin: <SuperAdmin toggleDrawer={toggleDrawer} />,
    label: <LabelForm toggleDrawer={toggleDrawer} />,
  }
  return (
    <>
      <Drawer anchor={"left"} open={openDrawer} onClose={toggleDrawer} style={{ padding: "0 4px 0 4px" }}>
        <IconButton onClick={toggleDrawer} size="medium" style={{ width: "25px", marginLeft: "8px" }}>
          <Close alignmentBaseline="baseline"></Close>
        </IconButton>
        <Divider />
        {forms[currentForm]}
        <Divider />
      </Drawer>
      <Box width={"100%"} height={"75px"} boxShadow={2} bgcolor={"#0d1f35"} mb={1}>
        <Stack direction={"row"} width={"100vw"} justifyContent={"space-between"}>
          <Box bgcolor={"green"} height="75px" width={"75px"} justifySelf={"flex-start"}>
            LOGO
          </Box>
          <Stack width={"75px"} height={"75px"} alignItems="center" justifyContent={"center"}>
            <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }} justifySelf="end">
              <Tooltip title="Account settings">
                <IconButton
                  onClick={handleClick}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={open ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                >
                  <MenuIcon sx={{ width: 32, height: 32, color: "white" }}></MenuIcon>
                </IconButton>
              </Tooltip>
            </Box>
            <Box>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&:before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem
                  onClick={() => {
                    setCurrentForm("superAdmin")
                    setOpenDrawer(true)
                  }}
                >
                  <Avatar />{" "}
                  {allUsers.find(user => user.id == (localStorage.getItem("@BandSchedule:id") || 0))?.username ||
                    "Meu Perfil"}
                </MenuItem>
                <Divider />
                <Typography component="h6" fontSize={"10px"} pl={1}>
                  Acesso só para administradores
                </Typography>
                <MenuItem
                  onClick={() => {
                    setCurrentForm("appointment")
                    setOpenDrawer(true)
                  }}
                  disabled={!adm || !superAdmin}
                >
                  <ListItemIcon>
                    <EventAvailable fontSize="small" />
                  </ListItemIcon>
                  Adicionar compromisso
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setCurrentForm("band")
                    setOpenDrawer(true)
                  }}
                  disabled={!adm}
                >
                  <ListItemIcon>
                    <MusicNote fontSize="small" />
                  </ListItemIcon>
                  Adicionar/Editar banda
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setCurrentForm("admin")
                    setOpenDrawer(true)
                  }}
                  disabled={!superAdmin}
                >
                  <ListItemIcon>
                    <PersonAddAlt fontSize="small" />
                  </ListItemIcon>
                  Adicionar administrador
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setCurrentForm("label")
                    setOpenDrawer(true)
                  }}
                  disabled={!superAdmin}
                >
                  <ListItemIcon>
                    <ColorLens fontSize="small" />
                  </ListItemIcon>
                  Adicionar label
                </MenuItem>
                <MenuItem onClick={() => signOut()}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </Stack>
        </Stack>
      </Box>
      <Filter setCurrentPriority={setCurrentPriority} />
    </>
  )
}
