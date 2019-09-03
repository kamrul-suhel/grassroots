import React from "react"
import { connect } from "react-redux"
import {
  FileUpload,
  Form,
  MultiSelect,
  Select,
  TextInput,
  Dialog
} from "@xanda/react-components"
import { api, fn } from "app/utils"
import { url } from "app/constants"
import { fetchData } from "app/actions"
import {
  Back,
  FormButton,
  PageDescription,
  PageTitle,
  HeaderLogo
} from "app/components"
import FormSection from "../../components/FormSection"

@connect((store, ownProps) => {
  return {
    team: store.team.collection[ownProps.params.teamId] || {}
  }
})
export default class Edit extends React.PureComponent {
  constructor(props) {
    super(props)

    this.teamId = this.props.params.teamId

    this.state = {
      ageGroupList: [],
      coachList: [],
      skillGroupList: [],
      teamRankList: [],
      sponsorList: [],
      sponsorDialog: false,
      createdSponsor: {}
    }
  }

  componentWillMount = async () => {
    const { team, subComponent } = this.props

    if (!subComponent) {
      this.props.dispatch(
        fetchData({
          type: "TEAM",
          url: `/teams/${this.props.params.teamId}`
        })
      )
    }
    // Check if team already exists, if not then fetch
    const ageGroupList = await api.get("/dropdown/age-groups")
    const coachList = await api.get("/dropdown/coaches")
    const teamRankList = await api.get("/dropdown/team-ranks")
    const skillGroupList = await api.get("/dropdown/teams/skill-group")

    await this.fetchSponsor()

    const formattedSkillGroupList = skillGroupList.data.map(team => {
      return {
        ...team,
        title: `${team.agegroup_title} - ${team.title}`
      }
    })
    this.setState({
      ageGroupList: ageGroupList.data,
      coachList: coachList.data,
      skillGroupList: formattedSkillGroupList,
      teamRankList: teamRankList.data
    })
  }

  fetchSponsor = async () => {
    const teamSponsorList = await api.get("/sponsors")
    const newSponsor = { sponsor_id: "add_sponsor", title: "Add new sponsor" }
    let updateTeamSponsorList = [newSponsor]
    updateTeamSponsorList.push(...teamSponsorList.data.entities)

    this.setState({
      sponsorList: updateTeamSponsorList
    })
  }

  handleInputChange = (name, value) => {
    if (name === "sponsor" && value === "add_sponsor") {
      this.setState({
        sponsorDialog: true
      })
      return
    }
    this.setState({ [name]: value })
  }

  handleSubmit = async () => {
    const {
      agegroup,
      coach,
      maxSize,
      logo_url,
      title,
      gender,
      createdSponsor,
      sponsor,
      teamRank
    } = this.state
    const { team } = this.props
    const formData = new FormData()

    // loop through skillGroups
    this.state.skillGroups &&
      this.state.skillGroups.map(skillGroup => {
        if (!skillGroup.new) {
          return false
        }
        formData.append("skill_groups[]", skillGroup.id)
      })

    agegroup && formData.append("agegroup_id", agegroup)
    coach && formData.append("coach_id", coach)
    maxSize && formData.append("max_size", maxSize)
    logo_url && formData.append("team_logo", logo_url)
    teamRank && formData.append("rank", teamRank)
    title && formData.append("title", title)
    gender && formData.append("gender", gender)
    sponsor && formData.append("sponsor", sponsor)

    const response = await api.update(`/teams/${team.team_id}`, formData)

    console.log(response)
    if (!api.error(response)) {
      fn.navigate(url.team)
    } else {
      this.refForm && this.refForm.hideLoader()
    }
  }

  handleSponsorSubmit = async () => {
    const { sponsorName, sponsorURL, sponsorUpload } = this.state
    const formData = new FormData()
    sponsorName && formData.append("title", this.state.sponsorName)
    sponsorURL && formData.append("url", this.state.sponsorURL)
    sponsorUpload && formData.append("logo_url", this.state.sponsorUpload)
    const response = await api.post("/sponsors", formData)

    if (!api.error(response)) {
      const sponsorId = response.data.sponsor_id
      const createdSponsor = sponsorId
      this.fetchSponsor()
      this.setState({
        sponsorDialog: false,
        createdSponsor,
        sponsor: sponsorId
      })
    }
  }

