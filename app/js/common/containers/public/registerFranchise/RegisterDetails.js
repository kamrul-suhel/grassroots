import React from "react";
import { Checkbox, Form, TextInput } from "@xanda/react-components";
import { api, fn } from "app/utils";
import { url } from "app/constants";
import { Back, PageTitle, FormSection, SiteFooter } from "app/components";
import { connect } from "react-redux";

@connect(store => {
  return {
    players: store.player
  };
})
export default class RegisterDetails extends React.PureComponent {
  state = {
    passwordError: null,
    serverError: null
  };

  constructor(props) {
    super(props);

    this.refFormButton = null;
  }

  componentWillMount() {
    if (_.size(this.props.registerFranchise.packages) === 0) {
      fn.navigate(url.registerFranchise);
    }
  }

  componentDidMount() {
    window.addEventListener(
      "formSubmission.registerFranchise",
      this.submitForm
    );
  }

  componentWillUnmount() {
    window.removeEventListener(
      "formSubmission.registerFranchise",
      this.submitForm
    );
  }

  submitForm = () => {
    this.refFormButton.click();
  };

  handleInputChange = (name, value) => {
    if (
      name === "passwordConfirmation" ||
      name === "password" ||
      name === "email"
    ) {
      this.setState({ passwordError: null, serverError: null });
    }

    const payload = {
      name,
      value
    };

    return this.props.dispatch({
      type: "REGISTERFRANCHISE_UPDATE_ACCOUNT_INFO",
      payload
    });
  };

  handleSubmit = async () => {
    const { registerFranchise } = this.props;

    const packages = [];
    // Validate password
    const password = registerFranchise.account.password;
    const password_confirmation =
      registerFranchise.account.passwordConfirmation;
    if (password !== password_confirmation) {
      this.setState({ passwordError: "Passwords don’t match" });
      this.refForm && this.refForm.hideLoader();
      return;
    }

    // Check password character length
    if (_.size(password) < 8) {
      this.setState({
        passwordError: "Password must be at least 8 characters long."
      });
      this.refForm && this.refForm.hideLoader();
      return;
    }

    // Validate email.
    const email = registerFranchise.account.email;
    const confirmEmail = registerFranchise.account.confirmEmail
      ? registerFranchise.account.confirmEmail
      : "";
    if (email !== confirmEmail) {
      this.refConfirmEmail.setValidationMessage({
        valid: false,
        errors: ["Email addresses don’t match"]
      });
      this.refForm && this.refForm.hideLoader();
      return;
    }

    // loop through packages and create the desired array
    _.map(registerFranchise.packages, pckg => {
      for (let i = 0; i < pckg.qty; i++) {
        packages.push({
          id: pckg.id,
          price: pckg.price
        });
      }
    });

    let formData = new FormData();

    _.map(packages, (value, index) => {
      if (_.isObject(value)) {
        _.map(value, (k, j) => {
          formData.append("packages[" + index + "][" + j + "]", k);
        });
      }
    });

    formData.append(
      "franchise_name",
      registerFranchise.account.organisationName
    );
    formData.append("first_name", registerFranchise.account.firstName);
    formData.append("last_name", registerFranchise.account.lastName);
    formData.append("email", registerFranchise.account.email);
    formData.append("telephone", registerFranchise.account.telephone);
    formData.append("mobile", registerFranchise.account.mobile);
    formData.append("password", registerFranchise.account.password);
    formData.append(
      "password_confirmation",
      registerFranchise.account.passwordConfirmation
    );
    formData.append("address", registerFranchise.account.address);
    formData.append("company_number", registerFranchise.account.companyNumber);
    formData.append(
      "organisation_name",
      registerFranchise.account.organisationName
    );
    formData.append("vat_number", registerFranchise.account.vatNumber);
    formData.append("address2", registerFranchise.account.address2);
    formData.append("fa_affiliation", registerFranchise.account.faAffiliation);
    formData.append("town", registerFranchise.account.town);
    formData.append("postcode", registerFranchise.account.postcode);
    formData.append("privacyPolicy", registerFranchise.account.privacyPolicy);

    // Add field to form when contact with email click.
    if (registerFranchise.account.privacyPolicy.length > 0) {
      formData.append("email_contact", 1);
    }

    const response = await api.post("/public/register-franchise", formData);

    if (!api.error(response, false)) {
      this.refForm && this.refForm.hideLoader();
      window.open(response.data.redirect_url, "_balnk");

      // fn.navigate(`${url.registerFranchise}/confirmation?email=${registerFranchise.account.email}`);
    } else {
      const email = response.data.email && response.data.email;
      if (email) {
        this.refEmail.setValidationMessage({
          valid: false,
          errors: ["The email has already been taken"]
        });
      }
      const errorHtml = api.getErrorsHtml(response.data);
      this.setState({ serverError: errorHtml });
    }

    this.refForm && this.refForm.hideLoader();
  };

  handleValidationError = () => {
    const fields = this.refForm.fields;
    _.forEach(fields, (field, index) => {
      const validate = field.validate();
      if (!validate.valid) {
        const element = document.getElementsByName(field.props.id);
        element[0].focus();
        return false;
      }
    });
  };

