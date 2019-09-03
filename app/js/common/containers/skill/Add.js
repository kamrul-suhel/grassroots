import React from 'react';
import { connect } from 'react-redux';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { Form, Select, TextInput } from '@xanda/react-components';
import { Back, FormButton, PageTitle } from 'app/components';

@connect((store, ownProps) => {
	return {
		skill: store.skill.collection[ownProps.params.skillId] || {}
	};
})
export default class Add extends React.PureComponent {

	constructor(props) {
		super(props);

		this.state = {
			skillCategories: [],
		};
	}

	componentWillMount = async () => {
		const skillCategories = await api.get('/dropdown/skill-categories');
		this.setState({
			skillCategories: skillCategories.data,
		});
	}

	handleInputChange = (name, value) => {
		this.setState({ [name]: value });
	}

	handleSubmit = async () => {
		const clubId = this.props.myClub.data.club_id;
		const formData = {
			title: this.state.title,
			category_id: this.state.category,
			club_id: clubId
		};

		const response = await api.post('/skills', formData);

		if (!api.error(response)) {
			fn.navigate(url.skill);
			this.props.dispatch({
				type:'OPEN_SNACKBAR_MESSAGE',
				option: {
					message:'Skill has been created!',
					color:'dark'
				}
			})
		} else {
			this.refForm && this.refForm.hideLoader();
		}
	}

	render() {
		const { skillCategories } = this.state;

		return (
			<div id="content" className="site-content-inner">
				<PageTitle value="Create skill" />
				<Form loader onSubmit={this.handleSubmit} className="form-section" ref={ref => this.refForm = ref}>
					<TextInput
						className="tooltips"
						placeholder="Name"
						label="Name"
						name="title"
						onChange={this.handleInputChange}
						validation="required"
						prepend={<i className="ion-person"/>}
					/>
					<Select
						className="tooltips"
						placeholder="Category"
						label="Category"
						name="category"
						onChange={this.handleInputChange}
						options={skillCategories}
						validation="required"
						prepend={<i className="ion-ios-bookmarks-outline"/>}
					/>

					<div className="form-actions">
						<Back className="button" confirm>Cancel</Back>
						<FormButton label="Save" />
					</div>
				</Form>
			</div>
		);
	}

}
