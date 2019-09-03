import React from 'react';
import { FileUpload, Form, Repeater, Select, TextInput } from '@xanda/react-components';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { Back, FormButton, PageTitle, Question } from 'app/components';

export default class Add extends React.PureComponent {

	constructor(props) {
		super(props);

		this.state = {
			teamList: [],
			questionIndex: 1,
		};
	}

	componentWillMount = async () => {
		const teamList = await api.get('/dropdown/teams/all');
		this.setState({
			teamList: teamList.data,
		});
	}

	handleInputChange = (name, value) => {
		this.setState({ [name]: value });
	}


	handleSubmit = async () => {
		const formData = new FormData();
		this.state.title && formData.append('title', this.state.title);
		this.state.team && formData.append('team_id', this.state.team);
		_.map(this.state.questions, (question, questionId) => {
			question.title && formData.append(`questions[${questionId}][title]`, question.title);
			question.pic && formData.append(`questions[${questionId}][image_url]`, question.pic);
			formData.append(`questions[${questionId}][is_multiple_answers]`, question.is_multiple_answers);

			question.is_multiple_answers && _.map(question.options, (option, optionId) => {
				option.title && formData.append(`questions[${questionId}][options][${optionId}][title]`, option.title);
			});
		});

		const response = await api.post('/homeworks', formData);

		if (!api.error(response)) {
			fn.navigate(url.homework);
			fn.showAlert('Homework has been created successfully!', 'success');
		} else {
			this.refForm && this.refForm.hideLoader();
		}
	}

	renderRowAppend = (option) => {
		if (option.is_multiple_answers == 1) {
			return (
				<Repeater
					name="options"
					className="answer-repeater"
					removeButton={<i className="ion-close" />}
					addButton={<span className="button add-question">Add Answer</span>}
				>
					<TextInput
						label="Answer"
						name="answer"
					/>
				</Repeater>
			);
		}

		return null;
	}


	render() {
		const { questionCount, questions, teamList } = this.state;
		const type = [
			{ title: 'Free Text', id: '0' },
			{ title: 'Multiple choice', id: '1' },
		];

		return (
			<div id="content" className="site-content-inner">
				<PageTitle value="Create homework" />
				<Form loader wide onSubmit={this.handleSubmit} ref={ref => this.refForm = ref}>
					<TextInput
						label="Title"
						name="title"
						onChange={this.handleInputChange}
						validation="required"
					/>
					<Select
						label="Team"
						name="team"
						onChange={this.handleInputChange}
						options={teamList}
						validation="required"
					/>
					{/* questions &&
						<div className="question-wrapper">
							{_.map((questions), question =>
								<Question
									pic
									key={`question_${question.id}`}
									data={question}
									count={questionCount}
									delete={this.deleteQuestion}
									onChange={this.handleQuestionChange}
								/>
							)}
							<span className="button add-question" onClick={this.addQuestion}>Add question</span>
						</div> */
					}

					<Repeater
						onChange={this.handleInputChange}
						name="questions"
						onRowAppend={this.renderRowAppend}
						className="answer-repeater-wrap"
						removeButton={<i className="ion-close" />}
						addButton={<span className="button">Add Question</span>}
					>
						<TextInput
							label={`Question ${this.state.questionIndex}`}
							name="title"
							validation="required"
						/>
						{/* <FileUpload
							label="Picture"
							name="pic"
							validation="required"
						/> */}
						<Select
							label="Answer Type"
							name="is_multiple_answers"
							options={type}
							validation="required"
						/>
					</Repeater>

					<div className="form-actions">
						<Back className="button" title="Are you sure you wish to delete?" confirm >Delete</Back>
						<FormButton label="Save" />
					</div>
				</Form>
			</div>
		);
	}

}
