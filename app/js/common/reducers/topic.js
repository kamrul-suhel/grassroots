import { api } from "app/utils";

const defaultState = {
  collection: {},
  count: null,
  currentCollection: [],
  error: null,
  filters: [],
  isLoading: true,
  misc: {},
  pager: {}
};

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case "TOPIC_PENDING": {
      if (action.replace === true) {
        return { defaultState };
      }
      return {
        ...state,
        isLoading: true
      };
    }
    case "TOPIC_REJECTED": {
      return {
        ...state,
        isLoading: false,
        error: action.payload.data
      };
    }
    case "TOPIC_FULFILLED": {
      const normalizedData = api.normalizeData(state, action, "topic_id");
      return {
        ...state,
        isLoading: false,
        ...normalizedData
      };
    }
    case "RESET_TOPIC": {
      return { ...defaultState };
    }
    case "TOPIC_MESSAGE_RECEIVE": {
      const topicId = action.payload.topic_id;
      const topic = state.collection[topicId];
      const messages = [action.payload].concat(topic.messages);
      const newTopic = _.assign({}, topic, { messages });

      return {
        ...state,
        collection: {
          ...state.collection,
          [topicId]: newTopic
        }
      };
    }
    default: {
      return state;
    }
  }
}
