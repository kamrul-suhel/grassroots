import React from 'react'
import {
    DatePicker,
    FileUpload,
    Form,
    Radio,
    Select,
    TextInput,
    TimePicker,
    Dialog
} from '@xanda/react-components'
import {api, fn} from 'app/utils'
import {url} from 'app/constants'
import {
    Back,
    FormButton,
    FormSection,
    MultipleInput,
    PageTitle,
    ConfirmDialog
} from 'app/components'
import moment from 'moment'
import {connect} from "react-redux"

// Import contact add component
import {Add as Contact} from 'app/containers/contact'

@connect((store, ownProps) => {
    return {};
})

export default class Add extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            coachList: [],
            matchLocationOptions: [
                {id: 'home', title: 'Home'},
                {id: 'away', title: 'Away'},
                {id: 'neutral', title: 'Neutral'},
            ],
            matchTypes: [],
            surfaceTypes: [
                {id: '3G-indoors', title: '3G Indoors'},
                {id: 'indoor', title: 'Indoor'},
                {id: 'grass', title: 'Grass'},
                {id: '3G-outdoors', title: '3G outdoors'},
                {id: 'hard-floor-indoors', title: 'Hard Floor Indoors'}
            ],
            teamList: [],
            venueList: [],
            errorProgramme: false,
            errorString: '',
            addVenueDialog: false
        }
    }

    componentWillMount = async () => {
        const coachList = await api.get('/dropdown/coaches');
        const matchTypes = await api.get('/dropdown/match-types');
        const teamList = await api.get('/dropdown/teams/team');
        const formattedTeamList = teamList.data.map((team) => {
            return {
                ...team,
                title: `${team.agegroup_title} - ${team.title}`,
            };
        });

        this.setState({
            coachList: coachList.data,
            matchTypes: matchTypes.data,
            teamList: formattedTeamList
        })

        this.fetchVenue()
    }

    fetchVenue = async () => {
        const venueList = await api.get('/dropdown/venues')
        this.setState({
            venueList: venueList.data
        })
    }

    handleInputChange = (name, value) => {
        this.setState({[name]: value})
    }

    handleSubmit = async () => {

        const {state} = this

        let formData = new FormData()
        formData.append('sessions[0][match_location]', state.matchLocation)
        formData.append('sessions[0][kickoff_time]', moment(`${state.date} ${state.kickOffTime}`, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm:SS'))
        formData.append('sessions[0][match_type]', state.matchType)
        formData.append('sessions[0][notes]', state.notes)
        formData.append('sessions[0][opposition]', state.opposition)
        formData.append('sessions[0][price]', state.prices[1])
        formData.append('sessions[0][price2]', state.prices[2])
        formData.append('sessions[0][price2plus]', state.prices[3])
        formData.append('sessions[0][pitch_number]', state.pitch_no)
        formData.append('sessions[0][pitch_info]', state.pitch_info)
        formData.append('sessions[0][referee]', state.referee)
        formData.append('sessions[0][referee_contact_number]', state.referee_contact_number)
        formData.append('sessions[0][venue_id]', state.venue)
        formData.append('sessions[0][start_time]', moment(`${state.date} ${state.meetTime}`, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm:SS'))
        formData.append('sessions[0][end_time]', moment(`${state.date} ${state.endTime}`, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm:SS'))

        // Surface
        _.map(state.surface, (value, key) => {
            formData.append('sessions[0][surface][' + key + ']', value)
        })

        // Make price as array
        _.map(state.prices, (value, key) => {
            formData.append('sessions[0][prices][' + key + ']', value)
        })

        this.refForm && this.refForm.hideLoader()

        const team = state.team || {}
        // Append team into from
        formData.append('teams[0][coach_id]', state.coach)
        formData.append('teams[0][id]', team.id)

        const title = `${team.title} vs ${state.opposition}`
        formData.append('title', title)
        state.fixtureFile && formData.append('fixture_file', state.fixtureFile)

        if (this.state.errorProgramme) {
            this.confirmFixtureDialog.close();
            formData.append('check_fixture', 'true')
        } else {
            formData.append('check_fixture', 'false')
        }

        // Additional info
        state.pitchNumber && formData.append('pitch_number', state.pitchNumber)
        state.pitchInfo && formData.append('pitch_info', state.pitchInfo)
        state.requireEquipment && formData.append('require_equipment', state.requireEquipment)
        state.paymentNotes && formData.append('payment_note', state.paymentNotes)
        state.opposition_contact_number && formData.append('opposition_contact_number', state.opposition_contact_number)
        state.referee_contact_number && formData.append('referee_contact_number', state.referee_contact_number)

        const response = await api.post('/fixtures', formData)

        if (!api.error(response, false)) {
            fn.navigate(url.fixture)
        } else {
            if (response.data.exists && response.data.exists === 'true') {
                this.setState({
                    errorProgramme: true
                })
                return;
            }

            const errorString = api.getErrorsHtml(response.data)
            this.setState({
                errorString: errorString
            })

            this.refForm && this.refForm.hideLoader()
        }
    }

    renderAddVenue = () => {
        return (
            <div>
                <Contact subComponent={true}
                         cancelVenue={this.handleCloseVenueDialog}
                         onAddVenue={(venue) => this.handleAddNewVenue(venue)}/>
            </div>
        )
    }

    handleCloseVenueDialog = () => {
        this.setState({
            addVenueDialog: false
        })
    }

    handleAddNewVenue = (newVenue) => {
        this.fetchVenue()

        this.setState({
            addVenueDialog: false
        })
    }

    render() {
        const {
            coachList,
            matchLocationOptions,
            matchTypes,
            surfaceTypes,
            teamList,
            teamType,
            venueList,
            errorProgramme,
            errorString,
            addVenueDialog
        } = this.state;

        return (
            <div id="content" className="site-content-inner">
                <PageTitle value="Create new fixture"/>
                <Form onValidationError={fn.scrollToTop} loader wide onSubmit={this.handleSubmit} ref={ref => this.refForm = ref}>
                    <FormSection title="Fixture">
                        <Select
                            className="tooltips"
                            placeholder="Fixture Type"
                            label="Fixture Type"
                            name="matchType"
                            onChange={this.handleInputChange}
                            options={matchTypes}
                            validation="required"
                            prepend={<i className="ion-trophy"/>}
                        />

                        <Select
                            className="tooltips transparent"
                            placeholder="Venue"
                            label="Venue"
                            name="venue"
                            onChange={this.handleInputChange}
                            options={venueList}
                            validation="required"
                            prepend={<i className="ion-location"/>}
                            append={
                                <span className="button"
                                      onClick={
                                          () => this.setState({addVenueDialog: true})
                                      }>Add venue
                                </span>
                            }
                        />

                        <FileUpload
                            accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
                            clearable
                            name="fixtureFile"
                            onChange={this.handleInputChange}
                            placeholder="Upload File"
                            prepend={<i className="ion-android-upload"/>}
                            validation="file|max:10000"
                        />

                        <Select
                            className="tooltips"
                            placeholder="Surface"
                            label="Surface"
                            multiple
                            name="surface"
                            onChange={this.handleInputChange}
                            options={surfaceTypes}
                            prepend={<i className="ion-ios-football"/>}
                        />

                        <TextInput
                            type="number"
                            className="tooltips"
                            placeholder="Pitch Number"
                            label="Pitch Number"
                            name="pitch_no"
                            onChange={this.handleInputChange}
                            prepend={<i className="ion-ios-grid-view-outline"/>}
                        />

                        <TextInput
                            className="tooltips"
                            placeholder="Pitch Info"
                            label="Pitch Info"
                            name="pitch_info"
                            onChange={this.handleInputChange}
                            prepend={<i className="ion-ios-grid-view-outline"/>}
                        />

                        <MultipleInput
                            tooltips="tooltips"
                            count={3}
                            label="Fees"
                            name="prices"
                            onChange={this.handleInputChange}
                            placeholder={['1st child', '2nd child', '3+ child']}
                            prepend="£"
                        />

                        <div style={{width: '100%'}}></div>

                        <Radio
                            className="w-100"
                            label="Match Location"
                            name="matchLocation"
                            onChange={this.handleInputChange}
                            options={matchLocationOptions}
                            styled
                            validation="required"
                            value="home"
                        />
                    </FormSection>

                    <FormSection title="Teams">
                        <Select
                            className="tooltips"
                            placeholder="Team"
                            label="Team"
                            name="team"
                            onChange={this.handleInputChange}
                            options={teamList}
                            returnFields="all"
                            validation="required"
                            prepend={<i className="ion-person-stalker"/>}
                        />

                        <Select
                            className="tooltips"
                            placeholder="Coach"
                            label="Coach"
                            name="coach"
                            onChange={this.handleInputChange}
                            options={coachList}
                            validation="required"
                            prepend={<i className="ion-person"/>}

                        />

                        <DatePicker
                            futureOnly
                            className="tooltips"
                            placeholder="Date"
                            label="Date"
                            name="date"
                            onChange={this.handleInputChange}
                            returnFormat="YYYY-MM-DD"
                            validation="required"
                            prepend={<i className="ion-calendar"/>}
                        />
                    </FormSection>

                    <FormSection title="Opposition">
                        <TextInput
                            className="tooltips"
                            placeholder="Opposition"
                            label="Opposition"
                            name="opposition"
                            onChange={this.handleInputChange}
                            validation="required"
                            prepend={<i className="ion-person-stalker"/>}
                        />

                        <TextInput
                            className="tooltips"
                            placeholder="Opposition Contact Number"
                            label="Opposition Contact Number"
                            name="opposition_contact_number"
                            onChange={this.handleInputChange}
                            validation="required"
                            prepend={<i className="ion-person-stalker"/>}
                        />
                    </FormSection>

                    <FormSection title="Referee Info">
                        <TextInput
                            className="tooltips"
                            placeholder="Referee"
                            label="Referee"
                            name="referee"
                            onChange={this.handleInputChange}
                            prepend={<i className="ion-person"/>}
                        />

                        <TextInput
                            className="tooltips"
                            placeholder="Referee Contact Number"
                            label="Referee Contact Number"
                            name="referee_contact_number"
                            onChange={this.handleInputChange}
                            prepend={<i className="ion-person"/>}
                        />
                    </FormSection>

                    <FormSection title="Time">
                        <div className="fixture-time">
                            <TimePicker
                                className="tooltips"
                                placeholder="Meet Time"
                                label="Meet Time"
                                name="meetTime"
                                onChange={this.handleInputChange}
                                validation="required"
                                prepend={<i className="ion-clock"/>}
                            />

                            <TimePicker
                                className="tooltips"
                                placeholder="Kick-off Time"
                                label="Kick-off Time"
                                name="kickOffTime"
                                onChange={this.handleInputChange}
                                prepend={<i className="ion-clock"/>}
                            />

                            <TimePicker
                                className="tooltips"
                                placeholder="End Time"
                                label="End Time"
                                name="endTime"
                                onChange={this.handleInputChange}
                                validation="required"
                                prepend={<i className="ion-clock"/>}
                            />
                        </div>
                    </FormSection>

                    <FormSection title="Optional"
                                 className="">
                        <div className="w-100 programme-time flex-direction-column">
                            <TextInput
                                placeholder="Notes (e.g. free parking available, no smoking allowed etc.)"
                                label="Notes"
                                name="notes"
                                onChange={this.handleInputChange}
                                textarea
                                wide
                            />

                            <TextInput
                                className="tooltips"
                                placeholder="What to bring/wear"
                                label="What to bring/wear"
                                name="requireEquipment"
                                onChange={this.handleInputChange}
                                textarea
                                wide
                            />

                            <TextInput
                                placeholder=""
                                label="Payment Notes"
                                name="payment_note"
                                onChange={this.handleInputChange}
                                textarea
                                wide
                            />
                        </div>

                        {
                            errorString ? errorString : null
                        }

                        <div className="form-actions">
                            <Back showCloseButton={false} className="button" confirm>Cancel</Back>
                            <FormButton label="Save"/>
                        </div>

                    </FormSection>

                </Form>

                {errorProgramme ?
                    <ConfirmDialog
                        showCloseButton={false}
                        ref={ref => this.confirmFixtureDialog = ref}
                        onConfirm={() => fn.navigate(`${url.contact}/add`)}
                        title="Conflicting with other programme"
                        body={<p>This will conflict with you existing programme.<br/> are you sure you want to do this ?
                        </p>}
                        actions={[
                            <button className="button"
                                    onClick={() => {
                                        this.confirmFixtureDialog.close();
                                        this.setState({errorProgramme: false})
                                    }}>Cancel
                            </button>,
                            <button className="button" onClick={this.handleSubmit}>Confirm</button>
                        ]}
                    >
                    </ConfirmDialog>
                    : ''}

                {addVenueDialog &&
                <Dialog
                    className="add-venue-dialog"
                    showCloseButton={false}
                    content={this.renderAddVenue()}
                >
                </Dialog>}

            </div>
        );
    }

}
