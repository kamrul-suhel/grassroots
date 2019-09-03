import React from 'react';
import PropTypes from 'prop-types';
import { TextInput } from '@xanda/react-components';

export default class MultipleInput extends React.PureComponent {
	static propTypes = {
		count: PropTypes.number,
		label: PropTypes.string,
		name: PropTypes.oneOfType([
			PropTypes.number,
			PropTypes.string,
		]),
		onChange: PropTypes.func,
		placeholder: PropTypes.array,
		prepend: PropTypes.string,
		values: PropTypes.object,
		wide: PropTypes.bool,
	}

	static defaultProps = {
		count: 2,
		placeholder: [],
		textarea: false,
		values: {},
		wide: false,
	}

	constructor(props) {
		super(props);

		this.state = {};
	}

	componentDidMount() {
		if (this.props.onChange) {
			let values = {};

			for (let i = 0; i < this.props.count; i++) {
				const id = i + 1;
				const value = this.props.values ? this.props.values[id] : '';
				values = {
					...values,
					[id]: value || '',
				};
			}

			this.setState((prevState) => {
				return { values }
			}, () => {
				this.props.onChange(this.props.name, this.state.values);
			});
		}
	}

	componentWillReceiveProps(nextProps) {
		// override state only if current props is empty but next props has value
		if (!this.props.values && nextProps.values) {
			this.props.onChange && this.props.onChange(this.props.name, nextProps.values);
			this.setState({ values: nextProps.values });
		}
	}



	handleChange = (name, value) => {
		this.setState((prevState) => {
			return {
				values: {
					...prevState.values,
					[name]: value,
				}
			}
		}, () => {
			this.props.onChange(this.props.name, this.state.values);
		});
	}

	renderInputs = () => {
		const { count, name, prepend } = this.props;
		const values = this.state ? this.state.values : undefined;
		const inputs = [];

		for (let i = 0; i < count; i++) {
			const placeholder = this.props.placeholder ? this.props.placeholder[i] : '';
			const id = i + 1;
			const key = `${name}${id}`;
			const value = values ? values[id] : '';

			inputs.push(
				<TextInput key={key} name={id} value={value || ''} placeholder={placeholder} prepend={prepend} onChange={this.handleChange} />
			);
		}

		return (
			<div className={`form-field-wrapper count-${count}`}>
				{inputs}
			</div>
		);
	}

	render() {
		const { label, wide, tooltips } = this.props;
		const wideClass = wide ? 'form-group-wide' : '';
		const tooltipsClass = tooltips && tooltips !== '' ? tooltips : '';

		return (
			<div className={`form-group ${tooltipsClass} ${wideClass} form-type-multiple-input`}>
				{label && <label className="form-label">{label}</label>}
				{this.renderInputs()}
			</div>
		);
	}
}