  render() {
    return (
      <div id="content" className="register-page site-content-inner">
        <PageTitle value="Enter your details" />
        <Form
          loader
          wide
          onSubmit={this.handleSubmit}
          onValidationError={this.handleValidationError}
          ref={ref => (this.refForm = ref)}
        >
          <FormSection title="Organisation">
            <TextInput
              id="organisationName"
              ref={ref => (this.organisationName = ref)}
              prepend={<i className="icon-organisation" />}
              className="tooltips"
              label="Organisation name"
              name="organisationName"
              placeholder="Organisation name"
              validation="required"
              onChange={this.handleInputChange}
            />

            <div className="form-group" />

            <TextInput
              id="address"
              prepend={<i className="ion-location" />}
              className="tooltips"
              label="Address"
              name="address"
              validation="required"
              placeholder="Address"
              onChange={this.handleInputChange}
            />

            <TextInput
              prepend={<i className="ion-location" />}
              className="tooltips"
              label="Address 2"
              name="address2"
              placeholder="Address 2"
              onChange={this.handleInputChange}
            />

            <TextInput
              id={"town"}
              prepend={<i className="ion-location" />}
              className="tooltips"
              label="City"
              name="town"
              validation="required"
              placeholder="City"
              onChange={this.handleInputChange}
            />

            <TextInput
              id="postcode"
              prepend={<i className="ion-location" />}
              className="tooltips"
              label="Postcode"
              name="postcode"
              validation="required"
              placeholder="Postcode"
              onChange={this.handleInputChange}
            />
          </FormSection>

          <FormSection title="CONTACT DETAILS">
            <TextInput
              id="firstName"
              prepend={<i className="ion-person" />}
              className="tooltips"
              label="First name"
              name="firstName"
              placeholder="First name"
              validation="required"
              onChange={this.handleInputChange}
            />

            <TextInput
              id="lastName"
              prepend={<i className="ion-person" />}
              className="tooltips"
              label="Last name"
              name="lastName"
              placeholder="Last name"
              validation="required"
              onChange={this.handleInputChange}
            />

            <TextInput
              id="telephone"
              prepend={<i className="ion-ios-telephone" />}
              className="tooltips"
              label="Telephone"
              name="telephone"
              placeholder="Telephone"
              validation="required"
              onChange={this.handleInputChange}
            />

            <TextInput
              prepend={<i className="ion-ios-telephone" />}
              className="tooltips"
              label="Mobile"
              name="mobile"
              placeholder="Mobile"
              onChange={this.handleInputChange}
            />

            <TextInput
              id="email"
              prepend={<i className="ion-at" />}
              className="tooltips"
              ref={ref => (this.refEmail = ref)}
              label="Email"
              name="email"
              placeholder="Email"
              validation="required|email"
              onChange={this.handleInputChange}
            />

            <TextInput
              id="confirmEmail"
              prepend={<i className="ion-at" />}
              ref={ref => (this.refConfirmEmail = ref)}
              className="tooltips"
              label="Confirm Email"
              name="confirmEmail"
              placeholder="Confirm email"
              validation="required|email"
              onChange={this.handleInputChange}
            />
          </FormSection>

          <FormSection
            title="Create Password"
            className="register-account-inner"
          >
            <TextInput
              id="password"
              prepend={<i className="ion-locked" />}
              className="tooltips"
              label="Password"
              name="password"
              placeholder="Create password"
              type="password"
              validation="required"
              onChange={this.handleInputChange}
            />

            <TextInput
              id="passwordConfirmation"
              prepend={<i className="ion-locked" />}
              className="tooltips"
              label="Confirm password"
              name="passwordConfirmation"
              placeholder="Confirm password"
              type="password"
              validation="required"
              onChange={this.handleInputChange}
            />

            {this.state.passwordError ? (
              <ul className="error">
                <li className="text-error">{this.state.passwordError}</li>
              </ul>
            ) : (
              ""
            )}
          </FormSection>

          <Checkbox
            name="privacyPolicy"
            className="terms register-detail privacy"
            options={[
              {
                id: 1,
                title: (
                  <span>
                    My Grassroots Club would like to keep you informed about
                    products and services by sending you occasional emails and
                    newsletters. See our{" "}
                    <a
                      href="http://grassroots.hostings.co.uk/pages/privacy-policy"
                      target="_blank"
                    >
                      Privacy Policy
                    </a>{" "}
                    for details or to opt-out at any time.
                  </span>
                )
              },
              {
                id: 2,
                title: (
                  <span>
                    <b>I consent to being contacted.</b>
                  </span>
                )
              }
            ]}
            onChange={this.handleInputChange}
          />

          <Checkbox
            name="terms"
            className="terms register-detail"
            options={[
              {
                id: 1,
                title: (
                  <span>
                    By clicking “Proceed”, I agree that I have read and accept
                    the{" "}
                    <a
                      href="http://grassroots.hostings.co.uk/pages/terms"
                      target="_blank"
                    >
                      {" "}
                      Terms and Conditions.
                    </a>
                  </span>
                )
              }
            ]}
            validation="required"
            onChange={this.handleInputChange}
          />

          {/*{this.state.serverError && <div className="">{this.state.serverError}</div>}*/}

          <div className="form-actions">
            <Back className="button">Back</Back>
            <button
              type="submit"
              className="button form-submit hover-blue"
              ref={ref => (this.refFormButton = ref)}
            >
              Proceed
            </button>
          </div>
        </Form>

        <SiteFooter />
      </div>
    );
  }
}
