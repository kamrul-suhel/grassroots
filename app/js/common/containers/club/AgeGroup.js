import React from 'react';
import { Checkbox, Form, MultiSelect, TextInput } from '@xanda/react-components';
import Store from 'app/store';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { fetchData } from 'app/actions';
import { Back, FormButton, PageDescription, PageTitle } from 'app/components';
import {connect} from "react-redux";

@connect((store) => {
	return {
		clubAdmins: store.clubAdmin,
	};
})

export default class AgeGroup extends React.PureComponent {

	constructor(props) {
		super(props);

		this.state = {
			agegroupList: [],
		};
	}

	componentWillMount = async () => {
		const agegroupList = await api.get('/age-groups');

		this.setState({
			agegroupList: agegroupList.data.entities,
		});
	}

	handleInputChange = (name, value) => {
		this.setState({ [name]: value });
	}

	handleSubmit = async () => {
		const formData = {
			agegroups: this.state.ageGroup,
		};

		const clubId = this.props.params.clubId || 'my';
		const response = await api.update(`/clubs/${clubId}`, formData);

		if (!api.error(response)) {
			if (this.props.params.clubId) {
				this.props.fetchData();
				fn.navigate(`${url.club}/${this.props.params.clubId}`);
			} else {
				Store.dispatch(fetchData({
					type: 'MYCLUB',
					url: '/clubs/my',
				}));
				fn.navigate(url.setting);
				this.props.dispatch({
					type:'OPEN_SNACKBAR_MESSAGE',
					option: {
						message:'Age groups have updated!',
						color:'dark'
					}
				})
			}
		} else {
			this.refForm && this.refForm.hideLoader();
		}
	}

	renderAgegroups() {
		const { agegroupList } = this.state;

		if (!agegroupList) {
			return null;
		}

		const club = this.props.params.clubId ? this.props.club : this.props.myClub.data;
		const selectedAgegroups = club.agegroups && club.agegroups.map(o => o.agegroup_id);

		return (
			<div className="agegroup-selector-wrapper">
				<div className="agegroup-selector">
					<Checkbox styled wide name="ageGroup" value={selectedAgegroups} options={agegroupList} onChange={this.handleInputChange} validation="required" />
				</div>
				<div className="form-group form-type-checkbox">
					<div>
						<Back className="button">Back</Back>
					</div>
					<div>
						<FormButton label="Save"/>
					</div>
				</div>
			</div>
		);
	}

	render() {
		return (
			<div id="content" className="site-content-inner">
				<PageTitle value="Age Groups" />
				<PageDescription>Select age groups you would like to be available for this club</PageDescription>
				<Form loader onSubmit={this.handleSubmit} ref={ref => this.refForm = ref}>
					{this.renderAgegroups()}
				</Form>
			</div>
		);
	}

}
