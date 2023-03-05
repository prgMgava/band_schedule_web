import * as React from "react"

import { Box, Button, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, Typography } from "@mui/material"
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Stack } from "@mui/system"
import { useState } from "react"
import { toast } from "react-toastify"
import { useMobile } from "../../../../Provider/Theme/Mobile"
import { useCheckout } from "../../../../Provider/Checkout/Checkout"
import uuid from "react-uuid"
import { useAuth } from "../../../../Provider/Auth/Auth"
import { useBand } from "../../../../Provider/Band/Band"
import { useCreditor } from "../../../../Provider/Creditor/Creditor"
import { useAppointment } from "../../../../Provider/Appointment/Appointment"
interface ReportFields {
  start_date: Date
  end_date: Date
  id_band: number
}
const schema = yup.object().shape({
  start_date: yup.date().required("Data inicial obrigatório"),
  end_date: yup.date().required("Data inicial obrigatório"),
  id_band: yup.number().required("Banda é obrigatório"),
})

interface ReportProps {
  toggleDrawer: () => void
}

export const ReportForm = ({ toggleDrawer }: ReportProps) => {
  const { id } = useAuth()

  const { mobile } = useMobile()
  const { myBands } = useBand()
  const { creditors, getCreditors } = useCreditor()
  const currentDate = new Date()

  const { getCheckoutsByAppointments } = useCheckout()
  const { getAppointmentsByDate } = useAppointment()

  const {
    handleSubmit,
    control,
    formState: { errors },
    register,
  } = useForm<ReportFields>({ resolver: yupResolver(schema), mode: "onSubmit" })

  const submitForm: SubmitHandler<ReportFields> = async (dataForm: ReportFields) => {
    console.log(dataForm)
    const startDate = dataForm.start_date.toISOString().substring(0, 10)
    const endDate = dataForm.end_date.toISOString().substring(0, 10)
    const idBand = dataForm.id_band
    const { data: listAppointments } = await getAppointmentsByDate(startDate, endDate, idBand)
    if (listAppointments.length) {
      const idsAppointments = listAppointments.map(appointment => appointment.id).join(",")

      const response = await getCheckoutsByAppointments(startDate, endDate, dataForm.id_band, idsAppointments)
      console.log(response)
    }
    // toast[response.success ? "success" : "error"](response.message)
    // if (response.success) {
    //   toggleDrawer()
    // }
  }

  return (
    <Grid padding={mobile ? 2 : 8}>
      <form onSubmit={handleSubmit(submitForm)}>
        <Stack spacing={3}>
          <Stack>
            <Typography variant="subtitle1">Preencha com as informações para gerar um relatório</Typography>
          </Stack>
          <Stack direction={mobile ? "column" : "row"} spacing={2}>
            <FormControl fullWidth={true}>
              <fieldset
                style={{
                  border: `${errors.start_date ? "1px #E34367 solid" : "1px #C0C0C0 solid"}`,
                  borderRadius: "4px",
                }}
              >
                <legend style={{ fontSize: "12px", color: "#696969" }}>Data inicial</legend>
                <Box>
                  <input
                    type={"date"}
                    defaultValue={new Date(currentDate.getFullYear(), currentDate.getMonth())
                      .toISOString()
                      .substring(0, 10)}
                    {...register("start_date")}
                    style={{ height: "24px", border: "none", outline: "none", width: "100%" }}
                  ></input>
                </Box>
              </fieldset>
            </FormControl>
          </Stack>
          <Stack direction={mobile ? "column" : "row"} spacing={2}>
            <FormControl fullWidth={true}>
              <fieldset
                style={{
                  border: `${errors.end_date ? "1px #E34367 solid" : "1px #C0C0C0 solid"}`,
                  borderRadius: "4px",
                }}
              >
                <legend style={{ fontSize: "12px", color: "#696969" }}>Data final</legend>
                <Box>
                  <input
                    type={"date"}
                    defaultValue={new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
                      .toISOString()
                      .substring(0, 10)}
                    {...register("end_date")}
                    style={{ height: "24px", border: "none", outline: "none", width: "100%" }}
                  ></input>
                </Box>
              </fieldset>
            </FormControl>
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
                    defaultValue={
                      myBands.filter(band => !band.is_deleted).length == 1
                        ? myBands.find(band => !band.is_deleted)?.id
                        : 0
                    }
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
            Imprimir
          </Button>
        </Stack>
      </form>
    </Grid>
  )
}
