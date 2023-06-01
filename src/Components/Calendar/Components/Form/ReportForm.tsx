import * as React from "react"

import { Box, Button, Checkbox, FormControl, FormControlLabel, FormHelperText, Grid, InputLabel, MenuItem, Select, Typography } from "@mui/material"
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
import pdfMake from "pdfmake/build/pdfmake"
import pdfFonts from "pdfmake/build/vfs_fonts"
import { createPdfReport } from "../../../../Utils/pdfModel"
import { ICheckout } from "../../../../Types/checkout.type"
import { IAppointments } from "../../../../Types/appointments.type"
import { createPdfReportByCheckout } from "../../../../Utils/pdfModelByCheckout"
pdfMake.vfs = pdfFonts.pdfMake.vfs
interface ReportFields {
  start_date: Date
  end_date: Date
  id_band: number
  isByCheckout: boolean
}
const schema = yup.object().shape({
  start_date: yup.date().required("Data inicial obrigatório"),
  end_date: yup.date().required("Data inicial obrigatório"),
  id_band: yup.number().required("Banda é obrigatório"),
  isByCheckout: yup.boolean().default(false),
})

interface ReportProps {
  toggleDrawer: () => void
}

export const ReportForm = ({ toggleDrawer }: ReportProps) => {
  const [loading, setLoading] = useState(false)

  const { mobile } = useMobile()
  const { myBands } = useBand()
  const currentDate = new Date()

  const { getCheckoutsByAppointments, getCheckouts } = useCheckout()
  const { getAppointmentsByDate } = useAppointment()

  const createPdf = (listCheckout: ICheckout[], startDate: string, endDate: string, idsAppointments: number[] | null, isByCheckout: boolean) => {
    const pdfCreatorFn = isByCheckout ? createPdfReportByCheckout : createPdfReport
    const pdfGenerator = pdfMake.createPdf(pdfCreatorFn(listCheckout, startDate, endDate, idsAppointments))
    pdfGenerator.open()
    pdfGenerator.download()
  }

  const {
    handleSubmit,
    control,
    formState: { errors },
    register,
    setValue,
  } = useForm<ReportFields>({ resolver: yupResolver(schema), mode: "onSubmit" })

  const submitForm: SubmitHandler<ReportFields> = async (dataForm: ReportFields) => {
    const startDate = dataForm.start_date.toISOString().substring(0, 10)
    const endDate = dataForm.end_date.toISOString().substring(0, 10)
    const idBand = dataForm.id_band
    const isByCheckout = dataForm.isByCheckout
    try {
      toast.warning("Gerando relatório aguarde....")
      setLoading(true)

      if (isByCheckout) {
        const { data: listCheckouts } = await getCheckouts(startDate, endDate, idBand)
        if (listCheckouts.length) {
          createPdf(listCheckouts as ICheckout[], startDate, endDate, null, isByCheckout)

        }
      } else {
        const { data: listAppointments } = await getAppointmentsByDate(startDate, endDate, idBand)
        if (listAppointments.length) {
          const idsAppointments: number[] = listAppointments.map((appointment: IAppointments) => appointment.id)

          const { data: listCheckout } = await getCheckoutsByAppointments(
            startDate,
            endDate,
            dataForm.id_band,
            idsAppointments.join(",")
          )
          if (listCheckout.length) {
            createPdf(listCheckout as ICheckout[], startDate, endDate, idsAppointments, isByCheckout)
          }
          toast.success("Relatório gerado com sucesso")
        }

      }

    } catch (e) {
      console.log(e)
      toast["error"](e)
    } finally {
      setLoading(false)
      toggleDrawer()
    }
  }

  React.useEffect(() => {
    if (myBands.filter(band => !band.is_deleted).length == 1) {
      setValue("id_band", (myBands.find(band => !band.is_deleted)?.id as number) || 0)
    }
  }, [myBands])

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

          <Stack direction={mobile ? "column" : "row"} spacing={2}>
            <FormControlLabel
              control={
                <Controller
                  name={"isByCheckout"}
                  control={control}
                  render={({ field: props }) => (
                    // eslint-disable-next-line react/prop-types
                    <Checkbox {...props} checked={props.value} onChange={e => props.onChange(e.target.checked)} />
                  )}
                />
              }
              label={"Relatório detalhado?"}
            />
          </Stack>
        </Stack>
        <Stack spacing={"10px"} mt={3}>
          <Button type="submit" variant="contained">
            Baixar relatório
          </Button>
        </Stack>
      </form>
    </Grid>
  )
}
