import * as React from "react"
import { styled } from "@mui/material/styles"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell, { tableCellClasses } from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"

export const EventTable = () => {
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

  function createData(date: string, createAt: string, address: string, title: string, label: string, band: string) {
    return { date, createAt, band, address, title, label }
  }

  const rows = [
    createData("01/11/2002 17:57", "01/11/2002 17:57", "Vitoria/ES", "Meu vento legal", "OUTROS", "banda dejavu"),
    createData("01/11/2002 17:57", "01/11/2002 17:57", "Vitoria/ES", "Meu vento legal", "OUTROS", "banda dejavu"),
    createData("01/11/2002 17:57", "01/11/2002 17:57", "Vitoria/ES", "Meu vento legal", "OUTROS", "banda dejavu"),
    createData("01/11/2002 17:57", "01/11/2002 17:57", "Vitoria/ES", "Meu vento legal", "OUTROS", "banda dejavu"),
    createData("01/11/2002 17:57", "01/11/2002 17:57", "Vitoria/ES", "Meu vento legal", "OUTROS", "banda dejavu"),
    createData("01/11/2002 17:57", "01/11/2002 17:57", "Vitoria/ES", "Meu vento legal", "OUTROS", "banda dejavu"),
  ]

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
              <StyledTableCell>{row.label}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
