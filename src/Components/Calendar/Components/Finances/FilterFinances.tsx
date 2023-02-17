import { Search } from "@mui/icons-material"
import { Button, FormControl, FormHelperText, IconButton, InputLabel, MenuItem, Select } from "@mui/material"
import { Box, Stack } from "@mui/system"
import React, { Dispatch, useEffect } from "react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import uuid from "react-uuid"
import { useAppointment } from "../../../../Provider/Appointment/Appointment"
import { useAuth } from "../../../../Provider/Auth/Auth"
import { useBand } from "../../../../Provider/Band/Band"
import { useMobile } from "../../../../Provider/Theme/Mobile"
import { IBand } from "../../../../Types/band.type"
import { monthList } from "../../Utils/months"
import { useCheckout } from '../../../../Provider/Checkout/Checkout'

interface FilterFinancesProps {
  setCurrentFilter: Dispatch<React.SetStateAction<Array<string>>>
}

export const FilterFinances = ({ setCurrentFilter }: FilterFinancesProps) => {
  const { mobile } = useMobile()
  const { myBands, getMyBands, setCurrentBand } = useBand()
  const { getMyAppointmentsAdvanced } = useAppointment()
  const { id, bandVisibility, adm } = useAuth()
  const currentMonth = new Date().getMonth() + 1
  const { getCheckouts, setCurrentDate } = useCheckout()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    control
  } = useForm<any>({ mode: "onSubmit" })

  const idBandWatch = watch("id_band")

  const submitForm: SubmitHandler<any> = async data => {
    setCurrentFilter([])
    const obj: any = {}
    Object.keys(data).map(key => {
      if (parseInt(data[key]) > 0) {
        obj[key] = data[key]
      }
    })
    data.estado != "0" && (obj.estado = data.estado)

    Object.keys(obj).map(key => setCurrentFilter(old => [...old, key]))

    const currentDate = new Date()

    const dataInicial = new Date(currentDate.getFullYear(), data.mes - 1)
    const dataFinal = new Date(currentDate.getFullYear(), data.mes, 0)
    setCurrentDate(dataInicial)
    const dataInicialFormatada = dataInicial.toISOString().substring(0, 10)
    const dataFinalFormatada = dataFinal.toISOString().substring(0, 10)
    const response = await getCheckouts(dataInicialFormatada, dataFinalFormatada, data.id_band)

    toast[response.success ? "success" : "error"](response.message)
  }

  useEffect(() => {
    setValue("period", "1")
    getMyBands()
    setCurrentDate(new Date())

  }, [])

  useEffect(() => {
    if (idBandWatch) {
      setCurrentBand(myBands.find(band => band.id == idBandWatch)?.name || '')
    }
  }, [idBandWatch])

  useEffect(() => {
    console.log(myBands)
    console.log(myBands.filter(band => !band.is_deleted))

    if (myBands.filter(band => !band.is_deleted).length == 1) {
      const currentDate = new Date()

      const dataInicial = new Date(currentDate.getFullYear(), new Date().getMonth())
      const dataFinal = new Date(currentDate.getFullYear(), new Date().getMonth() + 1, 0)
      setCurrentDate(dataInicial)
      const dataInicialFormatada = dataInicial.toISOString().substring(0, 10)
      const dataFinalFormatada = dataFinal.toISOString().substring(0, 10)

      getCheckouts(dataInicialFormatada, dataFinalFormatada, myBands.filter(band => !band.is_deleted)[0].id)
    }
  }, [myBands])

  return (
    <>
      <Stack
        alignItems={"center"}
        gap={2}
        direction={mobile ? "column" : "row"}
        component="form"
        onSubmit={handleSubmit(submitForm)}
        p="8px 0"
        display={'flex'}
        justifyContent="end"
      >
        <Box width={mobile ? "300px" : "600px"} display="flex" gap={1} justifyContent={mobile ? "center" : "end"}>
          <Stack direction={mobile ? "column" : "row"} gap={1} alignItems={"center"} justifyContent="center">
            {/* <FormControl error={!!errors.period} sx={{ minWidth: 120 }} fullWidth={true}>
              <InputLabel id="demo-simple-select-helper-label">Período</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Período"
                defaultValue={"1"}
                size={"small"}
                {...register("period")}
              >
                <MenuItem value={"1"}>MÊS</MenuItem>
                <MenuItem value={"2"}>ANO</MenuItem>
              </Select>
            </FormControl> */}
            <FormControl sx={{ minWidth: 120 }} fullWidth={true}>
              <InputLabel id="demo-simple-select-helper-label">Mês</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Mês"
                {...register("mes")}
                size={"small"}
                defaultValue={currentMonth}
              >
                {monthList.map((item, index) => (
                  <MenuItem value={item.id} key={index}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* {periodWatch == "1" ? (
              <div></div>
            ) : (
              <Box>
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel id="demo-simple-select-helper-label">Ano</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Ano"
                    {...register("ano")}
                    defaultValue={currentYear}
                    size={"small"}
                  >
                    {range(currentYear, currentYear - 20, -1).map((item, index) => (
                      <MenuItem value={item} key={index}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )} */}

            <Controller
              name="id_band"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Box>
                  <FormControl error={!!errors.id_band} >
                    <InputLabel id="demo-simple-select-helper-label">Banda *</InputLabel>
                    <Select
                      size="small"
                      sx={{ minWidth: 270 }}
                      labelId="demo-simple-select-error-label"
                      id="demo-simple-select-error"
                      label="Banda"
                      defaultValue={myBands.filter(band => !band.is_deleted).length == 1 ? myBands.filter(band => !band.is_deleted)[0].id : ""}
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
                    {!!errors.id_band && <FormHelperText sx={{ color: "#E34367" }}>Selecione uma banda</FormHelperText>}
                  </FormControl>
                </Box>
              )}
            />

            {mobile ? (
              <Button variant="contained" endIcon={<Search />} type="submit" style={{ width: "100%" }}>
                Buscar
              </Button>
            ) : (

              <IconButton aria-label="delete" type="submit" style={{ backgroundColor: "#42A5F5", color: "white", height: "40px" }}>
                <Search />
              </IconButton>
            )}
          </Stack>
        </Box>
      </Stack>
    </>
  )
}
