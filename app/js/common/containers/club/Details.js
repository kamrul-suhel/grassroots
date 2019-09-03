import React from "react";
import {
  Checkbox,
  Dialog,
  FileUpload,
  Form,
  Radio,
  TextInput
} from "@xanda/react-components";
import { api, fn } from "app/utils";
import { url } from "app/constants";
import { Back, FormButton, PageTitle, FormSection } from "app/components";

export default class Details extends React.PureComponent {
  constructor(props) {
    super(props);

    this.clubId = this.props.params.clubId;
    this.state = {
      type: [],
      clubTypes: [
        { id: "academy", title: "Soccer School" },
        { id: "fc", title: "Football Club" },
        { id: "both", title: "Both" }
      ]
    };
  }

  handleInputChange = (name, value) => {
    this.setState({ [name]: value });

    if (name === "title") {
      this.refSlug && this.refSlug.updateValue(fn.stringToSlug(value));
    }
  };

  handleSubmit = async () => {
    const vatNumber = this.state.isRegistered == 1 ? this.state.vatNumber : "";
    const vatRate = this.state.isRegistered == 1 ? this.state.vatRate : 0;

    const formData = new FormData();
    this.state.type && formData.append("type", this.state.type);
    this.state.address && formData.append("address", this.state.address);
    this.state.address2 && formData.append("address2", this.state.address2);
    this.state.postcode && formData.append("postcode", this.state.postcode);
    this.state.email && formData.append("email", this.state.email);
    this.state.pic && formData.append("logo_url", this.state.pic);
    this.state.telephone && formData.append("telephone", this.state.telephone);
    this.state.town && formData.append("town", this.state.town);
    formData.append("vat_number", vatNumber);
    formData.append("vat_rate", vatRate);
    this.state.threshold && formData.append("threshold", this.state.threshold);
    this.state.fcCompany && formData.append("fc_company", this.state.fcCompany);
    this.state.ssCompany && formData.append("ss_company", this.state.ssCompany);
    this.state.website && formData.append("website", this.state.website);

    this.state.companyNumber &&
      formData.append("company_number", this.state.companyNumber);
    this.state.faAffiliation &&
      formData.append("fa_affiliation", this.state.faAffiliation);

    const response = await api.update(`/clubs/${this.clubId}`, formData);

    if (!api.error(response)) {
      this.props.fetchData();
      fn.navigate(`${url.club}/${this.clubId}`);
      // this.refForm && this.refForm.hideLoader();
    } else {
      this.refForm && this.refForm.hideLoader();
    }
  };

  handleValidationError = () => {
    const element = document.getElementById("site-content");
    element.scrollTop = 0;
  };

  renderLinkInfo = (admin, params) => {
    return (
      <li>
        <span>{admin}:</span>
        <button
          className="btn-club-portal"
          onClick={e => this.loginPortal(e, params)}
        >
          {url.baseUrl}/{params}
        </button>
        <Dialog
          className="url-dialog"
          showCloseButton={false}
          title=""
          content={
            <div className="dialog-body-inner">
              <div className={"dialog-left-sidebar"}>
                <img src={"/images/ball-soccer.png"} />
              </div>
              <div className={"dialog-right-side"}>
                <h3>{admin}</h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                </p>
              </div>
            </div>
          }
          buttons={[
            <button key="cancel" className="button">
              Go back
            </button>
          ]}
        >
          <div className="url-info">?</div>
        </Dialog>
      </li>
    );
  };

