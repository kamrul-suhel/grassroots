import React from "react"
import { connect } from "react-redux"
import { fn, api } from "app/utils"
import { url } from "app/constants"
import { fetchData } from "app/actions"
import { Loader } from "@xanda/react-components"
import {
  Alert,
  SiteFooter,
  SiteHeader,
  SiteNavigation,
  SnackBarMessage
} from "app/components"

@connect((store, ownProps) => {
  return {
    alerts: store.alert,
    me: store.me,
    myClub: store.myClub
  }
})
export default class AuthorizedArea extends React.PureComponent {
  componentWillMount = async () => {
    fn.hideAlert()

    if (fn.isLoggedIn()) {
      await fn.dispatchMany(
        {
          type: "MYCLUB",
          url: "/clubs/my"
        },

        {
          type: "ME",
          url: "/users/me"
        },

        {
          type: "PROGRAMME",
          url: `/programmes?page=1&status=1`
        },

        {
          type: "FEEDBACK",
          url: `/feedbacks`
        }
      )

      // Check if user credential is exists
      if (!_.isEmpty(this.props.me.data)) {
        if (fn.isAdmin()) {
          await this.fetchEvent()
        }
      } else {
        const user = await api.get("/users/me")
        // if user is admin then get the event
        if (user.user_role === "admin") {
          await this.fetchEvent()
        }
      }
    } else {
      fn.navigate({
        pathname: url.logout,
        state: {
          showDefaultAlert: false
        }
      })
    }
  }

  fetchEvent = async () => {
    await this.props.dispatch({
      type: "EVENT",
      url: `/requests?status=0`
    })
  }

  componentWillUpdate = async nextProps => {
    this.userHasAccess = true

    // apply middleware to restrict users who does not have user_role in the accessLevel array to access the page
    if (nextProps.me.data.user_role) {
      let accessLevel = []

      const generateAccessLevel = obj => {
        const objProps = (obj || {}).props || {}

        if ((objProps.route || {}).accessLevel) {
          accessLevel = objProps.route.accessLevel
        }

        if (objProps.children) {
          generateAccessLevel(objProps.children)
        }
      }

      generateAccessLevel(nextProps.children)

      const userHasAccess = _.includes(accessLevel, nextProps.me.data.user_role)

      // redirect if user does not have access
      if (_.size(accessLevel) > 0 && !userHasAccess) {
        this.userHasAccess = false

        if (nextProps.me.data && nextProps.me.data.role_id === 4) {
          fn.navigate(url.licence)
        } else if (
          nextProps.me.data.role_id &&
          nextProps.me.data.role_id === 5
        ) {
          fn.navigate(url.franchise)
        } else {
          fn.navigate(url.licence)
        }
      }
    }

    // hide alert when changing page
    if (
      nextProps &&
      nextProps.alerts.show &&
      this.props &&
      nextProps.location.pathname !== this.props.location.pathname
    ) {
      fn.hideAlert()
    }
  }

  renderBackground = () => {
    const path = this.props.routes[3] ? this.props.routes[3].path : ""
    const currentMenuItem = fn.getSiteNavigation(path) || {}
    const defaultImages = [
      "/images/Main Page 1 & Dashboard 1.jpg"
      // '/images/Main Page 2 & Dashboard 2.jpg',
      // '/images/Main Page 3 & Dashboard 3.jpg',
    ]
    const defaultImage =
      defaultImages[Math.floor(defaultImages.length * Math.random())]
    if (
      this.props.me.data.user_role !== "groupadmin" &&
      this.props.me.data.user_role !== "superadmin"
    ) {
      // if (path === 'dashboard') {
      // 	return <div className="bg" style={{ backgroundImage: `url("${defaultImage}")` }} />;
      // }

      if (currentMenuItem.bg) {
        return (
          <div
            className="bg"
            style={{ backgroundImage: `url("${currentMenuItem.bg}")` }}
          />
        )
      }
    }
  }

  render() {
    // return loader while its fetching
    if (this.props.me.fetching) {
      return <Loader />
    }

    // return the content when its fetched
    if (this.props.me.fetched) {
      const childrenWithProps = React.Children.map(this.props.children, child =>
        React.cloneElement(child, {
          me: this.props.me,
          myClub: this.props.myClub
        })
      )
      const hideNavigation = (
        ((this.props.children || {}).props || {}).route || {}
      ).hideNavigation

      return (
        <div className="site logged-in">
          {this.renderBackground()}
          <SiteHeader {...this.props} />
          <div className={`site-inner ${fn.getUserRole()}`}>
            {!hideNavigation && <SiteNavigation />}
            <div className="site-content" id="site-content">
              <Alert data={this.props.alerts} />
              {this.userHasAccess && childrenWithProps}
              <SiteFooter />
            </div>
          </div>
        </div>
      )
    }

    return null
  }
}
