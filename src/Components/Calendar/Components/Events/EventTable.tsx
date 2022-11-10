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

interface IDataTable {
  date: string
  createAt: string
  band: string
  address: string
  title: string
  idLabel: number
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
      date: new Date(appointment.start_date).toLocaleString().substring(0, 16),
      createAt: new Date(appointment.createdAt).toLocaleString().substring(0, 16),
      band: appointment.band.name,
      address: `${appointment.city || ""} / ${appointment.state}`,
      title: appointment.title,
      idLabel: appointment.id_label,
    }
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Data</StyledTableCell>
            <StyledTableCell>Criado em</StyledTableCell>
            <StyledTableCell>Artista</StyledTableCell>
            <StyledTableCell>Cidade/Estado</StyledTableCell>
            <StyledTableCell>Destaque</StyledTableCell>
            <StyledTableCell>Categoria</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <StyledTableRow key={row.date} sx={{ ":hover": { backdropFilter: "contrast(0.5)" } }}>
              <StyledTableCell>{row.date}</StyledTableCell>
              <StyledTableCell>{row.createAt}</StyledTableCell>
              <StyledTableCell>{row.band}</StyledTableCell>
              <StyledTableCell>{row.address}</StyledTableCell>
              <StyledTableCell>{row.title}</StyledTableCell>
              <StyledTableCell style={{ background: labels.find(label => label.id == row.idLabel)?.color || "" }}>
                {labels.find(label => label.id == row.idLabel)?.title}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
