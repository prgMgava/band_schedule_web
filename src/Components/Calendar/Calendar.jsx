/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
//TODO: change file to TS
import React, { useEffect, useState } from "react"
import { EditingState, IntegratedEditing, ViewState } from "@devexpress/dx-react-scheduler"
import {
  Scheduler,
  WeekView,
  DayView,
  Appointments,
  Toolbar,
  DateNavigator,
  ViewSwitcher,
  AppointmentTooltip,
  Resources,
  AppointmentForm,
  MonthView,
} from "@devexpress/dx-react-scheduler-material-ui"
import { connectProps } from "@devexpress/dx-react-core"
import { styled } from "@mui/material/styles"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import FormControl from "@mui/material/FormControl"
import { Tooltip } from "./Components/Tooltip"
import { AppointmentForm as CustomAppointmentForm } from "./Components/Form/AppointmentForm"
import { Header } from "./Components/Header/Header"
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack } from "@mui/material"
import { useBand } from "../../Provider/Band/Band"
import { useAuth } from "../../Provider/Auth/Auth"
import { useAppointment } from "../../Provider/Appointment/Appointment"
import { toast } from "react-toastify"
import { useLabel } from "../../Provider/Label/Label"

const PREFIX = "Demo"
export const classes = {
  flexibleSpace: `${PREFIX}-flexibleSpace`,
  prioritySelector: `${PREFIX}-prioritySelector`,
  content: `${PREFIX}-content`,
  contentContainer: `${PREFIX}-contentContainer`,
  text: `${PREFIX}-text`,
  title: `${PREFIX}-title`,
  icon: `${PREFIX}-icon`,
  contentItemIcon: `${PREFIX}-contentItemIcon`,
  grayIcon: `${PREFIX}-grayIcon`,
  colorfulContent: `${PREFIX}-colorfulContent`,
  lens: `${PREFIX}-lens`,
  textCenter: `${PREFIX}-textCenter`,
  dateAndTitle: `${PREFIX}-dateAndTitle`,
  titleContainer: `${PREFIX}-titleContainer`,
  container: `${PREFIX}-container`,
  bullet: `${PREFIX}-bullet`,
  prioritySelectorItem: `${PREFIX}-prioritySelectorItem`,
  priorityText: `${PREFIX}-priorityText`,
  priorityShortText: `${PREFIX}-priorityShortText`,
  cellLowPriority: `${PREFIX}-cellLowPriority`,
  cellMediumPriority: `${PREFIX}-cellMediumPriority`,
  cellHighPriority: `${PREFIX}-cellHighPriority`,
  headerCellLowPriority: `${PREFIX}-headerCellLowPriority`,
  headerCellMediumPriority: `${PREFIX}-headerCellMediumPriority`,
  headerCellHighPriority: `${PREFIX}-headerCellHighPriority`,
}

const StyledToolbarFlexibleSpace = styled(Toolbar.FlexibleSpace)(() => ({
  [`&.${classes.flexibleSpace}`]: {
    margin: "0 auto 0 0",
  },
}))

const StyledFormControl = styled(FormControl)(({ theme: { spacing } }) => ({
  [`&.${classes.prioritySelector}`]: {
    minWidth: 140,
    marginLeft: spacing(2),
    "@media (max-width: 500px)": {
      minWidth: 0,
      fontSize: "0.75rem",
      marginLeft: spacing(0.5),
    },
  },
}))

const StyledPrioritySelectorItem = styled("div")(({ theme: { palette, spacing }, color }) => ({
  [`& .${classes.bullet}`]: {
    backgroundColor: color ? color : palette.divider,
    borderRadius: "50%",
    width: spacing(2),
    height: spacing(2),
    marginRight: spacing(2),
    display: "inline-block",
  },
  [`&.${classes.prioritySelectorItem}`]: {
    display: "flex",
    alignItems: "center",
  },
  [`& .${classes.priorityText}`]: {
    "@media (max-width: 500px)": {
      display: "none",
    },
  },
  [`& .${classes.priorityShortText}`]: {
    "@media (min-width: 500px)": {
      display: "none",
    },
  },
}))

const PrioritySelectorItem = ({ color, text: resourceTitle }) => {
  const text = resourceTitle || "Todos os eventos"
  const shortText = resourceTitle ? text.substring(0, 1) : "Todos"

  return (
    <StyledPrioritySelectorItem className={classes.prioritySelectorItem} color={color}>
      <span className={classes.bullet} />
      <span className={classes.priorityText}>{text}</span>
      <span className={classes.priorityShortText}>{shortText}</span>
    </StyledPrioritySelectorItem>
  )
}

