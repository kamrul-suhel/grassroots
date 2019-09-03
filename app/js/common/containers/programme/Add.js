import React from 'react'
import {
    Accordion,
    DatePicker,
    FileUpload,
    Form,
    MultiSelect,
    Select,
    Table,
    TextInput,
    TimePicker,
    Dialog,
    Checkbox,
    Radio
} from '@xanda/react-components'
import {api, fn, validate} from 'app/utils'
import {url} from 'app/constants'
import {
    Back,
    ConfirmDialog,
    FormButton,
    FormInputRecurring,
    FormSection,
    MultipleInput,
    PageTitle
} from 'app/components'
import {fetchData} from 'app/actions';
import moment from 'moment'
import {connect} from "react-redux"
import {Add as AddCoach} from 'app/containers/coach'
import { AcademySetup } from 'app/containers/club'
import { FCSetup } from "app/containers/club"

@connect((store) => {
    return {};
})


export default class Add extends React.PureComponent {

    constructor(props) {
        super(props);

        this.programmeParentType = this.props.route.type
        this.dateId = 0

        this.state = {
            coachList: [],
            currentlyEditingDate: {},
            generatedDates: [],
            programmeTypes: [],
            recurring: {
                length: this.programmeParentType === 'event' ? 1 : null,
                occurrence: this.programmeParentType === 'event' ? 'day' : null,
            },

            surfaceTypes: [
                {id: '3G Indoor', title: '3G Indoor'},
                {id: '3G Outdoor', title: '3G Outdoor'},
                {id: 'Indoor', title: 'Indoor'},
                {id: 'Hard Floor Indoors', title: 'Hard Floor Indoors'},
                {id: 'Grass', title: 'Grass'}
            ],

            teamList: [],
            venue: '',
            venueList: [],
            addCoachDialog: false,
            addTeamDialog: false,
            consents: [],
            selectCoachDialog: false,
            createTeamOnHook: {},
            selectedTeam:[]
        }
    }

    componentWillMount = async () => {
        //Fetch coaches
        await this.fetchCoaches()

        // Fetch consent
        await this.fetchConsents()

        const programmeTypes = await api.get(`/dropdown/programme-types/${this.programmeParentType}`);
        const teamList = await api.get(`/dropdown/teams/${this.getTeamType()}`);
        const venueList = await api.get('/dropdown/venues');
        const formattedTeamList = teamList.data.map((team) => {
            return {
                ...team,
                title: `${team.agegroup_title} - ${team.title}`,
            };
        });

        // Add first option as create venue in venueList
        let newVenueList = []
        const createVenue = {id: 'create', title: 'Add Venue', note: 'add venue'}
        newVenueList.push(createVenue)
        newVenueList.push(...venueList.data)

        this.setState({
            ...this.state,
            programmeTypes: programmeTypes.data,
            teamList: formattedTeamList,
            venueList: newVenueList,
        })
    }

    fetchCoaches = async () => {
        const coachList = await api.get('/dropdown/coaches')
        let updatedCoachList = []
        updatedCoachList.push({id: 'addNewCoach', title: 'Add Choach'})
        updatedCoachList.push(...coachList.data)

        this.setState({
            ...this.state,
            coachList: updatedCoachList
        });
    }

    fetchConsents = async () => {
        const response = await api.get('dropdown/consents')
        this.setState({
            consents: [...response.data]
        })
    }

    getTeamType = () => {
        switch (this.programmeParentType) {
            case 'fc':
                return 'team'
            case 'academy':
                return 'skill-group'
            case 'event':
                return 'all'
        }
    }

    handleInputChange = (name, value) => {
        // if name selectedCoach && value is addNewCoach then show add new coach dialogbox
        if (name === 'selectedCoach') {
            if (value.id === 'addNewCoach') {
                this.setState({
                    addCoachDialog: true
                })
                return
            }
        }

        // Check if name = venue & selected value.id is create then open dialog box for create venue
        if (name === 'venue' && value && value.id === 'create') {
            this.refConfirmDialog.refDialog.open();
            this.setState({
                venue: undefined
            })
            return;
        }

        this.setState({[name]: value})
    }

