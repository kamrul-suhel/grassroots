import { createSelector } from "reselect"
import _ from "lodash"
import { url } from "app/constants"
import { api, fn } from "app/utils"

const availabilitySelector = state => state.availability.collection
const eventsSelector = state => state.request.collection
const fixturesSelector = state => state.fixture.collection
const programmesSelector = state => state.programme.collection
const scheduleSelector = state => state.schedule.collection
const statementSelector = state => state.statement.collection
const todoSelector = state =>
  _.filter(state.todo.collection, todo => todo.status === "pending")
const me = state => state.me.data.user_id

export const TYPE = Object.freeze({
  AVAILABILITY: "availability",
  EVENT: "event",
  FIXTURE: "fixture",
  PROGRAMME: "programme",
  SCHEDULE: "schedule",
  STATEMENT: "statement",
  TODO: "todo"
})

const getStartTime = (prop, type) => {
  switch (type) {
    case TYPE.AVAILABILITY:
      return prop.start_date

    case TYPE.EVENT: //fallthrough
    case TYPE.FIXTURE: //fallthrough
    case TYPE.SCHEDULE:
      return prop.start_time

    case TYPE.PROGRAMME:
      return prop.programme_end

    case TYPE.TODO: //fallthrough
    case TYPE.STATEMENT:
      return prop.date

    default:
      console.warn("Uncaught Calender Type of " + type)
      return new Date()
  }
}

const getEndTime = (prop, type) => {
  switch (type) {
    case TYPE.AVAILABILITY:
      return prop.end_date

    case TYPE.EVENT: //fallthrough
    case TYPE.SCHEDULE:
      return prop.end_time

    case TYPE.FIXTURE:
      return prop.start_time

    case TYPE.PROGRAMME:
      return prop.programme_end

    case TYPE.STATEMENT: //fallthrough
    case TYPE.TODO:
      return prop.date

    default:
      console.warn("Uncaught Calender Type of " + type)
      return new Date()
  }
}

const getTitle = (prop, type) => {
  switch (type) {
    case TYPE.AVAILABILITY:
      return prop.type

    case TYPE.EVENT:
      return prop.event_type

    case TYPE.FIXTURE: //fallthrough
    case TYPE.PROGRAMME: //fallthrough
    case TYPE.TODO:
      return prop.title

    case TYPE.SCHEDULE:
      return prop.programme_name

    case TYPE.STATEMENT:
      return prop.description

    default:
      console.warn("Uncaught Calender Type of " + type)
      return "Calender Entry"
  }
}

//TODO: East-finchley must not be hardcoded.
const getURL = (prop, type) => {
  switch (type) {
    case TYPE.AVAILABILITY:
      const role = fn.getUserRole()
      if (role === "admin") {
        return `${url.coachAvailability}`
      }
      if (role === "coach") {
        return `${url.availability}`
      }

    case TYPE.EVENT:
      return `${url.event}/${prop.request_id}`

    case TYPE.FIXTURE:
      return `${url.fixture}/${prop.fixture_id}`

    case TYPE.PROGRAMME:
      return `${url.programme}/${prop.programme_id}`

    case TYPE.SCHEDULE:
      return `${url.session}/${prop.session_id}`

    case TYPE.STATEMENT:
      return `${url.statement}`

    case TYPE.TODO:
      return `${url.todo}/${prop.todo_id}`

    default:
      return ""
  }
}

const calendarFormat = (obj, type) =>
  _.map(obj, prop => {
    const start = new Date(getStartTime(prop, type))
    const end = new Date(getEndTime(prop, type))
    const title = getTitle(prop, type) || "No Title"
    const url = getURL(prop, type)

    return {
      title,
      url,
      start,
      end,
      type
    }
  })

export const getAvailabilitySelector = createSelector(
  availabilitySelector,
  data => calendarFormat(data, TYPE.AVAILABILITY)
)
export const getEventsSelector = createSelector(
  eventsSelector,
  data => calendarFormat(data, TYPE.EVENT)
)
export const getFixturesSelector = createSelector(
  fixturesSelector,
  data => calendarFormat(data, TYPE.FIXTURE)
)
export const getProgrammesSelector = createSelector(
  programmesSelector,
  data => calendarFormat(data, TYPE.PROGRAMME)
)
export const getScheduleSelector = createSelector(
  scheduleSelector,
  data => calendarFormat(data, TYPE.SCHEDULE)
)
export const getStatementSelector = createSelector(
  statementSelector,
  data => calendarFormat(data, TYPE.STATEMENT)
)
export const getTodoSelector = createSelector(
  todoSelector,
  data => calendarFormat(data, TYPE.TODO)
)
