import React from "react"
import { connect } from "react-redux"
import {
  Dialog,
  Form,
  Select,
  TextInput,
  GoogleMap
} from "@xanda/react-components"
import { api, fn } from "app/utils"
import { url } from "app/constants"
import { fetchData } from "app/actions"
import { Back, FormButton, FormSection, PageTitle } from "app/components"

@connect((state, ownProps) => {
  return {
    address: state.address.collection[ownProps.params.addressId] || {}
  }
})
export default class Edit extends React.PureComponent {
  constructor(props) {
    super(props)

    this.addressId = this.props.params.addressId

    this.state = {
      addressTypes: [],
      transactionTypeList: [],
      contactError: false,
      errorMessage: ""
    }
  }

  componentWillMount = async () => {
    this.props.dispatch(
      fetchData({
        type: "ADDRESS",
        url: `/addresses/${this.addressId}`
      })
    )

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

  closeBox = () => {
    this.setState({
      contactError: false,
      errorMessage: ""
    })
    this.refDialog.close()
  }

  handleSubmit = async () => {
    const formData = new FormData()
    const {
      address,
      city,
      firstname,
      lastname,
      company,
      email,
      position,
      postcode,
      telephone,
      mobile,
      payment_method_id,
      title,
      type,
      status
    } = this.state

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
    type && formData.append("type_id", type)
    if (status === 0 || status === 1) {
      formData.append("status", status)
    }

    console.log(this.state.status)

    const response = await api.update(`/addresses/${this.addressId}`, formData)

    if (!api.error(response, false)) {
      fn.navigate(url.contact)
      console.log("succesfully updated contacts!", response)
      // fn.showAlert("Address has been updated successfully!", "success")
    } else {
      const errorData = api.getErrorsHtml(response.data)
      this.setState({
        contactError: true,
        errorMessage: errorData
      })
    }
    this.refForm && this.refForm.hideLoader()
    this.refDialog.open()
  }

  render() {
    const { addressTypes, transactionTypeList } = this.state
    const { address } = this.props

    const statusOptions = [
      { id: 1, title: "Active" },
      { id: 0, title: "Inactive" }
    ]

    console.log(address)

    return (
      <div id="content" className="site-content-inner">
        <PageTitle value="Edit contact" />
        <Form
          loader
          onValidationError={fn.scrollToTop}
          wide
          onSubmit={this.handleSubmit}
          ref={ref => (this.refForm = ref)}
        >
          <FormSection title="Contact details">
            <TextInput
              label="First Name"
              name="firstname"
              onChange={this.handleInputChange}
              prepend={<i className="ion-person" />}
              validation="required"
              value={address.first_name || null}
            />
            <TextInput
              label="Last Name"
              name="lastname"
              onChange={this.handleInputChange}
              prepend={<i className="ion-person" />}
              validation="required"
              value={address.last_name || null}
            />
            <TextInput
              label="Position"
              name="position"
              onChange={this.handleInputChange}
              prepend={<i className="ion-university" />}
              value={address.position}
            />
            <TextInput
              label="Telephone Incl Ext"
              name="telephone"
              onChange={this.handleInputChange}
              prepend={<i className="ion-ios-telephone" />}
              validation="required"
              value={address.telephone}
            />
            <TextInput
              label="Mobile"
              name="mobile"
              onChange={this.handleInputChange}
              prepend={<i className="ion-ios-telephone" />}
              value={address.mobile}
            />
            <TextInput
              label="Email"
              name="email"
              onChange={this.handleInputChange}
              prepend={<i className="ion-android-mail" />}
              validation="required"
              value={address.email}
            />
            <TextInput
              label="Organisation Name"
              name="company"
              onChange={this.handleInputChange}
              prepend={<i className="ion-briefcase" />}
              value={address.company}
            />
            <Select
              label="Status"
              name="status"
              onChange={this.handleInputChange}
              options={statusOptions}
              prepend={<i className="ion-person" />}
              value={address.status}
            />
            <Select
              label="Payment Method"
              name="paymenttype"
              onChange={this.handleInputChange}
              options={transactionTypeList}
              prepend={<i className="ion-card" />}
              value={address.payment_method_id}
            />
          </FormSection>

          <FormSection title="Address">
            <TextInput
              label="Title"
              name="title"
              onChange={this.handleInputChange}
              prepend={<i className="ion-location" />}
              validation="required"
              value={address.title}
            />
            <Select
              label="Address Type"
              name="type"
              onChange={this.handleInputChange}
              options={addressTypes}
              validation="required"
              value={address.type_id}
            />
            <TextInput
              label="Address"
              name="address"
              onChange={this.handleInputChange}
              prepend={<i className="ion-location" />}
              validation="required"
              value={address.address}
            />
            <TextInput
              label="City"
              name="city"
              onChange={this.handleInputChange}
              prepend={<i className="ion-location" />}
              validation="required"
              value={address.city}
            />
            <TextInput
              label="Postcode"
              name="postcode"
              onChange={this.handleInputChange}
              prepend={<i className="ion-location" />}
              validation="required"
              value={address.postcode}
            />

            <div className="google-map">
              <GoogleMap lat={address.lat} lng={address.lng} />
            </div>

            <div className="form-actions">
              <Back className="button" confirm>
                Cancel
              </Back>
              <FormButton label="Save" />
            </div>
          </FormSection>
        </Form>

        <Dialog
          ref={ref => (this.refDialog = ref)}
          close={false}
          showCloseButton={false}
          title="Error"
          content={this.state.errorMessage}
          buttons={[
            <button className="button" onClick={() => this.closeBox()}>
              Go Back
            </button>
          ]}
        >
          <button className="button hidden" />
        </Dialog>
      </div>
    )
  }
}
