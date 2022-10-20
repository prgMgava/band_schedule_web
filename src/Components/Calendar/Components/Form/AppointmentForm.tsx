import * as React from "react"

import { createTheme, Grid, InputAdornment, Typography, useMediaQuery, useTheme } from "@mui/material"

import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { IAppointmentFields } from "../../../../Types/form.type"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { TextField } from "@mui/material"
import {
  AccountCircle,
  PlaceOutlined,
  NewspaperOutlined,
  PhoneOutlined,
  MapOutlined,
  Looks3Outlined,
  TextSnippetOutlined,
  CalendarMonthOutlined,
} from "@mui/icons-material"
import { Stack } from "@mui/system"
import { useState } from "react"

const schema = yup.object().shape({
  title: yup.string().required("Nome do evento é obrigatório").max(100, "Nome muito grande"),
  cellphone: yup.string().required("Telefone do responsável é obrigatório").max(50, "Telefone muito grande"),
  street: yup.string().max(50, "Nome de rua muito grande"),
  district: yup.string().max(50, "Nome de bairro muito grande"),
  state: yup.string(),
  city: yup.string().max(50, "Nome de cidade muito grande"),
  place: yup.string().max(50, "Nome muito grande"),
  address_number: yup.string().max(10, "Numero muito grande"),
  address_complement: yup.string().max(150, "Complemento muito grande"),
  address: yup.boolean().when(["street", "state"], {
    is: (a, b) => a || b,
    then: yup.boolean().nullable(),
    otherwise: yup.boolean().notOneOf([false], "Forneça algum endereço"),
  }),
  status: yup.string(),
  id_band: yup.number().required("Informe a banda que vai tocar no evento"),
  startDate: yup.date().required("Data inicial obrigatória"),
  endDate: yup.date().required("Data final obrigatória"),
})

export const AppointmentForm = ({ data }: any) => {
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down("sm"))
  console.log(data)
  const { appointmentData } = data
  const [reqStartDate, setreqStartDate] = useState(appointmentData.startDate)
  const [reqEndDate, setreqEndDate] = useState(appointmentData.endDate)

  console.log(data, "appintment")
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<IAppointmentFields>()

  const submitForm: SubmitHandler<IAppointmentFields> = (data: IAppointmentFields) => {
    console.log(data)
  }

  return (
    <Grid padding={mobile ? "" : 8}>
      <form onSubmit={handleSubmit(submitForm)}>
        <Stack spacing={3}>
          <Stack>
            <Typography variant="subtitle1">Preencha com as informações do evento</Typography>
          </Stack>
          <Stack direction={mobile ? "column" : "row"} spacing={2}>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Título"
                  error={!!errors.title}
                  helperText={errors.title && errors.title.message}
                  focused
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
            <Controller
              name="cellphone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Telefone"
                  error={!!errors.cellphone}
                  helperText={errors.cellphone && errors.cellphone.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneOutlined />
                      </InputAdornment>
                    ),
                  }}
                ></TextField>
              )}
            />
          </Stack>
          <Stack direction={mobile ? "column" : "row"} spacing={2}>
            <Controller
              name="street"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Rua"
                  error={!!errors.street}
                  helperText={errors.street && errors.street.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PlaceOutlined />
                      </InputAdornment>
                    ),
                  }}
                ></TextField>
              )}
            />
            <Controller
              name="district"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Bairro"
                  error={!!errors.district}
                  helperText={errors.district && errors.district.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PlaceOutlined />
                      </InputAdornment>
                    ),
                  }}
                ></TextField>
              )}
            />
          </Stack>
          <Stack direction={mobile ? "column" : "row"} spacing={2}>
            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Estado"
                  error={!!errors.state}
                  helperText={errors.state && errors.state.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PlaceOutlined />
                      </InputAdornment>
                    ),
                  }}
                ></TextField>
              )}
            />
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Cidade"
                  error={!!errors.city}
                  helperText={errors.city && errors.city.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MapOutlined />
                      </InputAdornment>
                    ),
                  }}
                ></TextField>
              )}
            />
          </Stack>
          <Stack direction={mobile ? "column" : "row"} spacing={2}>
            <Controller
              name="address_number"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Número"
                  error={!!errors.address_number}
                  helperText={errors.address_number && errors.address_number.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Looks3Outlined />
                      </InputAdornment>
                    ),
                  }}
                ></TextField>
              )}
            />
            <Controller
              name="address_complement"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Complemento"
                  error={!!errors.address_complement}
                  helperText={errors.address_complement && errors.address_complement.message}
                  multiline
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <TextSnippetOutlined />
                      </InputAdornment>
                    ),
                  }}
                ></TextField>
              )}
            />
          </Stack>
          <Stack>
            <Typography variant="subtitle1">Preencha as datas e horários</Typography>
          </Stack>
          <Stack direction={"row"} spacing={2}>
            <input type={"datetime-local"}></input>
            <input type={"datetime-local"}></input>
          </Stack>
        </Stack>
      </form>
    </Grid>
  )
}
