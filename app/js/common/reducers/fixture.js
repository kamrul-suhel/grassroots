import { api } from "app/utils"

const defaultState = {
  collection: {},
  count: null,
  currentCollection: [],
  error: null,
  filters: [],
  isLoading: true,
  misc: {},
  pager: {}
}

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case "FIXTURE_PENDING": {
      return {
        ...state,
        isLoading: true
      }
    }
    case "FIXTURE_REJECTED": {
      return {
        ...state,
        isLoading: false,
        error: action.payload.data
      }
    }
    case "FIXTURE_FULFILLED": {
      //
      if (action.payload.calendar) {
        const collection = action.payload.collection
        const currentCollection = action.payload.currentCollection
        return {
          ...state,
          isLoading: false,
          collection,
          currentCollection
        }
      }
      //
      const normalizedData = api.normalizeData(state, action, "fixture_id")
      return {
        ...state,
        isLoading: false,
        ...normalizedData
      }
    }
    default: {
      return state
    }
  }
}
