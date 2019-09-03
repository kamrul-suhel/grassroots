import React from "react"
import { connect } from "react-redux"
import {
  DatePicker,
  FileUpload,
  Form,
  TextInput
} from "@xanda/react-components"
import { api, fn } from "app/utils"
import { url } from "app/constants"
import { fetchData } from "app/actions"
import { Back, FormButton, FormSection, PageTitle } from "app/components"

@connect((store, ownProps) => {
  return {
    guardian: store.guardian.collection[ownProps.params.userId] || {}
  }
})
export default class Edit extends React.PureComponent {
  componentWillMount = async () => {
    this.props.dispatch(
      fetchData({
        type: "GUARDIAN",
        url: `/users/${this.props.params.userId}`
      })
    )
  }

  handleInputChange = (name, value) => {
    this.setState({ [name]: value })
  }

  handleSubmit = async () => {
    const formData = new FormData()
    formData.append("address", this.state.address)
    formData.append("email", this.state.email)
    formData.append("emergency_number", this.state.emergency_number)
    formData.append("first_name", this.state.first_name)
    formData.append("last_name", this.state.last_name)
    formData.append("mobile", this.state.mobile)
    this.state.password && formData.append("password", this.state.password)
    formData.append("postcode", this.state.postcode)
    formData.append("telephone", this.state.telephone)
    formData.append("town", this.state.town)
    formData.append("partner_name", this.state.partner_name)
    formData.append("partner_tel", this.state.partner_tel)

    const response = await api.post(
      `/users/${this.props.params.userId}`,
      formData
    )

    if (!api.error(response)) {
      console.log(response)
      fn.navigate(url.guardian)
    } else {
      this.refForm && this.refForm.hideLoader()
    }
  }

  render() {
    const { guardian, subComponent } = this.props

    return (
      <div id="content" className="site-content-inner">
        {!subComponent && <PageTitle value="Edit guardian" />}
        <Form
          loader
          wide
          onSubmit={this.handleSubmit}
          ref={ref => (this.refForm = ref)}
        >
          <FormSection title="Account">
            <TextInput
              className="tooltips"
              placeholder="Email"
              label="Email"
              name="email"
              onChange={this.handleInputChange}
              prepend={<i className="ion-android-mail" />}
              value={guardian.email}
              validation="required"
            />
            <TextInput
              className="tooltips"
              placeholder="Reset Password"
              label="Reset Password"
              name="password"
              onChange={this.handleInputChange}
              prepend={<i className="ion-locked" />}
              type="password"
            />
          </FormSection>

          <FormSection title="Personal Details">
            <TextInput
              className="tooltips"
              placeholder="First name"
              label="First name"
              name="first_name"
              onChange={this.handleInputChange}
              prepend={<i className="ion-person" />}
              value={guardian.first_name}
              validation="required"
            />
            <TextInput
              className="tooltips"
              placeholder="Last name"
              label="Last name"
              name="last_name"
              onChange={this.handleInputChange}
              prepend={<i className="ion-person" />}
              value={guardian.last_name}
              validation="required"
            />
            <TextInput
              className="tooltips"
              placeholder="Mobile"
              prepend={<i className="ion-ios-telephone" />}
              name="mobile"
              label="Mobile"
              value={guardian.mobile}
              onChange={this.handleInputChange}
            />
            <TextInput
              className="tooltips"
              placeholder="Telephone"
              label="Telephone"
              name="telephone"
              onChange={this.handleInputChange}
              prepend={<i className="ion-ios-telephone" />}
              value={guardian.telephone}
            />
            <TextInput
              className="tooltips"
              placeholder="Emergency Contact Number"
              label="Emergency Contact Number"
              name="emergency_number"
              onChange={this.handleInputChange}
              prepend={<i className="ion-ios-telephone" />}
              value={guardian.emergency_number}
            />
            <TextInput
              className="tooltips"
              placeholder="Address"
              label="Address"
              name="address"
              onChange={this.handleInputChange}
              prepend={<i className="ion-location" />}
              value={guardian.address}
            />
            <TextInput
              className="tooltips"
              placeholder="Town"
              label="Town"
              name="town"
              onChange={this.handleInputChange}
              prepend={<i className="ion-location" />}
              value={guardian.town}
            />
            <TextInput
              className="tooltips"
              placeholder="Postcode"
              label="Postcode"
              name="postcode"
              onChange={this.handleInputChange}
              prepend={<i className="ion-location" />}
              value={guardian.postcode}
            />
            <TextInput
              className="tooltips"
              placeholder="Add partner"
              label="Add Partner"
              name="partner_name"
              onChange={this.handleInputChange}
              prepend={<i className="ion-person" />}
              value={guardian.partner_name}
            />
            <TextInput
              className="tooltips"
              placeholder="Partner's Telephone"
              label="Partner's Telephone"
              name="partner_tel"
              onChange={this.handleInputChange}
              prepend={<i className="ion-ios-telephone" />}
              value={guardian.partner_tel}
            />
            <div className="form-actions">
              <Back className="button" confirm>
                Cancel
              </Back>
              <FormButton label="Save" />
            </div>
          </FormSection>
        </Form>
      </div>
    )
  }
}
