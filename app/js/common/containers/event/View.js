import React from 'react';
import {connect} from 'react-redux';
import {ContentLoader, Select, Dialog, Form} from '@xanda/react-components';
import {api, fn} from 'app/utils';
import {url} from 'app/constants';
import {fetchData} from 'app/actions';
import {
    Article,
    ButtonStandard,
    ConfirmDialog,
    Link,
    Meta,
    MetaSection,
    PageTitle
} from 'app/components';

import {Edit as EventEdit} from 'app/containers/event'

@connect((store, ownProps) => {
    return {
        collection: store.request,
        request: store.request.collection[ownProps.params.requestId] || {},
    };
})
export default class View extends React.PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            coaches: [],
            acceptDialog: false
        }
    }

    componentWillMount = async () => {
        this.props.dispatch(fetchData({
            type: 'REQUEST',
            url: `/requests/${this.props.params.requestId}`,
        }));

        // Get coaches
        const coaches = await api.get('dropdown/coaches')

        this.setState({
            coaches:[...coaches.data]
        })
    }

    handleInputChange = (name, value) =>{
        this.setState({
            [name]: value
        })
    }

    handleClick = async (id, type) => {
        const { request } = this.props
        const { coachId } = this.state
        const status = type === 'reject' ? 2 : 1;

        // If event is accepted & coach is required then check is coach is selected or no
        if(request.is_coach_required === 1 && status === 1 && !coachId){
            // Do not send accept or reject request
            this.setState({
                acceptDialog:true
            })
            return
        }

        const response = await api.update(`/requests/accept-reject/${id}`, {status});

        if (!api.error(response)) {
            fn.navigate(url.event);
        }
    }

    renderCoachForm = () => {

    }

    renderAcceptRequestEventWitcCoach = () => {
        const { request } = this.props
        const { coaches } = this.state

        return (
            <div style={{width:"100%"}}>
                <Form onSubmit={this.handelSubmitAcceptWithCoach}>
                    <Select
                        label="Select a coach"
                        placeholder="Select a coach"
                        name="coachId"
                        onChange={this.handleInputChange}
                        options={coaches}
                        value={request.coach_id}
                        validation="required"
                        className="tooltips"
                        prepend={<i className="ion-person"/>}
                        wide
                    />

                    <div className="form-actions">
                        <button className="button"
                                onClick={this.handleCloseAcceptRequestDialog}>Cancel
                        </button>

                        <button className="button hover-blue">Accept
                        </button>
                    </div>
                </Form>
            </div>
        )
    }

    handelSubmitAcceptWithCoach = async () => {
        const {request } = this.props
        const { coachId } = this.state

        let formData = new FormData()
        formData.append('status', 1) // accepted
        formData.append('coach_id', coachId)

        const response = await api.update(`/requests/accept-reject/${request.request_id}`, formData);

        if (!api.error(response)) {
            fn.navigate(url.event);
        }
    }

    handleCloseAcceptRequestDialog = (event) => {
        event.preventDefault()
        this.setState({
            acceptDialog: false
        })
    }

    render() {
        const {
            collection,
            request,
        } = this.props

        const {
            coaches,
            acceptDialog
        } = this.state

        return (
            <div id="content" className="site-content-inner">
                <PageTitle value={request.title || 'Request'}/>

                {fn.isGuardian() &&
                <div className="page-actions">
                    <ButtonStandard to={`${url.event}/${request.request_id}/edit`} icon={<i className="ion-edit"/>}>Edit
                        request</ButtonStandard>
                </div>
                }

                <ContentLoader
                    data={request.request_id}
                    forceRefresh
                    isLoading={collection.isLoading}
                    notFound="No Data"
                >
                    <Article>
                        {fn.isGuardian() &&
                        <MetaSection title="Request details">
                            <Meta label="Type" value={request.event_type}/>
                            <Meta label="Coach required" value={request.is_coach_required == 1 ? 'Yes' : 'No'}/>
                            <Meta label="Number of players" value={request.max_size}/>
                            <Meta label="Venue" value={request.venue}/>
                            <Meta label="Date" value={fn.formatDate(request.start_time)}/>
                            <Meta label="Time"
                                  value={`${fn.formatDate(request.start_time, 'HH:mm')} - ${fn.formatDate(request.end_time, 'HH:mm')}`}/>
                            <Meta label="Status" value={fn.formatProgrammeStatus(request.status)}/>
                            <Meta label="Notes" value={request.notes}/>
                        </MetaSection>
                        }

                        {fn.isAdmin() &&
                            <MetaSection title="Contact details">
                                <Meta label="Name" value={request.user_name}/>
                                <Meta label="Telephone" value={request.user_telephone}/>
                                <Meta label="Email"
                                      value={<a href={`mailto:${request.user_email}`}>{request.user_email}</a>}/>
                            </MetaSection>
                        }

                        {fn.isAdmin() && request.status === 0 &&
                            <div className="form-section">
                                <div className="form-actions">
                                    <ConfirmDialog
                                        onConfirm={() => this.handleClick(request.request_id, 'reject')}
                                        title="Are you sure you want to reject this event?"
                                    >
                                        <span className="button">Reject</span>
                                    </ConfirmDialog>

                                    <span className="button hover-blue"
                                          onClick={() => this.handleClick(request.request_id, 'accept')}>Accept
                                    </span>
                                </div>
                            </div>
                        }
                    </Article>
                </ContentLoader>

                {fn.isAdmin() && <EventEdit {...this.props}/>}

                { acceptDialog && <Dialog
                    showCloseButton={false}
                    title="Accept Request Event"
                    content={this.renderAcceptRequestEventWitcCoach()}
                >
                </Dialog>}
            </div>
        );
    }

}
