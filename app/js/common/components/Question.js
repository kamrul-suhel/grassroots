import React from 'react';
import PropTypes from 'prop-types';
import { FileUpload, Repeater, Select, TextInput } from '@xanda/react-components';
import { RepeaterInput } from './';

export default class Question extends React.PureComponent {

	static propTypes = {
		data: PropTypes.object,
		type: PropTypes.array,
		pic: PropTypes.bool,
	}

	static defaultProps = {
		pic: false,
		type: [
			{ title: 'Free Text', id: '0' },
			{ title: 'Multiple choice', id: '1' },
		],
	}

	handleInputChange = (name, value) => {
		this.props.onChange(this.props.data.id, name, value);
	}

	foo = (name, value) => {
	}

	renderAppend = (index, state) => {

		if (state.is_multiple_answers == 1) {
			return (
				<Repeater 
					className="answer-repeater"
					removeButton="X"
				>
					<TextInput
						label="Question"
						name="title"
						onChange={this.handleInputChange}
					/>
				</Repeater>)
		}

		return null;
	}

	render() {
		const { count, data, index, pic, type } = this.props;
		const isMultipleAnswers = data.is_multiple_answers ? data.is_multiple_answers.toString() : '0';

		return (
			<Repeater 
				onChange={this.foo} 
				name="name"
				append={this.renderAppend}
				className="answer-repeater-wrap"
				removeButton={<i className="ion-close" />}
				addButton={<span className="button">Add Section</span>}
			>
				<TextInput
					label="Question"
					name="title"
					onChange={this.handleInputChange}
				/>
				<Select
					label="Answer Type"
					name="is_multiple_answers"
					onChange={this.handleInputChange}
					options={type}
					value={isMultipleAnswers}
				/>
			</Repeater>
		);


		return (
			<div className="question" key={`question_${data.id}`}>
				<div className="question-header">
					<span className="question-title">Question {index}</span>
					{count > 1 && <span onClick={this.deleteQuestion}><i className="button-icon ion-trash-b" /></span>}
				</div>

				<div className="question-inner">
					<TextInput
						label="Question"
						name="title"
						onChange={this.handleInputChange}
					/>
					<Select
						label="Answer Type"
						name="is_multiple_answers"
						onChange={this.handleInputChange}
						options={type}
						value={isMultipleAnswers}
					/>
					{pic &&
						<FileUpload
							label="Image"
							name="pic"
							onChange={this.handleInputChange}
							prepend={<i className="ion-android-upload" />}
							validation="file|max:1000"
						/>
					}
				</div>

				{data.is_multiple_answers == 10 &&
					<RepeaterInput
						name="options"
						onChange={this.handleInputChange}
						placeholder="Answer"
						title="Answers"
					/>
				}

				{data.is_multiple_answers == 1 &&
					<Repeater
						addButton="Add size"
						addButtonPosition="top"
						count={2}
						name="options"
						onChange={this.handleInputChange}
						removeButton={<i className="button-icon ion-android-close" />}
						title="Answers"
					>
						<TextInput wide name="title" placeholder="Answer" />
					</Repeater>
				}
			</div>
		);
	}

}