    handleDateEdit = (name, value) => {
        this.setState((prevState) => {
            return {
                currentlyEditingDate: {
                    ...prevState.currentlyEditingDate,
                    [name]: value,
                },
            };
        });
    }

    handleSubmit = async () => {
        const {
            consent,
            notes,
            generatedDates,
            teams,
            title,
            typeId,
            programmeFile,
            venue,
            pitchNumber,
            pitchInfo,
            requireEquipment,
            paymentNotes,
            status,
            terms

        } = this.state
        let formData = new FormData()
        notes && formData.append('notes', notes)
        consent && formData.append('consent_id', consent)

        // Sessions
        generatedDates && _.map(generatedDates, (session, id) => {
            _.map(session, (value, key) => {
                if (_.isArray(value)) {
                    _.map(value, (arrayValue, arrayKey) => formData.append(`sessions[${id}][${key}][${arrayKey}]`, arrayValue));
                } else if (_.isObject(value)) {
                    _.map(value, (objectValue, objectKey) => formData.append(`sessions[${id}][${key}][${objectKey}]`, objectValue));
                } else {
                    formData.append(`sessions[${id}][${key}]`, value)
                }
            })
        })

        //Teams
        teams && _.map(teams, (team, id) => {
            _.map(team, (value, key) => {
                if (_.isArray(value)) {
                    _.map(value, (arrayValue, arrayKey) => formData.append(`teams[${id}][${key}][${arrayKey}]`, arrayValue));
                } else if (_.isObject(value)) {
                    _.map(value, (objectValue, objectKey) => formData.append(`teams[${id}][${key}][${objectKey}]`, objectValue));
                } else {
                    formData.append(`teams[${id}][${key}]`, value)
                }
            })
        })

        title && formData.append('title', title)

        pitchNumber && formData.append('pitch_number', pitchNumber)
        terms && formData.append('terms', terms)
        pitchInfo && formData.append('pitch_info', pitchInfo)
        requireEquipment && formData.append('require_equipment', requireEquipment)
        paymentNotes && formData.append('payment_note', paymentNotes)
        status && formData.append('status', status)

        typeId && formData.append('type_id', typeId)
        programmeFile && formData.append('programme_file', programmeFile)
        venue && formData.append('venue', venue)

        const response = await api.post('/programmes', formData)

        if (!api.error(response)) {
            // Check is it programme or event
            if (this.programmeParentType !== 'event') {
                fn.navigate(url.programme)
            } else {
                fn.navigate(url.event)
            }
        }
    }

