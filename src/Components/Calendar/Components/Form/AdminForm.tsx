import * as React from "react"

import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material"

import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { IAdminFields } from "../../../../Types/form.type"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { TextField } from "@mui/material"
import { NewspaperOutlined, PhoneOutlined, EmailOutlined, LockOpenOutlined } from "@mui/icons-material"
import { Stack } from "@mui/system"
import { useState } from "react"
import { toast } from "react-toastify"
import { useMobile } from "../../../../Provider/Theme/Mobile"
import { useAuth } from "../../../../Provider/Auth/Auth"
import { useBand } from "../../../../Provider/Band/Band"
import uuid from "react-uuid"

const schema = yup.object().shape({
  username: yup.string().required("Username é obrigatório").max(100, "Nome muito grande"),
  email: yup.string().max(150, "Email muito grande").nullable(),
  cellphone: yup.string().max(50, "Telefone muito grande").nullable(),
  password: yup.string().max(20, "Senha Muito grande").required("Senha obrigatória"),
  id_band: yup.string().when("is_musician", (value, campo) => {
    if (value) {
      return campo.required("Banda é obrigatório")
    }
    return campo.notRequired()
  }),
  is_musician: yup.boolean().default(false),
})

interface AdminFormProps {
  isSignup?: boolean
  isUpdating?: boolean
  toggleDrawer?: () => void
}

export const AdminForm = ({ toggleDrawer = () => null, isSignup = false, isUpdating = false }: AdminFormProps) => {
  const { mobile } = useMobile()
  const { signUp, createAdm, adminList, memberList, updateUser, id: userId } = useAuth()
  const [maskedCellPhone, setMaskedCellPhone] = useState("")
  const [id, setId] = useState(0)
  const { superAdmin, id: bandVisibility } = useAuth()

  const { myBands } = useBand()

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
    watch,
  } = useForm<IAdminFields>({ resolver: yupResolver(schema), reValidateMode: "onChange", mode: "onSubmit" })

  const isMusician = watch("is_musician") || false

  const submitForm: SubmitHandler<IAdminFields> = async (data: IAdminFields) => {
    if (isSignup || isMusician) {
      // eslint-disable-next-line prefer-const
      let bandOwner = bandVisibility
      if (isMusician) {
        bandOwner = myBands.find(band => band.id == data.id_band)?.owner || 0
      }
      const response = await signUp(data, bandOwner || 0)
      toast[response.success ? "success" : "error"](response.message)
    } else if (isUpdating) {
      const response = await updateUser(data as any, id)
      toast[response.success ? "success" : "error"](response.message)
      if (response.success) {
        toggleDrawer()
      }
    } else {
      const response = await createAdm(data)
      toast[response.success ? "success" : "error"](response.message)
      if (response.success) {
        toggleDrawer()
      }
    }
  }

  React.useEffect(() => setValue("cellphone", maskedCellPhone), [maskedCellPhone])

  React.useEffect(() => {
    if (isUpdating) {
      const updatedUser = [...memberList, ...adminList].find(item => item.id == userId)
      if (updatedUser) {
        setValue("username", updatedUser.username)
        setValue("cellphone", updatedUser.cellphone)
        maskCellNumber(updatedUser.cellphone)
        setValue("email", updatedUser.email)
        setId(updatedUser.id)
      }
    }
  }, [])

  return (
    <Grid padding={mobile ? 8 : 8}>
      <form onSubmit={handleSubmit(submitForm)} autoComplete="off">
        <Stack spacing={3}>
          <Stack>
            <Typography variant="subtitle1">
              {superAdmin ? "Preencha com as informações do usuário" : "Preencha com as informações do músico"}
            </Typography>
          </Stack>
          <Stack direction={mobile ? "column" : "row"} spacing={2}>
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Username *"
                  autoComplete="nope"
                  error={!!errors.username}
                  helperText={errors.username && errors.username.message}
                  fullWidth={true}
                  name="username"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <NewspaperOutlined />
                      </InputAdornment>
                    ),
                    autoComplete: "nope",
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

          <Stack direction={mobile ? "column" : "row"} spacing={2}>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Senha *"
                  autoComplete="new-password"
                  type={"password"}
                  error={!!errors.password}
                  helperText={errors.password && isUpdating ? "Confirme sua senha" : errors?.password?.message}
                  fullWidth={true}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOpenOutlined />
                      </InputAdornment>
                    ),
                  }}
                ></TextField>
              )}
            />
          </Stack>
        </Stack>
        {superAdmin && (
          <>
            <Stack direction={mobile ? "column" : "row"} spacing={2}>
              <FormControlLabel
                control={
                  <Controller
                    name={"is_musician"}
                    control={control}
                    render={({ field: props }) => (
                      // eslint-disable-next-line react/prop-types
                      <Checkbox {...props} checked={props.value} onChange={e => props.onChange(e.target.checked)} />
                    )}
                  />
                }
                label={"Usuário é músico? (somente leitura)"}
              />
            </Stack>
            {isMusician && (
              <Stack direction={mobile ? "column" : "row"} spacing={2} mt={2}>
                <Controller
                  name="id_band"
                  control={control}
                  render={({ field }) => (
                    <Box>
                      <FormControl error={!!errors.id_band} fullWidth={true}>
                        <InputLabel id="demo-simple-select-helper-label">Banda *</InputLabel>
                        <Select
                          sx={{ minWidth: mobile ? 270 : 310 }}
                          labelId="demo-simple-select-error-label"
                          id="demo-simple-select-error"
                          label="Banda"
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
                        {!!errors.id_band && (
                          <FormHelperText sx={{ color: "#E34367" }}>Selecione uma banda</FormHelperText>
                        )}
                      </FormControl>
                    </Box>
                  )}
                />
              </Stack>
            )}
          </>
        )}

        <Stack spacing={"10px"} mt={3}>
          <Button type="submit" variant="contained">
            {" "}
            {isSignup ? "Cadastrar" : isUpdating ? "Atualizar" : "Salvar"}
          </Button>
        </Stack>

        {/* {isSignup ? (
          <Stack mt={3} fontSize={12} direction="row">
            Não tem cadastro faça seu &nbsp;
            <Link
              underline="none"
              onClick={() => navigate("/")}
              component="button"
              color={"green"}
              fontSize={12}
              fontWeight={800}
            >
              LOGIN
            </Link>
          </Stack>
        ) : (
          <></>
        )} */}
      </form>
    </Grid>
  )
}
