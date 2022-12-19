import * as React from "react"

import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material"

import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { IBandFields } from "../../../../Types/form.type"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { TextField } from "@mui/material"
import { NewspaperOutlined, PhoneOutlined, EmailOutlined } from "@mui/icons-material"
import { Stack } from "@mui/system"
import { useState } from "react"
import { toast } from "react-toastify"
import { useMobile } from "../../../../Provider/Theme/Mobile"
import { useBand } from "../../../../Provider/Band/Band"
import uuid from "react-uuid"
import { useAuth } from "../../../../Provider/Auth/Auth"
import { removeMaskNumber } from "../../../../Utils/masks"

const schema = yup.object().shape({
  name: yup.string().required("Nome da Banda é obrigatório").max(100, "Nome muito grande"),
  email: yup.string().max(150, "Email muito grande").nullable(),
  cellphone: yup.string().max(50, "Telefone muito grande").nullable(),
  owner: yup.number(),
})

interface BandProps {
  toggleDrawer: () => void
}

export const BandForm = ({ toggleDrawer }: BandProps) => {
  const { superAdmin, adminList } = useAuth()

  const { mobile } = useMobile()
  const { createBand, myBands, updateBand } = useBand()
  const [maskedCellPhone, setMaskedCellPhone] = useState("")
  const [currentBand, setCurrentBand] = useState(0)
  const maskCellNumber = (value: string) => {
    if (!value) return
    value = value.replace(/\D/g, "")
    value = value.replace(/(\d{2})(\d)/, "($1) $2")
    value = value.replace(/(\d{4,5})(\d)/, "$1-$2")
    setMaskedCellPhone(value)
  }

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    unregister,
    getValues,
  } = useForm<IBandFields>({ resolver: yupResolver(schema), mode: "all" })

  const submitForm: SubmitHandler<IBandFields> = async (data: IBandFields) => {
    if (!getValues("owner") && superAdmin) {
      toast.error("Selecione um admin responsável por essa banda")
      return
    }

    data.cellphone = removeMaskNumber(data.cellphone)
    if (currentBand) {
      const response = await updateBand({ ...data, id: currentBand })
      toast[response.success ? "success" : "error"](response.message)
      if (response.success) {
        toggleDrawer()
      }
    } else {
      const response = await createBand(data)
      toast[response.success ? "success" : "error"](response.message)
      if (response.success) {
        toggleDrawer()
      }
    }
  }

  React.useEffect(() => {
    if (!superAdmin) {
      unregister("owner")
    }
  }, [])

  React.useEffect(() => {
    if (currentBand) {
      const band = myBands.find(item => item.id === currentBand)
      if (band) {
        setValue("name", band.name)
        setValue("cellphone", band.cellphone)
        maskCellNumber(band.cellphone)
        setValue("email", band.email)
      }
    }
  }, [currentBand])

  React.useEffect(() => setValue("cellphone", maskedCellPhone), [maskedCellPhone])

  return (
    <Grid padding={mobile ? 2 : 8}>
      <form onSubmit={handleSubmit(submitForm)}>
        <Stack spacing={3}>
          <Stack>
            <Typography variant="subtitle1">Preencha com as informações da banda</Typography>
          </Stack>
          <Stack direction={mobile ? "column" : "row"} spacing={2}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  autoComplete={"false"}
                  label="Nome *"
                  error={!!errors.name}
                  helperText={errors.name && errors.name.message}
                  fullWidth={true}
                  name="name"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <NewspaperOutlined />
                      </InputAdornment>
                    ),
                  }}
                ></TextField>
              )}
            />
          </Stack>
          <Stack direction={mobile ? "column" : "row"} spacing={2}>
            <Controller
              name="cellphone"
              control={control}
              render={({ field: { onChange, ...rest } }) => (
                <TextField
                  {...rest}
                  label="Telefone"
                  error={!!errors.cellphone}
                  helperText={errors.cellphone && errors.cellphone.message}
                  fullWidth={true}
                  onChange={e => maskCellNumber(e.currentTarget.value)}
                  value={maskedCellPhone}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneOutlined />
                      </InputAdornment>
                    ),
                  }}
                  inputProps={{
                    maxLength: 15,
                  }}
                ></TextField>
              )}
            />
          </Stack>
          <Stack direction={mobile ? "column" : "row"} spacing={2}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  error={!!errors.email}
                  helperText={errors.email && errors.email.message}
                  fullWidth={true}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlined />
                      </InputAdornment>
                    ),
                  }}
                ></TextField>
              )}
            />
          </Stack>
          {superAdmin && (
            <Controller
              name="owner"
              control={control}
              render={({ field }) => (
                <Box width={"100%"}>
                  <FormControl fullWidth={true}>
                    <InputLabel id="demo-simple-select-helper-label">Administrador *</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Administrador *"
                      fullWidth={true}
                      {...field}
                    >
                      {adminList.map(item => {
                        if (!item.is_deleted) {
                          return (
                            <MenuItem value={item.id} key={uuid()}>
                              {item.username}
                            </MenuItem>
                          )
                        }
                        return <></>
                      })}
                    </Select>
                  </FormControl>
                </Box>
              )}
            />
          )}
        </Stack>

        <Stack spacing={"10px"} mt={3}>
          <Button type="submit" variant="contained">
            {currentBand ? "Atualizar" : " salvar"}
          </Button>
        </Stack>
      </form>
      <Divider style={{ marginTop: "16px" }} />
      <Stack mt={2}>
        <Typography variant="subtitle1">Escolha uma banda caso queira editar</Typography>
      </Stack>

      <Box>
        <FormControl fullWidth={true}>
          <InputLabel id="demo-simple-select-helper-label">Banda *</InputLabel>
          <Select
            sx={{ minWidth: 270 }}
            labelId="demo-simple-select-error-label"
            id="demo-simple-select-error"
            label="Banda"
            value={currentBand}
            onChange={e => {
              setCurrentBand(e.target.value as number)
            }}
          >
            {myBands.map(band => {
              if (!band.is_deleted) {
                return (
                  <MenuItem value={band.id} key={uuid()}>
                    {band.name}
                  </MenuItem>
                )
              }
              return <></>
            })}
          </Select>
        </FormControl>
      </Box>
      <Divider variant="inset" />
    </Grid>
  )
}
