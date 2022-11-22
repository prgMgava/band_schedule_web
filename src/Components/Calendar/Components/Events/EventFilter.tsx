import { Circle, Search } from "@mui/icons-material"
import { Button, FormControl, InputLabel, ListItemIcon, MenuItem, Select } from "@mui/material"
import { Box, Stack } from "@mui/system"
import React, { Dispatch, useEffect, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import uuid from "react-uuid"
import { useAppointment } from "../../../../Provider/Appointment/Appointment"
import { useAuth } from "../../../../Provider/Auth/Auth"
import { useBand } from "../../../../Provider/Band/Band"
import { useLabel } from "../../../../Provider/Label/Label"
import { useMobile } from "../../../../Provider/Theme/Mobile"
import { monthList } from "../../Utils/months"
import { statesList } from "../../Utils/states"

interface EventFilterProps {
  setCurrentFilter: Dispatch<React.SetStateAction<Array<string>>>
}

export const EventFilter = ({ setCurrentFilter }: EventFilterProps) => {
  const { mobile } = useMobile()
  const { labels } = useLabel()
  const { myBands } = useBand()
  const { getMyAppointmentsAdvanced } = useAppointment()
  const { id, bandVisibility, adm } = useAuth()
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1)
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<any>({ mode: "onSubmit" })

  const periodWatch = watch("period")
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

    const owner = adm ? parseInt(id) : bandVisibility

    const currentDate = new Date()
    const isMonth = data.period == "1"

    const dataInicial = new Date(isMonth ? currentDate.getFullYear() : data.ano, isMonth ? data.mes - 1 : 0, 1)
    const dataFinal = new Date(isMonth ? currentDate.getFullYear() : data.ano, isMonth ? data.mes : 12, 0)

    const dataInicialFormatada = dataInicial.toISOString().substring(0, 10)
    const dataFinalFormatada = dataFinal.toISOString().substring(0, 10)

    const payload: any = {
      artista: obj.artista || "",
      categoria: obj.categoria || "",
      data_inicial: dataInicialFormatada,
      data_final: dataFinalFormatada,
      estado: obj.estado || "",
    }
    const response = await getMyAppointmentsAdvanced(payload, owner || 0)
    toast[response.success ? "success" : "error"](response.message)
  }

  useEffect(() => {
    setValue("period", "1")
    const currentDate = new Date()

    const owner = adm ? parseInt(id) : bandVisibility

    const dataInicial = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const dataFinal = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

    const dataInicialFormatada = dataInicial.toISOString().substring(0, 10)
    const dataFinalFormatada = dataFinal.toISOString().substring(0, 10)
    const payload: any = {
      artista: "",
      categoria: "",
      data_inicial: dataInicialFormatada,
      data_final: dataFinalFormatada,
      estado: "",
    }
    getMyAppointmentsAdvanced(payload, owner || 0)
  }, [])

  return (
    <>
      <Stack
        alignItems={"center"}
        gap={2}
        direction={mobile ? "column" : "row"}
        component="form"
        onSubmit={handleSubmit(submitForm)}
        overflow="auto"
        p="8px 0"
      >
        <Stack direction={"row"} gap={2} width="100%">
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
        </Stack>
        <Stack direction={"row"} gap={2} width="100%">
          <FormControl fullWidth={true}>
            <InputLabel id="demo-simple-select-helper-label">Categoria</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Categoria"
              size={"small"}
              defaultValue={0}
              {...register("categoria")}
            >
              {labels.map(label => {
                if (!label.is_deleted) {
                  return (
                    <MenuItem value={label.id} key={uuid()}>
                      <ListItemIcon>
                        <Circle sx={{ color: label?.color }} fontSize={"small"} style={{ height: "10px" }} />
                      </ListItemIcon>
                      {label.title}
                    </MenuItem>
                  )
                }
                return <></>
              })}
              <MenuItem value={0} key={uuid()}>
                <ListItemIcon>
                  <Circle sx={{ color: "white" }} fontSize="small" style={{ height: "10px" }} />
                </ListItemIcon>
                todas
              </MenuItem>
            </Select>
          </FormControl>
        </Stack>
        <Stack direction={"row"} gap={2} width="100%">
          <FormControl sx={{ minWidth: 120 }} fullWidth={true}>
            <InputLabel id="demo-simple-select-helper-label">Artista</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Artista"
              size={"small"}
              defaultValue={0}
              {...register("artista")}
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
              <MenuItem value={0} key={uuid()}>
                todos
              </MenuItem>
            </Select>
          </FormControl>

          <FormControl error={!!errors.state} sx={{ minWidth: 120 }} fullWidth={true}>
            <InputLabel id="demo-simple-select-helper-label">Estado</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Estado"
              defaultValue={0}
              {...register("estado")}
              size={"small"}
            >
              {statesList.map((item, index) => (
                <MenuItem value={item.nome} key={uuid()}>
                  {item.nome}
                </MenuItem>
              ))}
              <MenuItem value={0}>todos</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        <Button variant="contained" endIcon={<Search />} type="submit" style={{ width: "100%" }}>
          Buscar
        </Button>
      </Stack>
    </>
  )
}