  render() {
    const { club } = this.props;
    const { clubTypes } = this.state;
    const isRegistered = club.vat_rate || club.vat_number ? 1 : 0;
    const academySelected =
      this.state.type && this.state.type.indexOf("fc") === -1;
    const fcSelected =
      this.state.type && this.state.type.indexOf("academy") === -1;

    return (
      <div id="content" className="site-content-inner club-setup-page">
        <PageTitle value="General details" />

        <Form
          onValidationError={this.handleValidationError}
          loader
          onSubmit={this.handleSubmit}
          ref={ref => (this.refForm = ref)}
        >
          <FormSection title="Links">
            <div className="club-url">
              <ul>
                {this.renderLinkInfo("Club Admin", `${club.slug}`)}
                {this.renderLinkInfo(
                  "New Parent",
                  `${club.slug}/${url.registerAccounts}`
                )}
                {this.renderLinkInfo("Parent Terminal", `${club.slug}`)}
                {this.renderLinkInfo("Coach Terminal", `${club.slug}`)}
              </ul>
            </div>
          </FormSection>

          <FormSection title="Club structure">
            <Radio
              label=""
              name="type"
              onChange={this.handleInputChange}
              options={clubTypes}
              styled
              value={club.type}
              wide
            />
            {academySelected && (
              <TextInput
                className="tooltips"
                placeholder="Soccer School company name"
                name="ssCompany"
                label="Soccer School company name"
                value={club.ss_company}
                onChange={this.handleInputChange}
                prepend={<i className="ion-social-buffer" />}
              />
            )}

            {academySelected && (
              <TextInput
                className="tooltips"
                placeholder="Company number"
                name="companyNumber"
                label="Company number"
                value={club.company_number}
                onChange={this.handleInputChange}
                prepend={<i className="ion-social-buffer" />}
              />
            )}

            {fcSelected && (
              <TextInput
                className="tooltips"
                placeholder="Football club name"
                name="fcCompany"
                label="Football club name"
                value={club.fc_company}
                onChange={this.handleInputChange}
                prepend={<i className="ion-social-buffer" />}
              />
            )}

            {fcSelected && (
              <TextInput
                className="tooltips"
                placeholder="FA Affiliation"
                name="faAffiliation"
                label="FA Affiliation"
                value={club.fa_affiliation}
                onChange={this.handleInputChange}
                prepend={<i className="ion-social-buffer" />}
              />
            )}
          </FormSection>

          <FormSection title="Club Contact Details">
            <TextInput
              className="tooltips"
              placeholder="Address 1"
              label="Address 1"
              name="address"
              validation="required"
              onChange={this.handleInputChange}
              value={club.address}
              prepend={<i className="ion-location" />}
            />
            <TextInput
              className="tooltips"
              placeholder="Address 2"
              label="Address 2"
              name="address2"
              onChange={this.handleInputChange}
              value={club.address2}
              prepend={<i className="ion-location" />}
            />

            <TextInput
              className="tooltips"
              placeholder="City/Town"
              label="City/Town"
              name="town"
              onChange={this.handleInputChange}
              value={club.town}
              prepend={<i className="ion-location" />}
            />
            <TextInput
              className="tooltips"
              placeholder="Postcode"
              label="Postcode"
              name="postcode"
              validation="required"
              onChange={this.handleInputChange}
              value={club.postcode}
              prepend={<i className="ion-location" />}
            />
            <TextInput
              className="tooltips"
              placeholder="Telephone"
              name="telephone"
              label="Telephone"
              validation="required"
              value={club.telephone}
              onChange={this.handleInputChange}
              prepend={<i className="ion-ios-telephone" />}
            />
            <TextInput
              className="tooltips"
              placeholder="Email"
              name="email"
              label="Email"
              validation="required"
              value={club.email}
              onChange={this.handleInputChange}
              prepend={<i className="ion-android-mail" />}
            />
          </FormSection>

          <FormSection title="INTERNET">
            <TextInput
              className="tooltips"
              placeholder="Website"
              name="website"
              label="Website"
              value={club.website}
              onChange={this.handleInputChange}
              prepend={<i className="ion-ios-world-outline" />}
            />
            <FileUpload
              className="tooltips"
              accept=".jpg,.jpeg,.png"
              clearable
              label="Club Badge / Logo"
              name="pic"
              onChange={this.handleInputChange}
              prepend={<i className="ion-android-upload" />}
              validation="file|max:1000"
            />
          </FormSection>

          <FormSection title="VAT">
            <Radio
              wide
              styled
              name="isRegistered"
              label="VAT registered"
              value={isRegistered}
              options={[{ id: 1, title: "Yes" }, { id: 0, title: "No" }]}
              onChange={this.handleInputChange}
            />
            {this.state.isRegistered != 1 && (
              <TextInput
                name="threshold"
                label="VAT Threshold"
                prepend="£"
                value={club.threshold}
                onChange={this.handleInputChange}
              />
            )}
            {this.state.isRegistered == 1 && (
              <TextInput
                className="tooltips"
                placeholder="VAT Number"
                name="vatNumber"
                label="VAT Number"
                value={club.vat_number}
                onChange={this.handleInputChange}
              />
            )}
            {this.state.isRegistered == 1 && (
              <TextInput
                className="tooltips"
                placeholder="VAT Rate"
                name="vatRate"
                label="VAT Rate"
                value={club.vat_rate}
                append="%"
                onChange={this.handleInputChange}
              />
            )}

            <div className="form-actions">
              <Back className="button">Back</Back>
              <FormButton label="Save" />
            </div>
          </FormSection>
        </Form>
      </div>
    );
  }
}
