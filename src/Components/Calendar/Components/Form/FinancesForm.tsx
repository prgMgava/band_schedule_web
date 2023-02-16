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
import DescriptionIcon from '@mui/icons-material/Description';
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { ICheckout, ICheckoutFields } from "../../../../Types/checkout.type"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { TextField } from "@mui/material"
import { NewspaperOutlined, PhoneOutlined, EmailOutlined, AttachMoney, Person } from "@mui/icons-material"
import { Stack } from "@mui/system"
import { useState } from "react"
import { toast } from "react-toastify"
import { useMobile } from "../../../../Provider/Theme/Mobile"
import { useCheckout } from "../../../../Provider/Checkout/Checkout"
import uuid from "react-uuid"
import { useAuth } from "../../../../Provider/Auth/Auth"
import { removeMaskNumber } from "../../../../Utils/masks"
import { useBand } from "../../../../Provider/Band/Band";

const schema = yup.object().shape({
  value: yup.string().required('Valor é obrigatório'),
  type: yup.string().required('Tipo da movimentação é obrigatório'),
  owner: yup.string().notRequired(),
  description: yup.string().notRequired(),
  id_band: yup.number().required('Banda é obrigatório'),
  date: yup.date().default(new Date()).notRequired(),

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


  const { createCheckout, updateCheckout, checkouts } = useCheckout()
  const [currentBand, setCurrentBand] = useState(data?.id_band)
  const isEditing = !!idCheckout
  const [maskedMoney, setMaskedMoney] = useState("")


  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    register,
    getValues,
  } = useForm<ICheckout>({ resolver: yupResolver(schema), mode: "onSubmit" })

  const submitForm: SubmitHandler<ICheckout> = async (data: ICheckout) => {
    if (isEditing) {
      // const response = await updateCheckout({ ...data, id: currentCheckout })
      // toast[response.success ? "success" : "error"](response.message)
      // if (response.success) {
      //   toggleDrawer()
      // }
    } else {
      const dataFormatted = formatData(data)
      console.log(data)
      const response = await createCheckout(dataFormatted)
      toast[response.success ? "success" : "error"](response.message)
      if (response.success) {
        toggleDrawer()
      }
    }
  }

  const formatData = (data: ICheckout): ICheckout => {
    const money = typeof data.value == "string" ? data.value.replace(".", "").replace(",", ".").replace(/\D\$\s/, "") : 0
    return {
      ...data,
      value: Number(money),
      date: typeof data.date == "object" ? data.date.toISOString().substring(0, 19) : ""
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
  function maskCurrency(valor, locale = 'pt-BR', currency = 'BRL') {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency
    }).format(valor)
  }

  function getMoney(str) {
    return parseInt(str.replace(/[\D]+/g, ''));
  }
  function formatReal(int) {
    let tmp = int + '';
    tmp = tmp.replace(/([0-9]{2})$/g, ",$1");
    if (tmp.length > 6)
      tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");

    return tmp;
  }

  React.useEffect(() => {
    // if (currentCheckout) {
    //   const band = checkouts.find(item => item.id === currentCheckout)
    //   if (band) {
    //     setValue("name", band.name)
    //     setValue("cellphone", band.cellphone)
    //     maskCellNumber(band.cellphone)
    //     setValue("email", band.email)
    //   }
    // }
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
                <RadioGroup {...field}>
                  <FormControlLabel
                    value="1"
                    control={<Radio />}
                    label="Entrada"
                  />
                  <FormControlLabel
                    value="2"
                    control={<Radio />}
                    label="Saída"
                  />
                </RadioGroup>
              )}
            />

          </Stack>
          {!!errors.type && <FormHelperText sx={{ color: "#E34367" }}>{errors.type?.message}</FormHelperText>}
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
