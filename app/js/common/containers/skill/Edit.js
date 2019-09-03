import React from 'react';
import { connect } from 'react-redux';
import { Form, Select, TextInput } from '@xanda/react-components';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { fetchData } from 'app/actions';
import { Back, FormButton, PageTitle } from 'app/components';

@connect((store, ownProps) => {
	return {
		skill: store.skill.collection[ownProps.params.skillId] || {},
	};
})
export default class Edit extends React.PureComponent {

	constructor(props) {
		super(props);

		this.skillId = this.props.params.skillId;

		this.state = {
			skillCategories: [],
		};
	}

	componentWillMount = async () => {
		this.props.dispatch(fetchData({
			type: 'SKILL',
			url: `/skills/${this.skillId}`,
		}));

		const skillCategories = await api.get('/dropdown/skill-categories');
		this.setState({
			skillCategories: skillCategories.data,
		});
	}

	handleInputChange = (name, value) => {
		this.setState({ [name]: value });
	}

	handleSubmit = async () => {
		const formData = {
			title: this.state.title,
			category_id: this.state.category,
		};

		const response = await api.update(`/skills/${this.skillId}`, formData);

		if (!api.error(response)) {
			fn.navigate(url.skill);
			this.props.dispatch({
				type:'OPEN_SNACKBAR_MESSAGE',
				option: {
					message:'Skill has been updated!',
					color:'dark'
				}
			})
		} else {
			this.refForm && this.refForm.hideLoader();
		}
	}

	render() {
		const { skillCategories } = this.state;
		const { skill } = this.props;

		return (
			<div id="content" className="site-content-inner">
				<PageTitle value="Update skill" />
				<Form loader onSubmit={this.handleSubmit} className="form-section" ref={ref => this.refForm = ref}>
					<TextInput
						className="tooltips"
						placeholder="Name"
						label="Name"
						name="title"
						onChange={this.handleInputChange}
						validation="required"
						value={skill.title}
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
						value={skill.category_id}
						prepend={<i className="ion-ios-bookmarks-outline"/>}
					/>

					<div className="form-actions">
						<Back className="button">Cancel</Back>
						<FormButton label="Save" />
					</div>
				</Form>
			</div>
		);
	}

}
