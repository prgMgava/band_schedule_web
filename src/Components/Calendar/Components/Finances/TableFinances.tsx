import * as React from "react"
import { styled } from "@mui/material/styles"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell, { tableCellClasses } from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import { useLabel } from "../../../../Provider/Label/Label"
import uuid from "react-uuid"
import { ICheckout } from "../../../../Types/checkout.type"
import { ArrowDownward } from "@mui/icons-material"
import { useCheckout } from "../../../../Provider/Checkout/Checkout"
import { Typography } from "@mui/material"

interface IDataTable {
    date: React.ReactNode
    type: React.ReactNode
    value: string
    owner: string
    band: string
    description: string
}

export const TableFinances = () => {
    //const { appointmentsFiltered } = useAppointment()
    const { labels } = useLabel()
    const { checkouts, currentDate } = useCheckout()
    const [rows, setRows] = React.useState<IDataTable[]>([])

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    React.useEffect(() => {
        const dataTable: IDataTable[] = checkouts?.map(checkout => {
            return createData(checkout)
        })

        setRows(dataTable)
    }, [checkouts])

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

    function createData(checkout: any) {
        return {
            type: (
                <>
                    <div style={{ transform: checkout.type == 1 ? "rotate(180deg)" : '', color: checkout.type == 1 ? "green" : "red" }}>{<ArrowDownward />}</div>
                </>
            ),
            value: "R$ " + Number(checkout.value).toFixed(2) || "--",
            date: (
                <>
                    <div>{new Date(checkout.date).toLocaleString().substring(0, 16).split(" ")[0]}</div>
                </>
            ),
            owner: checkout.owner || "--",
            description: checkout.description || "--",
            band: checkout.band?.name,
        }
    }

    return (
        <Paper sx={{ width: "100%", overflow: "hidden", marginTop: "16px" }} className="finances-table">
            <TableContainer component={Paper} sx={{ maxHeight: 650 }}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow style={{ textAlign: "center" }}>
                            <StyledTableCell style={{ textAlign: "center" }}>Tipo</StyledTableCell>
                            <StyledTableCell style={{ textAlign: "center" }}>Valor</StyledTableCell>
                            <StyledTableCell>Data</StyledTableCell>
                            <StyledTableCell>Responsável</StyledTableCell>
                            <StyledTableCell>Detalhes</StyledTableCell>
                            <StyledTableCell style={{ textAlign: "center" }}>Artista</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map(row => (
                            <StyledTableRow key={uuid()} sx={{ ":hover": { backdropFilter: "contrast(0.5)" } }}>
                                <StyledTableCell style={{ textAlign: "center" }}>{row.type}</StyledTableCell>
                                <StyledTableCell style={{ textAlign: "center" }}>{row.value}</StyledTableCell>
                                <StyledTableCell>{row.date}</StyledTableCell>
                                <StyledTableCell>{row.owner}</StyledTableCell>
                                <StyledTableCell title={row.description} >{row.description.substring(0, 200)}{row.description.length > 200 ?? '...'}</StyledTableCell>
                                <StyledTableCell>
                                    {row.band}
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    )
}
