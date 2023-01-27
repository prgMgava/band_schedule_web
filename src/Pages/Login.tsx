import { Card, Stack, Box } from "@mui/material"
import React, { useEffect } from "react"

import { Button, Grid, InputAdornment } from "@mui/material"

import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { TextField } from "@mui/material"
import { NewspaperOutlined, LockOpenOutlined } from "@mui/icons-material"
import { toast } from "react-toastify"
import { ILoginFields } from "../Types/form.type"
import { useMobile } from "../Provider/Theme/Mobile"
import { useAuth } from "../Provider/Auth/Auth"
import { useNavigate } from "react-router-dom"

const schema = yup.object().shape({
  username: yup.string().required("Username é obrigatório").max(100, "Nome muito grande"),
  password: yup.string().max(20, "Senha Muito grande").required("Senha obrigatória"),
})

const Login = () => {
  const { mobile } = useMobile()
  const { signIn, accessToken } = useAuth()
  const navigate = useNavigate()
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ILoginFields>({ resolver: yupResolver(schema), mode: "all" })

  const submitForm: SubmitHandler<ILoginFields> = async ({ password, username }: ILoginFields) => {
    const response = await signIn({ password, username })

    toast[response.success ? "success" : "error"](response.message)
  }

  useEffect(() => {
    if (accessToken) {
      navigate("/calendar")
    }
  }, [accessToken])
  return (
    <Stack justifyContent={"center"} height={"100vh"} alignItems="center" bgcolor={"#DDDDDD"}>
      <Card style={{ maxWidth: "500px" }}>
        <Box height="80px" justifySelf={"flex-start"} textAlign="center" mt={2}>
          <img
            className="lazyload"
            src={require("../assets/low-logo.webp")}
            data-src={require("../assets/images/logo.png")}
            alt="logo"
            style={{ height: "90%" }}
          />
        </Box>
        <Grid padding={"16px 64px 64px 64px"}>
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

            {/* <Stack mt={3} fontSize={12} direction="row">
              Não tem cadastro faça seu &nbsp;
              <Link
                underline="none"
                onClick={() => navigate("/signup")}
                component="button"
                color={"#EB3136"}
                fontSize={12}
                fontWeight={800}
              >
                CADASTRO
              </Link>
            </Stack> */}
          </form>
        </Grid>
      </Card>
    </Stack>
  )
}

export default Login
