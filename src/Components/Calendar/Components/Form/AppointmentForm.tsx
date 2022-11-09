/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react"

import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  ListItemIcon,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Typography,
} from "@mui/material"

import uuid from "react-uuid"

import { useForm, Controller, SubmitHandler } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { TextField } from "@mui/material"
import {
  PlaceOutlined,
  NewspaperOutlined,
  PhoneOutlined,
  MapOutlined,
  Looks3Outlined,
  TextSnippetOutlined,
  Close,
  Circle,
  BusinessCenterOutlined,
  Person2Outlined,
  BusinessOutlined,
  EmailOutlined,
  PermContactCalendarOutlined,
} from "@mui/icons-material"
import { Stack } from "@mui/system"
import { useState } from "react"
import { statesList } from "../../Utils/states"
import { toast } from "react-toastify"
import { useEffect } from "react"
import { useMobile } from "../../../../Provider/Theme/Mobile"
import { useBand } from "../../../../Provider/Band/Band"
import { useAppointment } from "../../../../Provider/Appointment/Appointment"
import { useLabel } from "../../../../Provider/Label/Label"
import { IAppointments } from "../../../../Types/appointments.type"

const schema = yup.object().shape({
  title: yup.string().required("Nome do evento é obrigatório").max(5000, "Nome muito grande"),
  cellphone: yup.string().max(50, "Telefone muito grande").nullable(),
  street: yup.string().max(50, "Nome de rua muito grande").nullable(),
  district: yup.string().max(50, "Nome de bairro muito grande").nullable(),
  state: yup.string().nullable(),
  city: yup.string().max(50, "Nome de cidade muito grande").nullable(),
  place: yup.string().max(50, "Nome muito grande").nullable(),
  address_number: yup.string().max(10, "Numero muito grande").nullable(),
  address_complement: yup.string().max(200, "Complemento muito grande").nullable(),
  status: yup.string().default("agendado"),
  id_band: yup.number().required("Informe a banda que vai tocar no evento"),
  start_date: yup.date().required("Data inicial obrigatória").required("Data inicial obrigatória"),
  end_date: yup.date().required("Data final obrigatória").required("Data final obrigatória"),
  id_label: yup.number().required("Label é obrigatório"),
  company_name: yup.string().max(200, "Nome de empresa muito grande").nullable(),
  company_contractor: yup.string().max(200, "Nome de contratante muito grande").nullable(),
  company_cellphone: yup.string().max(200, "Telefone muito grande").nullable(),
  company_contact: yup.string().max(200, "Contato muito grande").nullable(),
  company_email: yup.string().max(200, "email muito grande").nullable(),
  emphasis: yup.string().max(5000, "Descrição destaque muito grande").nullable(),
  observations: yup.string().max(5000, "Descrição destaque muito grande").nullable(),
  event: yup.string().max(20, "Descrição destaque muito grande").nullable(),
  money: yup.string().nullable(),
  expanse: yup.string().nullable().max(5000, "Informação muito grande"),
})

interface AppointmentFormProps {
  data: any
  fromMenu?: boolean
  closeForm?: (value: boolean) => void
}

