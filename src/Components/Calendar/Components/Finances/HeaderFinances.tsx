import { Box, Card, CardContent, Typography, Chip } from "@mui/material"
import { useMobile } from "../../../../Provider/Theme/Mobile"
import React, { useEffect, useState } from 'react'
import { useCheckout } from '../../../../Provider/Checkout/Checkout'
import { monthNames } from "./utils/month"


export const HeaderFinances = () => {
    const { checkouts, currentDate } = useCheckout()
    const { mobile } = useMobile()
    const [entrance, setEntrance] = useState("")
    const [output, setOutput] = useState("")
    const [total, setTotal] = useState(0)



    const getSums = () => {
        const sumEntrance: any = checkouts?.filter(band => band.type == 1).reduce((a, b) => {
            return a + Number(b.value)
        }, 0)

        setEntrance(sumEntrance?.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }))
        const sumOutput: any = checkouts?.filter(band => band.type == 2).reduce((a, b) => {
            return a + Number(b.value)
        }, 0)
        setOutput(sumOutput?.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }))
        const sumTotal = (sumEntrance || 0) - (sumOutput || 0)
        setTotal(sumTotal)
    }

    useEffect(() => {
        getSums()
    }, [checkouts])

    return (
        <Card style={{ padding: "16px", margin: "0px auto", position: "relative" }}>

            <CardContent style={{ display: "flex", flexDirection: mobile ? 'column' : "row", textAlign: !mobile ? 'center' : 'left', paddingBottom: "16px" }}>
                <Box style={{ borderRight: !mobile && "solid 2px #e1e1e1", borderBottom: mobile && "solid 2px #e1e1e1", marginBottom: mobile && "8px", flexBasis: "20%" }}>
                    <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold' }}>Mês atual</Typography>
                    <Typography variant="subtitle2" gutterBottom color="#707070">{monthNames[currentDate.getMonth()]}</Typography>
                </Box>
                <Box style={{ borderRight: !mobile && "solid 2px #e1e1e1", borderBottom: mobile && "solid 2px #e1e1e1", marginBottom: mobile && "8px", flexBasis: "20%" }}>
                    <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold' }}>Entradas</Typography>
                    <Typography variant="subtitle2" gutterBottom color="#707070">{entrance ? entrance : "--"}</Typography>
                </Box>
                <Box style={{ borderRight: !mobile && "solid 2px #e1e1e1", borderBottom: mobile && "solid 2px #e1e1e1", marginBottom: mobile && "8px", flexBasis: "20%" }}>
                    <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold' }}>Saídas</Typography>
                    <Typography variant="subtitle2" gutterBottom color="#707070">{output ? output : "--"}</Typography>
                </Box>
                <Box style={{ borderRight: !mobile && "solid 2px #e1e1e1", borderBottom: mobile && "solid 2px #e1e1e1", marginBottom: mobile && "8px", flexBasis: "20%" }}>
                    <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold' }}>Saldo</Typography>
                    <Typography variant="subtitle2" gutterBottom color="#707070">{total ? total?.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) : '--'}</Typography>
                </Box>
                <Box style={{ flexBasis: "20%" }}>
                    <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold' }}>Status</Typography>
                    {total == 0 ? (
                        <Typography variant="subtitle2" gutterBottom color="#707070"><Chip label="--" color="secondary" /></Typography>

                    ) : total > 0 ? (
                        <Typography variant="subtitle2" gutterBottom color="#707070"><Chip label="Positivo" color="success" /></Typography>

                    ) : (
                        <Typography variant="subtitle2" gutterBottom color="#707070"><Chip label="Negativo" color="error" /></Typography>

                    )}
                </Box>
            </CardContent>
        </Card>
    )
}