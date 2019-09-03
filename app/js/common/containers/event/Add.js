import React from 'react';
import {DatePicker, Form, Radio, Select, TextInput, TimePicker} from '@xanda/react-components';
import {api, fn} from 'app/utils';
import {url} from 'app/constants';
import {
    Back,
    FormButton,
    PageTitle,
    ButtonStandard,
    FormSection
} from 'app/components';
import moment from 'moment';

export default class Add extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            programmeTypes: [],
            venueTypes: [],
        };
    }

    componentWillMount = async () => {
        const programmeTypes = await api.get('/dropdown/programme-types/event');
        const venueTypes = await api.get('/dropdown/venues');
        this.setState({
            programmeTypes: programmeTypes.data,
            venueTypes: venueTypes.data,
        });
    }

    handleInputChange = (name, value) => {
        this.setState({[name]: value});
    }

    handleSubmit = async () => {
        const {
            date,
            startTime,
            endTime,
            type,
            requireCoach,
            maxSize,
            notes,
            venue
        } = this.state

        const formData = new FormData()
        date && endTime && formData.append('end_time', moment(`${date} ${endTime}`, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm:SS'))
        type && formData.append('event_type_id', type)
        requireCoach && formData.append('is_coach_required', requireCoach)
        maxSize && formData.append('max_size', maxSize)
        notes && formData.append('notes', notes)
        date && startTime && formData.append('start_time', moment(`${date} ${startTime}`, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm:SS'))
        venue && formData.append('venue', venue)

        const response = await api.post('/requests', formData)

        if (!api.error(response)) {
            fn.navigate(url.event)
        } else {
            this.refForm && this.refForm.hideLoader()
        }
    }

    render() {
        const {
            programmeTypes,
            venueTypes
        } = this.state

        return (
            <div id="content" className="site-content-inner">
                <PageTitle value="Request an Event Booking"/>
                <Form loader onSubmit={this.handleSubmit} ref={ref => this.refForm = ref}>
                    <FormSection>
                        <Select
                            className="tooltips"
                            label="Type"
                            placeholder="Type"
                            name="type"
                            onChange={this.handleInputChange}
                            options={programmeTypes}
                            validation="required"
                            prepend={<i className="ion-ios-bookmarks-outline"/>}
                        />

                        <TextInput
                            className="tooltips"
                            placeholder="No of players"
                            label="No of players"
                            name="maxSize"
                            validation="required"
                            prepend={<i className="ion-person-stalker"/>}
                            onChange={this.handleInputChange}
                        />

                        <Radio
                            label="Require a coach"
                            name="requireCoach"
                            onChange={this.handleInputChange}
                            options={[{id: 1, title: 'Yes'}, {id: 0, title: 'No'}]}
                            validation="required"
                            styled
                        />

                        <Select
                            className="tooltips"
                            placeholder="Venue"
                            label="Venue"
                            name="venue"
                            onChange={this.handleInputChange}
                            options={venueTypes}
                            validation="required"
                            prepend={<i className="ion-location"/> }
                        />

                        <DatePicker
                            className="tooltips"
                            placeholder="Date"
                            futureOnly
                            label="Date"
                            name="date"
                            onChange={this.handleInputChange}
                            returnFormat="YYYY-MM-DD"
                            validation="required"
                            prepend={<i className="ion-ios-calendar-outline"/> }
                        />

                        <div className="programme-time">
                            <TimePicker
                                className="tooltips"
                                placeholder="Start time"
                                prepend={<i className="ion-android-time"/> }
                                label="Start time"
                                name="startTime"
                                onChange={this.handleInputChange}
                                validation="required"
                            />

                            <TimePicker
                                className="tooltips"
                                placeholder="End time"
                                prepend={<i className="ion-android-time"/> }
                                label="End time"
                                name="endTime"
                                onChange={this.handleInputChange}
                                validation="required"
                            />
                        </div>

                        <TextInput
                            label="Notes"
                            name="notes"
                            onChange={this.handleInputChange}
                            textarea
                            wide
                        />

                        <div className="form-actions">
                            <Back className="button">Cancel</Back>
                            <FormButton label="Save"/>
                        </div>
                    </FormSection>
                </Form>
            </div>
        );
    }

}
