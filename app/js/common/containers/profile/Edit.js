import React from "react"
import { ContentLoader, Form, Table, TextInput } from "@xanda/react-components"
import Store from "app/store"
import { fetchData } from "app/actions"
import { api, fn } from "app/utils"
import { url } from "app/constants"
import {
  Back,
  ButtonStandard,
  FormButton,
  FormSection,
  Link,
  PageTitle,
  MetaSection,
  Meta
} from "app/components"
import { connect } from "react-redux"

@connect((store, ownProps) => {
  return {
    statement: store.statement,
    me: store.me.data
  }
})
export default class Edit extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      ...this.props.me.data,
      uploadedPhoto: null,
      currentPage: 1
    }
  }

  componentDidMount() {
    this.fetchStatement(1)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.me.data) {
      this.forceUpdate(...nextProps.me.data)
    }
  }

  handleInputChange = (name, value) => {
    this.setState({ [name]: value })
  }

  onDrop = file => {
    this.setState({ uploadedPhoto: file[0] })
  }

  handleSubmit = async () => {
    let formData = new FormData()
    formData.append("first_name", this.state.first_name)
    formData.append("last_name", this.state.last_name)
    formData.append("email", this.state.email)
    formData.append("telephone", this.state.telephone)
    formData.append("mobile", this.state.mobile)
    formData.append("address", this.state.address)
    formData.append("address2", this.state.address2)
    formData.append("town", this.state.town)
    formData.append("postcode", this.state.postcode)
    formData.append("company_number", this.state.companyNumber)
    formData.append("organisation_name", this.state.organisationName)
    formData.append("fa_affiliation", this.state.faAffiliation)
    formData.append("vat_number", this.state.vatNumber)

    // Validate email.
    const email = this.state.email
    const confirmEmail = this.state.confirmEmail ? this.state.confirmEmail : ""
    if (email !== confirmEmail) {
      this.refEmail.setValidationMessage({
        valid: false,
        errors: ["Incorrect email combination"]
      })
      this.refForm && this.refForm.hideLoader()
      return
    }

    const response = await api.post("/users/me", formData)

    if (!api.error(response)) {
      Store.dispatch({ type: "ME_UPDATE", payload: response.data })
      fn.navigate(url.licence)
    } else {
      this.refForm && this.refForm.hideLoader()
    }
  }

  renderPageActions = () => {
    const { mandate, role_id } = this.state
    switch (fn.getUserRole()) {
      case "coach":
        return (
          <div className="page-actions">
            <ButtonStandard
              to={`${url.profile}/${url.changePassword}`}
              icon={<i className="ion-locked" />}
            >
              Change Password
            </ButtonStandard>

            <ButtonStandard
              to={`${url.profile}/qualifications`}
              icon={<i className="ion-plus" />}
            >
              Upload Qualifications
            </ButtonStandard>

            <ButtonStandard
              to={`${url.profile}/crb-profle`}
              icon={<i className="ion-plus" />}
            >
              Upload CRB profile
            </ButtonStandard>
          </div>
        )
      default:
        return (
          <div className="page-actions">
            <ButtonStandard
              to={`${url.profile}/change-password`}
              icon={<i className="ion-locked" />}
            >
              Change Password
            </ButtonStandard>

            {// Show if role is super admin & gocardless account not setup
            role_id === 4 && mandate === null ? (
              <ButtonStandard
                to={`${url.profile}/change-password`}
                icon={<i className="ion-locked" />}
              >
                Add Gocardless Account
              </ButtonStandard>
            ) : null}
          </div>
        )
    }
  }

  fetchStatement = (currentPage = 1) => {
    const { me } = this.props
    this.setState({
      stmtCurrentPage: currentPage
    })

    // Check user role, if it is admin then send to only admin statement route.
    if (me.user_role === "admin") {
      this.props.dispatch(
        fetchData({
          type: "STATEMENT",
          url: `/statements/club`,
          page: currentPage
        })
      )
    } else {
      this.props.dispatch(
        fetchData({
          type: "STATEMENT",
          url: `/statements/franchises/${me.franchise_id}?page=${currentPage}`,
          page: currentPage
        })
      )
    }
  }

  getTotal = statement => {
    const role = fn.getUserRole()
    // Base on user field will  change
    switch (role) {
      case "groupadmin":
        return fn.formatPrice(
          statement.misc.total_credit && statement.misc.total_credit
        )
      default:
        return fn.formatPrice(statement.misc.total && statement.misc.total)
    }
  }

  render() {
    const { statement, me } = this.props

    const { currentPage, selectedStatementId } = this.state

    let totalPaid = fn.formatPrice(
      statement.misc.balance && statement.misc.balance
    )

    console.log("userrole is :", fn.getUserRole())
    console.log(me)

    return (
      <div id="content" className="site-content-inner my-detail-page">
        <PageTitle
          value="Account details"
          faq={true}
          faqLink={fn.getFaqLink("saDetails", "/")}
        />

        {this.renderPageActions()}

        <Form
          loader
          wide
          onValidationError={fn.scrollToTop}
          onSubmit={this.handleSubmit}
          ref={ref => (this.refForm = ref)}
        >
          <FormSection title="Organisation">
            <TextInput
              className="tooltips"
              prepend={<i className="icon-organisation" />}
              name="organisationName"
              tooltips="true"
              value={me && me.organisation_name}
              label="Organisation name"
              placeholder="Organisation name"
              validation="required"
              onChange={this.handleInputChange}
            />
          </FormSection>
          <FormSection title="" className={"mt-0"}>
            <TextInput
              className="tooltips"
              prepend={<i className="ion-location" />}
              name="address"
              placeholder="Address"
              label="Address"
              value={me && me.address}
              onChange={this.handleInputChange}
            />

            <TextInput
              className="tooltips"
              prepend={<i className="ion-location" />}
              placeholder="Address 2"
              name="address2"
              label="Address 2"
              value={me && me.address2}
              onChange={this.handleInputChange}
            />

            <TextInput
              className="tooltips"
              prepend={<i className="ion-location" />}
              placeholder="City / Town"
              name="town"
              label="City / Town"
              value={me && me.town}
              onChange={this.handleInputChange}
            />

            <TextInput
              className="tooltips"
              prepend={<i className="ion-location" />}
              placeholder="Postcode"
              name="postcode"
              label="Postcode"
              value={me && me.postcode}
              onChange={this.handleInputChange}
            />
          </FormSection>

          <FormSection title="Contact Details">
            <TextInput
              className="tooltips"
              prepend={<i className="ion-person" />}
              placeholder="First name"
              name="first_name"
              label="First name"
              value={me && me.first_name}
              onChange={this.handleInputChange}
            />

            <TextInput
              className="tooltips"
              prepend={<i className="ion-person" />}
              placeholder="Last name"
              name="last_name"
              label="Last name"
              value={me && me.last_name}
              onChange={this.handleInputChange}
            />

            <TextInput
              className="tooltips"
              prepend={<i className="ion-ios-telephone" />}
              placeholder="Telephone"
              name="telephone"
              label="Telephone"
              value={me && me.telephone}
              onChange={this.handleInputChange}
            />

            <TextInput
              className="tooltips"
              prepend={<i className="ion-ios-telephone" />}
              placeholder="Mobile"
              name="mobile"
              label="Mobile"
              value={me.mobile && me.mobile}
              onChange={this.handleInputChange}
            />

            <TextInput
              className="tooltips"
              prepend={<i className="ion-at" />}
              placeholder="Email"
              name="email"
              label="Email"
              value={me && me.email}
              onChange={this.handleInputChange}
            />

            <TextInput
              prepend={<i className="ion-at" />}
              ref={ref => (this.refEmail = ref)}
              className="tooltips"
              label="Confirm Email"
              name="confirmEmail"
              placeholder="Confirm email"
              validation="required|email"
              onChange={this.handleInputChange}
            />

            <div className="form-actions">
              <FormButton label="Save" />
            </div>
          </FormSection>
        </Form>

        <div className="">
          <h2>Statements</h2>
          <p>
            <strong>Total Fee: </strong>
            {this.getTotal(statement)}
          </p>
          <p>
            <strong>Balance: </strong>
            {totalPaid}
          </p>
          <p>
            <strong>Total: </strong>
            {statement.count && statement.count}
          </p>
        </div>

        <ContentLoader
          pagination={{
            currentPage,
            onPageChange: this.fetchStatement,
            total: statement.count
          }}
          data={statement.currentCollection}
          forceRefresh
          isLoading={statement.isLoading}
          noResults="No statement found"
        >
          <Table
            className={"stmt-table header-transparent"}
            total={statement.total}
            headers={["Date", "Description", "Amount"]}
            icon="ion-pound"
          >
            {_.map(statement.currentCollection, (stmtcol, index) => {
              const stmt = statement.collection[stmtcol]
              return (
                <tr key={index}>
                  <td className={"date"}>
                    {fn.formatDate(stmt.date, "D MMM YYYY")}
                  </td>
                  <td>
                    {stmt.invoice_id && "Package Fee"}
                    {stmt.transaction_id ? stmt.description : null}
                    {stmt.club_title ? `- ${stmt.club_title}` : null}
                    {stmt.title ? ` ${stmt.title}` : null}
                  </td>
                  <td className={"align-right amount"}>
                    {stmt.transaction_id
                      ? `- £${_.replace(stmt.amount, "-", "")}`
                      : `£${stmt.amount}`}
                  </td>
                </tr>
              )
            })}
          </Table>

          <div className="flex back-button">
            <Back className="button">Go Back</Back>
          </div>
        </ContentLoader>
      </div>
    )
  }
}
