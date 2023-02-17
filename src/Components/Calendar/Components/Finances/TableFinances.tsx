import React, { useState } from "react"
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
import { ArrowDownward, Close, Delete, EditOutlined } from "@mui/icons-material"
import { useCheckout } from "../../../../Provider/Checkout/Checkout"
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Drawer, IconButton, Modal, Slide, Typography } from "@mui/material"
import { TransitionProps } from "@mui/material/transitions"
import { toast } from "react-toastify"
import { FinancesForm } from '../Form/FinancesForm'

interface IDataTable {
    acoes: any
    date: React.ReactNode
    type: React.ReactNode
    value: string
    owner: string
    band: string
    description: string
    id: number
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});


export const TableFinances = () => {
    //const { appointmentsFiltered } = useAppointment()
    const { labels } = useLabel()
    const { checkouts, deleteCheckout } = useCheckout()
    const [rows, setRows] = React.useState<IDataTable[]>([])
    const [currentFinance, setCurrentFinance] = React.useState({} as ICheckout)
    const [openDrawer, setOpenDrawer] = useState(false)

    const toggleDrawer = () => {
        setOpenDrawer(old => !old)
    }
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [openModal, setOpenModal] = React.useState(false);
    const [deletedFinance, setDeletedFinance] = React.useState({} as ICheckout)
    const handleOpen = (finance: ICheckout) => {
        setOpenModal(true)
        setDeletedFinance(finance)
    };
    const handleCloseModal = () => setOpenModal(false);


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
            acoes:
                [
                    {
                        icon: <Delete fontSize="small" color="error" />,
                        action: (finance: ICheckout) => handleOpen(finance)
                    },
                    {
                        icon: <EditOutlined fontSize="small" style={{ marginLeft: "4px" }} color="primary" />,
                        action: (finance: ICheckout) => {
                            const checkoutEdited = checkouts.find(checkout => checkout.id == finance.id)
                            if (checkoutEdited) {
                                checkoutEdited?.id && setCurrentFinance(checkoutEdited)
                            }
                            toggleDrawer()
                        }
                    }
                ],
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
            id: checkout.id,
            id_band: checkout.band?.id
        }
    }

    const deleteFinance = async () => {
        const response = await deleteCheckout(deletedFinance.id, deletedFinance.id_band)
        toast.error(response.message)
        handleCloseModal()
    }

    return (
        <Paper sx={{ width: "100%", overflow: "hidden", marginTop: "16px" }} className="finances-table">
            <TableContainer component={Paper} sx={{ maxHeight: 650 }}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow style={{ textAlign: "center" }}>
                            <StyledTableCell style={{ textAlign: "center" }}>Ações</StyledTableCell>
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
                                <StyledTableCell style={{ textAlign: "center" }}>{row.acoes.map((item, index) => <span key={index} onClick={() => item.action(row)}>{item.icon}</span>)}</StyledTableCell>
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
            <Dialog
                open={openModal}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleCloseModal}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Tem certeza que deseja excluir?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Esta ação não poderá ser desfeita
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal}>Cancelar</Button>
                    <Button onClick={deleteFinance} color="error">Excluir</Button>
                </DialogActions>
            </Dialog>
            <Drawer anchor={"left"} open={openDrawer} onClose={toggleDrawer} style={{ padding: "0 4px 0 4px" }}>
                <IconButton onClick={toggleDrawer} size="medium" style={{ width: "25px", marginLeft: "8px" }}>
                    <Close alignmentBaseline="baseline"></Close>
                </IconButton>
                <Divider />
                {currentFinance?.id && (

                    <FinancesForm data={currentFinance} toggleDrawer={() => {
                        toggleDrawer()
                        setCurrentFinance({} as ICheckout)
                    }} />
                )}
                <Divider />
            </Drawer>
        </Paper>
    )
}
