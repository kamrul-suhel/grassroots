import React from 'react'
import {connect} from 'react-redux'
import {url} from 'app/constants'
import {api, fn} from 'app/utils'
import {fetchData} from 'app/actions'
import {
    ContentLoader,
    GoogleMap,
    Table,
    Dialog,
    Form,
    Radio
} from '@xanda/react-components'

import {
    Article,
    Link,
    Meta,
    MetaSection,
    PageTitle,
    ConfirmDialog,
    Back,
    FormSection
} from 'app/components'

@connect((store, ownProps) => {
    return {
        collection: store.programme,
        programme: store.programme.collection[ownProps.params.programmeId] || {},
        sessions: store.session,
    };
})
export default class View extends React.PureComponent {

    constructor(props) {
        super(props);

        this.playerId = this.props.params.playerId;
        this.programmeId = this.props.params.programmeId;

        this.state = {
            currentPage: 1,
            acceptDialog: false
        };
    }

    componentWillMount = () => {
        this.fetchData();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.playerId !== this.props.params.playerId || nextProps.params.programmeId !== this.props.params.programmeId) {
            this.playerId = nextProps.params.playerId;
            this.programmeId = nextProps.params.programmeId;
            this.fetchData();
        }
    }

    fetchData = () => {
        const urlPlayerArg = this.playerId ? `?player_id=${this.playerId}` : '';
        this.props.dispatch({type: 'SESSION_CLEAR'});

        this.props.dispatch(fetchData({
            type: 'PROGRAMME',
            url: `/programmes/${this.programmeId}${urlPlayerArg}`,
        }));

        this.fetchSessions();
    }

    fetchSessions = () => {
        const urlPlayerArg = this.playerId ? `?player_id=${this.playerId}` : '';
        this.props.dispatch(fetchData({
            type: 'SESSION',
            url: `/programmes/${this.programmeId}/sessions${urlPlayerArg}`,
        }));
    }

    handleInputChange = (name, value) => {
        this.setState({
                [name]: value
            })
    }

    handleSubmit = async (status) => {

        const {
            acceptDialog,
            agreedConsent
        } = this.state

        // If status is accept & acceptDialog=false, then show accept dialog
        if(status === 'accept' && !acceptDialog){
            this.setState({
                acceptDialog: true
            })
            return
        }

        // If programme accept and they did not select consent, then do not submit accept form.
        if(status === 'accept' && !agreedConsent){
            return
        }

        const urlPlayerArg = this.playerId ? `?player_id=${this.playerId}` : '';
        const link = `/programmes/${this.programmeId}/accept${urlPlayerArg}&status=${status}`;

        const response = await api.update(link);

        if (!api.error(response)) {
            this.setState({
                acceptDialog:false
            })

            fn.navigate(`${url.programme}`)
        }
    }

    handleRejectSession = (session) => {
        console.log("Reject session is: ", session)
    }

    renderAcceptContent = () => {
        const { programme } = this.props

        return (
            <div className="consent-dialog">
                <p>{programme.consent_content}</p>
                <Form>
                    <FormSection>
                        <Radio
                            name="agreedConsent"
                            options={[{
                                id: 1,
                                title: 'I Agreed with this consent.'
                            }]}
                            onChange={this.handleInputChange}
                            validation="required"
                        />
                    </FormSection>

                    <div className="form-actions">
                        <button onClick={this.handleCancelAcceptDialog}
                                className="button hover-blue">Cancel
                        </button>

                        <button onClick={() => this.handleSubmit('accept')}
                                className="button hover-blue">Accept
                        </button>
                    </div>
                </Form>
            </div>
        )
    }

    handleCancelAcceptDialog = () => {
        this.setState({
            acceptDialog: false
        })
    }

    render() {
        const {
            collection,
            programme,
            sessions,
        } = this.props;
        const {
            currentPage,
            acceptDialog
        } = this.state;
        const urlPlayerArg = this.playerId ? `/player/${this.playerId}` : '';
        const teams = programme.teams && programme.teams.map((team, i) => [
            i > 0 && ', ',
            <span key={`team_${team.team_id}`}>{team.title}</span>,
        ]);

        const metaValue = (
            <span>
				{
                    programme.acceptance_status === 0 &&
                    <span className="button"
                          onClick={() => this.handleSubmit('accept')}>Accept
						</span>
                }

                {
                    programme.acceptance_status === 0 &&
                    <span className="button"
                          onClick={() => this.handleSubmit('reject')}>
						Reject
					</span>
                }

                {
                    programme.acceptance_status === 1 && <span>Accepted</span>
                }

                {
                    programme.acceptance_status === 2 && <span>Rejected</span>
                }
			</span>
        );

        const discount = () => {
            switch (sessions.misc && sessions.misc.discount) {
                case 1:
                    return 'Sibling discount applied';
                case 2:
                    return 'Additional sibling discount applied';
            }

            return null;
        };

        const tableFooter = programme.acceptance_status === 0 && [
            <Meta key="noSessions"
                  className="mt-0"
                  label="No of sessions"
                  value={sessions.count}/>,

            <Meta key="totalPrice"
                  className="mt-0"
                  label="Total"
                  value={sessions.misc && `£${sessions.misc.total}`}/>,
        ];

        const showSessionViewButton = !fn.isGuardian() || (fn.isGuardian() && programme.acceptance_status === 1);

        return (
            <div id="content" className="site-content-inner">
                <PageTitle value={programme.title || 'Programme'}/>

                <ContentLoader
                    data={programme.id}
                    forceRefresh
                    isLoading={collection.isLoading}
                    notFound="No Data"
                >
                    <Article>
                        <Meta label="Programme" value={programme.title}/>
                        <Meta label="Programme type" value={programme.type}/>
                        <Meta label="Team / skill group" value={teams || null}/>
                        <Meta label="Pitch" value={`${programme.pitch_number !== null ? programme.pitch_number : ''} ${programme.pitch_info !== null ? programme.pitch_info : ''}`}/>
                        <Meta label="Bring / wear" value={programme.require_equipment !== null ? programme.require_equipment : 'Not define'}/>
                        <Meta label="Payment note" value={programme.payment_note !== null ? programme.payment_note : 'Not define'}/>
                        <Meta label="Discount" separator="" value={discount()}/>
                        <Meta label={programme.player_name} separator="" value={metaValue}/>

                        {/* Only admin can see status */}
                        { fn.isAdmin() ? <Meta label="Status" separator="" value={programme.status === 1 ?  'Visible' : 'Not visible for parent' }/> : null}
                    </Article>
                </ContentLoader>

                <PageTitle value="Sessions" subTitle/>

                <ContentLoader
                    pagination={{
                        currentPage,
                        onPageChange: this.fetchSessions,
                        total: sessions.count,
                    }}
                    data={sessions.currentCollection}
                    forceRefresh
                    isLoading={sessions.isLoading}
                    notFound="No sessions"
                >
                    <Table
                        className={"header-transparent"}
                        total={sessions.count}
                        footer={tableFooter || null}
                        headers={['', 'Venue', 'Coach', 'Time', 'Price', 'Option']}
                        icon="ion-android-calendar"
                    >
                        {_.map(sessions.currentCollection, (id) => {
                            const session = sessions.collection[id];

                            const generatePrice = () => {
                                if (fn.isAdmin()) {
                                    return `${fn.formatPrice(session.price)}, ${fn.formatPrice(session.price2)}, ${fn.formatPrice(session.price2plus)}`;
                                }
                                return fn.formatPrice(session.price, true);
                            };

                            return (
                                <tr key={`session_${session.session_id}`}>
                                    <td>
                                        <Link to={`${url.session}/${session.session_id}${urlPlayerArg}`}>
                                            {fn.formatDate(session.start_time)}
                                        </Link>
                                    </td>
                                    <td>{session.venue_title}</td>
                                    <td>{session.coach_name}</td>
                                    <td>{fn.formatDate(session.start_time, 'HH:mm')} - {fn.formatDate(session.end_time, 'HH:mm')}</td>
                                    <td>{generatePrice(session)}</td>
                                    <td>
                                        {showSessionViewButton &&
                                            <React.Fragment>
                                                <Link to={`${url.session}/${session.session_id}${urlPlayerArg}`}
                                                      className="button">
                                                    <i title="View" className="ion-search"></i>
                                                </Link>

                                                <ConfirmDialog onlyContent={true}
                                                               onConfirm={() => this.handleRejectSession(session)}
                                                                body={<div>You do not want to attend this session.</div>}>
                                                    <button className="button">
                                                        <i className="icon ion-ios-close"></i>
                                                    </button>
                                                </ConfirmDialog>
                                            </React.Fragment>
                                        }
                                        {fn.isAdmin() &&
                                            <Link to={`${url.session}/${session.session_id}/edit`}
                                                  className="button"><i title="View" className="ion-edit"></i>
                                            </Link>
                                        }
                                    </td>
                                </tr>
                            );
                        })}
                    </Table>
                </ContentLoader>

                <div className="form-actions">
                    <Back className="button">Goback</Back>
                </div>

                {acceptDialog && <Dialog
                    title={programme.consent_title}
                    showCloseButton={false}
                    content={this.renderAcceptContent()}
                >
                </Dialog>}
            </div>
        );
    }

}
