import React from "react"
import { Button, Menu, MenuItem } from "@mui/material"
import { ArrowDownwardOutlined, ArrowUpwardOutlined } from "@mui/icons-material"
import { useBand } from "../../../../Provider/Band/Band"
import uuid from "react-uuid"
import { IBand } from "../../../../Types/band.type"
import { useAppointment } from "../../../../Provider/Appointment/Appointment"
import { useMobile } from "../../../../Provider/Theme/Mobile"

export const FilterByBand = () => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const { myBands, setCurrentBand } = useBand()
  const { mobile } = useMobile()
  const { currentDate, getAppointmentsByBand } = useAppointment()
  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = (band = {} as IBand) => {
    if (band.id) {
      setCurrentBand(band.name)
      getAppointmentsByBand(currentDate, band.id)
    }
    setAnchorEl(null)
  }
  return (
    <>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        endIcon={
          open ? (
            <ArrowUpwardOutlined style={{ fontSize: mobile ? "8px" : "12px" }} />
          ) : (
            <ArrowDownwardOutlined style={{ fontSize: mobile ? "8px" : "12px" }} />
          )
        }
        color="inherit"
        style={{ fontSize: mobile ? "8px" : "12px" }}
      >
        Artistas
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => handleClose()}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {myBands.map(band => {
          return (
            !band.is_deleted && (
              <MenuItem onClick={() => handleClose(band)} key={uuid()}>
                {band.name}
              </MenuItem>
            )
          )
        })}
      </Menu>
    </>
  )
}
