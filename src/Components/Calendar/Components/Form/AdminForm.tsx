import * as React from "react"

import { Button, Grid, InputAdornment, Link, Typography, useMediaQuery, useTheme } from "@mui/material"

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
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../../../Provider/Auth/Auth"

const schema = yup.object().shape({
  username: yup.string().required("Username é obrigatório").max(100, "Nome muito grande"),
  email: yup.string().max(150, "Email muito grande"),
  cellphone: yup.string().max(50, "Telefone muito grande"),
  password: yup.string().max(20, "Senha Muito grande").required("Senha obrigatória"),
})

export const AdminForm = ({ toggleDrawer, isSignup = false }: any) => {
  const { mobile } = useMobile()
  const navigate = useNavigate()
  const { signUp, createAdm } = useAuth()
  const [maskedCellPhone, setMaskedCellPhone] = useState("")

  const maskCellNumber = value => {
    value = value.replace(/\D/g, "")
    value = value.replace(/(\d{2})(\d)/, "($1) $2")
    value = value.replace(/(\d{4,5})(\d)/, "$1-$2")
    setMaskedCellPhone(value)
  }

  const {
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<IAdminFields>({ resolver: yupResolver(schema), reValidateMode: "onChange", mode: "onSubmit" })

  const submitForm: SubmitHandler<IAdminFields> = async (data: IAdminFields) => {
    if (isSignup) {
      const response = await signUp(data)
      toast[response.success ? "success" : "error"](response.message)
      if (response.success) {
        navigate("/")
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

  return (
    <Grid padding={mobile ? "" : 8}>
      <form onSubmit={handleSubmit(submitForm)} autoComplete="off">
        <Stack spacing={3}>
          {!isSignup ? (
            <Stack>
              <Typography variant="subtitle1">Preencha com as informações do administrador</Typography>
            </Stack>
          ) : (
            <></>
          )}
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
                  helperText={errors.password && errors.password.message}
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

        <Stack spacing={"10px"} mt={3}>
          <Button type="submit" variant="contained">
            {" "}
            {isSignup ? "Cadastrar" : "Salvar"}
          </Button>
        </Stack>

        {isSignup ? (
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
        )}
      </form>
    </Grid>
  )
}
