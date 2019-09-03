import React from "react";
import {
  FileUpload,
  Dialog,
  Form,
  MultiSelect,
  Select,
  TextInput
} from "@xanda/react-components";
import { api, fn } from "app/utils";
import { url } from "app/constants";
import { Back, FormButton, PageDescription, PageTitle } from "app/components";
import { connect } from "react-redux";

@connect((store, ownProps) => {
  return {};
})
export default class Add extends React.PureComponent {
  constructor(props) {
    super(props);

    this.teamType = this.props.route.type;

    this.state = {
      ageGroupList: [],
      coachList: [],
      skillGroupList: [],
      teamSponsorList: [],
      teamSponsor: 0,
      teamRankList: [],
      teamGender: null,
      teamGenderList: [
        { id: "boy", title: "Boys" },
        { id: "girl", title: "Girls" },
        { id: "mixed", title: "Mixed" }
      ]
    };
  }

  componentWillMount = async () => {
    const ageGroupList = await api.get("/dropdown/age-groups");
    const coachList = await api.get("/dropdown/coaches");
    const skillGroupList = await api.get("/dropdown/teams/skill-group");
    const teamSponsorList = await api.get("/sponsors");
    const teamRankList = await api.get("/dropdown/team-ranks");
    const formattedSkillGroupList = skillGroupList.data.map(team => {
      return {
        ...team,
        title: `${team.agegroup_title} - ${team.title}`
      };
    });
    this.setState({
      teamSponsorList: teamSponsorList.data.entities,
      ageGroupList: ageGroupList.data,
      coachList: coachList.data,
      skillGroupList: formattedSkillGroupList,
      teamRankList: teamRankList.data
    });
  };

  handleInputChange = (name, value) => {
    this.setState({ [name]: value });
    console.log("sponsor", this.state);
  };

  handleSponsorSubmit = async () => {
    const formData = new FormData();
    formData.append("title", this.state.sponsorName);
    formData.append("url", this.state.sponsorURL);
    formData.append("logo_url", this.state.sponsorUpload);
    const response = await api.post("/sponsors", formData);

    console.log(response);
    if (!api.error(response)) {
      this.props.fetchData();
      this.refSponsorDialog && this.refSponsorDialog.close();
    }
  };

  handleSubmit = async () => {
    const formData = new FormData();

    // loop through skillGroups
    this.state.skillGroups &&
      this.state.skillGroups.map(skillGroup => {
        if (!skillGroup.new) {
          return false;
        }
        formData.append("skill_groups[]", skillGroup.id);
      });

    this.state.agegroup && formData.append("agegroup_id", this.state.agegroup);
    this.state.coach && formData.append("coach_id", this.state.coach);
    this.state.maxSize && formData.append("max_size", this.state.maxSize);
    this.state.title && formData.append("title", this.state.title);
    this.teamType && formData.append("type", this.teamType);
    this.state.teamSponsor &&
      formData.append("sponsor", this.state.teamSponsor);
    this.state.teamGender && formData.append("gender", this.state.teamGender);
    this.state.teamRank && formData.append("rank", this.state.teamRank);

    const response = await api.post("/teams", formData);

    if (!api.error(response)) {
      fn.navigate(url.team);
      this.props.dispatch({
        type: "OPEN_SNACKBAR_MESSAGE",
        option: {
          message: "Team has been created successfully!",
          color: "dark"
        }
      });
    } else {
      this.refForm && this.refForm.hideLoader();
    }
  };

  closeDialogBox = () => {
    this.refSponsorDialog.close();
  };

  render() {
    const {
      teamSponsorList,
      teamRankList,
      teamGenderList,
      ageGroupList,
      coachList,
      skillGroupList
    } = this.state;
    console.log(teamSponsorList);
    const addSponsorForm = (
      <Form onSubmit={this.handleSponsorSubmit}>
        <div className="form-inner">
          <TextInput
            label="Sponsor Name"
            name="sponsorName"
            onChange={this.handleInputChange}
            validation="required|min:3"
            wide
          />
          <TextInput
            label="Sponsor URL"
            name="sponsorURL"
            onChange={this.handleInputChange}
            validation="required|min:7"
            wide
          />
          <FileUpload
            label="Sponsor Logo"
            name="sponsorUpload"
            onChange={this.handleInputChange}
          />
          <div className="form-actions">
            <button className="button" onClick={() => this.closeDialogBox()}>
              Go Back
            </button>
            <button className="button hover-blue">Add Sponsor</button>
          </div>
        </div>
      </Form>
    );

    return (
      <div id="content" className="site-content-inner sponsor-container">
        <PageTitle
          value={`Create a ${fn.slugToReadableString(this.teamType)}`}
        />
        <PageDescription>
          Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget
          lacinia odio sem nec elit. Sed posuere consectetur est at lobortis.
          Curabitur blandit tempus porttitor. Donec id elit non mi porta gravida
          at eget metus.
        </PageDescription>
        <Form
          loader
          onSubmit={this.handleSubmit}
          className="form-section"
          ref={ref => (this.refForm = ref)}
        >
          <TextInput
            className="tooltips"
            placeholder="Title"
            label="Title"
            name="title"
            onChange={this.handleInputChange}
            validation="required"
            prepend={<i className="ion-ios-book-outline" />}
          />

          <Select
            className="tooltips"
            placeholder="Ability level"
            label="Ability Level"
            name="teamRank"
            onChange={this.handleInputChange}
            options={teamRankList}
            validation="required"
            prepend={<i className="ion-android-options" />}
          />

          <Select
            className="tooltips"
            placeholder="Age group"
            label="Age group"
            name="agegroup"
            onChange={this.handleInputChange}
            options={ageGroupList}
            validation="required"
            prepend={<i className="ion-ios-body" />}
          />

          <Select
            className="tooltips"
            placeholder="Coach"
            label="Coach"
            name="coach"
            onChange={this.handleInputChange}
            options={coachList}
            prepend={<i className="ion-person" />}
          />

          <Select
            className="tooltips"
            placeholder="Gender"
            label="Gender"
            name="teamGender"
            onChange={this.handleInputChange}
            options={teamGenderList}
            ref={ref => (this.refTeamGender = ref)}
            validation="required"
            prepend={<i className="ion-male" />}
          />

          <TextInput
            className="tooltips"
            placeholder="Max size"
            label="Max size"
            name="maxSize"
            onChange={this.handleInputChange}
            validation="required|integer|min:0"
            prepend={<i className="ion-podium" />}
          />

          {this.teamType === "team" && (
            <MultiSelect
              label={["All skill groups", "Connected to"]}
              name="skillGroups"
              onChange={this.handleInputChange}
              options={skillGroupList}
              wide
            />
          )}

          <Select
            className="tooltips"
            placeholder="Sponsor"
            label="Sponsor"
            name="teamSponsor"
            onChange={this.handleInputChange}
            options={teamSponsorList}
            valueKey="sponsor_id"
            prepend={<i className="ion-android-add-circle" />}
          />

          <div className="form-actions">
            <Back className="button" showCloseButton={false} confirm>
              Cancel
            </Back>
            <FormButton label="Save" />
          </div>
        </Form>

        <Dialog
          title=""
          content={
            <div className="dialog-body-inner direction-column">
              <h3>Add Sponsor</h3>
              {addSponsorForm}
            </div>
          }
          className="add_sponsor"
          ref={ref => (this.refSponsorDialog = ref)}
          showCloseButton={false}
        >
          <button className="button-standard add-sponsor-team">
            Add Sponsor
          </button>
        </Dialog>
      </div>
    );
  }
}
