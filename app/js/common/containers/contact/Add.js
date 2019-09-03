import React from "react"
import { connect } from "react-redux"
import { DatePicker, Form, Select, TextInput } from "@xanda/react-components"
import { api, fn } from "app/utils"
import { url } from "app/constants"
import { fetchData } from "app/actions"
import { Back, FormButton, FormSection, PageTitle } from "app/components"

@connect(store => {
  return {
    alerts: store.alert
  }
})
export default class Add extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      addressTypes: [],
      transactionTypeList: []
    }
  }

  componentWillMount = async () => {
    const addressTypes = await api.get("/dropdown/address-type")
    const transactionTypeList = await api.get("/transaction-types")

    this.setState({
      addressTypes: addressTypes.data,
      transactionTypeList: transactionTypeList.data.entities
    })
  }

  handleInputChange = (name, value) => {
    this.setState({ [name]: value })
  }

  handleSubmit = async () => {
    const {
      address,
      city,
      firstname,
      lastname,
      company,
      email,
      mobile,
      position,
      postcode,
      telephone,
      payment_method_id,
      title,
      type
    } = this.state

    const { subComponent } = this.props

    const formData = new FormData()

    address && formData.append("address", address)
    city && formData.append("city", city)
    firstname && formData.append("contact_first_name", firstname)
    lastname && formData.append("contact_last_name", lastname)
    company && formData.append("company", company)
    email && formData.append("email", email)
    position && formData.append("position", position)
    postcode && formData.append("postcode", postcode)
    telephone && formData.append("telephone", telephone)
    mobile && formData.append("mobile", mobile)
    payment_method_id && formData.append("paymenttype", email)
    title && formData.append("title", title)

    // Hard coded type if sub component for venue, In database venue id is 3.
    if (subComponent) {
      formData.append("type_id", 3)
    } else {
      type && formData.append("type_id", type)
    }

    const response = await api.post("/addresses", formData)
    this.refForm && this.refForm.hideLoader()

    if (!api.error(response)) {
      // If sub component then call passed method
      if (subComponent) {
        this.props.onAddVenue()
      } else {
        fn.navigate(url.contact)
      }
    } else {
      this.refForm && this.refForm.hideLoader()
    }
  }

  handleCloseVenue = () => {
    this.props.cancelVenue()
  }

  render() {
    const { addressTypes, transactionTypeList } = this.state

    const { subComponent } = this.props

    return (
      <div id="content" className="site-content-inner">
        <PageTitle value="Create contact" />
        <Form
          loader
          wide
          onValidationError={fn.scrollToTop}
          className={subComponent ? "sub-component" : ""}
          onSubmit={this.handleSubmit}
          ref={ref => (this.refForm = ref)}
        >
          <FormSection title="Contact details">
            <TextInput
              className="tooltips"
              placeholder="First name"
              label="First Name"
              name="firstname"
              onChange={this.handleInputChange}
              prepend={<i className="ion-person" />}
              validation="required"
            />

            <TextInput
              className="tooltips"
              placeholder="Last name"
              label="Last Name"
              name="lastname"
              onChange={this.handleInputChange}
              prepend={<i className="ion-person" />}
            />

            <TextInput
              className="tooltips"
              placeholder="Position"
              label="Position"
              name="position"
              onChange={this.handleInputChange}
              prepend={<i className="ion-university" />}
            />

            <TextInput
              className="tooltips"
              placeholder="Telephone Incl Ext"
              label="Telephone Incl Ext"
              name="telephone"
              onChange={this.handleInputChange}
              prepend={<i className="ion-ios-telephone" />}
            />

            <TextInput
              className="tooltips"
              placeholder="Mobile"
              label="Mobile"
              name="mobile"
              onChange={this.handleInputChange}
              prepend={<i className="ion-ios-telephone" />}
            />

            <TextInput
              className="tooltips"
              placeholder="Email"
              label="Email"
              name="email"
              onChange={this.handleInputChange}
              prepend={<i className="ion-android-mail" />}
            />

            <TextInput
              className="tooltips"
              placeholder="Organisation name"
              label="Organisation Name"
              name="company"
              onChange={this.handleInputChange}
              prepend={<i className="ion-briefcase" />}
            />
            {!subComponent && (
              <Select
                className="tooltips"
                placeholder="Role"
                label="Role"
                name="type"
                onChange={this.handleInputChange}
                options={addressTypes}
                validation="required"
                prepend={<i className="icon ion-person-stalker" />}
              />
            )}
          </FormSection>

          <FormSection title="Address">
            <TextInput
              className="tooltips"
              placeholder="Name of location"
              label="Name of location"
              name="title"
              validation={subComponent ? "required" : null}
              onChange={this.handleInputChange}
              prepend={<i className="ion-location" />}
            />

            <TextInput
              className="tooltips"
              placeholder="Address"
              label="Address"
              name="address"
              onChange={this.handleInputChange}
              prepend={<i className="ion-location" />}
            />

            <TextInput
              className="tooltips"
              placeholder="City"
              label="City"
              name="city"
              onChange={this.handleInputChange}
              prepend={<i className="ion-location" />}
            />

            <TextInput
              className="tooltips"
              placeholder="Postcode"
              label="Postcode"
              name="postcode"
              onChange={this.handleInputChange}
              prepend={<i className="ion-location" />}
            />

            <div className="form-actions">
              {subComponent ? (
                <span className="button" onClick={this.handleCloseVenue}>
                  Cancel
                </span>
              ) : (
                <Back className="button" showCloseButton={false} confirm>
                  Cancel
                </Back>
              )}
              <FormButton label="Save" />
            </div>
          </FormSection>
        </Form>
      </div>
    )
  }
}
