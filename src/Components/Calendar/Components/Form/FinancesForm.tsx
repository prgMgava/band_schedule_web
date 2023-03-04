import * as React from "react"

import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Typography,
} from "@mui/material"
import DescriptionIcon from "@mui/icons-material/Description"
import { useForm, SubmitHandler, Controller, useWatch } from "react-hook-form"
import { ICheckout, ICheckoutForm } from "../../../../Types/checkout.type"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { TextField } from "@mui/material"
import { AttachMoney, NewspaperOutlined, Person } from "@mui/icons-material"
import { Stack } from "@mui/system"
import { useState } from "react"
import { toast } from "react-toastify"
import { useMobile } from "../../../../Provider/Theme/Mobile"
import { useCheckout } from "../../../../Provider/Checkout/Checkout"
import uuid from "react-uuid"
import { useAuth } from "../../../../Provider/Auth/Auth"
import { useBand } from "../../../../Provider/Band/Band"
import { useCreditor } from "../../../../Provider/Creditor/Creditor"

const schema = yup.object().shape({
  value: yup.string().required("Valor é obrigatório"),
  type: yup.string().required("Tipo da movimentação é obrigatório"),
  owner: yup.string().notRequired().nullable(),
  description: yup.string().notRequired().nullable(),
  id_band: yup.number().required("Banda é obrigatório"),
  id_creditor: yup.number().required("Credor é obrigatório"),
  date: yup.date().default(new Date()).notRequired().nullable(),
  appointment_title: yup.string().required("Obrigatório procurar por um evento"),
  appointment_date: yup.date().notRequired().nullable(),
})

interface FinancesProps {
  toggleDrawer: () => void
  data: ICheckout
}

