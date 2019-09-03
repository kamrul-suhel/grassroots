import React from 'react';
import { connect } from 'react-redux';
import { Form, TextInput } from '@xanda/react-components';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { fetchData } from 'app/actions';
import { ConfirmDialog, FormButton, Link, PageTitle } from 'app/components';

@connect((store) => {
	return {
		skills: store.skill,
	};
})
export default class Skill extends React.PureComponent {

	constructor(props) {
		super(props);

		this.clubId = this.props.params.clubId;
		this.state = {
			newSkill: '',
			skillCategories: [],
			tabIndex: 0,
		};
	}

	componentWillMount = async () => {
		this.fetchData();

		const skillCategories = await api.get('/dropdown/skill-categories');
		this.setState({
			skillCategories: skillCategories.data,
		});
	}

	fetchData = () => {
		this.props.dispatch(fetchData({
			type: 'SKILL',
			url: `/clubs/${this.clubId}/skills`,
		}));
	}

	handleInputChange = (name, value) => {
		this.setState({ [name]: value });
	}

	handleSubmit = async (categoryId) => {
		const formData = {
			category_id: categoryId,
			club_id: this.clubId,
			title: this.state.newSkill,
		};

		this.refNewSkill.clear();

		const response = await api.post('/skills', formData);

		if (!api.error(response)) {
			this.props.dispatch({
				type:'OPEN_SNACKBAR_MESSAGE',
				option: {
					message:'Skill has been added',
					color:'dark'
				}
			})
			this.fetchData();
		}
	}

	getTabs = () => {
		const { skills } = this.props;
		const { skillCategories } = this.state;
		const header = [];
		const content = [];

		_.map(skillCategories, (skillCategory) => {
			const skillsByCategory = _.filter(skills.collection, { category_id: skillCategory.id });

			header.push(<Tab key={`tabHeader${skillCategory.id}`}>{skillCategory.title}<span className="count">{skillsByCategory.length}</span></Tab>);
			content.push(
				<TabPanel key={`tabContent${skillCategory.id}`}>
					<p className="tab-title">{skillCategory.title}<span className="count">{skillsByCategory.length}</span></p>
					<ul className="list">
						{skillsByCategory.length > 0 && skillsByCategory.map(skill => (
							<li key={`skill${skillCategory.id}${skill.skill_id}`}>
								<span className="title">{skill.title}</span>
								<ConfirmDialog
									showCloseButton={false}
									onConfirm={() => this.deleteData(skill.skill_id)}
									title=""
									body={
										<React.Fragment>
											<h3>Delete Skill</h3>
											<p>Are you sure you want to delete?</p>
										</React.Fragment>
									}>
									<i className="button-icon ion-android-close" />
								</ConfirmDialog>
							</li>
						))}
						<li className="add-item">
							<Form className="no-wrapper" onSubmit={() => this.handleSubmit(skillCategory.id)}>
								<TextInput name="newSkill" placeholder="Skill name" ref={ref => this.refNewSkill = ref}validation="required" onChange={this.handleInputChange} />
								{this.state.newSkill && this.state.newSkill.length > 0 && <button>Add</button>}
							</Form>
						</li>
					</ul>
				</TabPanel>
			);
		});

		return {
			header,
			content,
		};
	}

	deleteData = async (id) => {
		const response = await api.delete(`/skills/${id}`);

		if (!api.error(response)) {
			this.props.dispatch({
				type:'OPEN_SNACKBAR_MESSAGE',
				option: {
					message:'Skill has been deleted!',
					color:'dark'
				}
			})
			this.props.dispatch({ type: 'SKILL_CLEAR' });
			this.fetchData();
		}
	}

	onTabSelect = (index) => {
		this.setState({
			tabIndex: index,
		});
	}

	render() {
		const { fetchData, skills } = this.props;
		const tab = this.getTabs();

		return (
			<div id="content" className="site-content-inner">
				<PageTitle value="Skills" />

				<div className="form-wrapper">
					<div className="form-outer">
						<Tabs selectedIndex={this.state.tabIndex} onSelect={this.onTabSelect}>
							<TabList>
								{tab.header}
							</TabList>

							{tab.content}
						</Tabs>

						<div className="age-group-buttons">
							<Link to={`${url.club}/${this.clubId}`} className="button" onClick={fetchData}>Back</Link>
							<Link to={`${url.club}/${this.clubId}`} className="button" onClick={fetchData}>Done</Link>
						</div>
					</div>
				</div>

			</div>
		);
	}

}
