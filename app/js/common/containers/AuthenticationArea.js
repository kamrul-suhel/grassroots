import React from "react"
import { connect } from "react-redux"
import { fn, api } from "app/utils"
import { url } from "app/constants"
import { fetchData } from "app/actions"
import { Alert, SiteFooter, SiteHeader, SnackBarMessage } from "app/components"

@connect(store => {
  return {
    alerts: store.alert,
    me: store.me
  }
})
export default class AuthenticationArea extends React.PureComponent {
  componentWillUpdate(nextProps) {
    if (
      nextProps &&
      this.props &&
      nextProps.location.pathname !== this.props.location.pathname
    ) {
      fn.hideAlert()
    }
  }

  async componentDidMount() {
    const { dispatch } = this.props
    const locationState = this.props.location.state

    if (fn.isLoggedIn() && !(locationState && locationState.forceLogin)) {
      const me = await api.get("/users/me")
      if (me.data && me.data.role_id === 4) {
        fn.setBasename("")
        fn.navigate(url.licence)
      } else if (me.data.role_id && me.data.role_id === 5) {
        fn.setBasename("")
        fn.navigate(url.franchise)
      } else if (
        (me.data.role_id && me.data.role_id === 2) ||
        me.data.role_id === 3 ||
        me.data.role_id === 1
      ) {
        // Navigate to user with slug
        fn.setBasename(`${me.data.slug}`)
        fn.navigate(`${url.dashboard}`)
      } else {
        fn.setBasename(`${me.data.slug}`)
        fn.navigate(url.dashboard)
      }
    }
  }

  render() {
    const childrenWithProps = React.Children.map(this.props.children, child =>
      React.cloneElement(child, {
        authClub: this.props.authClub
      })
    )

    return (
      <div className="site not-logged-in bg">
        <SiteHeader {...this.props} authArea={false} />
        <div className="site-inner">
          <div className="site-content">
            <Alert data={this.props.alerts} />
            {childrenWithProps}
            <SiteFooter />
          </div>
        </div>
      </div>
    )
  }
}