export const FinancesForm = ({ toggleDrawer, data }: FinancesProps) => {
  const { superAdmin, adminList, adm } = useAuth()

  const { mobile } = useMobile()
  const { id: idCheckout } = data
  const { myBands } = useBand()
  const { creditors } = useCreditor()

  const { createCheckout, updateCheckout } = useCheckout()
  const [currentBand, setCurrentBand] = useState(data?.id_band)
  const isEditing = !!idCheckout
  const [maskedMoney, setMaskedMoney] = useState("")
  const [currentType, setCurrentType] = useState(data.type)

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    register,
    getValues,
    setError,
    clearErrors,
  } = useForm<ICheckoutForm>({ resolver: yupResolver(schema), mode: "onSubmit" })

  const typeWatch = useWatch({ control: control, name: "type" })

  const submitForm: SubmitHandler<ICheckout> = async (dataForm: ICheckout) => {
    if (isEditing) {
      const dataFormatted = formatData(dataForm)
      const response = await updateCheckout(dataFormatted, data.id)
      toast[response.success ? "success" : "error"](response.message)
      if (response.success) {
        toggleDrawer()
      }
    } else {
      const dataFormatted = formatData(dataForm)
      const response = await createCheckout(dataFormatted)
      toast[response.success ? "success" : "error"](response.message)
      if (response.success) {
        toggleDrawer()
      }
    }
  }

  const formatData = (data: ICheckout): ICheckout => {
    const money =
      typeof data.value == "string"
        ? data.value
            .replace(".", "")
            .replace(",", ".")
            .replace(/\D\$\s/, "")
        : 0
    const dateFormatted = new Date(
      typeof data.date == "object"
        ? data.date.toISOString().substring(0, 10) + new Date().toISOString().substring(10, 19)
        : ""
    )
    return {
      ...data,
      value: Number(money),
      date: dateFormatted,
    }
  }

  const maskMoney = (value: string) => {
    const onlyDigits = value
      .split("")
      .filter(s => /\d/.test(s))
      .join("")
      .padStart(3, "0")
    const digitsFloat = onlyDigits.slice(0, -2) + "." + onlyDigits.slice(-2)
    value = maskCurrency(digitsFloat)
    setMaskedMoney(value)
  }
  function maskCurrency(valor, locale = "pt-BR", currency = "BRL") {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(valor)
  }

  const searchAppointment = () => {
    const appointmentDate = getValues("appointment_date")
    const appointmentTitle = getValues("appointment_title")
    if (!appointmentTitle) {
      return setError("appointment_title", { message: "Obrigatório procurar por um evento" })
    }
  }

  React.useEffect(() => {
    if (isEditing) {
      setValue("type", data.type)
      setCurrentType(data.type)

      setValue("date", new Date(data.date).toISOString().substring(0, 10))
      maskMoney(data.value.toString())
      setValue("description", data.description)
      setValue("owner", data.owner)
      setValue("id_band", data.id_band)

      setCurrentBand(data.id_band)
    }
  }, [isEditing])

  React.useEffect(() => setValue("value", maskedMoney), [maskedMoney])

  return (
    <Grid padding={mobile ? 2 : 8}>
      <form onSubmit={handleSubmit(submitForm)}>
        <Stack spacing={3}>
          <Stack>
            <Typography variant="subtitle1">Preencha com as informações da entrada/saída</Typography>
          </Stack>
          <Stack direction={mobile ? "column" : "row"} spacing={2}>
            <Controller
              name="value"
              control={control}
              render={({ field: { onChange, ...restField } }) => (
                <TextField
                  {...restField}
                  size="small"
                  autoComplete={"false"}
                  label="Valor *"
                  error={!!errors.value}
                  helperText={errors.value && errors.value.message}
                  fullWidth={true}
                  name="value"
                  onChange={e => maskMoney(e.currentTarget.value)}
                  value={maskedMoney}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoney />
                      </InputAdornment>
                    ),
                  }}
                ></TextField>
              )}
            />
          </Stack>

          <Stack direction={mobile ? "column" : "row"} spacing={2}>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <RadioGroup {...field} defaultValue={currentType}>
                  <FormControlLabel value="1" control={<Radio />} label="Entrada" />
                  <FormControlLabel value="2" control={<Radio />} label="Saída" />
                </RadioGroup>
              )}
            />
          </Stack>
          {!!errors.type && <FormHelperText sx={{ color: "#E34367" }}>{errors.type?.message}</FormHelperText>}
          <Stack>
            <Controller
              name="id_creditor"
              control={control}
              render={({ field }) => (
                <Box>
                  <FormControl error={!!errors.id_creditor} fullWidth={true}>
                    <InputLabel id="demo-simple-select-helper-label">Credor *</InputLabel>
                    <Select
                      size="small"
                      sx={{ minWidth: 270 }}
                      labelId="demo-simple-select-error-label"
                      id="demo-simple-select-error"
                      label="Credor"
                      {...field}
                    >
                      {typeWatch ? (
                        creditors
                          .filter(creditor => (typeWatch == 1 ? creditor.is_supplier : !creditor.is_supplier))
                          .map(creditor => {
                            if (!creditor.is_deleted || isEditing) {
                              return (
                                <MenuItem value={creditor.id} key={uuid()}>
                                  {creditor.name}
                                </MenuItem>
                              )
                            }
                            return <></>
                          })
                      ) : (
                        <></>
                      )}
                    </Select>
                    {!!errors.id_band && <FormHelperText sx={{ color: "#E34367" }}>Selecione uma banda</FormHelperText>}
                  </FormControl>
                </Box>
              )}
            />
          </Stack>
          <Stack direction={mobile ? "column" : "row"} spacing={2}>
            <FormControl fullWidth={true}>
              <fieldset
                style={{
                  border: `${errors.date ? "1px #E34367 solid" : "1px #C0C0C0 solid"}`,
                  borderRadius: "4px",
                }}
              >
                <legend style={{ fontSize: "12px", color: "#696969" }}>Data</legend>
                <Box>
                  <input
                    type={"date"}
                    defaultValue={new Date().toISOString().substring(0, 10)}
                    {...register("date")}
                    style={{ height: "24px", border: "none", outline: "none", width: "100%" }}
                  ></input>
                </Box>
              </fieldset>
            </FormControl>
          </Stack>
          <Stack direction={mobile ? "column" : "row"} spacing={2}>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  autoComplete={"false"}
                  label="Descrição"
                  error={!!errors.description}
                  helperText={errors.description && errors.description.message}
                  fullWidth={true}
                  name="description"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DescriptionIcon />
                      </InputAdornment>
                    ),
                  }}
                ></TextField>
              )}
            />
          </Stack>
          <Stack direction={mobile ? "column" : "row"} spacing={2}>
            <Controller
              name="owner"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  autoComplete={"false"}
                  label="Responsável"
                  error={!!errors.owner}
                  helperText={errors.owner && errors.owner.message}
                  fullWidth={true}
                  name="owner"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                ></TextField>
              )}
            />
          </Stack>
          <Controller
            name="id_band"
            control={control}
            render={({ field }) => (
              <Box>
                <FormControl error={!!errors.id_band} fullWidth={true}>
                  <InputLabel id="demo-simple-select-helper-label">Banda *</InputLabel>
                  <Select
                    size="small"
                    sx={{ minWidth: 270 }}
                    labelId="demo-simple-select-error-label"
                    id="demo-simple-select-error"
                    label="Banda"
                    defaultValue={currentBand}
                    {...field}
                  >
                    {myBands.map(band => {
                      if (!band.is_deleted || isEditing) {
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
          <Divider variant="inset" style={{ marginTop: "10px" }} />
          <Stack marginTop={"12px"}>
            <Typography variant="subtitle1">Procure por um evento</Typography>
          </Stack>
          <Stack direction={mobile ? "column" : "row"} spacing={2}>
            <Controller
              name="appointment_title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Título do evento *"
                  error={!!errors.appointment_title}
                  helperText={errors.appointment_title && errors.appointment_title.message}
                  name="appointment_title"
                  fullWidth={true}
                  size="small"
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
            <FormControl fullWidth={true} size="small">
              <fieldset
                style={{
                  border: `${errors.appointment_date ? "1px #E34367 solid" : "1px #C0C0C0 solid"}`,
                  borderRadius: "4px",
                }}
              >
                <legend style={{ fontSize: "12px", color: "#696969" }}>Data do evento</legend>
                <Box>
                  <input
                    type={"date"}
                    defaultValue={""}
                    {...register("appointment_date")}
                    style={{ height: "24px", border: "none", outline: "none", width: "100%" }}
                  ></input>
                </Box>
              </fieldset>
            </FormControl>
          </Stack>
        </Stack>
        <Stack mt={3}>
          <Button type="button" variant="outlined" color="secondary" onClick={searchAppointment}>
            {"Procurar evento"}
          </Button>
        </Stack>
        <Stack spacing={"10px"} mt={3}>
          <Button type="submit" variant="contained">
            {isEditing ? "Atualizar" : "Salvar"}
          </Button>
        </Stack>
      </form>
    </Grid>
  )
}
