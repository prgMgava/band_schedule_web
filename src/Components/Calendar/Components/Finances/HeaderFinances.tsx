import { Box, Card, CardContent, Typography, Chip } from "@mui/material"
import { useMobile } from "../../../../Provider/Theme/Mobile"

export const HeaderFinances = () => {
    const { mobile } = useMobile()
    return (
        <Card style={{ padding: "16px", margin: "0px auto", position: "relative", maxWidth: "800px" }}>

            <CardContent style={{ display: "flex", flexDirection: mobile ? 'column' : "row", textAlign: !mobile ? 'center' : 'left', paddingBottom: "16px" }}>
                <Box style={{ borderRight: !mobile && "solid 2px #e1e1e1", borderBottom: mobile && "solid 2px #e1e1e1", marginBottom: mobile && "8px", flexBasis: "20%" }}>
                    <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold' }}>Mês atual</Typography>
                    <Typography variant="subtitle2" gutterBottom color="#707070">Fevereiro</Typography>
                </Box>
                <Box style={{ borderRight: !mobile && "solid 2px #e1e1e1", borderBottom: mobile && "solid 2px #e1e1e1", marginBottom: mobile && "8px", flexBasis: "20%" }}>
                    <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold' }}>Entradas</Typography>
                    <Typography variant="subtitle2" gutterBottom color="#707070">R$ 20.000,00</Typography>
                </Box>
                <Box style={{ borderRight: !mobile && "solid 2px #e1e1e1", borderBottom: mobile && "solid 2px #e1e1e1", marginBottom: mobile && "8px", flexBasis: "20%" }}>
                    <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold' }}>Saídas</Typography>
                    <Typography variant="subtitle2" gutterBottom color="#707070">R$ 40.000,00</Typography>
                </Box>
                <Box style={{ borderRight: !mobile && "solid 2px #e1e1e1", borderBottom: mobile && "solid 2px #e1e1e1", marginBottom: mobile && "8px", flexBasis: "20%" }}>
                    <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold' }}>Saldo</Typography>
                    <Typography variant="subtitle2" gutterBottom color="#707070">R$ -20.000,00</Typography>
                </Box>
                <Box style={{ flexBasis: "20%" }}>
                    <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold' }}>Status</Typography>
                    <Typography variant="subtitle2" gutterBottom color="#707070"><Chip label="Positivo" color="success" /></Typography>
                </Box>
            </CardContent>
        </Card>
    )
}