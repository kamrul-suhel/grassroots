import React from 'react';
import { connect } from 'react-redux';
import { ContentLoader, Radio, TextInput } from '@xanda/react-components';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { fetchData } from 'app/actions';
import { Article, FormButton, Meta, MetaSection, PageTitle } from 'app/components';

@connect((store, ownProps) => {
	return {
		collection: store.homework,
		homework: store.homework.collection[ownProps.params.homeworkId] || {},
	};
})
export default class View extends React.PureComponent {

	constructor(props) {
		super(props);

		this.playerId = this.props.params.playerId;
		this.homeworkId = this.props.params.homeworkId;

		this.state = {
			answers: {},
		};
	}

	componentWillMount() {
		const urlPlayerArg = this.playerId ? `?player_id=${this.playerId}` : '';

		this.props.dispatch(fetchData({
			type: 'HOMEWORK',
			url: `/homeworks/${this.homeworkId}${urlPlayerArg}`,
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

		// loop through answers and create a preferred structure for API
		_.map(this.state.answers, (value, key) => {
			answers.push({ question_id: key, answer: value });
		});

		const formData = {
			answers,
			player_id: this.playerId,
		};

		const response = await api.post(`/homeworks/${this.homeworkId}/answer`, formData);

		if (!api.error(response)) {
			fn.navigate(url.homework);
			fn.showAlert('Homework has been completed successfully!', 'success');
		}
	}

	renderForm = () => {
		const { homework } = this.props;

		switch (fn.getUserRole()) {
			case 'coach':
				return (
					<MetaSection title="Questions">
						{homework.questions && homework.questions.map((question, i) => {
							const renderAnswers = () => {

								// return if there is no answer
								if (question.answers.length === 0) {
									return <div><p>No one answered this question</p></div>;
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
								<div key={`question_${question.question_id}`} className="homework-entry">
									<h4>{i + 1}. {question.title}</h4>
									{question.image_url && <img src={question.image_url} />}
									{renderAnswers()}
								</div>
							);
						})}
					</MetaSection>
				);

			default:
				if (homework.completed === 0) {
					return (
						<MetaSection title="Questions">
							<form className="form" onSubmit={this.handleSubmit}>
								{homework.questions && homework.questions.map((question, i) => {
									const InputTag = question.is_multiple_answers === 0 ? TextInput : Radio;
									const type = question.is_multiple_answers === 0 ? 'textarea' : null;
									return (
										<div key={`question${question.question_id}`} className="homework-entry">
											<h4>{i + 1}. {question.title}</h4>
											{question.image_url && <img src={question.image_url} />}
											<InputTag
												textarea
												type={type}
												name={question.question_id}
												options={question.options}
												onChange={this.handleInputChange}
												wide
											/>
										</div>
									);
								})}
								<FormButton label="Complete homework" />
							</form>
						</MetaSection>
					);
				}

				return (
					<MetaSection title="Answers">
						{homework.answers && homework.answers.map((answer, i) => (
							<div key={`answer_${answer.answer_id}`} className="homework-entry">
								<h4>{i + 1}. {answer.question}</h4>
								{answer.image_url && <img src={answer.image_url} />}
								<p>{answer.answer}</p>
							</div>
						))}
					</MetaSection>
				);
		}
	}

	render() {
		const {
			collection,
			homework,
		} = this.props;

		return (
			<div id="content" className="site-content-inner">
				<PageTitle value={homework.title || 'Homework'} />
				<ContentLoader
					data={homework.homework_id}
					forceRefresh
					isLoading={collection.isLoading}
					notFound="No Data"
				>
					<Article className="section-homework">
						<Meta label="Title" value={homework.title} />
						{!fn.isCoach() && <Meta label="Status" value={homework.completed === 1 ? 'Completed' : 'Pending'} />}
						{this.renderForm()}
					</Article>
				</ContentLoader>
			</div>
		);
	}

}
