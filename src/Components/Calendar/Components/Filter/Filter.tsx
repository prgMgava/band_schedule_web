import { Box, Button, Card, Dialog, Drawer, Modal, Stack } from "@mui/material"
import React, { useState } from "react"
import uuid from "react-uuid"
import { useLabel } from "../../../../Provider/Label/Label"
import { hexToRgb } from "../../../../Utils/colors"
const local = localStorage.getItem("@BandSchedule:labels") || "[]"
const labels = JSON.parse(local) || []

interface FilterProps {
  setCurrentPriority: React.Dispatch<React.SetStateAction<number>>
}

export const Filter = ({ setCurrentPriority }: FilterProps) => {
  const firstTime = localStorage.getItem("@BandSchedule:first_time") || ""
  const [openModal, setOpenModal] = useState(!firstTime)
  const { labels: labelsProvider } = useLabel()
  const handleClose = () => {
    window.location.reload()
    setOpenModal(false)
    localStorage.setItem("@BandSchedule:first_time", "true")
  }

  return (
    <>
      <Box
        style={{ borderBottom: "1px solid #000", marginBottom: "8px", background: "gray" }}
        display="flex"
        gap={2}
        justifyContent={"center"}
        alignItems="center"
        pt={"8px"}
        color="#fff"
      >
        <Box pb="6px">Todos artistas</Box>
        <Box pb="6px">Novo Evento</Box>
        <Box pb="6px">Eventos</Box>
        <Box pb="6px">Artistas</Box>
      </Box>

      <Box style={{ background: "transparent" }} display={"flex"} flexWrap={"wrap"} gap={2} padding="0 4px">
        <Box
          onClick={() => setCurrentPriority(0)}
          display={"flex"}
          gap="5px"
          style={{ height: "min-content", width: "130px", cursor: "pointer" }}
        >
          <Box
            key={uuid()}
            style={{ background: "white", padding: "2px 4px", height: "15px", cursor: "pointer", width: "15px" }}
            boxShadow={1}
            border={"1px #000 solid"}
            display="inline-block"
          ></Box>
          <span style={{ lineHeight: "22px", lineBreak: "anywhere", fontSize: "12px" }}>TODOS</span>
        </Box>
        {labelsProvider.map(label => {
          if (!label.is_deleted) {
            return (
              <Box
                onClick={() => setCurrentPriority(label?.id)}
                display={"flex"}
                gap="5px"
                key={uuid()}
                style={{ height: "min-content", width: "130px", cursor: "pointer" }}
              >
                <Box
                  style={{
                    background: label.color,
                    padding: "2px 4px",
                    height: "15px",

                    width: "15px",
                  }}
                  boxShadow={1}
                  color={hexToRgb(label.color) > 120 ? "#000000" : "#ffffff"}
                  display="inline-block"
                  border={"1px #000 solid"}
                ></Box>
                <span style={{ lineHeight: "22px", lineBreak: "anywhere", fontSize: "12px" }}>
                  {label.title?.toUpperCase()}
                </span>
              </Box>
            )
          }
          return <></>
        })}
        <Dialog onClose={handleClose} open={openModal}>
          <Card style={{ padding: "8px", display: "flex", flexDirection: "column" }}>
            <Stack>
              <Box component={"span"} key={uuid()} onClick={() => window.location.reload()} borderRadius={1}>
                <b>Seja bem vindo.</b>
                <br />
                <br /> Hum vi que é primeira vez que você esta acessando ou você acabou de logar nossa agenda por este
                dispositivo.
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
