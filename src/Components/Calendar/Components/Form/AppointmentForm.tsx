import * as React from "react"

import {
  Box,
  Button,
  createTheme,
  Divider,
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
} from "@mui/material"

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
  Block,
} from "@mui/icons-material"
import { Stack } from "@mui/system"
import { useState } from "react"
import { statesList } from "../../Utils/states"

const schema = yup.object().shape({
  title: yup.string().required("Nome do evento é obrigatório").max(100, "Nome muito grande"),
  cellphone: yup.string().required("Telefone do responsável é obrigatório").max(50, "Telefone muito grande"),
  street: yup.string().max(50, "Nome de rua muito grande").required("Informe uma rua"),
  district: yup.string().max(50, "Nome de bairro muito grande").required("Informe um bairro"),
  state: yup.string().required("Informe um estado"),
  city: yup.string().max(50, "Nome de cidade muito grande").required("Informe uma cidade"),
  place: yup.string().max(50, "Nome muito grande"),
  address_number: yup.string().max(10, "Numero muito grande"),
  address_complement: yup.string().max(150, "Complemento muito grande"),
  status: yup.string().default("agendado"),
  id_band: yup.number().required("Informe a banda que vai tocar no evento"),
  startDate: yup.date().required("Data inicial obrigatória").required("Data inicial obrigatória"),
  endDate: yup.date().required("Data final obrigatória").required("Data final obrigatória"),
})

export const AppointmentForm = ({ data }: any) => {
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [maskedCellPhone, setMaskedCellPhone] = useState("")
  const { startDate, endDate } = data.appointmentData
  const hasHour =
    new Date(startDate).toLocaleTimeString().substring(0, 5) === "00:00"
      ? new Date().toLocaleTimeString().substring(0, 5)
      : new Date(startDate).toLocaleTimeString().substring(0, 5)
  const hasHourEnd =
    new Date(endDate).toLocaleTimeString().substring(0, 5) === "00:00"
      ? new Date().toLocaleTimeString().substring(0, 5)
      : new Date(endDate).toLocaleTimeString().substring(0, 5)
  const startDateFormatted = `${new Date(startDate).toISOString().substring(0, 11)}${hasHour}`
  const endDateFormatted = `${new Date(endDate).toISOString().substring(0, 11)}${hasHourEnd}`

  const [reqStartDate, setreqStartDate] = useState(startDateFormatted)
  const [reqEndDate, setreqEndDate] = useState(endDateFormatted)

  const maskCellNumber = value => {
    value = value.replace(/\D/g, "")
    value = value.replace(/(\d{2})(\d)/, "($1) $2")
    value = value.replace(/(\d{4,5})(\d)/, "$1-$2")
    setMaskedCellPhone(value)
  }

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<IAppointmentFields>({ resolver: yupResolver(schema), mode: "onSubmit" })

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
                  label="Título *"
                  error={!!errors.title}
                  helperText={errors.title && errors.title.message}
                  name="title"
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
                  label="Telefone *"
                  error={!!errors.cellphone}
                  helperText={errors.cellphone && errors.cellphone.message}
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
              name="street"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Rua *"
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
                  label="Bairro *"
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
                <Box>
                  <FormControl error={!!errors.id_band}>
                    <InputLabel id="demo-simple-select-helper-label">Estado *</InputLabel>
                    <Select
                      sx={{ minWidth: 240 }}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="States"
                      defaultValue="agendado"
                      {...field}
                    >
                      {statesList.map((item, index) => (
                        <MenuItem value={item.nome} key={index}>
                          {item.nome}
                        </MenuItem>
                      ))}
                    </Select>
                    {!!errors.state && <FormHelperText sx={{ color: "#E34367" }}>Selecione uma banda</FormHelperText>}
                  </FormControl>
                </Box>
              )}
            />
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Cidade *"
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
                  sx={{ width: "100%" }}
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
          <Divider variant="inset" />
          <Stack>
            <Typography variant="subtitle1">Preencha as datas e horários</Typography>
          </Stack>
          <Stack direction={mobile ? "column" : "row"} spacing={2}>
            <fieldset
              style={{ border: `${errors.startDate ? "1px #E34367 solid" : "1px #C0C0C0 solid"}`, borderRadius: "4px" }}
            >
              <legend style={{ fontSize: "12px", color: "	#888888" }}>Data inicial *</legend>
              <Box>
                <FormControl>
                  <input
                    type={"datetime-local"}
                    defaultValue={reqStartDate}
                    id="startDate"
                    {...register("startDate")}
                    style={{ height: "24px", border: "none", outline: "none" }}
                  ></input>
                  {!!errors.startDate && (
                    <FormHelperText sx={{ color: "#E34367" }}>Selecione uma data inicial</FormHelperText>
                  )}
                </FormControl>
              </Box>
            </fieldset>
            <fieldset
              style={{ border: `${errors.endDate ? "1px #E34367 solid" : "1px #C0C0C0 solid"}`, borderRadius: "4px" }}
            >
              <legend style={{ fontSize: "12px", color: "	#888888" }}>Data final</legend>
              <Box>
                <FormControl>
                  <input
                    type={"datetime-local"}
                    defaultValue={reqEndDate}
                    id="endDate"
                    {...register("endDate")}
                    style={{ height: "24px", border: "none", outline: "none" }}
                  ></input>
                  {!!errors.endDate && (
                    <FormHelperText sx={{ color: "#E34367" }}>Selecione uma data final</FormHelperText>
                  )}
                </FormControl>
              </Box>
            </fieldset>
          </Stack>
          <Divider variant="inset" />
          <Stack direction={mobile ? "column" : "row"} spacing={2}>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Box>
                  <FormControl>
                    <InputLabel id="demo-simple-select-helper-label">Status</InputLabel>
                    <Select
                      sx={{ minWidth: 270 }}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Status"
                      defaultValue="agendado"
                      {...field}
                    >
                      <MenuItem value={"agendado"} selected>
                        Agendado
                      </MenuItem>
                      <MenuItem value={"cancelado"}>Cancelado</MenuItem>
                      <MenuItem value={"concluido"}>Concluído</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              )}
            />
            <Controller
              name="id_band"
              control={control}
              render={({ field }) => (
                <Box>
                  <FormControl error={!!errors.id_band}>
                    <InputLabel id="demo-simple-select-helper-label">Banda *</InputLabel>
                    <Select
                      sx={{ minWidth: 270 }}
                      labelId="demo-simple-select-error-label"
                      id="demo-simple-select-error"
                      label="Banda"
                      {...field}
                    >
                      <MenuItem value={1}>Banda 1</MenuItem>
                      <MenuItem value={2}>Banda 2</MenuItem>
                      <MenuItem value={3}>Banda 3</MenuItem>
                    </Select>
                    {!!errors.id_band && <FormHelperText sx={{ color: "#E34367" }}>Selecione uma banda</FormHelperText>}
                  </FormControl>
                </Box>
              )}
            />
          </Stack>
        </Stack>
        <Stack spacing={"10px"} mt={3}>
          <Button type="submit" variant="contained">
            {" "}
            Salvar
          </Button>
        </Stack>
      </form>
    </Grid>
  )
}
