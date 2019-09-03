import React from "react"
import { connect } from "react-redux"
import { fn, api } from "app/utils"
import { url } from "app/constants"
import { fetchData } from "app/actions"
import { DynamicContent } from "@xanda/react-components"

@connect(store => {
  return {
    authClub: store.authClub,
    me: store.me
  }
})
export default class App extends React.PureComponent {
  componentWillMount() {
    this.fetchData()
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.authClub.fetched && !nextProps.authClub.fetching) {
      this.fetchData()
    }
  }

  fetchData = async () => {
    const { dispatch, params, router } = this.props
    const basename = params.clubSlug
    const oldBasename = fn.getCookie("basename")
    fn.setBasename(basename)

    const response = await api.get(`/auth/club/${basename}`)
    if (!api.error(response)) {
      const userMe = await api.get("users/me") //Get users clugSlug from user/me end point
      if (!api.error(userMe)) {
        const userSlug = userMe.data.slug

        //Checks if user is logged in and is trying to access route outside of its own club
        if (userSlug !== basename) {
          return this.props.router.replace(`/${userSlug}/dashboard`)
        }
      }

      //Redirect users that arent logged in and are trying to access valid slub without /login at the end
      if (
        !fn.isLoggedIn() &&
        params.clubSlug === basename &&
        !router.location.pathname.includes("login")
      ) {
        return this.props.router.replace(`/${basename}/login`)
      }

      if (!response.data && !response.data.club_id) {
        const user = await api.get("users/me")

        if (!api.error(user)) {
          if (user.data.role_id !== 4 || user.data.role_id !== 5) {
            router.push("404")
          }
        } else {
          this.props.router.replace("/")
        }
      }
    } else if (404 === response.status) {
      return this.props.router.replace("/")
    }

    // logs out the user when the club is changed
    if (oldBasename && oldBasename !== basename) {
      // fn.navigate(url.logout)
    }

    // validate club
    dispatch(
      fetchData({
        type: "AUTHCLUB",
        url: `/auth/club/${basename}`
      })
    )
  }

  render() {
    const { alerts, authClub } = this.props
    const childrenWithProps = React.Children.map(this.props.children, child =>
      React.cloneElement(child, {
        alerts,
        authClub
      })
    )

    return (
      <DynamicContent
        className="app-inner"
        collection={authClub}
        notFound="The requested club is not found in the system"
      >
        {childrenWithProps}
      </DynamicContent>
    )
  }
}
