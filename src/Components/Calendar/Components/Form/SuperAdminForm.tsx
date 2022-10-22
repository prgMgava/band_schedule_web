import * as React from "react"
import uuid from "react-uuid"
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  useMediaQuery,
  useTheme,
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material"

import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { IBandFields } from "../../../../Types/form.type"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { TextField } from "@mui/material"
import { NewspaperOutlined, PhoneOutlined, EmailOutlined, MapOutlined } from "@mui/icons-material"
import { Stack } from "@mui/system"
import { useState } from "react"
import { toast } from "react-toastify"
import { admList, bandList } from "../../../../demo-data/grouping"
import { useMobile } from "../../../../Provider/Theme/Mobile"
import { useBand } from "../../../../Provider/Band/Band"
import { useAuth } from "../../../../Provider/Auth/Auth"

interface IDataForm {
  band_id: number
  user_id: number
}
export const SuperAdminForm = ({ toggleDrawer }: any) => {
  const { mobile } = useMobile()
  const { myBands, deleteBand } = useBand()
  const { getAdmins, adminList, deleteAdmin } = useAuth()
  const [dataForm, setDataForm] = useState<IDataForm>({} as IDataForm)
  const {
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<any>({ mode: "all" })

  const submitForm: SubmitHandler<any> = (data: any) => {
    if (Object.keys(data).find(key => !!data[key])) {
      setOpen(true)
      setDataForm(data)
    }
  }

  const [open, setOpen] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleDelete = async () => {
    dataForm.band_id && (await deleteBand(dataForm.band_id))
    dataForm.user_id && (await deleteAdmin(dataForm.user_id))

    toggleDrawer()
    toast.error("Dados deletados com sucesso")
  }

  React.useEffect(() => {
    getAdmins()
  }, [])

  return (
    <Grid padding={mobile ? 8 : 8}>
      <form onSubmit={handleSubmit(submitForm)} style={{ width: "100%" }}>
        <Stack spacing={3} width="100%">
          <Stack>
            <Typography variant="subtitle1">Aqui você pode deletar bandas e administradores</Typography>
          </Stack>
          <Stack direction={mobile ? "column" : "row"} spacing={2} width="100%" justifyContent={"center"}>
            <Controller
              name="band_id"
              control={control}
              render={({ field }) => (
                <Box width="100%">
                  <FormControl fullWidth={true}>
                    <InputLabel id="demo-simple-select-helper-label">Banda</InputLabel>
                    <Select
                      fullWidth={true}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="States"
                      {...field}
                    >
                      {myBands.map(item => (
                        <MenuItem value={item.id} key={uuid()}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {!!errors.state && <FormHelperText sx={{ color: "#E34367" }}>Selecione um estado</FormHelperText>}
                  </FormControl>
                </Box>
              )}
            />
          </Stack>
          <Stack direction={mobile ? "column" : "row"} spacing={2} justifyContent={"center"}>
            <Controller
              name="user_id"
              control={control}
              render={({ field }) => (
                <Box width={"100%"}>
                  <FormControl fullWidth={true}>
                    <InputLabel id="demo-simple-select-helper-label">Adm</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Adm"
                      fullWidth={true}
                      {...field}
                    >
                      {adminList.map(item => (
                        <MenuItem value={item.id} key={uuid()}>
                          {item.username}
                        </MenuItem>
                      ))}
                    </Select>
                    {!!errors.state && <FormHelperText sx={{ color: "#E34367" }}>Selecione um estado</FormHelperText>}
                  </FormControl>
                </Box>
              )}
            />
          </Stack>
        </Stack>

        <Stack spacing={"10px"} mt={3}>
          <Button type="submit" variant="contained" color="error">
            {" "}
            Deletar
          </Button>
        </Stack>
      </form>
      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Esta ação não podera ser desfeita</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Você tem certeza que deseja excluir o(s) seguinte(s) dados:
              {dataForm?.band_id && <Box>Banda: {myBands.find(item => item.id === dataForm.band_id)?.name}</Box>}
              {dataForm?.user_id && (
                <Box>
                  <b>Adm: {adminList.find(item => item.id === dataForm.user_id)?.username}</b>
                </Box>
              )}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} autoFocus>
              Cancelar
            </Button>
            <Button onClick={handleDelete} color="error">
              Continua
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </Grid>
  )
}
