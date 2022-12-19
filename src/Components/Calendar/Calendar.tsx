/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

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
import { Tooltip } from "./Components/Tooltip"
import { AppointmentForm as CustomAppointmentForm } from "./Components/Form/AppointmentForm"
import { Header } from "./Components/Header/Header"
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack } from "@mui/material"
import { useBand } from "../../Provider/Band/Band"
import { useAuth } from "../../Provider/Auth/Auth"
import { useAppointment } from "../../Provider/Appointment/Appointment"
import { toast } from "react-toastify"
import { useLabel } from "../../Provider/Label/Label"
import { api } from "../../Services/api"
import classNames from "clsx"
import { ILabel } from "../../Types/label.type"

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

export const Demo = () => {
  const [labels, setLabels] = useState<ILabel[]>(JSON.parse(localStorage.getItem("@BandSchedule:labels")) || [])
  const { id, accessToken, getAdmins, getMembers, superAdmin, bandVisibility, adm, getUser } = useAuth()
  const { getMyBands, currentBand, myBands } = useBand()
  const { getLabels } = useLabel()
  const {
    appointments,
    getAppointments,
    deleteAppointment,
    currentDate,
    setCurrentDate,
    getMyAppointments,
    getAppointmentsByBand,
  } = useAppointment()
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

  const FlexibleSpace = ({ priority, priorityChange, ...restProps }) => {
    return <StyledToolbarFlexibleSpace {...restProps} className={classes.flexibleSpace}></StyledToolbarFlexibleSpace>
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
    getMyBands()
    getLabels()
    getMembers()
    getAdmins()
    getUser()
  }, [])

  useEffect(() => {
    if (currentBand) {
      // eslint-disable-next-line no-debugger
      const currentBandId = myBands.find(band => band.name == currentBand)?.id
      getAppointmentsByBand(currentDate, currentBandId)
    } else if (superAdmin) {
      getAppointments(currentDate)
    } else {
      if (adm) {
        getMyAppointments(currentDate, id)
      } else {
        if (bandVisibility) {
          getMyAppointments(currentDate, bandVisibility)
        } else {
          toast.error("Tem algum problema para buscar os eventos para este usuário, entre em contato com o adm")
        }
      }
    }
  }, [currentDate])

  useEffect(() => {
    try {
      api
        .get("/label", {
          headers: { "x-access-token": accessToken },
        })
        .then(res => {
          const newData = res.data.map(item => {
            return {
              ...item,
              text: item.title,
            }
          })
          localStorage.setItem("@BandSchedule:labels", JSON.stringify(newData))
          setLabels(newData)
        })
    } catch (e) {
      1
    }
  }, [])

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

  const StyledAppointmentsAppointmentContent = styled(Appointments.AppointmentContent)(({ theme: { palette } }) => ({
    [`& .${classes.text}`]: {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    [`& .${classes.content}`]: {
      opacity: 0.7,
    },
    [`& .${classes.container}`]: {
      width: "100%",
      lineHeight: 1.2,
      height: "100%",
    },
  }))

  const AppointmentContent = ({ data, ...restProps }) => {
    const dateInit = `${new Date(data.start_date).toLocaleTimeString().substring(0, 5)}`
    //const dateEnd = `${new Date(data.end_date).toLocaleTimeString().substring(0, 5)}`
    return (
      <StyledAppointmentsAppointmentContent
        {...restProps}
        data={data}
        title={`${data.title}\n${dateInit}\n${data.observations || ""}\n${labels
          .find(label => label.id == data.id_label)
          ?.title?.toUpperCase()} `}
      >
        <div className={classes.container}>
          <div className={classes.text}>{data.title}</div>
          <div className={classNames(classes.text, classes.content)}>
            {dateInit}
            {data.observations && ` - ${data.observations || ""}`}
          </div>
          {/* <div className={classNames(classes.text, classes.content)}>{data.observations || ""}</div> */}
        </div>
      </StyledAppointmentsAppointmentContent>
    )
  }

  const StyledAppointmentsAppointment = styled(Appointments.Appointment)(() => ({
    [`&.${classes.appointment}`]: {
      borderRadius: 0,
      borderBottom: 0,
    },
  }))

  const Appointment = ({ data, ...restProps }) => (
    <StyledAppointmentsAppointment
      {...restProps}
      className={classNames({
        [classes.highPriorityAppointment]: data.priority === 1,
        [classes.mediumPriorityAppointment]: data.priority === 2,
        [classes.lowPriorityAppointment]: data.priority === 3,
        [classes.appointment]: true,
      })}
      data={data}
    />
  )

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

            <Appointments appointmentContentComponent={AppointmentContent} appointmentComponent={Appointment} />
            <Resources data={resources} />

            <Toolbar />
            <ViewSwitcher />
            <DateNavigator />
            <EditingState onCommitChanges={commitChanges} onAddedAppointmentChange={commitChanges} />
            <IntegratedEditing />

            <AppointmentTooltip contentComponent={TooltipContent} showOpenButton showCloseButton showDeleteButton />

            <AppointmentForm
              messages={{ commitCommand: "Salvar" }}
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
