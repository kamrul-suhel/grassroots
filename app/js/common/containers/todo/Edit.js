import React from 'react'
import {connect} from 'react-redux'
import moment from 'moment'
import {
    Checkbox,
    DatePicker,
    Form,
    Radio,
    Select,
    TextInput,
    Dialog, TimePicker
} from '@xanda/react-components'
import {api, fn} from 'app/utils'
import {url} from 'app/constants'
import {fetchData} from 'app/actions'
import {
    Back,
    FormButton,
    PageTitle
} from 'app/components'
import {Add as Contact} from 'app/containers/contact'

@connect((store, ownProps) => {
    return {
        todo: store.todo.collection[ownProps.params.todoId] || {},
    };
})
export default class Edit extends React.PureComponent {

    constructor(props) {
        super(props);

        this.todoId = this.props.params.todoId;

        this.state = {
            dateErrorMessage: '',
            dateError: false,
            assigneeList: [],

            roleList: [
                {id: 'admin', title: 'All Admins'},
                {id: 'coach', title: 'All Coaches'},
                {id: 'guardian', title: 'All Parents'},
            ],

            sendEmailOptions: [
                {id: 1, title: 'Yes'},
                {id: 0, title: 'No'},
            ],

            options: [
                {id: 'allDay', title: 'All day'},
                {id: 'once', title: 'Once'},
                {id: 'day', title: 'Daily'},
                {id: 'week', title: 'Weekly'},
                {id: 'biweek', title: 'Bi weekly'},
                {id: 'month', title: 'Monthly'},
                {id: 'year', title: 'Yearly'},
            ],
            addVenueDialog: false,
            venueList: []
        };
    }

    componentWillMount = async () => {
        this.props.dispatch(fetchData({
            type: 'TODO',
            url: `/todos/${this.todoId}`,
        }))

        this.fetchVenue()

        const assigneeList = await api.get('/dropdown/users?roles=admin,coach')
        this.setState({assigneeList: assigneeList.data})
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

    closeDialog = () => {
        this.refForm && this.refForm.hideLoader()

        // set default state
        this.setState({
            confirmSubmit: false,
            deleteUserId: 0,
            dateError: false,
            dateErrorMessage: ''
        });
    }

    closeBox = () => {
        this.setState({
            dateError: false,
            dateErrorMessage: ''
        })
        this.refDialog.close()
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

    handleSubmit = async () => {

        const {
            assignee,
            notes,
            date,
            sendEmail,
            subject,
            showTo,
            startTime,
            endTime,
            venue
        } = this.state

        const formData = new FormData()
        assignee && formData.append('assignee', assignee)
        notes && formData.append('content', notes)
        date && formData.append('date', date)
        sendEmail && formData.append('send_email', sendEmail)
        subject && formData.append('title', subject)
        showTo.join() && formData.append('user_roles', showTo.join())

        const clearTime = moment(date).format('YYYY-MM-DD')
        const formatStartDate = moment(`${clearTime} ${startTime}`, 'YYYY-MM-DD HH:mm:SS').format('YYYY-MM-DD HH:mm:SS')
        const formatEndDate = moment(`${clearTime} ${endTime}`, 'YYYY-MM-DD HH:mm:SS').format('YYYY-MM-DD HH:mm:SS')

        startTime && formData.append(`start_time`, formatStartDate)
        endTime && formData.append(`end_time`, formatEndDate)
        venue && formData.append('venue_id', venue)

        const response = await api.update(`/todos/${this.todoId}`, formData)

        if (!api.error(response, false)) {
            fn.navigate(url.todo)
        } else {
            const errorHtml = api.getErrorsHtml(response.data)
            this.setState({
                dateErrorMessage: errorHtml,
                dateError: true
            });
            this.refForm && this.refForm.hideLoader()
            this.refDialog.open()
        }
    }

    render() {
        const {
            todo
        } = this.props

        const {
            assigneeList,
            roleList,
            addVenueDialog,
            venueList
        } = this.state

        const roles = todo.user_roles && todo.user_roles.split(',')

        return (
            <div id="content"
                 className="site-content-inner todo-component">

                <PageTitle value="Update task"/>

                <Form loader
                      onSubmit={this.handleSubmit}
                      className="form-section"
                      ref={ref => this.refForm = ref}>

                    <TextInput className="tooltips"
                               label="Subject"
                               name="subject"
                               onChange={this.handleInputChange}
                               value={todo.title}
                               prepend={<i className="ion-ios-book-outline"/>}
                    />

                    <Select
                        className="tooltips transparent"
                        placeholder="Venue"
                        label="Venue"
                        name="venue"
                        onChange={this.handleInputChange}
                        options={venueList}
                        value={todo.venue_id}
                        prepend={<i className="ion-location"/>}
                        append={
                            <span className="button"
                                  onClick={
                                      () => this.setState({addVenueDialog: true})
                                  }>Add venue
                                </span>
                        }
                    />

                    <Select className="tooltips"
                            label="Assignee"
                            name="assignee"
                            onChange={this.handleInputChange}
                            options={assigneeList}
                            value={todo.assignee}
                            prepend={<i className="ion-person-add"/>}
                    />

                    <DatePicker className="tooltips"
                                futureOnly
                                label="Date"
                                name="date"
                                onChange={this.handleInputChange}
                                value={todo.date}
                                prepend={<i className="ion-calendar"/>}
                    />

                    <TimePicker className="tooltips task-time"
                                placeholder="Start time"
                                label="Start time"
                                name="startTime"
                                onChange={this.handleInputChange}
                                validation="required"
                                value={todo.start_time && moment(todo.start_time).format('HH:mm')}
                                prepend={<i className="ion-clock"/>}
                    />

                    <TimePicker className="tooltips task-time"
                                placeholder="End time"
                                label="End time"
                                name="endTime"
                                value={todo.end_time && moment(todo.end_time).format('HH:mm')}
                                onChange={this.handleInputChange}
                                validation="required"
                                prepend={<i className="ion-clock"/>}
                    />

                    <Radio className="w-100"
                           label="Send email notification"
                           name="sendEmail"
                           onChange={this.handleInputChange}
                           options={this.state.sendEmailOptions}
                           styled
                           value={todo.send_email}
                    />

                    <Checkbox className="w-100-i"
                              label="Show this task to"
                              name="showTo"
                              onChange={this.handleInputChange}
                              options={roleList}
                              styled
                              value={roles}
                              wide
                    />

                    <TextInput className="w-100"
                               label="Notes"
                               name="notes"
                               onChange={this.handleInputChange}
                               textarea
                               value={todo.content}
                    />

                    <div className="form-actions">
                        <Back className="button"
                              showCloseButton={false}
                              confirm>Cancel
                        </Back>

                        <FormButton label="Save"/>
                    </div>
                </Form>

                <Dialog
                    showCloseButton={false}
                    ref={ref => this.refDialog = ref}
                    title=""
                    content={
                        <div className="dialog-body-inner">
                            <div className={"dialog-left-sidebar"}>
                                <img src={'/images/ball-soccer.png'}/>
                            </div>
                            <div className={"dialog-right-side"}>
                                <h3>Error!</h3>
                                {this.state.dateErrorMessage}
                            </div>
                        </div>
                    }
                    buttons={[
                        <button className="button" onClick={() => this.closeBox()}>Go Back</button>,
                    ]}
                >
                    <button className="button hidden"></button>
                </Dialog>

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
