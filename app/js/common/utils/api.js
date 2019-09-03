import { fn } from "./"
import axios from "axios"
import _ from "lodash"

import React from "react"

export default {
  /**
   * Sends a get request to API
   *
   * @author  Mark Homoki
   * @version 1.0
   * @since   2017-07-21
   * @param   {string}   url		Request URL
   * @return  {object}			Response or the error
   */
  async get(url) {
    return await this.send(url, "GET")
  },

  /**
   * Sends a post request to API with the set data
   *
   * @author  Mark Homoki
   * @version 1.0
   * @since   2017-07-21
   * @param   {string}   url		Request URL
   * @param   {object}   data		Form data
   * @return  {object}			Response or the error
   */
  async post(url, data) {
    return await this.send(url, "POST", { data })
  },

  /**
   * Sends an update request to API with the set data
   *
   * @author  Mark Homoki
   * @version 1.0
   * @since   2017-07-21
   * @param   {string}   url		Request URL
   * @param   {object}   data		Form data
   * @return  {object}			Response or the error
   */
  async update(url, data) {
    return await this.send(url, "PUT", { data })
  },

  /**
   * Sends a delete request to API with the set data
   *
   * @author  Mark Homoki
   * @version 1.0
   * @since   2017-07-21
   * @param   {string}   url		Request URL
   * @param   {object}   data		Form data
   * @return  {object}			Response or the error
   */
  async delete(url, data) {
    return await this.send(url, "DELETE", { data })
  },

  /**
   * Sends the request to API with the set method and data.
   * This function sets the URL and the token, returns the response or catches the error.
   *
   * @author  Mark Homoki
   * @version 1.0
   * @since   2017-07-21
   * @param   {string}   url		Request URL which adds to the baseURL
   * @param   {string}   method	Request method (GET, POST, PUT, DELETE)
   * @param   {object}   data		Form data
   * @return  {object}			Response or the error
   */
  send(url, method, data) {
    const token =
      fn.getCookie("token") || "b67tgyhkgbv65dcghvghce5x65ccy6r57cfgcx"
    data = _.assign({}, { method }, data)

    // axios.defaults.baseURL = fn.isProduction() ? 'http://api2.grassroots.hostings.co.uk/v1' : 'http://api.grassroots.hostings.co.uk/v1';
    axios.defaults.baseURL = "http://api2.grassroots.hostings.co.uk/v1"
    axios.defaults.headers = { Authorization: `Bearer ${token}` }
    axios.defaults.withCredentials = true

    return axios(url, data)
      .then(response => response)
      .catch(error => {
        if (error.response) {
          return error.response
        }

        console.log("Error", error.message)
        return false
      })
  },

  /**
   * Creates a better structured object from the received data, merges the previous data with the current data
   *
   * @author  Mark Homoki
   * @version 1.0
   * @since   2017-07-21
   * @param   {object}   	state	Redux state
   * @param   {object}   	action	Dispatched action with data payload
   * @param   {string}   	key		Reducer type
   * @return  {object}			Merged data
   */
  cachedMergeData: {},
  normalizeData(state, action, key = "id") {
    let collection = {}
    let currentCollection = state.currentCollection
    let pager = {}
    let count = state.count

    // get the resposne from api
    const data = action.payload.data

    // array of items
    if ("entities" in data || "data" in data) {
      const collectionKey = "entities" in data ? "entities" : "data"
      collection = _.keyBy(data[collectionKey], o => o[key])
      currentCollection = _.map(data[collectionKey], o => o[key])

      pager = {
        currentPage: data.current_page,
        from: data.from,
        nextPageUrl: data.next_page_url,
        path: data.path,
        perPage: data.per_page,
        prevPageUrl: data.prev_page_url,
        to: data.to,
        total: data.total
      }

      count = data.count

      // if merge is true then merges the previous currentCollection with the new currentCollection
      if (action.merge) {
        // if mergeId is provided then will keep merging until the mergeId is the same, then resets
        if (action.mergeId) {
          if (this.cachedMergeData[action.type] === action.mergeId) {
            currentCollection = _.union(
              state.currentCollection,
              currentCollection
            )
          }
          // cache the new mergeId
          this.cachedMergeData[action.type] = action.mergeId
        } else {
          currentCollection = _.union(
            state.currentCollection,
            currentCollection
          )
        }
      }
      // single item
    } else {
      collection[data[key]] = data
    }

    return {
      collection: { ...state.collection, ...collection },
      count,
      currentCollection,
      filters: data.filters || [],
      misc: data.misc || {},
      total: data.total || 0,
      pager: {
        ...state.pager,
        ...pager
      }
    }
  },

  /**
   * Generates and shows the error message
   *
   * @author  Mark Homoki
   * @version 1.0
   * @since   2017-07-21
   * @param   {object}	response 	API response
   * @return  {boolean}				True if found error, false if not found
   */
  error(response, showError = true) {
    if (!response) {
      return true
    }

    if (response.status === 200) {
      return false
    }

    const errors = []

    this.getErrors(errors, response.data)
    if (showError) {
      fn.showAlert(errors, "error")
    }
    return true
  },

  getErrors(array, errors) {
    if (_.isObject(errors)) {
      _.map(errors, error => this.getErrors(array, error))
    } else {
      // check if server error then return a shorter message
      if (_.size(errors) > 2000) {
        return array.push("Something went wrong. Please try again later.")
      }
      return array.push(errors)
    }

    return false
  },

  /**
   * Pass response.data
   * @param errors
   * @returns {Array}
   */
  getErrorsHtml(errors, slug = false) {
    let array = []
    this.getErrors(array, errors)

    let stringHtml = _.map(array, (error, id) => {
      if (slug) {
        if (error === "The slug has already been taken.") {
          return (
            <p className="text-danger" key={id}>
              This URL has been taken.
            </p>
          )
        }
      }
      return (
        <p className="text-danger" key={id}>
          {error}
        </p>
      )
    })
    return stringHtml
  }
}
