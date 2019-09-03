import React from 'react';
import { DatePicker, Form, Loader, Table, TextInput, Checkbox } from '@xanda/react-components';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { Back, FormSection, PageDescription, PageTitle, Link } from 'app/components';

export default class RegisterPlayer extends React.PureComponent {

	handlePlayerChange = (playerId, name, value) => {
		const payload = {
			name,
			playerId,
			value,
		};
		return this.props.dispatch({ type: 'REGISTERACCOUNTS_UPDATE_PLAYER_INFO', payload });
	}

	addPlayer = () => this.props.dispatch({ type: 'REGISTERACCOUNTS_ADD_PLAYER' })

	editPlayer = (playerId) => {
		const payload = { playerId };

		return this.props.dispatch({ type: 'REGISTERACCOUNTS_EDIT_PLAYER', payload });
	}

	listProgrammes = async (playerId) => {
		const { registerAccounts } = this.props;
		const currentPlayer = registerAccounts.players[`player${playerId}`];

		this.props.dispatch({ type: 'REGISTERACCOUNTS_PROGRAMME_PENDING', payload: { playerId } });

		const response = await api.get(`/public/programmes?dob=${currentPlayer.dob}&club_id=${this.props.authClub.data.club_id}`);

		const payload = {
			playerId,
			response,
		};

		if (!api.error(response)) {
			this.props.dispatch({ type: 'REGISTERACCOUNTS_PROGRAMME_SUCCESS', payload });
		}
	}

	handleClick = async (event, playerId, programmeId) => {
		event.preventDefault();

		const payload = {
			currentPlayerId: playerId,
			currentProgrammeId: programmeId,
		};

		this.props.dispatch({ type: 'REGISTERACCOUNTS', payload });

		return fn.navigate(`${url.registerAccounts}/view-programme`);
	}

	render() {
		const { registerAccounts } = this.props;
		let playerCount = '';

		return (
			<div id="content" className="site-content-inner">
				<div style={{ marginBottom: 20 }}>
					<Back className="button button-large">Back</Back>
				</div>
				<PageTitle value="Currently Available Activities" />
				<PageDescription>Please enter your child details and search from the available programmes</PageDescription>

				<Form wide>
					{_.map((registerAccounts.players), (player) => {
						playerCount++;
						const playerDob = player.dob ? `- ${fn.formatDate(player.dob, 'DD MMM YYYY')}` : '';
						const playerName = player.firstName ? `${playerCount}. ${player.firstName} ${player.lastName} ${playerDob}` : `${playerCount}. child`;
						const siblingCount = fn.returnLeft(registerAccounts.siblings, player.id);
						const priceBand = fn.getPriceBand(siblingCount.length);
						const handleTermsChange = () => {if(player.terms ){this.handlePlayerChange(player.id, 'terms', false)} else {this.handlePlayerChange(player.id, 'terms', true)}};
						const handleInputChange = (name, value) => this.handlePlayerChange(player.id, name, value);

						return (
							<FormSection key={`player${player.id}`} title={playerName} className="player-details">
								{player.editable &&
									<div className="form-section-inner">
										<TextInput prepend={<i className="ion-person" />} name="firstName" label="First name" value={player.firstName} onChange={handleInputChange} />
										<TextInput prepend={<i className="ion-person" />} name="lastName" label="Last name" value={player.lastName} onChange={handleInputChange} />
										<DatePicker name="dob" label="Date of birth" value={player.dob} pastOnly showYearSelect returnFormat="YYYY-MM-DD" onChange={handleInputChange} />
										<div className="form-group center-text form-type-input form-group-valid"><span>Agree to our <Link to="#">Terms and conditions</Link></span><span className="button" onClick={handleTermsChange}>{(player.terms ? <i className="ion-checkmark" /> : <i className="ion-close" />)}</span></div>
									</div>
								}

								{!player.editable && <span className="button edit-button" onClick={() => this.editPlayer(player.id)}>Edit</span>}

								{player.programmesFetching && <Loader />}

								{!player.editable && !player.programmesFetching && player.programmes.length > 0 &&
									<div className="table-wrapper">
										<Table headers={['', 'Sessions', 'Price', 'Options']} icon="ion-android-calendar">
											{_.map(player.programmes, (programme) => {
												const handleClick = e => this.handleClick(e, player.id, programme.programme_id);

												return (
													<tr key={`programme${programme.programme_id}`}>
														<td><a onClick={handleClick}>{programme.title}</a></td>
														<td>{programme.session_count}</td>
														<td>{fn.formatPrice(programme[priceBand], true)}{priceBand !== 'price' && <span>*</span>}</td>
														<td>
															<a className="button" onClick={handleClick}>Select this programme</a>
														</td>
													</tr>
												);
											})}
										</Table>
										{priceBand === 'price2' && <span className="small-text">* - Sibling discount applied</span>}
										{priceBand === 'price2plus' && <span className="small-text">* - Additional sibling discount applied</span>}
									</div>
								}

								{!player.editable && !player.programmesFetching && player.programmes.length === 0 &&
									<span>No programmes available for this agegroup</span>
								}

								{(player.firstName && player.terms && player.lastName && player.dob && player.editable) &&
									<div className="form-actions">
										<span className="button" onClick={() => this.listProgrammes(player.id, player.dob)}>Find available programmes</span>
									</div>
								}
							</FormSection>
						);
					})}
					{registerAccounts.playerCount < 3 &&
						<div className="form-actions">
							<span className="button" onClick={this.addPlayer}>Add another child</span>
						</div>
					}
				</Form>
			</div>
		);
	}

}
