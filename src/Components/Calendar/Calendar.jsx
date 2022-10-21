/* eslint-disable react/prop-types */
import React from "react"
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
import { data as tasks } from "../../demo-data/grouping"
import { Tooltip } from "../../Components/Calendar/Components/Tooltip"
import { AppointmentForm as CustomAppointmentForm } from "./Components/Form/AppointmentForm"
import { useForm } from "react-hook-form"
import { Header } from "./Components/Header/Header"

const filterTasks = (items, status) =>
  items.filter(task => {
    if (status === 4) {
      return task.id === status
    }
    return !status || task.status === status
  })

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
  const text = resourceTitle || "All Tasks"
  const shortText = resourceTitle ? text.substring(0, 1) : "All"

  return (
    <StyledPrioritySelectorItem className={classes.prioritySelectorItem} color={color}>
      <span className={classes.bullet} />
      <span className={classes.priorityText}>{text}</span>
      <span className={classes.priorityShortText}>{shortText}</span>
    </StyledPrioritySelectorItem>
  )
}

const PrioritySelector = ({ priorityChange, priority }) => {
  const currentPriority = priority > 0 ? priorities[priority - 1] : {}
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
const TooltipContent = ({ appointmentData, formatDate, appointmentResources }) => {
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
  const [currentViewName, setCurrentViewName] = React.useState("Mensal")
  const [data, setData] = React.useState(tasks)
  const [currentPriority, setCurrentPriority] = React.useState(0)
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
          color: null,
        },
      ],
    },
  ])
  const [currentDate, setCurrentDate] = React.useState(new Date())

  const currentViewNameChange = currentViewName => {
    setCurrentViewName(currentViewName)
  }

  const currentDateChange = currentDate => {
    setCurrentDate(currentDate)
  }

  const priorityChange = value => {
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
    console.log(added, changed, deleted)
  }

  const CustomFormAppointment = data => {
    return <CustomAppointmentForm data={data} setAppointments={setData} />
  }

  React.useEffect(() => {
    flexibleSpace.update()
  }, [])

  return (
    <>
      <Header setAppointments={setData} />
      <Paper>
        <Scheduler data={filterTasks(data, currentPriority)} height={660} locale={"pt-BR"}>
          <ViewState
            currentDate={currentDate}
            currentViewName={currentViewName}
            onCurrentViewNameChange={currentViewNameChange}
            onCurrentDateChange={currentDateChange}
          />

          <DayView startDayHour={9} endDayHour={19} intervalCount={2} name="Dia" />
          <WeekView startDayHour={9} endDayHour={17} excludedDays={[0, 6]} name="Semanal" />

          <MonthView name="Mensal" />

          <Appointments />
          <Resources data={resources} />

          <Toolbar flexibleSpaceComponent={flexibleSpace} />
          <ViewSwitcher />
          <DateNavigator />
          <EditingState onCommitChanges={commitChanges} onAddedAppointmentChange={commitChanges} />
          <IntegratedEditing />
          <ConfirmationDialog />

          <AppointmentTooltip contentComponent={TooltipContent} showOpenButton showCloseButton showDeleteButton />

          <AppointmentForm
            messages={{ afterLabel: "meu deus", commitCommand: "Salvar" }}
            basicLayoutComponent={CustomFormAppointment}
          />
        </Scheduler>
      </Paper>
    </>
  )
}
