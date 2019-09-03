import React from "react";
import { connect } from "react-redux";
import {
  DatePicker,
  Form,
  Select,
  TextInput,
  TimePicker
} from "@xanda/react-components";
import { api, fn } from "app/utils";
import { url } from "app/constants";
import { fetchData } from "app/actions";
import { Back, FormButton, FormSection, PageTitle } from "app/components";

@connect((store, ownProps) => {
  return {
    fixture: store.fixture.collection[ownProps.params.fixtureId] || {}
  };
})
export default class Edit extends React.PureComponent {
  constructor(props) {
    super(props);

    this.fixtureId = this.props.params.fixtureId;

    this.state = {
      coachList: [],
      matchTypes: [],
      teamList: [],
      venueList: []
    };
  }

  componentWillMount = async () => {
    this.props.dispatch(
      fetchData({
        type: "FIXTURE",
        url: `/fixtures/${this.fixtureId}`
      })
    );

    const coachList = await api.get("/dropdown/coaches");
    const matchTypes = await api.get("/dropdown/match-types");
    const teamList = await api.get("/dropdown/teams/team");
    const venueList = await api.get("/dropdown/venues");
    this.setState({
      coachList: coachList.data,
      matchTypes: matchTypes.data,
      teamList: teamList.data,
      venueList: venueList.data
    });
  };

  handleInputChange = (name, value) => {
    this.setState({ [name]: value });
  };

  handleSubmit = async () => {
    const formData = {
      coach: this.state.coach,
      kickoff_time: this.state.kickoff_time,
      match_type: this.state.match_type,
      notes: this.state.notes,
      oposition: this.state.oposition,
      // price: this.state.price,
      referee: this.state.referee,
      sessions: this.state.sessions,
      start_time: this.state.start_time,
      // teams: this.state.teams,
      title: this.state.title,
      venue_id: this.state.venue_id
    };

    // TODO: add update call
    const response = await api.update(
      `/fixtures/${this.fixtureId}`,
      this.state
    );

    if (!api.error(response)) {
      fn.navigate(url.fixture);
      fn.showAlert("Fixture has been updated successfully!", "success");
    } else {
      this.refForm && this.refForm.hideLoader();
    }
  };

  render() {
    const { coachList, matchTypes, teamList, venueList } = this.state;
    const { fixture } = this.props;

    return (
      <div id="content" className="site-content-inner">
        <PageTitle value="Edit fixture" />
        <Form
          loader
          wide
          onValidationError={fn.scrollToTop}
          onSubmit={this.handleSubmit}
          ref={ref => (this.refForm = ref)}
        >
          <FormSection title="Fixture">
            <Select
              label="Match type"
              name="matchType"
              onChange={this.handleInputChange}
              options={matchTypes}
              value={fixture.match_type}
              validation="required"
            />
            <Select
              label="Venue"
              name="venue"
              onChange={this.handleInputChange}
              options={venueList}
              validation="required"
              value={fixture.venue_id}
            />
            <TextInput
              label="Price / Subsidy"
              name="price"
              onChange={this.handleInputChange}
              prepend="£"
              validation="required"
              value={fixture.price}
            />
          </FormSection>
          <FormSection title="Teams">
            <Select
              label="Team"
              name="team"
              onChange={this.handleInputChange}
              options={teamList}
              validation="required"
              value={fixture.team_id}
            />
            <TextInput
              label="Oposition"
              name="oposition"
              onChange={this.handleInputChange}
              validation="required"
              value={fixture.oposition}
            />
            <Select
              label="Coach"
              name="coach"
              onChange={this.handleInputChange}
              options={coachList}
              validation="required"
              value={fixture.coach_id}
            />
            <TextInput
              label="Referee"
              name="referee"
              onChange={this.handleInputChange}
              value={fixture.referee}
            />
          </FormSection>
          <DatePicker
            futureOnly
            label="Date"
            name="date"
            onChange={this.handleInputChange}
            returnFormat="YYYY-MM-DD"
            validation="required"
            value={fixture.start_time}
          />
          <TimePicker
            label="Meet time"
            name="meetTime"
            onChange={this.handleInputChange}
            validation="required"
            value={fn.formatDate(fixture.start_time, "HH:mm")}
          />
          <TimePicker
            label="Kick-off time"
            name="kickOffTime"
            onChange={this.handleInputChange}
            value={fn.formatDate(fixture.kickoff_time, "HH:mm")}
          />
          <TextInput
            label="Notes"
            name="notes"
            onChange={this.handleInputChange}
            textarea
            value={fixture.notes}
            wide
          />

          <div className="form-actions">
            <Back className="button">Cancel</Back>
            <FormButton label="Save" />
          </div>
        </Form>
      </div>
    );
  }
}
