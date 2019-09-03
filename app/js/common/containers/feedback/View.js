import React from 'react';
import { connect } from 'react-redux';
import { ContentLoader, Radio, TextInput } from '@xanda/react-components';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { fetchData } from 'app/actions';
import {
	Article,
	FormButton,
	Meta,
	MetaSection,
	PageTitle,
	Back
} from 'app/components';

@connect((store, ownProps) => {
	return {
		collection: store.feedback,
		feedback: store.feedback.collection[ownProps.params.feedbackId] || {},
	};
})
export default class View extends React.PureComponent {

	constructor(props) {
		super(props);

		this.feedbackId = this.props.params.feedbackId;

		this.state = {
			answers: {},
		};
	}

	componentWillMount() {
		this.props.dispatch(fetchData({
			type: 'FEEDBACK',
			url: `/feedbacks/${this.feedbackId}`,
		}));
	}

	handleInputChange = (name, value) => {
		this.setState((prevState) => {
			return {
				answers: {
					...prevState.answers,
					[name]: value,
				},
			};
		});
	}

	handleSubmit = async (event) => {
		event.preventDefault();
		const answers = [];
		let error = false

		// loop through answers and create a preferred structure for API
		_.map(this.state.answers, (value, key) => {
			if(!value){
				error = true
				this.setState({
					formError: true
				})
				return
			}
			answers.push({ question_id: key, answer: value });
		});

		if(error){
			return
		}

		const formData = {
			answers
		};

		const response = await api.post(`/feedbacks/${this.feedbackId}/answer`, formData);

		if (!api.error(response)) {
			fn.navigate(url.feedback);
			fn.showAlert('Feedback has been sent successfully!', 'success');
		}
	}

	renderForm = () => {
		const { feedback } = this.props;

		switch (fn.getUserRole()) {
			case 'admin':
				return (
					<div className="feedback-meta">
						<MetaSection title="Questions">
							{feedback.questions && feedback.questions.map((question, i) => {
								const renderAnswers = () => {

									// return if there is no answer
									if (question.answers.length === 0) {
										return 'No one answered this question';
									}

									// create stat if question has predefined answers
									if (question.is_multiple_answers === 1) {
										let totalAnsweredCount = 0;

										const answers = _.reduce(question.answers, (obj, value, key) => {
											const slug = fn.stringToSlug(value.title);
											const answerCount = obj[slug] ? obj[slug].answerCount : 0;
											obj[slug] = {
												title: value.title,
												answerCount: answerCount + 1,
											};
											totalAnsweredCount++;
											return obj;
										}, {});

										return (
											<ul>
												{_.map(answers, (answer, key) => {
													const ratio = answer.answerCount / totalAnsweredCount * 100;
													return (
														<li key={`answer_${question.question_id}${key}`}>{answer.title} {ratio}% ({answer.answerCount}/{totalAnsweredCount})</li>
													);
												})}
											</ul>
										);
									}

									// return free text answers
									return (
										<ul>
											{question.answers.map(answer => (
												<li key={`answer_${answer.answer_id}`}>{answer.title}</li>
											))}
										</ul>
									);
								};

								return (
									<div className="mt-20" key={`question_${question.question_id}`}>
										<h4>{i + 1}. {question.title}</h4>
										{renderAnswers()}
									</div>
								);
							})}
						</MetaSection>
					</div>
				);

			default:
				if (feedback.completed === 0) {
					return (
						<MetaSection title="Questions">
							<form className="form" onSubmit={this.handleSubmit}>
								{feedback.questions && feedback.questions.map((question) => {
									const InputTag = question.is_multiple_answers === 0 ? TextInput : Radio;
									const type = question.is_multiple_answers === 0 ? 'textarea' : null;
									return (
										<InputTag
											key={`question${question.question_id}`}
											type={type}
											textarea
											name={question.question_id}
											label={question.title}
											options={question.options}
											onChange={this.handleInputChange}
											wide
											validation="required"
										/>
									);
								})}

								{
									this.state.formError && <div className="form-error-message">Please answer all question.</div>
								}

								<div className="form-actions">
									<Back className="button">Go back</Back>
									<FormButton label="Send feedback" />
								</div>
							</form>
						</MetaSection>
					);
				}

				return (
					<MetaSection title="Answers">
						{
							feedback.answers &&
							feedback.answers.map(answer =>
								<Meta key={`answer_${answer.answer_id}`}
									  newLine
									  label={answer.question}
									  separator=""
									  value={answer.answer} />)
						}
					</MetaSection>
				);
		}
	}

	render() {
		const {
			collection,
			feedback,
		} = this.props;

		return (
			<div id="content" className="site-content-inner feedback-section">
				<PageTitle value={feedback.title || 'Feedback'} />

				<ContentLoader
					data={feedback.feedback_id}
					forceRefresh
					isLoading={collection.isLoading}
					notFound="No Data"
				>
					<Article>
						{/*{!fn.isAdmin() && <p><strong>Status: </strong> {feedback.completed === 1 ? 'Completed' : 'Pending'} </p>}*/}
						{this.renderForm()}
					</Article>
				</ContentLoader>
			</div>
		);
	}

}
