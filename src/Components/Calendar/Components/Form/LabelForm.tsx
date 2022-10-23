import * as React from "react"

import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  useMediaQuery,
} from "@mui/material"

import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { TextField } from "@mui/material"
import { NewspaperOutlined, PhoneOutlined, EmailOutlined, ColorLens } from "@mui/icons-material"
import { Stack } from "@mui/system"
import { useState } from "react"
import { toast } from "react-toastify"
import { useMobile } from "../../../../Provider/Theme/Mobile"
//import { useLabel } from "../../../../Provider/Label/Label"
import uuid from "react-uuid"
import { ILabel } from "../../../../Types/label.type"
import InputColor from "react-input-color"
import { useEffect } from "react"
import { useLabel } from "../../../../Provider/Label/Label"

const schema = yup.object().shape({
  title: yup.string().required("Nome da Label é obrigatório").max(100, "Nome muito grande"),
  color: yup.string().max(150, "Email muito grande").required("Cor da label é obrigatório"),
})

export const LabelForm = ({ toggleDrawer }: any) => {
  const { mobile } = useMobile()
  const [currentLabel, setCurrentLabel] = useState(0)
  const { createLabel, labels } = useLabel()
  const [color, setColor] = useState({} as any)

  useEffect(() => {
    console.log(color.hex)
  }, [color])
  const {
    handleSubmit,
    reset,
    control,
    setValue,
    register,
    formState: { errors },
  } = useForm<ILabel>({ resolver: yupResolver(schema), mode: "all" })

  const submitForm: SubmitHandler<ILabel> = async (data: ILabel) => {
    if (currentLabel) {
      //   const response = await updateLabel({ ...data, id: currentLabel })
      //   toast[response.success ? "success" : "error"](response.message)
      //   if (response.success) {
      //     toggleDrawer()
      //   }
    } else {
      const response = await createLabel(data)
      toast[response.success ? "success" : "error"](response.message)
      if (response.success) {
        toggleDrawer()
      }
    }
    reset()
  }

  const selectColor = color => {
    setColor(color)
    setValue("color", color.hex)
  }
  React.useEffect(() => {
    // if (currentLabel) {
    //   const label = myLabels.find(item => item.id === currentLabel)
    //   if (label) {
    //     setValue("title", label.title)
    //     setValue("cellphone", label.color)
    //   }
    // }
  }, [currentLabel])

  return (
    <Grid padding={8}>
      <form onSubmit={handleSubmit(submitForm)}>
        <Stack spacing={3}>
          <Stack>
            <Typography variant="subtitle1">Preencha com as informações da Label</Typography>
          </Stack>
          <Stack direction={mobile ? "column" : "row"} spacing={2}>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  autoComplete={"false"}
                  label="Título *"
                  error={!!errors.title}
                  helperText={errors?.title && errors?.title?.message}
                  fullWidth={true}
                  name="title"
                  inputProps={{
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
            <Stack gap={1}>
              <label style={{ fontSize: "12px", color: "#505050" }}>Selecione uma cor: &nbsp; *</label>
              <InputColor initialValue="#009955" onChange={selectColor}></InputColor>
            </Stack>
          </Stack>
        </Stack>

        <Stack spacing={"10px"} mt={3}>
          <Button type="submit" variant="contained">
            {currentLabel ? "Atualizar" : " salvar"}
          </Button>
        </Stack>
      </form>
      <Divider style={{ marginTop: "16px" }} />
      <Stack mt={2}>
        <Typography variant="subtitle1">Escolha uma Label caso queira editar</Typography>
      </Stack>
      <Box>
        <FormControl fullWidth={true}>
          <InputLabel>Label *</InputLabel>
          <Select
            sx={{ minWidth: 270 }}
            labelId="demo-simple-select-error-label"
            id="demo-simple-select-error"
            label="Label"
            value={currentLabel}
            onChange={e => {
              setCurrentLabel(e.target.value as number)
            }}
          >
            {/* {myLabels.map(Label => (
              <MenuItem value={Label.id} key={uuid()}>
                {Label.name}
              </MenuItem>
            ))} */}
          </Select>
        </FormControl>
      </Box>
      <Divider variant="inset" />
    </Grid>
  )
}
