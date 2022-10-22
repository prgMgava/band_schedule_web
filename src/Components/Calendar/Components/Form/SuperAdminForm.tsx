import * as React from "react"

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

export const SuperAdminForm = () => {
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [dataForm, setDataForm] = useState({})
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

  const handleDelete = () => {
    setOpen(false)
    toast.error("Dados deletados com sucesso")
  }

  return (
    <Grid padding={mobile ? 8 : ""}>
      <form onSubmit={handleSubmit(submitForm)}>
        <Stack spacing={3} width="100%">
          <Stack>
            <Typography variant="subtitle1">Aqui você pode deletar bandas e administradores</Typography>
          </Stack>
          <Stack direction={mobile ? "column" : "row"} spacing={2} width="100%" justifyContent={"center"}>
            <Controller
              name="band_id"
              control={control}
              render={({ field }) => (
                <Box>
                  <FormControl>
                    <InputLabel id="demo-simple-select-helper-label">Banda</InputLabel>
                    <Select
                      sx={{ minWidth: 240 }}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="States"
                      {...field}
                    >
                      {bandList.map((item, index) => (
                        <MenuItem value={item.value} key={index}>
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
                <Box>
                  <FormControl>
                    <InputLabel id="demo-simple-select-helper-label">Adm</InputLabel>
                    <Select
                      sx={{ minWidth: 240 }}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Adm"
                      {...field}
                    >
                      {admList.map((item, index) => (
                        <MenuItem value={item.value} key={index}>
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
              {Object.keys(dataForm).map(key => {
                return (
                  <div key={key}>
                    {key} : {dataForm[key]}
                  </div>
                )
              })}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleDelete} autoFocus color="error">
              Continuar
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </Grid>
  )
}
