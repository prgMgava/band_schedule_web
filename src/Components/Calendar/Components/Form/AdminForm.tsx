import * as React from "react"

import { Button, Grid, InputAdornment, Typography, useMediaQuery, useTheme } from "@mui/material"

import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { IAdminFields, IBandFields } from "../../../../Types/form.type"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { TextField } from "@mui/material"
import { NewspaperOutlined, PhoneOutlined, EmailOutlined, LockOpenOutlined } from "@mui/icons-material"
import { Stack } from "@mui/system"
import { useState } from "react"
import { toast } from "react-toastify"

const schema = yup.object().shape({
  username: yup.string().required("Nome da Banda é obrigatório").max(100, "Nome muito grande"),
  email: yup.string().max(150, "Email muito grande"),
  cellphone: yup.string().max(50, "Telefone muito grande"),
  password: yup.string().max(20, "Senha Muito grande").required("Senha obrigatória"),
})

export const AdminForm = () => {
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down("sm"))
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
  } = useForm<IAdminFields>({ resolver: yupResolver(schema), mode: "all" })

  const submitForm: SubmitHandler<IAdminFields> = (data: IAdminFields) => {
    console.log(data)
    toast.success("Administrador adicionado com sucesso")
    reset()
  }

  React.useEffect(() => setValue("cellphone", maskedCellPhone), [maskedCellPhone])

  return (
    <Grid padding={mobile ? "" : 8}>
      <form onSubmit={handleSubmit(submitForm)} autoComplete="off">
        <Stack spacing={3}>
          <Stack>
            <Typography variant="subtitle1">Preencha com as informações do administrador</Typography>
          </Stack>
          <Stack direction={mobile ? "column" : "row"} spacing={2} justifyContent="center">
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
          <Stack direction={mobile ? "column" : "row"} spacing={2} justifyContent="center">
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
          <Stack direction={mobile ? "column" : "row"} spacing={2} justifyContent="center">
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  error={!!errors.email}
                  helperText={errors.email && errors.email.message}
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
          <Stack direction={mobile ? "column" : "row"} spacing={2} justifyContent="center">
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Senha"
                  autoComplete="new-password"
                  type={"password"}
                  error={!!errors.password}
                  helperText={errors.password && errors.password.message}
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
            Salvar
          </Button>
        </Stack>
      </form>
    </Grid>
  )
}