import React from 'react';
import { Form, Radio, Select, TextInput } from '@xanda/react-components';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { Back, ButtonStandard, FormButton, FormSection, PageDescription, PageTitle } from 'app/components';
import {connect} from "react-redux";

@connect((store) => {
	return {
		assessments: store.coachAssessment,
	};
})

export default class Add extends React.PureComponent {

	constructor(props) {
		super(props);

		this.state = {
			coachList: [],
			questions: [],
			templateList: [],
			coach_id: null, 
		};
	}

	componentWillMount = async () => {
		const coachList = await api.get('/dropdown/coaches');
		const templateList = await api.get('/dropdown/coach-assessment-templates');
		this.setState({
			coachList: coachList.data,
			templateList: templateList.data,
		});
	}

	handleInputChange = (name, value) => {
		this.setState({ [name]: value });
	}

	handleTemplateChange = async (name, value) => {
		if (!value || value === this.state.assessment) {
			return false;
		}

		const templateList = await api.get(`/assessments/${value}/questions`);
		this.setState({
			[name]: value,
			answers: [],
			questions: templateList.data && templateList.data.questions,
		});
	}

	handleAnswerChange = (name, value) => {
		this.setState((prevState) => {
			return {
				answers: {
					...prevState.answers,
					[name]: value,
				},
			};
		});
	}

	handleSubmit = async () => {
		const answers = [];

		// loop through answers and create a preferred structure for API
		_.map(this.state.answers, (value, key) => {
			answers.push({ question_id: key, answer: value });
		});

		const formData = {
			answers,
			coach_id: this.state.coach,
			assessment_id: this.state.assessment,
		};

		const response = await api.post('/assessments', formData);

		if (!api.error(response)) {
			fn.navigate(url.coachAssessment);
		} else {
			this.refForm && this.refForm.hideLoader();
		}
	}

	render() {
		const { coachList, questions, templateList } = this.state;

		return (
			<div id="content" className="site-content-inner coach-assessment">
				<PageTitle value="Assess a coach" />

				<PageDescription>Please select which Coach you would like to Assess and which Assessment template you would like to use.</PageDescription>

				<div className="page-actions">
					<ButtonStandard to={`${url.assessmentTemplate}/add`}
									icon={<i className="ion-edit"/>}>Create New Form
					</ButtonStandard>
				</div>

				<FormSection>
					<Form loader
						  wide
						  onSubmit={this.handleSubmit}
						  className="form-section"
						  ref={ref => this.refForm = ref}>
						<Select
							className="tooltips"
							placeholder="Coach"
							label="Coach"
							name="coach"
							onChange={this.handleInputChange}
							options={coachList}
							validation="required"
							prepend={<i className="ion-person" />}
						/>
						<Select
							className="tooltips"
							placeholder="Assessment form"
							label="Assessment Form"
							name="assessment"
							onChange={this.handleTemplateChange}
							options={templateList}
							validation="required"
							prepend={<i className="ion-clipboard" />}
						/>
						{questions && questions.length > 0 &&
						<FormSection className="assessment-form" title="Questions">
							{questions.map((question) => {
								const InputTag = question.is_multiple_answers === 0 ? TextInput : Radio;
								const type = question.is_multiple_answers === 0 ? 'textarea' : null;
								return (
									<InputTag
										key={`question${question.question_id}`}
										textarea
										type={type}
										name={question.question_id}
										label={question.title}
										options={question.options}
										onChange={this.handleAnswerChange}
										wide
									/>
								);
							})}
						</FormSection>
						}

						<div className="form-actions">
							<Back className="button" showCloseButton={false} confirm>Cancel</Back>
							<FormButton label="Save" />
						</div>
					</Form>
				</FormSection>

			</div>
		);
	}

}
