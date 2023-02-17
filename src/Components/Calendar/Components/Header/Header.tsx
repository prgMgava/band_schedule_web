import { Close, ColorLens, EventAvailable, Logout, MusicNote, PersonAddAlt, SyncOutlined, AttachMoney } from "@mui/icons-material"
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
import { useAuth } from "../../../../Provider/Auth/Auth"
import { LabelForm } from "../Form/LabelForm"
import { Filter } from "../Filter/Filter"
import { StatusHandler } from "../../StatusHandler"
import { useMobile } from "../../../../Provider/Theme/Mobile"
import { useBand } from "../../../../Provider/Band/Band"
import { useNavigate } from "react-router-dom"
interface HeaderProps {
  setCurrentPriority?: React.Dispatch<React.SetStateAction<number>>
  hiddenFilter: boolean
}

export const Header = ({ setCurrentPriority }: HeaderProps) => {
  const { signOut, adm, superAdmin, userData } = useAuth()
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [currentForm, setCurrentForm] = useState("")
  const { mobile } = useMobile()
  const open = Boolean(anchorEl)
  const { currentBand } = useBand()
  const navigate = useNavigate()

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
    admin: <AdminForm toggleDrawer={toggleDrawer} isUpdating={!superAdmin} />,
    superAdmin: <SuperAdmin toggleDrawer={toggleDrawer} />,
    label: <LabelForm toggleDrawer={toggleDrawer} />,
    status: <StatusHandler toggleDrawer={toggleDrawer} />,
    musician: <AdminForm toggleDrawer={toggleDrawer} isSignup />,
  }
  return (
    <div>
      <Drawer anchor={"left"} open={openDrawer} onClose={toggleDrawer} style={{ padding: "0 4px 0 4px" }}>
        <IconButton onClick={toggleDrawer} size="medium" style={{ width: "25px", marginLeft: "8px" }}>
          <Close alignmentBaseline="baseline"></Close>
        </IconButton>
        <Divider />
        {forms[currentForm]}
        <Divider />
      </Drawer>
      <Box width={"100%"} height={"80px"} boxShadow={2} bgcolor={"#000"}>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Box display={"flex"}>
            {!mobile ? (
              <>
                <Box
                  height="80px"
                  width={"300px"}
                  justifySelf={"flex-start"}
                  display="flex"
                  bgcolor={"#FFF"}
                  alignItems="center"
                >
                  <img
                    src={require("../../../../assets/low-logo.webp")}
                    data-src={require("../../../../assets/images/logo.png")}
                    alt="logo"
                    style={{ paddingLeft: "24px", height: "90%", width: "75%" }}
                    className="lazyload item-image img-absolute blur-up"
                    data-sizes="auto"
                  />
                </Box>
                <Box color="white" alignSelf={"center"} ml={2} fontSize="32px">
                  {currentBand?.toUpperCase()}
                </Box>
              </>
            ) : (
              <Box p="16px">
                <Box height="30px" width={"50px"} justifySelf={"flex-start"} display="flex" alignItems="center">
                  <img
                    className="lazyload item-image img-absolute blur-up"
                    src={require("../../../../assets/low-logo.webp")}
                    data-src={require("../../../../assets/images/logo.png")}
                    alt="logo"
                    style={{ height: "90%" }}
                  />
                </Box>
                <Box color="white" fontSize="12px">
                  {currentBand?.toUpperCase()}
                </Box>
              </Box>
            )}
          </Box>
          <Stack width={"75px"} height={"75px"} alignItems="center" justifyContent={"center"}>
            <>
              <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }} justifySelf="end">
                <Tooltip title="Account settings">
                  <IconButton
                    onClick={handleClick}
                    size="small"
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
                    <Avatar /> {userData.username}
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
                    disabled={!adm}
                  >
                    <ListItemIcon>
                      <EventAvailable fontSize="small" />
                    </ListItemIcon>
                    Adicionar evento
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
                      setCurrentForm(superAdmin ? "admin" : "musician")
                      setOpenDrawer(true)
                    }}
                    disabled={!adm}
                  >
                    <ListItemIcon>
                      <PersonAddAlt fontSize="small" />
                    </ListItemIcon>
                    {superAdmin ? "Adicionar usuário" : "Adicionar músico"}
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
                    Adicionar categoria
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setCurrentForm("status")
                      setOpenDrawer(true)
                    }}
                    disabled={!adm}
                  >
                    <ListItemIcon>
                      <SyncOutlined fontSize="small" />
                    </ListItemIcon>
                    Atualizar eventos
                  </MenuItem>
                  <MenuItem onClick={() => navigate('/calendar/financas')} disabled={!adm}>
                    <ListItemIcon>
                      <AttachMoney fontSize="small" />
                    </ListItemIcon>
                    Finanças
                  </MenuItem>
                  <MenuItem onClick={() => signOut()}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </Box>
            </>
          </Stack>
        </Stack>
      </Box>
      {!!setCurrentPriority && (
        <Filter setCurrentPriority={setCurrentPriority} />
      )}
    </div>
  )
}
