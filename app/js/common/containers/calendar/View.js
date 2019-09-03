import React from "react"
import { connect } from "react-redux"
import BigCalendar, { render as Calendar } from "react-big-calendar"
import moment, { months } from "moment"
import { ButtonStandard, PageTitle, Link } from "app/components"
import { fn, api } from "app/utils"
import { url } from "app/constants"
import * as selector from "./selectors"
import Store from "app/Store"

@connect((state, ownProps) => {
  return {
    fixture: selector.getFixturesSelector(state),
    event: selector.getEventsSelector(state),
    programme: selector.getProgrammesSelector(state),
    availability: selector.getAvailabilitySelector(state),
    schedule: selector.getScheduleSelector(state),
    todo: selector.getTodoSelector(state),
    statement: selector.getStatementSelector(state)
  }
})
export default class View extends React.PureComponent {
  constructor(props) {
    super(props),
      (this.state = {
        date: new Date()
      })
  }

  componentDidMount() {
    this.props.me && this.fetchData()
  }

  fetchData = async () => {
    const { date } = this.state
    const userRole = this.props.me.data.user_role
    const dateParam = `date=${date.getFullYear()}-${date.getMonth() +
      1}-${date.getDate()}`

    const res = await api.get(`/calenders?${dateParam}`)

    if (!api.error(res)) {
      const data = res.data
      const keys = Object.keys(data)
      for (let i = 0; i < keys.length; i++) {
        const collection = data[keys[i]]
        let currentCollection = []
        for (let j = 0; j < collection.length; j++) {
          const id = `${keys[i].toLowerCase()}_id`
          currentCollection.push(collection[j][id])
        }
        this.props.dispatch({
          type: `${keys[i]}_FULFILLED`,
          payload: {
            calendar: true,
            collection,
            currentCollection
          }
        })
      }
    }
  }

  eventClassGetter = (event, start, end, isSelected) => {
    return {
      className: `${isSelected ? "calendar-selected" : ""} calendar-${
        event.type
      }`
    }
  }

  Event = ({ event }) => {
    const capitalisedType =
      event.type.charAt(0).toUpperCase() + event.type.slice(1)
    return (
      <Link to={event.url} className="calendar-link">
        {" "}
        {capitalisedType}: {event.title}
      </Link>
    )
  }

  MonthEvent = ({ event }) => {
    return (
      <Link to={event.url} className="calendar-link">
        {event.title}
      </Link>
    )
  }

  getNew = e => {
    this.setState(
      {
        date: e
      },
      this.fetchData
    )
  }

  render() {
    const { params } = this.props
    const defaultView = window.innerWidth < 768 ? "agenda" : "month"
    const type = fn.getFaqType("Calendar")

    const allViews = Object.values(BigCalendar.Views).filter(
      k => k !== "work_week"
    )
    const localizer = BigCalendar.momentLocalizer(moment)

    // Imported calendar types from selectors.js.
    const values = Object.values(selector.TYPE)
    const events = values.reduce((a, value) => {
      const item = this.props[value]
      if (item) {
        return [...a, ...item]
      } else {
        console.warn(`Value ${value} not recognised`)
        return a
      }
    }, [])

    let calendarKeys
    let buttons
    const userRole = this.props.me.data.user_role

    switch (userRole) {
      case "admin": {
        calendarKeys = [
          /*'coach availability',*/ "fixture",
          "event",
          "programme",
          "schedule",
          "todo"
        ]
        buttons = {
          Fixture: `${url.fixture}/add`,
          // 'Event': `${url.event}/add-event`, Admin can not create event
          Programme: `${url.programme}/add`,
          Todo: `${url.todo}/add`,
          Schedule: `${url.schedule}/add`
        }
        break
      }

      case "coach": {
        calendarKeys = [
          "availability",
          "programme",
          "schedule",
          "statement",
          "todo"
        ]
        buttons = {
          Availability: `${url.availability}/add`,
          // 'Programme': `${url.programme}/add`,
          // 'Schedule': `${url.schedule}/add`,
          // 'Statement': `${url.statement}/add`,
          Todo: `${url.todo}/add`
        }
        break
      }
      case "guardian": {
        calendarKeys = ["event", "programme", "statement", "todo"]
        buttons = {
          // 'Event': `${url.event}/add-event`,
          // 'Programme': `${url.programme}/add`,
          // 'Statement': `${url.statement}/add`,
          Todo: `${url.todo}/add`
        }
        break
      }
    }

    return (
      <div className="calendar-wrapper calender-page">
        <PageTitle
          value="Calendar"
          faq={true}
          faqLink={fn.getFaqLink(type, `/${params.clubSlug}/`)}
        />

        <div className="page-actions">
          {_.map(buttons, (url, name) => (
            <ButtonStandard
              key={url}
              to={url}
              icon={<i className="ion-plus" />}
            >
              {name}
            </ButtonStandard>
          ))}
        </div>

        <BigCalendar
          localizer={localizer}
          defaultView={defaultView}
          events={events}
          startAccessor="start"
          endAccessor="end"
          step={30}
          onNavigate={e => this.getNew(e)}
          components={{
            agenda: {
              event: this.Event
            },
            day: {
              event: this.Event
            },
            week: {
              event: this.Event
            },
            month: {
              event: this.MonthEvent
            }
          }}
        />

        <div className="calendar-key">
          {calendarKeys.map(key => (
            <div
              key={key}
              className={`calendar-${key.replace(/\s+/, "-")} capitalize`}
            >
              {key}
            </div>
          ))}
          <div className="calendar-today">Today</div>
        </div>
      </div>
    )
  }
}
