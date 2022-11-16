import * as React from "react"
import { styled } from "@mui/material/styles"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell, { tableCellClasses } from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import { useAppointment } from "../../../../Provider/Appointment/Appointment"
import { IAppointments } from "../../../../Types/appointments.type"
import { useLabel } from "../../../../Provider/Label/Label"
import uuid from "react-uuid"

interface IDataTable {
  date: React.ReactNode
  createAt: React.ReactNode
  band: string
  address: string
  title: string
  idLabel: number
  observations: string
}

export const EventTable = () => {
  const { appointmentsFiltered } = useAppointment()
  const { labels } = useLabel()
  const [rows, setRows] = React.useState<IDataTable[]>([])

  React.useEffect(() => {
    const dataTable: IDataTable[] = appointmentsFiltered.map(appointment => {
      return createData(appointment)
    })

    setRows(dataTable)
  }, [appointmentsFiltered])

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }))

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }))

  function createData(appointment: IAppointments) {
    return {
      date: (
        <>
          <div>{new Date(appointment.start_date).toLocaleString().substring(0, 16).split(" ")[0]}</div>
          <div>{new Date(appointment.start_date).toLocaleString().substring(0, 16).split(" ")[1]}</div>
        </>
      ),
      createAt: (
        <>
          <div>{new Date(appointment.createdAt).toLocaleString().substring(0, 16).split(" ")[0]}</div>
          <div>{new Date(appointment.createdAt).toLocaleString().substring(0, 16).split(" ")[1]}</div>
        </>
      ),
      band: appointment.band?.name || "--",
      address: appointment.city || appointment.state ? `${appointment.city || ""} / ${appointment.state || ""}` : "--",
      title: appointment.title || "--",
      idLabel: appointment.id_label,
      observations: appointment.observations || "--",
    }
  }

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer component={Paper} sx={{ maxHeight: 650 }}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow style={{ textAlign: "center" }}>
              <StyledTableCell style={{ textAlign: "center" }}>Data</StyledTableCell>
              <StyledTableCell style={{ textAlign: "center" }}>Criado em</StyledTableCell>
              <StyledTableCell>Artista</StyledTableCell>
              <StyledTableCell>Cidade/Estado</StyledTableCell>
              <StyledTableCell>Observação</StyledTableCell>
              <StyledTableCell>Destaque</StyledTableCell>
              <StyledTableCell style={{ textAlign: "center" }}>Categoria</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <StyledTableRow key={uuid()} sx={{ ":hover": { backdropFilter: "contrast(0.5)" } }}>
                <StyledTableCell style={{ textAlign: "center" }}>{row.date}</StyledTableCell>
                <StyledTableCell style={{ textAlign: "center" }}>{row.createAt}</StyledTableCell>
                <StyledTableCell>{row.band}</StyledTableCell>
                <StyledTableCell>{row.address}</StyledTableCell>
                <StyledTableCell>{row.observations}</StyledTableCell>
                <StyledTableCell>{row.title}</StyledTableCell>
                <StyledTableCell
                  style={{
                    background: labels.find(label => label.id == row.idLabel)?.color || "#FFF",
                    textAlign: "center",
                  }}
                >
                  <b>{labels.find(label => label.id == row.idLabel)?.title || ""}</b>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}
