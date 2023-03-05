import * as React from "react"

import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  InputLabel,
  ListItemIcon,
  MenuItem,
  Select,
  Typography,
} from "@mui/material"

import { useForm, SubmitHandler, Controller, useWatch } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { TextField } from "@mui/material"
import { NewspaperOutlined, Circle, Label } from "@mui/icons-material"
import { Stack } from "@mui/system"
import { useState } from "react"
import { toast } from "react-toastify"
import { useMobile } from "../../../../Provider/Theme/Mobile"
import uuid from "react-uuid"
import InputColor from "react-input-color"
import { useCreditor } from "../../../../Provider/Creditor/Creditor"
import { ICreditor } from "../../../../Types/creditor.type"

const schema = yup.object().shape({
  name: yup.string().required("Nome do credor é obrigatório").max(250, "Nome muito grande"),
  is_supplier: yup.boolean().notRequired().default(false),
})

interface CreditorProps {
  toggleDrawer: () => void
}

export const CreditorForm = ({ toggleDrawer }: CreditorProps) => {
  const { mobile } = useMobile()
  const [currentCreditor, setCurrentCreditor] = useState(0)
  const { createCreditor, creditors, updateCreditor } = useCreditor()
  const [initialColor, setInitialColor] = useState("#009955")

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<ICreditor>({ resolver: yupResolver(schema), mode: "all" })

  const submitForm: SubmitHandler<ICreditor> = async (data: ICreditor) => {
    if (currentCreditor) {
      const response = await updateCreditor({ ...data, id: currentCreditor })
      toast[response.success ? "success" : "error"](response.message)

      if (response.success) {
        toggleDrawer()
      }
    } else {
      const response = await createCreditor(data)
      toast[response.success ? "success" : "error"](response.message)
      if (response.success) {
        toggleDrawer()
      }
    }
  }

  React.useEffect(() => {
    if (currentCreditor) {
      const creditor = creditors.find(item => item.id === currentCreditor)
      if (creditor) {
        setValue("name", creditor.name)
        setValue("is_supplier", creditor.is_supplier)
      }
    }
  }, [currentCreditor])

  return (
    <Grid padding={mobile ? 2 : 8}>
      <form onSubmit={handleSubmit(submitForm)}>
        <Stack spacing={3}>
          <Stack>
            <Typography variant="subtitle1">Preencha com as informações do credor</Typography>
          </Stack>
          <Stack direction={mobile ? "column" : "row"} spacing={2}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nome *"
                  error={!!errors.name}
                  helperText={errors?.name && errors?.name?.message}
                  fullWidth={true}
                  name="name"
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
            <FormControlLabel
              control={
                <Controller
                  name={"is_supplier"}
                  control={control}
                  render={({ field: props }) => (
                    // eslint-disable-next-line react/prop-types
                    <Checkbox {...props} checked={props.value} onChange={e => props.onChange(e.target.checked)} />
                  )}
                />
              }
              label={"É fornecedor?"}
            />
          </Stack>
        </Stack>

        <Stack spacing={"10px"} mt={3}>
          <Button type="submit" variant="contained">
            {currentCreditor ? "Atualizar" : " salvar"}
          </Button>
        </Stack>
      </form>
      <Divider style={{ marginTop: "16px" }} />
      <Stack mt={2}>
        <Typography variant="subtitle1">Escolha um credor caso queira editar</Typography>
      </Stack>
      <Box>
        <FormControl fullWidth={true}>
          <InputLabel>Credor *</InputLabel>
          <Select
            sx={{ minWidth: 270 }}
            labelId="demo-simple-select-error-label"
            id="demo-simple-select-error"
            label="Credor"
            value={currentCreditor}
            onChange={e => {
              setCurrentCreditor(e.target.value as number)
            }}
          >
            {creditors.map(creditor => {
              if (!creditor.is_deleted) {
                return (
                  <MenuItem value={creditor.id} key={uuid()}>
                    {creditor.name}
                  </MenuItem>
                )
              }
              return <></>
            })}
          </Select>
        </FormControl>
      </Box>
      <Divider variant="inset" />
    </Grid>
  )
}
