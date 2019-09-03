import React from 'react';
import {connect} from 'react-redux';
import {ContentLoader, GoogleMap, Table, Tooltip} from '@xanda/react-components';
import {api, fn} from 'app/utils';
import {url} from 'app/constants';
import {fetchData} from 'app/actions';
import {Article, Link, Meta, MetaSection, PageTitle} from 'app/components';

@connect((store, ownProps) => {
    return {
        collection: store.fixture,
        fixture: store.fixture.collection[ownProps.params.fixtureId] || {},
    };
})
export default class View extends React.PureComponent {

    constructor(props) {
        super(props);

        this.playerId = this.props.params.playerId;
        this.fixtureId = this.props.params.fixtureId;
    }

    componentWillMount() {
        const urlPlayerArg = this.playerId ? `?player_id=${this.playerId}` : '';

        this.props.dispatch(fetchData({
            type: 'FIXTURE',
            url: `/fixtures/${this.fixtureId}${urlPlayerArg}`,
        }));
    }

    handleSubmit = async (status) => {
        const urlPlayerArg = this.playerId ? `?player_id=${this.playerId}` : '';
        const link = `/programmes/${this.props.fixture.programme_id}/accept${urlPlayerArg}&status=${status}`;

        const response = await api.update(link);

        if (!api.error(response)) {
            fn.navigate(url.programme);
            fn.showAlert(`Fixture has been ${status}ed.`, 'success');
        }
    }

    downloadFixtureImage = async () => {

        const {fixture} = this.props;
        // const linkUrl = window.URL.createObjectURL(fixture.image_path);
        const link = document.createElement('a');
        link.href = fixture.image_path;
        link.setAttribute('download', `image-${Date.now()}.${fixture.image_type}`);
        link.setAttribute('target', `_blank`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    renderFormActions = () => {
        const {fixture} = this.props;

        switch (fn.getUserRole()) {
            case 'guardian':
                if (fixture.acceptance_status === 0) {
                    return (
                        <div className="form-actions">
                            <span key="reject" className="button" onClick={() => this.handleSubmit('reject')}>Reject fixture</span>
                            <span key="accept" className="button" onClick={() => this.handleSubmit('accept')}>Accept fixture</span>
                        </div>
                    );
                }
                break;
        }
        return null;
    }

    render() {
        const {
            collection,
            fixture,
        } = this.props;

        return (
            <div id="content" className="site-content-inner">
                <PageTitle value={fixture.title || 'Fixture'}/>

                <ContentLoader
                    data={fixture.fixture_id}
                    forceRefresh
                    isLoading={collection.isLoading}
                    notFound="No Data"
                >
                    <Article bg={<GoogleMap lat={fixture.lat} lng={fixture.lng}/>}>
                        <MetaSection title="Fixture">
                            <Meta label="Type" value={_.startCase(fixture.match_type)}/>
                            <Meta label="Team" value={fixture.team}/>
                            <Meta label="Oposition" value={fixture.oposition}/>
                            <Meta label="Date" value={fn.formatDate(fixture.start_time)}/>
                            <Meta label="Meet time" value={fn.formatDate(fixture.start_time, 'HH:mm')}/>
                            <Meta label="Kick-off time" value={fn.formatDate(fixture.kickoff_time, 'HH:mm')}/>
                            <Meta label="Pitch Number" value={fixture.pitch_no}/>
                            <Meta label="Pitch Size" value={fixture.pitch_size}/>
                            <Meta label="Coach" value={fixture.coach_name}/>
                            <Meta label="Referee" value={fixture.referee}/>
                            <Meta label="Notes" value={fixture.notes}/>
                        </MetaSection>

                        <MetaSection title="Location">
                            <Meta label="Venue" value={fixture.venue}/>
                            <Meta label="Surface" value={fixture.surface && fixture.surface.split(',').join(', ')}/>
                            <Meta label="Address" value={fixture.address}/>
                            <Meta label="Postcode" value={fixture.postcode}/>
                        </MetaSection>

                        <MetaSection title="Opposition">
                            {fn.isAdmin() &&
                            <p className="meta aligned">
                                <span className="label">Name:</span>
                                <span className="value">{fixture.oposition}</span>
                            </p>}
                        </MetaSection>

                        {fn.isGuardian() &&
                        <MetaSection title="Price">
                            <Meta label="Amount" value={fn.formatPrice(fixture.price, true)}/>
                        </MetaSection>
                        }

                        {this.renderFormActions()}
                    </Article>

                    <MetaSection>
                        {fixture.image_path && <PageTitle value="Download" subTitle/>}

                        {fixture.image_path && fixture.image_path ?
                            <button className="button"
                                    onClick={() => this.downloadFixtureImage(fixture)}>
                                Download
                            </button> : ''
                        }
                    </MetaSection>

                    <MetaSection>
                        {fixture.players && <PageTitle value="Registered Players" subTitle/>}

                        {fixture.players &&
                        <Table headers={['', 'Age', 'Guardian', 'Telephone', 'Status']} icon="ion-ios-person">
                            {fixture.players.map((player) => {
                                const genderIcon = player.gender === 'male' ? 'ion-male' : 'ion-female';
                                const medicalIcon = player.medical_conditions ?
                                    <Tooltip icon={<i className="ion-medkit"/>} message={player.medical_conditions}/> :
                                    <i/>;
                                return (
                                    <tr key={`player${player.player_id}`}>
                                        <td>
                                            <div className="space-between">
                                                <Link
                                                    to={`${url.player}/${player.player_id}`}>{player.display_name}</Link>
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
                    </MetaSection>
                </ContentLoader>
            </div>
        );
    }

}
