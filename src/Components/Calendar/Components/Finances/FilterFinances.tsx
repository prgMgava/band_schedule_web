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

interface FilterFinancesProps {
  setCurrentFilter: Dispatch<React.SetStateAction<Array<string>>>
}

export const FilterFinances = ({ setCurrentFilter }: FilterFinancesProps) => {
  const { mobile } = useMobile()
  const { myBands, getMyBands, setCurrentBand } = useBand()
  const { getMyAppointmentsAdvanced } = useAppointment()
  const { id, bandVisibility, adm } = useAuth()
  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    control
  } = useForm<any>({ mode: "onSubmit" })

  const periodWatch = watch("period")
  const idBandWatch = watch("id_band")

  const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step)

  const submitForm: SubmitHandler<any> = async data => {
    setCurrentFilter([])
    const obj: any = {}
    Object.keys(data).map(key => {
      if (parseInt(data[key]) > 0) {
        obj[key] = data[key]
      }
    })
    data.estado != "0" && (obj.estado = data.estado)
    if (obj.period == "1") {
      delete obj.ano
    } else {
      delete obj.mes
    }
    delete obj.period

    Object.keys(obj).map(key => setCurrentFilter(old => [...old, key]))

    const owner = adm ? id : bandVisibility

    const currentDate = new Date()
    const isMonth = data.period == "1"

    const dataInicial = new Date(isMonth ? currentDate.getFullYear() : data.ano, isMonth ? data.mes - 1 : 0, 1)
    const dataFinal = new Date(isMonth ? currentDate.getFullYear() : data.ano, isMonth ? data.mes : 12, 0)

    const dataInicialFormatada = dataInicial.toISOString().substring(0, 10)
    const dataFinalFormatada = dataFinal.toISOString().substring(0, 10)

    const payload: any = {
      data_inicial: dataInicialFormatada,
      data_final: dataFinalFormatada,
    }
    const response = await getMyAppointmentsAdvanced(payload, owner || 0)
    toast[response.success ? "success" : "error"](response.message)
  }

  useEffect(() => {
    setValue("period", "1")
    const currentDate = new Date()

    const owner = adm ? id : bandVisibility

    const dataInicial = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const dataFinal = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

    const dataInicialFormatada = dataInicial.toISOString().substring(0, 10)
    const dataFinalFormatada = dataFinal.toISOString().substring(0, 10)
    const payload: any = {
      data_inicial: dataInicialFormatada,
      data_final: dataFinalFormatada,
    }

    getMyBands()
    //getMyAppointmentsAdvanced(payload, owner || 0)
  }, [])

  useEffect(() => {
    if (idBandWatch) {
      setCurrentBand(myBands.find(band => band.id == idBandWatch)?.name || '')
    }
  }, [idBandWatch])

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
        <Box width={"600px"} display="flex" gap={1}>
          <Stack direction={mobile ? "column" : "row"} gap={1}>
            <FormControl error={!!errors.period} sx={{ minWidth: 120 }} fullWidth={true}>
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
            </FormControl>
            {periodWatch == "1" ? (
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
            )}

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
                      defaultValue={myBands.length == 1 ? myBands[0].id : ""}
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

          </Stack>
          <IconButton aria-label="delete" type="submit" style={{ backgroundColor: "#42A5F5", color: "white", height: "40px" }}>
            <Search />
          </IconButton>
        </Box>
      </Stack>
    </>
  )
}
