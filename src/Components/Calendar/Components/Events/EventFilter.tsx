import { Circle, Search } from "@mui/icons-material"
import { Button, FormControl, InputLabel, ListItemIcon, MenuItem, Select } from "@mui/material"
import { Box, Stack } from "@mui/system"
import React, { useEffect, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import uuid from "react-uuid"
import { useBand } from "../../../../Provider/Band/Band"
import { useLabel } from "../../../../Provider/Label/Label"
import { useMobile } from "../../../../Provider/Theme/Mobile"
import { monthList } from "../../Utils/months"
import { statesList } from "../../Utils/states"

export const EventFilter = () => {
  const { mobile } = useMobile()
  const { labels } = useLabel()
  const { myBands } = useBand()
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
    const obj = {}
    Object.keys(data).map(key => {
      if (parseInt(data[key]) > 0) {
        obj[key] = data[key]
      }
    })
  }

  useEffect(() => {
    setValue("period", "1")
  }, [])

  return (
    <>
      <Stack
        alignItems={"center"}
        gap={2}
        direction={mobile ? "column" : "row"}
        component="form"
        onSubmit={handleSubmit(submitForm)}
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
            <FormControl error={!!errors.month} sx={{ minWidth: 120 }} fullWidth={true}>
              <InputLabel id="demo-simple-select-helper-label">Mês</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Mês"
                {...register("month")}
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
              <FormControl error={!!errors.year} sx={{ minWidth: 120 }}>
                <InputLabel id="demo-simple-select-helper-label">Ano</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Ano"
                  {...register("year")}
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
          <FormControl error={!!errors.label} fullWidth={true}>
            <InputLabel id="demo-simple-select-helper-label">Categoria</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Categoria"
              size={"small"}
              defaultValue={0}
              {...register("label")}
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
          <FormControl error={!!errors.band} sx={{ minWidth: 120 }} fullWidth={true}>
            <InputLabel id="demo-simple-select-helper-label">Artista</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Artista"
              size={"small"}
              defaultValue={0}
              {...register("band")}
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
              {...register("state")}
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
