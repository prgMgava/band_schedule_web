/* eslint-disable react/prop-types */
import * as React from "react"
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
import { IAppointments } from "../../Types/appointments.type"
import { priorities } from "../../demo-data/tasks"
import { data as tasks } from "../../demo-data/grouping"
import { Tooltip } from "../../Components/Calendar/Components/Tooltip"
import { AppointmentForm as CustomAppointmentForm } from "./Components/Form/AppointmentForm"

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
const StyledTooltipContent = styled("div")(({ theme: { spacing, typography, palette }, color }) => ({
  [`&.${classes.content}`]: {
    padding: spacing(3, 1),
    paddingTop: 0,
    backgroundColor: palette.background.paper,
    boxSizing: "border-box",
    width: "400px",
  },
  [`& .${classes.contentContainer}`]: {
    paddingBottom: spacing(1.5),
  },
  [`& .${classes.text}`]: {
    ...typography.body2,
    display: "inline-block",
  },
  [`& .${classes.title}`]: {
    ...typography.h6,
    color: palette.text.secondary,
    fontWeight: typography.fontWeightBold,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "normal",
  },
  [`& .${classes.icon}`]: {
    verticalAlign: "middle",
  },
  [`& .${classes.contentItemIcon}`]: {
    textAlign: "center",
  },
  [`& .${classes.grayIcon}`]: {
    color: palette.action.active,
  },
  [`& .${classes.colorfulContent}`]: {
    color: color ? color[300] : "",
  },
  [`& .${classes.lens}`]: {
    width: spacing(4.5),
    height: spacing(4.5),
    verticalAlign: "super",
  },
  [`& .${classes.textCenter}`]: {
    textAlign: "center",
  },
  [`& .${classes.dateAndTitle}`]: {
    lineHeight: 1.1,
  },
  [`& .${classes.titleContainer}`]: {
    paddingBottom: spacing(2),
  },
  [`& .${classes.container}`]: {
    paddingBottom: spacing(1.5),
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

const FormTest = data => {
  return <CustomAppointmentForm data={data} />
}

const changeEvent = data => {
  // console.log("-----", data)
}

export default class Demo extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      currentViewName: "Mensal",
      data: tasks,
      currentPriority: 0,
      resources: [
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
      ],
    }
    this.currentViewNameChange = currentViewName => {
      this.setState({ currentViewName })
    }
    this.currentDateChange = currentDate => {
      this.setState({ currentDate })
    }
    this.priorityChange = value => {
      const { resources } = this.state

      const nextResources = [
        {
          ...resources[0],
          instances: value > 0 ? [priorities[value - 1]] : priorities,
        },
      ]

      this.setState({ currentPriority: value, resources: nextResources })
    }
    this.flexibleSpace = connectProps(FlexibleSpace, () => {
      const { currentPriority } = this.state
      return {
        priority: currentPriority,
        priorityChange: this.priorityChange,
      }
    })

    this.commitChanges = ({ added, changed, deleted }) => {
      this.setState(state => {
        let { data } = state
        if (added) {
          const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0
          data = [...data, { id: startingAddedId, ...added }]
        }
        if (changed) {
          data = data.map(appointment =>
            changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment
          )
        }
        if (deleted !== undefined) {
          data = data.filter(appointment => appointment.id !== deleted)
        }
        return { data }
      })
    }
  }

  componentDidUpdate() {
    this.flexibleSpace.update()
  }

  render() {
    const { data, currentDate, currentViewName, currentPriority, resources } = this.state

    return (
      <Paper>
        <Scheduler data={filterTasks(data, currentPriority)} height={660} locale={"pt-BR"}>
          <ViewState
            currentDate={currentDate}
            currentViewName={currentViewName}
            onCurrentViewNameChange={this.currentViewNameChange}
            onCurrentDateChange={this.currentDateChange}
          />

          <DayView startDayHour={9} endDayHour={19} intervalCount={2} name="Dia" />
          <WeekView startDayHour={9} endDayHour={17} excludedDays={[0, 6]} name="Semanal" />

          <MonthView name="Mensal" />

          <Appointments />
          <Resources data={resources} />

          <Toolbar flexibleSpaceComponent={this.flexibleSpace} />
          <ViewSwitcher />
          <DateNavigator />
          <EditingState onCommitChanges={this.commitChanges} />
          <IntegratedEditing />
          <ConfirmationDialog />

          <AppointmentTooltip contentComponent={TooltipContent} showOpenButton showCloseButton showDeleteButton />

          <AppointmentForm
            onAppointmentDataChange={changeEvent}
            messages={{ afterLabel: "meu deus", commitCommand: "Salvar" }}
            basicLayoutComponent={FormTest}
          />
        </Scheduler>
      </Paper>
    )
  }
}
