import React from 'react';
import PropTypes from 'prop-types';
import { TextInput } from '@xanda/react-components';

export default class RepeaterInput extends React.PureComponent {

	static propTypes = {
		defaultCount: PropTypes.number,
		disabled: PropTypes.bool,
		name: PropTypes.string.isRequired,
		onChange: PropTypes.func,
		placeholder: PropTypes.string,
		title: PropTypes.string,
		values: PropTypes.array,
	}

	static defaultProps = {
		defaultCount: 2,
		disabled: false,
		placeholder: 'Option',
		values: [],
	}

	constructor(props) {
		super(props);

		this.state = {};
	}

	componentDidMount() {
		this.generateOptions(this.props.values);
	}

	componentWillReceiveProps(nextProps) {
		// override state only if current props is empty but next props has value
		if (_.size(this.props.values) === 0 && _.size(nextProps.values) > 0) {
			this.generateOptions(nextProps.values);
		}
	}

	handleOptionChange = (id, name, value) => {
		this.setState((prevState) => {
			return {
				options: {
					...prevState.options,
					[`${this.props.name}${id}`]: {
						id,
						title: value,
					},
				},
			};
		}, () => {
			this.props.onChange && this.props.onChange(this.props.name, this.state.options);
		});
	}

	generateOptions = (values) => {
		let options = {};
		const valueCount = _.size(values);
		const count = valueCount || this.props.defaultCount;

		for (let i = 0; i < count; i++) {
			const id = i + 1;
			const title = values[i] ? values[i].value : '';
			const option = {
				[`${this.props.name}${id}`]: {
					id,
					title,
				},
			};
			options = _.assign({}, options, option);
		}

		this.setState((prevState) => {
			return {
				options,
				optionId: count,
				count: this.props.defaultCount,
			};
		}, () => {
			this.props.onChange && this.props.onChange(this.props.name, this.state.options);
		});
	}

	removeOption = (id) => {
		const options = _.pickBy(this.state.options, v => v.id != id);
		this.setState({
			count: this.state.count - 1,
			options,
		});
	}

	addOption = () => {
		const count = this.state.count + 1;
		const optionId = this.state.optionId + 1;
		this.setState((prevState) => {
			return {
				count,
				optionId,
				options: {
					...prevState.options,
					[`${this.props.name}${optionId}`]: { id: optionId },
				},
			};
		});
	}

	render() {
		const { count, disabled, title, type } = this.props;
		const { options } = this.state;

		let optionCount = 1;
		const optionSize = _.size(options);

		return (
			<div className="form-repeater-input">
				<div className="repeater-header">
					{title && <span className="repeater-title">{title}</span>}
				</div>
				<div className="repeater-outer">
					{options && _.map((options), (option) => {
						const placeholder = this.props.placeholder && `${this.props.placeholder} ${optionCount}`;
						const onClear = !disabled && optionSize > 1 ? () => this.removeOption(option.id) : null;
						optionCount++;
						return (
							<TextInput
								disabled={disabled}
								key={`option_${option.id}`}
								name="title"
								onChange={(key, value) => this.handleOptionChange(option.id, key, value)}
								onClear={onClear}
								placeholder={placeholder}
								value={option.title}
							/>
						);
					})}
					{!disabled && <span onClick={this.addOption}><i className="button-icon ion-plus-circled" /></span>}

				</div>
			</div>
		);
	}

}
