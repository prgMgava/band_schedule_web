import { Close } from "@mui/icons-material"
import { Box, Button, Card, Dialog, Divider, Drawer, IconButton, Modal, Stack, Typography } from "@mui/material"
import React, { useState } from "react"
import uuid from "react-uuid"
import { useAppointment } from "../../../../Provider/Appointment/Appointment"
import { useBand } from "../../../../Provider/Band/Band"
import { useLabel } from "../../../../Provider/Label/Label"
import { useMobile } from "../../../../Provider/Theme/Mobile"
import { hexToRgb } from "../../../../Utils/colors"
import { Events } from "../Events/Events"
import { AppointmentForm } from "../Form/AppointmentForm"
import { FilterByBand } from "./FilterByBand"

interface FilterProps {
  setCurrentPriority: React.Dispatch<React.SetStateAction<number>>
}

export const Filter = ({ setCurrentPriority }: FilterProps) => {
  const firstTime = localStorage.getItem("@BandSchedule:first_time") || ""
  const [openModal, setOpenModal] = useState(!firstTime)
  const { labels: labelsProvider, setCurrentLabel, currentLabel } = useLabel()
  const [openDrawer, setOpenDrawer] = useState(false)
  const { getAppointments, currentDate } = useAppointment()
  const { setCurrentBand } = useBand()
  const [isOpen, setIsOpen] = useState(false)
  const { mobile } = useMobile()
  const handleClose = () => {
    window.location.reload()
    setOpenModal(false)
    localStorage.setItem("@BandSchedule:first_time", "true")
  }

  const [open, setOpen] = React.useState(isOpen)
  const handleOpen = () => setOpen(true)
  const handleCloseModal = () => setOpen(false)

  const data = {
    appointmentData: {
      endDate: new Date(),
      startDate: new Date(),
    },
  }

  const toggleDrawer = () => {
    setOpenDrawer(old => !old)
  }

  const filterByLabel = (idLabel: number) => {
    setCurrentPriority(idLabel)
    setCurrentLabel(idLabel)
  }

  return (
    <>
      <Drawer anchor={"left"} open={openDrawer} onClose={toggleDrawer} style={{ padding: "0 4px 0 4px" }}>
        <IconButton onClick={toggleDrawer} size="medium" style={{ width: "25px", marginLeft: "8px" }}>
          <Close alignmentBaseline="baseline"></Close>
        </IconButton>
        <Divider />
        <AppointmentForm data={data} fromMenu={true} />
        <Divider />
      </Drawer>
      <Box
        style={{ borderBottom: "1px solid #000", marginBottom: "8px", background: "gray" }}
        display="flex"
        gap={1}
        justifyContent={"center"}
        alignItems="center"
        pt={"8px"}
        color="#fff"
        flexDirection={mobile ? "column" : "row"}
      >
        <Button
          id="basic-button"
          aria-haspopup="true"
          color="inherit"
          onClick={() => {
            getAppointments(currentDate)
            setCurrentBand("")
          }}
        >
          Todos os artistas
        </Button>
        <Button id="basic-button" aria-haspopup="true" color="inherit" onClick={() => setOpenDrawer(true)}>
          Novo Evento
        </Button>
        <Button onClick={handleOpen} color="inherit">
          Eventos
        </Button>
        <Modal
          open={open}
          onClose={handleCloseModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Events setOpenDrawer={setOpenDrawer} handleCloseModal={handleCloseModal} />
        </Modal>
        <FilterByBand />
      </Box>

      <Box style={{ background: "transparent" }} display={"flex"} flexWrap={"wrap"} gap={1} padding="0 4px">
        <Box
          onClick={() => filterByLabel(0)}
          display={"flex"}
          gap="5px"
          style={{ height: "min-content", width: "130px", cursor: "pointer" }}
        >
          <Box
            key={uuid()}
            style={{ background: "white", padding: "2px 4px", height: "10px", cursor: "pointer", width: "10px" }}
            boxShadow={1}
            border={"1px #000 solid"}
            display="inline-block"
          ></Box>
          <span
            style={{
              lineHeight: "22px",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
              fontSize: "12px",
              borderBottom: currentLabel == 0 ? "3px solid #000" : "3px solid transparent",
            }}
          >
            TODOS
          </span>
        </Box>
        {labelsProvider.map(label => {
          if (!label.is_deleted) {
            return (
              <Box
                onClick={() => filterByLabel(label?.id)}
                display={"flex"}
                gap="2px"
                key={uuid()}
                style={{ height: "min-content", width: "130px", cursor: "pointer" }}
              >
                <Box
                  style={{
                    background: label.color,
                    padding: "2px 4px",
                    height: "10px",

                    width: "10px",
                  }}
                  boxShadow={1}
                  color={hexToRgb(label.color) > 120 ? "#000000" : "#ffffff"}
                  display="inline-block"
                  border={"1px #000 solid"}
                ></Box>
                <span
                  style={{
                    lineHeight: "22px",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    fontSize: "12px",
                    borderBottom: currentLabel == label.id ? "3px solid #000" : "3px solid transparent",
                  }}
                  title={label.title}
                >
                  {label.title?.toUpperCase()}
                </span>
              </Box>
            )
          }
          return <div key={uuid()}></div>
        })}
        <Dialog onClose={handleClose} open={openModal}>
          <Card style={{ padding: "8px", display: "flex", flexDirection: "column" }}>
            <Stack>
              <Box component={"span"} key={uuid()} onClick={() => window.location.reload()} borderRadius={1}>
                <b>Seja bem vindo.</b>
                <br />
                <br /> É primeira vez que você esta acessando ou você acabou de logar nossa agenda por este dispositivo.
                <br /> É só <b onClick={handleClose}>clicar</b> no botão abaixo que vamos buscar toas as informações
                para você!
              </Box>
            </Stack>
            <Button onClick={handleClose} variant={"contained"} style={{ marginTop: "32px" }}>
              Vamos lá!
            </Button>
          </Card>
        </Dialog>
      </Box>
    </>
  )
}
