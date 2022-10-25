import * as React from "react"

import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  ListItemIcon,
  MenuItem,
  Select,
  Typography,
} from "@mui/material"

import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { TextField } from "@mui/material"
import { NewspaperOutlined, Circle } from "@mui/icons-material"
import { Stack } from "@mui/system"
import { useState } from "react"
import { toast } from "react-toastify"
import { useMobile } from "../../../../Provider/Theme/Mobile"
import uuid from "react-uuid"
import { ILabel } from "../../../../Types/label.type"
import InputColor from "react-input-color"
import { useLabel } from "../../../../Provider/Label/Label"

const schema = yup.object().shape({
  title: yup.string().required("Nome da Label é obrigatório").max(100, "Nome muito grande"),
  color: yup.string().max(20, "Cor muito grande").required("Cor da label é obrigatório"),
})

interface LabelProps {
  toggleDrawer: () => void
}

export const LabelForm = ({ toggleDrawer }: LabelProps) => {
  const { mobile } = useMobile()
  const [currentLabel, setCurrentLabel] = useState(0)
  const { createLabel, labels, updateLabel } = useLabel()
  const [initialColor, setInitialColor] = useState("#009955")

  const {
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<ILabel>({ resolver: yupResolver(schema), mode: "all" })

  const submitForm: SubmitHandler<ILabel> = async (data: ILabel) => {
    if (currentLabel) {
      const response = await updateLabel({ ...data, id: currentLabel })
      toast[response.success ? "success" : "error"](response.message)
      if (response.success) {
        toggleDrawer()
      }
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
    setValue("color", color.hex)
  }
  React.useEffect(() => {
    if (currentLabel) {
      const label = labels.find(item => item.id === currentLabel)
      if (label) {
        setValue("title", label.title)
        setValue("color", label?.color)
        setInitialColor(label?.color)
      }
    }
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
                  label="Título *"
                  error={!!errors.title}
                  helperText={errors?.title && errors?.title?.message}
                  fullWidth={true}
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
          </Stack>
          <Stack direction={mobile ? "column" : "row"} spacing={2}>
            <Stack gap={1}>
              <label style={{ fontSize: "12px", color: "#505050" }}>Selecione uma cor: &nbsp; *</label>
              <InputColor initialValue={initialColor} onChange={selectColor}></InputColor>
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
            {labels.map(label => (
              <MenuItem value={label.id} key={uuid()}>
                <ListItemIcon>
                  <Circle sx={{ color: label?.color }} />
                </ListItemIcon>
                {label.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Divider variant="inset" />
    </Grid>
  )
}
