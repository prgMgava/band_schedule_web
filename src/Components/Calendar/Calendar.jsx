/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react/prop-types */
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
  ConfirmationDialog,
} from "@devexpress/dx-react-scheduler-material-ui"
import { connectProps } from "@devexpress/dx-react-core"
import { styled } from "@mui/material/styles"
import Paper from "@mui/material/Paper"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Grid from "@mui/material/Grid"
import FormControl from "@mui/material/FormControl"
import { priorities } from "../../demo-data/tasks"
import { Tooltip } from "./Components/Tooltip"
import { AppointmentForm as CustomAppointmentForm } from "./Components/Form/AppointmentForm"
import { useForm } from "react-hook-form"
import { Header } from "./Components/Header/Header"
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack } from "@mui/material"
import { useBand } from "../../Provider/Band/Band"
import { useAuth } from "../../Provider/Auth/Auth"
import { useAppointment } from "../../Provider/Appointment/Appointment"
import { IAppointments } from "../../Types/appointments.type"
import { toast } from "react-toastify"

const filterTasks = (items, status) => {
  const appointmentsFiltered = items.filter(task => {
    if (status == "4") {
      return task.status == status
    }
    return !status || task.status === status
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
    backgroundColor: color ? color[400] : palette.divider,
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
  console.log("resourc", resourceTitle)
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

const PrioritySelector = ({ priorityChange, priority }) => {
  const currentPriority = priorities.find(item => item.id === priority) || {}
  return (
    <StyledFormControl className={classes.prioritySelector} variant="standard">
      <Select
        disableUnderline
        value={priority}
        onChange={e => {
          priorityChange(e.target.value)
        }}
        renderValue={() => <PrioritySelectorItem text={currentPriority.text} color={currentPriority.color} />}
      >
        <MenuItem value={0}>
          <PrioritySelectorItem />
        </MenuItem>
        {priorities.map(({ id, color, text }) => (
          <MenuItem value={id} key={id.toString()}>
            <PrioritySelectorItem color={color} text={text} />
          </MenuItem>
        ))}
      </Select>
    </StyledFormControl>
  )
}

const FlexibleSpace = ({ priority, priorityChange, ...restProps }) => (
  <StyledToolbarFlexibleSpace {...restProps} className={classes.flexibleSpace}>
    <PrioritySelector priority={priority} priorityChange={priorityChange} />
  </StyledToolbarFlexibleSpace>
)
const TooltipContent = ({ appointmentData, formatDate, appointmentResources, ...rest }) => {
  return (
    <Tooltip appointmentData={appointmentData} formatDate={formatDate} appointmentResources={appointmentResources} />
  )
}

const CustomButtonSubmit = data => {
  console.log(data, "button")
  return (
    <>
      <button>Salvei</button>
      <button>fechar</button>
    </>
  )
}

const changeEvent = data => {
  console.log("-----", data)
}

export const Demo = () => {
  const { id } = useAuth()
  const { getMyBands, myBands } = useBand()
  const { appointments, getAppointments, deleteAppointment } = useAppointment()
  const [currentViewName, setCurrentViewName] = React.useState("Mensal")
  const [currentPriority, setCurrentPriority] = React.useState(0)
  const [openDialog, setOpenDialog] = useState(false)
  const [deletedAppointment, setDeletedAppointment] = useState(0)
  const [resources, setResources] = React.useState([
    {
      fieldName: "status",
      title: "Priority",
      instances: priorities,
    },
    {
      fieldName: "id",
      title: "Meus Eventos",
      instances: [
        {
          id: "id",
          text: "meus Eventos",
          color: "#000000",
        },
      ],
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
    console.log(currentDate)
    setCurrentDate(currentDate)
  }

  const priorityChange = value => {
    console.log(value)

    const nextResources = [
      {
        ...resources[0],
        instances: value > 0 ? [priorities[value - 1]] : priorities,
      },
    ]
    setCurrentPriority(value)
    setResources(nextResources)
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
    console.log(added, changed, deleted, "aqui")
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
  }, [])

  useEffect(() => {
    getAppointments(currentDate)
  }, [currentDate])

  useEffect(() => {}, [appointments])

  const TextEditor = props => {
    // eslint-disable-next-line react/destructuring-assignment
    if (props.type === "multilineTextEditor") {
      return null
    }
    return <AppointmentForm.TextEditor {...props} />
  }

  return (
    <Stack justifyContent={"space-around"} direction="column" alignContent={"space-around"}>
      <Header setAppointments={() => 1} />
      <Paper style={{ position: "absolute", bottom: 100 }}>
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

          <Toolbar flexibleSpaceComponent={flexibleSpace} />
          <ViewSwitcher />
          <DateNavigator />
          <EditingState onCommitChanges={commitChanges} onAddedAppointmentChange={commitChanges} />
          <IntegratedEditing />

          <AppointmentTooltip showOpenButton showCloseButton showDeleteButton />

          <AppointmentForm
            messages={{ afterLabel: "meu deus", commitCommand: "Salvar" }}
            basicLayoutComponent={CustomFormAppointment}
            visible={closedModal}
            onVisibilityChange={closeForm}
            commandButtonComponent={HiddenButton}
            textEditorComponent={TextEditor}
          />
        </Scheduler>
      </Paper>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Esta ação não podera ser desfeita</DialogTitle>
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
  )
}