    generateDates = async () => {
        const recurring = this.state.recurring || {};
        const dates = [];
        let nextDate = moment(this.state.date).format('YYYY-MM-DD');

        for (let i = 0; i < recurring.length; i++) {
            this.dateId++;
            dates.push({
                date_id: this.dateId,
                date: nextDate,
                prices: this.state.prices,
                price: this.state.prices && this.state.prices[1],
                price2: this.state.prices && this.state.prices[2],
                price2plus: this.state.prices && this.state.prices[3],
                start_time: moment(`${nextDate} ${this.state.startTime}`, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm:SS'),
                end_time: moment(`${nextDate} ${this.state.endTime}`, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm:SS'),
                surface: this.state.surface,
                venue: this.state.venue && this.state.venue.title,
                venue_id: this.state.venue && this.state.venue.id,
            });
            nextDate = moment(nextDate).add(recurring.offset, recurring.occurrence).format('YYYY-MM-DD');
        }

        const mergedDates = _.union(this.state.generatedDates, dates);
        const sortedDates = _.sortBy(_.uniqBy(mergedDates, 'date'), 'date');
        this.setState({generatedDates: sortedDates});
    }

    deleteDate = (id) => {
        const generatedDates = _.filter(this.state.generatedDates, v => v.date_id !== id);
        this.setState({generatedDates});
    }

    editDate = (id) => {
        this.setState({currentlyEditingDate: {id}});
    }

    saveDate = (id) => {
        const {
            currentlyEditingDate,
            generatedDates,
            consent
        } = this.state;
        const date = _.find(generatedDates, {date_id: id});

        const updatedDate = {
            date_id: date.date_id,
            date: currentlyEditingDate.date,
            prices: currentlyEditingDate.prices,
            price: currentlyEditingDate.prices && currentlyEditingDate.prices[1],
            price2: currentlyEditingDate.prices && currentlyEditingDate.prices[2],
            price2plus: currentlyEditingDate.prices && currentlyEditingDate.prices[3],
            start_time: moment(`${currentlyEditingDate.date} ${currentlyEditingDate.startTime}`, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm:SS'),
            end_time: moment(`${currentlyEditingDate.date} ${currentlyEditingDate.endTime}`, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm:SS'),
            surface: currentlyEditingDate.surface,
            venue: currentlyEditingDate.venue && currentlyEditingDate.venue.title,
            venue_id: currentlyEditingDate.venue && currentlyEditingDate.venue.id,
        };

        const newDates = _.sortBy(_.unionBy([updatedDate], generatedDates, 'date_id'), 'date');

        this.setState({
            currentlyEditingDate: {},
            generatedDates: newDates,
        });
    }

    // creates a dialog onAdd hook
    onAdd = async (option) => {
        const {
            coachList
        } = this.state

        const firstOption = _.head(option)
        const defaultCoach = firstOption.coach_id ? {id: firstOption.coach_id, title: firstOption.coach_name} : null
        this.setState({selectedCoach: null})

        return new Promise((resolve, reject) => {
            const confirm = () => {
                const {selectedCoach} = this.state
                this.setState({coachDialog: null})
                const coachTitle = selectedCoach && selectedCoach.title ? selectedCoach.title : 'Coach to be assigned'
                const coachId = selectedCoach && selectedCoach.id ? selectedCoach.id : 0;

                // merge the title and the date as a new title
                const optionValue = {
                    title: coachTitle,
                    //title: <span>{`${firstOption.title} (${coachTitle})`}</span>,
                    coach_id: coachId,
                };
                const newOption = _.merge({}, firstOption, optionValue);

                // resolve promise and return the updated option
                return resolve(newOption);
            };

            const cancel = () => {
                this.setState({coachDialog: null});
                return reject('cancel');
            };

            const resetValue = this.programmeParentType !== 'event' ? defaultCoach : {};

            const dialog = (
                <ConfirmDialog
                    className="dialog-coach-add"
                    title=""
                    onlyContent={true}
                    body={
                        <React.Fragment>
                            <h3>Select a coach</h3>
                            <Select wide
                                    name="selectedCoach"
                                    value={defaultCoach}
                                    options={coachList}
                                    resetValue={resetValue}
                                    returnFields="all"
                                    prepend={<i className="icon ion-person"></i>}
                                    skipInitialOnChangeCall
                                    onChange={this.handleInputChange}/>
                        </React.Fragment>
                    }
                    onClose={cancel}
                    onConfirm={confirm}
                />
            );

            this.setState({coachDialog: dialog});
        });
    }

    handleCloseAddCoach = async () => {
        await this.fetchCoaches()

        this.setState({
            addCoachDialog: false
        })
    }

    handleAddTeam = (e) =>{
        e.preventDefault();

        this.setState({
            addTeamDialog: true
        })
    }

    renderAddTeam = () => {
        // check which type of programme
        if(this.programmeParentType === 'fc'){
            // Football club
            return (
                <div>
                    <FCSetup subComponent={true}
                        onAddTeam={(data) => this.onAddTeamAndClose(data)}
                        closeAddTeamComponent={this.onCancelAddTeam}/>
                </div>
            )

        }else{
            // Football academy
            return (
                <div>
                    <AcademySetup subComponent={true}
                             onAddTeam={(data) => this.onAddTeamAndClose(data)}
                             closeAddTeamComponent={this.onCancelAddTeam}/>
                </div>
            )
        }
    }

    onAddTeamAndClose = (data) => {
        const {
            teams
        } = this.state


        const listGroup = {
            agegroup_id: data.agegroup_id && data.agegroup_id || null,
            agegroup_title: data.title && data.title || null,
            coach_id: null,
            coach_name: null,
            gender: data.gender && data.gender || null,
            id: data.team_id && data.team_id || null,
            max_age: data.max_size && data.max_size || null,
            max_size: data.max_size && data.max_size || null,
            team_type: data.type && data.type || null,
            title: data.title && data.title || null,
            total: 0
        }

        this.setState({
            createTeamOnHook: {...listGroup},
            addTeamDialog:false,
            selectCoachDialog: true
        })
    }

    onCancelAddTeam = () =>{
        this.setState({
            addTeamDialog: false
        })
    }

    renderSelectCoachFromTeamCreatedHook = () => {
        const {
            coachList
        } = this.state

        return (
            <div>
                <h3>Select a coach</h3>
                <Select wide
                        name="selectedCoach"
                        options={coachList}
                        returnFields="all"
                        prepend={<i className="icon ion-person"></i>}
                        skipInitialOnChangeCall
                        onChange={this.handleInputChange}/>

                <div className="dialog-footer">
                    <button className="button"
                            onClick={this.handleCancelTeam}>Cancel
                    </button>

                    <button className="button"
                            onClick={this.handleConfirmTeam}>Add Team
                    </button>
                </div>
            </div>
        )
    }

    handleCancelTeam = () =>{
        this.setState({
            selectCoachDialog: false
        })
    }

    handleConfirmTeam = () => {
        const {
            createTeamOnHook,
            selectedCoach,
            teams
        } = this.state

        let selectedTeams = [...teams]
        let newTeam = {...createTeamOnHook}
        newTeam.coach_id = selectedCoach.id
        newTeam.title = selectedCoach.title

        selectedTeams.push(newTeam)

        this.setState({
            teams:[...selectedTeams],
            selectCoachDialog:false,
            selectedTeam:[...selectedTeams]
        })
    }

    render() {
        const {
            currentlyEditingDate,
            generatedDates,
            programmeTypes,
            surfaceTypes,
            teamList,
            venueList,
            addCoachDialog,
            addTeamDialog,
            selectCoachDialog,
            consents,
            selectedTeam
        } = this.state

        const buttonLabel = this.state.recurring && this.state.recurring.length > 1 ? 'Generate sessions' : 'Generate session'
        const pageTitle = this.programmeParentType !== 'event' ? 'Create New Programme' : 'Create New Event'
        const saveButtonText = this.programmeParentType !== 'event' ? 'Save Programme' : 'Save Event'

        return (
            <div id="content" className="site-content-inner">
                <PageTitle value={pageTitle}/>

                {this.state.coachDialog}
                <Accordion
                    className="programme-accordion event-border"
                    closeable={false}
                    open
                    ref={ref => this.refProgrammeAccordion = ref}
                    title=""
                >
                    <Form onValidationError={fn.scrollToTop} wide onSubmit={this.generateDates}>
                        <FormSection title={this.programmeParentType !== 'event' ? 'Programme' : 'Event'}>
                            <TextInput
                                className="tooltips"
                                placeholder="Title"
                                label="Title"
                                name="title"
                                onChange={this.handleInputChange}
                                validation="required"
                                prepend={<i className="ion-ios-book-outline"/>}
                            />

                            <Select
                                className="tooltips"
                                placeholder="Type"
                                label="Type"
                                name="typeId"
                                onChange={this.handleInputChange}
                                options={programmeTypes}
                                validation="required"
                                prepend={<i className="ion-ios-bookmarks-outline"/>}
                            />

                            <FileUpload
                                className="tooltips"
                                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                                clearable
                                label="Upload file"
                                name="programmeFile"
                                onChange={this.handleInputChange}
                                placeholder="Upload file"
                                prepend={<i className="ion-android-upload"/>}
                                validation="file|max:10000"
                            />

                            <Select
                                className="tooltips"
                                placeholder="Consent"
                                label="Consent"
                                name="consent"
                                onChange={this.handleInputChange}
                                options={consents}
                                validation="required"
                                prepend={<i className="ion-compose"/>}
                            />

                            <TextInput
                                className="tooltips"
                                placeholder="Notes"
                                label="Notes"
                                name="notes"
                                onChange={this.handleInputChange}
                                textarea
                                wide
                            />

                            <span className="button"
                                    onClick={this.handleAddTeam}>
                                {this.programmeParentType === 'fc' ? 'add football club team' : ' adds soccer school team'}
                            </span>

                            <MultiSelect
                                label={['All teams / skill groups', 'Selected teams / skill groups']}
                                name="teams"
                                onAdd={this.onAdd}
                                onChange={this.handleInputChange}
                                options={teamList}
                                value={selectedTeam}
                                validation="required"
                                wide
                            />
                        </FormSection>

                        <FormSection title="Optional">
                            <TextInput
                                type="number"
                                className="tooltips"
                                placeholder="Pitch Number"
                                label="Pitch Number"
                                name="pitchNumber"
                                onChange={this.handleInputChange}
                                prepend={<i className="ion-map"/>}
                            />

                            <TextInput
                                className="tooltips"
                                placeholder="Pitch Info"
                                label="Pitch Info"
                                name="pitchInfo"
                                onChange={this.handleInputChange}
                                prepend={<i className="ion-ios-paper-outline"/>}
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
                                className="tooltips"
                                placeholder="Payment Notes"
                                label="Payment Notes"
                                name="paymentNotes"
                                onChange={this.handleInputChange}
                                textarea
                                wide
                            />

                            <TextInput
                                className="tooltips"
                                placeholder="Terms & conditions"
                                label="Terms & conditions"
                                name="terms"
                                onChange={this.handleInputChange}
                                textarea
                                wide
                            />

                            <Radio
                                className="programme-status"
                                styled
                                validation="required"
                                name="status"
                                label="Is visible to parent"
                                options={[
                                    {
                                        id: '1',
                                        title: 'Yes'
                                    },
                                    {
                                        id: '0',
                                        title: 'No'
                                    }
                                ]}
                                onChange={this.handleInputChange}
                            />
                        </FormSection>

                        <FormSection title="Event">
                            <Select
                                className="tooltips"
                                placeholder="Venue"
                                label="Venue"
                                name="venue"
                                onChange={this.handleInputChange}
                                options={venueList}
                                returnFields="all"
                                creatable
                                validation="required"
                                prepend={<i className="ion-location"/>}
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

                            <DatePicker
                                futureOnly
                                className="tooltips"
                                placeholder="Date"
                                label="Date"
                                name="date"
                                onChange={this.handleInputChange}
                                validation="required"
                                prepend={<i className="ion-calendar"/>}
                            />

                            <FormInputRecurring addClass="tooltips"
                                                name="recurring"
                                                label="Recurring"
                                                onChange={this.handleInputChange}/>

                            <div className="programme-time">
                                <TimePicker
                                    className="tooltips"
                                    placeholder="Start time"
                                    label="Start time"
                                    name="startTime"
                                    onChange={this.handleInputChange}
                                    validation="required"
                                    prepend={<i className="ion-clock"/>}
                                />
                                <TimePicker
                                    className="tooltips"
                                    placeholder="End time"
                                    label="End time"
                                    name="endTime"
                                    onChange={this.handleInputChange}
                                    validation="required"
                                    prepend={<i className="ion-clock"/>}
                                />
                            </div>

                            <MultipleInput
                                tooltips="tooltips"
                                count={3}
                                label="Price per session"
                                name="prices"
                                onChange={this.handleInputChange}
                                placeholder={['1st child', '2nd child', '3+ child']}
                                prepend="£"
                            />

                            <div className="form-actions">
                                <Back className="button" confirm>Cancel</Back>
                                <FormButton label={buttonLabel}/>
                                <ConfirmDialog
                                    ref={ref => this.refConfirmDialog = ref}
                                    onConfirm={() => fn.navigate(`${url.contact}/add`)}
                                    title=""
                                    body={
                                        <React.Fragment>
                                            <h3>Confirm</h3>
                                            <p>This will lose your progress, continue?</p>
                                        </React.Fragment>
                                    }
                                >
                                    <span className="button hidden">Add venue</span>
                                </ConfirmDialog>
                            </div>
                        </FormSection>
                    </Form>
                </Accordion>

                {generatedDates.length > 0 && <PageTitle value="Sessions" subTitle/>}

                {generatedDates.length > 0 &&
                <Table
                    headers={['', 'Venue', 'Surface', 'Start time', 'End time', 'Price', 'Options']}
                    actions={<span className="button" onClick={this.handleSubmit}>{saveButtonText}</span>}
                >
                    {generatedDates && generatedDates.map((item) => {
                        if (currentlyEditingDate && currentlyEditingDate.id === item.date_id) {
                            const eventDate = fn.formatDate(item.date, 'YYYY-MM-DD HH:mm:SS')
                            const venue = {id: item.venue_id, title: item.venue}
                            return (
                                <tr key={`date${item.date_id}`}>
                                    <td>
                                        <DatePicker name="date"
                                                    value={eventDate}
                                                    futureOnly
                                                    returnFormat="YYYY-MM-DD"
                                                    onChange={this.handleDateEdit}/>
                                    </td>

                                    <td>
                                        <Select name="venue"
                                                value={venue}
                                                options={venueList}
                                                returnFields="all"
                                                creatable
                                                onChange={this.handleDateEdit}/>
                                    </td>

                                    <td>
                                        <Select multiple
                                                name="surface"
                                                value={item.surface}
                                                options={surfaceTypes}
                                                onChange={this.handleDateEdit}/>
                                    </td>

                                    <td>
                                        <TimePicker name="startTime"
                                                    value={fn.formatDate(item.start_time, 'HH:mm')}
                                                    onChange={this.handleDateEdit}/>
                                    </td>

                                    <td>
                                        <TimePicker name="endTime"
                                                    value={fn.formatDate(item.end_time, 'HH:mm')}
                                                    onChange={this.handleDateEdit}/>
                                    </td>

                                    <td>
                                        <MultipleInput tooltip={"tooltips"}
                                                       name="prices"
                                                       count={3}
                                                       placeholder={['1st child', '2nd child', '3+ child']}
                                                       values={item.prices}
                                                       onChange={this.handleDateEdit}/>
                                    </td>

                                    <td>
                                        <span className="button"
                                              onClick={() => this.saveDate(item.date_id)}>Save
                                        </span>
                                    </td>
                                </tr>
                            );
                        }

                        return (
                            <tr key={`date${item.date_id}`}>
                                <td>{fn.formatDate(item.date)}</td>
                                <td>{item.venue}</td>
                                <td>{item.surface && item.surface.join(', ')}</td>
                                <td>{fn.formatDate(item.start_time, 'HH:mm')}</td>
                                <td>{fn.formatDate(item.end_time, 'HH:mm')}</td>
                                <td>£{item.price}</td>
                                <td>
                                    <span className="button"
                                          onClick={() => this.editDate(item.date_id)}>Edit
                                    </span>

                                    <ConfirmDialog
                                        key="delete"
                                        onConfirm={() => this.deleteDate(item.date_id)}
                                        title=""
                                        body={
                                            <h3>Are you sure you want to delete?</h3>
                                        }
                                    >
                                        <span className="button">Delete</span>
                                    </ConfirmDialog>
                                </td>
                            </tr>
                        )
                    })}
                </Table>
                }

                {addCoachDialog && <Dialog
                    className="programme-add-new-coach"
                    content={<AddCoach subComponent={true}
                                       onCloseDialog={this.handleCloseAddCoach}
                                       {...this.props}/>}/>}

                {addTeamDialog && <Dialog
                    showCloseButton={false}
                    className="add-team-dialog"
                    content={this.renderAddTeam()}
                >
                </Dialog>}

                {selectCoachDialog && <Dialog
                    showCloseButton={false}
                    className="select-coach-dialog"
                    content={this.renderSelectCoachFromTeamCreatedHook()}
                >
                </Dialog>}
            </div>
        )
    }

}
