/* eslint-disable react/prop-types */
import * as React from "react"

import {
  AccessTime,
  LocationOnOutlined,
  MusicNoteOutlined,
  PhoneOutlined,
  EventOutlined,
  Lens,
  AppsOutage,
} from "@mui/icons-material"

import Grid from "@mui/material/Grid"
import { styled } from "@mui/material/styles"

import classNames from "clsx"
import { IAppointments } from "../../../Types/appointments.type"
import { IResource } from "../../../Types/calendar.type"
import { classes } from "../../Calendar/Calendar"
import { useMobile } from "../../../Provider/Theme/Mobile"
import { useBand } from "../../../Provider/Band/Band"
import { Divider } from "@mui/material"

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
    color: color ? color : "",
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

//TODO: type formatDate
interface TooltipProps {
  appointmentData: IAppointments
  formatDate: any
  appointmentResources: IResource[]
}

export const Tooltip = ({ appointmentData, formatDate, appointmentResources }: TooltipProps) => {
  const { mobile } = useMobile()
  const { bands, getBands } = useBand()
  const resource = appointmentResources[0]

  React.useEffect(() => {
    getBands()
  })

  return (
    <StyledTooltipContent className={classes.content} color={resource?.color}>
      <Grid
        container
        alignItems="flex-start"
        className={classes.titleContainer}
        maxWidth={mobile ? "250px" : "inherit"}
      >
        <Grid item xs={2} className={classNames(classes.textCenter)}>
          <Lens className={classNames(classes.lens, classes.colorfulContent)} />
        </Grid>
        <Grid item xs={10}>
          <div>
            <div className={classNames(classes.title, classes.dateAndTitle)}>{appointmentData.title}</div>
            <div className={classNames(classes.text, classes.dateAndTitle)}>
              {formatDate(appointmentData.start_date, { day: "numeric", weekday: "long" })}
            </div>
          </div>
        </Grid>
      </Grid>

      {appointmentData.creator && (
        <>
          <Grid container alignItems="center" key={`${resource.fieldName}_${resource.id}`} ml={2.5}>
            <div>
              <Grid fontSize={10}>Criado por: {appointmentData.creator}</Grid>
            </div>
          </Grid>
        </>
      )}
      {appointmentData.observations && (
        <>
          <Grid container alignItems="center" key={`${resource.fieldName}_${resource.id}`} mb={2} ml={2.5}>
            <div>
              <Grid fontSize={12}>
                Obs.:&nbsp;<b>{appointmentData.observations}</b>
              </Grid>
            </div>
          </Grid>
        </>
      )}
      <Grid container alignItems="center" className={classes.contentContainer}>
        <Grid item xs={2} className={classes.textCenter}>
          <AccessTime className={classes.icon} />
        </Grid>
        <Grid item xs={10}>
          <div className={classes.text}>
            {`${formatDate(appointmentData.start_date, { hour: "numeric", minute: "numeric" })}
				`}
          </div>
        </Grid>
      </Grid>
      {(appointmentData.street ||
        appointmentData.address_number ||
        appointmentData.district ||
        appointmentData.city ||
        appointmentData.state) && (
        <Grid container alignItems="center" className={classes.contentContainer}>
          <Grid item xs={2} className={classes.textCenter}>
            <LocationOnOutlined className={classes.icon} />
          </Grid>
          <Grid item xs={10}>
            <div className={classes.text}>
              {appointmentData.street && `${appointmentData.street}`}{" "}
              {appointmentData.address_number && `n.º ${appointmentData.address_number}`} {mobile && <br />}
              {appointmentData.district && `, ${appointmentData.district}`}{" "}
              {appointmentData.city && `, ${appointmentData.city}`}{" "}
              {appointmentData.state && `- ${appointmentData.state}`}
            </div>
          </Grid>
        </Grid>
      )}
      <Grid container alignItems="center" className={classes.contentContainer}>
        <Grid item xs={2} className={classes.textCenter}>
          <MusicNoteOutlined className={classes.icon} />
        </Grid>
        <Grid item xs={10}>
          <div className={classes.text}>{bands.find(band => band.id == appointmentData.id_band)?.name}</div>
        </Grid>
      </Grid>
      {appointmentData.cellphone && (
        <Grid container alignItems="center" className={classes.contentContainer}>
          <Grid item xs={2} className={classes.textCenter}>
            <PhoneOutlined className={classes.icon} />
          </Grid>
          <Grid item xs={10}>
            <div className={classes.text}>{appointmentData.cellphone}</div>
          </Grid>
        </Grid>
      )}

      <Grid container alignItems="center" key={`${resource.fieldName}_${resource.id}`}>
        <Grid className={classNames(classes.contentItemIcon, classes.icon)} item xs={2}>
          <EventOutlined />
        </Grid>
        <Grid item xs={10}>
          <span className={classNames(classes.text)}>
            <b>{`${appointmentData.status?.charAt(0).toUpperCase()}${appointmentData.status?.slice(1)}`}</b>
          </span>
        </Grid>
      </Grid>
    </StyledTooltipContent>
  )
}
