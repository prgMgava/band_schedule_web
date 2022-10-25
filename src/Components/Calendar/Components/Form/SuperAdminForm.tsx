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
  ListItemIcon,
} from "@mui/material"

import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { IBandFields } from "../../../../Types/form.type"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { TextField } from "@mui/material"
import { NewspaperOutlined, PhoneOutlined, EmailOutlined, MapOutlined, Circle } from "@mui/icons-material"
import { Stack } from "@mui/system"
import { useState } from "react"
import { toast } from "react-toastify"
import { useMobile } from "../../../../Provider/Theme/Mobile"
import { useBand } from "../../../../Provider/Band/Band"
import { useAuth } from "../../../../Provider/Auth/Auth"
import { useLabel } from "../../../../Provider/Label/Label"

interface IDataForm {
  band_id?: number
  user_id?: number
  member_id?: number
  label_id?: number
}
export const SuperAdminForm = ({ toggleDrawer }: any) => {
  const { mobile } = useMobile()
  const { myBands, deleteBand } = useBand()
  const { labels, deleteLabel } = useLabel()
  const { getAdmins, adminList, deleteAdmin, getMembers, memberList } = useAuth()
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
    dataForm.member_id && (await deleteAdmin(dataForm.member_id))
    dataForm.label_id && (await deleteLabel(dataForm.label_id))

    toggleDrawer()
    toast.error("Dados deletados com sucesso")
  }

  React.useEffect(() => {
    getAdmins()
    getMembers()
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
                    <InputLabel id="demo-simple-select-helper-label">Administrador</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Administrador"
                      fullWidth={true}
                      {...field}
                    >
                      {adminList.map(item => (
                        <MenuItem value={item.id} key={uuid()}>
                          {item.username}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              )}
            />
          </Stack>
          <Stack direction={mobile ? "column" : "row"} spacing={2} justifyContent={"center"}>
            <Controller
              name="member_id"
              control={control}
              render={({ field }) => (
                <Box width={"100%"}>
                  <FormControl fullWidth={true}>
                    <InputLabel id="demo-simple-select-helper-label">Usuário</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Usuário"
                      fullWidth={true}
                      {...field}
                    >
                      {memberList.map(item => (
                        <MenuItem value={item.id} key={uuid()}>
                          {item.username}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              )}
            />
          </Stack>
          <Stack direction={mobile ? "column" : "row"} spacing={2} justifyContent={"center"}>
            <Controller
              name="label_id"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth={true}>
                  <InputLabel id="demo-simple-select-helper-label">Label</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Label"
                    fullWidth={true}
                    {...field}
                  >
                    {labels.map(label => (
                      <MenuItem value={label.id} key={uuid()}>
                        <ListItemIcon>
                          <Circle sx={{ color: label?.color }} />
                        </ListItemIcon>
                        {label.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
              {dataForm?.band_id && (
                <Box>
                  <b>Banda: {myBands.find(item => item.id === dataForm.band_id)?.name}</b>
                </Box>
              )}
              {dataForm?.user_id && (
                <Box>
                  <b>Adm: {adminList.find(item => item.id === dataForm.user_id)?.username}</b>
                </Box>
              )}
              {dataForm?.member_id && (
                <Box>
                  <b>Usuário: {memberList.find(item => item.id === dataForm.member_id)?.username}</b>
                </Box>
              )}
              {dataForm?.label_id && (
                <Box>
                  <b>Label: {labels.find(item => item.id === dataForm.label_id)?.title}</b>
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
