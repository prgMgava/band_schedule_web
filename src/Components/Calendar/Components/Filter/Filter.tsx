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
  const [openModal, setOpenModal] = useState(!labels.length)
  const { labels: labelsProvider } = useLabel()
  const handleClose = () => {
    window.location.reload()
    setOpenModal(false)
  }
  return (
    <Box
      style={{ background: "transparent", minHeight: 100 }}
      mb={1}
      display={"flex"}
      gap={2}
      flexWrap={"wrap"}
      padding="0 4px"
    >
      <Box
        component={"span"}
        key={uuid()}
        onClick={() => setCurrentPriority(0)}
        style={{ background: "white", padding: "2px 4px", height: "min-content", cursor: "pointer" }}
        boxShadow={1}
        borderRadius={1}
      >
        Todos
      </Box>
      {labelsProvider.map(label => {
        if (!label.is_deleted) {
          return (
            <Box
              component={"span"}
              key={uuid()}
              onClick={() => setCurrentPriority(label?.id)}
              style={{ background: label.color, padding: "2px 4px", height: "min-content", cursor: "pointer" }}
              boxShadow={1}
              color={hexToRgb(label.color) > 120 ? "#000000" : "#ffffff"}
              borderRadius={1}
            >
              {label.title}
            </Box>
          )
        }
        return <></>
      })}
      {true && (
        <Dialog onClose={handleClose} open={openModal}>
          <Card style={{ padding: "8px" }}>
            <Stack>
              <Box component={"span"} key={uuid()} onClick={() => window.location.reload()} borderRadius={1}>
                <b>Seja bem vindo.</b>
                <br />
                <br /> Hum vi que é primeira vez que esta acessando nossa agenda por este dispositivo.
                <br /> É só <b onClick={handleClose}>clicar</b> no botão abaixo que vamos buscar toas as informações
                para você!
              </Box>
            </Stack>
            <Button onClick={handleClose} variant={"contained"}>
              Vamos lá!
            </Button>
          </Card>
        </Dialog>
      )}
    </Box>
  )
}
