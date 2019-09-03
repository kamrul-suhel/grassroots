import React from 'react';
import {connect} from 'react-redux';
import {api, fn} from 'app/utils';
import {url} from 'app/constants';
import {fetchData} from 'app/actions';
import {ContentLoader, GoogleMap, Table, Tooltip} from '@xanda/react-components';
import {Article, ButtonStandard, Link, Meta, MetaSection, PageTitle} from 'app/components';
import { Edit } from './index'
import moment from 'moment';

@connect((store, ownProps) => {
    return {
        collection: store.session,
        session: store.session.collection[ownProps.params.sessionId] || {},
    };
})
export default class View extends React.PureComponent {

    playerId = this.props.params.playerId;
    sessionId = this.props.params.sessionId;

    componentWillMount() {
        const urlPlayerArg = this.playerId ? `?player_id=${this.playerId}` : '';

        this.props.dispatch(fetchData({
            type: 'SESSION',
            url: `/sessions/${this.sessionId}${urlPlayerArg}`,
        }));
    }

    handleSessionAttendance = async (status) => {
        const {session} = this.props;

        const formData = {
            player_id: this.playerId,
            status,
        };

        const response = await api.update(`/sessions/${session.session_id}/accept`, formData);

        if (!api.error(response)) {
            fn.navigate(url.programme);
            fn.showAlert(`Session (${session.programme_name}) has been ${status}ed.`, 'success');
        }
    }

    renderPageActions = () => {
        const {me, session} = this.props;
        switch (fn.getUserRole()) {
            case 'admin':
                return (
                    <div className="page-actions">
                        <ButtonStandard to={`${url.session}/${session.session_id}/edit`}
                                        icon={<i className="ion-edit"/>}>Edit session</ButtonStandard>
                    </div>
                );
            case 'coach': {
                if (session.attendance_completed !== 1 && moment().diff(session.start_time) > 0 && session.coach_id == me.data.user_id) {
                    return (
                        <div className="page-actions">
                            <ButtonStandard to={`${url.attendance}/${session.session_id}`}
                                            icon={<i className="ion-plus"/>}>Take attendance
                            </ButtonStandard>
                        </div>
                    );
                }
                break;
            }
        }
        return null;
    }

    renderFormActions = () => {
        const {session} = this.props;

        switch (fn.getUserRole()) {
            case 'guardian':
                if (session.is_trial && session.acceptance_status === 0) {
                    return [
                        <span key="reject"
                              className="button"
                              onClick={() => this.handleSessionAttendance('reject')}>Reject trial date
						</span>,

                        <span key="accept"
                              className="button"
                              onClick={() => this.handleSessionAttendance('accept')}>Accept trial date
						</span>
                    ];
                }

                if (session.is_trial === 3 && session.acceptance_status === 3) {
                    return [
                        <span key="reject"
                              className="button"
                              onClick={() => this.handleSessionAttendance('reject_team')}>Reject from team
						</span>,

                        <span key="accept"
                              className="button"
                              onClick={() => this.handleSessionAttendance('accept_team')}>Accept into team
						</span>
                    ];
                }

                break;
        }
        return null;
    }

    render() {
        const {
            collection,
            session,
        } = this.props

        return (
            <div id="content" className="site-content-inner">
                <PageTitle value={session.programme_name || 'Session'}/>

                {/*{this.renderPageActions()}*/}
                <Edit {...this.props}/>

                <ContentLoader
                    data={session.session_id}
                    forceRefresh
                    isLoading={collection.isLoading}
                    notFound="No Data"
                >
                    <Article className="mt-40"
                             bg={<GoogleMap lat={session.address && session.address.lat}
                                            lng={session.address && session.address.lng}/>}>
                        <MetaSection title="Session">
                            <Meta label="Type"
                                  value={session.programme_type}/>

                            <Meta label="Date"
                                  value={fn.formatDate(session.start_time)}/>

                            <Meta label="Time"
                                  value={`${fn.formatDate(session.start_time, 'HH:mm')} - ${fn.formatDate(session.end_time, 'HH:mm')}`}/>
                        </MetaSection>

                        <MetaSection title="Location">
                            <Meta label="Venue"
                                  value={session.address && session.address.title}/>

                            <Meta label="Surface"
                                  value={session.surface && session.surface.split(',').join(', ')}/>

                            <Meta label="Address"
                                  value={session.address && session.address.address}/>

                            <Meta label="Postcode"
                                  value={session.address && session.address.postcode}/>

                            {fn.isAdmin() && <Meta label="Contact name"
                                                   value={session.address && session.address.contact_name}/>}

                            {fn.isAdmin() && <Meta label="Contact telephone"
                                                   telLink={true}
                                                   value={session.address && session.address.telephone}/>}
                        </MetaSection>

                        {!fn.isCoach() &&
                        <MetaSection title="Coach">
                            <Meta label="Name" value={session.coach && session.coach.display_name}/>
                            <Meta label="Telephone" telLink={true} value={session.coach && session.coach.telephone}/>
                        </MetaSection>
                        }

                        <div className="form-actions">
                            {this.renderFormActions()}
                        </div>
                    </Article>

                    {session.players && <PageTitle value="Registered Players" subTitle/>}

                    {session.players &&
                    <Table headers={['', 'Age', 'Guardian', 'Telephone', 'Status']}
                           className="header-transparent"
                           icon="ion-ios-person">
                        {session.players.map((player) => {
                            const genderIcon = player.gender === 'male' ? 'ion-male' : 'ion-female';
                            const medicalIcon = player.medical_conditions ?
                                <Tooltip icon={<i className="ion-medkit"/>} message={player.medical_conditions}/> :
                                <i/>;
                            return (
                                <tr key={`player${player.player_id}`}>
                                    <td>
                                        <div className="space-between">
                                            <Link to={`${url.player}/${player.player_id}`}>{player.display_name}</Link>
                                            <div className="td-icons">
                                                <i className={genderIcon}/>
                                                {medicalIcon}
                                            </div>
                                        </div>
                                    </td>
                                    <td>{fn.diffDate(player.birthday)} years</td>
                                    <td>{player.guardian_name}</td>
                                    <td><a href={`tel:${player.guardian_telephone}`}>{player.guardian_telephone}</a>
                                    </td>
                                    <td>{fn.formatProgrammeStatus(player.status)}</td>
                                </tr>
                            );
                        })}
                    </Table>
                    }
                </ContentLoader>
            </div>
        );
    }

}