  handleSponsorCloseDialog = () => {
    this.setState({
      sponsorDialog: false
    })
  }

  render() {
    const {
      ageGroupList,
      coachList,
      skillGroupList,
      teamRankList,
      sponsorList,
      sponsorDialog,
      createdSponsor
    } = this.state
    const { team, subComponent } = this.props

    const gendersList = [
      { id: "boy", title: "Boys" },
      { id: "girl", title: "Girls" },
      { id: "mixed", title: "Mixed" }
    ]

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
            <button
              className="button"
              onClick={() => this.handleSponsorCloseDialog()}
            >
              Go Back
            </button>
            <button className="button hover-blue">Add Sponsor</button>
          </div>
        </div>
      </Form>
    )
    return (
      <div id="content" className="site-content-inner">
        {!subComponent ? <PageTitle value="Edit team" /> : null}
        {!subComponent ? (
          <PageDescription>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula,
            eget lacinia odio sem nec elit. Sed posuere consectetur est at
            lobortis. Curabitur blandit tempus porttitor. Donec id elit non mi
            porta gravida at eget metus.
          </PageDescription>
        ) : null}
        <Form
          loader
          wide
          onSubmit={this.handleSubmit}
          ref={ref => (this.refForm = ref)}
        >
          <FormSection>
            <TextInput
              className="tooltips"
              placeholder="Title"
              label="Title"
              name="title"
              onChange={this.handleInputChange}
              validation="required"
              value={team.title}
              prepend={<i className="ion-ios-paper-outline" />}
            />
            <Select
              className="tooltips"
              placeholder="Age group"
              label="Age group"
              name="agegroup"
              onChange={this.handleInputChange}
              options={ageGroupList}
              validation="required"
              value={team.agegroup_id}
              prepend={<i className="ion-ios-body" />}
            />
            <Select
              className="tooltips"
              placeholder="Coach"
              label="Coach"
              name="coach"
              onChange={this.handleInputChange}
              options={coachList}
              value={team.coach_id}
              prepend={<i className="ion-person" />}
            />
            <TextInput
              className="tooltips"
              placeholder="Max size"
              label="Max size"
              name="maxSize"
              onChange={this.handleInputChange}
              validation="required"
              value={team.max_size}
              prepend={<i className="ion-tshirt" />}
            />
            <Select
              className="tooltips"
              label="Ability Level"
              name="teamRank"
              onChange={this.handleInputChange}
              options={teamRankList}
              ref={ref => (this.refTeamRank = ref)}
              validation="required"
              value={team.rank}
              prepend={<i className="ion-stats-bars" />}
            />

            <Select
              className="tooltips"
              label="Gender"
              name="gender"
              onChange={this.handleInputChange}
              options={gendersList}
              ref={ref => (this.refTeamRank = ref)}
              validation="required"
              placeholder="Select Gender"
              value={team.gender}
              prepend={<i className="ion-person" />}
            />

            <FileUpload
              name="logo_url"
              placeholder="Team logo"
              prepend={<i className="icon ion-android-upload" />}
              onChange={this.handleInputChange}
            />

            {team.type === "team" && (
              <Select
                className="tooltips"
                placeholder="Sponsor..."
                label="Sponsor"
                name="sponsor"
                onChange={this.handleInputChange}
                options={sponsorList}
                ref={ref => (this.refTeamSponsor = ref)}
                valueKey="sponsor_id"
                value={createdSponsor}
              />
            )}

            {team.type === "team" && (
              <MultiSelect
                className="tooltips"
                placeholder="Skill groups"
                clearable={false}
                label={["All skill groups", "Connected to"]}
                name="skillGroups"
                onChange={this.handleInputChange}
                options={skillGroupList}
                wide
              />
            )}

            <div className="form-actions">
              <Back className="button" confirm>
                Cancel
              </Back>
              <FormButton label="Save" />
            </div>
          </FormSection>
        </Form>

        {sponsorDialog && (
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
          />
        )}
      </div>
    )
  }
}
