import { Card, Box, Stack, Link } from "@mui/material"
import React, { useEffect } from "react"
import { AdminForm } from "../Components/Calendar/Components/Form/AdminForm"

import { Button, Grid, InputAdornment, Typography, useMediaQuery, useTheme } from "@mui/material"

import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { TextField } from "@mui/material"
import { NewspaperOutlined, PhoneOutlined, EmailOutlined, LockOpenOutlined } from "@mui/icons-material"
import { useState } from "react"
import { toast } from "react-toastify"
import { ILoginFields } from "../Types/form.type"
import { useMobile } from "../Provider/Auth/Mobile"
import { useAuth } from "../Provider/Auth/Auth"
import { Navigate, useLocation, useNavigate } from "react-router-dom"

const schema = yup.object().shape({
  username: yup.string().required("Nome da Banda é obrigatório").max(100, "Nome muito grande"),
  password: yup.string().max(20, "Senha Muito grande").required("Senha obrigatória"),
})

export const Login = () => {
  const { mobile } = useMobile()
  const { signIn, accessToken } = useAuth()
  const navigate = useNavigate()
  const {
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<ILoginFields>({ resolver: yupResolver(schema), mode: "all" })

  const submitForm: SubmitHandler<ILoginFields> = async ({ password, username }: ILoginFields) => {
    signIn({ password, username })
    toast.success("Login com sucesso")
    reset()
  }

  useEffect(() => {
    if (accessToken) {
      navigate("/calendar")
    }
  }, [accessToken])
  return (
    <Stack justifyContent={"center"} height={"100vh"} alignItems="center">
      <Card style={{ maxWidth: "500px" }}>
        <Grid padding={mobile ? "" : 8}>
          <form onSubmit={handleSubmit(submitForm)} autoComplete="off">
            <Stack spacing={3}>
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
                Login
              </Button>
            </Stack>

            <Stack mt={3} fontSize={12} direction="row">
              Não tem cadastro faça seu &nbsp;
              <Link
                underline="none"
                onClick={() => navigate("/signup")}
                component="button"
                color={"green"}
                fontSize={12}
                fontWeight={800}
              >
                CADASTRO
              </Link>
            </Stack>
          </form>
        </Grid>
      </Card>
    </Stack>
  )
}
