import React from 'react';
import { Form, Radio, Select, TextInput } from '@xanda/react-components';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { connect } from 'react-redux';
import { fetchData } from 'app/actions';
import { Back, ButtonStandard, FormButton, FormSection, PageDescription, PageTitle } from 'app/components';

@connect((store, ownProps) => {
	return {
		assessments: store.coachAssessment.collection[ownProps.params.assessmentId],
	};
})


export default class Add extends React.PureComponent {

	constructor(props) {
		super(props);
		this.assessmentId = this.props.params.assessmentId;
		this.state = {
			assessment: this.props.params.assessmentId,
			coachList: [],
			coachId: [],
			questions: [],
			templateList: [],
			editAnswers: [],
			answers: [],
		};

	}

	componentWillMount = async (currentPage = 1) => {
		this.props.dispatch(fetchData({
			type: 'COACH_ASSESSMENT',
			url: `/assessments/${this.assessmentId}`,
			page: currentPage,
		}));
		var template = this.props.assessments.assessment_id;

		const coachList = await api.get('/dropdown/coaches');
		const templateList = await api.get('/dropdown/coach-assessment-templates');
		const questionList = await api.get(`/assessments/${template}/questions`);
		const editAnswers = this.props.assessments.answers;
		this.setState({
			coach: this.props.assessments.coach_id,
			editAnswers: editAnswers,
			coachList: coachList.data,
			templateList: templateList.data,
			questions: questionList.data.questions,
		});
	}

	handleInputChange = (name, value) => {
		this.setState({ [name]: value });
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
		const {
			coach,
		} = this.state
		const { assessments} = this.props
		const answers = [];

		// loop through answers and create a preferred structure for API
		_.map(this.state.answers, (value, key) => {
			answers.push({ question_id: key, answer: value });
		})

		const formData = {
			answers,
			coach_id: coach,
			assessment_id: assessments.assessment_id
		}
		const relAssessmentUserId = assessments.id

		const response = await api.update(`/assessments/${relAssessmentUserId}`, formData)

		if (!api.error(response)) {
			fn.navigate(url.coachAssessment);
		} else {
			this.refForm && this.refForm.hideLoader();
		}
	}

	render() {
		const {
			coachList,
			editAnswers,
			questions,
			templateList
		} = this.state;
		console.log("State is; ", this.state)

		return (
			<div id="content" className="site-content-inner assessment">
				<PageTitle value="Assess a coach" />

				<PageDescription>Please select which Coach you would like to Assess and which Assessment template you would like to use.</PageDescription>

				<div className="page-actions">
					<ButtonStandard to={url.assessmentTemplate} icon={<i className="ion-filing" />}>Assessment templates</ButtonStandard>
				</div>

				<FormSection>
					<Form loader wide onSubmit={this.handleSubmit} ref={ref => this.refForm = ref}>
						<FormSection>
							<Select
								label="Coach"
								name="coach"
								onChange={this.handleInputChange}
								options={coachList}
								validation="required"
								value={this.props.assessments.coach_id}
								disabled
							/>
							<Select
								label="Assessment Form"
								name="assessment"
								onChange={this.handleTemplateChange}
								options={templateList}
								validation="required"
								value={this.props.assessments.assessment_id}
								disabled
							/>
						</FormSection>
						{questions && questions.length > 0 &&
						<FormSection className="assessment-form" title="Questions">
							{questions.map((question, index, editAnswers) => {
								console.log("Questiong is : ", question);
								console.log("Assesment is : ", this.props.assessments.answers);
								console.log("Index is : ", index);
								const InputTag = question.is_multiple_answers === 0 ? TextInput : Radio;
								const type = question.is_multiple_answers === 0 ? 'textarea' : null;
								let answer = this.props.assessments.answers && this.props.assessments.answers.length > 0  ? this.props.assessments.answers[index].answer : null;
								// let answer = null;
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
										value={answer}
									/>
								);
							})}
						</FormSection>
						}

						<div className="form-actions">
							<Back className="button">Cancel</Back>
							<FormButton label="Save" />
						</div>
					</Form>
				</FormSection>
			</div>
		);
	}

}
