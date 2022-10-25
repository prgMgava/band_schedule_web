import { Box, Card } from "@mui/material"
import React from "react"
import uuid from "react-uuid"
import { hexToRgb } from "../../../../Utils/colors"

const labels = JSON.parse(localStorage.getItem("@BandSchedule:labels") || "") || []

interface FilterProps {
  setCurrentPriority: React.Dispatch<React.SetStateAction<number>>
}

export const Filter = ({ setCurrentPriority }: FilterProps) => {
  return (
    <Box style={{ background: "transparent" }} mb={1} display={"flex"} gap={2} flexWrap={"wrap"} padding="0 4px">
      <Box
        component={"span"}
        key={uuid()}
        onClick={() => setCurrentPriority(0)}
        style={{ background: "white", padding: "2px 4px" }}
        boxShadow={1}
        borderRadius={1}
      >
        Todos
      </Box>
      {labels.map(label => {
        return (
          <Box
            component={"span"}
            key={uuid()}
            onClick={() => setCurrentPriority(label.id)}
            style={{ background: label.color, padding: "2px 4px" }}
            boxShadow={1}
            color={hexToRgb(label.color) > 120 ? "#000000" : "#ffffff"}
            borderRadius={1}
          >
            {label.title}
          </Box>
        )
      })}
    </Box>
  )
}