export const Demo = () => {
  const labels = JSON.parse(localStorage.getItem("@BandSchedule:labels")) || []
  !labels?.length && localStorage.setItem("@BandSchedule:labels", "[]")

  const { id } = useAuth()
  const { getMyBands } = useBand()
  const { getLabels } = useLabel()
  const { appointments, getAppointments, deleteAppointment } = useAppointment()
  const [currentViewName, setCurrentViewName] = React.useState("Mensal")
  const [currentPriority, setCurrentPriority] = React.useState(0)
  const [openDialog, setOpenDialog] = useState(false)
  const [deletedAppointment, setDeletedAppointment] = useState(0)
  const [resources, setResources] = React.useState([
    {
      fieldName: "id_label",
      title: "Priority",
      instances: labels,
    },
  ])
  const [closedModal, setClosedModal] = useState(false)
  const [currentDate, setCurrentDate] = React.useState(new Date())
  const closeForm = e => {
    setClosedModal(e)
    return e
  }
  const currentViewNameChange = currentViewName => {
    setCurrentViewName(currentViewName)
  }

  const handleCloseDialog = () => {
    setOpenDialog(old => !old)
  }

  const handleDelete = async () => {
    const response = await deleteAppointment(deletedAppointment)
    toast.error(response.message)
    setOpenDialog(old => !old)
  }

  const currentDateChange = currentDate => {
    setCurrentDate(currentDate)
  }

  const priorityChange = value => {
    const nextResources = [
      {
        ...resources[0],
        instances: value > 0 ? [labels[value - 1]] : labels,
      },
    ]
    setCurrentPriority(value)
    setResources(nextResources)
  }

  const PrioritySelector = ({ priorityChange, priority }) => {
    const currentPriority = labels?.find(item => item.id === priority) || {}
    return (
      <StyledFormControl className={classes.prioritySelector} variant="standard">
        <Select
          disableUnderline
          value={priority}
          onChange={e => {
            priorityChange(e.target.value)
          }}
          renderValue={() => <PrioritySelectorItem text={currentPriority.text} color={currentPriority?.color} />}
        >
          <MenuItem value={0}>
            <PrioritySelectorItem />
          </MenuItem>
          {labels?.map(({ id, color, text }) => (
            <MenuItem value={id} key={id.toString()}>
              <PrioritySelectorItem color={color} text={text} />
            </MenuItem>
          ))}
        </Select>
      </StyledFormControl>
    )
  }

  const FlexibleSpace = ({ priority, priorityChange, ...restProps }) => {
    return (
      <StyledToolbarFlexibleSpace {...restProps} className={classes.flexibleSpace}>
        <PrioritySelector priority={priority} priorityChange={priorityChange} />
      </StyledToolbarFlexibleSpace>
    )
  }
  const TooltipContent = ({ appointmentData, formatDate, appointmentResources }) => {
    return (
      <Tooltip appointmentData={appointmentData} formatDate={formatDate} appointmentResources={appointmentResources} />
    )
  }

  const flexibleSpace = connectProps(FlexibleSpace, () => {
    return {
      priority: currentPriority,
      priorityChange: priorityChange,
    }
  })

  const commitChanges = ({ added, changed, deleted }) => {
    if (deleted) {
      setOpenDialog(true)
      setDeletedAppointment(deleted)
    }
  }

  const CustomFormAppointment = data => {
    return <CustomAppointmentForm data={data} closeForm={closeForm} />
  }

  const HiddenButton = data => {
    return <></>
  }

  React.useEffect(() => {
    flexibleSpace.update()
    getMyBands(id)
    getLabels()
  }, [])

  useEffect(() => {
    getAppointments(currentDate)
  }, [currentDate])

  useEffect(() => {
    // comment
  }, [appointments, labels])

  const TextEditor = props => {
    // eslint-disable-next-line react/destructuring-assignment
    if (props.type === "multilineTextEditor") {
      return null
    }
    return <AppointmentForm.TextEditor {...props} />
  }

  const filterTasks = (items, status) => {
    const appointmentsFiltered = items.filter(task => {
      if (status == "4") {
        return task.id_label == status
      }
      return !status || task.id_label === status
    })

    const appointmentsEdited = appointmentsFiltered.map(appointment => {
      return {
        ...appointment,
        endDate: appointment.end_date,
        startDate: appointment.start_date,
      }
    })

    return appointmentsEdited
  }

  return (
    <>
      <Stack justifyContent={"space-around"} direction="column" alignContent={"space-around"}>
        <Header setCurrentPriority={setCurrentPriority} />
        <Box style={{ background: "white" }}>
          <Scheduler data={filterTasks(appointments, currentPriority)} height={700} locale={"pt-BR"}>
            <ViewState
              currentDate={currentDate}
              currentViewName={currentViewName}
              onCurrentViewNameChange={currentViewNameChange}
              onCurrentDateChange={currentDateChange}
            />

            <DayView intervalCount={2} name="Dia" />
            <WeekView name="Semanal" />

            <MonthView name="Mensal" />

            <Appointments />
            <Resources data={resources} />

            <Toolbar />
            <ViewSwitcher />
            <DateNavigator />
            <EditingState onCommitChanges={commitChanges} onAddedAppointmentChange={commitChanges} />
            <IntegratedEditing />

            <AppointmentTooltip contentComponent={TooltipContent} showOpenButton showCloseButton showDeleteButton />

            <AppointmentForm
              messages={{ afterLabel: "meu deus", commitCommand: "Salvar" }}
              basicLayoutComponent={CustomFormAppointment}
              visible={closedModal}
              onVisibilityChange={closeForm}
              commandButtonComponent={HiddenButton}
              textEditorComponent={TextEditor}
            />
          </Scheduler>
        </Box>
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Esta ação não poderá ser desfeita</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Você tem certeza que deseja excluir o(s) seguinte(s) dados:
              <div>
                <b>Evento: {appointments?.find(item => item.id === deletedAppointment)?.title}</b>
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} autoFocus>
              Cancelar
            </Button>
            <Button onClick={handleDelete} color="error">
              Continua
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </>
  )
}