export const AppointmentForm = ({
  data,
  fromMenu = false,
  closeForm = () => {
    null
  },
}: AppointmentFormProps) => {
  const { mobile } = useMobile()
  const { myBands } = useBand()
  const { labels } = useLabel()
  const [maskedCellPhone, setMaskedCellPhone] = useState("")
  const { startDate, endDate, title, id } = data.appointmentData
  const { createAppointment, updateAppointment } = useAppointment()
  const [currentState, setCurrentState] = useState(data.appointmentData?.state)
  const [currenBand, setCurrentBand] = useState(data.appointmentData?.id_band)
  const [currenLabel, setCurrentLabel] = useState(data.appointmentData?.id_label)
  const [currentStatus, setCurrentStatus] = useState(data.appointmentData?.status)
  const [currentEditingData, setCurrentEditingData] = useState(data.appointmentData)

  const isEditing = !!title

  const addHour = (date: Date) => {
    return date.setHours(date.getHours() + 1)
  }

  const endHourPlusOne =
    new Date(endDate).toLocaleTimeString().substring(0, 5) === "00:00"
      ? new Date(!isEditing ? addHour(new Date()) : 0).toLocaleTimeString().substring(0, 5)
      : new Date(!isEditing ? addHour(new Date(startDate)) : endDate).toLocaleTimeString().substring(0, 5)

  const hasHour =
    new Date(startDate).toLocaleTimeString().substring(0, 5) === "00:00"
      ? new Date().toLocaleTimeString().substring(0, 5)
      : new Date(startDate).toLocaleTimeString().substring(0, 5)
  //TODO: add one hour when create an appointment
  const hasHourEnd = endHourPlusOne
  console.log(hasHourEnd)

  const startDateFormatted =
    startDate && hasHour ? `${new Date(startDate).toISOString().substring(0, 11)}${hasHour}` : ""
  const endDateFormatted =
    endDate && hasHourEnd
      ? `${new Date(!isEditing ? startDate : endDate).toISOString().substring(0, 11)}${hasHourEnd}`
      : ""

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
    reset,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<IAppointments>({ resolver: yupResolver(schema), mode: "onSubmit" })

  const submitForm: SubmitHandler<IAppointments> = async data => {
    if (isEditing) {
      const response = await updateAppointment(data, id)
      toast[response.success ? "success" : "error"](response.message)
      if (response.success) {
        setCurrentEditingData(null)
        closeForm(false)
      }
      return
    }
    const response = await createAppointment(data)
    toast[response.success ? "success" : "error"](response.message)
    if (response.success) {
      setCurrentEditingData(null)
      closeForm(false)
    }
  }

  React.useEffect(() => setValue("cellphone", maskedCellPhone), [maskedCellPhone])

  useEffect(() => {
    if (isEditing && !!currentEditingData) {
      const { startDate, endDate, start_date, end_date, ...rest } = currentEditingData
      Object.keys(rest).map(item => {
        setValue(item as keyof IAppointments, data.appointmentData[item])
      })
    }
    setMaskedCellPhone(data.appointmentData?.cellphone)
    setCurrentState(data.appointmentData?.state)
    setCurrentBand(data.appointmentData?.id_band)

    getValues()
  }, [])

  useEffect(() => {
    // update component
  }, [currentState, currenBand])
  return (
    <Grid padding={fromMenu ? "24px" : mobile ? "" : 8}>
      {!fromMenu && (
        <Box style={{ width: "100%", marginLeft: "8px", justifyContent: "end", display: "flex" }}>
          <IconButton
            onClick={() => closeForm(false)}
            size="medium"
            style={{ width: "25px", marginLeft: "8px", justifyContent: "end" }}
          >
            <Close alignmentBaseline="baseline"></Close>
          </IconButton>
        </Box>
      )}

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
                  label="Destaque *"
                  error={!!errors.title}
                  helperText={errors.title && errors.title.message}
                  name="title"
                  multiline
                  fullWidth={true}
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
              render={({ field: { onChange, ...rest } }) => (
                <TextField
                  {...rest}
                  label="Telefone"
                  error={!!errors.cellphone}
                  helperText={errors.cellphone && errors.cellphone.message}
                  onChange={e => maskCellNumber(e.currentTarget.value)}
                  value={maskedCellPhone}
                  fullWidth={true}
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
                  label="Rua"
                  error={!!errors.street}
                  helperText={errors.street && errors.street.message}
                  fullWidth={true}
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
                  fullWidth={true}
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
                  <FormControl error={!!errors.state} fullWidth={true}>
                    <InputLabel id="demo-simple-select-helper-label">Estado</InputLabel>
                    <Select
                      sx={{ minWidth: 240 }}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="States"
                      defaultValue={currentState}
                      {...field}
                    >
                      {statesList.map((item, index) => (
                        <MenuItem value={item.nome} key={index}>
                          {item.nome}
                        </MenuItem>
                      ))}
                    </Select>
                    {!!errors.state && <FormHelperText sx={{ color: "#E34367" }}>Selecione um estado</FormHelperText>}
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
                  label="Cidade"
                  error={!!errors.city}
                  helperText={errors.city && errors.city.message}
                  fullWidth={true}
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
                  fullWidth={true}
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
                  fullWidth={true}
                  {...field}
                  label="Complemento"
                  error={!!errors.address_complement}
                  helperText={errors.address_complement && errors.address_complement.message}
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
          <Stack direction={mobile ? "column" : "row"} spacing={2}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Evento:</FormLabel>

              <Controller
                name="event"
                control={control}
                render={({ field }) => (
                  <RadioGroup {...field} row>
                    <FormControlLabel value="Corporativo" control={<Radio />} label="Corporativo" />
                    <FormControlLabel value="Show" control={<Radio />} label="Show" />
                    <FormControlLabel value="Participação" control={<Radio />} label="Participação" />
                  </RadioGroup>
                )}
              />
            </FormControl>
          </Stack>
          <Stack direction={mobile ? "column" : "row"} spacing={2}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Ingresso:</FormLabel>

              <Controller
                name="money"
                control={control}
                render={({ field }) => (
                  <RadioGroup {...field} row>
                    <FormControlLabel value="Bilheteria" control={<Radio />} label="Bilheteria" />
                    <FormControlLabel value="Cachê" control={<Radio />} label="Cachê" />
                  </RadioGroup>
                )}
              />
            </FormControl>
          </Stack>
          <Divider variant="inset" />
          <Stack>
            <Typography variant="subtitle1">Preencha as datas e horários</Typography>
          </Stack>
          <Stack direction={mobile ? "column" : "row"} spacing={2}>
            <FormControl fullWidth={true}>
              <fieldset
                style={{
                  border: `${errors.start_date ? "1px #E34367 solid" : "1px #C0C0C0 solid"}`,
                  borderRadius: "4px",
                }}
              >
                <legend style={{ fontSize: "12px", color: "#696969" }}>Data inicial *</legend>
                <Box>
                  <input
                    type={"datetime-local"}
                    defaultValue={reqStartDate}
                    id="start_date"
                    {...register("start_date")}
                    style={{ height: "24px", border: "none", outline: "none", width: "100%" }}
                  ></input>
                  {!!errors.start_date && (
                    <FormHelperText sx={{ color: "#E34367" }}>Selecione uma data inicial</FormHelperText>
                  )}
                </Box>
              </fieldset>
            </FormControl>
            <FormControl fullWidth={true}>
              <fieldset
                style={{
                  border: `${errors.end_date ? "1px #E34367 solid" : "1px #C0C0C0 solid"}`,
                  borderRadius: "4px",
                }}
              >
                <legend style={{ fontSize: "12px", color: "	#888888" }}>Data final *</legend>
                <Box>
                  <input
                    type={"datetime-local"}
                    defaultValue={reqEndDate}
                    id="end_date"
                    {...register("end_date")}
                    style={{ height: "24px", border: "none", outline: "none", width: "100%" }}
                  ></input>
                  {!!errors.end_date && (
                    <FormHelperText sx={{ color: "#E34367" }}>Selecione uma data final</FormHelperText>
                  )}
                </Box>
              </fieldset>
            </FormControl>
          </Stack>
          <Divider variant="inset" />
          <Stack direction={mobile ? "column" : "row"} spacing={2}>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Box>
                  <FormControl fullWidth={true}>
                    <InputLabel id="demo-simple-select-helper-label">Status</InputLabel>
                    <Select
                      sx={{ minWidth: 270 }}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Status"
                      defaultValue={currentStatus ? currentStatus : "agendado"}
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
                  <FormControl error={!!errors.id_band} fullWidth={true}>
                    <InputLabel id="demo-simple-select-helper-label">Banda *</InputLabel>
                    <Select
                      sx={{ minWidth: 270 }}
                      labelId="demo-simple-select-error-label"
                      id="demo-simple-select-error"
                      label="Banda"
                      defaultValue={currenBand}
                      {...field}
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
                    {!!errors.id_band && <FormHelperText sx={{ color: "#E34367" }}>Selecione uma banda</FormHelperText>}
                  </FormControl>
                </Box>
              )}
            />
          </Stack>
          <Stack direction={mobile ? "column" : "row"} spacing={2}>
            <Controller
              name="id_label"
              control={control}
              render={({ field }) => (
                <Box>
                  <FormControl error={!!errors.id_label} fullWidth={true}>
                    <InputLabel id="demo-simple-select-helper-label">Categoria *</InputLabel>
                    <Select
                      sx={{ minWidth: 270 }}
                      labelId="demo-simple-select-error-label"
                      id="demo-simple-select-error"
                      label="Categoria"
                      defaultValue={currenLabel}
                      {...field}
                    >
                      {labels.map(label => {
                        if (!label.is_deleted) {
                          return (
                            <MenuItem value={label.id} key={uuid()}>
                              <ListItemIcon>
                                <Circle sx={{ color: label?.color }} />
                              </ListItemIcon>
                              {label.title}
                            </MenuItem>
                          )
                        }
                        return <></>
                      })}
                    </Select>
                    {!!errors.id_label && (
                      <FormHelperText sx={{ color: "#E34367" }}>Selecione uma banda</FormHelperText>
                    )}
                  </FormControl>
                </Box>
              )}
            />
          </Stack>
          <Divider variant="inset" />
          <Stack>
            <Typography variant="subtitle1">Informações do contratante</Typography>
          </Stack>
          <Stack direction={mobile ? "column" : "row"} spacing={2}>
            <Controller
              name="company_name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Empresa"
                  error={!!errors.company_name}
                  helperText={errors.company_name && errors.company_name.message}
                  name="company_name"
                  fullWidth={true}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BusinessOutlined />
                      </InputAdornment>
                    ),
                  }}
                ></TextField>
              )}
            />
          </Stack>
          <Stack direction={mobile ? "column" : "row"} spacing={2}>
            <Controller
              name="company_contractor"
              control={control}
              render={({ field: { onChange, ...rest } }) => (
                <TextField
                  {...rest}
                  label="Contratante"
                  error={!!errors.company_contractor}
                  helperText={errors.company_contractor && errors.company_contractor.message}
                  onChange={e => maskCellNumber(e.currentTarget.value)}
                  fullWidth={true}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person2Outlined />
                      </InputAdornment>
                    ),
                  }}
                  inputProps={{
                    maxLength: 15,
                  }}
                ></TextField>
              )}
            />
            <Controller
              name="company_contact"
              control={control}
              render={({ field: { onChange, ...rest } }) => (
                <TextField
                  {...rest}
                  label="Contato"
                  error={!!errors.company_contact}
                  helperText={errors.company_contact && errors.company_contact.message}
                  onChange={e => maskCellNumber(e.currentTarget.value)}
                  fullWidth={true}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PermContactCalendarOutlined />
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
              name="company_email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  error={!!errors.company_email}
                  helperText={errors.company_email && errors.company_email.message}
                  name="company_email"
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
            <Controller
              name="company_cellphone"
              control={control}
              render={({ field: { onChange, ...rest } }) => (
                <TextField
                  {...rest}
                  label="Telefone"
                  error={!!errors.company_cellphone}
                  helperText={errors.company_cellphone && errors.company_cellphone.message}
                  onChange={e => maskCellNumber(e.currentTarget.value)}
                  fullWidth={true}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person2Outlined />
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
          <Divider variant="inset" />

          <Stack direction={mobile ? "column" : "row"} spacing={2}>
            <Controller
              name="observations"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Observações"
                  error={!!errors.observations}
                  helperText={errors.observations && errors.observations.message}
                  name="observations"
                  fullWidth={true}
                  multiline
                ></TextField>
              )}
            />
            <Controller
              name="expanse"
              control={control}
              render={({ field: { onChange, ...rest } }) => (
                <TextField
                  {...rest}
                  label="Despesas"
                  error={!!errors.expanse}
                  helperText={errors.expanse && errors.expanse.message}
                  onChange={e => maskCellNumber(e.currentTarget.value)}
                  fullWidth={true}
                  multiline
                  inputProps={{
                    maxLength: 15,
                  }}
                ></TextField>
              )}
            />
          </Stack>
        </Stack>
        <Stack spacing={"10px"} mt={3}>
          <Button type="submit" variant="contained">
            {isEditing ? "Editar" : "Salvar"}
          </Button>
        </Stack>
      </form>
    </Grid>
  )
}
